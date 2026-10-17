import { SimulatorMode, SimulatorModeMetadata } from '../../core/Types.ts';
import { PuzzleEngine } from './PuzzleEngine.ts';
import { PuzzleHUDView } from './ui/PuzzleHUDView.ts';
import { PuzzleFieldPreview } from './render/PuzzleFieldPreview.ts';

export class PuzzleMode implements SimulatorMode {
  public readonly metadata: SimulatorModeMetadata = {
    id: 'puzzle',
    name: '数式パズル',
    englishTitle: 'Math Block Puzzle',
    icon: '🧩',
    subtitle: 'マクスウェル方程式で式をスッキリさせよう &bull; <span class="math-expr">$\\frac{\\partial u}{\\partial t} + \\nabla \\cdot \\mathbf{S} = -\\mathbf{J} \\cdot \\mathbf{E}$</span>',
    description: '微分やマクスウェル方程式のカードをスロットに差し込み、ポインティングの定理を導出するノードベース数式パズル。',
    mathFormula: '\\frac{\\partial u}{\\partial t} + \\nabla \\cdot \\mathbf{S} = -\\mathbf{J} \\cdot \\mathbf{E}'
  };

  private engine: PuzzleEngine;
  private hudView: PuzzleHUDView | null = null;
  private preview3D: PuzzleFieldPreview | null = null;
  private container: HTMLElement | null = null;
  private unsubscribeEngine: (() => void) | null = null;

  constructor() {
    this.engine = new PuzzleEngine();
  }

  public mount(container?: HTMLElement): void {
    const root = container || document.getElementById('puzzle-mode-view');
    if (!root) {
      console.error('PuzzleMode: Container element not found.');
      return;
    }
    this.container = root;

    // Mount HUD View
    this.hudView = new PuzzleHUDView(root, this.engine);
    this.hudView.mount();

    // Mount 3D Preview
    this.mount3DPreview();

    // Subscribe to sync 3D preview intensity with engine step
    this.unsubscribeEngine = this.engine.subscribe(() => {
      this.sync3DState();
    });

    // Initial 3D state sync
    this.sync3DState();
  }

  private sync3DState(): void {
    if (!this.preview3D) return;
    const step = this.engine.getCurrentStep();
    const isWarning = step.stepId === 'differentiated';
    const showJoule = step.stepId === 'joule_extracted' || step.stepId === 'vector_merged' || step.stepId === 'completed';
    this.preview3D.setStepState(step.energyFlowIntensity, isWarning, showJoule);
  }

  private mount3DPreview(): void {
    const previewContainer = this.container?.querySelector<HTMLElement>('#puzzle-3d-container');
    const previewCanvas = this.container?.querySelector<HTMLCanvasElement>('#puzzle-3d-canvas');
    if (previewContainer && previewCanvas) {
      this.preview3D = new PuzzleFieldPreview(previewContainer, previewCanvas);
    }
  }

  public unmount(): void {
    if (this.unsubscribeEngine) {
      this.unsubscribeEngine();
      this.unsubscribeEngine = null;
    }
    if (this.preview3D) {
      this.preview3D.dispose();
      this.preview3D = null;
    }
    if (this.hudView) {
      this.hudView.unmount();
      this.hudView = null;
    }
    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
  }

  public resize(_width: number, _height: number): void {
    if (this.preview3D && this.container) {
      const previewContainer = this.container.querySelector<HTMLElement>('#puzzle-3d-container');
      if (previewContainer) {
        this.preview3D.resize(previewContainer.clientWidth, previewContainer.clientHeight);
      }
    }
  }
}
