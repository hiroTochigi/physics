import renderMathInElement from 'katex/contrib/auto-render';
import { FaradayState } from '../FaradayTypes.ts';
import { faradaySounds } from '../audio/FaradaySoundEffects.ts';

export class FaradayBlogModal {
  private container: HTMLElement;
  private modalOverlay: HTMLElement | null = null;
  private onApplySimulationState: (stateUpdate: Partial<FaradayState>) => void;

  constructor(container: HTMLElement, onApplySimulationState: (stateUpdate: Partial<FaradayState>) => void) {
    this.container = container;
    this.onApplySimulationState = onApplySimulationState;
  }

  public open(): void {
    if (!this.modalOverlay) {
      this.renderModal();
    }
    this.modalOverlay?.classList.remove('hidden');
    faradaySounds.playClick();
  }

  public close(): void {
    this.modalOverlay?.classList.add('hidden');
    faradaySounds.playClick();
  }

  private renderModal(): void {
    this.modalOverlay = document.createElement('div');
    this.modalOverlay.id = 'faraday-blog-modal';
    this.modalOverlay.className = 'electron-blog-modal-overlay hidden';

    this.modalOverlay.innerHTML = `
      <div class="electron-blog-modal-content">
        <!-- Modal Header -->
        <header class="blog-modal-header">
          <div class="blog-modal-title-wrap">
            <span class="blog-badge">高校生と挑む電磁気学・第2弾</span>
            <h2>ファラデーが視た「見えない空間の幾何学」<br>〜数式が苦手だった鍛冶屋の息子が起こした電磁気学革命〜</h2>
            <div class="blog-meta-tags">
              <span class="meta-tag">⏱️ 読了目安: 約7分</span>
              <span class="meta-tag">🎓 登場人物: 高校生・物理教師・数学教師</span>
            </div>
          </div>
          <button type="button" class="btn-close-modal" id="btn-close-faraday-modal" aria-label="閉じる">✕</button>
        </header>

        <!-- Characters Intro Banner -->
        <div class="characters-banner">
          <div class="char-chip char-student">
            <span class="char-avatar">🎒</span>
            <div class="char-info">
              <strong>ハルキ（高校生）</strong>
              <span>「電気力線の本数の端数」に疑問を抱く理系高校生。</span>
            </div>
          </div>
          <div class="char-chip char-physics">
            <span class="char-avatar">👨‍🏫</span>
            <div class="char-info">
              <strong>タカハシ先生（物理教師）</strong>
              <span>「ホースの水流」で電場束を教える熱血指導者。</span>
            </div>
          </div>
          <div class="char-chip char-math">
            <span class="char-avatar">📐</span>
            <div class="char-info">
              <strong>カトウ先生（数学教師）</strong>
              <span>登山の等高線と内積ゼロで直交性を幾何学的に証明。</span>
            </div>
          </div>
        </div>

        <!-- Scrollable Article Body -->
        <div class="blog-article-body" id="faraday-article-body">
          <!-- Intro -->
          <section class="blog-section">
            <div class="dialogue-block student">
              <span class="avatar">🎒</span>
              <div class="bubble">
                <p>先生！ 今日の電磁気学の授業でまたモヤモヤが爆発しました！</p>
                <p>教科書に<strong>「$1\\text{ C}$ の電荷から $N = \\frac{1}{\\varepsilon_0}$ 本の電気力線が出る」</strong>って書いてあるんですけど、$\\varepsilon_0 \\approx 8.85 \\times 10^{-12}$ だから本数を計算すると約1100億本…？「本数」なのに割り算で小数や変な端数が出るってどういうことですか！？ 電気力線って本当に実在する毛みたいな線なんですか？</p>
              </div>
            </div>
            <div class="dialogue-block physics">
              <span class="avatar">👨‍🏫</span>
              <div class="bubble">
                <p>ワハハ！ ハルキ君、その疑問は100点満点だ！ 実はね、その「線の本数のモヤモヤ」を解き明かす鍵は、今から200年前に<strong>マイケル・ファラデー</strong>という一人の独学の天才が視ていた「空間の幾何学」にあるんだよ。</p>
              </div>
            </div>
            <div class="dialogue-block math">
              <span class="avatar">📐</span>
              <div class="bubble">
                <p>カトウです。さらに教科書には「等電位面と電気力線はなぜか直交する」って背理法で書いてあるよね。あれも高校数学の<strong>「ベクトルの内積＝0」と「登山の等高線」</strong>を使えば、一瞬で鳥肌が立つほど綺麗に腑に落ちるよ！</p>
              </div>
            </div>
          </section>

          <hr class="blog-divider" />

          <!-- Section 1 -->
          <section class="blog-section">
            <h3 class="section-heading">第1章：数学が使えなかった男・ファラデーの魂のデッサン</h3>
            <p class="body-p">
              マイケル・ファラデーは、ロンドンの貧しい鍛冶屋の家に生まれました。
              小学校しか卒業できず、13歳から製本工場の小僧として働きながら、運ばれてくる百科事典を仕事の合間に読み漁って科学を独学しました。
              そのため、彼は<strong>ニュートン力学のような高度な微積分や大学数学がまったく使えなかった</strong>のです。
            </p>
            <div class="dialogue-block physics">
              <span class="avatar">👨‍🏫</span>
              <div class="bubble">
                <p>
                  当時の大学教授や数学者たちは「電荷同士が何もない空間を飛び越えて引き合う（遠隔作用）」と数式をこねくり回して満足していた。
                  でも数式を使えないファラデーは、自分の肉体の感覚で激しい違和感を覚えた。
                  <strong>「何もない虚空を力がワープするはずがない！ 空間そのものに、目に見えないゴム紐のような【力線】がびっしり張り巡らされ、互いに押し合い、引き合っているんだ！」</strong>とね。
                </p>
              </div>
            </div>
            <div class="dialogue-block student">
              <span class="avatar">🎒</span>
              <div class="bubble">
                <p>えっ！ ファラデーって数式が苦手だったんですか！？ 現代の物理学者って全員数式の鬼だと思ってました…</p>
              </div>
            </div>
            <div class="dialogue-block physics">
              <span class="avatar">👨‍🏫</span>
              <div class="bubble">
                <p>
                  そうなんだ。後に電磁気学を数式で完成させた大天才マクスウェルは、ファラデーの実験ノートを見て戦慄したと言われているよ。
                  <strong>『私は、ファラデーが心の中に描いた幾何学の絵を、数学の言葉（ベクトル解析）に翻訳しただけにすぎない』</strong>とね！
                </p>
              </div>
            </div>
          </section>

          <hr class="blog-divider" />

          <!-- Section 2 -->
          <section class="blog-section">
            <h3 class="section-heading">第2章：ホースの先を指で絞れ！電気力管と電場束保存</h3>
            <p class="body-p">
              では、冒頭のハルキ君の疑問「なぜ本数が割り算なのか？」を解決しましょう。
              庭の水まきで、ホースの先端を指でギュッとつぶしたときのことを思い出してください。
            </p>
            <div class="dialogue-block student">
              <span class="avatar">🎒</span>
              <div class="bubble">
                <p>水が「ビューッ！」と勢いを増して遠くまで飛びます！</p>
              </div>
            </div>
            <div class="dialogue-block physics">
              <span class="avatar">👨‍🏫</span>
              <div class="bubble">
                <p>
                  その通り！ 途中で水が漏れたり湧き出したりしなければ、**「ホースの断面積 $\\Delta S \\times$ 流速 $v$ ＝ 一定」**だね。
                  電荷がない空間で、電気力線に沿って作った仮想の円筒空間を**「電気力管（Tube of Force）」**と定義してみよう。
                </p>
              </div>
            </div>

            <div class="formula-card">
              <div class="math-display">
                $$\\int_S \\boldsymbol{E} \\cdot \\boldsymbol{n} \\, dS + \\int_{S'} \\boldsymbol{E}' \\cdot \\boldsymbol{n}' \\, dS = 0$$
                $$\\boldsymbol{E}\\cdot\\boldsymbol{n} = -E, \\quad \\boldsymbol{E}'\\cdot\\boldsymbol{n}' = E' \\implies E \\Delta S = E' \\Delta S' = N$$
              </div>
              <div class="formula-notes">
                <div class="note-item">
                  <span class="note-bullet">🚿</span>
                  <span><strong>側面からの出入りはゼロ</strong>：電気力線に沿った管なので、側面の法線とは常に $\\boldsymbol{E}\\cdot\\boldsymbol{n} = 0$（漏れなし！）。</span>
                </div>
                <div class="note-item">
                  <span class="note-bullet">🔍</span>
                  <span><strong>電場束と本数</strong>：電場に面積を掛けた $E \\Delta S$ を「電場束」と呼び、これを「電気力線の本数 $N$」とも呼ぶ！</span>
                </div>
                <div class="note-item">
                  <span class="note-bullet">💎</span>
                  <span><strong>単位電気力管（Unit Tube of Force）</strong>：力線が1本だけ通っている電気力管のこと。本数の密度 $\\frac{N}{\\Delta S} = E$ こそが電場の強さそのもの！</span>
                </div>
              </div>
            </div>

            <div class="callout callout-insight">
              <strong>💡 クーロンの法則（$1/r^2$）の幾何学的正体：</strong><br>
              点電荷から四方八方に球状に広がる電気力管を考えると、距離 $r$ での断面積は球の表面積 $4\\pi r^2$ に比例して広がります。
              断面積が $r^2$ 倍に広がるから、流速（電場 $E$）は薄まって $1/r^2$ になる――ただそれだけのシンプルな幾何学の必然だったのです！
            </div>

            <!-- Interactive Action Button -->
            <div class="interactive-prompt-box">
              <div class="prompt-text">
                <strong>🌊 シミュレーターで試してみよう：</strong>
                電気力管スライダーで断面積を絞り、中の光の粒子が超加速する様子を体感できます。
              </div>
              <button type="button" class="btn btn-sm btn-accent btn-sim-action" data-action="fluxtube">
                🌊 電気力管ホースを絞ってみる
              </button>
            </div>
          </section>

          <hr class="blog-divider" />

          <!-- Section 3 -->
          <section class="blog-section">
            <h3 class="section-heading">第3章：スキー場のゲレンデと等高線――なぜ必ず「90度直角」なのか？</h3>
            <p class="body-p">
              続いて最大の難所、「等電位面と電気力線はなぜ直交するのか？」です。
              教科書の「もし直交していなければ…」という背理法の説明、頭に入ってきづらいですよね。
              カトウ先生、山登りのアナロジーをお願いします！
            </p>
            <div class="dialogue-block math">
              <span class="avatar">📐</span>
              <div class="bubble">
                <p>
                  任せて！ 電位 $\\phi$ を「山の標高（高さ）」、**等電位線を「等高線」**だとイメージしよう。
                  プラス電荷は「そびえ立つ富士山」、マイナス電荷は「すり鉢状のクレーター」だ。
                </p>
                <p>
                  山の斜面の上に、丸いボール（$+1\\text{ C}$ の電荷）をポツンと置いたら、どっちに転がる？
                </p>
              </div>
            </div>
            <div class="dialogue-block student">
              <span class="avatar">🎒</span>
              <div class="bubble">
                <p>それは…一番急な下り坂に向かって真っ直ぐ転がり落ちます！ 等高線に沿って真横に転がるボールなんてありません！</p>
              </div>
            </div>
            <div class="dialogue-block math">
              <span class="avatar">📐</span>
              <div class="bubble">
                <p>
                  その通り！ 地図を見れば一目瞭然だ。**「一番坂が急な下り方向（最大傾斜線）」は、等高線と絶対に直角（90度）に交わる！**
                  そして、ボールが坂を転がり落ちた軌跡こそが、まさに**「電気力線」**なんだ！
                </p>
              </div>
            </div>

            <div class="formula-card">
              <div class="math-display">
                $$\\vec{E} \\cdot \\delta\\vec{r} = |\\vec{E}| |\\delta\\vec{r}| \\cos 90^\\circ = 0 \\implies \\phi(\\boldsymbol{r} + \\delta\\boldsymbol{r}) = \\phi(\\boldsymbol{r})$$
              </div>
              <div class="formula-notes">
                <div class="note-item">
                  <span class="note-bullet">🏔️</span>
                  <span><strong>等高線ハイキング</strong>：高さが変わらない道を歩くとき、重力（電場）に逆らう仕事はゼロ（エネルギー消費なし）。</span>
                </div>
                <div class="note-item">
                  <span class="note-bullet">📐</span>
                  <span>高校で習うベクトルの内積 $\\vec{a}\\cdot\\vec{b} = 0 \\iff \\vec{a} \\perp \\vec{b}$ と寸分狂わず一致！</span>
                </div>
              </div>
            </div>

            <!-- Interactive Action Button -->
            <div class="interactive-prompt-box">
              <div class="prompt-text">
                <strong>🎯 シミュレーターで試してみよう：</strong>
                ルーペを交点に当てて「90.0° 直交」を検知し、直交マスターバッジを獲得できます。
              </div>
              <button type="button" class="btn btn-sm btn-accent btn-sim-action" data-action="sniper">
                🎯 90° 直交スナイパーに挑戦する
              </button>
            </div>
          </section>

          <hr class="blog-divider" />

          <!-- Section 4 -->
          <section class="blog-section">
            <h3 class="section-heading">第4章：数学の架け橋（高校の内積 $\\to$ 大学の勾配 $\\nabla\\phi$）</h3>

            <div class="callout callout-safetynet">
              <p><strong>💡 カトウ先生からのアドバイス（読み飛ばしOK！）：</strong></p>
              <p>「この章に出てくる $\\nabla$（ナブラ）は、大学数学で使うカッコいい記号の紹介です！
              要するに言っていることは<strong>『高校で習ったベクトルの内積 $\\vec{A}\\cdot\\vec{B} = 0$ が 90度 を表す』</strong>ということだけなので、気軽に眺めてね！」</p>
            </div>

            <p class="body-p">
              1次元の高さの変化は $d\\phi = \\phi'(x) dx$ でした。
              3次元空間でちょっとだけ仮想変位（$\\delta\\boldsymbol{r} = (\\delta x, \\delta y, \\delta z)$）したときの標高の変化は、それぞれの方向の傾き（偏微分）を掛け合わせて足します：
            </p>

            <div class="formula-card">
              <div class="math-display">
                $$\\boldsymbol{E} = -\\nabla \\phi \\implies \\boldsymbol{E} \\cdot \\delta\\boldsymbol{r} = -(\\nabla \\phi) \\cdot \\delta\\boldsymbol{r} = 0$$
              </div>
              <div class="formula-notes">
                <div class="note-item">
                  <span class="note-bullet">🚀</span>
                  <span>$\\nabla\\phi$（ナブラ）：最も急な登り坂を指す3D矢印（勾配ベクトル）。</span>
                </div>
                <div class="note-item">
                  <span class="note-bullet">⚡</span>
                  <span>電場 $\\boldsymbol{E} = -\\nabla \\phi$：ボールが転がり落ちる「最も急な下り坂」の向き！ 内積が 0 だから等電位面上で標高は変わらない！</span>
                </div>
              </div>
            </div>
          </section>

          <hr class="blog-divider" />

          <!-- Section 5 -->
          <section class="blog-section">
            <h3 class="section-heading">第5章：もし斜めに交わったら？（背理法の思考実験）</h3>
            <div class="dialogue-block student">
              <span class="avatar">🎒</span>
              <div class="bubble">
                <p>もし…もし万が一、電気力線と等電位面が斜めに交わっていたとしたら、宇宙はどうなっちゃうんですか？</p>
              </div>
            </div>
            <div class="dialogue-block physics">
              <span class="avatar">👨‍🏫</span>
              <div class="bubble">
                <p>
                  素晴らしい思考実験だ！ もし斜めだとすると、電場を「等電位面に垂直な成分」と**「等電位面に平行な成分」**に分解できるね。
                  平行な成分があるということは……<strong>「平らなはずの道の上で、電荷が勝手に加速してエネルギーが湧き出してしまう」</strong>んだ！
                </p>
              </div>
            </div>
            <div class="dialogue-block student">
              <span class="avatar">🎒</span>
              <div class="bubble">
                <p>平らな道を歩いているだけで勝手に加速してジェットコースターになる！？ それは永久機関じゃないですか！</p>
              </div>
            </div>
            <div class="dialogue-block physics">
              <span class="avatar">👨‍🏫</span>
              <div class="bubble">
                <p>
                  その通り！ エネルギー保存則が崩壊してしまうね。だから自然界では、電場は等電位面に対して**「完全に垂直（90度）」**でしか存在することが許されないんだよ。
                </p>
              </div>
            </div>
          </section>

          <hr class="blog-divider" />

          <!-- Section 6: Quiz -->
          <section class="blog-section quiz-section">
            <h3 class="section-heading">🎯 理解度チェック！3問マスタークイズ</h3>
            <p class="body-p">
              ファラデーの幾何学をマスターできたか挑戦してみよう！ 全問正解で「🎖️ ファラデー幾何学探偵バッジ」が獲得できます！
            </p>

            <!-- Q1 -->
            <div class="quiz-card" data-quiz-id="q1">
              <div class="quiz-question">
                <span>Q1.</span>
                <span>電荷のない空間において、電気力管（ホース）の断面積 $\\Delta S$ を半分に絞ると、電場の強さ $E$ はどうなる？</span>
              </div>
              <div class="quiz-options">
                <button type="button" class="quiz-opt-btn" data-correct="false" data-feedback="違います！ホースの先を狭めると水流が速くなるのと同じです。">A. 半分（0.5倍）に弱まる</button>
                <button type="button" class="quiz-opt-btn" data-correct="true" data-feedback="大正解！🎉 電場束 E ΔS が一定に保存されるため、面積が半分になれば電場 E（流速・密度）は2倍に跳ね上がります！">B. 2倍に強くなる（激流になる）</button>
                <button type="button" class="quiz-opt-btn" data-correct="false" data-feedback="違います！電場は断面積に反比例して変化します。">C. まったく変わらない</button>
              </div>
              <div class="quiz-feedback hidden"></div>
            </div>

            <!-- Q2 -->
            <div class="quiz-card" data-quiz-id="q2">
              <div class="quiz-question">
                <span>Q2.</span>
                <span>等電位線（等高線）に沿って電荷を移動させるとき、電気の力（電場）がする仕事はいくら？</span>
              </div>
              <div class="quiz-options">
                <button type="button" class="quiz-opt-btn" data-correct="true" data-feedback="完璧！🎉 標高（電位）が変わらない等高線上を歩くため、電位差がゼロで仕事はゼロ（E・dr = 0）です！">A. ゼロ（仕事は生じない）</button>
                <button type="button" class="quiz-opt-btn" data-correct="false" data-feedback="違います！電位差がゼロなので qΔV = 0 です。">B. 電荷の大きさ q に比例して無限大になる</button>
                <button type="button" class="quiz-opt-btn" data-correct="false" data-feedback="違います！負の仕事ではなく、完全にゼロです。">C. 常にマイナス 100 J</button>
              </div>
              <div class="quiz-feedback hidden"></div>
            </div>

            <!-- Q3 -->
            <div class="quiz-card" data-quiz-id="q3">
              <div class="quiz-question">
                <span>Q3.</span>
                <span>なぜ電気力線と等電位面は、どんなに曲がった電場でも「絶対に90度直角」で交わるのでしょうか？</span>
              </div>
              <div class="quiz-options">
                <button type="button" class="quiz-opt-btn" data-correct="false" data-feedback="違います！ファラデーが便宜上決めたのではなく、電場と電位の厳密な物理法則です。">A. ファラデーが見栄えを良くするためにそう決めたから</button>
                <button type="button" class="quiz-opt-btn" data-correct="true" data-feedback="素晴らしい！🎉 電場 E は『最も急な下り坂（最大傾斜）』を指し、等高線は『高さが変わらない道』なので、幾何学的に必ず直角をなすからです！">B. 電場が『一番急な下り坂』を指し、等高線と必ず直角をなす幾何学的真理だから</button>
                <button type="button" class="quiz-opt-btn" data-correct="false" data-feedback="違います！電荷同士の反発ではなく、電場ベクトルの幾何学的性質です。">C. 電荷同士が引力で引き合うときに90度回転する性質があるから</button>
              </div>
              <div class="quiz-feedback hidden"></div>
            </div>

            <div id="faraday-quiz-badge-container" class="quiz-badge-unlock hidden">
              <div class="quiz-badge-icon">🎖️</div>
              <div class="quiz-badge-title">🎓 ファラデー幾何学探偵バッジ獲得！</div>
              <div class="quiz-badge-desc">
                お見事！ 電気力管の束保存、等高線と最急降下、そして 90° 直交の必然性を完璧にマスターしました！
              </div>
            </div>
          </section>
        </div>

        <!-- Modal Footer -->
        <footer class="blog-modal-footer">
          <button type="button" class="btn btn-primary" id="btn-close-faraday-modal-footer">シミュレーターに戻る</button>
        </footer>
      </div>
    `;

    this.container.appendChild(this.modalOverlay);

    // Bind Close buttons
    this.modalOverlay.querySelector('#btn-close-faraday-modal')?.addEventListener('click', () => this.close());
    this.modalOverlay.querySelector('#btn-close-faraday-modal-footer')?.addEventListener('click', () => this.close());

    // Bind In-blog Simulation triggers
    this.modalOverlay.querySelectorAll<HTMLButtonElement>('.btn-sim-action').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'fluxtube') {
          this.onApplySimulationState({
            currentMission: 'step2_flux_tube',
            showFluxTube: true,
            showEquipotentialLines: false,
            showFieldLines: true,
            fluxTubeSqueeze: 0.3
          });
        } else if (action === 'sniper') {
          this.onApplySimulationState({
            currentMission: 'step3_orthogonal_sniper',
            showEquipotentialLines: true,
            showFieldLines: true,
            showFluxTube: false
          });
        }
        this.close();
      });
    });

    // Bind Quiz Events
    this.bindQuizEvents();

    // Render KaTeX for blog article
    const articleBody = this.modalOverlay.querySelector('#faraday-article-body') as HTMLElement;
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
        console.warn('KaTeX auto-render in Faraday blog error:', err);
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

          optButtons.forEach((b) => b.classList.remove('correct', 'wrong'));

          if (isCorrect) {
            btn.classList.add('correct');
            if (feedback) {
              feedback.className = 'quiz-feedback success';
              feedback.textContent = feedbackMsg;
              feedback.classList.remove('hidden');
            }
            if (qId) answeredQuestions.add(qId);
            faradaySounds.play90DegreeSnap();

            if (answeredQuestions.size === totalQuestions) {
              const badge = this.modalOverlay?.querySelector<HTMLElement>('#faraday-quiz-badge-container');
              if (badge) {
                badge.classList.remove('hidden');
                const scrollContainer = this.modalOverlay?.querySelector('.blog-article-body');
                if (scrollContainer) {
                  scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
                }
              }
              faradaySounds.playSuccessFanfare();
            }
          } else {
            btn.classList.add('wrong');
            if (feedback) {
              feedback.className = 'quiz-feedback fail';
              feedback.textContent = feedbackMsg;
              feedback.classList.remove('hidden');
            }
            if (qId) answeredQuestions.delete(qId);
            faradaySounds.playClick();
          }
        });
      });
    });
  }
}
