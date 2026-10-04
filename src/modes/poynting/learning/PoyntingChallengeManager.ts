import { PoyntingChallenge } from './PoyntingChallengeTypes.ts';

export const PRESET_POYNTING_CHALLENGES: PoyntingChallenge[] = [
  {
    id: 'poynting-ch-1',
    difficulty: '入門',
    title: '課題 1: 導線とエネルギーの流れ（パラドックス）',
    descriptionHtml: `
      直流電流が流れている電線（抵抗器）において、電気エネルギーはどこを通り、どちらの向きへ流れているでしょうか？<br>
      ポインティング・ベクトル $\\boldsymbol{S} = \\frac{1}{\\mu_0}(\\boldsymbol{E} \\times \\boldsymbol{B})$ の向きを判定してください。
    `,
    questionType: 'direction',
    correctDirection: 'inward',
    directionOptions: [
      { value: 'current', label: '電流と同じ向き（導線の中を流れる）' },
      { value: 'inward', label: '導線の周りの空間から導線側面へ吸い込まれる向き' },
      { value: 'outward', label: '導線から外の空間へ放射される向き' },
      { value: 'zero', label: '静止しているのでエネルギーの流れはゼロ' }
    ],
    targetFluxOrPower: 0,
    tolerance: 0,
    simulationPreset: {
      sourceType: 'wire',
      boxSize: 2.0,
      frequency: 0.5
    },
    solutionSteps: [
      {
        stepTitle: 'Step 1: 電場と磁場の向きを確認する',
        explanation:
          '導線内には電流を流すために電線に沿った電場 $E_z$ があり、アンペールの法則により導線の周囲には同心円状の磁場 $B_\\phi$ が生じます。',
        mathLatex: '\\boldsymbol{E} = E_z \\hat{\\boldsymbol{z}}, \\quad \\boldsymbol{B} = B_\\phi \\hat{\\boldsymbol{\\phi}}'
      },
      {
        stepTitle: 'Step 2: 外積 E × B を計算する',
        explanation:
          '右手の親指を z 方向（電場）、人差し指を円周方向（磁場）に向けると、手のひら（外積 $\\boldsymbol{E} \\times \\boldsymbol{B}$）は導線の中心軸に向かう動径方向（$-\\hat{\\boldsymbol{r}}$）を指します。',
        mathLatex: '\\boldsymbol{S} = \\frac{1}{\\mu_0} (E_z \\hat{\\boldsymbol{z}} \\times B_\\phi \\hat{\\boldsymbol{\\phi}}) = -\\frac{E_z B_\\phi}{\\mu_0} \\hat{\\boldsymbol{r}}'
      },
      {
        stepTitle: 'Step 3: 結論と物理的意義',
        explanation:
          'エネルギーは電線の中を電子が運んでいるのではなく、電線の周りの空間を通って側面から吸い込まれ、導線内部でジュール熱に変換されているのです！'
      }
    ]
  },
  {
    id: 'poynting-ch-2',
    difficulty: '基本',
    title: '課題 2: 宇宙の家計簿パズル（エネルギー保存則）',
    descriptionHtml: `
      直方体ボックス $V$ の内部で、電磁場エネルギーの残量が毎秒 <strong>4.8 W</strong> のペースで減少しています（$\\frac{dW}{dt} = -4.8\\text{ W}$）。<br>
      このとき導線の抵抗で毎秒 <strong>1.5 W</strong> のジュール熱が発生しているとすれば、直方体の境界壁から外へ逃げ出している光の束（ポインティング流束 $\\oint_{\\partial V} \\boldsymbol{S} \\cdot d\\boldsymbol{A}$）は何ワットでしょうか？
    `,
    questionType: 'number',
    targetFluxOrPower: 3.3,
    tolerance: 0.05,
    simulationPreset: {
      sourceType: 'dipole',
      boxSize: 2.2,
      frequency: 0.6
    },
    solutionSteps: [
      {
        stepTitle: 'Step 1: ポインティングの定理の積分形を適用する',
        explanation:
          '領域 $V$ 内の電磁エネルギーの時間変化 $\\frac{dW}{dt}$ は、ジュール熱消費率と境界面からの流出流束の和のマイナスに等しくなります。',
        mathLatex: '\\frac{dW}{dt} = - \\int_V \\boldsymbol{j} \\cdot \\boldsymbol{E} \\, dV - \\oint_{\\partial V} \\boldsymbol{S} \\cdot d\\boldsymbol{A}'
      },
      {
        stepTitle: 'Step 2: 各数値を代入する',
        explanation:
          '減少率 $\\frac{dW}{dt} = -4.8\\text{ W}$、ジュール熱 $P_{\\text{Joule}} = 1.5\\text{ W}$ を代入して流出束 $\\Phi_S$ について解きます。',
        mathLatex: '-4.8 = - 1.5 - \\Phi_S \\implies \\Phi_S = 4.8 - 1.5 = 3.3\\ \\mathrm{[W]}'
      },
      {
        stepTitle: 'Step 3: 収支の検算',
        explanation:
          '減少した 4.8 W のエネルギーのうち、1.5 W が熱になり、残り 3.3 W が光（電磁波）として壁を抜けて宇宙へ飛び去ったことが分かります。'
      }
    ]
  },
  {
    id: 'poynting-ch-3',
    difficulty: '応用',
    title: '課題 3: 放射波のポインティング・ベクトル強さ',
    descriptionHtml: `
      遠方放射領域において、電場の振幅が $E_0 = 12\\text{ V/m}$ の電磁波が真空中（$\\varepsilon_0, \\mu_0$）を伝播しています。<br>
      このとき、電磁波が単位面積あたりに運ぶ最大放射電力密度（ポインティング・ベクトルの最大値 $S_{\\max}$）は何 $\\text{W/m}^2$ でしょうか？<br>
      （真空の波動インピーダンス $\\eta_0 = \\sqrt{\\frac{\\mu_0}{\\varepsilon_0}} \\approx 377\\ \\Omega$ を用いて計算してください）
    `,
    questionType: 'number',
    targetFluxOrPower: 0.38,
    tolerance: 0.1,
    simulationPreset: {
      sourceType: 'dipole',
      boxSize: 2.8,
      frequency: 0.8
    },
    solutionSteps: [
      {
        stepTitle: 'Step 1: 電場と磁場の関係式',
        explanation:
          '真空中の電磁波では、電場と磁場の振幅比は光速 $c$ または波動インピーダンス $\\eta_0 = \\mu_0 c$ で結ばれます。',
        mathLatex: 'B_0 = \\frac{E_0}{c}, \\quad \\eta_0 = \\sqrt{\\frac{\\mu_0}{\\varepsilon_0}} \\approx 376.73\\ \\Omega'
      },
      {
        stepTitle: 'Step 2: ポインティング・ベクトルの最大値公式',
        explanation:
          '$S = \\frac{1}{\\mu_0} E B = \\frac{E^2}{\\mu_0 c} = \\frac{E^2}{\\eta_0}$ より最大値を計算します。',
        mathLatex: 'S_{\\max} = \\frac{E_0^2}{\\eta_0} = \\frac{12^2}{377} = \\frac{144}{377} \\approx 0.382\\ \\mathrm{[W/m^2]}'
      }
    ]
  },
  {
    id: 'poynting-ch-4',
    difficulty: '発展',
    title: '課題 4: ボックスサイズ拡大と全放射流束',
    descriptionHtml: `
      ヘルツ双極子を中心とする直方体領域 $V$ の一辺の長さを <strong>2倍</strong> に拡大しました。<br>
      境界面 $\\partial V$ を通過する外向きポインティング束の1周期平均 $\\langle \\oint_{\\partial V} \\boldsymbol{S} \\cdot d\\boldsymbol{A} \\rangle$ の値はどうなるでしょうか？<br>
      （元の放射流束を $P_0$ としたときの倍率を数値で入力してください。例: 変わらない場合は 1.0）
    `,
    questionType: 'number',
    targetFluxOrPower: 1.0,
    tolerance: 0.05,
    simulationPreset: {
      sourceType: 'dipole',
      boxSize: 3.2,
      frequency: 0.6
    },
    solutionSteps: [
      {
        stepTitle: 'Step 1: 遠方放射電場とポインティングベクトルの距離依存性',
        explanation:
          '電磁波の遠方放射項は、距離 $r$ に対して $E, B \\propto 1/r$ で減衰します。したがってポインティング・ベクトルの大きさは距離の2乗に反比例します。',
        mathLatex: 'S(r) \\propto E \\cdot B \\propto \\frac{1}{r^2}'
      },
      {
        stepTitle: 'Step 2: 境界面積の拡大との相殺',
        explanation:
          '直方体（または球面）の表面積は距離の2乗 $r^2$ に比例して拡大します。面積分 $\\oint S \\cdot dA$ において、$1/r^2$ と $r^2$ が完全に相殺します。',
        mathLatex: '\\oint_{\\partial V} \\boldsymbol{S} \\cdot d\\boldsymbol{A} \\propto \\left( \\frac{1}{r^2} \\right) \\times r^2 = \\text{一定（保存）}'
      },
      {
        stepTitle: 'Step 3: 結論',
        explanation:
          'エネルギーは途中の真空中では消滅も生成もしないため、箱をどんなに大きく広げても外へ逃げ出るトータルのエネルギー流束は変わりません（倍率 1.0）。'
      }
    ]
  }
];

