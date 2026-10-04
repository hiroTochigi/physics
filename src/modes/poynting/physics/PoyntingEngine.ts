import { EMFieldSource, FieldSample } from './EMFieldSource.ts';
import { BoundingVolume, VolumeIntegralResult } from './BoundingVolume.ts';

export interface EnergyHistoryPoint {
  time: number;
  storedEnergy: number; // W
  dWdt: number; // dW/dt
  fluxOut: number; // Surface integral of S . dA
  joulePower: number; // Volume integral of j . E
  cumulativeEscaped: number; // int Flux dt
  cumulativeJoule: number; // int P_joule dt
  totalEnergyAccount: number; // W + cumulativeEscaped + cumulativeJoule
}

export class PoyntingEngine {
  public source: EMFieldSource;
  public volume: BoundingVolume;

  public currentTime: number = 0;
  public timeSpeed: number = 1.0;
  public isPaused: boolean = false;

  // Cumulative energy accounting
  public cumulativeEscapedEnergy: number = 0;
  public cumulativeJouleEnergy: number = 0;
  public initialStoredEnergy: number = 0;

  // History buffer for graph view (rolling last 120 points)
  public history: EnergyHistoryPoint[] = [];
  public maxHistoryPoints: number = 180;

  public lastResult: VolumeIntegralResult | null = null;

  constructor() {
    this.source = new EMFieldSource();
    this.volume = new BoundingVolume();
    this.reset();
  }

  public reset(): void {
    this.currentTime = 0;
    this.cumulativeEscapedEnergy = 0;
    this.cumulativeJouleEnergy = 0;
    this.history = [];
    this.volume.resetDerivative();

    // Initial evaluation
    this.lastResult = this.volume.computeVolumeIntegrals(this.source, 0, 0);
    this.initialStoredEnergy = this.lastResult.storedEnergy;
  }

  public step(dtSeconds: number): VolumeIntegralResult {
    if (this.isPaused) {
      if (!this.lastResult) {
        this.lastResult = this.volume.computeVolumeIntegrals(this.source, this.currentTime, 0);
      }
      return this.lastResult;
    }

    const dt = dtSeconds * this.timeSpeed;
    this.currentTime += dt;

    const result = this.volume.computeVolumeIntegrals(this.source, this.currentTime, dt);
    this.lastResult = result;

    // Accumulate integrals
    this.cumulativeEscapedEnergy += Math.max(0, result.flux.totalOutwardFlux) * dt;
    this.cumulativeJouleEnergy += result.joulePower * dt;

    const totalEnergyAccount =
      result.storedEnergy + this.cumulativeEscapedEnergy + this.cumulativeJouleEnergy;

    // Record into history
    this.history.push({
      time: this.currentTime,
      storedEnergy: result.storedEnergy,
      dWdt: result.timeDerivative,
      fluxOut: result.flux.totalOutwardFlux,
      joulePower: result.joulePower,
      cumulativeEscaped: this.cumulativeEscapedEnergy,
      cumulativeJoule: this.cumulativeJouleEnergy,
      totalEnergyAccount
    });

    if (this.history.length > this.maxHistoryPoints) {
      this.history.shift();
    }

    return result;
  }

  public sampleField(x: number, y: number, z: number): FieldSample {
    return this.source.evaluate(x, y, z, this.currentTime);
  }

  public setBoxHalfSize(size: number): void {
    this.volume.setSize(size);
    this.volume.resetDerivative();
  }

  public setSourceType(type: 'dipole' | 'wire' | 'planeWave'): void {
    this.source.type = type;
    this.reset();
  }
}
