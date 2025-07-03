
---

# ChemCalc

*A web site that makes basic chemical calculations often used in biology and biotechnology labs.*

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Audience](#audience)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [Version_1.3](#Version_1.3)
- [Version_1.5](#Version_1.5)
- [Version_1.6](#Version_1.6)
- [License](#license)
- [Contact](#contact)

---

## Overview

**ChemCalc** is a free and user-friendly web tool designed to help users perform basic chemical calculations frequently required in biology and biotechnology laboratories. With a modern interface and responsive design, ChemCalc streamlines common solution and reagent calculations for educational, research, and practical lab work.

---

## Features

- Calculate and convert between chemical formulas, units, and concentrations
- Solution preparation calculators (molarity, dilution, volume, etc.)
- Supports hydrated compounds and ion conservation
- Instant feedback and helpful suggestions for common compounds
- Designed for clarity, ease of use, and accessibility

---

## Audience

ChemCalc is useful for:
- **Students** learning laboratory chemistry and biochemistry
- **Researchers** preparing reagents for experiments
- **Lab Technicians** needing quick and accurate chemical calculations
- **Educators** seeking a teaching aid for chemical concepts

---

## Getting Started

### Requirements

ChemCalc is a standalone HTML application. You only need a modern web browser.

### Running Locally

1. **Clone or download this repository:**
    ```bash
    git clone https://github.com/dotansha/ChemCalc.git
    ```
2. **Open `ChemCalc_v1_0.html` in your browser:**
    - Double-click the file, or
    - Open it with your browser of choice

No installation or dependencies required.

---

## Usage

1. Enter the original and replacement chemical formulas in the provided fields.
2. Specify amounts, units, molarity, and volume as needed.
3. Use the built-in calculators for dilution and solution preparation.
4. Review results and suggestions directly on the page.

*Tooltips and instructions are available within the app interface.*

---

## Contributing

Contributions are welcome! Please open an issue or pull request with suggestions or improvements.

---
## Version_1.3
## What's New in ChemCalc v1.3 (compared to ChemCalc v1.0)
Version 1.3 is a major update focused on user experience and intelligent input, making the calculator faster, more intuitive, and more powerful to use.

✨ Key Features & Improvements
Intelligent Name-to-Formula Translation:
You can now type common chemical names (e.g., "Sodium chloride" or "Iron(II) Sulfate Heptahydrate") directly into the formula fields. The application will instantly recognize the complete name and automatically replace it with its corresponding chemical formula (e.g., "NaCl" or "FeSO₄·7H₂O").

Smarter "Patient" Validation:
The annoying bug that showed "unrecognized letter" errors while in the middle of typing a known chemical name has been eliminated. The real-time validation is now smart enough to recognize when you are typing a name from the library and will patiently wait for you to finish, providing a much smoother input experience.

Enhanced UI & Accessibility:
The main "Analyze Compounds" and "Clear All" buttons are now available in three convenient locations on the page:

Directly under the compound input boxes.
After the solution parameters section.
In their original position at the bottom of the main panel. All three button sets are always perfectly in sync.
Expanded Chemical Library:
The internal dictionary of common compounds and their corresponding ion charges has been significantly updated from a new library of materials. This improves the accuracy of suggestions, calculations, and the new name-to-formula feature.

🛠️ Technical Refinements
JavaScript Refactoring: The core logic for handling button clicks was refactored from using unique id attributes to a more robust and scalable class-based system.
Modern Event Handling: The application now uses a single, universal event listener (event delegation) to efficiently manage all user actions on the main buttons, replacing multiple individual listeners.

---
## Version_1.5
## What's New in ChemFormulator v1.5 (compared to ChemCalc v1.3)

ChemFormulator v1.5 is a major upgrade from v1.3, bringing both user experience enhancements and functional improvements. Below is a summary of the most important changes and new features:

### 1. **Project Renaming & Branding**
- **New Name:** The tool is now called **ChemFormulator** instead of ChemCalc.
- **Updated Branding:** All titles, headers, and footers in the UI and code have been updated to reflect the new name.

### 2. **User Interface & Usability**
- **Hydration Controls:**
  - v1.3: Only a “+H₂O” button for adding hydration was available.
  - v1.5: Now includes both “+H₂O” (add) **and** “-H₂O” (remove) buttons for fine-tuned control over hydrate numbers in formulas.
  - Hydration buttons have improved styling and positioning for usability.
- **Improved Suggestions Panel:**
  - Suggestions for compound names now appear **inside** the formula input box instead of below, for better accessibility.
  - Increased the number of suggestions shown (from 5 to 8).
  - More robust click handling and closing of suggestions when clicking elsewhere.
- **Footer & Metadata:**
  - Footer and contact/feedback links updated to reflect the new tool name and version.
  - Footer now always displays the correct version and project name.

### 3. **Compound Input & Analysis**
- **Original/Replacement Compound Handling:**
  - v1.3 required both original and replacement compounds to be filled for analysis.
  - v1.5 allows users to analyze just the original compound (e.g., molarity, moles, or mass calculations) without specifying a replacement.
  - If only the original compound is provided, ChemFormulator computes and displays its moles and molar mass.
- **Formula Validation & Feedback:**
  - Input validation logic is more robust and tolerant, with improved error messages.
  - Validation now correctly handles partial names and auto-fills formulas from known compound names.

### 4. **Calculation Logic Enhancements**
- **Flexible Analysis Flow:**
  - v1.5 allows users to analyze the original, then optionally proceed to replacement calculations if a replacement is provided.
- **Calculation Result Details:**
  - When only original compound is entered, result panel shows calculated moles and molar mass.
  - Replacement calculation panel now also shows moles of the original compound for transparency.
- **Consistent Button Logic:**
  - Unified action buttons for "Analyze" and "Calculate" with smart disabling/enabling based on user input and context.
  - Button text and state update automatically depending on whether an ion is selected and which step the user is on.

### 5. **Hydration Handling & Edge Cases**
- **Hydration Subtraction:**  
  - v1.5 introduces the ability to decrease or remove hydration numbers from formulas, not just add.
  - Hydration parsing logic improved for more accurate handling of edge cases.
- **Formula Normalization:**  
  - Improved digit normalization and parsing for subscripts and superscripts for more robust formula entry.

### 6. **Minor and Cosmetic Improvements**
- **UI Polishing:**  
  - Margin and padding tweaks for a cleaner appearance.
  - Improved alignment and style consistency across sections.
  - Streamlined feedback and error styling.
- **Accessibility:**  
  - All suggestion items are now clickable even if the user types quickly or clicks during rendering.
- **Compound Database:**  
  - Updates and corrections to the compound name-to-formula mapping for better coverage and accuracy.

---
## Version_1.6

What's New in Version 1.6
Version 1.6 introduces a complete overhaul of the Solution Dilution Calculator, transforming it from a simple tool into a powerful, live, and user-friendly utility that provides instant feedback.

✨ Key Features & Improvements
Live Calculations 🔢: The dilution calculator is now fully interactive. Results for the "Volume of Stock to Add" are updated instantly as you type, eliminating the need to press a "Calculate" button and providing a much faster workflow.

Modern & Intuitive GUI ✨: The entire user interface for the dilution calculator has been redesigned to be clearer and more professional.

The most important result is now displayed prominently at the top in a highlighted box.

Inputs are logically grouped into "Stock Solution" and "Final Solution" sections.

A secondary result now automatically calculates the required "Volume of Diluent to Add", a common source of error when performing dilutions manually.

Expanded Unit Support ⚖️: The calculator is no longer limited to molar concentrations. You can now perform dilutions using common weight-based concentration units, including:

mg/mL

µg/mL

ng/mL

Robust Error Handling 🛡️: The new interface provides clear, real-time error messages. It will now prevent calculations if the stock and final units are incompatible (e.g., molar vs. mass-based) or if the stock concentration is lower than the final concentration.

Browser Compatibility Fix 🐞: A stubborn CSS bug that caused unit selection boxes (M, mM, etc.) to appear cropped in Chrome has been fixed, ensuring a consistent and polished look across different browsers.
--

**Summary:**  
ChemFormulator v1.5 is a more flexible, robust, and user-friendly chemistry calculator, with expanded functionality for working with hydrates, improved analysis flow, and a more modern interface. It is ideal for both quick checks and more complex reagent conversions.
---
## License

This project is licensed under the Apache License 2.0.  
See the [LICENSE](LICENSE) file for details.

---

## Contact

- **Feedback / Issues:** Please use the [GitHub Issues](https://github.com/dotansha/ChemCalc/issues) page.
- **Author:** [dotansha](https://github.com/dotansha)

---

*ChemCalc is provided for educational and research purposes only. Always verify calculations independently for critical applications.*

---
