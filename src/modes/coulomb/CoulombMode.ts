import { Particle } from '../../physics/Particle.ts';
import { CoulombEngine } from '../../physics/CoulombEngine.ts';
import { Canvas2DView } from '../../render/Canvas2DView.ts';
import { GraphView } from '../../render/GraphView.ts';
import { ThreePotentialView } from '../../render/ThreePotentialView.ts';
import { LearningScenario } from '../../learning/LearningScenario.ts';
import { ChallengeManager } from '../../learning/ChallengeManager.ts';
import { Challenge, ScenarioStep } from '../../learning/ChallengeTypes.ts';
import { SimulatorMode, SimulatorModeMetadata } from '../../core/Types.ts';

import katex from 'katex';
import renderMathInElement from 'katex/contrib/auto-render';

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

export class CoulombMode implements SimulatorMode {
  public readonly metadata: SimulatorModeMetadata = {
    id: 'coulomb',
    name: 'クーロンの法則',
    englishTitle: "Coulomb's Law",
    icon: '⚡',
    subtitle: 'Coulomb\'s Law Interactive Lab &bull; <span class="math-expr">$F = k \\frac{|q_1 q_2|}{r^2}$</span>',
    description: '荷電粒子間のクーロン力、逆二乗則、電気力線、3D電位曲面',
    mathFormula: 'F = k \\frac{|q_1 q_2|}{r^2}'
  };

  private engine: CoulombEngine;
  private particles: Particle[];
  private canvasView: Canvas2DView | null = null;
  private graphView: GraphView | null = null;
  private threeView: ThreePotentialView | null = null;
  private learningScenario: LearningScenario;
  private challengeManager: ChallengeManager;

  private isInitialized: boolean = false;
  private currentHighlightedEl: HTMLElement | null = null;

  constructor() {
    this.engine = new CoulombEngine();
    const initialP1 = new Particle('q₁', 260, 260, 2.0, 26);
    const initialP2 = new Particle('q₂', 520, 260, -2.0, 26);
    this.particles = [initialP1, initialP2];

    this.learningScenario = new LearningScenario();
    this.challengeManager = new ChallengeManager();
  }

  public mount(_container?: HTMLElement): void {
    if (!this.isInitialized) {
      this.init();
      this.isInitialized = true;
    } else {
      this.resume();
    }
  }

  public unmount(): void {
    this.pause();
  }

  public pause(): void {
    if (this.threeView) {
      this.threeView.setAutoRotate(false);
    }
  }

  public resume(): void {
    if (this.canvasView && this.threeView && this.graphView) {
      this.canvasView.handleResize();
      this.graphView.handleResize();
      this.threeView.handleResize();
      this.canvasView.render();
      this.threeView.updateSurface();
      this.updateUI();
    }
  }

  public resize(): void {
    this.canvasView?.handleResize();
    this.graphView?.handleResize();
    this.threeView?.handleResize();
  }

  private init(): void {
    const simCanvas = document.getElementById('sim-canvas') as HTMLCanvasElement;
    const graphCanvas = document.getElementById('graph-canvas') as HTMLCanvasElement;
    const pane3D = document.getElementById('pane-3d')!;
    const potentialCanvas3D = document.getElementById('potential-canvas-3d') as HTMLCanvasElement;

    if (!simCanvas || !graphCanvas) {
      throw new Error('Canvas elements not found in DOM');
    }

    this.canvasView = new Canvas2DView(simCanvas, this.engine);
    this.canvasView.setParticles(this.particles);

    this.graphView = new GraphView(graphCanvas, this.engine);
    this.threeView = new ThreePotentialView(pane3D, potentialCanvas3D, this.engine);
    this.threeView.setParticles(this.particles);

    // Initial positioning relative to canvas size
    const rect = simCanvas.parentElement?.getBoundingClientRect();
    if (rect && rect.width > 0) {
      this.particles[0].x = Math.max(100, rect.width * 0.35);
      this.particles[0].y = rect.height * 0.5;
      this.particles[1].x = Math.min(rect.width - 100, rect.width * 0.65);
      this.particles[1].y = rect.height * 0.5;
    }

    // Attach change callback to 2D view
    this.canvasView.onStateChange = () => {
      this.updateUI();
    };

    // Synchronize 2D test particles into 3D glowing rolling particles
    this.canvasView.onAnimationTick = () => {
      const pRect = simCanvas.parentElement?.getBoundingClientRect();
      const w = pRect && pRect.width > 0 ? pRect.width : simCanvas.width / (window.devicePixelRatio || 1);
      const h = pRect && pRect.height > 0 ? pRect.height : simCanvas.height / (window.devicePixelRatio || 1);
      this.threeView?.updateTestParticles(this.canvasView!.testParticles, w, h);
    };

    this.bindUIControls();
    this.bindLearningScenario();
    this.bindChallenges();

    // Expose internal state for E2E testing
    if (typeof window !== 'undefined') {
      window.__SIM_STATE__ = {
        particles: this.particles,
        engine: this.engine,
        canvasView: this.canvasView,
        graphView: this.graphView,
        threeView: this.threeView,
        learningScenario: this.learningScenario,
        challengeManager: this.challengeManager,
        switchView: (mode) => this.switchView(mode),
        updateUI: () => this.updateUI(),
        applyChallengeToSimulator: (ch) => this.applyChallengeToSimulator(ch)
      };
    }

    this.canvasView.handleResize();
    this.graphView.handleResize();
    this.threeView.handleResize();
    this.canvasView.render();
    this.threeView.updateSurface();
    this.updateUI();

    try {
      renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    } catch (e) {
      console.warn('KaTeX auto-render error:', e);
    }
  }

