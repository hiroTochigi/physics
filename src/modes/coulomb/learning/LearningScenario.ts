import { ScenarioStep } from './ChallengeTypes.ts';
import { SCENARIO_STEPS } from './ScenarioData.ts';

export class LearningScenario {
  private currentStepIndex: number = 0;
  private isActive: boolean = false;
  private onStepChangeCallbacks: Array<(step: ScenarioStep) => void> = [];
  private onModeToggleCallbacks: Array<(active: boolean) => void> = [];

  constructor() {}

  public getSteps(): ScenarioStep[] {
    return SCENARIO_STEPS;
  }

  public getCurrentStep(): ScenarioStep {
    return SCENARIO_STEPS[this.currentStepIndex];
  }

  public getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  public isLearningModeActive(): boolean {
    return this.isActive;
  }

  public start(): void {
    this.isActive = true;
    this.currentStepIndex = 0;
    this.notifyModeToggle();
    this.notifyStepChange();
  }

  public exit(): void {
    this.isActive = false;
    this.notifyModeToggle();
  }

  public toggle(): boolean {
    if (this.isActive) {
      this.exit();
    } else {
      this.start();
    }
    return this.isActive;
  }

  public nextStep(): boolean {
    if (this.currentStepIndex < SCENARIO_STEPS.length - 1) {
      this.currentStepIndex++;
      this.notifyStepChange();
      return true;
    }
    return false;
  }

  public prevStep(): boolean {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.notifyStepChange();
      return true;
    }
    return false;
  }

  public goToStep(index: number): void {
    if (index >= 0 && index < SCENARIO_STEPS.length) {
      this.currentStepIndex = index;
      this.notifyStepChange();
    }
  }

  public onStepChange(callback: (step: ScenarioStep) => void): void {
    this.onStepChangeCallbacks.push(callback);
  }

  public onModeToggle(callback: (active: boolean) => void): void {
    this.onModeToggleCallbacks.push(callback);
  }

  private notifyStepChange(): void {
    const step = this.getCurrentStep();
    this.onStepChangeCallbacks.forEach(cb => cb(step));
  }

  private notifyModeToggle(): void {
    this.onModeToggleCallbacks.forEach(cb => cb(this.isActive));
  }
}
