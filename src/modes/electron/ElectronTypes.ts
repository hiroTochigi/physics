export type ElectronMissionStep = 'mission1_field' | 'mission2_balance' | 'mission3_divergence';

export interface ScalePreset {
  id: string;
  name: string;
  radius: number; // in meters, 0 for point charge
  description: string;
  tag: string;
}

export interface ElectronState {
  currentMission: ElectronMissionStep;
  radiusMeters: number; // current radius in meters, 0 = singularity
  logScaleValue: number; // slider value from 0 to 100
  isPointCharge: boolean;
  modelType: '8pi' | '4pi'; // Image used 8pi (4.2.17), standard classical radius is 4pi
  viewMode: 'intuitive' | 'math';
  showFieldLines: boolean;
  showEnergyAura: boolean;
  isBalanced: boolean;
  isDiverged: boolean;
  isGameMode: boolean; // Blind balance mini-game
  gameCleared: boolean;
  showScaleCard: boolean; // Everyday size comparison card
  soundEnabled: boolean;
}
