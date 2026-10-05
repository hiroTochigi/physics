import { Challenge, EvaluationResult, SolutionStep } from './ChallengeTypes.ts';

export class ChallengeManager {
  // Coulomb's constant used in textbook physics: 8.99 × 10^9 N·m²/C² or ~9.0 × 10^9 N·m²/C²
  public static readonly K_TEXTBOOK = 8.98755e9;

  private presetChallenges: Challenge[] = [
    {
      id: 'challenge-1',
      title: '課題 1: 異符号の引力と基本計算',
      difficulty: '入門',
      summary: 'q₁ = +2.0 μC, q₂ = -3.0 μC, 距離 r = 1.00 m',
      description: '真空中において、電荷 $q_1 = +2.0\\,\\mu\\mathrm{C}$ と $q_2 = -3.0\\,\\mu\\mathrm{C}$ が距離 $r = 1.00\\,\\mathrm{m}$ 離れて固定されている。2つの電荷の間に働く力の大きさ $F\\,\\mathrm{[N]}$ を求め、引力か斥力かを答えよ。（クーロンの比例定数 $k = 9.0 \\times 10^9\\,\\mathrm{N\\cdot m^2/C^2}$ を用いて計算せよ）',
      q1_uC: 2.0,
      q2_uC: -3.0,
      r_m: 1.00,
      answerForce_N: 0.0539,
      isAttraction: true,
      solutionSteps: [
        {
          stepNumber: 1,
          title: '力の向き（引力か斥力か）の判定',
          explanation: '電荷 $q_1 > 0$（正）と $q_2 < 0$（負）は**異符号**です。異なる符号の電荷同士は引き合うため、働く力は **引力** です。',
          formulaLatex: 'q_1 \\cdot q_2 < 0 \\implies \\text{引力（引き合う）}'
        },
        {
          stepNumber: 2,
          title: '単位の変換（μC から C へ）',
          explanation: 'マイクロ（$\\mu$）は $10^{-6}$ 倍を表します。公式に代入する前に基本単位 クーロン $\\mathrm{[C]}$ に換算します。',
          formulaLatex: 'q_1 = 2.0 \\times 10^{-6}\\,\\mathrm{C},\\quad |q_2| = 3.0 \\times 10^{-6}\\,\\mathrm{C}'
        },
        {
          stepNumber: 3,
          title: 'クーロンの法則への代入',
          explanation: 'クーロンの法則の公式 $F = k \\frac{|q_1 q_2|}{r^2}$ に数値を代入します。',
          formulaLatex: 'F = (9.0 \\times 10^9) \\times \\frac{(2.0 \\times 10^{-6}) \\times (3.0 \\times 10^{-6})}{(1.00)^2}'
        },
        {
          stepNumber: 4,
          title: '「係数」と「10の指数」の分離計算',
          explanation: 'ミスを防ぐため、数字部分と指数の部分を分けてまとめます。',
          formulaLatex: '\\text{係数: } 9.0 \\times 2.0 \\times 3.0 = 54,\\quad \\text{指数: } 10^9 \\times 10^{-6} \\times 10^{-6} = 10^{-3}'
        },
        {
          stepNumber: 5,
          title: '最終計算結果',
          explanation: '数値を掛け合わせ、有効数字2桁でまとめます。',
          formulaLatex: 'F = 54 \\times 10^{-3}\\,\\mathrm{N} = 0.054\\,\\mathrm{N}\\ \\left(5.4 \\times 10^{-2}\\,\\mathrm{N}\\right)'
        }
      ]
    },
    {
      id: 'challenge-2',
      title: '課題 2: 同符号の斥力と逆二乗則',
      difficulty: '基本',
      summary: 'q₁ = +4.0 μC, q₂ = +2.0 μC, 距離 r = 2.00 m',
      description: '真空中において、電荷 $q_1 = +4.0\\,\\mu\\mathrm{C}$ と $q_2 = +2.0\\,\\mu\\mathrm{C}$ が距離 $r = 2.00\\,\\mathrm{m}$ 離れて置かれている。2つの電荷の間に働く力の大きさ $F\\,\\mathrm{[N]}$ を求め、引力か斥力かを判定せよ。',
      q1_uC: 4.0,
      q2_uC: 2.0,
      r_m: 2.00,
      answerForce_N: 0.018,
      isAttraction: false,
      solutionSteps: [
        {
          stepNumber: 1,
          title: '力の向きの判定',
          explanation: '両方の電荷とも正（$q_1 > 0, q_2 > 0$）で**同符号**です。同じ符号の電荷同士は互いに押し合うため、働く力は **斥力（反発力）** です。',
          formulaLatex: 'q_1 \\cdot q_2 > 0 \\implies \\text{斥力（反発する）}'
        },
        {
          stepNumber: 2,
          title: 'クーロンの法則の立式と分母の二乗',
          explanation: '距離 $r = 2.00\\,\\mathrm{m}$ なので分母は $r^2 = 2.00^2 = 4.00\\,\\mathrm{m^2}$ となります。',
          formulaLatex: 'F = (9.0 \\times 10^9) \\times \\frac{(4.0 \\times 10^{-6}) \\times (2.0 \\times 10^{-6})}{(2.00)^2}'
        },
        {
          stepNumber: 3,
          title: '計算の実行',
          explanation: '分子の $4.0$ と分母の $4.0$ が約分できるため、計算が非常に簡単になります。',
          formulaLatex: 'F = (9.0 \\times 10^9) \\times \\frac{8.0 \\times 10^{-12}}{4.0} = 9.0 \\times 2.0 \\times 10^{-3} = 0.018\\,\\mathrm{N}'
        }
      ]
    },
    {
      id: 'challenge-3',
      title: '課題 3: 距離が半分（0.50m）になったときの力の跳ね上がり',
      difficulty: '応用',
      summary: '課題2の配置から距離を半分（r = 0.50 m）に近づけたときの力',
      description: '課題2と同じ電荷（$q_1 = +4.0\\,\\mu\\mathrm{C}, q_2 = +2.0\\,\\mu\\mathrm{C}$）の距離を $r = 2.00\\,\\mathrm{m}$ から $1/4$ の距離である $r = 0.50\\,\\mathrm{m}$ まで近づけた。このとき働く力の大きさ $F\\,\\mathrm{[N]}$ はいくらになるか。',
      q1_uC: 4.0,
      q2_uC: 2.0,
      r_m: 0.50,
      answerForce_N: 0.288,
      isAttraction: false,
      solutionSteps: [
        {
          stepNumber: 1,
          title: '逆二乗則の比率による解法（スマートな考え方）',
          explanation: '距離が $2.00\\,\\mathrm{m}$ から $0.50\\,\\mathrm{m}$ へと $\\frac{1}{4}$ 倍になったとき、力は距離の2乗に反比例するため $4^2 = 16$ 倍になります。',
          formulaLatex: 'F_{new} = F_{old} \\times \\left(\\frac{2.00}{0.50}\\right)^2 = 0.018\\,\\mathrm{N} \\times 16 = 0.288\\,\\mathrm{N}'
        },
        {
          stepNumber: 2,
          title: '公式への直接代入による検証',
          explanation: '分母が $(0.50)^2 = 0.25 = \\frac{1}{4}$ となるため、分子に4を掛ける計算と同じになります。',
          formulaLatex: 'F = (9.0 \\times 10^9) \\times \\frac{8.0 \\times 10^{-12}}{0.25} = 72 \\times 4 \\times 10^{-3} = 0.288\\,\\mathrm{N}'
        }
      ]
    },
    {
      id: 'challenge-4',
      title: '課題 4: 極端な電荷差と作用・反作用の法則',
      difficulty: '発展',
      summary: 'q₁ = +10.0 μC, q₂ = +1.0 μC, 距離 r = 1.50 m',
      description: '電荷 $q_1 = +10.0\\,\\mu\\mathrm{C}$ と $q_2 = +1.0\\,\\mu\\mathrm{C}$ が距離 $r = 1.50\\,\\mathrm{m}$ 離れている。電荷 $q_1$ が受ける力 $F_1$ と電荷 $q_2$ が受ける力 $F_2$ の関係として正しいものを選び、その力の大きさ $F\\,\\mathrm{[N]}$ を計算せよ。',
      q1_uC: 10.0,
      q2_uC: 1.0,
      r_m: 1.50,
      answerForce_N: 0.040,
      isAttraction: false,
      solutionSteps: [
        {
          stepNumber: 1,
          title: '作用・反作用の法則（F₁ と F₂ の関係）',
          explanation: '電荷の大きさが10倍違っても、二者間に働く力はニュートンの第3法則（作用・反作用）により **常に同じ大きさ・逆向き** になります。すなわち $|F_1| = |F_2|$ です。',
          formulaLatex: '\\vec{F}_{1 \\to 2} = -\\vec{F}_{2 \\to 1}'
        },
        {
          stepNumber: 2,
          title: 'クーロンの法則による計算',
          explanation: '積 $|q_1 q_2| = (10.0 \\times 10^{-6}) \\times (1.0 \\times 10^{-6}) = 10.0 \\times 10^{-12}\\,\\mathrm{C^2}$、分母は $1.50^2 = 2.25$ です。',
          formulaLatex: 'F = (9.0 \\times 10^9) \\times \\frac{10.0 \\times 10^{-12}}{2.25} = \\frac{90 \\times 10^{-3}}{2.25} = 0.040\\,\\mathrm{N}'
        }
      ]
    }
  ];

