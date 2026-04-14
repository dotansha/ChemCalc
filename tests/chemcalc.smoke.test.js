#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const htmlPath = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");
const guideHtml = fs.readFileSync(path.join(__dirname, "..", "guide.html"), "utf8");
const scripts = Array.from(html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)).map((match) => match[1]);
const appScript = scripts.find((script) => script.includes("const atomicWeights") && script.includes("function parseFormula"));

if (!appScript) {
  throw new Error("Could not find the main ChemCalc script block in index.html");
}

const cspMetaMatch = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i);
assert.ok(cspMetaMatch, "Expected a CSP meta tag in index.html");
const cspContent = cspMetaMatch[1];
assert.ok(cspContent.includes("object-src 'none'"), "CSP should explicitly disable plugin objects");
assert.ok(!/frame-src\s+https:\s*;/.test(cspContent), "CSP should not allow all HTTPS frame sources");
assert.ok(!/connect-src\s+'self'\s+https:\s*;/.test(cspContent), "CSP should not allow all HTTPS connect sources");

assert.ok(!html.includes("tree/Publish"), "Footer link should not point to the retired Publish branch");
assert.ok(
  html.includes('href="https://github.com/dotansha/ChemCalc"'),
  "Footer should link to the ChemCalc repository root"
);
["presetToolsSection", "copyShareLinkBtn", "bufferCalculatorSection", "calculateBufferBtn", "bufferPreset"].forEach((requiredId) => {
  assert.ok(html.includes(`id="${requiredId}"`), `Expected UI element with id="${requiredId}"`);
});
[
  "What ChemCalc Helps You Do",
  "How To Use The Main Calculator",
  "Worked Examples",
  "Calculation Notes And Limitations",
  "Frequently Asked Questions"
].forEach((requiredHeading) => {
  assert.ok(html.includes(requiredHeading), `Expected editorial section heading "${requiredHeading}"`);
});
assert.ok(html.includes('class="content-section ad-support"'), "Expected a dedicated support/ad content block");
const adSupportIndex = html.indexOf('class="content-section ad-support"');
const footerIndex = html.indexOf("<footer>");
assert.ok(adSupportIndex !== -1 && footerIndex !== -1 && adSupportIndex < footerIndex, "Ad support block should appear before the footer");
assert.ok(html.includes('href="guide.html"'), "Expected the main page footer to link to the lab prep guide");
assert.ok(guideHtml.includes("ChemCalc Lab Preparation Guide"), "Expected the standalone lab prep guide content page");
const bufferSectionIndex = html.indexOf('id="bufferCalculatorSection"');
const presetSectionIndex = html.indexOf('id="presetToolsSection"');
assert.ok(bufferSectionIndex !== -1 && presetSectionIndex !== -1 && bufferSectionIndex < presetSectionIndex, "Expected the buffer section to appear before the presets/history/share section");

function createClassList() {
  const classes = new Set();
  return {
    add: (...names) => names.forEach((name) => classes.add(name)),
    remove: (...names) => names.forEach((name) => classes.delete(name)),
    contains: (name) => classes.has(name)
  };
}

function createElementStub() {
  return {
    value: "",
    textContent: "",
    innerHTML: "",
    className: "",
    classList: createClassList(),
    style: {},
    dataset: {},
    children: [],
    disabled: false,
    addEventListener() {},
    removeEventListener() {},
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    removeChild(child) {
      this.children = this.children.filter((entry) => entry !== child);
    },
    contains() {
      return false;
    },
    focus() {},
    select() {},
    dispatchEvent() {},
    scrollIntoView() {}
  };
}

const elementCache = new Map();
const documentStub = {
  body: createElementStub(),
  getElementById(id) {
    if (!elementCache.has(id)) {
      elementCache.set(id, createElementStub());
    }
    return elementCache.get(id);
  },
  querySelector() {
    return createElementStub();
  },
  querySelectorAll() {
    return [];
  },
  addEventListener() {},
  createElement() {
    return createElementStub();
  },
  createDocumentFragment() {
    return createElementStub();
  },
  execCommand() {
    return false;
  }
};

function EventStub(type, init = {}) {
  this.type = type;
  this.bubbles = Boolean(init.bubbles);
  this.cancelable = Boolean(init.cancelable);
}

const context = {
  console,
  document: documentStub,
  Event: EventStub,
  URLSearchParams,
  location: {
    origin: "https://dotansha.github.io",
    pathname: "/ChemCalc/",
    search: ""
  },
  setTimeout: (callback) => {
    callback();
    return 0;
  },
  clearTimeout: () => {}
};
context.window = context;