export class PoyntingChallengeManager {
  private challenges: PoyntingChallenge[] = [...PRESET_POYNTING_CHALLENGES];
  private currentChallengeIndex: number = 0;

  public getChallenges(): PoyntingChallenge[] {
    return this.challenges;
  }

  public getCurrentChallenge(): PoyntingChallenge {
    return this.challenges[this.currentChallengeIndex];
  }

  public selectChallenge(id: string): PoyntingChallenge | undefined {
    const idx = this.challenges.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.currentChallengeIndex = idx;
      return this.challenges[idx];
    }
    return undefined;
  }

  public generateRandomChallenge(): PoyntingChallenge {
    const dwVal = Math.round((2.0 + Math.random() * 5.0) * 10) / 10;
    const jouleVal = Math.round((0.5 + Math.random() * 1.5) * 10) / 10;
    const expectedFlux = Math.round((dwVal - jouleVal) * 10) / 10;

    const randomCh: PoyntingChallenge = {
      id: `poynting-random-${Date.now()}`,
      difficulty: '応用',
      title: `ランダム課題: 家計簿収支計算 (減速度 ${dwVal} W)`,
      descriptionHtml: `
        直方体ボックス内の電磁エネルギーが毎秒 <strong>${dwVal} W</strong> 減少し、電線内で毎秒 <strong>${jouleVal} W</strong> のジュール熱が発生しています。<br>
        この瞬間、ボックスの境界面から外へ逃げ出している光の束（ポインティング流束 $\\oint \\boldsymbol{S} \\cdot d\\boldsymbol{A}$）は何ワットですか？
      `,
      questionType: 'number',
      targetFluxOrPower: expectedFlux,
      tolerance: 0.05,
      simulationPreset: {
        sourceType: 'dipole',
        boxSize: 2.2,
        frequency: 0.6
      },
      solutionSteps: [
        {
          stepTitle: 'Step 1: ポインティングの定理の適用',
          explanation: 'エネルギー保存則 $\\frac{dW}{dt} = -P_{\\text{Joule}} - \\Phi_S$ より計算します。',
          mathLatex: `\\Phi_S = -\\frac{dW}{dt} - P_{\\text{Joule}} = ${dwVal} - ${jouleVal} = ${expectedFlux}\\ \\mathrm{[W]}`
        }
      ]
    };

    this.challenges.push(randomCh);
    this.currentChallengeIndex = this.challenges.length - 1;
    return randomCh;
  }

  public evaluateAnswer(userAnswer: string | number): {
    isCorrect: boolean;
    feedbackMessage: string;
    expectedValue: string;
  } {
    const ch = this.getCurrentChallenge();

    if (ch.questionType === 'direction') {
      const isCorrect = String(userAnswer).trim() === ch.correctDirection;
      const expectedLabel = ch.directionOptions?.find((o) => o.value === ch.correctDirection)?.label || '';
      return {
        isCorrect,
        feedbackMessage: isCorrect
          ? '🎉 正解です！エネルギーは電線の中ではなく、電線の周りの空間を通って側面に吸い込まれます！'
          : `不正解です。正解は「${expectedLabel}」です。`,
        expectedValue: expectedLabel
      };
    } else {
      const numAnswer = typeof userAnswer === 'number' ? userAnswer : parseFloat(String(userAnswer));
      if (isNaN(numAnswer)) {
        return {
          isCorrect: false,
          feedbackMessage: '数値を正しく入力してください。',
          expectedValue: String(ch.targetFluxOrPower)
        };
      }

      const diff = Math.abs(numAnswer - ch.targetFluxOrPower);
      const allowedError = Math.max(0.02, ch.targetFluxOrPower * ch.tolerance);
      const isCorrect = diff <= allowedError;

      return {
        isCorrect,
        feedbackMessage: isCorrect
          ? `🎉 正解です！計算結果 ${numAnswer} W は理論値 ${ch.targetFluxOrPower} W と一致しました！`
          : `不正解です。入力値: ${numAnswer}、正解: ${ch.targetFluxOrPower} W（許容誤差 ±${(ch.tolerance * 100).toFixed(0)}%）`,
        expectedValue: `${ch.targetFluxOrPower} W`
      };
    }
  }
}
