export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export type SourceType = 'dipole' | 'wire' | 'planeWave';

export interface FieldSample {
  E: Vector3D;
  B: Vector3D;
  S: Vector3D; // Poynting vector (1/mu0) * (E x B)
  energyDensity: number; // u = 0.5 * (eps0 * E^2 + (1/mu0) * B^2)
  jouleDensity: number; // j . E
}

// Physical constants scaled for stable 60 FPS real-time numerical simulation
export const EPSILON_0 = 1.0;
export const MU_0 = 1.0;
export const SPEED_OF_LIGHT = 1.0; // c = 1 / sqrt(eps0 * mu0) = 1.0

export class EMFieldSource {
  public type: SourceType = 'dipole';

  // Dipole parameters
  public dipoleMoment: number = 2.5; // p0
  public frequency: number = 0.6; // omega / (2 * pi)
  public wireRadius: number = 0.8;
  public wireCurrent: number = 2.0;
  public wireResistance: number = 1.5;

  // Wave parameters
  public get omega(): number {
    return 2 * Math.PI * this.frequency;
  }

  public get wavenumber(): number {
    return this.omega / SPEED_OF_LIGHT;
  }

  public get wavelength(): number {
    return SPEED_OF_LIGHT / this.frequency;
  }

  /**
   * Evaluates electromagnetic field and Poynting vector at (x, y, z) at time t.
   */
  public evaluate(x: number, y: number, z: number, t: number): FieldSample {
    switch (this.type) {
      case 'dipole':
        return this.evaluateHertzianDipole(x, y, z, t);
      case 'wire':
        return this.evaluateDCWireResistor(x, y, z);
      case 'planeWave':
        return this.evaluatePlaneWave(x, y, z, t);
      default:
        return this.evaluateHertzianDipole(x, y, z, t);
    }
  }

  /**
   * Hertzian oscillating electric dipole analytical solution:
   * p(t) = p0 * cos(omega * t) in the z-direction.
   */
  private evaluateHertzianDipole(x: number, y: number, z: number, t: number): FieldSample {
    const softening = 0.35;
    const rSq = x * x + y * y + z * z + softening * softening;
    const r = Math.sqrt(rSq);

    const omega = this.omega;
    const k = this.wavenumber;
    const p0 = this.dipoleMoment;

    // Retarded time
    const tRet = t - (r - softening) / SPEED_OF_LIGHT;
    const phase = omega * tRet;
    const cosPhase = Math.cos(phase);
    const sinPhase = Math.sin(phase);

    // Spherical coordinates
    const cosTheta = z / r;
    const sinTheta = Math.sqrt(Math.max(0, 1 - cosTheta * cosTheta));
    const rho = Math.sqrt(x * x + y * y); // cylindrical radius
    const cosPhi = rho > 1e-6 ? x / rho : 1;
    const sinPhi = rho > 1e-6 ? y / rho : 0;

    // Analytical dipole field components (SI-scaled)
    const factorE = p0 / (4 * Math.PI * EPSILON_0);
    const factorB = (MU_0 * p0 * omega) / (4 * Math.PI);

    // Er = 2*cosTheta/(4*pi*eps0) * (cos/r^3 - k*sin/r^2)
    const Er = 2 * cosTheta * factorE * (cosPhase / (r * r * r) - (k * sinPhase) / (r * r));

    // Etheta = sinTheta/(4*pi*eps0) * (cos/r^3 - k*sin/r^2 - k^2*cos/r)
    const Etheta = sinTheta * factorE * (cosPhase / (r * r * r) - (k * sinPhase) / (r * r) - (k * k * cosPhase) / r);

    // Bphi = mu0*p0*omega*sinTheta/(4*pi) * (-sin/r^2 - k*cos/r)
    const Bphi = sinTheta * factorB * (-sinPhase / (r * r) - (k * cosPhase) / r);

    // Convert (Er, Etheta, 0) to Cartesian (Ex, Ey, Ez)
    // Ex = Er * sinTheta * cosPhi + Etheta * cosTheta * cosPhi
    // Ey = Er * sinTheta * sinPhi + Etheta * cosTheta * sinPhi
    // Ez = Er * cosTheta - Etheta * sinTheta
    const Ex = (Er * sinTheta + Etheta * cosTheta) * cosPhi;
    const Ey = (Er * sinTheta + Etheta * cosTheta) * sinPhi;
    const Ez = Er * cosTheta - Etheta * sinTheta;

    // Convert (0, 0, Bphi) to Cartesian:
    // Bx = -Bphi * sinPhi
    // By = Bphi * cosPhi
    // Bz = 0
    const Bx = -Bphi * sinPhi;
    const By = Bphi * cosPhi;
    const Bz = 0;

    // Poynting vector S = (1/mu0) * (E x B)
    const Sx = (Ey * Bz - Ez * By) / MU_0;
    const Sy = (Ez * Bx - Ex * Bz) / MU_0;
    const Sz = (Ex * By - Ey * Bx) / MU_0;

    // Energy density u = 0.5 * (eps0 * E^2 + (1/mu0) * B^2)
    const ESq = Ex * Ex + Ey * Ey + Ez * Ez;
    const BSq = Bx * Bx + By * By + Bz * Bz;
    const energyDensity = 0.5 * (EPSILON_0 * ESq + (1 / MU_0) * BSq);

    // Joule heating occurs at the dipole source core
    const sourceCoreRadius = 0.6;
    let jouleDensity = 0;
    if (r < sourceCoreRadius) {
      const antennaCurrent = p0 * omega * Math.abs(sinPhase);
      jouleDensity = 0.5 * antennaCurrent * antennaCurrent * Math.exp(-rSq / (sourceCoreRadius * sourceCoreRadius));
    }

    return {
      E: { x: Ex, y: Ey, z: Ez },
      B: { x: Bx, y: By, z: Bz },
      S: { x: Sx, y: Sy, z: Sz },
      energyDensity,
      jouleDensity
    };
  }

