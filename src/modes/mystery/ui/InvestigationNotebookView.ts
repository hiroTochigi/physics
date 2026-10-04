import katex from 'katex';
import { MysteryState } from '../MysteryTypes.ts';

export class InvestigationNotebookView {
  private state: MysteryState;

  // Elements
  private missingJoulesEl: HTMLElement | null = null;
  private remainingJoulesEl: HTMLElement | null = null;
  private discrepancyEl: HTMLElement | null = null;
  private evidenceListEl: HTMLElement | null = null;

  // Slots
  private slotJouleEl: HTMLElement | null = null;
  private slotPoyntingEl: HTMLElement | null = null;
  private btnSolveEl: HTMLButtonElement | null = null;

  // Callbacks
  private onSlotEvidenceCallback: ((type: 'joule' | 'poynting', evidenceId: string) => void) | null = null;
  private onAccuseCallback: (() => void) | null = null;

  constructor(container: HTMLElement, state: MysteryState) {
    this.state = state;

    this.missingJoulesEl = container.querySelector('#notebook-missing-val');
    this.remainingJoulesEl = container.querySelector('#notebook-remain-val');
    this.discrepancyEl = container.querySelector('#notebook-discrepancy-val');
    this.evidenceListEl = container.querySelector('#notebook-evidence-list');

    this.slotJouleEl = container.querySelector('#slot-joule-heat');
    this.slotPoyntingEl = container.querySelector('#slot-poynting-flux');
    this.btnSolveEl = container.querySelector('#btn-mystery-solve') as HTMLButtonElement;

    this.bindEvents();
    this.render();
  }

  public update(state: MysteryState): void {
    this.state = state;
    this.render();
  }

  public render(): void {
    if (this.missingJoulesEl) this.missingJoulesEl.textContent = `${this.state.missingEnergy} J`;
    if (this.remainingJoulesEl) this.remainingJoulesEl.textContent = `${this.state.remainingEnergy} J`;

    // Calculate current account discrepancy
    let accounted = 0;
    if (this.state.slottedEvidenceIds.jouleHeat) {
      const ev = this.state.evidences[this.state.slottedEvidenceIds.jouleHeat];
      if (ev) accounted += ev.energyJoules;
    }
    if (this.state.slottedEvidenceIds.poyntingFlux) {
      const ev = this.state.evidences[this.state.slottedEvidenceIds.poyntingFlux];
      if (ev) accounted += ev.energyJoules;
    }

    const discrepancy = this.state.missingEnergy - accounted;
    if (this.discrepancyEl) {
      this.discrepancyEl.textContent = `${discrepancy} J`;
      if (discrepancy === 0 && accounted > 0) {
        this.discrepancyEl.style.color = '#22c55e'; // Green when perfectly matching!
      } else {
        this.discrepancyEl.style.color = '#ef4444';
      }
    }

    // Render Evidence Cards
    if (this.evidenceListEl) {
      this.evidenceListEl.innerHTML = '';
      Object.values(this.state.evidences).forEach((ev) => {
        const card = document.createElement('div');
        card.className = `evidence-card ${ev.discovered ? 'discovered' : 'undiscovered'}`;

        if (ev.discovered) {
          card.innerHTML = `
            <div class="evidence-header">
              <span class="evidence-icon">${ev.icon}</span>
              <span class="evidence-name">${ev.name}</span>
              <span class="evidence-joules">+${ev.energyJoules} J</span>
            </div>
            <p class="evidence-desc">${ev.description}</p>
            <div class="evidence-math" id="ev-math-${ev.id}"></div>
            <div class="evidence-action">
              <button type="button" class="btn btn-xs btn-primary btn-slot-evidence" data-id="${ev.id}">
                📥 収支方程式に配置
              </button>
            </div>
          `;
          this.evidenceListEl!.appendChild(card);

          // Render Math with KaTeX
          const mathBox = card.querySelector(`#ev-math-${ev.id}`);
          if (mathBox) {
            try {
              katex.render(ev.mathLatex, mathBox as HTMLElement, { throwOnError: false });
            } catch (err) {
              mathBox.textContent = ev.mathSymbol;
            }
          }

          // Slot button event
          const slotBtn = card.querySelector('.btn-slot-evidence');
          if (slotBtn) {
            slotBtn.addEventListener('click', () => {
              const targetSlot = ev.physicsType === 'joule_heat' ? 'joule' : 'poynting';
              if (this.onSlotEvidenceCallback) {
                this.onSlotEvidenceCallback(targetSlot, ev.id);
              }
            });
          }
        } else {
          card.innerHTML = `
            <div class="evidence-header">
              <span class="evidence-icon">❓</span>
              <span class="evidence-name">未解明の証拠</span>
              <span class="evidence-joules">??? J</span>
            </div>
            <p class="evidence-desc">現場をスキャンして新たなエネルギーの痕跡を探してください。</p>
          `;
          this.evidenceListEl!.appendChild(card);
        }
      });
    }

    // Render Equation Slots
    if (this.slotJouleEl) {
      if (this.state.slottedEvidenceIds.jouleHeat) {
        const ev = this.state.evidences[this.state.slottedEvidenceIds.jouleHeat];
        const label = ev ? ev.shortName : '30 J';
        this.slotJouleEl.innerHTML = `
          <div class="slotted-item joule">
            <span>🔥 ジュール熱</span>
            <strong>${label}</strong>
          </div>
        `;
        this.slotJouleEl.classList.add('filled');
      } else {
        this.slotJouleEl.innerHTML = `<span class="slot-placeholder">未配置 (ジュール熱)</span>`;
        this.slotJouleEl.classList.remove('filled');
      }
    }

    if (this.slotPoyntingEl) {
      if (this.state.slottedEvidenceIds.poyntingFlux) {
        const ev = this.state.evidences[this.state.slottedEvidenceIds.poyntingFlux];
        const label = ev ? ev.shortName : '50 J';
        this.slotPoyntingEl.innerHTML = `
          <div class="slotted-item poynting">
            <span>🔍 ポインティング流束</span>
            <strong>${label}</strong>
          </div>
        `;
        this.slotPoyntingEl.classList.add('filled');
      } else {
        this.slotPoyntingEl.innerHTML = `<span class="slot-placeholder">未配置 (ポインティング流束)</span>`;
        this.slotPoyntingEl.classList.remove('filled');
      }
    }

    // Solve button enable/disable
    if (this.btnSolveEl) {
      const isReady =
        this.state.slottedEvidenceIds.jouleHeat !== null &&
        this.state.slottedEvidenceIds.poyntingFlux !== null &&
        discrepancy === 0;

      this.btnSolveEl.disabled = !isReady;
      if (isReady) {
        this.btnSolveEl.classList.add('ready-to-solve');
      } else {
        this.btnSolveEl.classList.remove('ready-to-solve');
      }
    }
  }

  public onSlotEvidence(cb: (type: 'joule' | 'poynting', evidenceId: string) => void): void {
    this.onSlotEvidenceCallback = cb;
  }

  public onAccuse(cb: () => void): void {
    this.onAccuseCallback = cb;
  }

  private bindEvents(): void {
    if (this.btnSolveEl) {
      this.btnSolveEl.addEventListener('click', () => {
        if (this.onAccuseCallback) this.onAccuseCallback();
      });
    }
  }
}
