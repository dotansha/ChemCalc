
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
- [Version 1.3] (# What's New in Version 1.3)
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
## What's New in Version 1.3
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
