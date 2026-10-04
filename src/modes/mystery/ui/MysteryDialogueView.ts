import { DialogueMessage } from '../MysteryTypes.ts';

export class MysteryDialogueView {
  private avatarEl: HTMLElement;
  private speakerEl: HTMLElement;
  private textEl: HTMLElement;
  private promptEl: HTMLElement;
  private nextBtn: HTMLButtonElement;
  private prevBtn: HTMLButtonElement;
  private progressEl: HTMLElement;

  private onNextCallback: (() => void) | null = null;
  private onPrevCallback: (() => void) | null = null;

  constructor(container: HTMLElement) {
    this.avatarEl = container.querySelector('#mystery-dialogue-avatar') as HTMLElement;
    this.speakerEl = container.querySelector('#mystery-dialogue-speaker') as HTMLElement;
    this.textEl = container.querySelector('#mystery-dialogue-text') as HTMLElement;
    this.promptEl = container.querySelector('#mystery-dialogue-prompt') as HTMLElement;
    this.nextBtn = container.querySelector('#btn-mystery-next-dialogue') as HTMLButtonElement;
    this.prevBtn = container.querySelector('#btn-mystery-prev-dialogue') as HTMLButtonElement;
    this.progressEl = container.querySelector('#mystery-dialogue-progress') as HTMLElement;

    this.bindEvents();
  }

  public render(message: DialogueMessage, currentIndex: number, totalCount: number): void {
    if (this.avatarEl) this.avatarEl.textContent = message.avatar;
    if (this.speakerEl) this.speakerEl.textContent = message.speakerName;
    if (this.textEl) this.textEl.textContent = message.text;

    if (this.promptEl) {
      if (message.actionPrompt) {
        this.promptEl.textContent = message.actionPrompt;
        this.promptEl.style.display = 'block';
      } else {
        this.promptEl.style.display = 'none';
      }
    }

    if (this.progressEl) {
      this.progressEl.textContent = `${currentIndex + 1} / ${totalCount}`;
    }

    if (this.prevBtn) {
      this.prevBtn.disabled = currentIndex === 0;
    }

    if (this.nextBtn) {
      if (currentIndex === totalCount - 1) {
        this.nextBtn.textContent = '次の展開へ ❯';
      } else {
        this.nextBtn.textContent = '次へ ▶';
      }
    }
  }

  public onNext(cb: () => void): void {
    this.onNextCallback = cb;
  }

  public onPrev(cb: () => void): void {
    this.onPrevCallback = cb;
  }

  private bindEvents(): void {
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        if (this.onNextCallback) this.onNextCallback();
      });
    }
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        if (this.onPrevCallback) this.onPrevCallback();
      });
    }
  }
}
