import { Particle } from './physics/Particle.ts';
import { CoulombEngine } from './physics/CoulombEngine.ts';
import { Canvas2DView } from './render/Canvas2DView.ts';
import { GraphView } from './render/GraphView.ts';
import { ThreePotentialView } from './render/ThreePotentialView.ts';
import { LearningScenario } from './learning/LearningScenario.ts';
import { ChallengeManager } from './learning/ChallengeManager.ts';
import { Challenge } from './learning/ChallengeTypes.ts';
import { SimulatorMode, SimulatorModeMetadata } from '../../core/Types.ts';
import { CoulombHUDView } from './ui/CoulombHUDView.ts';
import { CoulombControlsBinder } from './ui/CoulombControlsBinder.ts';
import { CoulombScenarioPresenter } from './learning/CoulombScenarioPresenter.ts';
import { CoulombChallengePresenter } from './learning/CoulombChallengePresenter.ts';

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

  // Sub-presenters and binders
  private hudView: CoulombHUDView;
  private controlsBinder: CoulombControlsBinder | null = null;
  private scenarioPresenter: CoulombScenarioPresenter | null = null;
  private challengePresenter: CoulombChallengePresenter | null = null;

  private isInitialized: boolean = false;

  constructor() {
    this.engine = new CoulombEngine();
    const initialP1 = new Particle('q₁', 260, 260, 2.0, 26);
    const initialP2 = new Particle('q₂', 520, 260, -2.0, 26);
    this.particles = [initialP1, initialP2];

    this.learningScenario = new LearningScenario();
    this.challengeManager = new ChallengeManager();
    this.hudView = new CoulombHUDView();
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

    // Initialize presenters and binders
    this.controlsBinder = new CoulombControlsBinder(
      this.particles,
      () => this.canvasView,
      () => this.threeView,
      {
        onStateChange: () => this.updateUI(),
        onSwitchView: (mode) => this.switchView(mode),
        onResetPreset: () => this.resetPresetPosition()
      }
    );
    this.controlsBinder.bind();

    this.scenarioPresenter = new CoulombScenarioPresenter(this.learningScenario, {
      particles: this.particles,
      getCanvasView: () => this.canvasView,
      getThreeView: () => this.threeView,
      switchView: (mode) => this.switchView(mode),
      updateUI: () => this.updateUI()
    });
    this.scenarioPresenter.bind();

    this.challengePresenter = new CoulombChallengePresenter(this.challengeManager, {
      engine: this.engine,
      particles: this.particles,
      getCanvasView: () => this.canvasView,
      updateUI: () => this.updateUI()
    });
    this.challengePresenter.bind();

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

    // Update HUD & KaTeX formulas via HUDView
    this.hudView.update(p1, p2, forceRes);

    // Update F-r Graph
    this.graphView.update(forceRes.distanceMeters, forceRes.magnitude, p1.q, p2.q);

    // Update 3D Potential Landscape
    this.threeView.updateSurface();
  }

  public switchView(mode: '2d' | '3d' | 'split'): void {
    const canvasWrapper = document.getElementById('canvas-wrapper');
    if (canvasWrapper) {
      canvasWrapper.className = `canvas-wrapper view-${mode}`;
    }

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
      const simCanvas = document.getElementById('sim-canvas') as HTMLCanvasElement | null;
      if (simCanvas) {
        const w = simCanvas.width / (window.devicePixelRatio || 1);
        if (w > 0 && Math.abs(this.particles[1].x - this.particles[0].x) < w * 0.25) {
          this.canvasView?.fitParticlesToViewport(0.35, 0.65, 0.5);
        }
      }
    }

    this.canvasView?.render();
    this.threeView?.updateSurface();
    this.updateUI();
  }

  public applyChallengeToSimulator(challenge: Challenge): void {
    this.challengePresenter?.applyChallengeToSimulator(challenge);
  }

  private resetPresetPosition(): void {
    const simCanvas = document.getElementById('sim-canvas') as HTMLCanvasElement | null;
    const rect = simCanvas?.parentElement?.getBoundingClientRect();
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
  }
}
