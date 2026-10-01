import { Particle } from './physics/Particle.ts';
import { CoulombEngine } from './physics/CoulombEngine.ts';
import { Canvas2DView } from './render/Canvas2DView.ts';
import { GraphView } from './render/GraphView.ts';

import katex from 'katex';
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';

// Initialize core components
const engine = new CoulombEngine();

const simCanvas = document.getElementById('sim-canvas') as HTMLCanvasElement;
const graphCanvas = document.getElementById('graph-canvas') as HTMLCanvasElement;

if (!simCanvas || !graphCanvas) {
  throw new Error('Canvas elements not found in DOM');
}

// Initial particles: placed with reasonable distance
const initialP1 = new Particle('q₁', 260, 260, 2.0, 26);
const initialP2 = new Particle('q₂', 520, 260, -2.0, 26);
const particles = [initialP1, initialP2];

const canvasView = new Canvas2DView(simCanvas, engine);
canvasView.setParticles(particles);

const graphView = new GraphView(graphCanvas, engine);

// DOM Elements
const hudForceVal = document.getElementById('hud-force-val')!;
const hudForceType = document.getElementById('hud-force-type')!;
const hudDistVal = document.getElementById('hud-dist-val')!;
const funcFormulaDisplay = document.getElementById('func-formula-display');
const formulaDynamic = document.getElementById('formula-dynamic');

const q1Slider = document.getElementById('q1-slider') as HTMLInputElement;
const q2Slider = document.getElementById('q2-slider') as HTMLInputElement;
const q1ValDisplay = document.getElementById('q1-val-display')!;
const q2ValDisplay = document.getElementById('q2-val-display')!;
const q1Badge = document.getElementById('q1-badge')!;
const q2Badge = document.getElementById('q2-badge')!;

const chkGrid = document.getElementById('chk-grid') as HTMLInputElement;
const chkVectors = document.getElementById('chk-vectors') as HTMLInputElement;

const presetAttract = document.getElementById('preset-attract')!;
const presetRepel = document.getElementById('preset-repel')!;
const presetRatio = document.getElementById('preset-ratio')!;
const presetReset = document.getElementById('preset-reset')!;

const q1ToggleSign = document.getElementById('q1-toggle-sign')!;
const q2ToggleSign = document.getElementById('q2-toggle-sign')!;

/**
 * Update UI state, HUD, and Graph to reflect particles
 */
function updateUI(): void {
  const p1 = particles[0];
  const p2 = particles[1];

  const forceRes = engine.calculateForce(p1, p2);

  // 1. HUD Updates
  hudForceVal.textContent = CoulombEngine.formatForce(forceRes.magnitude);
  hudDistVal.textContent = CoulombEngine.formatDistance(forceRes.distanceMeters);

  if (p1.q === 0 || p2.q === 0) {
    hudForceType.textContent = '力なし (中性)';
    hudForceType.className = 'hud-type';
  } else if (forceRes.isAttraction) {
    hudForceType.textContent = '引力（引き合う）';
    hudForceType.className = 'hud-type attract';
  } else {
    hudForceType.textContent = '斥力（反発する）';
    hudForceType.className = 'hud-type repel';
  }

  // 2. Charge 1 UI
  q1Slider.value = p1.q.toString();
  q1ValDisplay.textContent = `${p1.q > 0 ? '+' : ''}${p1.q.toFixed(1)} μC`;
  updateChargeBadge(q1Badge, p1.q, '1');

  // 3. Charge 2 UI
  q2Slider.value = p2.q.toString();
  q2ValDisplay.textContent = `${p2.q > 0 ? '+' : ''}${p2.q.toFixed(1)} μC`;
  updateChargeBadge(q2Badge, p2.q, '2');

  // 4. Update Micro Buttons state
  updateMicroButtons();

  // 5. Update F-r Graph
  graphView.update(forceRes.distanceMeters, forceRes.magnitude, p1.q, p2.q);

  // 6. Update Dynamic Proper Function Displays
  const qProd = Math.abs(p1.q * p2.q);
  const cFactor = 8.98755e-3 * qProd;

  if (funcFormulaDisplay) {
    if (qProd === 0) {
      katex.render('F(r) = 0\\ \\mathrm{[N]}', funcFormulaDisplay, { displayMode: false, throwOnError: false });
    } else {
      const cStr = cFactor >= 0.01 ? cFactor.toFixed(4) : cFactor.toExponential(3);
      katex.render(`F(r) = \\frac{${cStr}}{r^2}\\ \\mathrm{[N]}`, funcFormulaDisplay, { displayMode: false, throwOnError: false });
    }
  }

  if (formulaDynamic) {
    if (qProd === 0) {
      katex.render('\\text{現在の関数式: } F(r) = 0\\ \\mathrm{[N]}\\quad(\\text{中性})', formulaDynamic, { displayMode: false, throwOnError: false });
    } else {
      const cStr = cFactor >= 0.01 ? cFactor.toFixed(4) : cFactor.toExponential(3);
      katex.render(`\\text{現在の関数式: } F(r) = \\frac{${cStr}}{r^2}\\ \\mathrm{[N]}`, formulaDynamic, { displayMode: false, throwOnError: false });
    }
  }
}

