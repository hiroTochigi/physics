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

  /**
   * Calculate Electric Field E = (k_e * q) / r^2 at any coordinate (x, y)
   */
  public calculateElectricField(x: number, y: number, particles: Particle[]): { ex: number; ey: number; magnitude: number } {
    let totalEx = 0;
    let totalEy = 0;

    for (const p of particles) {
      if (Math.abs(p.q) < 1e-6) continue;

      const dx = x - p.x;
      const dy = y - p.y;
      const distPx = Math.sqrt(dx * dx + dy * dy);
      const distM = distPx / this.pixelsPerMeter;

      const rEff2 = distM * distM + this.softeningDistance * this.softeningDistance;
      const qCoulomb = p.q * 1e-6;

      const eMag = (CoulombEngine.K_E * qCoulomb) / rEff2;

      const safeDistPx = Math.max(0.1, distPx);
      const ux = dx / safeDistPx;
      const uy = dy / safeDistPx;

      totalEx += eMag * ux;
      totalEy += eMag * uy;
    }

    const magnitude = Math.hypot(totalEx, totalEy);
    return { ex: totalEx, ey: totalEy, magnitude };
  }

  /**
   * Calculate electric field lines using numerical integration
   */
  public calculateFieldLines(particles: Particle[], width: number, height: number): Vector2D[][] {
    const lines: Vector2D[][] = [];
    const activeParticles = particles.filter((p) => Math.abs(p.q) > 0.05);
    if (activeParticles.length === 0) return lines;

    const positiveParticles = activeParticles.filter((p) => p.q > 0);
    const negativeParticles = activeParticles.filter((p) => p.q < 0);

    const ds = 4;
    const maxSteps = 240;

    const trace = (startX: number, startY: number, sign: number): Vector2D[] => {
      const line: Vector2D[] = [{ x: startX, y: startY }];
      let cx = startX;
      let cy = startY;

      for (let s = 0; s < maxSteps; s++) {
        const field = this.calculateElectricField(cx, cy, activeParticles);
        if (field.magnitude < 1e-5) break;

        const ux = (field.ex / field.magnitude) * sign;
        const uy = (field.ey / field.magnitude) * sign;

        // Runge-Kutta 2nd order (midpoint)
        const midX = cx + ux * (ds * 0.5);
        const midY = cy + uy * (ds * 0.5);
        const midField = this.calculateElectricField(midX, midY, activeParticles);
        const midMag = Math.hypot(midField.ex, midField.ey);
        if (midMag < 1e-5) break;

        const mx = (midField.ex / midMag) * sign;
        const my = (midField.ey / midMag) * sign;

        cx += mx * ds;
        cy += my * ds;

        line.push({ x: cx, y: cy });

        if (cx < -40 || cx > width + 40 || cy < -40 || cy > height + 40) {
          break;
        }

        let hit = false;
        for (const p of activeParticles) {
          const d = Math.hypot(cx - p.x, cy - p.y);
          if (d <= p.radius + 3) {
            hit = true;
            break;
          }
        }
        if (hit) break;
      }

      return line;
    };

    // 1. Trace from positive particles
    for (const p of positiveParticles) {
      const numLines = Math.min(24, Math.max(8, Math.round(p.q * 4)));
      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2;
        const sx = p.x + Math.cos(angle) * (p.radius + 3);
        const sy = p.y + Math.sin(angle) * (p.radius + 3);
        const line = trace(sx, sy, 1);
        if (line.length > 2) {
          lines.push(line);
        }
      }
    }

    // 2. If no positive particles, trace outward from negative charges in -E direction then reverse
    if (positiveParticles.length === 0) {
      for (const p of negativeParticles) {
        const numLines = Math.min(24, Math.max(8, Math.round(Math.abs(p.q) * 4)));
        for (let i = 0; i < numLines; i++) {
          const angle = (i / numLines) * Math.PI * 2;
          const sx = p.x + Math.cos(angle) * (p.radius + 3);
          const sy = p.y + Math.sin(angle) * (p.radius + 3);
          const line = trace(sx, sy, -1);
          if (line.length > 2) {
            line.reverse();
            lines.push(line);
          }
        }
      }
    }

    return lines;
  }
}

