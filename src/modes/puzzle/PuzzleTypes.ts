export type PuzzleStepId =
  | 'start'              // 初期状態: [ ∂u/∂t ]
  | 'differentiated'      // 微分展開後: E*(∂E/∂t) + B*(∂B/∂t) (赤点滅アラート)
  | 'maxwell_ampere'      // アンペール則適用: ∂E/∂t 置換
  | 'maxwell_faraday'     // ファラデー則適用: ∂B/∂t 置換 (両方揃うと渦と電流へ)
  | 'joule_extracted'     // ジュール熱分離: -J・E 回収
  | 'vector_merged'       // ベクトル公式適用: ∇・(E×B) へ合体
  | 'completed';          // 昇格完成: ∂u/∂t + ∇・S = -J・E (スッキリ度 100%)

export interface RuleCard {
  id: string;
  name: string;
  intuitiveName: string; // 文系向けわかりやすい名前（例: "二乗をバラすハサミ"）
  category: 'calculus' | 'maxwell' | 'vector' | 'definition';
  icon: string;
  latex: string;
  intuitiveLatex: string; // 文系向け日本語ブロック式
  description: string;
  intuitiveDescription: string;
  physicalMeaning: string;
  targetSlotId: string;
}

export interface FormulaSlot {
  id: string;
  label: string;
  intuitiveLabel: string;
  expectedCardId: string;
  isFilled: boolean;
  filledCardId?: string;
  isWarning: boolean; // 赤点滅フラグ
  hint: string;
  intuitiveHint: string;
}

export interface PuzzleStepConfig {
  stepId: PuzzleStepId;
  stepNumber: number;
  totalSteps: number;
  title: string;
  intuitiveTitle: string; // 文系向けタイトル
  goal: string;
  intuitiveGoal: string;   // 文系向け目標（例: お小遣い帳の支出を分解しよう！）
  narrative: string;
  intuitiveNarrative: string; // 文系向けたとえ話
  cleanliness: number; // 0% - 100%
  availableCards: RuleCard[];
  slots: FormulaSlot[];
  primaryLatex: string;
  intuitiveLatex: string; // 直感日本語モード時の数式ブロック
  annotationLatex?: string;
  intuitiveAnnotationLatex?: string;
  energyFlowIntensity: number; // 3Dビュー連動強度 (0.0 - 1.0)
  budgetAnalogy: string; // 家計簿たとえ（例: "財布のお金(100円)の行方"）
}