  private currentChallenge: Challenge;

  constructor() {
    this.currentChallenge = this.presetChallenges[0];
  }

  public getPresetChallenges(): Challenge[] {
    return this.presetChallenges;
  }

  public getCurrentChallenge(): Challenge {
    return this.currentChallenge;
  }

  public selectChallengeById(id: string): Challenge | null {
    const found = this.presetChallenges.find(c => c.id === id);
    if (found) {
      this.currentChallenge = found;
      return found;
    }
    return null;
  }

  /**
   * Generates a completely new random challenge with valid parameters and steps
   */
  public generateRandomChallenge(): Challenge {
    // Random nonzero charges between -8 and +8 μC
    const nonZeroInt = (min: number, max: number): number => {
      let val = 0;
      while (val === 0) {
        val = Math.floor(Math.random() * (max - min + 1)) + min;
      }
      return val;
    };

    const q1 = nonZeroInt(-8, 8);
    let q2 = nonZeroInt(-8, 8);
    // 50% chance of attraction, 50% repulsion
    const forceAttract = Math.random() > 0.5;
    if (forceAttract && (q1 * q2 > 0)) {
      q2 = -q2;
    } else if (!forceAttract && (q1 * q2 < 0)) {
      q2 = -q2;
    }

    // Distance in steps of 0.25m between 0.5m and 2.0m
    const rDistances = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const r = rDistances[Math.floor(Math.random() * rDistances.length)];

    const isAttraction = (q1 * q2) < 0;
    const q1_C = q1 * 1e-6;
    const q2_C = q2 * 1e-6;
    const force = (ChallengeManager.K_TEXTBOOK * Math.abs(q1_C * q2_C)) / (r * r);

    const q1SignStr = q1 > 0 ? `+${q1.toFixed(1)}` : q1.toFixed(1);
    const q2SignStr = q2 > 0 ? `+${q2.toFixed(1)}` : q2.toFixed(1);

    const coef = (9.0 * Math.abs(q1 * q2)).toFixed(2);
    const r2Str = (r * r).toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
    const forceStr = force >= 0.01 ? force.toFixed(3) : force.toExponential(2);

    const steps: SolutionStep[] = [
      {
        stepNumber: 1,
        title: '力の向きの判定',
        explanation: `符号は $q_1 = ${q1SignStr}\\,\\mu\\mathrm{C}$、$q_2 = ${q2SignStr}\\,\\mu\\mathrm{C}$ です。${isAttraction ? '異符号のため引き合う「引力」' : '同符号のため反発する「斥力」'}になります。`,
        formulaLatex: isAttraction ? 'q_1 \\cdot q_2 < 0 \\implies \\text{引力}' : 'q_1 \\cdot q_2 > 0 \\implies \\text{斥力}'
      },
      {
        stepNumber: 2,
        title: '単位換算と公式への代入',
        explanation: '$\\mu\\mathrm{C}$ を $10^{-6}\\,\\mathrm{C}$ に変換し、クーロンの法則に代入します。',
        formulaLatex: `F = (9.0 \\times 10^9) \\times \\frac{(${Math.abs(q1).toFixed(1)} \\times 10^{-6}) \\times (${Math.abs(q2).toFixed(1)} \\times 10^{-6})}{(${r.toFixed(2)})^2}`
      },
      {
        stepNumber: 3,
        title: '指数の整理と計算実行',
        explanation: '数字部と指数部を計算します。',
        formulaLatex: `F = \\frac{${coef} \\times 10^{-3}}{${r2Str}} \\approx ${forceStr}\\,\\mathrm{N}`
      }
    ];

    const randomChallenge: Challenge = {
      id: `random-${Date.now()}`,
      title: '🎲 ランダム生成課題',
      difficulty: 'ランダム',
      summary: `q₁ = ${q1SignStr} μC, q₂ = ${q2SignStr} μC, r = ${r.toFixed(2)} m`,
      description: `真空中において、$q_1 = ${q1SignStr}\\,\\mu\\mathrm{C}$ と $q_2 = ${q2SignStr}\\,\\mu\\mathrm{C}$ の2つの電荷が距離 $r = ${r.toFixed(2)}\\,\\mathrm{m}$ 離れて置かれている。2つの電荷の間に働く力の大きさ $F\\,\\mathrm{[N]}$ を求め、引力か斥力かを判定せよ。`,
      q1_uC: q1,
      q2_uC: q2,
      r_m: r,
      answerForce_N: force,
      isAttraction,
      solutionSteps: steps
    };

    this.currentChallenge = randomChallenge;
    return randomChallenge;
  }

