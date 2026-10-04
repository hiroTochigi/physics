import katex from 'katex';
import { SimulatorMode, SimulatorModeMetadata } from '../../core/Types.ts';
import { MysteryPhase, MysteryState, ToolType } from './MysteryTypes.ts';
import { INITIAL_EVIDENCES, PHASE_DIALOGUES } from './MysteryScenarioData.ts';
import { MysteryScene3D } from './render/MysteryScene3D.ts';
import { MysteryDialogueView } from './ui/MysteryDialogueView.ts';
import { InvestigationNotebookView } from './ui/InvestigationNotebookView.ts';

export class MysteryMode implements SimulatorMode {
  public readonly metadata: SimulatorModeMetadata = {
    id: 'mystery',
    name: 'エネルギー消失事件の捜査',
    englishTitle: 'The Mystery of the Missing 80 Joules',
    icon: '🕵️',
    subtitle: 'インタラクティブ・ミステリーノベル &bull; 密室から消えた 80 ジュールの謎を解け',
    description: '文系生徒向けストーリー仕立てのWeb教材。探偵として密室実験室を捜査し、ポインティングの定理を立証する。',
    mathFormula: '\\Delta W = - \\int_V \\boldsymbol{j} \\cdot \\boldsymbol{E} \\, dV - \\oint_{\\partial V} \\boldsymbol{S} \\cdot d\\boldsymbol{A}'
  };

  private scene3D: MysteryScene3D | null = null;
  private dialogueView: MysteryDialogueView | null = null;
  private notebookView: InvestigationNotebookView | null = null;

  private isMounted: boolean = false;

  private state: MysteryState = {
    currentPhase: 'intro',
    dialogueIndex: 0,
    selectedTool: 'inspect',
    initialEnergy: 100,
    remainingEnergy: 20,
    missingEnergy: 80,
    evidences: { ...INITIAL_EVIDENCES },
    slottedEvidenceIds: {
      jouleHeat: null,
      poyntingFlux: null
    },
    isSolved: false
  };

  public mount(container?: HTMLElement): void {
    if (this.isMounted) {
      this.resume();
      return;
    }
    this.isMounted = true;

    const root = container || document.getElementById('mystery-mode-view');
    if (!root) {
      console.warn('Mystery container not found');
      return;
    }

    (window as any)._activeMysteryMode = this;

    // 1. Initialize 3D Stage
    const threeContainer = document.getElementById('mystery-stage-3d')!;
    const threeCanvas = document.getElementById('mystery-canvas-3d') as HTMLCanvasElement;
    if (threeCanvas && threeContainer) {
      this.scene3D = new MysteryScene3D(threeContainer, threeCanvas);
      this.scene3D.onObjectClick((id) => this.handleObjectClick(id));
    }

    // 2. Initialize Novel Dialogue
    const dialogueBox = document.getElementById('mystery-dialogue-box')!;
    if (dialogueBox) {
      this.dialogueView = new MysteryDialogueView(dialogueBox);
      this.dialogueView.onNext(() => this.nextDialogue());
      this.dialogueView.onPrev(() => this.prevDialogue());
    }

    // 3. Initialize Investigation Notebook
    const notebookContainer = document.getElementById('mystery-notebook-panel')!;
    if (notebookContainer) {
      this.notebookView = new InvestigationNotebookView(notebookContainer, this.state);
      this.notebookView.onSlotEvidence((type, evId) => this.slotEvidence(type, evId));
      this.notebookView.onAccuse(() => this.resolveCase());
    }

    // 4. Bind Toolbar & Modals
    this.bindUIEvents();

    // 5. Render Initial State
    this.updateCurrentDialogue();
    this.renderMathFormula();
  }

  public unmount(): void {
    this.pause();
    if (this.scene3D) {
      this.scene3D.dispose();
      this.scene3D = null;
    }
    this.dialogueView = null;
    this.notebookView = null;
    this.isMounted = false;
  }

  public pause(): void {
    // 3D scene pauses if needed
  }

