#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const htmlPath = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");
const scripts = Array.from(html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)).map((match) => match[1]);
const appScript = scripts.find((script) => script.includes("const atomicWeights") && script.includes("function parseFormula"));

if (!appScript) {
  throw new Error("Could not find the main ChemCalc script block in index.html");
}

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
  setTimeout: (callback) => {
    callback();
    return 0;
  },
  clearTimeout: () => {}
};
context.window = context;

vm.createContext(context);
vm.runInContext(
  `${appScript}\nthis.__chemcalcExports = { parseFormula, commonIonCharges, compoundNameToFormulaMap, commonCompounds };`,
  context
);

const {
  parseFormula,
  commonIonCharges,
  compoundNameToFormulaMap,
  commonCompounds
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

console.log(`ChemCalc smoke tests passed: ${neutralMatrix.length + ambiguousMatrix.length + requiredChargeEntries.length} charge assertions + ${commonCompounds.length} suggestion checks.`);
