import { PoyntingScenarioStep } from './PoyntingChallengeTypes.ts';

export const POYNTING_SCENARIO_STEPS: PoyntingScenarioStep[] = [
  {
    stepIndex: 1,
    badge: 'Step 1: 空間のエネルギー',
    title: '何もない「真空」のエネルギーを測ってみよう',
    goal: '電場や磁場が存在する空間そのものにエネルギーが蓄えられていることを確認する',
    narrative:
      'かつて物理学者は「エネルギーは物体だけが持つもの」と考えていました。しかしマクスウェルの電磁気学により、「真空中であっても電場 E や磁場 B があれば、そこにエネルギーが存在する」ことが明らかになりました。中央の直方体ボックス（領域 V）の内部に蓄えられた総エネルギー W のメーターを見てみましょう。',
    recommendedAction:
      '💡 一時停止を解除するか、ボックスサイズスライダーを動かして、領域 V の体積を変えると蓄積エネルギー W がどう変化するか観察してみましょう。',
    highlightSelector: '#poynting-hud-w',
    autoSetup: {
      sourceType: 'dipole',
      boxSize: 2.2,
      frequency: 0.5,
      paused: false,
      viewMode: '3d'
    }
  },
  {
    stepIndex: 2,
    badge: 'Step 2: 時間微分',
    title: '時間を動かしてみよう（時間変化率 dW/dt の誕生）',
    goal: 'アンテナが振動すると、箱の中のエネルギー残量が激しく変動（微分 dW/dt ≠ 0）することを目撃する',
    narrative:
      '中央の微小アンテナ（ヘルツ双極子）で電荷が激しく上下に振動しています。すると電磁場が波となり、箱の中のエネルギー残量 W(t) が増減を繰り返します。この「1秒あたりの増減スピード」が時間微分 dW/dt です。',
    recommendedAction:
      '💡 数式バーの「dW/dt」にマウスを乗せてみてください。3D空間内の箱全体が青白く明滅し、箱の中のエネルギー変化であることが強調されます。',
    highlightSelector: '#katex-part-dwdt',
    autoSetup: {
      sourceType: 'dipole',
      boxSize: 2.2,
      frequency: 0.7,
      paused: false,
      viewMode: '3d'
    }
  },
  {
    stepIndex: 3,
    badge: 'Step 3: 流れるエネルギー',
    title: '壁から漏れ出る光を捕まえよう（ポインティング・ベクトル S）',
    goal: '電磁波が箱の境界壁を突き破る瞬間、光の束として宇宙へエネルギーが逃げていく様子を観察する',
    narrative:
      '箱の中のエネルギーが減るとき、そのエネルギーはどこへ消えたのでしょうか？ 答えは「光となって壁を突き破り、外へ飛び去った」のです！ 電磁波が境界壁 ∂V を通過するたびに、6枚の外壁が一瞬白く発光します。このエネルギーの流れを示す矢印が「ポインティング・ベクトル S」です。',
    recommendedAction:
      '💡 数式バーの「∮ S・dA」にマウスを乗せてみましょう。6枚の境界壁と外向きの矢印群がオレンジ色に発光します。',
    highlightSelector: '#katex-part-flux',
    autoSetup: {
      sourceType: 'dipole',
      boxSize: 2.5,
      frequency: 0.8,
      paused: false,
      viewMode: 'split'
    }
  },
  {
    stepIndex: 4,
    badge: 'Step 4: 宇宙の家計簿',
    title: 'エネルギー保存則の完全証明（収支の一致）',
    goal: '「箱の中の残量」＋「外へ逃げた累積量」＝「波源の仕事」が完璧に保存されることをグラフで証明する',
    narrative:
      '右側の「リアルタイム収支家計簿グラフ」を開いてみましょう。シアン色の線「箱の中の残量 W」と、オレンジ色の線「外へ逃げた光の累計」を足し合わせると、波源の供給した総エネルギー（白点線）と完全に一致します。これがマクスウェルが導いたポインティングの定理の真髄です！',
    recommendedAction:
      '💡 「数式 ⇄ 直感日本語」スイッチを切り替えて、数式が語る物理のメッセージを日常語で確かめてみましょう。',
    highlightSelector: '#btn-toggle-math-mode',
    autoSetup: {
      sourceType: 'dipole',
      boxSize: 2.2,
      frequency: 0.6,
      paused: false,
      viewMode: 'split'
    }
  }
];
