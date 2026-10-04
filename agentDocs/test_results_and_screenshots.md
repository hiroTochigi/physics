# E2E Test Execution & UI Visual Improvements Report

## 1. Test Execution Summary

All Playwright E2E tests were executed and passed successfully. A dedicated screenshot capture pipeline was configured to capture the state of the simulator for every test.

| Test ID | Test Category | Description | Status | Screenshot File |
| :--- | :--- | :--- | :---: | :--- |
| **TC-DOM-01** | UI & HUD | Initial render of canvas, HUD values, and charges | **PASS** | [`TC-DOM-01.png`](file:///C:/Users/drago/projects/physics/test-screenshots/TC-DOM-01.png) |
| **TC-DOM-02** | Controls | Preset configuration switching (Attract / Repel / Ratio / Reset) | **PASS** | [`TC-DOM-02.png`](file:///C:/Users/drago/projects/physics/test-screenshots/TC-DOM-02.png) |
| **TC-DOM-03** | Controls | Charge sign inversion toggle ($\pm$ inversion) | **PASS** | [`TC-DOM-03.png`](file:///C:/Users/drago/projects/physics/test-screenshots/TC-DOM-03.png) |
| **TC-DOM-04** | Controls | Slider continuous charge adjustments | **PASS** | [`TC-DOM-04.png`](file:///C:/Users/drago/projects/physics/test-screenshots/TC-DOM-04.png) |
| **TC-DOM-05** | Controls | Quick charge buttons and neutral particle state ($q=0$) | **PASS** | [`TC-DOM-05.png`](file:///C:/Users/drago/projects/physics/test-screenshots/TC-DOM-05.png) |
| **TC-DOM-06** | Controls | Display toggles (Grid and Force Vectors) | **PASS** | [`TC-DOM-06.png`](file:///C:/Users/drago/projects/physics/test-screenshots/TC-DOM-06.png) |
| **TC-CANVAS-01** | Physics | Inverse square law: force increases rapidly as distance closes | **PASS** | [`TC-CANVAS-01.png`](file:///C:/Users/drago/projects/physics/test-screenshots/TC-CANVAS-01.png) |
| **TC-CANVAS-02** | Physics | Inverse square law: force diminishes as distance increases | **PASS** | [`TC-CANVAS-02.png`](file:///C:/Users/drago/projects/physics/test-screenshots/TC-CANVAS-02.png) |
| **TC-CANVAS-03** | Physics | Newton's Third Law (action-reaction: $\vec{F}_{12} = -\vec{F}_{21}$) | **PASS** | [`TC-CANVAS-03.png`](file:///C:/Users/drago/projects/physics/test-screenshots/TC-CANVAS-03.png) |
| **TC-CANVAS-04** | Physics | Boundary constraint enforcement during drag | **PASS** | [`TC-CANVAS-04.png`](file:///C:/Users/drago/projects/physics/test-screenshots/TC-CANVAS-04.png) |
| **TC-MODE-01** | Multi-Mode | Header tab switching between Coulomb and Poynting modes | **PASS** | Automated Playwright Verification |
| **TC-MODE-02** | Poynting 3D/2D | Multi-view (3D / 2D slice / split) switching and HUD values | **PASS** | Automated Playwright Verification |
| **TC-MODE-03** | Poynting UX | KaTeX mathematical equation ⇄ Intuitive Japanese toggle | **PASS** | Automated Playwright Verification |
| **TC-MODE-04** | Poynting Learning | 4-step inquiry scenario walkthrough and challenge grading | **PASS** | Automated Playwright Verification |
| **TC-MODE-05** | Routing | URL query deep-linking (`/?mode=poynting`) direct mount | **PASS** | Automated Playwright Verification |

---

## 2. Test Screenshot Gallery

````carousel
![TC-DOM-01: Initial Display](../test-screenshots/TC-DOM-01.png)
<!-- slide -->
![TC-DOM-02: Preset Configurations](../test-screenshots/TC-DOM-02.png)
<!-- slide -->
![TC-DOM-03: Sign Inversion Toggle](../test-screenshots/TC-DOM-03.png)
<!-- slide -->
![TC-DOM-04: Slider Value Adjustment](../test-screenshots/TC-DOM-04.png)
<!-- slide -->
![TC-DOM-05: Neutral State (q=0)](../test-screenshots/TC-DOM-05.png)
<!-- slide -->
![TC-DOM-06: Grid & Vector Toggles](../test-screenshots/TC-DOM-06.png)
<!-- slide -->
![TC-CANVAS-01: Drag Closer (Force Surge)](../test-screenshots/TC-CANVAS-01.png)
<!-- slide -->
![TC-CANVAS-02: Drag Away (Force Decay)](../test-screenshots/TC-CANVAS-02.png)
<!-- slide -->
![TC-CANVAS-03: Action-Reaction Equilibrium](../test-screenshots/TC-CANVAS-03.png)
<!-- slide -->
![TC-CANVAS-04: Canvas Boundary Constraint](../test-screenshots/TC-CANVAS-04.png)
````

---

## 3. Improvements Summary

### 1. Proper Mathematical Function Display (KaTeX Integration)
- **Problem**: Math formulas previously rendered as raw text with dollar signs and LaTeX markup (e.g. `$$F = k \cdot \frac{|q_1 \cdot q_2|}{r^2}$$`, `$1/r^2$`).
- **Solution**: Integrated KaTeX with custom auto-render.
- **Dynamic Proper Function Banner**: Added real-time function equation calculation directly above the graph:
  $$F(r) = \frac{C}{r^2}\ \mathrm{[N]}$$
  Where $C = k \cdot |q_1 q_2|$ updates dynamically as charge sliders or presets are changed (e.g. $F(r) = \frac{0.0360}{r^2}\ [\text{N}]$ for $2.0\,\mu\text{C}$, and $F(r) = 0\ [\text{N}]$ for neutral particles).

### 2. Elimination of Text Collisions and Clippings
- **Canvas Vectors**: Moved force magnitude badges (`F₁₂ = ...`, `F₂₁ = ...`) directly below each particle, starting vector arrows cleanly from the particle outer boundary. This eliminates overlap with the particle sphere and the central distance badge ($r = 1.35\,\text{m}$).
- **Graph Y-axis Numbers**: Increased graph padding from $55\text{px}$ to $70\text{px}$, preventing large tick numbers (e.g. $622.22\,\text{mN}$) from being clipped at the left edge.
- **Y-axis Title**: Relocated the vertical axis title (`力 F [N] ↑`) above the Y-axis line, avoiding collision with the top tick label numbers.
- **Header Line-Breaking**: Prevented awkward Japanese wrapping in `F(r) リアルタイムプロット`.

### 3. Contrast & Typography Enhancements
- Increased contrast for `--text-muted` and `--text-dim` across dark backgrounds.
- Enhanced font stack with crisp Japanese typography (`Hiragino Sans`, `Noto Sans JP`, `Meiryo`).
