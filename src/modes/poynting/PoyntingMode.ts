import katex from 'katex';
import { SimulatorMode, SimulatorModeMetadata } from '../../core/Types.ts';
import { PoyntingEngine } from './physics/PoyntingEngine.ts';
import { ThreeFieldView } from './render/ThreeFieldView.ts';
import { EnergyBalanceGraphView } from './render/EnergyBalanceGraphView.ts';
import { FieldSliceView } from './render/FieldSliceView.ts';
import { PoyntingScenario } from './learning/PoyntingScenario.ts';
import { PoyntingChallengeManager } from './learning/PoyntingChallengeManager.ts';
import { PoyntingChallenge, PoyntingScenarioStep } from './learning/PoyntingChallengeTypes.ts';

export class PoyntingMode implements SimulatorMode {
  public readonly metadata: SimulatorModeMetadata = {
    id: 'poynting',
    name: 'ポインティングの定理',
    englishTitle: "Poynting's Theorem",
    icon: '🌊',
    subtitle: 'Electromagnetic Energy & Poynting Flux Lab &bull; <span class="math-expr">$\\frac{dW}{dt} = -\\int j\\cdot E - \\oint S\\cdot dA$</span>',
    description: '空間に蓄えられる電磁エネルギー、ポインティング・ベクトル束、宇宙の家計簿（エネルギー保存則）',
    mathFormula: '\\frac{dW}{dt} = -\\int_V \\boldsymbol{j} \\cdot \\boldsymbol{E} \\, dV - \\oint_{\\partial V} \\boldsymbol{S} \\cdot d\\boldsymbol{A}'
  };

  private engine: PoyntingEngine;
  private threeView: ThreeFieldView | null = null;
  private graphView: EnergyBalanceGraphView | null = null;
  private sliceView: FieldSliceView | null = null;

  private scenario: PoyntingScenario;
  private challengeManager: PoyntingChallengeManager;

  private isMounted: boolean = false;
  private animationId: number | null = null;
  private isMathJapaneseMode: boolean = false;

  constructor() {
    this.engine = new PoyntingEngine();
    this.scenario = new PoyntingScenario();
    this.challengeManager = new PoyntingChallengeManager();
  }

  public mount(container?: HTMLElement): void {
    if (this.isMounted) {
      this.resume();
      return;
    }
    this.isMounted = true;

    const root = container || document.getElementById('poynting-mode-view');
    if (!root) {
      console.warn('Poynting container not found');
      return;
    }

    // Initialize 3D View
    const threeContainer = document.getElementById('poynting-pane-3d')!;
    const threeCanvas = document.getElementById('poynting-canvas-3d') as HTMLCanvasElement;
    if (threeCanvas && threeContainer) {
      this.threeView = new ThreeFieldView(threeContainer, threeCanvas, this.engine);
    }

    // Initialize 2D Graph View
    const graphCanvas = document.getElementById('poynting-graph-canvas') as HTMLCanvasElement;
    if (graphCanvas) {
      this.graphView = new EnergyBalanceGraphView(graphCanvas, this.engine);
    }

    // Initialize 2D Slice View
    const sliceCanvas = document.getElementById('poynting-slice-canvas') as HTMLCanvasElement;
    if (sliceCanvas) {
      this.sliceView = new FieldSliceView(sliceCanvas, this.engine);
    }

    this.bindUIEvents();
    this.renderMathHUD();
    this.renderCurrentChallenge(this.challengeManager.getCurrentChallenge());
    this.startSimulationLoop();
  }

  public unmount(): void {
    this.pause();
    if (this.threeView) {
      this.threeView.dispose();
      this.threeView = null;
    }
    this.graphView = null;
    this.sliceView = null;
    this.isMounted = false;
  }

  public pause(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public resume(): void {
    if (this.isMounted && this.animationId === null) {
      this.startSimulationLoop();
      this.handleResize();
    }
  }

  public resize(): void {
    this.handleResize();
  }

  private handleResize(): void {
    this.threeView?.handleResize();
    this.graphView?.handleResize();
    this.sliceView?.handleResize();
  }

  private startSimulationLoop(): void {
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dtSeconds = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const result = this.engine.step(dtSeconds);

      // Render views
      this.threeView?.render();
      this.graphView?.render();
      this.sliceView?.render();

      // Update HUD values
      this.updateHUD(result);

      this.animationId = requestAnimationFrame(loop);
    };

    this.pause();
    this.animationId = requestAnimationFrame(loop);
  }

