import { SimulatorMode } from './Types.ts';
import { ModeRegistry } from './ModeRegistry.ts';

export class AppRouter {
  private currentMode: SimulatorMode | null = null;
  private onModeChangeCallbacks: Array<(mode: SimulatorMode) => void> = [];

  constructor() {
    window.addEventListener('popstate', () => {
      const modeId = this.getModeIdFromUrl();
      this.switchMode(modeId, false);
    });
  }

  public getModeIdFromUrl(): string {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode && ModeRegistry.has(mode)) {
      return mode;
    }
    return 'coulomb'; // Default mode
  }

  public getCurrentMode(): SimulatorMode | null {
    return this.currentMode;
  }

  public onModeChange(callback: (mode: SimulatorMode) => void): void {
    this.onModeChangeCallbacks.push(callback);
  }

  public async switchMode(modeId: string, pushHistory: boolean = true): Promise<void> {
    const targetMode = ModeRegistry.get(modeId);
    if (!targetMode) {
      console.warn(`Mode "${modeId}" not found in ModeRegistry.`);
      return;
    }

    if (this.currentMode?.metadata.id === modeId) {
      return; // Already active
    }

    // 1. Unmount current mode
    if (this.currentMode) {
      try {
        this.currentMode.unmount();
      } catch (err) {
        console.error(`Error unmounting mode ${this.currentMode.metadata.id}:`, err);
      }
    }

    // 2. Update URL if requested
    if (pushHistory) {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', modeId);
      window.history.pushState({ mode: modeId }, '', url.toString());
    }

    // 3. Switch DOM views
    const allViews = document.querySelectorAll<HTMLElement>('.mode-view');
    allViews.forEach((view) => {
      if (view.dataset.modeView === modeId) {
        view.classList.remove('hidden');
        view.classList.add('active');
      } else {
        view.classList.remove('active');
        view.classList.add('hidden');
      }
    });

    // 4. Update tab buttons
    const allTabs = document.querySelectorAll<HTMLElement>('.mode-tab');
    allTabs.forEach((tab) => {
      const isActive = tab.dataset.mode === modeId;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // 5. Mount target mode
    this.currentMode = targetMode;
    const targetContainer = document.querySelector<HTMLElement>(`[data-mode-view="${modeId}"]`) || undefined;
    await targetMode.mount(targetContainer);

    // 6. Notify listeners
    for (const cb of this.onModeChangeCallbacks) {
      cb(targetMode);
    }
  }

  public init(): void {
    const initialModeId = this.getModeIdFromUrl();
    // Ensure URL has ?mode=
    const url = new URL(window.location.href);
    if (!url.searchParams.has('mode')) {
      url.searchParams.set('mode', initialModeId);
      window.history.replaceState({ mode: initialModeId }, '', url.toString());
    }

    // Bind mode tab click events
    const allTabs = document.querySelectorAll<HTMLElement>('.mode-tab');
    allTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const modeId = tab.dataset.mode;
        if (modeId) {
          this.switchMode(modeId, true);
        }
      });
    });

    this.switchMode(initialModeId, false);
  }
}