vm.createContext(context);
vm.runInContext(
  `${appScript}\nthis.__chemcalcExports = { parseFormula, commonIonCharges, compoundNameToFormulaMap, commonCompounds, encodeShareState, decodeShareState, buildShareableUrlFromState, calculateBufferPlan, getBufferPresetConfig, applyBufferPreset };`,
  context
);

const {
  parseFormula,
  commonIonCharges,
  compoundNameToFormulaMap,
  commonCompounds,
  encodeShareState,
  decodeShareState,
  buildShareableUrlFromState,
  calculateBufferPlan,
  getBufferPresetConfig,
  applyBufferPreset
} = context.__chemcalcExports;

const requiredChargeEntries = [
  ["BrO3", -1],
  ["AsO3", -3],
  ["C2H3O2", -1]
];

requiredChargeEntries.forEach(([ion, expectedCharge]) => {
  assert.strictEqual(
    commonIonCharges[ion],
    expectedCharge,
    `Expected ion ${ion} to have charge ${expectedCharge}, got ${commonIonCharges[ion]}`
  );
});

function getChargeSummary(formula) {
  const parsed = parseFormula(formula);
  assert.strictEqual(parsed.unknownElements.length, 0, `Unexpected parse errors for ${formula}: ${parsed.unknownElements.join(", ")}`);

  let totalCharge = 0;
  let hasAmbiguousCharge = false;
  const unlistedIons = [];
  for (const part of parsed.parsedStructure) {
    if (part.type === "text") {
      continue;
    }
    const chargeInfo = commonIonCharges[part.symbol];
    if (chargeInfo === undefined) {
      unlistedIons.push(part.symbol);
      continue;
    }
    if (Array.isArray(chargeInfo)) {
      hasAmbiguousCharge = true;
      continue;
    }
    totalCharge += chargeInfo * part.count;
  }

  return { totalCharge, hasAmbiguousCharge, unlistedIons };
}

const neutralMatrix = [
  "NaCl",
  "CaCl2",
  "NH4Cl",
  "NaHCO3",
  "KBrO3",
  "MgSO4",
  "H3PO4",
  "Na2HPO4",
  "NaH2PO4",
  "Na2SO4·10H2O"
];

neutralMatrix.forEach((formula) => {
  const { totalCharge, hasAmbiguousCharge, unlistedIons } = getChargeSummary(formula);
  assert.strictEqual(unlistedIons.length, 0, `Unlisted ions found for ${formula}: ${unlistedIons.join(", ")}`);
  assert.strictEqual(hasAmbiguousCharge, false, `Unexpected ambiguous charge for ${formula}`);
  assert.strictEqual(totalCharge, 0, `Expected net charge 0 for ${formula}, got ${totalCharge}`);
});

const ambiguousMatrix = ["FeCl2", "CuCl2"];
ambiguousMatrix.forEach((formula) => {
  const { hasAmbiguousCharge } = getChargeSummary(formula);
  assert.strictEqual(hasAmbiguousCharge, true, `Expected ambiguous charge detection for ${formula}`);
});

const hydrateNotationPairs = [
  ["CuSO4·5H2O", "CuSO4.5H2O"],
  ["Na2CO3·10H2O", "Na2CO3.10H2O"]
];

hydrateNotationPairs.forEach(([canonicalNotation, dotNotation]) => {
  const canonicalParsed = parseFormula(canonicalNotation);
  const dotParsed = parseFormula(dotNotation);
  assert.strictEqual(
    canonicalParsed.unknownElements.length,
    0,
    `Unexpected parse errors for ${canonicalNotation}: ${canonicalParsed.unknownElements.join(", ")}`
  );
  assert.strictEqual(
    dotParsed.unknownElements.length,
    0,
    `Expected dot hydrate notation to parse for ${dotNotation}: ${dotParsed.unknownElements.join(", ")}`
  );
  assert.ok(
    Math.abs(canonicalParsed.weight - dotParsed.weight) < 1e-9,
    `Expected equivalent hydrate weights for ${canonicalNotation} and ${dotNotation}`
  );
});

