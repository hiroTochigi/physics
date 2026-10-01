import { Particle } from './physics/Particle.ts';
import { CoulombEngine } from './physics/CoulombEngine.ts';
import { Canvas2DView } from './render/Canvas2DView.ts';
import { GraphView } from './render/GraphView.ts';
import { ThreePotentialView } from './render/ThreePotentialView.ts';
import { LearningScenario } from './learning/LearningScenario.ts';
import { ChallengeManager } from './learning/ChallengeManager.ts';
import { Challenge, ScenarioStep } from './learning/ChallengeTypes.ts';

import katex from 'katex';
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';

// Initialize core components
const engine = new CoulombEngine();

const canvasWrapper = document.getElementById('canvas-wrapper')!;
const simCanvas = document.getElementById('sim-canvas') as HTMLCanvasElement;
const graphCanvas = document.getElementById('graph-canvas') as HTMLCanvasElement;
const pane3D = document.getElementById('pane-3d')!;
const potentialCanvas3D = document.getElementById('potential-canvas-3d') as HTMLCanvasElement;

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

const threeView = new ThreePotentialView(pane3D, potentialCanvas3D, engine);
threeView.setParticles(particles);


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
const chkFieldLines = document.getElementById('chk-field-lines') as HTMLInputElement;
const chkEField = document.getElementById('chk-efield') as HTMLInputElement;

const btnTestPos = document.getElementById('btn-test-pos') as HTMLButtonElement;
const btnTestNeg = document.getElementById('btn-test-neg') as HTMLButtonElement;
const btnSpawnTest = document.getElementById('btn-spawn-test') as HTMLButtonElement;
const btnClearTest = document.getElementById('btn-clear-test') as HTMLButtonElement;

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

  // 7. Update 3D Potential Landscape
  threeView.updateSurface();
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

if (chkFieldLines) {
  chkFieldLines.addEventListener('change', () => {
    canvasView.showFieldLines = chkFieldLines.checked;
    canvasView.render();
  });
}

if (chkEField) {
  chkEField.addEventListener('change', () => {
    canvasView.showEFieldGrid = chkEField.checked;
    canvasView.render();
  });
}

// Test Particle Controls
if (btnTestPos && btnTestNeg) {
  btnTestPos.addEventListener('click', () => {
    canvasView.testChargeSign = 1;
    btnTestPos.classList.add('active');
    btnTestNeg.classList.remove('active');
  });

  btnTestNeg.addEventListener('click', () => {
    canvasView.testChargeSign = -1;
    btnTestNeg.classList.add('active');
    btnTestPos.classList.remove('active');
  });
}

if (btnSpawnTest) {
  btnSpawnTest.addEventListener('click', () => {
    canvasView.spawnTestParticle();
  });
}

if (btnClearTest) {
  btnClearTest.addEventListener('click', () => {
    canvasView.clearTestParticles();
  });
}


// View Mode Tabs (2D / 3D / Split)
const tab2D = document.getElementById('tab-view-2d');
const tab3D = document.getElementById('tab-view-3d');
const tabSplit = document.getElementById('tab-view-split');

const switchView = (mode: '2d' | '3d' | 'split') => {
  canvasWrapper.className = `canvas-wrapper view-${mode}`;
  [tab2D, tab3D, tabSplit].forEach((btn) => btn?.classList.remove('active'));
  if (mode === '2d') tab2D?.classList.add('active');
  if (mode === '3d') tab3D?.classList.add('active');
  if (mode === 'split') tabSplit?.classList.add('active');

  // Trigger resize and re-render
  canvasView.handleResize();
  threeView.handleResize();
  canvasView.render();
  threeView.updateSurface();
};

tab2D?.addEventListener('click', () => switchView('2d'));
tab3D?.addEventListener('click', () => switchView('3d'));
tabSplit?.addEventListener('click', () => switchView('split'));

// 3D Quick Controls
const btn3DWireframe = document.getElementById('btn-3d-wireframe');
const btn3DAutoRotate = document.getElementById('btn-3d-autorotate');
const btn3DResetCam = document.getElementById('btn-3d-reset-cam');

btn3DWireframe?.addEventListener('click', () => {
  threeView.showWireframe = !threeView.showWireframe;
  threeView.updateSurface();
  btn3DWireframe.classList.toggle('active', threeView.showWireframe);
});

