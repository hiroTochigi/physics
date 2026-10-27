import renderMathInElement from 'katex/contrib/auto-render';
import { ElectronState } from '../ElectronTypes.ts';
import { CONSTANTS, ElectronPhysics } from '../physics/ElectronPhysics.ts';
import { soundEffects } from '../audio/ElectronSoundEffects.ts';

export class ElectronBlogModal {
  private container: HTMLElement;
  private modalOverlay: HTMLElement | null = null;
  private onApplySimulationState: (stateUpdate: Partial<ElectronState>) => void;

  constructor(container: HTMLElement, onApplySimulationState: (stateUpdate: Partial<ElectronState>) => void) {
    this.container = container;
    this.onApplySimulationState = onApplySimulationState;
  }

  public open(): void {
    if (this.modalOverlay) {
      this.modalOverlay.classList.remove('hidden');
      return;
    }

    this.createModal();
  }

  public close(): void {
    if (this.modalOverlay) {
      this.modalOverlay.classList.add('hidden');
    }
  }

  private createModal(): void {
    this.modalOverlay = document.createElement('div');
    this.modalOverlay.className = 'electron-blog-modal-overlay';
    this.modalOverlay.id = 'electron-blog-modal';

    this.modalOverlay.innerHTML = `
      <div class="electron-blog-modal-content">
        <!-- Modal Header -->
        <header class="blog-modal-header">
          <div class="blog-modal-title-wrap">
            <span class="blog-badge">高校生向け 徹底解説ブログ</span>
            <h2>電子の体重は無限大!? 〜「大きさゼロの点」と仮定すると宇宙が崩壊する理由〜</h2>
            <div class="blog-meta-tags">
              <span class="meta-tag">⏱️ 読了目安: 約7分</span>
              <span class="meta-tag">🎓 登場人物: 高校生・物理教師・数学教師・UIデザイナー</span>
            </div>
          </div>
          <button type="button" class="btn-close-modal" id="btn-close-blog-modal" aria-label="閉じる">✕</button>
        </header>

        <!-- Characters Intro Banner -->
        <div class="characters-banner">
          <div class="char-chip char-student">
            <span class="char-avatar">🎒</span>
            <div class="char-info">
              <strong>ハルキ（高校生）</strong>
              <span>理系志望。数式アレルギー気味だが知的好奇心は旺盛。</span>
            </div>
          </div>
          <div class="char-chip char-physics">
            <span class="char-avatar">👨‍🏫</span>
            <div class="char-info">
              <strong>タカハシ先生（物理教師）</strong>
              <span>「エネルギーはどこにある？」が口癖の熱血教師。</span>
            </div>
          </div>
          <div class="char-chip char-math">
            <span class="char-avatar">📐</span>
            <div class="char-info">
              <strong>カトウ先生（数学教師）</strong>
              <span>数式を幾何学的イメージに翻訳するのが得意。</span>
            </div>
          </div>
        </div>

        <!-- Blog Body Article -->
        <div class="blog-article-body" id="blog-article-body">
          <!-- Article Content -->
          <section class="blog-section">
            <h3 class="section-heading">序章：「大きさゼロの点電荷」を信じると、宇宙が崩壊する!?</h3>
            <div class="dialogue-block student">
              <span class="avatar">🎒</span>
              <div class="bubble">
                <p>先生！前回の授業で「電子は素粒子だから、大きさを持たない<strong>大きさゼロの点（点電荷）</strong>として計算する」って習いましたよね。あれ、本当なんですか？</p>
              </div>
            </div>
            <div class="dialogue-block physics">
              <span class="avatar">👨‍🏫</span>
              <div class="bubble">
                <p>よくぞ聞いてくれたハルキ君！実はね、その「点電荷」という前提をそのまま電磁気学の数式に当てはめると、<strong>電子1個の体重（質量）が無限大（$\\infty$）になって宇宙全体がブラックホールに潰れてしまう</strong>んだ。</p>
              </div>
            </div>
            <div class="dialogue-block student">
              <span class="avatar">🎒</span>
              <div class="bubble">
                <p>ええっ！？ 宇宙崩壊！？ でも実際の電子って、ものすごく軽くてフワフワ（$9.11 \\times 10^{-31}\\text{ kg}$）ですよね？ なんでそんなバグみたいなことが起きるんですか？</p>
              </div>
            </div>
            <div class="dialogue-block math">
              <span class="avatar">📐</span>
              <div class="bubble">
                <p>カトウです。その犯人は、高校数学（数III）でも習う<strong>「反比例の分数で、分母をゼロにしたときに起きる極限の爆発」</strong>だよ。今日は物理と数学の両面から、この100年前の物理学者たちを震撼させた大事件を解き明かしていこう！</p>
              </div>
            </div>
          </section>

          <hr class="blog-divider" />

          <!-- Section 1 -->
          <section class="blog-section">
            <h3 class="section-heading">第1章：エネルギーはどこにある？（コンデンサーの秘密）</h3>
            <p class="body-p">
              まず、高校物理でおなじみのコンデンサーの公式を解剖してみましょう。
              極板に蓄えられた静電エネルギーは $U = \\frac{1}{2}QV = \\frac{1}{2}CV^2$ ですね。
            </p>
            <div class="dialogue-block student">
              <span class="avatar">🎒</span>
              <div class="bubble">
                <p>テストで死ぬほど暗記しました！でも、このエネルギーって、どこにたまってるんですか？ 金属板の中ですか？</p>
              </div>
            </div>
            <div class="dialogue-block physics">
              <span class="avatar">👨‍🏫</span>
              <div class="bubble">
                <p>いい質問だ！平行板コンデンサーの公式（面積 $A$、極板間隔 $d$、電場 $E = V/d$、電気容量 $C = \\varepsilon_0 A/d$）を代入してみよう。</p>
              </div>
            </div>

            <div class="formula-card">
              <div class="math-display">
                $$U = \\frac{1}{2} \\left( \\varepsilon_0 \\frac{A}{d} \\right) (E d)^2 = \\left( \\frac{1}{2}\\varepsilon_0 E^2 \\right) \\times (A d)$$
              </div>
              <div class="formula-notes">
                <div class="note-item">
                  <span class="note-bullet">🔍</span>
                  <span>$Ad$ は極板の間の<strong>「体積（空間の広さ）」</strong>！</span>
                </div>
                <div class="note-item">
                  <span class="note-bullet">💡</span>
                  <span>つまり、<strong>「電場 $E$ が存在する空間そのもの」</strong>に、1立方メートルあたり $u = \\frac{1}{2}\\varepsilon_0 E^2$ のエネルギーが詰まっている！</span>
                </div>
              </div>
            </div>

            <div class="callout callout-insight">
              <strong>💡 パラダイムシフト：</strong>
              エネルギーは物質の中ではなく、何もないように見える<strong>「電場（真空の空間）」</strong>に宿っている！
            </div>
          </section>

          <hr class="blog-divider" />

          <!-- Section 2 -->
          <section class="blog-section">
            <h3 class="section-heading">第2章：怒ったハリネズミを丸める作業（自己エネルギー）</h3>
            <div class="dialogue-block student">
              <span class="avatar">🎒</span>
              <div class="bubble">
                <p>空間にエネルギーがあるのはわかりました。でも、物理でよく登場する<strong>「自己エネルギー（Self-energy）」</strong>って何ですか？ 一人しかいないのに、誰と反発してるんですか？</p>
              </div>
            </div>
            <div class="dialogue-block physics">
              <span class="avatar">👨‍🏫</span>
              <div class="bubble">
                <p>
                  電子を1個手作りすることを想像してごらん。
                  電子には $-e$ というマイナスの電気が詰まっている。
                  マイナスの電気同士は猛烈に反発し合うよね？
                  まるで**「怒って針を逆立てた無数のハリネズミ（マイナスの砂粒）」**を、外から無理やり手でギュウギュウに押し縮めて丸めるようなものなんだ。
                </p>
              </div>
            </div>
            <div class="dialogue-block student">
              <span class="avatar">🎒</span>
              <div class="bubble">
                <p>あ！反発して逃げようとするやつらを無理やり閉じ込めたから、押し縮めたバネみたいにエネルギーがパンパンにたまってるんですね！</p>
              </div>
            </div>
          </section>

          <hr class="blog-divider" />

          <!-- Section 3 -->
          <section class="blog-section">
            <h3 class="section-heading">第3章：数学のタネ明かし（1D部分積分 → 3D発散定理への次元昇格）</h3>

            <div class="callout callout-safetynet">
              <p><strong>💡 カトウ先生からのアドバイス（読み飛ばしOK！）：</strong></p>
              <p>「ナブラ $\\nabla$ や発散定理 $\\oint$ を見て『うっ…』となった人は、遠慮なくこの章をスキップして第4章へ進んで大丈夫！
              要するに言いたいことは<strong>『高校で習う部分積分の公式を、3次元の空間全体に拡張しただけ』</strong>ということです！」</p>
            </div>

            <p class="body-p">
              空間全体の電場エネルギー $U = \\int_V \\frac{\\varepsilon_0 \\boldsymbol{E}^2}{2} dV$ を、電位 $\\phi$ と電荷密度 $\\rho$ を用いた $U = \\frac{1}{2}\\int_V \\rho \\phi dV$ に書き換える数式変形は、大学数学の「ベクトル解析」を使いますが、高校数学の言葉に翻訳すると驚くほどシンプルです。
            </p>

            <div class="comparison-table-wrap">
              <table class="comparison-table">
                <thead>
                  <tr>
                    <th>高校数学（1次元）</th>
                    <th>大学数学（3次元ベクトル解析）</th>
                    <th>直感的イメージ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>微分の傾き $\\frac{df}{dx}$</strong></td>
                    <td>勾配 $\\nabla \\phi$（ナブラ）</td>
                    <td>等高線の「一番急な上り坂」を指す3D矢印</td>
                  </tr>
                  <tr>
                    <td><strong>積の微分 $(fg)' = f'g + fg'$</strong></td>
                    <td>$\\nabla \\cdot (\\phi \\boldsymbol{E}) = (\\nabla \\phi)\\cdot\\boldsymbol{E} + \\phi(\\nabla\\cdot\\boldsymbol{E})$</td>
                    <td>スカラーとベクトルの内積の微分</td>
                  </tr>
                  <tr>
                    <td><strong>部分積分の公式</strong><br>$\\int f' g dx = [fg] - \\int f g' dx$</td>
                    <td><strong>ガウスの発散定理</strong><br>$\\int_V (\\nabla\\cdot\\boldsymbol{A}) dV = \\oint_{\\partial V} \\boldsymbol{A}\\cdot d\\boldsymbol{S}$</td>
                    <td>「立体の内部の湧き出しの合計」は「外側の皮（表面）から出ていく全量」とぴったり一致する！</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="dialogue-block math">
              <span class="avatar">📐</span>
              <div class="bubble">
                <p>
                  カトウです。「なぜ全空間の体積積分を部分積分したとき、無限遠の境界項が 0 に消えるのか」も、数IIIの**極限のスピード勝負**で説明できるよ！
                  球の半径を宇宙の果て（$r \\to \\infty$）まで広げると：
                </p>
                <ul>
                  <li>球の表面積：$S = 4\\pi r^2$（$r^2$ のスピードで広がる）</li>
                  <li>電位 $\\times$ 電場：$\\phi E \\propto \\frac{1}{r} \\times \\frac{1}{r^2} = \\frac{1}{r^3}$（$r^3$ の圧倒的スピードで激減する！）</li>
                </ul>
                <p>
                  掛け合わせると $\\frac{1}{r^3} \\times r^2 = \\frac{1}{r} \\to 0$！
                  **「広がる面積」よりも「電場が薄まるスピード」の方が圧倒的に勝つ**から、宇宙の果てでは完全にゼロに消えてしまうんだね。
                </p>
              </div>
            </div>
          </section>

          <hr class="blog-divider" />

          <!-- Section 4 -->
          <section class="blog-section">
            <h3 class="section-heading">第4章：事件発生！半径ゼロで体重が無限大に!?</h3>
            <p class="body-p">
              全空間のエネルギーを足し合わせると、半径 $R$ の球に電荷 $-e$ を詰め込んだ静電自己エネルギーは次のようになります：
            </p>

            <div class="formula-card">
              <div class="math-display">
                $$U = \\frac{e^2}{4\\pi\\varepsilon_0 R} \\quad \\text{（または球殻モデルで } \\frac{e^2}{8\\pi\\varepsilon_0 R} \\text{）}$$
              </div>
            </div>

            <div class="dialogue-block student">
              <span class="avatar">🎒</span>
              <div class="bubble">
                <p>分母に半径 $R$ がありますね！…あっ、もし電子が「大きさゼロの点（$R \\to 0$）」なら……</p>
              </div>
            </div>
            <div class="dialogue-block math">
              <span class="avatar">📐</span>
              <div class="bubble">
                <p>そう！分母がゼロの極限だ！</p>
                <div class="math-display">
                  $$\\lim_{R \\to +0} U(R) = \\lim_{R \\to +0} \\frac{e^2}{4\\pi\\varepsilon_0 R} = \\infty$$
                </div>
              </div>
            </div>
            <div class="dialogue-block physics">
              <span class="avatar">👨‍🏫</span>
              <div class="bubble">
                <p>
                  アインシュタインの $E = mc^2$（エネルギーは質量に等しい）を思い出してごらん。
                  エネルギーが無限大ということは、**電子1個の質量が無限大（$m = \\frac{U}{c^2} \\to \\infty$）**になってしまう！
                  これが、古典電磁気学が突き当たった巨大な壁**「自己エネルギーの発散問題」**なんだ。
                </p>
              </div>
            </div>

            <!-- Action Button: Trigger Singularity in Simulator -->
            <div class="interactive-prompt-box">
              <div class="prompt-text">
                <strong>⚡ シミュレーターで試してみよう：</strong>
                半径をゼロにすると、画面で何が起こるか体感できます。
              </div>
              <button type="button" class="btn btn-sm btn-danger btn-sim-action" data-action="singularity">
                ⚠️ 点電荷（R = 0）で無限大爆発を起こす
              </button>
            </div>
          </section>

          <hr class="blog-divider" />

          <!-- Section 5 -->
          <section class="blog-section">
            <h3 class="section-heading">第5章：探偵の推理「電子の古典半径」の誕生</h3>
            <div class="dialogue-block physics">
              <span class="avatar">👨‍🏫</span>
              <div class="bubble">
                <p>
                  「無限大になって困るなら、**電子にはちょっとだけ大きさがある**と考えよう！」
                  「そして、電子の体重（$m_e c^2 \\approx 0.511\\text{ MeV}$）のすべてが、この静電気の反発エネルギーでできていると仮定してみよう！」
                  と逆算したのがローレンツたちなんだ。
                </p>
              </div>
            </div>

            <div class="formula-card">
              <div class="math-display">
                $$m_e c^2 = \\frac{e^2}{4\\pi\\varepsilon_0 r_e} \\implies r_e = \\frac{e^2}{4\\pi\\varepsilon_0 m_e c^2} \\approx 2.82 \\times 10^{-15}\\text{ m} \\ (2.82\\text{ fm})$$
              </div>
            </div>

            <div class="dialogue-block student">
              <span class="avatar">🎒</span>
              <div class="bubble">
                <p>なるほど！天秤の左に「反発エネルギー」、右に「電子の本当の体重（$mc^2$）」を載せて、ピタッと釣り合う半径を求めたのが**「電子の古典半径」**なんですね！</p>
              </div>
            </div>

            <!-- Action Button: Balance in Simulator -->
            <div class="interactive-prompt-box">
              <div class="prompt-text">
                <strong>⚖️ シミュレーターで試してみよう：</strong>
                天秤が水平にピタッと釣り合う奇跡の瞬間を確認できます。
              </div>
              <button type="button" class="btn btn-sm btn-accent btn-sim-action" data-action="balance">
                ★ 天秤をジャスト釣り合わせる（2.82 fm）
              </button>
            </div>
          </section>

          <hr class="blog-divider" />

          <!-- Section 6 -->
          <section class="blog-section">
            <h3 class="section-heading">終章：今も生きる古典半径と、朝永振一郎のノーベル賞</h3>
            <div class="dialogue-block student">
              <span class="avatar">🎒</span>
              <div class="bubble">
                <p>でも先生、現代の実験では電子の大きさは見つかってない（大きさゼロの点に見える）んですよね？ じゃあ古典半径はもう使われない過去の遺物なんですか？</p>
              </div>
            </div>
            <div class="dialogue-block physics">
              <span class="avatar">👨‍🏫</span>
              <div class="bubble">
                <p>
                  とんでもない！今でも2つの意味で最前線で生きているよ。
                </p>
                <ol>
                  <li>
                    <strong>光の跳ね返り（トムソン散乱）</strong>：
                    X線を電子に当てると跳ね返る断面積は、今でも $\\sigma_T = \\frac{8\\pi}{3} r_e^2$ と計算される。
                    光から見ると、電子は今でも**「半径 $r_e$ の硬いピンポン球」のように振る舞って光を跳ね返す**んだ！
                  </li>
                  <li>
                    <strong>朝永振一郎博士の「くりこみ理論」</strong>：
                    「点と考えると無限大になる」という矛盾は、量子力学でも再び現れた。
                    日本の朝永博士は**「無限大のエネルギーを、実験で測れる質量の中に最初から繰り込んで相殺してしまう」**という驚異的な数学的手法を発見し、ノーベル物理学賞を受賞したんだ。
                  </li>
                </ol>
              </div>
            </div>
            <div class="dialogue-block student">
              <span class="avatar">🎒</span>
              <div class="bubble">
                <p>
                  すごい…！素朴な「点電荷」という仮定の違和感から、アインシュタインの $E=mc^2$、そしてノーベル賞の「くりこみ理論」まで、ぜんぶ一本の線で繋がってたんですね！物理がめちゃくちゃ面白くなってきました！
                </p>
              </div>
            </div>
          </section>

          <hr class="blog-divider" />

          <!-- Section 7: Interactive 3-Question Quiz -->
          <section class="blog-section quiz-section">
            <h3 class="section-heading">🎯 理解度チェック！3問マスタークイズ</h3>
            <p class="body-p">
              ここまでの対話とシミュレーションを振り返って、クイズに挑戦してみよう！全問正解で「古典電子半径マスターバッジ」が獲得できます！
            </p>

            <!-- Quiz Q1 -->
            <div class="quiz-card" data-quiz-id="q1">
              <div class="quiz-question">
                <span>Q1.</span>
                <span>静電エネルギー $U$ は一体どこに蓄えられているでしょうか？</span>
              </div>
              <div class="quiz-options">
                <button type="button" class="quiz-opt-btn" data-correct="false" data-feedback="惜しい！中心の核ではなく、電場が存在する空間全体に蓄えられています。">A. 電子そのものの中心の核の中</button>
                <button type="button" class="quiz-opt-btn" data-correct="true" data-feedback="正解！🎉 電場 E が張り巡らされた『周囲の空間そのもの』に 1/2 ε₀ E² の密度で蓄えられています！">B. 電場 $E$ が張り巡らされた周囲の空間そのもの</button>
                <button type="button" class="quiz-opt-btn" data-correct="false" data-feedback="不正解！電気が流れていない静止した状態でも静電エネルギーは空間に存在します。">C. 電流が流れる導線の端っこ</button>
              </div>
              <div class="quiz-feedback hidden"></div>
            </div>

            <!-- Quiz Q2 -->
            <div class="quiz-card" data-quiz-id="q2">
              <div class="quiz-question">
                <span>Q2.</span>
                <span>古典電子論において、電子の半径 $R \to 0$（点電荷）と仮定すると何が起こるでしょうか？</span>
              </div>
              <div class="quiz-options">
                <button type="button" class="quiz-opt-btn" data-correct="false" data-feedback="違います！分母の R が 0 に近づくので、0 ではなく逆に無限大に爆発します。">A. 静電エネルギーがゼロになって消滅する</button>
                <button type="button" class="quiz-opt-btn" data-correct="false" data-feedback="違います！重力よりも遥かに強い電場エネルギーが計算上暴走してしまいます。">B. 重力だけが残ってニュートン力学と完全に一致する</button>
                <button type="button" class="quiz-opt-btn" data-correct="true" data-feedback="大正解！🎉 分母 R が 0 になるため U = e²/(4πε₀ R) → ∞ となり、質量も無限大に爆発してしまいます！">C. 分母がゼロになり、自己エネルギーおよび質量が無限大（$\infty$）に発散する</button>
              </div>
              <div class="quiz-feedback hidden"></div>
            </div>

            <!-- Quiz Q3 -->
            <div class="quiz-card" data-quiz-id="q3">
              <div class="quiz-question">
                <span>Q3.</span>
                <span>「古典電子半径 $r_e \approx 2.82\text{ fm}$」はどのようにして決定された値でしょうか？</span>
              </div>
              <div class="quiz-options">
                <button type="button" class="quiz-opt-btn" data-correct="true" data-feedback="完璧！🎉 反発する静電エネルギー U と、現実の電子の静止エネルギー m_e c² (0.511 MeV) を天秤で釣り合わせて逆算した値です！">A. 反発する静電自己エネルギー $U$ が電子の静止エネルギー $m_e c^2$ と一致するよう逆算した</button>
                <button type="button" class="quiz-opt-btn" data-correct="false" data-feedback="違います！現代の実験でも電子の大きさは観測限界（10⁻¹⁸ m以下）で点に見えており、直接測定した球ではありません。">B. 電子顕微鏡で直接観察して球の大きさを測定した</button>
                <button type="button" class="quiz-opt-btn" data-correct="false" data-feedback="違います！ボーア半径（約 0.53 Å = 5.3×10⁻¹¹ m）は約2万倍も大きなスケールです。">C. 水素原子のボーア半径を100倍して求めた</button>
              </div>
              <div class="quiz-feedback hidden"></div>
            </div>

            <div id="quiz-badge-container" class="quiz-badge-unlock hidden">
              <div class="quiz-badge-icon">🎖️</div>
              <div class="quiz-badge-title">🎓 古典電子半径マスターバッジ獲得！</div>
              <div class="quiz-badge-desc">
                素晴らしい！電場エネルギーの局在性、発散の謎、そして $E=mc^2$ との天秤バランスを完璧に理解しました！
              </div>
            </div>
          </section>
        </div>

        <!-- Modal Footer -->
        <footer class="blog-modal-footer">
          <button type="button" class="btn btn-primary" id="btn-close-blog-modal-footer">シミュレーターに戻る</button>
        </footer>
      </div>
    `;

    this.container.appendChild(this.modalOverlay);

    // Bind Close buttons
    this.modalOverlay.querySelector('#btn-close-blog-modal')?.addEventListener('click', () => this.close());
    this.modalOverlay.querySelector('#btn-close-blog-modal-footer')?.addEventListener('click', () => this.close());

    // Bind Interactive Simulation Trigger Buttons inside blog
    this.modalOverlay.querySelectorAll<HTMLButtonElement>('.btn-sim-action').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'singularity') {
          this.onApplySimulationState({
            radiusMeters: 0,
            logScaleValue: 0,
            isPointCharge: true,
            isDiverged: true,
            currentMission: 'mission3_divergence'
          });
        } else if (action === 'balance') {
          this.onApplySimulationState({
            radiusMeters: CONSTANTS.r_classical_4pi,
            logScaleValue: ElectronPhysics.radiusToSlider(CONSTANTS.r_classical_4pi),
            modelType: '4pi',
            isPointCharge: false,
            isDiverged: false,
            isBalanced: true,
            currentMission: 'mission2_balance'
          });
        }
        this.close();
      });
    });

    // Bind Quiz Logic
    this.bindQuizEvents();

    // Render KaTeX for entire blog article
    const articleBody = this.modalOverlay.querySelector('#blog-article-body') as HTMLElement;
    if (articleBody) {
      try {
        renderMathInElement(articleBody, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      } catch (err) {
        console.warn('KaTeX auto-render in blog modal error:', err);
      }
    }
  }

  private bindQuizEvents(): void {
    if (!this.modalOverlay) return;

    const answeredQuestions = new Set<string>();
    const totalQuestions = 3;

    this.modalOverlay.querySelectorAll<HTMLElement>('.quiz-card').forEach((card) => {
      const qId = card.dataset.quizId;
      const feedback = card.querySelector<HTMLElement>('.quiz-feedback');
      const optButtons = card.querySelectorAll<HTMLButtonElement>('.quiz-opt-btn');

      optButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const isCorrect = btn.dataset.correct === 'true';
          const feedbackMsg = btn.dataset.feedback || '';

          // Reset options in this card
          optButtons.forEach((b) => {
            b.classList.remove('correct', 'wrong');
          });

          if (isCorrect) {
            btn.classList.add('correct');
            if (feedback) {
              feedback.className = 'quiz-feedback success';
              feedback.textContent = feedbackMsg;
              feedback.classList.remove('hidden');
            }
            if (qId) answeredQuestions.add(qId);
            soundEffects.playBalanceChime();

            // Check if all answered
            if (answeredQuestions.size === totalQuestions) {
              const badge = this.modalOverlay?.querySelector<HTMLElement>('#quiz-badge-container');
              if (badge) {
                badge.classList.remove('hidden');
                badge.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
              soundEffects.playSuccessFanfare();
            }
          } else {
            btn.classList.add('wrong');
            if (feedback) {
              feedback.className = 'quiz-feedback fail';
              feedback.textContent = feedbackMsg;
              feedback.classList.remove('hidden');
            }
            if (qId) answeredQuestions.delete(qId);
            soundEffects.playClick();
          }
        });
      });
    });
  }
}
