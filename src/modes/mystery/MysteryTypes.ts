export type MysteryPhase =
  | 'intro'           // 事件発生・初期状況確認
  | 'investigate_1'   // 現場検証1：床のヒーター調査
  | 'investigate_2'   // 現場検証2：石英窓・光の抜け穴調査
  | 'accusation'      // 捜査会議：証拠照合・帳尻合わせ
  | 'solved';         // 事件解決・ポインティングの定理の公式化

export type ToolType = 'inspect' | 'loupe' | 'thermal';

export interface EvidenceItem {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  locationName: string;
  physicsType: 'joule_heat' | 'poynting_flux';
  energyJoules: number;
  mathSymbol: string;
  mathLatex: string;
  description: string;
  discovered: boolean;
}

export interface DialogueMessage {
  speaker: 'narrator' | 'assistant' | 'detective';
  speakerName: string;
  avatar: string;
  text: string;
  actionPrompt?: string;
  suggestedTool?: ToolType;
  focusTarget?: 'heater' | 'window' | 'antenna' | 'room';
}

export interface MysteryState {
  currentPhase: MysteryPhase;
  dialogueIndex: number;
  selectedTool: ToolType;
  initialEnergy: number;      // 100 J
  remainingEnergy: number;    // 20 J
  missingEnergy: number;      // 80 J
  evidences: Record<string, EvidenceItem>;
  slottedEvidenceIds: {
    jouleHeat: string | null;
    poyntingFlux: string | null;
  };
  isSolved: boolean;
}
