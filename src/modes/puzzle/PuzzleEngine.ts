import { PuzzleStepConfig, RuleCard } from './PuzzleTypes.ts';

export class PuzzleEngine {
  private currentStepIndex: number = 0;
  private isIntuitiveMode: boolean = false; // デフォルトは数式モードだがトグル可能
  private stepConfigs: PuzzleStepConfig[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.initSteps();
  }

  public getIsIntuitiveMode(): boolean {
    return this.isIntuitiveMode;
  }

  public toggleIntuitiveMode(): void {
    this.isIntuitiveMode = !this.isIntuitiveMode;
    this.notify();
  }

  public setIntuitiveMode(val: boolean): void {
    if (this.isIntuitiveMode !== val) {
      this.isIntuitiveMode = val;
      this.notify();
    }
  }

  private initSteps(): void {
    // 1. 積の微分カード
    const cardProductRule: RuleCard = {
      id: 'card-diff-rule',
      name: '積の微分公式',
      intuitiveName: '✂️ 二乗をバラすハサミ',
      category: 'calculus',
      icon: '🧮',
      latex: '\\frac{d}{dt}(X^2) = 2X\\frac{dX}{dt}',
      intuitiveLatex: '\\text{【二乗のかたまり】} \\to 2 \\times \\text{【実体】} \\times \\text{【変化の勢い】}',
      description: '二乗の微分を展開して、時間変化のパーツを取り出します。',
      intuitiveDescription: '貯金箱（二乗でギッチリ詰まったエネルギー）をパカッと開き、今まさに動いているパーツを取り出します。',
      physicalMeaning: 'エネルギー密度 u は電場と磁場の二乗の和。その時間微分を個々の変化に分解します。',
      targetSlotId: 'slot-diff-energy'
    };

    // 2. アンペール・マクスウェルの法則カード
    const cardAmpereMaxwell: RuleCard = {
      id: 'card-ampere-maxwell',
      name: 'アンペール・マクスウェルの法則',
      intuitiveName: '⚡ 電場変化の翻訳カード',
      category: 'maxwell',
      icon: '⚡',
      latex: '\\frac{\\partial \\mathbf{E}}{\\partial t} = \\frac{1}{\\epsilon_0}(\\nabla \\times \\mathbf{B} - \\mu_0 \\mathbf{J})',
      intuitiveLatex: '\\text{【電場の時間変化】} = \\text{【磁場の空間の渦】} - \\text{【電子の流れ(電流)】}',
      description: '電場の時間変化を「磁場の空間の渦」と「電流」に置換します。',
      intuitiveDescription: '「電場が時間とともにどう変わるか」という謎を、「磁場の渦巻き」と「電子の移動（電流）」という目に見える空間の動きに翻訳します！',
      physicalMeaning: '時間変化を、空間の渦と荷電粒子の流れ（電流）に翻訳して計算可能にします。',
      targetSlotId: 'slot-dE-dt'
    };

    // 3. ファラデーの電磁誘導の法則カード
    const cardFaraday: RuleCard = {
      id: 'card-faraday',
      name: 'ファラデーの電磁誘導の法則',
      intuitiveName: '🧲 磁場変化の翻訳カード',
      category: 'maxwell',
      icon: '🧲',
      latex: '\\frac{\\partial \\mathbf{B}}{\\partial t} = -\\nabla \\times \\mathbf{E}',
      intuitiveLatex: '\\text{【磁場の時間変化】} = -\\text{【電場の空間の渦】}',
      description: '磁場の時間変化を「電場の空間の渦」に置換します。',
      intuitiveDescription: '磁石を動かすと電気が起きるおなじみの法則！「磁場の変化」を「電場の渦巻き」へと鮮やかに翻訳します。',
      physicalMeaning: '磁場の変化は電場の渦を生むという美しい自然界の対称性を組み込みます。',
      targetSlotId: 'slot-dB-dt'
    };

    // 4. ベクトル解析の公式カード
    const cardVectorIdent: RuleCard = {
      id: 'card-vector-identity',
      name: 'ベクトル公式：外積の発散',
      intuitiveName: '📐 渦の合体ブロック',
      category: 'vector',
      icon: '📐',
      latex: '\\nabla \\cdot (\\mathbf{E} \\times \\mathbf{B}) = \\mathbf{B} \\cdot (\\nabla \\times \\mathbf{E}) - \\mathbf{E} \\cdot (\\nabla \\times \\mathbf{B})',
      intuitiveLatex: '\\text{【空間へ吹き出す波】} = \\text{【磁場×電場の渦】} - \\text{【電場×磁場の渦】}',
      description: '複雑な2つの渦の引き算を「外積の発散」という1つの形にまとめます。',
      intuitiveDescription: '電場の渦と磁場の渦が絡み合うと、実は「前へと飛んでいく光の波」になる！ゴチャゴチャしたパーツを1つにドッキングします。',
      physicalMeaning: '電場と磁場の渦の交差は、実は「電磁エネルギーの空間的な流出」そのものです。',
      targetSlotId: 'slot-vector-merge'
    };

    // 5. ポインティングベクトルの定義カード
    const cardPoyntingDef: RuleCard = {
      id: 'card-poynting-def',
      name: 'ポインティングベクトルの定義',
      intuitiveName: '🌟 光のエネルギー矢印クラウン',
      category: 'definition',
      icon: '🌟',
      latex: '\\mathbf{S} = \\frac{1}{\\mu_0} (\\mathbf{E} \\times \\mathbf{B})',
      intuitiveLatex: '\\mathbf{S} = \\text{【光や電波が運ぶエネルギー流】}',
      description: '電磁波がエネルギーを運ぶ向きと強さを表すベクトル S を定義します。',
      intuitiveDescription: '電場と磁場のスクリューが生み出す光の奔流！その名も「ポインティングベクトル S」と名付け、主役に昇格させます！',
      physicalMeaning: '電場と磁場の外積に 1/μ₀ をかけたものが、エネルギー流ベクトル S です。',
      targetSlotId: 'slot-poynting-promote'
    };

    this.stepConfigs = [
      // Step 0: スタート [ W の時間微分 ]
      {
        stepId: 'start',
        stepNumber: 1,
        totalSteps: 5,
        title: '電磁エネルギーの変形開始',
        intuitiveTitle: '👛 お財布（エネルギー）の家計簿チェック開始！',
        goal: '「積の微分公式カード」をスロットに差し込み、エネルギー密度の変化を分解しよう！',
        intuitiveGoal: '「ハサミカード」を使って、ぎっしり詰まった電磁エネルギーの袋を開けよう！',
        narrative: '電磁場にはエネルギー密度 u = ½ε₀E² + ½B²/μ₀ が蓄えられています。このエネルギーの時間変化をスッキリさせましょう。',
        intuitiveNarrative: '文系のみなさん、ようこそ！物理の数式は難解な暗号ではなく「お小遣い帳（家計簿）」と同じです。部屋の中にある電磁エネルギーが、時間が経つとどこへ行くのか？パズルで追跡しましょう！',
        cleanliness: 15,
        availableCards: [cardProductRule],
        slots: [
          {
            id: 'slot-diff-energy',
            label: '微分展開スロット',
            intuitiveLabel: '✂️ 分解スロット',
            expectedCardId: 'card-diff-rule',
            isFilled: false,
            isWarning: false,
            hint: '手札の「積の微分公式」をここへドラッグ＆ドロップ！',
            intuitiveHint: '手札の「二乗をバラすハサミ」をここに置いて、かたまりを分解しよう！'
          }
        ],
        primaryLatex: '\\frac{\\partial u}{\\partial t} = \\frac{\\partial}{\\partial t} \\left( \\frac{1}{2}\\epsilon_0 E^2 + \\frac{1}{2\\mu_0} B^2 \\right)',
        intuitiveLatex: '\\text{【部屋のエネルギー変化】} = \\frac{\\partial}{\\partial t} \\Big( \\text{【電場のエネルギー】} + \\text{【磁場のエネルギー】} \\Big)',
        annotationLatex: 'u: \\text{電磁エネルギー密度}',
        intuitiveAnnotationLatex: '\\text{💡 お財布の中身：電場と磁場が持っているエネルギーの合計}',
        energyFlowIntensity: 0.15,
        budgetAnalogy: '👛 お財布の今月残高の減り具合をチェック中...'
      },

      // Step 1: 微分展開後（赤点滅アラート発生）
      {
        stepId: 'differentiated',
        stepNumber: 2,
        totalSteps: 5,
        title: '⚠️ 未知の時間変化アラート！',
        intuitiveTitle: '🚨 赤点滅警告！「時間変化」のままでは追跡不能！',
        goal: '赤く点滅している時間変化スロットに「マクスウェル方程式」カードを差し込もう！',
        intuitiveGoal: '赤くパルス点滅している2つのスロットに「マクスウェルの翻訳カード」を差し込もう！',
        narrative: '微分を実行した結果、E・(∂E/∂t) と B・(∂B/∂t) が現れました。しかし時間微分のままではエネルギーがどう空間を動くか計算できません！マクスウェルの法則で空間の渦に変換してください。',
        intuitiveNarrative: '「時間変化（∂/∂t）」という未知のパーツが現れ、システムが警告しています！「何秒後にどうなるか」は直接見えないため、マクスウェル方程式を使って「空間の渦巻き」という目に見える形に翻訳してあげましょう！',
        cleanliness: 30,
        availableCards: [cardAmpereMaxwell, cardFaraday],
        slots: [
          {
            id: 'slot-dE-dt',
            label: '∂E/∂t スロット (アンペール則)',
            intuitiveLabel: '⚡ 電場変化スロット',
            expectedCardId: 'card-ampere-maxwell',
            isFilled: false,
            isWarning: true,
            hint: '⚡「アンペール・マクスウェルの法則」カードを差し込んで電場の変化を空間の渦に！',
            intuitiveHint: '⚡「電場変化の翻訳カード」を差し込んで、空間の渦と電流に変えよう！'
          },
          {
            id: 'slot-dB-dt',
            label: '∂B/∂t スロット (ファラデー則)',
            intuitiveLabel: '🧲 磁場変化スロット',
            expectedCardId: 'card-faraday',
            isFilled: false,
            isWarning: true,
            hint: '🧲「ファラデーの電磁誘導の法則」カードを差し込んで磁場の変化を電場の渦に！',
            intuitiveHint: '🧲「磁場変化の翻訳カード」を差し込んで、電場の渦に変えよう！'
          }
        ],
        primaryLatex: '\\frac{\\partial u}{\\partial t} = \\epsilon_0 \\mathbf{E} \\cdot \\color{#ef4444}{\\frac{\\partial \\mathbf{E}}{\\partial t}} + \\frac{1}{\\mu_0} \\mathbf{B} \\cdot \\color{#ef4444}{\\frac{\\partial \\mathbf{B}}{\\partial t}}',
        intuitiveLatex: '\\text{【エネルギー変化】} = \\text{電場} \\times \\color{#ef4444}{\\text{【未知の電場変化】}} + \\text{磁場} \\times \\color{#ef4444}{\\text{【未知の磁場変化】}}',
        annotationLatex: '\\text{赤色パーツ：時間変化が未解決（計算不能！）}',
        intuitiveAnnotationLatex: '\\text{⚠️ 赤色部分：このままでは空間をどう流れるか分かりません！翻訳カードが必要！}',
        energyFlowIntensity: 0.35,
        budgetAnalogy: '🚨 レシートが見当たらない出金（使途不明金）が発生！マクスウェル帳簿で照合中...'
      },

      // Step 2: マクスウェル則置換後 ＆ ジュール熱分離
      {
        stepId: 'joule_extracted',
        stepNumber: 3,
        totalSteps: 5,
        title: '空間の渦と電流への置換完了！',
        intuitiveTitle: '☕ ジュール熱（抵抗による熱損失）が判明！',
        goal: '生じた「電流の項 (J・E)」を回収トレイに移し、渦の項をまとめよう！',
        intuitiveGoal: '電熱器で使われた「熱（J・E）」が判明！残った「渦の項」を合体させよう！',
        narrative: '時間変化が「磁場の渦 (∇×B)」「電場の渦 (∇×E)」そして「電流 (J)」に置換されました！電流 J・E は導線の抵抗熱（ジュール熱）として失われるエネルギーです。',
        intuitiveNarrative: '翻訳完了！出金の理由の1つが判明しました！「-J・E」は、電気がヒーターやスマホの回路を通るときに発生する「熱（ジュール熱）」です！エネルギーの一部はこうして熱になって部屋を温めていたのです。',
        cleanliness: 55,
        availableCards: [cardVectorIdent],
        slots: [
          {
            id: 'slot-vector-merge',
            label: 'ベクトル解析合体スロット',
            intuitiveLabel: '📐 渦の合体スロット',
            expectedCardId: 'card-vector-identity',
            isFilled: false,
            isWarning: false,
            hint: '📐「ベクトル公式：外積の発散」を重ねて、2つの渦を1つの外積に合体！',
            intuitiveHint: '📐「渦の合体ブロック」をセットして、2つの渦を外へ飛ぶ波に合体させよう！'
          }
        ],
        primaryLatex: '\\frac{\\partial u}{\\partial t} = -\\mathbf{J} \\cdot \\mathbf{E} - \\frac{1}{\\mu_0} \\left[ \\mathbf{E} \\cdot (\\nabla \\times \\mathbf{B}) - \\mathbf{B} \\cdot (\\nabla \\times \\mathbf{E}) \\right]',
        intuitiveLatex: '\\text{【エネルギー変化】} = \\underbrace{-\\text{【電熱線で使った熱】}}_{\\text{ジュール熱 (J・E)}} - \\text{【電場と磁場の交差する渦】}',
        annotationLatex: '-\\mathbf{J} \\cdot \\mathbf{E} : \\text{ジュール熱（抵抗による仕事）}',
        intuitiveAnnotationLatex: '\\text{💡 3Dプレビューの下部にオレンジ色の熱粒子が立ち上っています！}',
        energyFlowIntensity: 0.60,
        budgetAnalogy: '☕ 支出その1: 電気代・ヒーター代（ジュール熱）として使われた分が確定！'
      },

      // Step 3: ベクトル公式で合体昇格
      {
        stepId: 'vector_merged',
        stepNumber: 4,
        totalSteps: 5,
        title: '外積の発散へ合体昇格！',
        intuitiveTitle: '✨ 2つの渦が合体！外へ吹き出す「光の波」へ！',
        goal: '金色の合体ブロックに「ポインティングベクトルの定義カード」を当てはめよう！',
        intuitiveGoal: '合体した波に「ポインティングのクラウン」を載せて、主役 S に昇格させよう！',
        narrative: 'ゴチャゴチャしていた2つの渦の差が、美しい「外積の発散 ∇・(E×B)」に合体しました！仕上げに、エネルギー流の主役「ポインティングベクトル S」へと昇格させましょう！',
        intuitiveNarrative: '見てください！複雑だった電場と磁場の渦が、カチャッと合体して「外積（E×B）」という1つの形にまとまりました！この外積こそが、空間を突き進む光（電磁波）の進行方向です！',
        cleanliness: 80,
        availableCards: [cardPoyntingDef],
        slots: [
          {
            id: 'slot-poynting-promote',
            label: 'ポインティング昇格スロット',
            intuitiveLabel: '🌟 主役昇格スロット',
            expectedCardId: 'card-poynting-def',
            isFilled: false,
            isWarning: false,
            hint: '🌟「ポインティングベクトルの定義」カードをドロップして最終昇格！',
            intuitiveHint: '🌟「光のエネルギー矢印クラウン」を載せて、ベクトル S を誕生させよう！'
          }
        ],
        primaryLatex: '\\frac{\\partial u}{\\partial t} = -\\mathbf{J} \\cdot \\mathbf{E} - \\nabla \\cdot \\left( \\frac{1}{\\mu_0} \\mathbf{E} \\times \\mathbf{B} \\right)',
        intuitiveLatex: '\\text{【エネルギー変化】} = -\\text{【使った熱】} - \\nabla \\cdot \\text{【光となって飛んでいく波】}',
        annotationLatex: '\\mathbf{E} \\times \\mathbf{B} : \\text{電磁波がエネルギーを運ぶ方向}',
        intuitiveAnnotationLatex: '\\text{💡 ∇・ は「外へ吹き出す」という意味の記号です！}',
        energyFlowIntensity: 0.85,
        budgetAnalogy: '🚪 支出その2: 窓から電磁波（光）として外へ逃げていく分をまとめる準備が完了！'
      },

      // Step 4: 完成（ポインティングの定理）
      {
        stepId: 'completed',
        stepNumber: 5,
        totalSteps: 5,
        title: '🎉 スッキリ度 100%！ポインティングの定理が完成！',
        intuitiveTitle: '🏆 完璧！エネルギーの家計簿（保存則）が完成！',
        goal: '電磁エネルギーの保存則が完全に導出されました！3Dビューでエネルギー流を確認しよう！',
        intuitiveGoal: '「減った分 ＝ 逃げた光 ＋ 使った熱」の完璧な等式が完成！3Dで光の奔流を見よう！',
        narrative: '完璧です！複雑だった方程式が「内部エネルギー変化」＋「外へ流出するエネルギー流 (∇・S)」＝「熱損失 (-J・E)」という極めてシンプルな保存則にまとまりました！',
        intuitiveNarrative: 'おめでとうございます！難解に見えた数式は、実は「お部屋のエネルギーが減った分（∂u/∂t）は、窓から逃げた光（∇・S）と、ヒーターで温まった熱（J・E）の合計にピッタリ一致する」という、あまりにも当たり前で美しい「宇宙の家計簿」だったのです！',
        cleanliness: 100,
        availableCards: [],
        slots: [],
        primaryLatex: '\\frac{\\partial u}{\\partial t} + \\nabla \\cdot \\mathbf{S} = -\\mathbf{J} \\cdot \\mathbf{E}',
        intuitiveLatex: '\\underbrace{\\frac{\\partial u}{\\partial t}}_{\\text{部屋のエネルギー減少}} + \\underbrace{\\nabla \\cdot \\mathbf{S}}_{\\text{窓から逃げた光の波}} = \\underbrace{-\\mathbf{J} \\cdot \\mathbf{E}}_{\\text{ヒーターで使った熱}}',
        annotationLatex: '\\underbrace{\\frac{\\partial u}{\\partial t}}_{\\text{エネルギー蓄積}} + \\underbrace{\\nabla \\cdot \\mathbf{S}}_{\\text{空間への流出}} = \\underbrace{-\\mathbf{J} \\cdot \\mathbf{E}}_{\\text{熱損失}}',
        intuitiveAnnotationLatex: '\\text{✨「減った分」＋「逃げた分」＝「使った分」！宇宙の帳尻が完璧に合いました！}',
        energyFlowIntensity: 1.0,
        budgetAnalogy: '📊 家計簿完成: 残高減少 100円 ＝ 光として逃亡 70円 ＋ ヒーター熱 30円（帳尻ピッタリ！）'
      }
    ];
  }