btn3DAutoRotate?.addEventListener('click', () => {
  const newAuto = !threeView.autoRotate;
  threeView.setAutoRotate(newAuto);
  btn3DAutoRotate.classList.toggle('active', newAuto);
});


btn3DResetCam?.addEventListener('click', () => {
  threeView.resetCamera();
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
  threeView.handleResize();
  canvasView.render();
  updateUI();
});

// Initial update
updateUI();
canvasView.render();
threeView.updateSurface();

// ========================================================
// Learning Scenario & Challenges Controller
// ========================================================

const learningScenario = new LearningScenario();
const challengeManager = new ChallengeManager();

// Learning Banner Elements
const btnToggleLearning = document.getElementById('btn-toggle-learning');
const learningBanner = document.getElementById('learning-stepper-banner');
const btnPrevStep = document.getElementById('btn-prev-step') as HTMLButtonElement | null;
const btnNextStep = document.getElementById('btn-next-step') as HTMLButtonElement | null;
const btnExitLearning = document.getElementById('btn-exit-learning');
const stepBadge = document.getElementById('step-badge');
const stepTitle = document.getElementById('step-title');
const stepGoal = document.getElementById('step-goal');
const stepNarrative = document.getElementById('step-narrative');
const stepActionText = document.getElementById('step-action-text');

// Challenges Card Elements
const btnChallengeTabs = document.querySelectorAll('.btn-challenge-tab');
const btnRandomChallenge = document.getElementById('btn-random-challenge');
const challengeDiff = document.getElementById('challenge-diff');
const challengeTitle = document.getElementById('challenge-title');
const challengeDesc = document.getElementById('challenge-desc');
const inputChallengeForce = document.getElementById('input-challenge-force') as HTMLInputElement | null;
const btnSubmitAnswer = document.getElementById('btn-submit-answer');
const btnSyncToStage = document.getElementById('btn-sync-to-stage');
const btnToggleSolution = document.getElementById('btn-toggle-solution');
const challengeFeedback = document.getElementById('challenge-feedback');
const challengeSolutionDrawer = document.getElementById('challenge-solution-drawer');
const solutionStepsList = document.getElementById('solution-steps-list');

let currentHighlightedEl: HTMLElement | null = null;

function clearTutorialHighlight(): void {
  if (currentHighlightedEl) {
    currentHighlightedEl.classList.remove('tutorial-highlight');
    currentHighlightedEl = null;
  }
}

function updateLearningStepUI(step: ScenarioStep): void {
  if (!learningBanner) return;

  // Update text
  if (stepBadge) stepBadge.textContent = step.badge;
  if (stepTitle) stepTitle.textContent = step.title;
  if (stepGoal) stepGoal.textContent = `🎯 目標: ${step.goal}`;
  if (stepNarrative) stepNarrative.textContent = step.narrative;
  if (stepActionText) stepActionText.textContent = step.recommendedAction;

  // Update Step Dots
  const stepDots = document.querySelectorAll('.step-dot');
  stepDots.forEach((dot, index) => {
    dot.classList.remove('active', 'completed');
    if (index === step.stepIndex - 1) {
      dot.classList.add('active');
    } else if (index < step.stepIndex - 1) {
      dot.classList.add('completed');
    }
  });

  // Prev / Next button states
  if (btnPrevStep) {
    btnPrevStep.disabled = step.stepIndex === 1;
  }
  if (btnNextStep) {
    if (step.stepIndex === learningScenario.getSteps().length) {
      btnNextStep.textContent = '🎉 学習完了！';
    } else {
      btnNextStep.innerHTML = '次のステップ &rarr;';
    }
  }

  // Tutorial Highlighting
  clearTutorialHighlight();
  if (step.highlightSelector) {
    const target = document.querySelector(step.highlightSelector) as HTMLElement | null;
    if (target) {
      target.classList.add('tutorial-highlight');
      currentHighlightedEl = target;
    }
  }

  // Auto setup stage if specified
  if (step.autoSetup) {
    if (step.autoSetup.view) {
      switchView(step.autoSetup.view);
    }
    if (step.autoSetup.q1 !== undefined) {
      particles[0].q = step.autoSetup.q1;
    }
    if (step.autoSetup.q2 !== undefined) {
      particles[1].q = step.autoSetup.q2;
    }
    if (step.autoSetup.vectors !== undefined) {
      canvasView.showVectors = step.autoSetup.vectors;
      chkVectors.checked = step.autoSetup.vectors;
    }
    if (step.autoSetup.fieldLines !== undefined && chkFieldLines) {
      canvasView.showFieldLines = step.autoSetup.fieldLines;
      chkFieldLines.checked = step.autoSetup.fieldLines;
    }
    if (step.autoSetup.efield !== undefined && chkEField) {
      canvasView.showEFieldGrid = step.autoSetup.efield;
      chkEField.checked = step.autoSetup.efield;
    }
    canvasView.render();
    updateUI();
  }
}

