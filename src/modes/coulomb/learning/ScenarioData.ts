import { ScenarioStep } from './ChallengeTypes.ts';

export const SCENARIO_STEPS: ScenarioStep[] = [
  {
    stepIndex: 1,
    title: '引力・斥力と「作用・反作用」の発見',
    badge: 'Step 1: 直感の獲得',
    goal: '符号による力の向きの違いと、電荷量が違っても受ける力は完全に等しい（ニュートン第3法則）ことを発見しよう！',
    narrative: '電荷には「プラス」と「マイナス」があります。プリセットの「異符号（引力）」や「同符号（斥力）」を試してみましょう。さらに「電荷差（+4μC & +1μC）」を選ぶと、電荷量が大きく違っても矢印の長さ（力の大きさ）が両方とも全く同じであることに気づくはずです！',
    recommendedAction: '「電荷差（+4μC & +1μC）」プリセットを押して、2つの力ベクトルの矢印の長さを見比べてみよう。',
    highlightSelector: '.quick-presets',
    autoSetup: {
      q1: 4.0,
      q2: 1.0,
      view: '2d',
      vectors: true,
      fieldLines: false,
      efield: false
    }
  },
  {
    stepIndex: 2,
    title: '逆二乗則（距離と力）の急激な変化を体感',
    badge: 'Step 2: 逆二乗則の核心',
    goal: '粒子をドラッグして、距離を2倍にすると力は1/4、距離を半分にすると力は4倍になる「急激なカーブ」を観察しよう！',
    narrative: 'クーロンの法則の最大の特徴は「距離の2乗に反比例（1/r²）」することです。右上の「F(r) リアルタイムプロット」を見ながら一方の電荷を近づけたり遠ざけたりしてみましょう。距離を2倍に離すと、力は半分ではなく「1/4（0.25倍）」に激減します！',
    recommendedAction: 'キャンバス上の青い電荷（q₂）をドラッグして距離 r を 1.0m や 2.0m に合わせ、グラフの青い動作点の動きを見よう。',
    highlightSelector: '.graph-card',
    autoSetup: {
      q1: 2.0,
      q2: -2.0,
      view: '2d',
      vectors: true
    }
  },
  {
    stepIndex: 3,
    title: '見えない「場」と「3D電位（山と谷）」の空間イメージ',
    badge: 'Step 3: 空間イメージの獲得',
    goal: '電気力線と3D電位曲面（正電荷は山、負電荷は谷）を見て、なぜ遠隔で力が伝わるのかを直感的に理解しよう！',
    narrative: '電荷は周りの空間を歪ませて「電位の山や谷」を作ります。正電荷は急峻な「山」、負電荷は深い「すり鉢状の谷」です。テスト電荷を置くと、重力でボールが山から谷へ転がり落ちるようにスーッと流れていきます！',
    recommendedAction: '「スプリット表示」にして「⚡ テスト電荷を放出」を押してみよう。山から谷へ転がる感覚を味わえます。',
    highlightSelector: '#btn-spawn-test',
    autoSetup: {
      q1: 3.0,
      q2: -3.0,
      view: 'split',
      fieldLines: true,
      vectors: true
    }
  },
  {
    stepIndex: 4,
    title: '手計算チャレンジ！シミュレーターで答え合わせ',
    badge: 'Step 4: 自力計算のマスター',
    goal: '公式 F = k·|q₁q₂| / r² を使って紙とペンで手計算し、シミュレーターの計測値とピッタリ一致させよう！',
    narrative: '概念をマスターしたら、いよいよテストで解ける計算力を手に入れます！「演習課題」パネルから課題を選び、μC（マイクロクーロン）を 10⁻⁶ C に変換して計算してみましょう。入力して判定を押せば、正解判定と詳しい手計算ステップが見られます！',
    recommendedAction: '「演習課題」から課題1を選び、計算した数値を入力して「判定する」を押してみよう。',
    highlightSelector: '#challenges-panel',
    autoSetup: {
      q1: 2.0,
      q2: -3.0,
      view: '2d',
      vectors: true
    }
  }
];