const shareState = {
  originalFormula: "NaCl",
  replacementFormula: "KCl",
  amount: "100",
  unit: "mg",
  bufferPreset: "pbs",
  bufferPka: "7.21",
  bufferTargetPh: "7.40"
};
const encodedShare = encodeShareState(shareState);
assert.ok(encodedShare.includes("o=NaCl"), "Encoded share payload should include original formula");
const decodedShare = decodeShareState(`?${encodedShare}`);
assert.strictEqual(decodedShare.originalFormula, "NaCl", "Decoded share payload should restore original formula");
assert.strictEqual(decodedShare.bufferPreset, "pbs", "Decoded share payload should restore buffer preset");
assert.strictEqual(decodedShare.bufferTargetPh, "7.40", "Decoded share payload should restore buffer pH");
const shareUrl = buildShareableUrlFromState(shareState);
assert.ok(
  shareUrl.startsWith("https://dotansha.github.io/ChemCalc/?"),
  `Share URL should be rooted to current page path, got ${shareUrl}`
);

const bufferPlan = calculateBufferPlan({
  pKa: "7.21",
  targetPh: "7.40",
  totalConcValue: "50",
  totalConcUnit: "mM",
  finalVolumeValue: "500",
  finalVolumeUnit: "mL",
  acidMw: "136.09",
  baseMw: "158.96",
  acidName: "NaH2PO4",
  baseName: "Na2HPO4"
});
assert.ok(!bufferPlan.error, `Expected valid buffer plan, got error: ${bufferPlan.error}`);
assert.strictEqual(bufferPlan.acidName, "NaH2PO4", "Buffer plan should retain acid component label");
assert.strictEqual(bufferPlan.baseName, "Na2HPO4", "Buffer plan should retain base component label");
assert.ok(
  Math.abs((bufferPlan.acidConcM + bufferPlan.baseConcM) - 0.05) < 1e-12,
  "Buffer concentrations should sum to total concentration in M"
);
assert.ok(
  Math.abs((bufferPlan.acidMoles + bufferPlan.baseMoles) - 0.025) < 1e-12,
  "Buffer moles should sum to total moles for the target volume"
);
assert.ok(bufferPlan.acidMassG > 0 && bufferPlan.baseMassG > 0, "Buffer plan should compute masses when MW values are provided");

const invalidBufferPlan = calculateBufferPlan({
  pKa: "",
  targetPh: "7.4",
  totalConcValue: "50",
  totalConcUnit: "mM",
  finalVolumeValue: "500",
  finalVolumeUnit: "mL",
  acidMw: "",
  baseMw: ""
});
assert.ok(invalidBufferPlan.error, "Invalid buffer inputs should return an error message");

const pbsPreset = getBufferPresetConfig("pbs");
assert.strictEqual(pbsPreset.pKa, 7.21, "PBS preset should expose phosphate pKa");
assert.strictEqual(pbsPreset.acidName, "NaH2PO4 (monobasic)", "PBS preset acid label mismatch");
assert.strictEqual(pbsPreset.baseName, "Na2HPO4 (dibasic)", "PBS preset base label mismatch");

applyBufferPreset("tris", { forceValues: true });
const trisPka = parseFloat(documentStub.getElementById("bufferPka").value);
const trisAcidMw = parseFloat(documentStub.getElementById("bufferAcidMW").value);
const trisBaseMw = parseFloat(documentStub.getElementById("bufferBaseMW").value);
assert.ok(Math.abs(trisPka - 8.06) < 1e-12, "Tris preset should auto-fill pKa 8.06");
assert.ok(Math.abs(trisAcidMw - 157.6) < 1e-12, "Tris preset should auto-fill Tris-HCl MW");
assert.ok(Math.abs(trisBaseMw - 121.14) < 1e-12, "Tris preset should auto-fill Tris base MW");
assert.ok(
  documentStub.getElementById("bufferAcidMwLabel").textContent.includes("Tris-HCl"),
  "Tris preset should update acid MW label"
);
assert.ok(
  documentStub.getElementById("bufferBaseMwLabel").textContent.includes("Tris base"),
  "Tris preset should update base MW label"
);

commonCompounds.forEach((suggestion) => {
  const lower = suggestion.toLowerCase();
  const hasNameMapping = Boolean(compoundNameToFormulaMap[lower]);
  const parsed = parseFormula(suggestion);
  const isFormula = parsed.unknownElements.length === 0 && parsed.weight > 0;
  assert.ok(
    hasNameMapping || isFormula,
    `Suggestion "${suggestion}" is neither mapped by name nor parseable as formula`
  );
});

const chargeAssertions = neutralMatrix.length + ambiguousMatrix.length + requiredChargeEntries.length;
const metadataAssertions = 10;
const featureAssertions = 16;
console.log(
  `ChemCalc smoke tests passed: ${chargeAssertions} charge assertions + ${hydrateNotationPairs.length} hydrate notation checks + ${commonCompounds.length} suggestion checks + ${metadataAssertions} metadata checks + ${featureAssertions} feature checks.`
);
