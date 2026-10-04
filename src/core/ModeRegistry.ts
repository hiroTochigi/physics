import { SimulatorMode } from './Types.ts';

export class ModeRegistry {
  private static modes: Map<string, SimulatorMode> = new Map();

  public static register(mode: SimulatorMode): void {
    this.modes.set(mode.metadata.id, mode);
  }

  public static get(id: string): SimulatorMode | undefined {
    return this.modes.get(id);
  }

  public static getAll(): SimulatorMode[] {
    return Array.from(this.modes.values());
  }

  public static has(id: string): boolean {
    return this.modes.has(id);
  }
}