  public getCurrentStep(): PuzzleStepConfig {
    return this.stepConfigs[this.currentStepIndex];
  }

  public getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  public getTotalSteps(): number {
    return this.stepConfigs.length;
  }

  public canInsertCard(slotId: string, cardId: string): boolean {
    const currentStep = this.getCurrentStep();
    const slot = currentStep.slots.find(s => s.id === slotId);
    if (!slot) return false;
    return slot.expectedCardId === cardId;
  }

  public insertCard(slotId: string, cardId: string): boolean {
    const currentStep = this.getCurrentStep();
    const slot = currentStep.slots.find(s => s.id === slotId);
    if (!slot || slot.expectedCardId !== cardId) {
      return false;
    }

    slot.isFilled = true;
    slot.filledCardId = cardId;
    slot.isWarning = false;

    // 現在ステップ内のすべてのスロットが埋まったか判定
    const allFilled = currentStep.slots.every(s => s.isFilled);
    if (allFilled) {
      this.advanceStep();
    } else {
      this.notify();
    }
    return true;
  }

  public advanceStep(): void {
    if (this.currentStepIndex < this.stepConfigs.length - 1) {
      this.currentStepIndex++;
      this.notify();
    }
  }

  public prevStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      const step = this.stepConfigs[this.currentStepIndex];
      step.slots.forEach(s => {
        s.isFilled = false;
        s.filledCardId = undefined;
        if (step.stepId === 'differentiated') {
          s.isWarning = true;
        }
      });
      this.notify();
    }
  }

  public reset(): void {
    this.currentStepIndex = 0;
    this.initSteps();
    this.notify();
  }

  public setStep(index: number): void {
    if (index >= 0 && index < this.stepConfigs.length) {
      this.currentStepIndex = index;
      this.notify();
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