// Learning Scenario Event Handlers
learningScenario.onModeToggle((active) => {
  if (active) {
    learningBanner?.classList.remove('hidden');
    btnToggleLearning?.classList.add('active');
    if (btnToggleLearning) btnToggleLearning.textContent = '✕ 学習モード中';
  } else {
    learningBanner?.classList.add('hidden');
    btnToggleLearning?.classList.remove('active');
    if (btnToggleLearning) btnToggleLearning.innerHTML = '<span class="icon">🎓</span> 探究学習モード';
    clearTutorialHighlight();
  }
});

learningScenario.onStepChange((step) => {
  updateLearningStepUI(step);
});

btnToggleLearning?.addEventListener('click', () => {
  learningScenario.toggle();
});

btnExitLearning?.addEventListener('click', () => {
  learningScenario.exit();
});

btnPrevStep?.addEventListener('click', () => {
  learningScenario.prevStep();
});

btnNextStep?.addEventListener('click', () => {
  if (learningScenario.getCurrentStepIndex() === learningScenario.getSteps().length - 1) {
    // If on last step, finish and highlight challenges
    learningScenario.exit();
    const chCard = document.getElementById('challenges-card');
    chCard?.scrollIntoView({ behavior: 'smooth' });
  } else {
    learningScenario.nextStep();
  }
});

// Step dot navigation clicks
document.querySelectorAll('.step-dot').forEach((dot) => {
  dot.addEventListener('click', () => {
    const stepIdx = parseInt(dot.getAttribute('data-step') || '0', 10);
    learningScenario.goToStep(stepIdx);
  });
});

// Challenges UI Rendering
function renderCurrentChallenge(challenge: Challenge): void {
  if (challengeDiff) {
    challengeDiff.textContent = challenge.difficulty;
    if (challenge.difficulty === '入門') {
      challengeDiff.style.background = '#0284c7';
    } else if (challenge.difficulty === '基本') {
      challengeDiff.style.background = '#2563eb';
    } else if (challenge.difficulty === '応用') {
      challengeDiff.style.background = '#d97706';
    } else if (challenge.difficulty === '発展') {
      challengeDiff.style.background = '#7c3aed';
    } else {
      challengeDiff.style.background = '#059669';
    }
  }

  if (challengeTitle) {
    challengeTitle.textContent = challenge.title;
  }

  if (challengeDesc) {
    challengeDesc.innerHTML = challenge.description;
    try {
      renderMathInElement(challengeDesc, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    } catch (e) {
      console.warn('Math render error in challenge description:', e);
    }
  }

  // Clear inputs & feedback
  if (inputChallengeForce) {
    inputChallengeForce.value = '';
  }
  if (challengeFeedback) {
    challengeFeedback.className = 'challenge-feedback hidden';
    challengeFeedback.textContent = '';
  }

  // Hide solution drawer until requested
  if (challengeSolutionDrawer) {
    challengeSolutionDrawer.classList.add('hidden');
    if (btnToggleSolution) btnToggleSolution.textContent = '📖 手計算解説を見る';
  }

  // Render solutions inside drawer
  renderSolutionSteps(challenge);
}

function renderSolutionSteps(challenge: Challenge): void {
  if (!solutionStepsList) return;
  solutionStepsList.innerHTML = '';

  challenge.solutionSteps.forEach((step) => {
    const stepEl = document.createElement('div');
    stepEl.className = 'solution-step-item';

    const titleEl = document.createElement('div');
    titleEl.className = 'solution-step-title';
    titleEl.textContent = `Step ${step.stepNumber}: ${step.title}`;
    stepEl.appendChild(titleEl);

    const bodyEl = document.createElement('div');
    bodyEl.className = 'solution-step-body';
    bodyEl.innerHTML = step.explanation;
    stepEl.appendChild(bodyEl);

    if (step.formulaLatex) {
      const mathEl = document.createElement('div');
      mathEl.className = 'solution-step-math';
      try {
        katex.render(step.formulaLatex, mathEl, {
          displayMode: true,
          throwOnError: false
        });
      } catch (err) {
        mathEl.textContent = step.formulaLatex;
      }
      stepEl.appendChild(mathEl);
    }

    // Render any inline math in explanation
    try {
      renderMathInElement(bodyEl, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    } catch (e) {}

    solutionStepsList.appendChild(stepEl);
  });
}

function applyChallengeToSimulator(challenge: Challenge): void {
  // Set charges
  particles[0].q = challenge.q1_uC;
  particles[1].q = challenge.q2_uC;

  // Set distance r by positioning particles around center
  const rect = simCanvas.parentElement?.getBoundingClientRect();
  const w = rect && rect.width > 0 ? rect.width : 600;
  const h = rect && rect.height > 0 ? rect.height : 400;
  const centerX = w / 2;
  const centerY = h / 2;

  // pixelsPerMeter: 200px = 1m
  const distPx = challenge.r_m * engine.pixelsPerMeter;
  particles[0].x = Math.max(60, centerX - distPx / 2);
  particles[0].y = centerY;
  particles[1].x = Math.min(w - 60, centerX + distPx / 2);
  particles[1].y = centerY;

  canvasView.render();
  updateUI();

  if (challengeFeedback) {
    challengeFeedback.className = 'challenge-feedback success';
    challengeFeedback.innerHTML = `🔬 シミュレーターの電荷を <strong>q₁ = ${challenge.q1_uC > 0 ? '+' : ''}${challenge.q1_uC} μC</strong>, <strong>q₂ = ${challenge.q2_uC > 0 ? '+' : ''}${challenge.q2_uC} μC</strong>, 距離 <strong>r = ${challenge.r_m.toFixed(2)} m</strong> に配置しました！左上のHUDと矢印を確認してみよう。`;
  }
}

// Challenge tab selection
btnChallengeTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    btnChallengeTabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    const id = tab.getAttribute('data-id') || 'challenge-1';
    const ch = challengeManager.selectChallengeById(id);
    if (ch) {
      renderCurrentChallenge(ch);
    }
  });
});

