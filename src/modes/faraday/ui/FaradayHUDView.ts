import katex from 'katex';
import { FaradayMissionStep, FaradayPreset, FaradayState } from '../FaradayTypes.ts';
import { FARADAY_PRESETS, FaradayPhysics } from '../physics/FaradayPhysics.ts';
import { faradaySounds } from '../audio/FaradaySoundEffects.ts';
import { FaradayBlogModal } from './FaradayBlogModal.ts';

export class FaradayHUDView {
  private container: HTMLElement;
  private state: FaradayState;
  private onStateChange: (state: FaradayState) => void;
  private blogModal: FaradayBlogModal | null = null;
  private onLaunchBall: () => void;

  constructor(
    container: HTMLElement,
    initialState: FaradayState,
    onStateChange: (state: FaradayState) => void,
    onLaunchBall: () => void
  ) {
    this.container = container;
    this.state = initialState;
    this.onStateChange = onStateChange;
    this.onLaunchBall = onLaunchBall;
  }

  public mount(): void {
    this.renderSkeleton();
    this.blogModal = new FaradayBlogModal(this.container, (update) => {
      this.notifyUpdate({ ...this.state, ...update });
    });
    this.bindEvents();
    this.updateHUD();
  }

  public updateState(newState: FaradayState): void {
    this.state = newState;
    this.updateHUD();
  }

