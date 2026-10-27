import katex from 'katex';
import { ElectronMissionStep, ElectronState } from '../ElectronTypes.ts';
import { CONSTANTS, ElectronPhysics, PRESETS } from '../physics/ElectronPhysics.ts';
import { ElectronBlogModal } from './ElectronBlogModal.ts';
import { soundEffects } from '../audio/ElectronSoundEffects.ts';

export class ElectronHUDView {
  private container: HTMLElement;
  private state: ElectronState;
  private onStateChange: (state: ElectronState) => void;
  private blogModal: ElectronBlogModal | null = null;
  private previousBalanced: boolean = false;

  constructor(container: HTMLElement, initialState: ElectronState, onStateChange: (state: ElectronState) => void) {
    this.container = container;
    this.state = initialState;
    this.onStateChange = onStateChange;
  }

  public mount(): void {
    this.renderSkeleton();
    this.blogModal = new ElectronBlogModal(this.container, (update) => {
      this.notifyUpdate({ ...this.state, ...update });
    });
    this.bindEvents();
    this.updateHUD();
  }

  public updateState(newState: ElectronState): void {
    this.state = newState;
    this.updateHUD();
  }

  private renderSkeleton(): void {
    this.container.innerHTML = `
      <div class="electron-wrapper">
        <!-- 1. Top Mission Stepper Bar -->
        <div class="electron-stepper-bar">
          <div class="mission-stepper">
            <button type="button" class="mission-tab ${this.state.currentMission === 'mission1_field' ? 'active' : ''}" data-mission="mission1_field">
              <span class="m-step">Step 1</span>
              <span class="m-title">空間のエネルギー</span>
            </button>
            <div class="m-arrow">&rarr;</div>
            <button type="button" class="mission-tab ${this.state.currentMission === 'mission2_balance' ? 'active' : ''}" data-mission="mission2_balance">
              <span class="m-step">Step 2</span>
              <span class="m-title">電子圧縮＆天秤</span>
            </button>
            <div class="m-arrow">&rarr;</div>
            <button type="button" class="mission-tab ${this.state.currentMission === 'mission3_divergence' ? 'active' : ''}" data-mission="mission3_divergence">
              <span class="m-step">Step 3</span>
              <span class="m-title">点電荷の暴走・無限大</span>
            </button>
          </div>

          <div class="view-mode-toggle">
            <button type="button" class="btn btn-xs ${this.state.viewMode === 'intuitive' ? 'btn-accent' : 'btn-ghost'}" id="btn-toggle-intuitive">
              💡 高校生・直感モード
            </button>
            <button type="button" class="btn btn-xs ${this.state.viewMode === 'math' ? 'btn-accent' : 'btn-ghost'}" id="btn-toggle-math">
              📐 大学数式モード
            </button>
            <button type="button" class="btn btn-xs ${this.state.isGameMode ? 'btn-accent' : 'btn-outline'}" id="btn-toggle-game-mode">
              🎮 ピタ止めゲーム
            </button>
            <button type="button" class="btn btn-xs btn-outline" id="btn-open-blog-modal">
              📖 解説ブログ
            </button>
            <button type="button" class="btn btn-xs btn-ghost" id="btn-toggle-sound" title="効果音のON/OFF">
              ${this.state.soundEnabled ? '🔊 SE' : '🔇 SE'}
            </button>
          </div>
        </div>

        <!-- 2. Main Two-Column Layout -->
        <div class="electron-layout">
          <!-- Left Column: Interactive Simulation Stage -->
          <div class="electron-stage-col">
            <div class="canvas-header-bar">
              <div class="canvas-badge-info">
                <span class="stage-tag" id="tag-current-scale">スケール: 10⁻¹⁵ m (フェムト)</span>
                <span class="stage-tag" id="tag-balance-status">天秤: 測定中</span>
              </div>
              <div class="canvas-quick-toggles">
                <label class="toggle-label">
                  <input type="checkbox" id="chk-field-lines" ${this.state.showFieldLines ? 'checked' : ''} />
                  <span>電気力線</span>
                </label>
                <select id="sel-formula-model" class="model-select">
                  <option value="4pi" ${this.state.modelType === '4pi' ? 'selected' : ''}>標準定義 (4πε₀)</option>
                  <option value="8pi" ${this.state.modelType === '8pi' ? 'selected' : ''}>球殻モデル (8πε₀)</option>
                </select>
              </div>
            </div>

            <!-- Canvas Container -->
            <div class="electron-canvas-container" id="electron-canvas-container">
              <canvas id="electron-canvas"></canvas>

              <!-- Critical Singularity Warning HUD (hidden by default) -->
              <div id="hud-singularity-warning" class="singularity-overlay ${this.state.isDiverged ? 'active' : 'hidden'}">
                <div class="warning-box">
                  <div class="warning-icon">⚠️</div>
                  <h3>CRITICAL: ENERGY DIVERGENCE!</h3>
                  <p>電子の半径を 0 にしたため、分母がゼロになり静電エネルギーが<strong>無限大（∞）</strong>に爆発しました！</p>
                  <p class="sub-alert">「大きさゼロの点電荷」を素直に信じると、電子1個で全宇宙がブラックホールに飲み込まれます。</p>
                  <button type="button" class="btn btn-sm btn-accent" id="btn-recover-classical">★ 古典電子半径（2.82 fm）に戻す</button>
                </div>
              </div>
            </div>

            <!-- Interactive Scale Balance (天秤ギミック) -->
            <div class="balance-container ${this.state.isGameMode ? 'game-mode-active' : ''}">
              <div id="game-challenge-banner" class="game-challenge-banner ${this.state.isGameMode ? '' : 'hidden'}">
                <span class="banner-icon">🎯</span>
                <span class="banner-text" id="game-banner-text">
                  【ピタ止めチャレンジ】数値を隠しました！天秤の傾きだけを頼りに、0.511 MeV にピッタリ釣り合わせろ！
                </span>
              </div>
              <div class="balance-header">
                <span class="balance-title">⚖️ 質量・エネルギー天秤（アインシュタイン E=mc² の検証）</span>
                <span class="balance-indicator" id="balance-indicator-text">判定: 軽すぎる（自己エネルギー不足）</span>
              </div>
              <div class="balance-lever-wrap">
                <!-- Fulcrum and Lever -->
                <div class="balance-fulcrum"></div>
                <div class="balance-beam" id="balance-beam">
                  <!-- Left Pan: Calculated Self Energy -->
                  <div class="balance-pan pan-left" id="pan-left">
                    <div class="pan-label">計算上の静電エネルギー</div>
                    <div class="pan-value" id="val-calc-energy">-- J</div>
                    <div class="pan-mass" id="val-calc-mass">-- kg</div>
                  </div>
                  <!-- Right Pan: Real Electron Mass -->
                  <div class="balance-pan pan-right" id="pan-right">
                    <div class="pan-label">現実の電子の体重</div>
                    <div class="pan-value">0.511 MeV</div>
                    <div class="pan-mass">9.11 × 10⁻³¹ kg</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Controls, Math, and Narrative -->
          <div class="electron-control-col">
            <!-- Radius Log Slider -->
            <div class="card control-card">
              <div class="card-header">
                <h3>🔍 電子の半径 R を圧縮・拡大</h3>
                <span class="badge" id="lbl-current-radius">R = 2.82 fm</span>
              </div>
              <div class="slider-wrapper">
                <div class="slider-scale-labels">
                  <span>点 (R=0)</span>
                  <span>10⁻¹⁸ m</span>
                  <span>10⁻¹⁵ m</span>
                  <span>10⁻¹² m</span>
                  <span>10⁻¹⁰ m</span>
                </div>
                <input type="range" id="slider-radius" min="0" max="100" step="0.2" value="${this.state.logScaleValue}" class="log-slider" />
              </div>

              <!-- Preset Buttons -->
              <div class="preset-buttons">
                <div class="preset-title">ワンタップ・スケール移動:</div>
                <div class="preset-grid">
                  ${PRESETS.map((p) => `
                    <button type="button" class="btn btn-xs btn-preset" data-preset-id="${p.id}">
                      <span class="p-name">${p.name}</span>
                      <span class="p-tag">${p.tag}</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Everyday Scale Comparison Card -->
              <div class="scale-compare-section">
                <button type="button" class="btn btn-xs btn-outline scale-compare-btn" id="btn-toggle-scale-card">
                  📏 身近な物とのサイズ比較カード ${this.state.showScaleCard ? '▲ 閉じる' : '▼ 見る'}
                </button>
                <div id="box-scale-card" class="scale-card-box ${this.state.showScaleCard ? '' : 'hidden'}">
                  <div class="scale-card-headline">💡 もし古典電子半径（2.8 fm）が「パチンコ玉（直径1cm）」だったら…</div>
                  <div class="scale-card-row">
                    <span class="sc-icon">⚛️</span>
                    <div><strong>水素原子（10⁻¹⁰ m）</strong>：<strong>東京ドーム（直径約 350m）</strong></div>
                  </div>
                  <div class="scale-card-row">
                    <span class="sc-icon">🌊</span>
                    <div><strong>コンプトン波長（10⁻¹² m）</strong>：<strong>大型観光バス（長さ約 12m）</strong></div>
                  </div>
                  <div class="scale-card-row">
                    <span class="sc-icon">🧍</span>
                    <div><strong>人間（1.7 m）</strong>：<strong>地球〜月間の約 6 倍（約 240万 km）！</strong></div>
                  </div>
                  <div class="scale-card-footer">「原子は想像を絶するほどスカスカで、電子は想像を絶するほど極小」なのが分かります！</div>
                </div>
              </div>
            </div>

            <!-- Dynamic KaTeX Math & Human Translation Card -->
            <div class="card math-card">
              <div class="card-header">
                <h3 id="math-card-title">📖 数式のリアルタイム解剖</h3>
                <span class="badge badge-accent" id="badge-view-mode">${this.state.viewMode === 'intuitive' ? '直感吹き出し付き' : '厳密な大学数式'}</span>
              </div>
              <div id="dynamic-math-content" class="math-content-box">
                <!-- Injected dynamically -->
              </div>
            </div>

            <!-- Narrative / Story Mission Box -->
            <div class="card story-card">
              <div class="card-header">
                <h3 id="story-title">🎯 ミッションストーリー</h3>
              </div>
              <div id="story-content" class="story-body">
                <!-- Injected dynamically based on mission -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    // Slider
    const slider = this.container.querySelector<HTMLInputElement>('#slider-radius');
    slider?.addEventListener('input', (e) => {
      const val = parseFloat((e.target as HTMLInputElement).value);
      const radius = ElectronPhysics.sliderToRadius(val);
      const isPoint = val <= 0;
      soundEffects.playCompression(val / 100);
      this.notifyUpdate({
        ...this.state,
        logScaleValue: val,
        radiusMeters: radius,
        isPointCharge: isPoint,
        isDiverged: isPoint
      });
    });

    // Preset buttons
    this.container.querySelectorAll<HTMLButtonElement>('.btn-preset').forEach((btn) => {
      btn.addEventListener('click', () => {
        soundEffects.playClick();
        const id = btn.dataset.presetId;
        const preset = PRESETS.find((p) => p.id === id);
        if (preset) {
          const sliderVal = ElectronPhysics.radiusToSlider(preset.radius);
          const isPoint = preset.radius === 0;
          let modelType = this.state.modelType;
          if (id === 'classical_8pi') modelType = '8pi';
          if (id === 'classical_4pi') modelType = '4pi';
          if (isPoint) {
            soundEffects.playSingularityAlert();
          }
          this.notifyUpdate({
            ...this.state,
            modelType,
            radiusMeters: preset.radius,
            logScaleValue: sliderVal,
            isPointCharge: isPoint,
            isDiverged: isPoint
          });
        }
      });
    });

    // Sound toggle
    this.container.querySelector('#btn-toggle-sound')?.addEventListener('click', () => {
      const isMuted = soundEffects.toggleMute();
      this.notifyUpdate({ ...this.state, soundEnabled: !isMuted });
    });

    // Game mode toggle
    this.container.querySelector('#btn-toggle-game-mode')?.addEventListener('click', () => {
      soundEffects.playClick();
      this.notifyUpdate({
        ...this.state,
        isGameMode: !this.state.isGameMode,
        gameCleared: false
      });
    });

    // Scale card toggle
    this.container.querySelector('#btn-toggle-scale-card')?.addEventListener('click', () => {
      soundEffects.playClick();
      this.notifyUpdate({
        ...this.state,
        showScaleCard: !this.state.showScaleCard
      });
    });

    // Mission tabs
    this.container.querySelectorAll<HTMLButtonElement>('.mission-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const mission = tab.dataset.mission as ElectronMissionStep;
        if (mission) {
          this.handleMissionSwitch(mission);
        }
      });
    });

    // View mode toggle
    this.container.querySelector('#btn-toggle-intuitive')?.addEventListener('click', () => {
      this.notifyUpdate({ ...this.state, viewMode: 'intuitive' });
    });
    this.container.querySelector('#btn-toggle-math')?.addEventListener('click', () => {
      this.notifyUpdate({ ...this.state, viewMode: 'math' });
    });
    this.container.querySelector('#btn-open-blog-modal')?.addEventListener('click', () => {
      this.blogModal?.open();
    });

    // Field lines toggle
    const chkField = this.container.querySelector<HTMLInputElement>('#chk-field-lines');
    chkField?.addEventListener('change', () => {
      this.notifyUpdate({ ...this.state, showFieldLines: !!chkField.checked });
    });

    // Model select (4pi vs 8pi)
    const selModel = this.container.querySelector<HTMLSelectElement>('#sel-formula-model');
    selModel?.addEventListener('change', () => {
      const model = selModel.value as '4pi' | '8pi';
      this.notifyUpdate({ ...this.state, modelType: model });
    });

    // Recover button in singularity warning
    this.container.querySelector('#btn-recover-classical')?.addEventListener('click', () => {
      const r = this.state.modelType === '4pi' ? CONSTANTS.r_classical_4pi : CONSTANTS.r_classical_8pi;
      this.notifyUpdate({
        ...this.state,
        radiusMeters: r,
        logScaleValue: ElectronPhysics.radiusToSlider(r),
        isPointCharge: false,
        isDiverged: false
      });
    });
  }

  private handleMissionSwitch(mission: ElectronMissionStep): void {
    let newRadius = this.state.radiusMeters;
    let isPoint = false;

    if (mission === 'mission1_field') {
      newRadius = 5.29e-11; // Bohr scale
    } else if (mission === 'mission2_balance') {
      newRadius = this.state.modelType === '4pi' ? CONSTANTS.r_classical_4pi : CONSTANTS.r_classical_8pi;
    } else if (mission === 'mission3_divergence') {
      newRadius = 0; // Singularity
      isPoint = true;
    }

    this.notifyUpdate({
      ...this.state,
      currentMission: mission,
      radiusMeters: newRadius,
      logScaleValue: ElectronPhysics.radiusToSlider(newRadius),
      isPointCharge: isPoint,
      isDiverged: isPoint
    });
  }

  private notifyUpdate(next: ElectronState): void {
    // Check balance
    const targetR = next.modelType === '4pi' ? CONSTANTS.r_classical_4pi : CONSTANTS.r_classical_8pi;
    const ratio = next.radiusMeters > 0 ? targetR / next.radiusMeters : Infinity;
    const isBalanced = Math.abs(ratio - 1.0) < 0.08;

    // Trigger audio & clear state when balance is achieved
    if (isBalanced && !this.previousBalanced) {
      if (next.isGameMode) {
        next.gameCleared = true;
        soundEffects.playSuccessFanfare();
      } else {
        soundEffects.playBalanceChime();
      }
    }
    this.previousBalanced = isBalanced;

    next.isBalanced = isBalanced;
    this.state = next;
    this.onStateChange(next);
    this.updateHUD();
  }

  private updateHUD(): void {
    // 0. Update Control State UI (Buttons, Toggles, Scale Card)
    const btnSound = this.container.querySelector('#btn-toggle-sound');
    if (btnSound) {
      btnSound.textContent = this.state.soundEnabled ? '🔊 SE' : '🔇 SE';
    }

    const btnGame = this.container.querySelector('#btn-toggle-game-mode');
    if (btnGame) {
      btnGame.className = `btn btn-xs ${this.state.isGameMode ? 'btn-accent' : 'btn-outline'}`;
    }

    const btnScaleCard = this.container.querySelector('#btn-toggle-scale-card');
    if (btnScaleCard) {
      btnScaleCard.textContent = `📏 身近な物とのサイズ比較カード ${this.state.showScaleCard ? '▲ 閉じる' : '▼ 見る'}`;
    }

    const boxScaleCard = this.container.querySelector('#box-scale-card');
    if (boxScaleCard) {
      boxScaleCard.classList.toggle('hidden', !this.state.showScaleCard);
    }

    const gameBanner = this.container.querySelector('#game-challenge-banner');
    const gameBannerText = this.container.querySelector('#game-banner-text');
    if (gameBanner && gameBannerText) {
      if (this.state.isGameMode) {
        gameBanner.classList.remove('hidden');
        if (this.state.isBalanced) {
          gameBanner.classList.add('cleared');
          gameBannerText.innerHTML = '🎉 <strong>【ピタ止め成功！】</strong> 見事 0.511 MeV にピッタリ釣り合わせました！古典電子半径の導出完了です！';
        } else {
          gameBanner.classList.remove('cleared');
          gameBannerText.textContent = '【ピタ止めチャレンジ】数値を隠しました！天秤の傾きだけを頼りに、スライダーを動かして 0.511 MeV にピッタリ釣り合わせろ！';
        }
      } else {
        gameBanner.classList.add('hidden');
      }
    }

    // 1. Update Slider value and Radius label
    const slider = this.container.querySelector<HTMLInputElement>('#slider-radius');
    if (slider && document.activeElement !== slider) {
      slider.value = this.state.logScaleValue.toString();
    }

    const lblRadius = this.container.querySelector('#lbl-current-radius');
    if (lblRadius) {
      if (this.state.isPointCharge || this.state.radiusMeters === 0) {
        lblRadius.textContent = 'R = 0 (点電荷)';
        lblRadius.className = 'badge badge-danger';
      } else if (this.state.isGameMode && !this.state.isBalanced) {
        lblRadius.textContent = 'R = ??? fm (ブラインド探索中)';
        lblRadius.className = 'badge badge-accent';
      } else {
        lblRadius.textContent = this.formatRadius(this.state.radiusMeters);
        lblRadius.className = this.state.isBalanced ? 'badge badge-accent' : 'badge';
      }
    }

    // 2. Update Scale tag
    const tagScale = this.container.querySelector('#tag-current-scale');
    if (tagScale) {
      tagScale.textContent = this.getScaleDescription(this.state.radiusMeters);
    }

    // 3. Update Balance Beam and Values
    const ratio = ElectronPhysics.calculateEnergyRatio(this.state.radiusMeters, this.state.modelType);
    const selfEnergyJoules = ElectronPhysics.calculateSelfEnergyJoules(this.state.radiusMeters, this.state.modelType);
    const selfEnergyMeV = ElectronPhysics.calculateSelfEnergyMeV(this.state.radiusMeters, this.state.modelType);
    const calcMassKg = ElectronPhysics.calculateEquivalentMassKg(this.state.radiusMeters, this.state.modelType);

    const beam = this.container.querySelector<HTMLElement>('#balance-beam');
    const indicatorText = this.container.querySelector('#balance-indicator-text');
    const tagBalance = this.container.querySelector('#tag-balance-status');
    const valCalcEnergy = this.container.querySelector('#val-calc-energy');
    const valCalcMass = this.container.querySelector('#val-calc-mass');

    if (valCalcEnergy && valCalcMass) {
      if (!isFinite(selfEnergyJoules)) {
        valCalcEnergy.innerHTML = '<span class="text-danger font-bold">∞ (無限大)</span>';
        valCalcMass.innerHTML = '<span class="text-danger font-bold">m → ∞ (無限大)</span>';
      } else if (this.state.isGameMode && !this.state.isBalanced) {
        valCalcEnergy.innerHTML = '<span class="text-accent font-bold">??? MeV (？？？ J)</span>';
        valCalcMass.innerHTML = '<span class="text-accent font-bold">??? kg</span>';
      } else {
        valCalcEnergy.textContent = `${selfEnergyMeV.toFixed(3)} MeV (${selfEnergyJoules.toExponential(2)} J)`;
        valCalcMass.textContent = `${calcMassKg.toExponential(3)} kg`;
      }
    }

    if (beam && indicatorText && tagBalance) {
      if (this.state.isPointCharge || !isFinite(ratio)) {
        beam.style.transform = 'rotate(-32deg)';
        indicatorText.innerHTML = '<span class="text-danger font-bold">⚠️ クラッシュ！自己エネルギーが無限大</span>';
        tagBalance.textContent = '天秤: 暴走 (∞)';
        tagBalance.className = 'stage-tag tag-danger';
      } else if (this.state.isBalanced) {
        beam.style.transform = 'rotate(0deg)';
        indicatorText.innerHTML = '<span class="text-success font-bold">★ PERFECT BALANCE! 電子の質量と一致</span>';
        tagBalance.textContent = '天秤: ★ 均衡 (mc²一致)';
        tagBalance.className = 'stage-tag tag-success';
      } else if (ratio < 1) {
        // Under: Right side heavier
        const tilt = Math.max(-28, Math.min(28, (1 - ratio) * 20));
        beam.style.transform = `rotate(${tilt}deg)`;
        indicatorText.textContent = `判定: 軽すぎる (mc²の ${(ratio * 100).toFixed(1)}%)`;
        tagBalance.textContent = '天秤: 質量不足';
        tagBalance.className = 'stage-tag';
      } else {
        // Over: Left side heavier
        const tilt = Math.max(-30, Math.min(30, -(ratio - 1) * 10));
        beam.style.transform = `rotate(${tilt}deg)`;
        indicatorText.textContent = `判定: 重すぎる (mc²の ${ratio.toFixed(1)}倍)`;
        tagBalance.textContent = '天秤: 超過';
        tagBalance.className = 'stage-tag tag-warning';
      }
    }

    // 4. Singularity Warning Overlay
    const warningOverlay = this.container.querySelector('#hud-singularity-warning');
    if (warningOverlay) {
      if (this.state.isDiverged) {
        warningOverlay.classList.remove('hidden');
        warningOverlay.classList.add('active');
      } else {
        warningOverlay.classList.remove('active');
        warningOverlay.classList.add('hidden');
      }
    }

    // Update Model Select
    const selModel = this.container.querySelector<HTMLSelectElement>('#sel-formula-model');
    if (selModel && selModel.value !== this.state.modelType) {
      selModel.value = this.state.modelType;
    }

    // Update View Mode Toggle & Badge
    const badgeViewMode = this.container.querySelector('#badge-view-mode');
    if (badgeViewMode) {
      badgeViewMode.textContent = this.state.viewMode === 'intuitive' ? '直感吹き出し付き' : '厳密な大学数式';
    }
    const btnIntuitive = this.container.querySelector('#btn-toggle-intuitive');
    const btnMath = this.container.querySelector('#btn-toggle-math');
    if (btnIntuitive && btnMath) {
      btnIntuitive.className = `btn btn-xs ${this.state.viewMode === 'intuitive' ? 'btn-accent' : 'btn-ghost'}`;
      btnMath.className = `btn btn-xs ${this.state.viewMode === 'math' ? 'btn-accent' : 'btn-ghost'}`;
    }

    // Update Mission Tabs
    this.container.querySelectorAll<HTMLButtonElement>('.mission-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.mission === this.state.currentMission);
    });

    // 5. Update Math Content
    this.updateMathContent(selfEnergyJoules, selfEnergyMeV, calcMassKg);

    // 6. Update Story Mission Content
    this.updateStoryContent();
  }

  private formatLatexExp(val: number, decimals: number = 2): string {
    if (!isFinite(val)) return '\\infty';
    const str = val.toExponential(decimals);
    const [mantissa, exp] = str.split('e');
    const expNum = parseInt(exp, 10);
    if (expNum === 0) return mantissa;
    return `${mantissa} \\times 10^{${expNum}}`;
  }

  private updateMathContent(_uJ: number, uMeV: number, mKg: number): void {
    const mathBox = this.container.querySelector('#dynamic-math-content');
    if (!mathBox) return;

    const rText = this.state.isPointCharge || this.state.radiusMeters === 0
      ? '0'
      : this.formatLatexExp(this.state.radiusMeters, 2);
    const uText = isFinite(uMeV) ? `${uMeV.toFixed(3)}\\text{ MeV}` : '\\infty';
    const mText = isFinite(mKg) ? `${this.formatLatexExp(mKg, 2)}\\text{ kg}` : '\\infty';
    const factor = this.state.modelType === '4pi' ? '4\\pi' : '8\\pi';

    if (this.state.viewMode === 'intuitive') {
      mathBox.innerHTML = `
        <div class="intuitive-bubble-math">
          <div class="math-row">
            <div class="math-tex" id="tex-row-u"></div>
            <div class="speech-bubble">
              💬 <strong>押し縮める仕事：</strong> マイナスの電気同士が反発するのに逆らって、半径 R の中にギュウギュウに閉じ込めたエネルギー！
            </div>
          </div>
          <div class="math-row">
            <div class="math-tex" id="tex-row-m"></div>
            <div class="speech-bubble">
              💬 <strong>エネルギーの缶詰：</strong> アインシュタインの式 E=mc² より、閉じ込めたエネルギーはそのまま「物体の重さ（質量）」になる！
            </div>
          </div>
        </div>
      `;

      katex.render(
        `U = \\frac{e^2}{${factor} \\varepsilon_0 R} = ${uText}`,
        mathBox.querySelector('#tex-row-u') as HTMLElement,
        { throwOnError: false }
      );
      katex.render(
        `m = \\frac{U}{c^2} = ${mText} \\quad (\\text{実測値: } 9.11 \\times 10^{-31}\\text{ kg})`,
        mathBox.querySelector('#tex-row-m') as HTMLElement,
        { throwOnError: false }
      );
    } else {
      mathBox.innerHTML = `
        <div class="formal-math-box">
          <div class="tex-line" id="tex-formal-1"></div>
          <div class="tex-line" id="tex-formal-2"></div>
          <div class="tex-line" id="tex-formal-3"></div>
        </div>
      `;

      katex.render(
        `U = \\int_V \\frac{\\varepsilon_0 \\boldsymbol{E}^2}{2} dV = \\frac{1}{2}\\int_V \\rho\\phi dV = \\frac{e^2}{${factor}\\varepsilon_0 R}`,
        mathBox.querySelector('#tex-formal-1') as HTMLElement,
        { throwOnError: false, displayMode: true }
      );
      katex.render(
        `U(R = ${rText}\\text{ m}) = ${uText}`,
        mathBox.querySelector('#tex-formal-2') as HTMLElement,
        { throwOnError: false }
      );
      katex.render(
        `\\lim_{R \\to 0} U(R) = \\infty \\implies m = \\frac{U}{c^2} \\to \\infty \\quad \\text{(特異点による発散)}`,
        mathBox.querySelector('#tex-formal-3') as HTMLElement,
        { throwOnError: false }
      );
    }
  }

  private updateStoryContent(): void {
    const storyTitle = this.container.querySelector('#story-title');
    const storyBox = this.container.querySelector('#story-content');
    if (!storyTitle || !storyBox) return;

    if (this.state.currentMission === 'mission1_field') {
      storyTitle.textContent = '🎯 Step 1: 空間のエネルギー（場とは何か？）';
      storyBox.innerHTML = `
        <p><strong>高校物理の盲点：</strong> コンデンサーのエネルギー $U = \\frac{1}{2}QV$ はどこに蓄えられているでしょうか？</p>
        <p>実は金属板の中ではなく、<strong>「電場が存在する真空空間そのもの」</strong>に密度 $u = \\frac{1}{2}\\varepsilon_0 E^2$ で宿っています！</p>
        <p class="mission-tip">💡 <strong>アクション：</strong> スライダーを動かして電子を観察してみよう。電子のまわりの空間が青く光っているのは、真空がエネルギーを蓄えている証拠です。</p>
      `;
    } else if (this.state.currentMission === 'mission2_balance') {
      storyTitle.textContent = '🎯 Step 2: 電子圧縮ミッション（天秤を合わせろ！）';
      storyBox.innerHTML = `
        <p><strong>逆転の発想：</strong> アインシュタインは「質量とはエネルギーの缶詰（$E=mc^2$）」だと見抜きました。</p>
        <p>「もしかして電子の体重（$9.11 \\times 10^{-31}\\text{ kg}$）は、すべて電場の反発エネルギーなのでは？」と考えたのがローレンツたちです。</p>
        <p class="mission-tip">💡 <strong>アクション：</strong> スライダーを動かして、下の天秤が<strong>ジャスト水平（0.511 MeV）</strong>に釣り合う半径を探し出そう！</p>
      `;
    } else {
      storyTitle.textContent = '🎯 Step 3: 点電荷の暴走・無限大とくりこみ理論';
      storyBox.innerHTML = `
        <p><strong>古典論のパラドックス：</strong> 電子を「大きさのない点電荷」と仮定すると、半径 $R \\to 0$ でエネルギーは<strong>無限大（$\\infty$）</strong>に爆発します！</p>
        <p>この大矛盾を解決したのが、日本の物理学者・<strong>朝永振一郎</strong>博士の「くりこみ理論（ノーベル物理学賞）」です。</p>
        <p class="mission-tip">💡 <strong>アクション：</strong> プリセット「⚠ 点電荷 (R=0)」を押して、古典論が破綻する瞬間を目撃しよう！</p>
      `;
    }
  }

  private formatRadius(r: number): string {
    if (r >= 1e-10) return `${(r * 1e10).toFixed(2)} × 10⁻¹⁰ m`;
    if (r >= 1e-12) return `${(r * 1e12).toFixed(2)} pm (ピコ)`;
    if (r >= 1e-15) return `${(r * 1e15).toFixed(2)} fm (フェムト)`;
    if (r >= 1e-18) return `${(r * 1e18).toFixed(2)} am (アト)`;
    return `${r.toExponential(2)} m`;
  }

  private getScaleDescription(r: number): string {
    if (r === 0) return 'スケール: 0 (特異点)';
    if (r > 1e-11) return 'スケール: 原子の世界 (10⁻¹⁰ m)';
    if (r > 1e-13) return 'スケール: 量子の波 (10⁻¹² m)';
    if (r > 1e-16) return 'スケール: 素粒子・原子核 (10⁻¹⁵ m)';
    return 'スケール: 極限のミクロ (10⁻¹⁸ m以下)';
  }
}
