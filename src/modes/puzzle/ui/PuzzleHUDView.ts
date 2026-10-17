import katex from 'katex';
import { PuzzleEngine } from '../PuzzleEngine.ts';
import { RuleCard, FormulaSlot, PuzzleStepConfig } from '../PuzzleTypes.ts';

export class PuzzleHUDView {
  private container: HTMLElement;
  private engine: PuzzleEngine;

  private selectedCardId: string | null = null;
  private unsubscribeEngine: (() => void) | null = null;
  private isMounted: boolean = false;

  constructor(container: HTMLElement, engine: PuzzleEngine) {
    this.container = container;
    this.engine = engine;
  }

  public mount(): void {
    if (this.isMounted) return;
    this.isMounted = true;

    // 1. Initial skeleton mount
    this.createSkeleton();

    // 2. Render initial step content
    this.update();

    // 3. Subscribe to engine changes
    this.unsubscribeEngine = this.engine.subscribe(() => {
      this.selectedCardId = null;
      this.update();
    });
  }

  public unmount(): void {
    if (this.unsubscribeEngine) {
      this.unsubscribeEngine();
      this.unsubscribeEngine = null;
    }
    this.isMounted = false;
    this.container.innerHTML = '';
  }

  private createSkeleton(): void {
    const totalSteps = this.engine.getTotalSteps();

    this.container.innerHTML = `
      <div class="puzzle-wrapper">
        <!-- Top Control Bar: Stepper, Mode Toggle & Cleanliness Meter -->
        <div class="puzzle-top-bar">
          <div class="puzzle-stepper" id="puzzle-stepper-container">
            ${Array.from({ length: totalSteps }).map((_, i) => `
              <div class="puzzle-step-dot" data-step="${i}">
                <span class="dot-num">${i + 1}</span>
              </div>
              ${i < totalSteps - 1 ? '<div class="puzzle-step-line"></div>' : ''}
            `).join('')}
          </div>

          <!-- Mode Toggle Switch: Intuitive Japanese vs Formal Math -->
          <div class="mode-toggle-pill">
            <button type="button" class="btn-toggle-mode active" id="btn-toggle-intuitive">
              <span class="icon">📖</span> 直感日本語（文系向け）
            </button>
            <button type="button" class="btn-toggle-mode" id="btn-toggle-formal">
              <span class="icon">📐</span> 厳密数式
            </button>
          </div>

          <div class="cleanliness-meter-container">
            <div class="cleanliness-label">
              <span class="icon">✨</span> 式のスッキリ度:
              <strong id="cleanliness-text">15%</strong>
            </div>
            <div class="cleanliness-bar-track">
              <div class="cleanliness-bar-fill" id="cleanliness-fill" style="width: 15%;"></div>
            </div>
          </div>

          <div class="puzzle-actions">
            <button type="button" class="btn btn-xs btn-outline" id="btn-puzzle-prev">
              &larr; 前へ
            </button>
            <button type="button" class="btn btn-xs btn-ghost" id="btn-puzzle-reset">
              🔄 最初から
            </button>
          </div>
        </div>

        <!-- Narrative & Goal Banner with Budget Analogy -->
        <div class="puzzle-narrative-card" id="puzzle-narrative-card">
          <div class="puzzle-title-row">
            <span class="badge badge-primary" id="puzzle-step-badge">Step 1</span>
            <div class="puzzle-goal-text">🎯 <strong>目標:</strong> <span id="puzzle-goal-text-content"></span></div>
            <div class="budget-analogy-badge" id="puzzle-budget-analogy">👛 お財布の今月残高...</div>
          </div>
          <p class="puzzle-narrative-text" id="puzzle-narrative-text-content"></p>
        </div>

        <!-- Main Workspace Grid: Math Block Canvas & Right Panel -->
        <div class="puzzle-main-grid">
          <!-- Left Workspace: Equation Scratch-like Block Stage -->
          <div class="puzzle-stage">
            <div class="puzzle-stage-header">
              <span class="dot live-dot"></span>
              <h3 id="puzzle-stage-title">🧮 数式ブロック・ワークスペース</h3>
              <span class="stage-subtext">カードをスロットにドラッグ＆ドロップ（またはクリックして配置）</span>
            </div>

            <!-- Primary Math Display with KaTeX -->
            <div class="puzzle-formula-board">
              <div class="formula-katex-display" id="puzzle-main-formula"></div>
              <div class="formula-katex-annotation" id="puzzle-formula-annotation"></div>
            </div>

            <!-- Interactive Slots Container -->
            <div class="puzzle-slots-container" id="puzzle-slots-root">
              <!-- Rendered dynamically -->
            </div>

            <!-- Hand Cards Deck Tray inside the stage -->
            <div class="puzzle-deck-tray">
              <div class="deck-header">
                <span class="icon">🃏</span> <span id="deck-header-title">手札（マクスウェル方程式・公式カード）</span>
                <span class="deck-instruction">（カードを選択するか、直接スロットへドラッグ）</span>
              </div>
              <div class="deck-cards-row" id="puzzle-deck-cards-root">
                <!-- Rendered dynamically -->
              </div>
            </div>
          </div>

          <!-- Right Panel: 3D Preview & Explanation -->
          <div class="puzzle-side-panel">
            <div class="preview-3d-box">
              <div class="preview-3d-header">
                <span class="icon">🌊</span>
                <h4>電磁波・エネルギー流の3D連動</h4>
                <span class="hint-orbit-tag">🖱️ ドラッグで3D回転</span>
              </div>
              <div class="preview-canvas-container" id="puzzle-3d-container">
                <canvas id="puzzle-3d-canvas"></canvas>
              </div>
              <div class="preview-3d-caption" id="puzzle-3d-caption">
                式が整理されるにつれ、ポインティングベクトル流 S が活性化します。
              </div>
            </div>

            <!-- Knowledge Memo Box & Beginner Guide -->
            <div class="puzzle-memo-box">
              <div class="memo-header"><span class="icon">💡</span> <span id="memo-header-title">物理の意味メモ</span></div>
              <div class="memo-content" id="puzzle-memo-content">
                <!-- Rendered dynamically -->
              </div>
              
              <!-- Quick Glossary for Humanities Students -->
              <div class="humanities-glossary">
                <div class="glossary-title">🔰 文系のための記号超訳:</div>
                <div class="glossary-chips">
                  <span class="chip" title="時間の進みとともにどれだけ増減したかの勢い">∂/∂t: 変化スピード</span>
                  <span class="chip" title="空間の中でグルグル回る渦巻きの強さ">∇×: 空間の渦</span>
                  <span class="chip" title="中心から外へ吹き出す勢い">∇・: 外への流出</span>
                  <span class="chip" title="電磁波がエネルギーを運ぶ方向と強さ">S: 光のエネルギー流</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind static buttons
    const prevBtn = this.container.querySelector('#btn-puzzle-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.engine.prevStep());
    }

    const resetBtn = this.container.querySelector('#btn-puzzle-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.engine.reset());
    }

    // Bind Mode Toggles (Intuitive vs Formal)
    const btnIntuitive = this.container.querySelector('#btn-toggle-intuitive');
    const btnFormal = this.container.querySelector('#btn-toggle-formal');

    if (btnIntuitive && btnFormal) {
      btnIntuitive.addEventListener('click', () => {
        this.engine.setIntuitiveMode(true);
      });
      btnFormal.addEventListener('click', () => {
        this.engine.setIntuitiveMode(false);
      });
    }
  }

  private update(): void {
    const step = this.engine.getCurrentStep();
    const stepIndex = this.engine.getCurrentStepIndex();
    const isIntuitive = this.engine.getIsIntuitiveMode();

    // 1. Update Mode Toggles UI
    const btnIntuitive = this.container.querySelector('#btn-toggle-intuitive');
    const btnFormal = this.container.querySelector('#btn-toggle-formal');
    if (btnIntuitive && btnFormal) {
      btnIntuitive.classList.toggle('active', isIntuitive);
      btnFormal.classList.toggle('active', !isIntuitive);
    }

    // 2. Update Stepper Dots
    const dots = this.container.querySelectorAll<HTMLElement>('.puzzle-step-dot');
    dots.forEach((dot, idx) => {
      dot.className = `puzzle-step-dot ${idx === stepIndex ? 'active' : ''} ${idx < stepIndex ? 'done' : ''}`;
      const numSpan = dot.querySelector('.dot-num');
      if (numSpan) {
        numSpan.textContent = idx < stepIndex ? '✓' : String(idx + 1);
      }
      dot.onclick = () => this.engine.setStep(idx);
    });

    const prevBtn = this.container.querySelector<HTMLButtonElement>('#btn-puzzle-prev');
    if (prevBtn) {
      prevBtn.disabled = stepIndex === 0;
    }

    // 3. Update Cleanliness Meter
    const cleanlinessText = this.container.querySelector('#cleanliness-text');
    const cleanlinessFill = this.container.querySelector<HTMLElement>('#cleanliness-fill');
    if (cleanlinessText) cleanlinessText.textContent = `${step.cleanliness}%`;
    if (cleanlinessFill) cleanlinessFill.style.width = `${step.cleanliness}%`;

    // 4. Update Narrative, Goals & Budget Analogy
    const badge = this.container.querySelector('#puzzle-step-badge');
    if (badge) {
      badge.className = `badge ${step.stepId === 'differentiated' ? 'badge-danger pulse-danger' : 'badge-primary'}`;
      const stepTitle = isIntuitive ? step.intuitiveTitle : step.title;
      badge.textContent = step.stepId === 'differentiated' ? (isIntuitive ? '🚨 緊急警告！使途不明金' : '🚨 緊急アラート') : `Step ${step.stepNumber}: ${stepTitle}`;
    }

    const goalEl = this.container.querySelector('#puzzle-goal-text-content');
    if (goalEl) goalEl.textContent = isIntuitive ? step.intuitiveGoal : step.goal;

    const narrativeEl = this.container.querySelector('#puzzle-narrative-text-content');
    if (narrativeEl) narrativeEl.textContent = isIntuitive ? step.intuitiveNarrative : step.narrative;

    const budgetEl = this.container.querySelector('#puzzle-budget-analogy');
    if (budgetEl) budgetEl.textContent = step.budgetAnalogy;

    const stageTitle = this.container.querySelector('#puzzle-stage-title');
    if (stageTitle) {
      stageTitle.textContent = isIntuitive ? '🧩 直感ブロック・ワークスペース' : '🧮 数式ブロック・ワークスペース';
    }

    const deckHeaderTitle = this.container.querySelector('#deck-header-title');
    if (deckHeaderTitle) {
      deckHeaderTitle.textContent = isIntuitive ? '手札（自然界の翻訳カード）' : '手札（マクスウェル方程式・公式カード）';
    }

    // 5. Update KaTeX Formulas
    const latexToRender = isIntuitive ? step.intuitiveLatex : step.primaryLatex;
    const annotToRender = isIntuitive ? step.intuitiveAnnotationLatex : step.annotationLatex;
    this.renderKaTeX(latexToRender, annotToRender);

    // 6. Update Interactive Slots
    this.updateSlots(step, isIntuitive);

    // 7. Update Cards Tray
    this.updateCards(step, isIntuitive);

    // 8. Update Memo & 3D Caption
    const memoHeaderTitle = this.container.querySelector('#memo-header-title');
    if (memoHeaderTitle) {
      memoHeaderTitle.textContent = isIntuitive ? 'やさしい物理の意味' : '物理の意味メモ';
    }

    const memoContent = this.container.querySelector('#puzzle-memo-content');
    if (memoContent) memoContent.textContent = this.getStepMemo(step.stepId, isIntuitive);

    const captionEl = this.container.querySelector('#puzzle-3d-caption');
    if (captionEl) {
      captionEl.textContent = step.stepId === 'completed'
        ? (isIntuitive ? '🌟 部屋から宇宙へ、光の波（エネルギー）が勢いよく飛び出しています！（ドラッグで回転）' : '🌟 空間へエネルギー流 S が波となって放射されています！（ドラッグで回転観察）')
        : (isIntuitive ? '式がスッキリするにつれ、右の3Dビューで光のエネルギー流 S が覚醒します。（ドラッグで回転）' : '式が整理されるにつれ、ポインティングベクトル流 S が活性化します。（ドラッグで回転観察）');
    }
  }

  private updateSlots(step: PuzzleStepConfig, isIntuitive: boolean): void {
    const slotsRoot = this.container.querySelector('#puzzle-slots-root');
    if (!slotsRoot) return;

    if (step.slots.length > 0) {
      slotsRoot.innerHTML = `
        <div class="slots-header-text">${isIntuitive ? 'カードを差し込むスロット:' : '挿入可能なスロット:'}</div>
        <div class="slots-flex-row">
          ${step.slots.map(slot => this.renderSlotHtml(slot, isIntuitive)).join('')}
        </div>
      `;

      // Bind slot interactions
      const slotEls = slotsRoot.querySelectorAll<HTMLElement>('.formula-slot');
      slotEls.forEach(slotEl => {
        slotEl.addEventListener('dragover', (e) => {
          e.preventDefault();
          slotEl.classList.add('slot-dragover');
        });

        slotEl.addEventListener('dragleave', () => {
          slotEl.classList.remove('slot-dragover');
        });

        slotEl.addEventListener('drop', (e) => {
          e.preventDefault();
          slotEl.classList.remove('slot-dragover');
          const cardId = e.dataTransfer?.getData('text/plain') || '';
          const slotId = slotEl.dataset.slotId || '';
          if (cardId && slotId) {
            this.handleInsert(slotId, cardId);
          }
        });

        slotEl.addEventListener('click', () => {
          if (this.selectedCardId) {
            const slotId = slotEl.dataset.slotId || '';
            this.handleInsert(slotId, this.selectedCardId);
          }
        });
      });
    } else {
      slotsRoot.innerHTML = `
        <div class="puzzle-completion-banner">
          <div class="completion-icon">🏆</div>
          <h4>${isIntuitive ? 'エネルギーの家計簿（ポインティングの定理）が完成！' : 'ポインティングの定理の導出完了！'}</h4>
          <p>${isIntuitive
            ? '「お部屋で減ったエネルギー」＝「窓から逃げた光の波 (∇・S)」＋「ヒーターで温まった熱 (-J・E)」！数式は自然界の美しい物語でした！'
            : '「エネルギーの減少」＝「空間へ放射されるエネルギー流 (∇・S)」＋「ジュール熱損失 (-J・E)」が美しく結ばれました！'
          }</p>
          <button type="button" class="btn btn-sm btn-accent" id="btn-completion-restart">もう一度体験する</button>
        </div>
      `;

      const restartBtn = slotsRoot.querySelector('#btn-completion-restart');
      if (restartBtn) {
        restartBtn.addEventListener('click', () => this.engine.reset());
      }
    }
  }

  private updateCards(step: PuzzleStepConfig, isIntuitive: boolean): void {
    const cardsRoot = this.container.querySelector('#puzzle-deck-cards-root');
    if (!cardsRoot) return;

    if (step.availableCards.length > 0) {
      cardsRoot.innerHTML = step.availableCards.map(card => this.renderCardHtml(card, isIntuitive)).join('');

      // Render math inside cards
      const cardLatexEls = cardsRoot.querySelectorAll<HTMLElement>('.card-latex');
      cardLatexEls.forEach(el => {
        const raw = el.dataset.cardLatex;
        if (raw) {
          try {
            katex.render(decodeURIComponent(raw), el, { displayMode: false, throwOnError: false });
          } catch (e) {
            console.error('Card math render error:', e);
          }
        }
      });

      // Bind drag and click
      const cardEls = cardsRoot.querySelectorAll<HTMLElement>('.rule-card');
      cardEls.forEach(cardEl => {
        cardEl.addEventListener('dragstart', (e) => {
          const cardId = cardEl.dataset.cardId || '';
          e.dataTransfer?.setData('text/plain', cardId);
          cardEl.classList.add('dragging');
        });

        cardEl.addEventListener('dragend', () => {
          cardEl.classList.remove('dragging');
        });

        cardEl.addEventListener('click', () => {
          const cardId = cardEl.dataset.cardId || '';
          if (this.selectedCardId === cardId) {
            this.selectedCardId = null;
          } else {
            this.selectedCardId = cardId;
          }
          this.update();
        });
      });
    } else {
      cardsRoot.innerHTML = `
        <div class="deck-empty-msg">すべてのカードが適用され、式が完全にスッキリしました！✨</div>
      `;
    }
  }

  private renderSlotHtml(slot: FormulaSlot, isIntuitive: boolean): string {
    const isWarningClass = slot.isWarning ? 'slot-warning pulse-danger' : '';
    const isFilledClass = slot.isFilled ? 'slot-filled' : '';
    const isSelectedMatch = this.selectedCardId === slot.expectedCardId ? 'slot-ready' : '';

    return `
      <div class="formula-slot ${isWarningClass} ${isFilledClass} ${isSelectedMatch}" 
           data-slot-id="${slot.id}" 
           data-expected-card="${slot.expectedCardId}">
        <div class="slot-badge">${slot.isWarning ? (isIntuitive ? '🚨 使途不明' : '⚠️ 警告') : 'スロット'}</div>
        <div class="slot-label">${isIntuitive ? slot.intuitiveLabel : slot.label}</div>
        <div class="slot-hint">${slot.isFilled ? '✅ 適用完了' : (isIntuitive ? slot.intuitiveHint : slot.hint)}</div>
        <div class="slot-drop-zone">${slot.isFilled ? '装着済み' : 'ここにドロップ'}</div>
      </div>
    `;
  }

  private renderCardHtml(card: RuleCard, isIntuitive: boolean): string {
    const isSelected = this.selectedCardId === card.id ? 'card-selected' : '';
    const cardTitle = isIntuitive ? card.intuitiveName : card.name;
    const cardDesc = isIntuitive ? card.intuitiveDescription : card.description;
    const cardFormula = isIntuitive ? card.intuitiveLatex : card.latex;

    return `
      <div class="rule-card ${isSelected}" 
           draggable="true" 
           data-card-id="${card.id}" 
           data-target-slot="${card.targetSlotId}">
        <div class="card-header">
          <span class="card-icon">${card.icon}</span>
          <span class="card-name">${cardTitle}</span>
        </div>
        <div class="card-latex" data-card-latex="${encodeURIComponent(cardFormula)}"></div>
        <div class="card-desc">${cardDesc}</div>
        <div class="card-meaning-tag">💡 本質: ${card.physicalMeaning}</div>
      </div>
    `;
  }

  private renderKaTeX(primaryLatex: string, annotationLatex?: string): void {
    const mainEl = this.container.querySelector('#puzzle-main-formula');
    if (mainEl) {
      try {
        katex.render(primaryLatex, mainEl as HTMLElement, {
          displayMode: true,
          throwOnError: false
        });
      } catch (err) {
        console.error('KaTeX render error:', err);
      }
    }

    const annotEl = this.container.querySelector('#puzzle-formula-annotation');
    if (annotEl) {
      if (annotationLatex) {
        try {
          katex.render(annotationLatex, annotEl as HTMLElement, {
            displayMode: true,
            throwOnError: false
          });
        } catch (err) {
          console.error('KaTeX annotation render error:', err);
        }
      } else {
        annotEl.innerHTML = '';
      }
    }
  }

  private handleInsert(slotId: string, cardId: string): void {
    const success = this.engine.insertCard(slotId, cardId);
    if (!success) {
      const slotEl = this.container.querySelector(`[data-slot-id="${slotId}"]`);
      if (slotEl) {
        slotEl.classList.add('shake-error');
        setTimeout(() => slotEl.classList.remove('shake-error'), 500);
      }
    }
  }

  private getStepMemo(stepId: string, isIntuitive: boolean): string {
    if (isIntuitive) {
      switch (stepId) {
        case 'start':
          return '【お財布の合計】電場と磁場は、それぞれエネルギーを蓄えるポケット。まずは「全体の減り具合」を調べるために袋を開けます。';
        case 'differentiated':
          return '【なぜ点滅しているの？】「何秒後にどう変わるか」は未知数。そこでマクスウェル方程式を使い、「空間の渦巻き」という目に見える形に翻訳します！';
        case 'joule_extracted':
          return '【熱の発見】スマホが充電中に温かくなるのと同じ！電子が回路を通るときに発生するジュール熱として、エネルギーの一部が使われました。';
        case 'vector_merged':
          return '【光の誕生】電場の渦と磁場の渦が組み合わさると、空間を飛んでいく光の波（電磁波）になります！2つの渦が1つの外積へドッキング！';
        case 'completed':
          return '【家計簿の結末】「部屋のエネルギーが減った理由」＝「光として逃げた分」＋「ヒーターで温まった分」。宇宙はお金の勘定が完璧に合います！';
        default:
          return '';
      }
    }

    switch (stepId) {
      case 'start':
        return '電場と磁場にはそれぞれ ½ε₀E² と ½B²/μ₀ のエネルギーが蓄えられています。その「時間微分」を求めることが定理導出の第一歩です。';
      case 'differentiated':
        return '時間変化 (∂E/∂t, ∂B/∂t) は未知数。しかし、マクスウェル方程式を使えば空間の渦（回転）に置き換えることができます！';
      case 'joule_extracted':
        return 'J・E は荷電粒子が電場から受ける仕事率。つまり導線の抵抗で発生する「ジュール熱」です。マイナス符号はエネルギーの損失を意味します。';
      case 'vector_merged':
        return 'ベクトル解析の公式 ∇・(A×B) = B・(∇×A) - A・(∇×B) を逆向きに使うことで、2つの渦が「外積の発散」へカチッと合体します！';
      case 'completed':
        return 'S = (1/μ₀)(E×B) がポインティングベクトル。電磁波がエネルギーを運ぶ向きと強さを示します。ポインティングの定理はエネルギー保存則そのものです！';
      default:
        return '';
    }
  }
}
