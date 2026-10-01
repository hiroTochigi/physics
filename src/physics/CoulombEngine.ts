import { Particle, Vector2D } from './Particle.ts';

export interface ForceResult {
  magnitude: number;         // in Newtons (N)
  isRepulsion: boolean;
  isAttraction: boolean;
  distanceMeters: number;    // r in meters
  distancePixels: number;    // r in screen pixels
  forceOnP1: Vector2D;       // Vector in screen space (pixels for drawing)
  forceOnP2: Vector2D;       // Vector in screen space (pixels for drawing)
}

export class CoulombEngine {
  // Coulomb's constant: k_e ≈ 8.98755 × 10^9 N·m²/C²
  public static readonly K_E = 8.9875517923e9;

  // Pixels per meter conversion factor (e.g. 200px = 1 meter)
  public pixelsPerMeter: number = 200;

  // Softening distance in meters to prevent division by zero
  public softeningDistance: number = 0.05;

  /**
   * Calculate Coulomb interaction between two particles
   */
  public calculateForce(p1: Particle, p2: Particle): ForceResult {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distPx = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    const distMeters = distPx / this.pixelsPerMeter;

    // Charges in Coulombs (particles store in micro-Coulombs: 10^-6 C)
    const q1Coulomb = p1.q * 1e-6;
    const q2Coulomb = p2.q * 1e-6;

    const chargeProduct = q1Coulomb * q2Coulomb;
    const isRepulsion = chargeProduct > 0;
    const isAttraction = chargeProduct < 0;

    // Avoid singularity: effective distance squared
    const rEff2 = distMeters * distMeters + this.softeningDistance * this.softeningDistance;
    const forceMagnitude = (CoulombEngine.K_E * Math.abs(chargeProduct)) / rEff2;

    // Unit vector from p1 to p2
    const ux = dx / distPx;
    const uy = dy / distPx;

    // Visual arrow length mapping:
    // We map force to a pleasing pixel length [0, 160px]
    // using sub-linear / power curve to handle dynamic range
    const visualLength = this.calculateArrowLength(forceMagnitude);

    // Direction on particle 1 and particle 2
    let f1x = 0;
    let f1y = 0;
    let f2x = 0;
    let f2y = 0;

    if (isRepulsion) {
      // Repulsion: p1 pushed away from p2 (-u), p2 pushed away from p1 (+u)
      f1x = -ux * visualLength;
      f1y = -uy * visualLength;
      f2x = ux * visualLength;
      f2y = uy * visualLength;
    } else if (isAttraction) {
      // Attraction: p1 pulled toward p2 (+u), p2 pulled toward p1 (-u)
      f1x = ux * visualLength;
      f1y = uy * visualLength;
      f2x = -ux * visualLength;
      f2y = -uy * visualLength;
    }

    return {
      magnitude: forceMagnitude,
      isRepulsion,
      isAttraction,
      distanceMeters: distMeters,
      distancePixels: distPx,
      forceOnP1: { x: f1x, y: f1y },
      forceOnP2: { x: f2x, y: f2y }
    };
  }

  /**
   * Calculates theoretical force at any distance r (in meters)
   */
  public theoreticalForceAt(q1_uC: number, q2_uC: number, rMeters: number): number {
    const q1 = q1_uC * 1e-6;
    const q2 = q2_uC * 1e-6;
    const rEff2 = rMeters * rMeters + this.softeningDistance * this.softeningDistance;
    return (CoulombEngine.K_E * Math.abs(q1 * q2)) / rEff2;
  }

  /**
   * Maps force in Newtons to arrow display length in pixels
   */
  public calculateArrowLength(forceN: number): number {
    if (forceN <= 1e-7) return 0;
    // Logarithmic-linear compression for high dynamic range
    // 0.01 N -> ~40px, 0.1 N -> ~75px, 1 N -> ~115px, 10 N -> ~150px
    const minLength = 15;
    const maxLength = 160;
    const scale = Math.log10(1 + forceN * 50) * 38;
    return Math.min(maxLength, Math.max(minLength, scale));
  }

  /**
   * Format force value into a clean human-readable string with units (N, mN, μN)
   */
  public static formatForce(forceN: number): string {
    if (forceN < 1e-9) return '0.00 N';
    if (forceN < 1e-3) {
      return `${(forceN * 1e6).toFixed(2)} μN`;
    }
    if (forceN < 1) {
      return `${(forceN * 1e3).toFixed(2)} mN`;
    }
    if (forceN < 1000) {
      return `${forceN.toFixed(3)} N`;
    }
    return `${forceN.toExponential(2)} N`;
  }

  /**
   * Format distance value into a clean human-readable string (m, cm)
   */
  public static formatDistance(distMeters: number): string {
    if (distMeters < 0.1) {
      return `${(distMeters * 100).toFixed(1)} cm`;
    }
    return `${distMeters.toFixed(2)} m`;
  }
}
