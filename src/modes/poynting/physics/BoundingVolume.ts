import { EMFieldSource } from './EMFieldSource.ts';

export interface FaceFlux {
  posX: number;
  negX: number;
  posY: number;
  negY: number;
  posZ: number;
  negZ: number;
  totalOutwardFlux: number;
}

export interface VolumeIntegralResult {
  storedEnergy: number; // W(t)
  timeDerivative: number; // dW/dt
  flux: FaceFlux; // Surface integral of S . dA
  joulePower: number; // Integral of j . E
  residualError: number; // |dW/dt + j.E + Flux|
}

export class BoundingVolume {
  // Half-dimensions of the rectangular box: [-Lx, Lx] x [-Ly, Ly] x [-Lz, Lz]
  public halfSizeX: number = 2.2;
  public halfSizeY: number = 2.2;
  public halfSizeZ: number = 2.2;

  // Numerical sampling resolution
  private surfaceGridPoints: number = 8; // 8x8 per face
  private volumeGridPoints: number = 6; // 6x6x6 for volume

  private prevEnergy: number = 0;
  private initialized: boolean = false;

  public setSize(halfSize: number): void {
    this.halfSizeX = halfSize;
    this.halfSizeY = halfSize;
    this.halfSizeZ = halfSize;
    this.initialized = false;
  }

  /**
   * Computes the outward Poynting vector flux through each of the 6 bounding box faces.
   */
  public computeFaceFluxes(source: EMFieldSource, t: number): FaceFlux {
    const N = this.surfaceGridPoints;
    const Lx = this.halfSizeX;
    const Ly = this.halfSizeY;
    const Lz = this.halfSizeZ;

    let fluxPosX = 0;
    let fluxNegX = 0;
    let fluxPosY = 0;
    let fluxNegY = 0;
    let fluxPosZ = 0;
    let fluxNegZ = 0;

    // 1. Faces at x = +Lx (normal: +x) and x = -Lx (normal: -x)
    const dyX = (2 * Ly) / N;
    const dzX = (2 * Lz) / N;
    const areaElemX = dyX * dzX;

    for (let i = 0; i < N; i++) {
      const y = -Ly + (i + 0.5) * dyX;
      for (let j = 0; j < N; j++) {
        const z = -Lz + (j + 0.5) * dzX;
        // +X face (normal: +1, 0, 0)
        const samplePosX = source.evaluate(Lx, y, z, t);
        fluxPosX += samplePosX.S.x * areaElemX;

        // -X face (normal: -1, 0, 0)
        const sampleNegX = source.evaluate(-Lx, y, z, t);
        fluxNegX += -sampleNegX.S.x * areaElemX;
      }
    }

    // 2. Faces at y = +Ly (normal: +y) and y = -Ly (normal: -y)
    const dxY = (2 * Lx) / N;
    const dzY = (2 * Lz) / N;
    const areaElemY = dxY * dzY;

    for (let i = 0; i < N; i++) {
      const x = -Lx + (i + 0.5) * dxY;
      for (let j = 0; j < N; j++) {
        const z = -Lz + (j + 0.5) * dzY;
        // +Y face (normal: 0, +1, 0)
        const samplePosY = source.evaluate(x, Ly, z, t);
        fluxPosY += samplePosY.S.y * areaElemY;

        // -Y face (normal: 0, -1, 0)
        const sampleNegY = source.evaluate(x, -Ly, z, t);
        fluxNegY += -sampleNegY.S.y * areaElemY;
      }
    }

    // 3. Faces at z = +Lz (normal: +z) and z = -Lz (normal: -z)
    const dxZ = (2 * Lx) / N;
    const dyZ = (2 * Ly) / N;
    const areaElemZ = dxZ * dyZ;

    for (let i = 0; i < N; i++) {
      const x = -Lx + (i + 0.5) * dxZ;
      for (let j = 0; j < N; j++) {
        const y = -Ly + (j + 0.5) * dyZ;
        // +Z face (normal: 0, 0, +1)
        const samplePosZ = source.evaluate(x, y, Lz, t);
        fluxPosZ += samplePosZ.S.z * areaElemZ;

        // -Z face (normal: 0, 0, -1)
        const sampleNegZ = source.evaluate(x, y, -Lz, t);
        fluxNegZ += -sampleNegZ.S.z * areaElemZ;
      }
    }

    const totalOutwardFlux = fluxPosX + fluxNegX + fluxPosY + fluxNegY + fluxPosZ + fluxNegZ;

    return {
      posX: fluxPosX,
      negX: fluxNegX,
      posY: fluxPosY,
      negY: fluxNegY,
      posZ: fluxPosZ,
      negZ: fluxNegZ,
      totalOutwardFlux
    };
  }

  /**
   * Evaluates volume integrals of electromagnetic energy W = int_V u dV
   * and Joule loss P_joule = int_V (j . E) dV.
   */
  public computeVolumeIntegrals(
    source: EMFieldSource,
    t: number,
    dt: number
  ): VolumeIntegralResult {
    const M = this.volumeGridPoints;
    const Lx = this.halfSizeX;
    const Ly = this.halfSizeY;
    const Lz = this.halfSizeZ;

    const dx = (2 * Lx) / M;
    const dy = (2 * Ly) / M;
    const dz = (2 * Lz) / M;
    const dV = dx * dy * dz;

    let storedEnergy = 0;
    let joulePower = 0;

    for (let i = 0; i < M; i++) {
      const x = -Lx + (i + 0.5) * dx;
      for (let j = 0; j < M; j++) {
        const y = -Ly + (j + 0.5) * dy;
        for (let k = 0; k < M; k++) {
          const z = -Lz + (k + 0.5) * dz;
          const sample = source.evaluate(x, y, z, t);
          storedEnergy += sample.energyDensity * dV;
          joulePower += sample.jouleDensity * dV;
        }
      }
    }

    // Compute numerical time derivative dW/dt
    let dWdt = 0;
    if (this.initialized && dt > 1e-5) {
      dWdt = (storedEnergy - this.prevEnergy) / dt;
    } else {
      this.initialized = true;
    }

    this.prevEnergy = storedEnergy;

    // Compute flux
    const flux = this.computeFaceFluxes(source, t);

    // Poynting theorem residual: dW/dt + P_joule + Flux = 0
    const residualError = dWdt + joulePower + flux.totalOutwardFlux;

    return {
      storedEnergy,
      timeDerivative: dWdt,
      flux,
      joulePower,
      residualError
    };
  }

  public resetDerivative(): void {
    this.initialized = false;
  }
}
