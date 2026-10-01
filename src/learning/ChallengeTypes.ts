export interface SolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
  formulaLatex?: string;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: '入門' | '基本' | '応用' | '発展' | 'ランダム';
  summary: string;
  description: string;
  q1_uC: number;
  q2_uC: number;
  r_m: number;
  answerForce_N: number;
  isAttraction: boolean;
  solutionSteps: SolutionStep[];
}

export interface EvaluationResult {
  isCorrect: boolean;
  forceCorrect: boolean;
  directionCorrect: boolean;
  userForce: number;
  expectedForce: number;
  message: string;
}

export interface ScenarioStep {
  stepIndex: number;
  title: string;
  badge: string;
  goal: string;
  narrative: string;
  recommendedAction: string;
  highlightSelector?: string;
  autoSetup?: {
    q1?: number;
    q2?: number;
    view?: '2d' | '3d' | 'split';
    grid?: boolean;
    vectors?: boolean;
    fieldLines?: boolean;
    efield?: boolean;
  };
}