  private updateHUD(result: ReturnType<typeof this.engine.step>): void {
    const elW = document.getElementById('poynting-val-w');
    const elDw = document.getElementById('poynting-val-dw');
    const elFlux = document.getElementById('poynting-val-flux');
    const elJoule = document.getElementById('poynting-val-joule');

    if (elW) elW.textContent = `${result.storedEnergy.toFixed(3)} J`;
    if (elDw) {
      const sign = result.timeDerivative > 0 ? '+' : '';
      elDw.textContent = `${sign}${result.timeDerivative.toFixed(3)} W`;
      elDw.style.color = result.timeDerivative < 0 ? '#f87171' : '#38bdf8';
    }
    if (elFlux) elFlux.textContent = `${result.flux.totalOutwardFlux.toFixed(3)} W`;
    if (elJoule) elJoule.textContent = `${result.joulePower.toFixed(3)} W`;
  }

  private renderMathHUD(): void {
    const mathContainer = document.getElementById('poynting-formula-box');
    if (!mathContainer) return;

    if (this.isMathJapaneseMode) {
      mathContainer.innerHTML = `
        <div class="intuitive-japanese-box">
          <span class="part part-dwdt" id="katex-part-dwdt">【1秒あたりの箱のエネルギー変化 <span class="badge-sub">dW/dt</span>】</span>
          <span class="operator">＝</span>
          <span class="part part-joule" id="katex-part-joule">−【電線で熱として消費された分 <span class="badge-sub">∫ j・E</span>】</span>
          <span class="operator">−</span>
          <span class="part part-flux" id="katex-part-flux">【壁を突き破って逃げた光の束 <span class="badge-sub">∮ S・dA</span>】</span>
        </div>
      `;
    } else {
      mathContainer.innerHTML = `
        <div class="katex-formula-interactive">
          <span class="katex-segment part-dwdt" id="katex-part-dwdt" title="箱の中のエネルギー変化率">\\frac{dW}{dt}</span>
          <span class="katex-symbol"> = </span>
          <span class="katex-segment part-joule" id="katex-part-joule" title="ジュール熱損失">-\\int_V \\boldsymbol{j} \\cdot \\boldsymbol{E} \\, dV</span>
          <span class="katex-symbol"> - </span>
          <span class="katex-segment part-flux" id="katex-part-flux" title="境界壁から外へ逃げた光の束">\\oint_{\\partial V} \\boldsymbol{S} \\cdot d\\boldsymbol{A}</span>
        </div>
      `;
      // Render KaTeX for each segment
      const elDw = document.getElementById('katex-part-dwdt');
      const elJoule = document.getElementById('katex-part-joule');
      const elFlux = document.getElementById('katex-part-flux');

      if (elDw) katex.render('\\frac{dW}{dt}', elDw, { throwOnError: false });
      if (elJoule) katex.render('-\\int_V \\boldsymbol{j} \\cdot \\boldsymbol{E} \\, dV', elJoule, { throwOnError: false });
      if (elFlux) katex.render('-\\oint_{\\partial V} \\boldsymbol{S} \\cdot d\\boldsymbol{A}', elFlux, { throwOnError: false });
    }

    this.bindHoverHighlights();
  }

  private bindHoverHighlights(): void {
    const elDw = document.getElementById('katex-part-dwdt');
    const elJoule = document.getElementById('katex-part-joule');
    const elFlux = document.getElementById('katex-part-flux');

    elDw?.addEventListener('mouseenter', () => {
      if (this.threeView) this.threeView.highlightTarget = 'volume';
      if (this.graphView) this.graphView.highlightSeries = 'stored';
    });
    elDw?.addEventListener('mouseleave', () => {
      if (this.threeView) this.threeView.highlightTarget = 'none';
      if (this.graphView) this.graphView.highlightSeries = 'all';
    });

    elFlux?.addEventListener('mouseenter', () => {
      if (this.threeView) this.threeView.highlightTarget = 'boundary';
      if (this.graphView) this.graphView.highlightSeries = 'escaped';
    });
    elFlux?.addEventListener('mouseleave', () => {
      if (this.threeView) this.threeView.highlightTarget = 'none';
      if (this.graphView) this.graphView.highlightSeries = 'all';
    });

    elJoule?.addEventListener('mouseenter', () => {
      if (this.threeView) this.threeView.highlightTarget = 'source';
      if (this.graphView) this.graphView.highlightSeries = 'joule';
    });
    elJoule?.addEventListener('mouseleave', () => {
      if (this.threeView) this.threeView.highlightTarget = 'none';
      if (this.graphView) this.graphView.highlightSeries = 'all';
    });
  }

