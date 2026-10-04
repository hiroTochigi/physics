import { DialogueMessage, EvidenceItem, MysteryPhase } from './MysteryTypes.ts';

export const INITIAL_EVIDENCES: Record<string, EvidenceItem> = {
  floor_heater: {
    id: 'floor_heater',
    name: '床の過熱ヒーター（ジュール熱の消費）',
    shortName: '床のヒーター (30J)',
    icon: '🔥',
    locationName: '実験室の床（導線ヒーター配線）',
    physicsType: 'joule_heat',
    energyJoules: 30,
    mathSymbol: '\\int_V \\boldsymbol{j} \\cdot \\boldsymbol{E} \\, dV',
    mathLatex: '\\int_0^5 \\!\\! dt \\int_V \\boldsymbol{j} \\cdot \\boldsymbol{E} \\, dV = 30 \\text{ J}',
    description:
      '床の配線導線に電流 j が流れ、電場 E による電気的仕事が熱エネルギー（ジュール熱）として 30 J 消費されていた痕跡。熱探知カメラで特定。',
    discovered: false
  },
  quartz_window: {
    id: 'quartz_window',
    name: '南壁の石英ガラス窓（ポインティング光束の噴出）',
    shortName: '石英窓の光束 (50J)',
    icon: '🔍',
    locationName: '南側壁面の観測用石英ガラス窓',
    physicsType: 'poynting_flux',
    energyJoules: 50,
    mathSymbol: '\\oint_{\\partial V} \\boldsymbol{S} \\cdot d\\boldsymbol{A}',
    mathLatex: '\\int_0^5 \\!\\! dt \\oint_{\\text{window}} \\boldsymbol{S} \\cdot d\\boldsymbol{A} = 50 \\text{ J}',
    description:
      '密閉実験室の南壁にある石英窓。虫眼鏡・UVスキャンによって、電磁波のポインティング・ベクトル S が外へ突き抜けて光のエネルギーとして逃げていた痕跡を検出。面積分するとピッタリ 50 J。',
    discovered: false
  }
};

