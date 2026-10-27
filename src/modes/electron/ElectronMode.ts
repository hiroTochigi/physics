import { SimulatorMode, SimulatorModeMetadata } from '../../core/Types.ts';
import { ElectronState } from './ElectronTypes.ts';
import { CONSTANTS, ElectronPhysics } from './physics/ElectronPhysics.ts';
import { ElectronCanvasView } from './render/ElectronCanvasView.ts';
import { ElectronHUDView } from './ui/ElectronHUDView.ts';

export class ElectronMode implements SimulatorMode {
  public readonly metadata: SimulatorModeMetadata = {
    id: 'electron',
    name: '電子の古典半径',
    englishTitle: 'Classical Electron Radius & Self-Energy',
    icon: '⚛️',
    subtitle: '電子の自己エネルギーと古典半径 &bull; <span class="math-expr">$r_e = \\frac{e^2}{4\\pi\\varepsilon_0 m_e c^2}$</span>',
    description: '「電子を点にすると体重が無限大!?」アインシュタインの E=mc² と天秤を合わせて古典電子半径を発見し、点電荷の破綻と朝永理論に迫る。',
    mathFormula: 'r_e = \\frac{e^2}{4\\pi\\varepsilon_0 m_e c^2}'
  };

  private container: HTMLElement | null = null;
  private canvasView: ElectronCanvasView | null = null;
  private hudView: ElectronHUDView | null = null;
  private isMounted: boolean = false;

  private state: ElectronState = {
    currentMission: 'mission2_balance',
    radiusMeters: CONSTANTS.r_classical_4pi,
    logScaleValue: ElectronPhysics.radiusToSlider(CONSTANTS.r_classical_4pi),
    isPointCharge: false,
    modelType: '4pi',
    viewMode: 'intuitive',
    showFieldLines: true,
    showEnergyAura: true,
    isBalanced: true,
    isDiverged: false,
    isGameMode: false,
    gameCleared: false,
    showScaleCard: false,
    soundEnabled: true
  };

  public mount(container?: HTMLElement): void {
    if (this.isMounted) return;
    this.isMounted = true;

    const root = container || document.getElementById('electron-mode-view');
    if (!root) {
      console.error('ElectronMode: Container not found');
      return;
    }
    this.container = root;

    // 1. Mount HUD View
    this.hudView = new ElectronHUDView(root, this.state, (newState) => {
      this.state = newState;
      if (this.canvasView) {
        this.canvasView.updateState(newState);
      }
    });
    this.hudView.mount();

    // 2. Mount Canvas View
    const canvasContainer = root.querySelector<HTMLElement>('#electron-canvas-container');
    const canvas = root.querySelector<HTMLCanvasElement>('#electron-canvas');
    if (canvasContainer && canvas) {
      this.canvasView = new ElectronCanvasView(canvasContainer, canvas, this.state);
    }

    // 3. Bind window resize listener
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
