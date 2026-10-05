import { Particle } from '../physics/Particle.ts';
import { Canvas2DView } from '../render/Canvas2DView.ts';
import { ThreePotentialView } from '../render/ThreePotentialView.ts';
import { LearningScenario } from './LearningScenario.ts';
import { ScenarioStep } from './ChallengeTypes.ts';

export interface CoulombScenarioPresenterContext {
  particles: Particle[];
  getCanvasView: () => Canvas2DView | null;
  getThreeView: () => ThreePotentialView | null;
  switchView: (mode: '2d' | '3d' | 'split') => void;
  updateUI: () => void;
}

export class CoulombScenarioPresenter {
  private scenario: LearningScenario;
  private ctx: CoulombScenarioPresenterContext;
  private currentHighlightedEl: HTMLElement | null = null;

  constructor(scenario: LearningScenario, ctx: CoulombScenarioPresenterContext) {
    this.scenario = scenario;
    this.ctx = ctx;
  }

  public bind(): void {
    const btnToggleLearning = document.getElementById('btn-toggle-learning');
    const learningBanner = document.getElementById('learning-stepper-banner');
    const btnPrevStep = document.getElementById('btn-prev-step');
    const btnNextStep = document.getElementById('btn-next-step');
    const btnExitLearning = document.getElementById('btn-exit-learning');
    const btnBannerAction = document.getElementById('btn-banner-action');

    btnBannerAction?.addEventListener('click', () => {
      const p1 = this.ctx.particles[0];
      const cv = this.ctx.getCanvasView();
      cv?.spawnTestParticle(p1.x + 35, p1.y - 15, 0.4);
      cv?.spawnTestParticle(p1.x + 35, p1.y + 15, 0.4);
    });

    this.scenario.onModeToggle((active) => {
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

    this.scenario.onStepChange((step) => {
      this.updateLearningStepUI(step);
    });

    btnToggleLearning?.addEventListener('click', () => this.scenario.toggle());
    btnExitLearning?.addEventListener('click', () => this.scenario.exit());
    btnPrevStep?.addEventListener('click', () => this.scenario.prevStep());
    btnNextStep?.addEventListener('click', () => {
      if (this.scenario.getCurrentStepIndex() === this.scenario.getSteps().length - 1) {
        this.scenario.exit();
        document.getElementById('challenges-card')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        this.scenario.nextStep();
      }
    });

    document.querySelectorAll('.step-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        const stepIdx = parseInt(dot.getAttribute('data-step') || '0', 10);
        this.scenario.goToStep(stepIdx);
      });
    });
  }

  public clearTutorialHighlight(): void {
    if (this.currentHighlightedEl) {
      this.currentHighlightedEl.classList.remove('tutorial-highlight');
      this.currentHighlightedEl = null;
    }
  }

  public updateLearningStepUI(step: ScenarioStep): void {
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
        step.stepIndex === this.scenario.getSteps().length
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

    const canvasView = this.ctx.getCanvasView();
    const threeView = this.ctx.getThreeView();

    if (step.autoSetup) {
      if (step.autoSetup.view) this.ctx.switchView(step.autoSetup.view);
      if (step.autoSetup.q1 !== undefined) this.ctx.particles[0].q = step.autoSetup.q1;
      if (step.autoSetup.q2 !== undefined) this.ctx.particles[1].q = step.autoSetup.q2;
      if (step.autoSetup.vectors !== undefined && canvasView) {
        canvasView.showVectors = step.autoSetup.vectors;
        const chkVectors = document.getElementById('chk-vectors') as HTMLInputElement | null;
        if (chkVectors) chkVectors.checked = step.autoSetup.vectors;
      }
      if (step.autoSetup.fieldLines !== undefined && canvasView) {
        canvasView.showFieldLines = step.autoSetup.fieldLines;
        const chkFieldLines = document.getElementById('chk-field-lines') as HTMLInputElement | null;
        if (chkFieldLines) chkFieldLines.checked = step.autoSetup.fieldLines;
      }
      if (step.autoSetup.efield !== undefined && canvasView) {
        canvasView.showEFieldGrid = step.autoSetup.efield;
        const chkEField = document.getElementById('chk-efield') as HTMLInputElement | null;
        if (chkEField) chkEField.checked = step.autoSetup.efield;
      }
      canvasView?.render();
      this.ctx.updateUI();
    }

    const btnBannerAction = document.getElementById('btn-banner-action');
    if (btnBannerAction) {
      btnBannerAction.style.display = step.stepIndex === 3 ? 'inline-flex' : 'none';
    }

    if (step.stepIndex === 3) {
      canvasView?.fitParticlesToViewport(0.28, 0.72, 0.52);
      threeView?.setOptimalSplitCamera();
      threeView?.updateSurface();

      setTimeout(() => {
        canvasView?.clearTestParticles();
        threeView?.clearTestParticleMeshes();
        const p1 = this.ctx.particles[0];
        canvasView?.spawnTestParticle(p1.x + 40, p1.y - 18, 0.4);
        canvasView?.spawnTestParticle(p1.x + 35, p1.y + 18, 0.4);
        canvasView?.spawnTestParticle(p1.x + 50, p1.y, 0.4);
      }, 120);
    }
  }
}
