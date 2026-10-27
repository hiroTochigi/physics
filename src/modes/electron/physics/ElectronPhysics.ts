import { ScalePreset } from '../ElectronTypes.ts';

export const CONSTANTS = {
  // Elementary charge (C)
  e: 1.602176634e-19,
  // Vacuum permittivity (F/m)
  epsilon0: 8.8541878128e-12,
  // Speed of light (m/s)
  c: 299792458,
  // Electron mass (kg)
  m_e: 9.1093837015e-31,
  // 1 eV in Joules
  eV: 1.602176634e-19,
  // Rest energy in Joules (m_e * c^2)
  get E0_Joules(): number {
    return this.m_e * this.c * this.c; // ~8.1871e-14 J
  },
  // Rest energy in MeV (~0.511 MeV)
  get E0_MeV(): number {
    return this.E0_Joules / (1e6 * this.eV);
  },
  // Classical electron radius 4pi (~2.8179e-15 m)
  get r_classical_4pi(): number {
    return (this.e * this.e) / (4 * Math.PI * this.epsilon0 * this.E0_Joules);
  },
  // Classical electron radius 8pi (Image formula 4.2.17: ~1.409e-15 m)
  get r_classical_8pi(): number {
    return (this.e * this.e) / (8 * Math.PI * this.epsilon0 * this.E0_Joules);
  }
};

export const PRESETS: ScalePreset[] = [
  {
    id: 'bohr',
    name: '水素原子（ボーア半径）',
    radius: 5.29e-11,
    description: '原子のスケール。電子が原子核の周りを回る軌道サイズ。',
    tag: '10⁻¹⁰ m'
  },
  {
    id: 'compton',
    name: 'コンプトン波長',
    radius: 2.43e-12,
    description: '量子力学で電子が波として振る舞うときの波長スケール。',
    tag: '10⁻¹² m'
  },
  {
    id: 'classical_4pi',
    name: '★ 電子の古典半径 (4π)',
    radius: CONSTANTS.r_classical_4pi,
    description: '静電エネルギーと質量等価エネルギー mc² がジャスト釣り合う半径！',
    tag: '2.82 fm'
  },
  {
    id: 'classical_8pi',
    name: '球殻モデルの古典半径 (8π)',
    radius: CONSTANTS.r_classical_8pi,
    description: '電荷が球殻表面のみに分布すると仮定した自己エネルギーモデル（1.41 fm）',
    tag: '1.41 fm'
  },
  {
    id: 'experiment_limit',
    name: '素粒子実験の測定限界',
    radius: 1.0e-18,
    description: '最新の加速器で測定しても電子の大きさはこの極限より見つからない！',
    tag: '10⁻¹⁸ m'
  },
  {
    id: 'singularity',
    name: '⚠ 点電荷 (R = 0)',
    radius: 0,
    description: '大きさゼロの点電荷と仮定すると、エネルギーと質量が無限大に暴走！',
    tag: '特異点'
  }
];

export class ElectronPhysics {
  /**
   * Converts a slider value (0 to 100) to radius in meters.
   * 0 -> R = 0 (singularity)
   * 1 to 100 -> logarithmic scale from 10^-19 m to 10^-10 m
   */
  public static sliderToRadius(val: number): number {
    if (val <= 0) return 0;
    // Map val 1..100 to exponent -19 .. -10
    const exponent = -19 + ((val - 1) / 99) * 9;
    return Math.pow(10, exponent);
  }

  /**
   * Converts a radius in meters to slider value (0 to 100).
   */
  public static radiusToSlider(r: number): number {
    if (r <= 0) return 0;
    const exponent = Math.log10(r);
    const clamped = Math.max(-19, Math.min(-10, exponent));
    return 1 + ((clamped - (-19)) / 9) * 99;
  }

  /**
   * Calculates electrostatic self energy U in Joules.
   * U = e^2 / (denom * pi * epsilon0 * R)
   */
  public static calculateSelfEnergyJoules(radius: number, model: '8pi' | '4pi' = '4pi'): number {
    if (radius <= 0) return Infinity;
    const factor = model === '4pi' ? 4 : 8;
    return (CONSTANTS.e * CONSTANTS.e) / (factor * Math.PI * CONSTANTS.epsilon0 * radius);
  }

  /**
   * Calculates electrostatic self energy in MeV.
   */
  public static calculateSelfEnergyMeV(radius: number, model: '8pi' | '4pi' = '4pi'): number {
    const joules = this.calculateSelfEnergyJoules(radius, model);
    if (!isFinite(joules)) return Infinity;
    return joules / (1e6 * CONSTANTS.eV);
  }

  /**
   * Calculates equivalent mass m = U / c^2 in kg.
   */
  public static calculateEquivalentMassKg(radius: number, model: '8pi' | '4pi' = '4pi'): number {
    const joules = this.calculateSelfEnergyJoules(radius, model);
    if (!isFinite(joules)) return Infinity;
    return joules / (CONSTANTS.c * CONSTANTS.c);
  }

  /**
   * Returns the ratio of calculated energy to electron rest energy (U / m_e c^2).
   * 1.0 means perfectly balanced!
   */
  public static calculateEnergyRatio(radius: number, model: '8pi' | '4pi' = '4pi'): number {
    if (radius <= 0) return Infinity;
    const joules = this.calculateSelfEnergyJoules(radius, model);
    return joules / CONSTANTS.E0_Joules;
  }
}