export const PHASE_DIALOGUES: Record<MysteryPhase, DialogueMessage[]> = {
  intro: [
    {
      speaker: 'narrator',
      speakerName: 'ナレーション',
      avatar: '📜',
      text: '先端物理研究所・第3隔離実験室（閉領域 V）。頑丈な電磁シールド壁で覆われた完全密閉の実験空間である。'
    },
    {
      speaker: 'assistant',
      speakerName: '助手のアオイ',
      avatar: '👩‍🔬',
      text: '所長、緊急事態です！初期エネルギーとして 100 J の高周波電磁場を閉じ込めたのですが、わずか 5 秒後の今、計測値が 20 J に減っています！'
    },
    {
      speaker: 'detective',
      speakerName: '探偵（あなた）',
      avatar: '🕵️',
      text: '100 J から 20 J だと……？ 差し引き「80 J」のエネルギーが、この完全密閉された空間から忽然と消失したというのか。'
    },
    {
      speaker: 'assistant',
      speakerName: '助手のアオイ',
      avatar: '👩‍🔬',
      text: 'はい……！ 外壁のシールドに破壊された痕跡はありません。このままでは物理学の大原則「エネルギー保存則」が崩壊してしまいます！'
    },
    {
      speaker: 'detective',
      speakerName: '探偵（あなた）',
      avatar: '🕵️',
      text: '慌てるな、アオイ。エネルギーは勝手に消滅したりしない。必ず現場に何らかの「帳尻を合わせる抜け穴」があるはずだ。現場を検証するぞ！',
      actionPrompt: '💡 ツールを「熱探知カメラ」に切り替えて、実験室の床をクリック・調査してみよう！',
      suggestedTool: 'thermal',
      focusTarget: 'heater'
    }
  ],
  investigate_1: [
    {
      speaker: 'detective',
      speakerName: '探偵（あなた）',
      avatar: '🕵️',
      text: '見ろ、床の一画が異常に赤熱している！床下に埋め込まれた導線とヒーター抵抗に電流が流れているぞ。'
    },
    {
      speaker: 'assistant',
      speakerName: '助手のアオイ',
      avatar: '👩‍🔬',
      text: '熱探知カメラの積算計が反応しています！ 電流 j と 電場 E の積、つまりジュール熱として「30 J」が熱に変換されていました！',
      focusTarget: 'heater'
    },
    {
      speaker: 'detective',
      speakerName: '探偵（あなた）',
      avatar: '🕵️',
      text: 'なるほど、消えた 80 J のうち 30 J は荷電粒子への仕事（物質の熱）になっていたわけだ。だが……まだ「50 J」の行方が合わない！',
      actionPrompt: '💡 ツールを「精密虫眼鏡（UV）」に切り替えて、壁面の怪しい場所（窓など）をスキャンしてみよう！',
      suggestedTool: 'loupe',
      focusTarget: 'window'
    }
  ],
  investigate_2: [
    {
      speaker: 'detective',
      speakerName: '探偵（あなた）',
      avatar: '🕵️',
      text: '南側の壁面……ここだけ金属シールドではなく「透明な石英ガラス窓」になっているな。虫眼鏡で表面の電磁場痕跡をスキャンしてみよう。'
    },
    {
      speaker: 'assistant',
      speakerName: '助手のアオイ',
      avatar: '👩‍🔬',
      text: 'あっ！ ガラス窓の表面から、ものすごい勢いで外向きに飛び出していくベクトル束（S = E × B / μ₀）が感知されました！'
    },
    {
      speaker: 'detective',
      speakerName: '探偵（あなた）',
      avatar: '🕵️',
      text: '電磁波が光となって窓を突き抜け、宇宙空間へと飛び去っていたのか！ 窓の表面全体で流出束を積分してみろ！'
    },
    {
      speaker: 'assistant',
      speakerName: '助手のアオイ',
      avatar: '👩‍🔬',
      text: '計算完了しました！ 5秒間で窓から逃げ去った電磁波エネルギー流束は……ピッタリ「50 J」です！',
      focusTarget: 'window'
    },
    {
      speaker: 'detective',
      speakerName: '探偵（あなた）',
      avatar: '🕵️',
      text: '30 J のジュール熱と、50 J の窓からの光束……これで消えた 80 J の帳尻がすべて揃った！ 捜査手帳で立証を完了させよう！',
      actionPrompt: '💡 右側の捜査手帳パネルで、集めた証拠をスロットに配置して「真相を立証する」ボタンを押そう！'
    }
  ],
  accusation: [
    {
      speaker: 'detective',
      speakerName: '探偵（あなた）',
      avatar: '🕵️',
      text: 'さあ、証拠品を手帳のエネルギー収支スロットに当てはめよう。室内の減少量（-80 J）と、右辺のマイナス符号のついた各消費項目が完全に釣り合うはずだ。'
    }
  ],
  solved: [
    {
      speaker: 'detective',
      speakerName: '探偵（あなた）',
      avatar: '🕵️',
      text: '「密室から消えた 80 J」の真相は暴かれた！ 部屋のエネルギー減少（-80 J）＝ 床の熱損失（-30 J）＋ 窓から逃げた光の束（-50 J）！'
    },
    {
      speaker: 'assistant',
      speakerName: '助手のアオイ',
      avatar: '👩‍🔬',
      text: 'お見事です、所長！ 物理法則は破綻していませんでした！ これこそまさに、1884年にジョン・ヘンリー・ポインティングが解明した電磁場の保存則そのものですね！'
    },
    {
      speaker: 'narrator',
      speakerName: '事件解決・解説',
      avatar: '🏆',
      text: 'ポインティングの定理: 「ある領域 V の電磁場エネルギーの時間減少率 (dW/dt) は、内部の荷電粒子にした仕事（ジュール熱 ∫ j・E dV）と、境界面 ∂V を通って外へ逃げ去るエネルギー流束（∮ S・dA）の合計に完全に等しい」。'
    }
  ]
};