  public resume(): void {
    if (this.isMounted && this.scene3D) {
      this.scene3D.handleResize();
    }
  }

  public handleResize(): void {
    if (this.scene3D) {
      this.scene3D.handleResize();
    }
  }

  private bindUIEvents(): void {
    // Tool buttons (Inspect, Loupe, Thermal)
    const toolBtns = document.querySelectorAll<HTMLButtonElement>('.btn-mystery-tool');
    toolBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool as ToolType;
        if (tool) {
          this.setTool(tool);
        }
      });
    });

    // Reset Investigation button
    const resetBtn = document.getElementById('btn-mystery-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetInvestigation());
    }

    // Modal Close Button
    const modalCloseBtn = document.getElementById('btn-mystery-modal-close');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        const modal = document.getElementById('mystery-solved-modal');
        if (modal) modal.classList.add('hidden');
      });
    }

    // Quick camera focus buttons
    const btnCamAll = document.getElementById('btn-cam-all');
    if (btnCamAll) btnCamAll.addEventListener('click', () => this.scene3D?.focusCamera('room'));
    const btnCamHeater = document.getElementById('btn-cam-heater');
    if (btnCamHeater) btnCamHeater.addEventListener('click', () => this.scene3D?.focusCamera('heater'));
    const btnCamWindow = document.getElementById('btn-cam-window');
    if (btnCamWindow) btnCamWindow.addEventListener('click', () => this.scene3D?.focusCamera('window'));
  }

  public setTool(tool: ToolType): void {
    this.state.selectedTool = tool;

    // Update button states
    const toolBtns = document.querySelectorAll<HTMLButtonElement>('.btn-mystery-tool');
    toolBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tool === tool);
    });

    if (this.scene3D) {
      this.scene3D.setTool(tool);
    }
  }

  public handleObjectClick(objectId: string): void {
    if (objectId === 'floor_heater') {
      if (!this.state.evidences.floor_heater.discovered) {
        this.discoverEvidence('floor_heater');
        this.setPhase('investigate_1');
      } else {
        this.showToast('🔍 床のヒーター：電流と電場の積により 30 J のジュール熱が消費された痕跡です。');
      }
    } else if (objectId === 'quartz_window') {
      if (!this.state.evidences.quartz_window.discovered) {
        this.discoverEvidence('quartz_window');
        this.setPhase('investigate_2');
      } else {
        this.showToast('🔍 南壁の石英窓：電磁波のポインティング・ベクトル束（50 J）が外へ飛び去った痕跡です。');
      }
    }
  }

  public discoverEvidence(id: string): void {
    if (!this.state.evidences[id]) return;
    this.state.evidences[id].discovered = true;

    if (this.scene3D) {
      this.scene3D.setEvidenceDiscovered(id);
    }

    this.showToast(`🎉 重要な証拠を発見！【${this.state.evidences[id].name}】`);

    if (this.notebookView) {
      this.notebookView.update(this.state);
    }
  }

  private setPhase(phase: MysteryPhase): void {
    this.state.currentPhase = phase;
    this.state.dialogueIndex = 0;
    this.updateCurrentDialogue();

    const curMsg = PHASE_DIALOGUES[phase][0];
    if (curMsg.suggestedTool) {
      this.setTool(curMsg.suggestedTool);
    }
    if (curMsg.focusTarget && this.scene3D) {
      this.scene3D.focusCamera(curMsg.focusTarget);
    }
  }

  private nextDialogue(): void {
    const list = PHASE_DIALOGUES[this.state.currentPhase];
    if (this.state.dialogueIndex < list.length - 1) {
      this.state.dialogueIndex++;
      this.updateCurrentDialogue();

      const curMsg = list[this.state.dialogueIndex];
      if (curMsg.suggestedTool) {
        this.setTool(curMsg.suggestedTool);
      }
      if (curMsg.focusTarget && this.scene3D) {
        this.scene3D.focusCamera(curMsg.focusTarget);
      }
    } else {
      // Phase progression logic
      if (this.state.currentPhase === 'intro') {
        this.setTool('thermal');
        this.scene3D?.focusCamera('heater');
      } else if (this.state.currentPhase === 'investigate_1') {
        this.setTool('loupe');
        this.scene3D?.focusCamera('window');
      } else if (this.state.currentPhase === 'investigate_2') {
        this.setPhase('accusation');
      }
    }
  }

  private prevDialogue(): void {
    if (this.state.dialogueIndex > 0) {
      this.state.dialogueIndex--;
      this.updateCurrentDialogue();
    }
  }

  private updateCurrentDialogue(): void {
    const list = PHASE_DIALOGUES[this.state.currentPhase];
    const msg = list[this.state.dialogueIndex];
    if (this.dialogueView && msg) {
      this.dialogueView.render(msg, this.state.dialogueIndex, list.length);
    }
  }

  private slotEvidence(type: 'joule' | 'poynting', evidenceId: string): void {
    if (type === 'joule') {
      this.state.slottedEvidenceIds.jouleHeat = evidenceId;
    } else {
      this.state.slottedEvidenceIds.poyntingFlux = evidenceId;
    }

    if (this.notebookView) {
      this.notebookView.update(this.state);
    }

    // Check if both slotted
    if (this.state.slottedEvidenceIds.jouleHeat && this.state.slottedEvidenceIds.poyntingFlux) {
      this.showToast('✨ 収支の帳尻が完全に一致！「真相を立証する」ボタンを押してください！');
    }
  }

  private resolveCase(): void {
    this.state.isSolved = true;
    this.setPhase('solved');

    // Show celebratory modal
    const modal = document.getElementById('mystery-solved-modal');
    if (modal) {
      modal.classList.remove('hidden');

      const modalMath = document.getElementById('mystery-modal-math');
      if (modalMath) {
        katex.render(
          '\\underbrace{\\Delta W}_{-80\\text{ J}} = - \\underbrace{\\int_V \\boldsymbol{j} \\cdot \\boldsymbol{E}\\, dV}_{30\\text{ J (熱)}} - \\underbrace{\\oint_{\\partial V} \\boldsymbol{S} \\cdot d\\boldsymbol{A}}_{50\\text{ J (光)}}',
          modalMath,
          { throwOnError: false, displayMode: true }
        );
      }
    }
  }

  private renderMathFormula(): void {
    const mathBox = document.getElementById('mystery-top-formula');
    if (mathBox) {
      katex.render(
        '\\frac{dW}{dt} = - \\int_V \\boldsymbol{j} \\cdot \\boldsymbol{E} \\, dV - \\oint_{\\partial V} \\boldsymbol{S} \\cdot d\\boldsymbol{A}',
        mathBox,
        { throwOnError: false }
      );
    }
  }

  private showToast(msg: string): void {
    const toast = document.getElementById('mystery-toast');
    if (toast) {
      toast.textContent = msg;
      toast.classList.remove('hidden');
      toast.classList.add('visible');
      setTimeout(() => {
        toast.classList.remove('visible');
        toast.classList.add('hidden');
      }, 4000);
    }
  }

  public resetInvestigation(): void {
    this.state = {
      currentPhase: 'intro',
      dialogueIndex: 0,
      selectedTool: 'inspect',
      initialEnergy: 100,
      remainingEnergy: 20,
      missingEnergy: 80,
      evidences: {
        floor_heater: { ...INITIAL_EVIDENCES.floor_heater, discovered: false },
        quartz_window: { ...INITIAL_EVIDENCES.quartz_window, discovered: false }
      },
      slottedEvidenceIds: {
        jouleHeat: null,
        poyntingFlux: null
      },
      isSolved: false
    };

    if (this.scene3D) {
      this.scene3D.setTool('inspect');
      this.scene3D.focusCamera('room');
    }

    if (this.notebookView) {
      this.notebookView.update(this.state);
    }

    const toolBtns = document.querySelectorAll<HTMLButtonElement>('.btn-mystery-tool');
    toolBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tool === 'inspect');
    });

    this.updateCurrentDialogue();
    this.showToast('↺ 捜査状況を初期状態にリセットしました。');
  }
}
