export interface PoyntingScenarioStep {
  stepIndex: number;
  badge: string;
  title: string;
  goal: string;
  narrative: string;
  recommendedAction: string;
  highlightSelector?: string;
  autoSetup?: {
    sourceType?: 'dipole' | 'wire' | 'planeWave';
    frequency?: number;
    boxSize?: number;
    paused?: boolean;
    viewMode?: '3d' | 'slice' | 'split';
  };
}

export interface PoyntingChallenge {
  id: string;
  difficulty: '入門' | '基本' | '応用' | '発展';
  title: string;
  descriptionHtml: string;
  targetFluxOrPower: number; // expected answer in Watts or Joules
  tolerance: number; // e.g. 0.1 (10%)
  questionType: 'number' | 'direction';
  correctDirection?: 'inward' | 'outward' | 'current' | 'zero';
  directionOptions?: Array<{ value: string; label: string }>;
  solutionSteps: Array<{
    stepTitle: string;
    explanation: string;
    mathLatex?: string;
  }>;
  simulationPreset: {
    sourceType: 'dipole' | 'wire' | 'planeWave';
    boxSize: number;
    frequency: number;
  };
}