function updateChargeBadge(badgeEl: HTMLElement, q: number, labelIndex: string): void {
  const symbolSpan = badgeEl.querySelector('.badge-symbol')!;
  const textSpan = badgeEl.querySelectorAll('span')[1]!;

  if (q > 0) {
    badgeEl.className = 'charge-badge positive';
    symbolSpan.textContent = '+';
  } else if (q < 0) {
    badgeEl.className = 'charge-badge negative';
    symbolSpan.textContent = '−';
  } else {
    badgeEl.className = 'charge-badge';
    badgeEl.style.background = 'rgba(255, 255, 255, 0.1)';
    badgeEl.style.color = '#cbd5e1';
    badgeEl.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    symbolSpan.textContent = '0';
  }
  textSpan.textContent = `電荷 ${labelIndex} (q${labelIndex === '1' ? '₁' : '₂'})`;
}

function updateMicroButtons(): void {
  document.querySelectorAll('.btn-micro[data-target]').forEach((btn) => {
    const target = btn.getAttribute('data-target');
    const val = parseFloat(btn.getAttribute('data-val') || '0');
    const particle = target === 'q1' ? particles[0] : particles[1];

    if (Math.abs(particle.q - val) < 0.05) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Attach change callback to 2D view
canvasView.onStateChange = () => {
  updateUI();
};

// Controls Event Listeners
q1Slider.addEventListener('input', () => {
  particles[0].q = parseFloat(q1Slider.value);
  canvasView.render();
  updateUI();
});

q2Slider.addEventListener('input', () => {
  particles[1].q = parseFloat(q2Slider.value);
  canvasView.render();
  updateUI();
});

q1ToggleSign.addEventListener('click', () => {
  particles[0].q = -particles[0].q;
  canvasView.render();
  updateUI();
});

q2ToggleSign.addEventListener('click', () => {
  particles[1].q = -particles[1].q;
  canvasView.render();
  updateUI();
});

// Quick charge buttons
document.querySelectorAll('.btn-micro[data-target]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    const val = parseFloat(btn.getAttribute('data-val') || '0');
    if (target === 'q1') {
      particles[0].q = val;
    } else {
      particles[1].q = val;
    }
    canvasView.render();
    updateUI();
  });
});

// Preset Buttons
presetAttract.addEventListener('click', () => {
  particles[0].q = 2.0;
  particles[1].q = -2.0;
  canvasView.render();
  updateUI();
});

presetRepel.addEventListener('click', () => {
  particles[0].q = 2.0;
  particles[1].q = 2.0;
  canvasView.render();
  updateUI();
});

presetRatio.addEventListener('click', () => {
  particles[0].q = 4.0;
  particles[1].q = 1.0;
  canvasView.render();
  updateUI();
});

presetReset.addEventListener('click', () => {
  const rect = simCanvas.parentElement?.getBoundingClientRect();
  const w = rect ? rect.width : 600;
  const h = rect ? rect.height : 400;

  particles[0].x = w * 0.35;
  particles[0].y = h * 0.5;
  particles[0].q = 2.0;

  particles[1].x = w * 0.65;
  particles[1].y = h * 0.5;
  particles[1].q = -2.0;

  canvasView.render();
  updateUI();
});

// Display Toggles
chkGrid.addEventListener('change', () => {
  canvasView.showGrid = chkGrid.checked;
  canvasView.render();
});

chkVectors.addEventListener('change', () => {
  canvasView.showVectors = chkVectors.checked;
  canvasView.render();
});

// Initialize positions to center of canvas on start
window.addEventListener('load', () => {
  const rect = simCanvas.parentElement?.getBoundingClientRect();
  if (rect && rect.width > 0) {
    particles[0].x = Math.max(100, rect.width * 0.35);
    particles[0].y = rect.height * 0.5;
    particles[1].x = Math.min(rect.width - 100, rect.width * 0.65);
    particles[1].y = rect.height * 0.5;
  }
  canvasView.handleResize();
  graphView.handleResize();
  canvasView.render();
  updateUI();
});

// Initial update
updateUI();
canvasView.render();

// Render static mathematical formulas with KaTeX
try {
  renderMathInElement(document.body, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
    ],
    throwOnError: false,
  });
} catch (e) {
  console.warn('KaTeX auto-render error:', e);
}

// Expose internal state for E2E testing and debugging
declare global {
  interface Window {
    __SIM_STATE__?: {
      particles: Particle[];
      engine: CoulombEngine;
      canvasView: Canvas2DView;
      graphView: GraphView;
      updateUI: () => void;
    };
  }
}

if (typeof window !== 'undefined') {
  window.__SIM_STATE__ = {
    particles,
    engine,
    canvasView,
    graphView,
    updateUI,
  };
}