  public updateUI(): void {
    if (!this.canvasView || !this.graphView || !this.threeView) return;

    const p1 = this.particles[0];
    const p2 = this.particles[1];
    const forceRes = this.engine.calculateForce(p1, p2);

    // 1. HUD Updates
    const hudForceVal = document.getElementById('hud-force-val')!;
    const hudForceType = document.getElementById('hud-force-type')!;
    const hudDistVal = document.getElementById('hud-dist-val')!;

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
    const q1Slider = document.getElementById('q1-slider') as HTMLInputElement;
    const q1ValDisplay = document.getElementById('q1-val-display')!;
    const q1Badge = document.getElementById('q1-badge')!;
    q1Slider.value = p1.q.toString();
    q1ValDisplay.textContent = `${p1.q > 0 ? '+' : ''}${p1.q.toFixed(1)} μC`;
    this.updateChargeBadge(q1Badge, p1.q, '1');

    // 3. Charge 2 UI
    const q2Slider = document.getElementById('q2-slider') as HTMLInputElement;
    const q2ValDisplay = document.getElementById('q2-val-display')!;
    const q2Badge = document.getElementById('q2-badge')!;
    q2Slider.value = p2.q.toString();
    q2ValDisplay.textContent = `${p2.q > 0 ? '+' : ''}${p2.q.toFixed(1)} μC`;
    this.updateChargeBadge(q2Badge, p2.q, '2');

    // 4. Update Micro Buttons state
    this.updateMicroButtons();

    // 5. Update F-r Graph
    this.graphView.update(forceRes.distanceMeters, forceRes.magnitude, p1.q, p2.q);

    // 6. Update Dynamic Proper Function Displays
    const qProd = Math.abs(p1.q * p2.q);
    const cFactor = 8.98755e-3 * qProd;

    const funcFormulaDisplay = document.getElementById('func-formula-display');
    const formulaDynamic = document.getElementById('formula-dynamic');

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
    this.threeView.updateSurface();
  }

