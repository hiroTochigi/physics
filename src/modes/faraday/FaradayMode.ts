import { SimulatorMode, SimulatorModeMetadata } from '../../core/Types.ts';
import { FaradayState } from './FaradayTypes.ts';
import { FARADAY_PRESETS } from './physics/FaradayPhysics.ts';
import { FaradayCanvasView } from './render/FaradayCanvasView.ts';
import { FaradayHUDView } from './ui/FaradayHUDView.ts';

export class FaradayMode implements SimulatorMode {
  public readonly metadata: SimulatorModeMetadata = {
    id: 'faraday',
    name: 'ファラデー幾何学',
    englishTitle: 'Faraday: Lines of Force, Flux Tubes & Equipotentials',
    icon: '🧲',
    subtitle: '電気力線と等電位面の幾何学 &bull; <span class="math-expr">$\\vec{E} \\perp \\text{等高線} \\quad (E \\Delta S = \\text{一定})$</span>',
    description: '「ホースを絞ると水流が激しくなるように、電気力管が狭まると電場が強まる！」登山の等高線とボール滑降で、90°直交と電束保存を体感する。',
    mathFormula: 'E \\Delta S = E\' \\Delta S\', \\quad \\vec{E} \\cdot d\\vec{r} = 0'
  };

  private container: HTMLElement | null = null;
  private canvasView: FaradayCanvasView | null = null;
  private hudView: FaradayHUDView | null = null;
  private isMounted: boolean = false;

  private state: FaradayState = {
    currentMission: 'step1_potential_hill',
    viewMode: 'intuitive',
    presetId: 'dipole',
    charges: FARADAY_PRESETS[0].charges.map((c, idx) => ({
      id: `c_${idx}`,
      x: c.x,
      y: c.y,
      q: c.q,
      radius: 14
    })),
    showEquipotentialLines: true,
    showFieldLines: true,
    showParticles: true,
    showFluxTube: false,
    fluxTubeSqueeze: 0.6,
    soundEnabled: true,
    cursorPotential: 0,
    cursorEFieldMag: 0,
    cursorAngleDeg: 90.0,
    cursorInnerProduct: 0,
    sniperSnappedCount: 0,
    sniperBadgeUnlocked: false,
    testBalls: [],
    is3DSurfaceView: false
  };

  public mount(container?: HTMLElement): void {
    if (this.isMounted) return;
    this.isMounted = true;

    const root = container || document.getElementById('faraday-mode-view');
    if (!root) {
      console.error('FaradayMode: Container not found');
      return;
    }
    this.container = root;

    // 1. Mount HUD View
    this.hudView = new FaradayHUDView(
      root,
      this.state,
      (newState) => {
        this.state = newState;
        if (this.canvasView) {
          this.canvasView.updateState(newState);
        }
      },
      () => {
        if (this.canvasView) {
          this.canvasView.launchTestBall();
        }
      }
    );
    this.hudView.mount();

    // 2. Mount Canvas View
    const canvasContainer = root.querySelector<HTMLElement>('#faraday-canvas-container');
    const canvas = root.querySelector<HTMLCanvasElement>('#faraday-canvas');
    if (canvasContainer && canvas) {
      this.canvasView = new FaradayCanvasView(
        canvasContainer,
        canvas,
        this.state,
        (newState) => {
          this.state = newState;
          this.hudView?.updateState(newState);
        }
      );
    }

    // 3. Bind resize
    window.addEventListener('resize', this.handleResize);
  }

  public unmount(): void {
    if (!this.isMounted) return;
    this.isMounted = false;

    window.removeEventListener('resize', this.handleResize);

    if (this.canvasView) {
      this.canvasView.stop();
      this.canvasView = null;
    }

    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
  }

  public resize(_width: number, _height: number): void {
    if (this.canvasView) {
      this.canvasView.resize();
    }
  }

  private handleResize = (): void => {
    if (this.canvasView) {
      this.canvasView.resize();
    }
  };
}
