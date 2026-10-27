export type FaradayMissionStep = 'step1_potential_hill' | 'step2_flux_tube' | 'step3_orthogonal_sniper';

export interface ChargePoint {
  id: string;
  x: number; // canvas center relative, e.g. -200 to +200
  y: number;
  q: number; // in Coulombs (microcoulombs scale, e.g. +1 or -1)
  radius: number;
  isDragging?: boolean;
}

export interface TestBall {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: Array<{ x: number; y: number }>;
  active: boolean;
  color: string;
}

export interface OrthogonalIntersection {
  x: number;
  y: number;
  angleDeg: number;
  eField: { ex: number; ey: number };
  tangent: { tx: number; ty: number };
  potentialVal: number;
  innerProduct: number;
}

export interface FaradayPreset {
  id: 'dipole' | 'single_positive' | 'quadrupole' | 'parallel_plates';
  name: string;
  tag: string;
  description: string;
  charges: Array<{ x: number; y: number; q: number }>;
}

export interface FaradayState {
  currentMission: FaradayMissionStep;
  viewMode: 'intuitive' | 'math';
  charges: ChargePoint[];
  presetId: 'dipole' | 'single_positive' | 'quadrupole' | 'parallel_plates';
  showEquipotentialLines: boolean;
  showFieldLines: boolean;
  showParticles: boolean;
  showFluxTube: boolean;
  fluxTubeSqueeze: number; // 0.2 (squeezed) to 1.0 (wide)
  soundEnabled: boolean;
  cursorPotential: number; // in Volts
  cursorEFieldMag: number;
  cursorAngleDeg: number; // angle between E and dr
  cursorInnerProduct: number; // E・dr
  sniperSnappedCount: number; // 0 to 3
  sniperBadgeUnlocked: boolean;
  testBalls: TestBall[];
  is3DSurfaceView: boolean;
}