  private updateChargeBadge(badgeEl: HTMLElement, q: number, labelIndex: string): void {
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

  private updateMicroButtons(): void {
    document.querySelectorAll('.btn-micro[data-target]').forEach((btn) => {
      const target = btn.getAttribute('data-target');
      const val = parseFloat(btn.getAttribute('data-val') || '0');
      const particle = target === 'q1' ? this.particles[0] : this.particles[1];

      if (Math.abs(particle.q - val) < 0.05) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  public switchView(mode: '2d' | '3d' | 'split'): void {
    const canvasWrapper = document.getElementById('canvas-wrapper')!;
    canvasWrapper.className = `canvas-wrapper view-${mode}`;

    const tab2D = document.getElementById('tab-view-2d');
    const tab3D = document.getElementById('tab-view-3d');
    const tabSplit = document.getElementById('tab-view-split');

    [tab2D, tab3D, tabSplit].forEach((btn) => btn?.classList.remove('active'));
    if (mode === '2d') tab2D?.classList.add('active');
    if (mode === '3d') tab3D?.classList.add('active');
    if (mode === 'split') tabSplit?.classList.add('active');

    this.canvasView?.handleResize();
    this.threeView?.handleResize();

    if (mode === 'split') {
      this.canvasView?.fitParticlesToViewport(0.28, 0.72, 0.52);
      this.threeView?.setOptimalSplitCamera();
    } else if (mode === '2d') {
      const simCanvas = document.getElementById('sim-canvas') as HTMLCanvasElement;
      const w = simCanvas.width / (window.devicePixelRatio || 1);
      if (w > 0 && Math.abs(this.particles[1].x - this.particles[0].x) < w * 0.25) {
        this.canvasView?.fitParticlesToViewport(0.35, 0.65, 0.5);
      }
    }

    this.canvasView?.render();
    this.threeView?.updateSurface();
    this.updateUI();
  }

  private bindUIControls(): void {
    const q1Slider = document.getElementById('q1-slider') as HTMLInputElement;
    const q2Slider = document.getElementById('q2-slider') as HTMLInputElement;
    const q1ToggleSign = document.getElementById('q1-toggle-sign')!;
    const q2ToggleSign = document.getElementById('q2-toggle-sign')!;

    q1Slider.addEventListener('input', () => {
      this.particles[0].q = parseFloat(q1Slider.value);
      this.canvasView?.render();
      this.updateUI();
    });

    q2Slider.addEventListener('input', () => {
      this.particles[1].q = parseFloat(q2Slider.value);
      this.canvasView?.render();
      this.updateUI();
    });

    q1ToggleSign.addEventListener('click', () => {
      this.particles[0].q = -this.particles[0].q;
      this.canvasView?.render();
      this.updateUI();
    });

    q2ToggleSign.addEventListener('click', () => {
      this.particles[1].q = -this.particles[1].q;
      this.canvasView?.render();
      this.updateUI();
    });

    // Quick charge buttons
    document.querySelectorAll('.btn-micro[data-target]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        const val = parseFloat(btn.getAttribute('data-val') || '0');
        if (target === 'q1') {
          this.particles[0].q = val;
        } else {
          this.particles[1].q = val;
        }
        this.canvasView?.render();
        this.updateUI();
      });
    });

    // Presets
    const presetAttract = document.getElementById('preset-attract')!;
    const presetRepel = document.getElementById('preset-repel')!;
    const presetRatio = document.getElementById('preset-ratio')!;
    const presetReset = document.getElementById('preset-reset')!;

    presetAttract.addEventListener('click', () => {
      this.particles[0].q = 2.0;
      this.particles[1].q = -2.0;
      this.canvasView?.render();
      this.updateUI();
    });

    presetRepel.addEventListener('click', () => {
      this.particles[0].q = 2.0;
      this.particles[1].q = 2.0;
      this.canvasView?.render();
      this.updateUI();
    });

    presetRatio.addEventListener('click', () => {
      this.particles[0].q = 4.0;
      this.particles[1].q = 1.0;
      this.canvasView?.render();
      this.updateUI();
    });

    presetReset.addEventListener('click', () => {
      const simCanvas = document.getElementById('sim-canvas') as HTMLCanvasElement;
      const rect = simCanvas.parentElement?.getBoundingClientRect();
      const w = rect ? rect.width : 600;
      const h = rect ? rect.height : 400;

      this.particles[0].x = w * 0.35;
      this.particles[0].y = h * 0.5;
      this.particles[0].q = 2.0;

      this.particles[1].x = w * 0.65;
      this.particles[1].y = h * 0.5;
      this.particles[1].q = -2.0;

      this.canvasView?.render();
      this.updateUI();
    });

    // Display Toggles
    const chkGrid = document.getElementById('chk-grid') as HTMLInputElement;
    const chkVectors = document.getElementById('chk-vectors') as HTMLInputElement;
    const chkFieldLines = document.getElementById('chk-field-lines') as HTMLInputElement;
    const chkEField = document.getElementById('chk-efield') as HTMLInputElement;

    chkGrid.addEventListener('change', () => {
      if (this.canvasView) this.canvasView.showGrid = chkGrid.checked;
      this.canvasView?.render();
    });

    chkVectors.addEventListener('change', () => {
      if (this.canvasView) this.canvasView.showVectors = chkVectors.checked;
      this.canvasView?.render();
    });

    chkFieldLines?.addEventListener('change', () => {
      if (this.canvasView) this.canvasView.showFieldLines = chkFieldLines.checked;
      this.canvasView?.render();
    });

    chkEField?.addEventListener('change', () => {
      if (this.canvasView) this.canvasView.showEFieldGrid = chkEField.checked;
      this.canvasView?.render();
    });

    // Test particle buttons
    const btnTestPos = document.getElementById('btn-test-pos');
    const btnTestNeg = document.getElementById('btn-test-neg');
    const btnSpawnTest = document.getElementById('btn-spawn-test');
    const btnClearTest = document.getElementById('btn-clear-test');

    btnTestPos?.addEventListener('click', () => {
      if (this.canvasView) this.canvasView.testChargeSign = 1;
      btnTestPos.classList.add('active');
      btnTestNeg?.classList.remove('active');
    });

    btnTestNeg?.addEventListener('click', () => {
      if (this.canvasView) this.canvasView.testChargeSign = -1;
      btnTestNeg.classList.add('active');
      btnTestPos?.classList.remove('active');
    });

    btnSpawnTest?.addEventListener('click', () => {
      this.canvasView?.spawnTestParticle();
    });

    btnClearTest?.addEventListener('click', () => {
      this.canvasView?.clearTestParticles();
      this.threeView?.clearTestParticleMeshes();
    });

    // View mode tabs
    const tab2D = document.getElementById('tab-view-2d');
    const tab3D = document.getElementById('tab-view-3d');
    const tabSplit = document.getElementById('tab-view-split');

    tab2D?.addEventListener('click', () => this.switchView('2d'));
    tab3D?.addEventListener('click', () => this.switchView('3d'));
    tabSplit?.addEventListener('click', () => this.switchView('split'));

    // 3D Controls
    const btn3DWireframe = document.getElementById('btn-3d-wireframe');
    const btn3DAutoRotate = document.getElementById('btn-3d-autorotate');
    const btn3DResetCam = document.getElementById('btn-3d-reset-cam');

    btn3DWireframe?.addEventListener('click', () => {
      if (this.threeView) {
        this.threeView.showWireframe = !this.threeView.showWireframe;
        this.threeView.updateSurface();
        btn3DWireframe.classList.toggle('active', this.threeView.showWireframe);
      }
    });

    btn3DAutoRotate?.addEventListener('click', () => {
      if (this.threeView) {
        const newAuto = !this.threeView.autoRotate;
        this.threeView.setAutoRotate(newAuto);
        btn3DAutoRotate.classList.toggle('active', newAuto);
      }
    });

    btn3DResetCam?.addEventListener('click', () => {
      this.threeView?.resetCamera();
    });
  }

  private bindLearningScenario(): void {
    const btnToggleLearning = document.getElementById('btn-toggle-learning');
    const learningBanner = document.getElementById('learning-stepper-banner');
    const btnPrevStep = document.getElementById('btn-prev-step');
    const btnNextStep = document.getElementById('btn-next-step');
    const btnExitLearning = document.getElementById('btn-exit-learning');
    const btnBannerAction = document.getElementById('btn-banner-action');

    btnBannerAction?.addEventListener('click', () => {
      const p1 = this.particles[0];
      this.canvasView?.spawnTestParticle(p1.x + 35, p1.y - 15, 0.4);
      this.canvasView?.spawnTestParticle(p1.x + 35, p1.y + 15, 0.4);
    });

    this.learningScenario.onModeToggle((active) => {
      if (active) {
        learningBanner?.classList.remove('hidden');
        btnToggleLearning?.classList.add('active');
        if (btnToggleLearning) btnToggleLearning.textContent = '✕ 学習モード中';
      } else {
        learningBanner?.classList.add('hidden');
        btnToggleLearning?.classList.remove('active');
        if (btnToggleLearning) btnToggleLearning.innerHTML = '<span class="icon">🎓</span> 探究学習モード';
        this.clearTutorialHighlight();
      }
    });

    this.learningScenario.onStepChange((step) => {
      this.updateLearningStepUI(step);
    });

    btnToggleLearning?.addEventListener('click', () => this.learningScenario.toggle());
    btnExitLearning?.addEventListener('click', () => this.learningScenario.exit());
    btnPrevStep?.addEventListener('click', () => this.learningScenario.prevStep());
    btnNextStep?.addEventListener('click', () => {
      if (this.learningScenario.getCurrentStepIndex() === this.learningScenario.getSteps().length - 1) {
        this.learningScenario.exit();
        document.getElementById('challenges-card')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        this.learningScenario.nextStep();
      }
    });

    document.querySelectorAll('.step-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        const stepIdx = parseInt(dot.getAttribute('data-step') || '0', 10);
        this.learningScenario.goToStep(stepIdx);
      });
    });
  }

  private clearTutorialHighlight(): void {
    if (this.currentHighlightedEl) {
      this.currentHighlightedEl.classList.remove('tutorial-highlight');
      this.currentHighlightedEl = null;
    }
  }

  private updateLearningStepUI(step: ScenarioStep): void {
    const stepBadge = document.getElementById('step-badge');
    const stepTitle = document.getElementById('step-title');
    const stepGoal = document.getElementById('step-goal');
    const stepNarrative = document.getElementById('step-narrative');
    const stepActionText = document.getElementById('step-action-text');
    const btnPrevStep = document.getElementById('btn-prev-step') as HTMLButtonElement | null;
    const btnNextStep = document.getElementById('btn-next-step') as HTMLButtonElement | null;

    if (stepBadge) stepBadge.textContent = step.badge;
    if (stepTitle) stepTitle.textContent = step.title;
    if (stepGoal) stepGoal.textContent = `🎯 目標: ${step.goal}`;
    if (stepNarrative) stepNarrative.textContent = step.narrative;
    if (stepActionText) stepActionText.textContent = step.recommendedAction;

    document.querySelectorAll('.step-dot').forEach((dot, index) => {
      dot.classList.remove('active', 'completed');
      if (index === step.stepIndex - 1) {
        dot.classList.add('active');
      } else if (index < step.stepIndex - 1) {
        dot.classList.add('completed');
      }
    });

    if (btnPrevStep) btnPrevStep.disabled = step.stepIndex === 1;
    if (btnNextStep) {
      btnNextStep.innerHTML =
        step.stepIndex === this.learningScenario.getSteps().length
          ? '🎉 学習完了！'
          : '次のステップ &rarr;';
    }

    this.clearTutorialHighlight();
    if (step.highlightSelector) {
      const target = document.querySelector(step.highlightSelector) as HTMLElement | null;
      if (target) {
        target.classList.add('tutorial-highlight');
        this.currentHighlightedEl = target;
      }
    }

    if (step.autoSetup) {
      if (step.autoSetup.view) this.switchView(step.autoSetup.view);
      if (step.autoSetup.q1 !== undefined) this.particles[0].q = step.autoSetup.q1;
      if (step.autoSetup.q2 !== undefined) this.particles[1].q = step.autoSetup.q2;
      if (step.autoSetup.vectors !== undefined && this.canvasView) {
        this.canvasView.showVectors = step.autoSetup.vectors;
        (document.getElementById('chk-vectors') as HTMLInputElement).checked = step.autoSetup.vectors;
      }
      if (step.autoSetup.fieldLines !== undefined && this.canvasView) {
        this.canvasView.showFieldLines = step.autoSetup.fieldLines;
        (document.getElementById('chk-field-lines') as HTMLInputElement).checked = step.autoSetup.fieldLines;
      }
      if (step.autoSetup.efield !== undefined && this.canvasView) {
        this.canvasView.showEFieldGrid = step.autoSetup.efield;
        (document.getElementById('chk-efield') as HTMLInputElement).checked = step.autoSetup.efield;
      }
      this.canvasView?.render();
      this.updateUI();
    }

    const btnBannerAction = document.getElementById('btn-banner-action');
    if (btnBannerAction) {
      btnBannerAction.style.display = step.stepIndex === 3 ? 'inline-flex' : 'none';
    }

    if (step.stepIndex === 3) {
      this.canvasView?.fitParticlesToViewport(0.28, 0.72, 0.52);
      this.threeView?.setOptimalSplitCamera();
      this.threeView?.updateSurface();

      setTimeout(() => {
        this.canvasView?.clearTestParticles();
        this.threeView?.clearTestParticleMeshes();
        const p1 = this.particles[0];
        this.canvasView?.spawnTestParticle(p1.x + 40, p1.y - 18, 0.4);
        this.canvasView?.spawnTestParticle(p1.x + 35, p1.y + 18, 0.4);
        this.canvasView?.spawnTestParticle(p1.x + 50, p1.y, 0.4);
      }, 120);
    }
  }

  private applyChallengeToSimulator(challenge: Challenge): void {
    this.particles[0].q = challenge.q1_uC;
    this.particles[1].q = challenge.q2_uC;

    const simCanvas = document.getElementById('sim-canvas') as HTMLCanvasElement;
    const rect = simCanvas.parentElement?.getBoundingClientRect();
    const w = rect && rect.width > 0 ? rect.width : 600;
    const h = rect && rect.height > 0 ? rect.height : 400;
    const centerX = w / 2;
    const centerY = h / 2;

    const distPx = challenge.r_m * this.engine.pixelsPerMeter;
    this.particles[0].x = Math.max(60, centerX - distPx / 2);
    this.particles[0].y = centerY;
    this.particles[1].x = Math.min(w - 60, centerX + distPx / 2);
    this.particles[1].y = centerY;

    this.canvasView?.render();
    this.updateUI();

    const challengeFeedback = document.getElementById('challenge-feedback');
    if (challengeFeedback) {
      challengeFeedback.className = 'challenge-feedback success';
      challengeFeedback.innerHTML = `🔬 シミュレーターの電荷を <strong>q₁ = ${challenge.q1_uC > 0 ? '+' : ''}${challenge.q1_uC} μC</strong>, <strong>q₂ = ${challenge.q2_uC > 0 ? '+' : ''}${challenge.q2_uC} μC</strong>, 距離 <strong>r = ${challenge.r_m.toFixed(2)} m</strong> に配置しました！左上のHUDと矢印を確認してみよう。`;
    }
  }

  private bindChallenges(): void {
    const btnChallengeTabs = document.querySelectorAll('.btn-challenge-tab');
    const btnRandomChallenge = document.getElementById('btn-random-challenge');
    const btnSubmitAnswer = document.getElementById('btn-submit-answer');
    const btnSyncToStage = document.getElementById('btn-sync-to-stage');
    const btnToggleSolution = document.getElementById('btn-toggle-solution');
    const challengeSolutionDrawer = document.getElementById('challenge-solution-drawer');

    btnChallengeTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        btnChallengeTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const id = tab.getAttribute('data-id') || 'challenge-1';
        const ch = this.challengeManager.selectChallengeById(id);
        if (ch) {
          this.renderCurrentChallenge(ch);
        }
      });
    });

    btnRandomChallenge?.addEventListener('click', () => {
      btnChallengeTabs.forEach((t) => t.classList.remove('active'));
      const randomCh = this.challengeManager.generateRandomChallenge();
      this.renderCurrentChallenge(randomCh);
    });

    btnSubmitAnswer?.addEventListener('click', () => {
      const input = document.getElementById('input-challenge-force') as HTMLInputElement | null;
      const dirRadio = document.querySelector('input[name="challenge-dir"]:checked') as HTMLInputElement | null;
      const forceStr = input?.value || '';
      const dirStr = dirRadio ? dirRadio.value : 'attract';

      const result = this.challengeManager.evaluateAnswer(forceStr, dirStr);
      const feedback = document.getElementById('challenge-feedback');
      if (feedback) {
        feedback.className = `challenge-feedback ${result.isCorrect ? 'success' : 'error'}`;
        feedback.textContent = result.message;
      }
    });

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

    btnSyncToStage?.addEventListener('click', () => {
      const ch = this.challengeManager.getCurrentChallenge();
      this.applyChallengeToSimulator(ch);
    });

    this.renderCurrentChallenge(this.challengeManager.getCurrentChallenge());
  }

  private renderCurrentChallenge(challenge: Challenge): void {
    const challengeDiff = document.getElementById('challenge-diff');
    const challengeTitle = document.getElementById('challenge-title');
    const challengeDesc = document.getElementById('challenge-desc');
    const challengeFeedback = document.getElementById('challenge-feedback');
    const challengeSolutionDrawer = document.getElementById('challenge-solution-drawer');
    const solutionStepsList = document.getElementById('solution-steps-list');
    const inputChallengeForce = document.getElementById('input-challenge-force') as HTMLInputElement | null;
    const btnToggleSolution = document.getElementById('btn-toggle-solution');

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

    if (challengeTitle) challengeTitle.textContent = challenge.title;

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

    if (inputChallengeForce) inputChallengeForce.value = '';
    if (challengeFeedback) {
      challengeFeedback.className = 'challenge-feedback hidden';
      challengeFeedback.textContent = '';
    }
    if (challengeSolutionDrawer) {
      challengeSolutionDrawer.classList.add('hidden');
      if (btnToggleSolution) btnToggleSolution.textContent = '📖 手計算解説を見る';
    }

    if (solutionStepsList) {
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
  }
}
