export interface SimulatorModeMetadata {
  readonly id: string;
  readonly name: string;
  readonly englishTitle: string;
  readonly icon: string;
  readonly subtitle: string;
  readonly description: string;
  readonly mathFormula: string;
}

export interface SimulatorMode {
  readonly metadata: SimulatorModeMetadata;

  /**
   * Mounts the mode and starts simulation/rendering loops.
   */
  mount(container?: HTMLElement): Promise<void> | void;

  /**
   * Unmounts the mode, stops animation frames, and releases WebGL/DOM resources.
   */
  unmount(): void;

  /**
   * Handles container resize event.
   */
  resize?(width: number, height: number): void;

  /**
   * Temporarily pauses physics and rendering when tab or mode is inactive.
   */
  pause?(): void;

  /**
   * Resumes physics and rendering.
   */
  resume?(): void;
}
