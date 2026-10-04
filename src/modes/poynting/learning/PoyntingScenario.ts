import { POYNTING_SCENARIO_STEPS } from './PoyntingScenarioData.ts';
import { PoyntingScenarioStep } from './PoyntingChallengeTypes.ts';

export class PoyntingScenario {
  private steps: PoyntingScenarioStep[] = POYNTING_SCENARIO_STEPS;
  private currentStepIndex: number = 0;
  private isActive: boolean = false;

  private onStepChangeCallbacks: Array<(step: PoyntingScenarioStep) => void> = [];
  private onModeToggleCallbacks: Array<(active: boolean) => void> = [];

  public start(): void {
    this.isActive = true;
    this.currentStepIndex = 0;
    this.notifyModeToggle(true);
    this.notifyStepChange();
  }

  public exit(): void {
    this.isActive = false;
    this.notifyModeToggle(false);
  }

  public toggle(): void {
    if (this.isActive) {
      this.exit();
    } else {
      this.start();
    }
  }

  public nextStep(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.notifyStepChange();
    }
  }

  public prevStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.notifyStepChange();
    }
  }

  public goToStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      this.currentStepIndex = index;
      this.notifyStepChange();
    }
  }

  public getCurrentStep(): PoyntingScenarioStep {
    return this.steps[this.currentStepIndex];
  }

  public getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  public getSteps(): PoyntingScenarioStep[] {
    return this.steps;
  }

  public isRunning(): boolean {
    return this.isActive;
  }

  public onStepChange(cb: (step: PoyntingScenarioStep) => void): void {
    this.onStepChangeCallbacks.push(cb);
  }

  public onModeToggle(cb: (active: boolean) => void): void {
    this.onModeToggleCallbacks.push(cb);
  }

  private notifyStepChange(): void {
    const step = this.getCurrentStep();
    for (const cb of this.onStepChangeCallbacks) {
      cb(step);
    }
  }

  private notifyModeToggle(active: boolean): void {
    for (const cb of this.onModeToggleCallbacks) {
      cb(active);
    }
  }
}