  /**
   * DC cylindrical wire & resistor model:
   * Current I runs in +z direction along wire of radius a.
   * Inside wire: E = Ez = V/L, B = Bphi.
   * Poynting vector points radially inward into wire, supplying Joule heat!
   */
  private evaluateDCWireResistor(x: number, y: number, z: number): FieldSample {
    const a = this.wireRadius;
    const I = this.wireCurrent;
    const R = this.wireResistance;
    const wireLength = 6.0;

    const rhoSq = x * x + y * y + 0.05 * 0.05;
    const rho = Math.sqrt(rhoSq);
    const cosPhi = x / rho;
    const sinPhi = y / rho;

    const isInsideZ = Math.abs(z) <= wireLength / 2;
    const isInsideWire = rho <= a && isInsideZ;

    // Electric field: Ez constant along wire, decays outside
    let Ez = (I * R) / wireLength;
    if (!isInsideZ) {
      Ez *= Math.exp(-Math.pow(Math.abs(z) - wireLength / 2, 2) / 2.0);
    }
    const Ex = 0;
    const Ey = 0;

    // Magnetic field Bphi: proportional to rho inside, 1/rho outside
    let Bphi = 0;
    if (rho <= a) {
      Bphi = (MU_0 * I * rho) / (2 * Math.PI * a * a);
    } else {
      Bphi = (MU_0 * I) / (2 * Math.PI * rho);
    }

    const Bx = -Bphi * sinPhi;
    const By = Bphi * cosPhi;
    const Bz = 0;

    // S = (1/mu0) * (E x B)
    // E = (0, 0, Ez), B = (Bx, By, 0)
    // Sx = -Ez * By / mu0 = -Ez * Bphi * cosPhi / mu0 (radially inward!)
    // Sy = Ez * Bx / mu0 = -Ez * Bphi * sinPhi / mu0 (radially inward!)
    // Sz = 0
    const Sx = (-Ez * By) / MU_0;
    const Sy = (Ez * Bx) / MU_0;
    const Sz = 0;

    const ESq = Ez * Ez;
    const BSq = Bx * Bx + By * By;
    const energyDensity = 0.5 * (EPSILON_0 * ESq + (1 / MU_0) * BSq);

    let jouleDensity = 0;
    if (isInsideWire) {
      // j = I / (pi * a^2), j . E = I * Ez / (pi * a^2)
      jouleDensity = (I * Ez) / (Math.PI * a * a);
    }

    return {
      E: { x: Ex, y: Ey, z: Ez },
      B: { x: Bx, y: By, z: Bz },
      S: { x: Sx, y: Sy, z: Sz },
      energyDensity,
      jouleDensity
    };
  }

  /**
   * Plane wave model propagating in +x direction:
   * E = (0, E0 * cos(k*x - omega*t), 0), B = (0, 0, B0 * cos(k*x - omega*t))
   * S = (S0, 0, 0) pointing entirely in +x direction.
   */
  private evaluatePlaneWave(x: number, _y: number, _z: number, t: number): FieldSample {
    const k = this.wavenumber;
    const omega = this.omega;
    const E0 = this.dipoleMoment * 0.8;
    const phase = k * x - omega * t;
    const cosPhase = Math.cos(phase);

    const Ey = E0 * cosPhase;
    const Bz = (E0 / SPEED_OF_LIGHT) * cosPhase;

    const Sx = (Ey * Bz) / MU_0;

    const energyDensity = 0.5 * (EPSILON_0 * Ey * Ey + (1 / MU_0) * Bz * Bz);

    return {
      E: { x: 0, y: Ey, z: 0 },
      B: { x: 0, y: 0, z: Bz },
      S: { x: Sx, y: 0, z: 0 },
      energyDensity,
      jouleDensity: 0
    };
  }
}