  private renderSkeleton(): void {
    this.container.innerHTML = `
      <div class="faraday-wrapper">
        <!-- 1. Top Mission Stepper Bar -->
        <div class="faraday-stepper-bar">
          <div class="mission-stepper">
            <button type="button" class="mission-tab ${this.state.currentMission === 'step1_potential_hill' ? 'active' : ''}" data-mission="step1_potential_hill">
              <span class="m-step">Step 1</span>
              <span class="m-title">等高線とボール滑落</span>
            </button>
            <div class="m-arrow">&rarr;</div>
            <button type="button" class="mission-tab ${this.state.currentMission === 'step2_flux_tube' ? 'active' : ''}" data-mission="step2_flux_tube">
              <span class="m-step">Step 2</span>
              <span class="m-title">ホース絞りと電気力管</span>
            </button>
            <div class="m-arrow">&rarr;</div>
            <button type="button" class="mission-tab ${this.state.currentMission === 'step3_orthogonal_sniper' ? 'active' : ''}" data-mission="step3_orthogonal_sniper">
              <span class="m-step">Step 3</span>
              <span class="m-title">90° 直交スナイパー</span>
            </button>
          </div>

          <div class="view-mode-toggle">
            <button type="button" class="btn btn-xs ${this.state.viewMode === 'intuitive' ? 'btn-accent' : 'btn-ghost'}" id="btn-faraday-intuitive">
              💡 高校生・直感モード
            </button>
            <button type="button" class="btn btn-xs ${this.state.viewMode === 'math' ? 'btn-accent' : 'btn-ghost'}" id="btn-faraday-math">
              📐 大学数式モード
            </button>
            <button type="button" class="btn btn-xs btn-outline" id="btn-open-faraday-blog">
              📖 解説ブログ
            </button>
            <button type="button" class="btn btn-xs btn-ghost" id="btn-toggle-faraday-sound" title="効果音のON/OFF">
              ${this.state.soundEnabled ? '🔊 SE' : '🔇 SE'}
            </button>
          </div>
        </div>

        <!-- 2. Main Two-Column Layout -->
        <div class="faraday-layout">
          <!-- Left Column: Interactive Simulation Stage -->
          <div class="faraday-stage-col">
            <div class="canvas-header-bar">
              <div class="canvas-badge-info">
                <span class="stage-tag" id="tag-current-preset">配置: 電気双極子 (＋とー)</span>
                <span class="stage-tag ${this.state.sniperBadgeUnlocked ? 'tag-success' : ''}" id="tag-sniper-status">
                  🎯 直交スナイパー: ${this.state.sniperSnappedCount} / 3
                </span>
              </div>
              <div class="canvas-quick-toggles">
                <button type="button" class="btn btn-xs btn-accent" id="btn-launch-ball">
                  💧 テスト電荷を転がす
                </button>
                <label class="toggle-label">
                  <input type="checkbox" id="chk-equipotential" ${this.state.showEquipotentialLines ? 'checked' : ''} />
                  <span>等高線</span>
                </label>
                <label class="toggle-label">
                  <input type="checkbox" id="chk-field-lines" ${this.state.showFieldLines ? 'checked' : ''} />
                  <span>力線</span>
                </label>
                <label class="toggle-label">
                  <input type="checkbox" id="chk-particles" ${this.state.showParticles ? 'checked' : ''} />
                  <span>水流粒子</span>
                </label>
                <label class="toggle-label">
                  <input type="checkbox" id="chk-flux-tube" ${this.state.showFluxTube ? 'checked' : ''} />
                  <span>電気力管</span>
                </label>
              </div>
            </div>

            <!-- Canvas Container -->
            <div class="faraday-canvas-container" id="faraday-canvas-container">
              <canvas id="faraday-canvas"></canvas>

              <!-- Interactive Floating Sniper Badge Notification -->
              <div id="hud-sniper-badge" class="sniper-badge-overlay ${this.state.sniperBadgeUnlocked ? 'active' : 'hidden'}">
                <div class="badge-box">
                  <div class="badge-icon">🎯</div>
                  <h4>【直交マスター認定！】</h4>
                  <p>3箇所の交点で <strong>90.0° 直交</strong> を検知！<br>電位の等高線と電気力線が「坂の傾斜と等高線」として常に直角に交わることを暴きました！</p>
                </div>
              </div>
            </div>

            <!-- Bottom Live Telemetry Banner -->
            <div class="faraday-telemetry-bar">
              <div class="telemetry-item">
                <span class="t-label">カーソル標高 (電位 φ):</span>
                <span class="t-val" id="val-cursor-phi">+0.0 V</span>
              </div>
              <div class="telemetry-item">
                <span class="t-label">電場強度 |E|:</span>
                <span class="t-val" id="val-cursor-e">0 N/C</span>
              </div>
              <div class="telemetry-item">
                <span class="t-label">なす角 θ:</span>
                <span class="t-val text-success" id="val-cursor-angle">90.0°</span>
              </div>
              <div class="telemetry-item">
                <span class="t-label">内積 E · dr:</span>
                <span class="t-val text-accent" id="val-cursor-work">0.00 (仕事ゼロ!)</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Controls, Math, and Narrative -->
          <div class="faraday-control-col">
            <!-- Preset Buttons -->
            <div class="card control-card">
              <div class="card-header">
                <h3>⚡ 電荷の配置プリセット</h3>
              </div>
              <div class="preset-grid">
                ${FARADAY_PRESETS.map((p) => `
                  <button type="button" class="btn btn-xs btn-preset ${this.state.presetId === p.id ? 'active' : ''}" data-preset-id="${p.id}">
                    <span class="p-name">${p.name}</span>
                    <span class="p-tag">${p.tag}</span>
                  </button>
                `).join('')}
              </div>
              <p class="card-subnote">💡 キャンバス上の電荷ドラッグして好きな場所に動かせます！</p>
            </div>

            <!-- Flux Tube Squeeze Card (Hose) -->
            <div class="card control-card">
              <div class="card-header">
                <h3>🌊 ホースの先を絞れ！（電気力管）</h3>
                <span class="badge badge-accent" id="badge-flux-conserved">束 Φ = 一定 (保存)</span>
              </div>
              <div class="tube-slider-wrap">
                <div class="slider-labels">
                  <span>激アツ激流 (細)</span>
                  <span>ゆったり水流 (太)</span>
                </div>
                <input type="range" id="slider-tube-squeeze" min="0.2" max="1.0" step="0.05" value="${this.state.fluxTubeSqueeze}" class="tube-slider" />
              </div>
              <div class="tube-stats-row">
                <div class="t-stat-box">
                  <span class="st-lbl">断面積 ΔS</span>
                  <span class="st-val" id="val-tube-area">--</span>
                </div>
                <div class="t-stat-arrow">&times;</div>
                <div class="t-stat-box">
                  <span class="st-lbl">電場 E (流速)</span>
                  <span class="st-val text-danger" id="val-tube-e">--</span>
                </div>
                <div class="t-stat-arrow">=</div>
                <div class="t-stat-box">
                  <span class="st-lbl">電場束 Φ</span>
                  <span class="st-val text-success" id="val-tube-phi">10000</span>
                </div>
              </div>
              <div class="tube-desc">
                「ホースの口をつぶすと水がビューッと速く飛ぶ」のと同じ！電荷がない空間では、力線の本数（電束）はどこでも一定です！
              </div>
            </div>

            <!-- Dynamic KaTeX Math Card -->
            <div class="card math-card">
              <div class="card-header">
                <h3>📖 数式のリアルタイム解剖</h3>
                <span class="badge badge-accent" id="badge-faraday-view-mode">
                  ${this.state.viewMode === 'intuitive' ? '高校の内積 A・B=0' : '大学の勾配 ∇φ'}
                </span>
              </div>
              <div id="faraday-dynamic-math" class="math-content-box">
                <!-- Dynamically injected -->
              </div>
            </div>

            <!-- Narrative / Story Mission Box -->
            <div class="card story-card">
              <div class="card-header">
                <h3 id="faraday-story-title">🎯 ミッションストーリー</h3>
              </div>
              <div id="faraday-story-content" class="story-body">
                <!-- Dynamically injected -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    // Mission Tabs
    this.container.querySelectorAll<HTMLButtonElement>('.mission-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const mission = tab.dataset.mission as FaradayMissionStep;
        if (mission) {
          faradaySounds.playClick();
          this.handleMissionSwitch(mission);
        }
      });
    });

    // View Mode Toggles
    this.container.querySelector('#btn-faraday-intuitive')?.addEventListener('click', () => {
      faradaySounds.playClick();
      this.notifyUpdate({ ...this.state, viewMode: 'intuitive' });
    });
    this.container.querySelector('#btn-faraday-math')?.addEventListener('click', () => {
      faradaySounds.playClick();
      this.notifyUpdate({ ...this.state, viewMode: 'math' });
    });

    // Sound toggle
    this.container.querySelector('#btn-toggle-faraday-sound')?.addEventListener('click', () => {
      const isMuted = faradaySounds.toggleMute();
      this.notifyUpdate({ ...this.state, soundEnabled: !isMuted });
    });

    // Open blog modal
    this.container.querySelector('#btn-open-faraday-blog')?.addEventListener('click', () => {
      this.blogModal?.open();
    });

    // Launch Ball Button
    this.container.querySelector('#btn-launch-ball')?.addEventListener('click', () => {
      this.onLaunchBall();
    });

    // Presets
    this.container.querySelectorAll<HTMLButtonElement>('.btn-preset').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.presetId as FaradayPreset['id'];
        const preset = FARADAY_PRESETS.find((p) => p.id === id);
        if (preset) {
          faradaySounds.playClick();
          const charges = preset.charges.map((c, idx) => ({
            id: `c_${idx}`,
            x: c.x,
            y: c.y,
            q: c.q,
            radius: 14
          }));
          this.notifyUpdate({
            ...this.state,
            presetId: id,
            charges
          });
        }
      });
    });

    // Checkboxes
    const chkEqui = this.container.querySelector<HTMLInputElement>('#chk-equipotential');
    chkEqui?.addEventListener('change', () => {
      this.notifyUpdate({ ...this.state, showEquipotentialLines: !!chkEqui.checked });
    });

    const chkField = this.container.querySelector<HTMLInputElement>('#chk-field-lines');
    chkField?.addEventListener('change', () => {
      this.notifyUpdate({ ...this.state, showFieldLines: !!chkField.checked });
    });

    const chkParts = this.container.querySelector<HTMLInputElement>('#chk-particles');
    chkParts?.addEventListener('change', () => {
      this.notifyUpdate({ ...this.state, showParticles: !!chkParts.checked });
    });

    const chkTube = this.container.querySelector<HTMLInputElement>('#chk-flux-tube');
    chkTube?.addEventListener('change', () => {
      this.notifyUpdate({ ...this.state, showFluxTube: !!chkTube.checked });
    });

    // Tube Squeeze Slider
    const sliderTube = this.container.querySelector<HTMLInputElement>('#slider-tube-squeeze');
    sliderTube?.addEventListener('input', (e) => {
      const val = parseFloat((e.target as HTMLInputElement).value);
      faradaySounds.playHoseSqueeze(val);
      this.notifyUpdate({ ...this.state, fluxTubeSqueeze: val });
    });
  }

  private handleMissionSwitch(mission: FaradayMissionStep): void {
    if (mission === 'step1_potential_hill') {
      this.notifyUpdate({
        ...this.state,
        currentMission: mission,
        showEquipotentialLines: true,
        showFieldLines: true,
        showFluxTube: false
      });
    } else if (mission === 'step2_flux_tube') {
      this.notifyUpdate({
        ...this.state,
        currentMission: mission,
        showEquipotentialLines: false,
        showFieldLines: true,
        showFluxTube: true,
        showParticles: true
      });
    } else if (mission === 'step3_orthogonal_sniper') {
      this.notifyUpdate({
        ...this.state,
        currentMission: mission,
        showEquipotentialLines: true,
        showFieldLines: true,
        showFluxTube: false
      });
    }
  }

  private notifyUpdate(next: FaradayState): void {
    this.state = next;
    this.onStateChange(next);
    this.updateHUD();
  }

  private updateHUD(): void {
    // 1. Mission tabs
    this.container.querySelectorAll<HTMLButtonElement>('.mission-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.mission === this.state.currentMission);
    });

    // 2. View Mode Toggle
    const btnIntuitive = this.container.querySelector('#btn-faraday-intuitive');
    const btnMath = this.container.querySelector('#btn-faraday-math');
    if (btnIntuitive && btnMath) {
      btnIntuitive.className = `btn btn-xs ${this.state.viewMode === 'intuitive' ? 'btn-accent' : 'btn-ghost'}`;
      btnMath.className = `btn btn-xs ${this.state.viewMode === 'math' ? 'btn-accent' : 'btn-ghost'}`;
    }

    const badgeMode = this.container.querySelector('#badge-faraday-view-mode');
    if (badgeMode) {
      badgeMode.textContent = this.state.viewMode === 'intuitive' ? '高校の内積 A・B=0' : '大学の勾配 ∇φ';
    }

    // 3. Sound toggle button
    const btnSound = this.container.querySelector('#btn-toggle-faraday-sound');
    if (btnSound) {
      btnSound.textContent = this.state.soundEnabled ? '🔊 SE' : '🔇 SE';
    }

    // Checkboxes sync
    const chkEqui = this.container.querySelector<HTMLInputElement>('#chk-equipotential');
    if (chkEqui) chkEqui.checked = this.state.showEquipotentialLines;

    const chkField = this.container.querySelector<HTMLInputElement>('#chk-field-lines');
    if (chkField) chkField.checked = this.state.showFieldLines;

    const chkParts = this.container.querySelector<HTMLInputElement>('#chk-particles');
    if (chkParts) chkParts.checked = this.state.showParticles;

    const chkTube = this.container.querySelector<HTMLInputElement>('#chk-flux-tube');
    if (chkTube) chkTube.checked = this.state.showFluxTube;

    // 4. Preset buttons
    this.container.querySelectorAll<HTMLButtonElement>('.btn-preset').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.presetId === this.state.presetId);
    });

    // 5. Preset tag & Sniper tag
    const tagPreset = this.container.querySelector('#tag-current-preset');
    const currPreset = FARADAY_PRESETS.find((p) => p.id === this.state.presetId);
    if (tagPreset && currPreset) {
      tagPreset.textContent = `配置: ${currPreset.name}`;
    }

    const tagSniper = this.container.querySelector('#tag-sniper-status');
    if (tagSniper) {
      tagSniper.textContent = `🎯 直交スナイパー: ${this.state.sniperSnappedCount} / 3`;
      tagSniper.className = this.state.sniperBadgeUnlocked ? 'stage-tag tag-success' : 'stage-tag';
    }

    // 6. Sniper badge overlay
    const badgeOverlay = this.container.querySelector('#hud-sniper-badge');
    if (badgeOverlay) {
      badgeOverlay.classList.toggle('hidden', !this.state.sniperBadgeUnlocked);
      badgeOverlay.classList.toggle('active', this.state.sniperBadgeUnlocked);
    }

    // 7. Telemetry live readouts
    const valPhi = this.container.querySelector('#val-cursor-phi');
    const valE = this.container.querySelector('#val-cursor-e');
    const valAngle = this.container.querySelector('#val-cursor-angle');
    const valWork = this.container.querySelector('#val-cursor-work');

    if (valPhi) valPhi.textContent = `${this.state.cursorPotential >= 0 ? '+' : ''}${this.state.cursorPotential.toFixed(1)} V`;
    if (valE) valE.textContent = `${this.state.cursorEFieldMag.toFixed(0)} N/C`;
    if (valAngle) valAngle.textContent = `${this.state.cursorAngleDeg.toFixed(1)}°`;
    if (valWork) valWork.textContent = `${this.state.cursorInnerProduct.toFixed(2)} (仕事ゼロ!)`;

    // 8. Tube Stats
    const tubeInfo = FaradayPhysics.calculateFluxTube(this.state.fluxTubeSqueeze);
    const valArea = this.container.querySelector('#val-tube-area');
    const valTubeE = this.container.querySelector('#val-tube-e');
    const valTubePhi = this.container.querySelector('#val-tube-phi');
    if (valArea) valArea.textContent = tubeInfo.areaS.toFixed(0);
    if (valTubeE) valTubeE.textContent = tubeInfo.electricFieldE.toFixed(0);
    if (valTubePhi) valTubePhi.textContent = tubeInfo.fluxPhi.toFixed(0);

    // 9. Update Math Box
    this.updateMathContent(tubeInfo);

    // 10. Update Story Box
    this.updateStoryContent();
  }

  private updateMathContent(tubeInfo: ReturnType<typeof FaradayPhysics.calculateFluxTube>): void {
    const mathBox = this.container.querySelector('#faraday-dynamic-math');
    if (!mathBox) return;

    if (this.state.viewMode === 'intuitive') {
      mathBox.innerHTML = `
        <div class="intuitive-bubble-math">
          <div class="math-row">
            <div class="math-tex" id="faraday-tex-1"></div>
            <div class="speech-bubble">
              💬 <strong>仕事ゼロの等高線：</strong> 等電位線上を歩いても標高（電位）が変わらないので、足の仕事はゼロ！内積が 0 だから、電場（坂の向き）と等高線は必ず 90° 直交する！
            </div>
          </div>
          <div class="math-row">
            <div class="math-tex" id="faraday-tex-2"></div>
            <div class="speech-bubble">
              💬 <strong>ホースの連続の式：</strong> ホースの先を指で狭めると水流がビューッと速くなるように、断面積 ΔS を狭めると電場 E（流速）が跳ね上がる！
            </div>
          </div>
        </div>
      `;

      katex.render(
        `\\vec{E} \\cdot d\\vec{r} = |\\vec{E}| |d\\vec{r}| \\cos 90^\\circ = 0 \\implies \\vec{E} \\perp \\text{等高線}`,
        mathBox.querySelector('#faraday-tex-1') as HTMLElement,
        { throwOnError: false }
      );
      katex.render(
        `E \\cdot \\Delta S = ${tubeInfo.electricFieldE.toFixed(0)} \\times ${tubeInfo.areaS.toFixed(0)} = ${tubeInfo.fluxPhi.toFixed(0)} \\quad (\\text{電場束は一定})`,
        mathBox.querySelector('#faraday-tex-2') as HTMLElement,
        { throwOnError: false }
      );
    } else {
      mathBox.innerHTML = `
        <div class="formal-math-box">
          <div class="tex-line" id="faraday-formal-1"></div>
          <div class="tex-line" id="faraday-formal-2"></div>
          <div class="tex-line" id="faraday-formal-3"></div>
        </div>
      `;

      katex.render(
        `\\boldsymbol{E} = -\\nabla \\phi = -\\left( \\frac{\\partial \\phi}{\\partial x}\\boldsymbol{i} + \\frac{\\partial \\phi}{\\partial y}\\boldsymbol{j} \\right)`,
        mathBox.querySelector('#faraday-formal-1') as HTMLElement,
        { throwOnError: false }
      );
      katex.render(
        `d\\phi = \\nabla\\phi \\cdot d\\boldsymbol{r} = -\\boldsymbol{E} \\cdot d\\boldsymbol{r} = 0 \\implies \\boldsymbol{E} \\perp d\\boldsymbol{r}`,
        mathBox.querySelector('#faraday-formal-2') as HTMLElement,
        { throwOnError: false }
      );
      katex.render(
        `\\iint_{\\text{管全体}} \\boldsymbol{E}\\cdot\\boldsymbol{n}\\, dS = 0 \\implies E_1 \\Delta S_1 = E_2 \\Delta S_2 = \\Phi`,
        mathBox.querySelector('#faraday-formal-3') as HTMLElement,
        { throwOnError: false }
      );
    }
  }

  private updateStoryContent(): void {
    const storyTitle = this.container.querySelector('#faraday-story-title');
    const storyContent = this.container.querySelector('#faraday-story-content');
    if (!storyTitle || !storyContent) return;

    if (this.state.currentMission === 'step1_potential_hill') {
      storyTitle.textContent = '🎯 Step 1: 電位の山と最急降下ボール';
      storyContent.innerHTML = `
        <p>画面のプラス電荷（赤い山）をクリックしてテスト電荷ボールを放ってみよう！</p>
        <p>ボールは重力に引かれるように、電位の山を<strong>最も急な下り坂（最急降下）</strong>に沿って駆け下り、負電荷（青い谷）へと吸い込まれます。</p>
        <div class="mission-tip">
          💡 ボールが通過した光のラインこそが<strong>「電気力線」</strong>そのもの！等高線と必ず直角に交わる美しい幾何学を観察してください。
        </div>
      `;
    } else if (this.state.currentMission === 'step2_flux_tube') {
      storyTitle.textContent = '🎯 Step 2: ホース絞りと電気力管';
      storyContent.innerHTML = `
        <p>電気力線を束ねた仮想のホースが<strong>「電気力管」</strong>です。横のスライダーで断面積 ΔS をギュッと絞ってみよう！</p>
        <p>管の中を流れる光の粒子が猛烈に加速し、青から激アツの赤色へ変化します！</p>
        <div class="mission-tip">
          💡 「断面積 × 電場 ＝ 一定」！管が狭まるほど電場が強くなる幾何学的理由が、この保存則から一瞬で理解できます。
        </div>
      `;
    } else {
      storyTitle.textContent = '🎯 Step 3: 90° 直交スナイパーチャレンジ';
      storyContent.innerHTML = `
        <p>マウスカーソルを画面の力線と等高線の交点に近づけると、自動でルーペがピタッとスナップします！</p>
        <p>異なる3箇所の交点をスナップして、どんな歪んだ電場でも<strong>常にジャスト 90.0°</strong> で交わることを証明せよ！</p>
        <div class="mission-tip">
          💡 3箇所見つけると<strong>「🎯 直交マスター認定バッジ」</strong>を獲得できます！
        </div>
      `;
    }
  }
}