  private bindUIEvents(): void {
    // 1. Math / Japanese Toggle
    const btnToggleMath = document.getElementById('btn-poynting-toggle-math');
    btnToggleMath?.addEventListener('click', () => {
      this.isMathJapaneseMode = !this.isMathJapaneseMode;
      btnToggleMath.textContent = this.isMathJapaneseMode ? '📐 数式モード' : '🇯🇵 直感日本語モード';
      this.renderMathHUD();
    });

    // 2. Play / Pause & Reset
    const btnPlayPause = document.getElementById('btn-poynting-play-pause') as HTMLButtonElement | null;
    btnPlayPause?.addEventListener('click', () => {
      this.engine.isPaused = !this.engine.isPaused;
      if (btnPlayPause) {
        btnPlayPause.textContent = this.engine.isPaused ? '▶ 再開' : '⏸ 一時停止';
        btnPlayPause.classList.toggle('active', this.engine.isPaused);
      }
    });

    const btnReset = document.getElementById('btn-poynting-reset');
    btnReset?.addEventListener('click', () => {
      this.engine.reset();
    });

    // 3. Source Type Buttons
    const btnSourceDipole = document.getElementById('btn-poynting-src-dipole');
    const btnSourceWire = document.getElementById('btn-poynting-src-wire');
    const btnSourcePlane = document.getElementById('btn-poynting-src-plane');

    const updateSourceButtons = (activeType: string) => {
      [btnSourceDipole, btnSourceWire, btnSourcePlane].forEach((btn) => {
        btn?.classList.toggle('active', btn.dataset.src === activeType);
      });
    };

    btnSourceDipole?.addEventListener('click', () => {
      this.engine.setSourceType('dipole');
      updateSourceButtons('dipole');
    });

    btnSourceWire?.addEventListener('click', () => {
      this.engine.setSourceType('wire');
      updateSourceButtons('wire');
    });

    btnSourcePlane?.addEventListener('click', () => {
      this.engine.setSourceType('planeWave');
      updateSourceButtons('planeWave');
    });

    // 4. Box Size Slider
    const boxSizeSlider = document.getElementById('poynting-box-size-slider') as HTMLInputElement | null;
    const boxSizeVal = document.getElementById('poynting-box-size-val');
    boxSizeSlider?.addEventListener('input', () => {
      const val = parseFloat(boxSizeSlider.value);
      this.engine.setBoxHalfSize(val);
      this.threeView?.updateBoxGeometry();
      if (boxSizeVal) boxSizeVal.textContent = `${(val * 2).toFixed(1)} m`;
    });

    // 5. Frequency Slider
    const freqSlider = document.getElementById('poynting-freq-slider') as HTMLInputElement | null;
    const freqVal = document.getElementById('poynting-freq-val');
    freqSlider?.addEventListener('input', () => {
      const val = parseFloat(freqSlider.value);
      this.engine.source.frequency = val;
      if (freqVal) freqVal.textContent = `${val.toFixed(2)} Hz`;
    });

    // 6. View Mode Tabs (3D / 2D Slice / Split)
    const tab3D = document.getElementById('poynting-tab-3d');
    const tabSlice = document.getElementById('poynting-tab-slice');
    const tabSplit = document.getElementById('poynting-tab-split');
    const stageWrapper = document.getElementById('poynting-canvas-wrapper');

    const switchPoyntingView = (mode: '3d' | 'slice' | 'split') => {
      if (!stageWrapper) return;
      stageWrapper.className = `canvas-wrapper view-${mode}`;
      [tab3D, tabSlice, tabSplit].forEach((t) => t?.classList.remove('active'));
      if (mode === '3d') tab3D?.classList.add('active');
      if (mode === 'slice') tabSlice?.classList.add('active');
      if (mode === 'split') tabSplit?.classList.add('active');
      this.handleResize();
    };

    tab3D?.addEventListener('click', () => switchPoyntingView('3d'));
    tabSlice?.addEventListener('click', () => switchPoyntingView('slice'));
    tabSplit?.addEventListener('click', () => switchPoyntingView('split'));

    // 7. 3D Quick Controls
    const btn3DAutoRotate = document.getElementById('btn-poynting-autorotate');
    const btn3DResetCam = document.getElementById('btn-poynting-reset-cam');

    btn3DAutoRotate?.addEventListener('click', () => {
      if (this.threeView) {
        this.threeView.autoRotate = !this.threeView.autoRotate;
        btn3DAutoRotate.classList.toggle('active', this.threeView.autoRotate);
      }
    });

    btn3DResetCam?.addEventListener('click', () => {
      this.threeView?.resetCamera();
    });

    // 8. Learning Scenario Controls
    const btnToggleLearning = document.getElementById('btn-poynting-toggle-learning');
    const btnPrevStep = document.getElementById('btn-poynting-prev-step') as HTMLButtonElement | null;
    const btnNextStep = document.getElementById('btn-poynting-next-step') as HTMLButtonElement | null;
    const btnExitLearning = document.getElementById('btn-poynting-exit-learning');

    btnToggleLearning?.addEventListener('click', () => this.scenario.toggle());
    btnExitLearning?.addEventListener('click', () => this.scenario.exit());
    btnPrevStep?.addEventListener('click', () => this.scenario.prevStep());
    btnNextStep?.addEventListener('click', () => {
      if (this.scenario.getCurrentStepIndex() === this.scenario.getSteps().length - 1) {
        this.scenario.exit();
        document.getElementById('poynting-challenges-card')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        this.scenario.nextStep();
      }
    });

    this.scenario.onModeToggle((active) => {
      const banner = document.getElementById('poynting-learning-banner');
      banner?.classList.toggle('hidden', !active);
      btnToggleLearning?.classList.toggle('active', active);
      if (btnToggleLearning) {
        btnToggleLearning.textContent = active ? '✕ 学習モード中' : '🎓 探究学習モード';
      }
    });

    this.scenario.onStepChange((step) => {
      this.updateScenarioStepUI(step);
    });

    // Step dots
    document.querySelectorAll('.poynting-step-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-step') || '0', 10);
        this.scenario.goToStep(idx);
      });
    });

    // 9. Challenges Card Controls
    document.querySelectorAll('.btn-poynting-challenge-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const id = tab.getAttribute('data-id');
        if (id) {
          const ch = this.challengeManager.selectChallenge(id);
          if (ch) {
            document.querySelectorAll('.btn-poynting-challenge-tab').forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');
            this.renderCurrentChallenge(ch);
          }
        }
      });
    });

    const btnRandomCh = document.getElementById('btn-poynting-random-challenge');
    btnRandomCh?.addEventListener('click', () => {
      const newCh = this.challengeManager.generateRandomChallenge();
      this.renderCurrentChallenge(newCh);
    });

    const btnSubmit = document.getElementById('btn-poynting-submit-answer');
    btnSubmit?.addEventListener('click', () => {
      const ch = this.challengeManager.getCurrentChallenge();
      let val: string | number = '';
      if (ch.questionType === 'direction') {
        const checked = document.querySelector<HTMLInputElement>('input[name="poynting-dir-answer"]:checked');
        val = checked?.value || '';
      } else {
        const input = document.getElementById('poynting-input-answer') as HTMLInputElement | null;
        val = input?.value || '';
      }

      const res = this.challengeManager.evaluateAnswer(val);
      const feedback = document.getElementById('poynting-challenge-feedback');
      if (feedback) {
        feedback.classList.remove('hidden', 'success', 'error');
        feedback.classList.add(res.isCorrect ? 'success' : 'error');
        feedback.textContent = res.feedbackMessage;
      }
    });

    const btnToggleSol = document.getElementById('btn-poynting-toggle-solution');
    const drawerSol = document.getElementById('poynting-solution-drawer');
    btnToggleSol?.addEventListener('click', () => {
      drawerSol?.classList.toggle('hidden');
    });

    const btnSyncPreset = document.getElementById('btn-poynting-sync-stage');
    btnSyncPreset?.addEventListener('click', () => {
      const ch = this.challengeManager.getCurrentChallenge();
      this.engine.setSourceType(ch.simulationPreset.sourceType);
      this.engine.setBoxHalfSize(ch.simulationPreset.boxSize);
      this.engine.source.frequency = ch.simulationPreset.frequency;
      this.threeView?.updateBoxGeometry();
      updateSourceButtons(ch.simulationPreset.sourceType);
    });
  }

  private updateScenarioStepUI(step: PoyntingScenarioStep): void {
    const badge = document.getElementById('poynting-step-badge');
    const title = document.getElementById('poynting-step-title');
    const goal = document.getElementById('poynting-step-goal');
    const narrative = document.getElementById('poynting-step-narrative');
    const actionText = document.getElementById('poynting-step-action-text');

    if (badge) badge.textContent = step.badge;
    if (title) title.textContent = step.title;
    if (goal) goal.textContent = `🎯 目標: ${step.goal}`;
    if (narrative) narrative.textContent = step.narrative;
    if (actionText) actionText.textContent = step.recommendedAction;

    // Step dots
    document.querySelectorAll('.poynting-step-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === step.stepIndex - 1);
      dot.classList.toggle('completed', idx < step.stepIndex - 1);
    });

    // Auto setup
    if (step.autoSetup) {
      if (step.autoSetup.sourceType) {
        this.engine.setSourceType(step.autoSetup.sourceType);
      }
      if (step.autoSetup.boxSize) {
        this.engine.setBoxHalfSize(step.autoSetup.boxSize);
        this.threeView?.updateBoxGeometry();
      }
      if (step.autoSetup.frequency) {
        this.engine.source.frequency = step.autoSetup.frequency;
      }
    }
  }

  private renderCurrentChallenge(ch: PoyntingChallenge): void {
    const title = document.getElementById('poynting-challenge-title');
    const diff = document.getElementById('poynting-challenge-diff');
    const desc = document.getElementById('poynting-challenge-desc');
    const answerContainer = document.getElementById('poynting-challenge-answer-container');
    const feedback = document.getElementById('poynting-challenge-feedback');
    const drawerSol = document.getElementById('poynting-solution-drawer');
    const solStepsList = document.getElementById('poynting-solution-steps-list');

    if (title) title.textContent = ch.title;
    if (diff) diff.textContent = ch.difficulty;
    if (desc) desc.innerHTML = ch.descriptionHtml;
    if (feedback) feedback.classList.add('hidden');
    if (drawerSol) drawerSol.classList.add('hidden');

    // Answer input form rendering
    if (answerContainer) {
      if (ch.questionType === 'direction' && ch.directionOptions) {
        answerContainer.innerHTML = `
          <div class="poynting-radio-list">
            ${ch.directionOptions
              .map(
                (opt, i) => `
              <label class="radio-label">
                <input type="radio" name="poynting-dir-answer" value="${opt.value}" ${i === 0 ? 'checked' : ''} />
                <span>${opt.label}</span>
              </label>
            `
              )
              .join('')}
          </div>
        `;
      } else {
        answerContainer.innerHTML = `
          <div class="form-row">
            <label for="poynting-input-answer" class="form-label">計算したワット数 [W]:</label>
            <input type="text" id="poynting-input-answer" class="challenge-input" placeholder="例: 3.3" required />
          </div>
        `;
      }
    }

    // Solution steps rendering
    if (solStepsList) {
      solStepsList.innerHTML = ch.solutionSteps
        .map(
          (s) => `
        <div class="poynting-solution-step-item">
          <h5>${s.stepTitle}</h5>
          <p>${s.explanation}</p>
          ${s.mathLatex ? `<div class="solution-math">${s.mathLatex}</div>` : ''}
        </div>
      `
        )
        .join('');

      // Render math formulas inside steps
      solStepsList.querySelectorAll('.solution-math').forEach((el) => {
        katex.render(el.textContent || '', el as HTMLElement, { displayMode: true, throwOnError: false });
      });
    }
  }
}
