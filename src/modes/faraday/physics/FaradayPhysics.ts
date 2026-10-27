import { ChargePoint, FaradayPreset } from '../FaradayTypes.ts';

export const FARADAY_CONSTANTS = {
  k_coulomb: 8.98755e9, // N m^2 / C^2
  q_base: 1e-6, // 1 microcoulomb base scale
  softening: 14.0, // softening distance in canvas pixels
};

export const FARADAY_PRESETS: FaradayPreset[] = [
  {
    id: 'dipole',
    name: '電気双極子 (＋とー)',
    tag: '基本・電気力線の湾曲',
    description: '正電荷から噴き出した力線が美しい円弧を描いて負電荷へ吸い込まれる、電磁気学の最も基本形。',
    charges: [
      { x: -130, y: 0, q: 1 },
      { x: 130, y: 0, q: -1 }
    ]
  },
  {
    id: 'single_positive',
    name: '単独の正電荷 (富士山)',
    tag: '球対称・逆二乗則',
    description: '中心から360度放射状に広がる電気力線と、同心円の等高線。距離とともに面積が広がり電場が薄まる。',
    charges: [
      { x: 0, y: 0, q: 1 }
    ]
  },
  {
    id: 'quadrupole',
    name: '電気四重極 (2山・2谷)',
    tag: '鞍点・複雑な交差',
    description: '対角線上に配置された4つの電荷。中央に電場がゼロになる鞍点（峠）が現れ、幾何学の妙が炸裂。',
    charges: [
      { x: -100, y: -100, q: 1 },
      { x: 100, y: -100, q: -1 },
      { x: 100, y: 100, q: 1 },
      { x: -100, y: 100, q: -1 }
    ]
  },
  {
    id: 'parallel_plates',
    name: '平行平板コンデンサ',
    tag: '一様電場・まっすぐな力線',
    description: '両極板の間にできる、等間隔でまっすぐ平行な電気力線。電気力管の断面積が一定の理想空間。',
    charges: [
      { x: -130, y: -90, q: 1 },
      { x: -130, y: -30, q: 1 },
      { x: -130, y: 30, q: 1 },
      { x: -130, y: 90, q: 1 },
      { x: 130, y: -90, q: -1 },
      { x: 130, y: -30, q: -1 },
      { x: 130, y: 30, q: -1 },
      { x: 130, y: 90, q: -1 }
    ]
  }
];

export class FaradayPhysics {
  /**
   * Calculate electric potential \phi at (x, y) relative to charges center
   */
  public static calculatePotential(x: number, y: number, charges: ChargePoint[]): number {
    let phi = 0;
    const eps = FARADAY_CONSTANTS.softening;
    for (const c of charges) {
      const dx = x - c.x;
      const dy = y - c.y;
      const dist = Math.sqrt(dx * dx + dy * dy + eps * eps);
      phi += (c.q * 1000) / dist; // scale for friendly display in Volts
    }
    return phi;
  }

  /**
   * Calculate electric field vector E = -∇\phi at (x, y)
   */
  public static calculateElectricField(x: number, y: number, charges: ChargePoint[]): { ex: number; ey: number; mag: number } {
    let ex = 0;
    let ey = 0;
    const eps = FARADAY_CONSTANTS.softening;

    for (const c of charges) {
      const dx = x - c.x;
      const dy = y - c.y;
      const distSq = dx * dx + dy * dy + eps * eps;
      const dist = Math.sqrt(distSq);
      const factor = (c.q * 1000) / (distSq * dist);
      ex += factor * dx;
      ey += factor * dy;
    }

    const mag = Math.sqrt(ex * ex + ey * ey);
    return { ex, ey, mag };
  }

  /**
   * Calculate equipotential tangent vector T perpendicular to E.
   * Tangent has unit length.
   */
  public static calculateEquipotentialTangent(ex: number, ey: number, mag: number): { tx: number; ty: number } {
    if (mag < 1e-6) return { tx: 1, ty: 0 };
    return {
      tx: -ey / mag,
      ty: ex / mag
    };
  }

  /**
   * Step a test charge along electric field line (overdamped steepest descent).
   * Returns next position.
   */
  public static stepSteepestDescent(x: number, y: number, charges: ChargePoint[], stepSize: number = 3.5): { nextX: number; nextY: number; reachedSink: boolean } {
    const { ex, ey, mag } = this.calculateElectricField(x, y, charges);
    if (mag < 1e-5) {
      return { nextX: x, nextY: y, reachedSink: true };
    }

    const nextX = x + (ex / mag) * stepSize;
    const nextY = y + (ey / mag) * stepSize;

    // Check if close to any negative charge (sink)
    for (const c of charges) {
      if (c.q < 0) {
        const dx = nextX - c.x;
        const dy = nextY - c.y;
        if (Math.sqrt(dx * dx + dy * dy) < 18) {
          return { nextX, nextY, reachedSink: true };
        }
      }
    }

    return { nextX, nextY, reachedSink: false };
  }

  /**
   * Calculate electric flux tube conservation parameters
   * Given base tube area S0 and current squeeze factor s (0.2 to 1.0)
   */
  public static calculateFluxTube(squeeze: number, baseFieldE0: number = 100): {
    areaS: number;
    electricFieldE: number;
    fluxPhi: number;
    particleSpeed: number;
    flowColor: string;
  } {
    const s = Math.max(0.15, Math.min(1.0, squeeze));
    const areaS = s * 100; // arbitrary unit area
    const electricFieldE = baseFieldE0 / s;
    const fluxPhi = electricFieldE * areaS; // strictly conserved!

    // Color shift from cool blue (wide) to fiery red (squeezed)
    let flowColor = '#38bdf8'; // light blue
    if (s < 0.35) {
      flowColor = '#ef4444'; // fiery red
    } else if (s < 0.65) {
      flowColor = '#f59e0b'; // amber/yellow
    }

    const particleSpeed = (1.0 / s) * 2.0;

    return {
      areaS,
      electricFieldE,
      fluxPhi,
      particleSpeed,
      flowColor
    };
  }
}