// Random challenge generation
btnRandomChallenge?.addEventListener('click', () => {
  btnChallengeTabs.forEach((t) => t.classList.remove('active'));
  const randomCh = challengeManager.generateRandomChallenge();
  renderCurrentChallenge(randomCh);
});

// Submit Answer handler
btnSubmitAnswer?.addEventListener('click', () => {
  const forceStr = inputChallengeForce?.value || '';
  const dirRadio = document.querySelector('input[name="challenge-dir"]:checked') as HTMLInputElement | null;
  const dirStr = dirRadio ? dirRadio.value : 'attract';

  const result = challengeManager.evaluateAnswer(forceStr, dirStr);

  if (challengeFeedback) {
    challengeFeedback.className = `challenge-feedback ${result.isCorrect ? 'success' : 'error'}`;
    challengeFeedback.textContent = result.message;
  }
});

// Sync to stage button
btnSyncToStage?.addEventListener('click', () => {
  const ch = challengeManager.getCurrentChallenge();
  applyChallengeToSimulator(ch);
});

// Toggle solution drawer
btnToggleSolution?.addEventListener('click', () => {
  if (!challengeSolutionDrawer) return;
  const isHidden = challengeSolutionDrawer.classList.contains('hidden');
  if (isHidden) {
    challengeSolutionDrawer.classList.remove('hidden');
    if (btnToggleSolution) btnToggleSolution.textContent = '✕ 解説を閉じる';
  } else {
    challengeSolutionDrawer.classList.add('hidden');
    if (btnToggleSolution) btnToggleSolution.textContent = '📖 手計算解説を見る';
  }
});

// Initial Challenge Rendering
renderCurrentChallenge(challengeManager.getCurrentChallenge());

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
      threeView: ThreePotentialView;
      learningScenario: LearningScenario;
      challengeManager: ChallengeManager;
      switchView: (mode: '2d' | '3d' | 'split') => void;
      updateUI: () => void;
      applyChallengeToSimulator: (ch: Challenge) => void;
    };
  }
}

if (typeof window !== 'undefined') {
  window.__SIM_STATE__ = {
    particles,
    engine,
    canvasView,
    graphView,
    threeView,
    learningScenario,
    challengeManager,
    switchView,
    updateUI,
    applyChallengeToSimulator,
  };
}