  /**
   * Evaluates user input against the challenge
   */
  public evaluateAnswer(userForceStr: string, userDirectionStr: string): EvaluationResult {
    const userForce = parseFloat(userForceStr.trim());
    if (isNaN(userForce) || userForce <= 0) {
      return {
        isCorrect: false,
        forceCorrect: false,
        directionCorrect: false,
        userForce: 0,
        expectedForce: this.currentChallenge.answerForce_N,
        message: '力の大きさには正の数値を入力してください（例: 0.054 または 5.4e-2）。'
      };
    }

    const expectedForce = this.currentChallenge.answerForce_N;
    // Allow ±5% tolerance to account for k=9.0 vs 8.988 and rounding
    const relDiff = Math.abs(userForce - expectedForce) / expectedForce;
    const forceCorrect = relDiff <= 0.06;

    const expectedDirection = this.currentChallenge.isAttraction ? 'attract' : 'repel';
    const directionCorrect = userDirectionStr === expectedDirection;

    const isCorrect = forceCorrect && directionCorrect;

    let message = '';
    if (isCorrect) {
      message = '🎉 正解です！力の大きさと引力・斥力の判定が完全に一致しました！';
    } else if (!forceCorrect && !directionCorrect) {
      message = '❌ 力の大きさと引力・斥力の判定の両方に誤りがあります。ステップ解説を確認してみましょう。';
    } else if (!forceCorrect) {
      message = `❌ 引力・斥力の判定は合っていますが、力の大きさの計算が違います（誤差: ${(relDiff * 100).toFixed(1)}%）。指数の扱いや分母の2乗を確認してください。`;
    } else {
      message = '❌ 力の大きさは合っていますが、引力・斥力の判定が逆です。電荷のプラス・マイナスを確認しましょう。';
    }

    return {
      isCorrect,
      forceCorrect,
      directionCorrect,
      userForce,
      expectedForce,
      message
    };
  }
}
