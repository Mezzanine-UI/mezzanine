import { computed, Injectable, signal } from '@angular/core';

export interface MznStepperStateOptions {
  /**
   * The default step index to start from.
   * Index is zero-based (0 = first step, 1 = second step, etc.).
   * @default 0
   */
  defaultStep?: number;

  /**
   * Total number of steps in the stepper.
   * @default Number.MAX_VALUE
   */
  totalSteps?: number;
}

/**
 * Angular 版步驟狀態管理服務，對應 React 版 `useStepper` hook。
 *
 * 維護當前步驟索引，並提供 `nextStep`、`prevStep`、`goToStep` 等導航方法，
 * 同時暴露 `isFirstStep` 與 `isLastStep` 兩個信號以簡化邊界判斷。
 *
 * 可手動實例化（`new MznStepperState({ totalSteps: 3 })`）
 * 或作為可注入服務透過 DI 提供。
 *
 * @example
 * ```ts
 * import { MznStepperState } from '@mezzanine-ui/ng/stepper';
 *
 * // 直接實例化（不需要 DI）
 * readonly stepperState = new MznStepperState({ totalSteps: 3, defaultStep: 0 });
 *
 * // 在模板中使用
 * // <mzn-stepper [currentStep]="stepperState.currentStep()">
 * //   <mzn-step title="步驟一" />
 * //   <mzn-step title="步驟二" />
 * //   <mzn-step title="步驟三" />
 * // </mzn-stepper>
 * // <button (click)="stepperState.prevStep()">上一步</button>
 * // <button (click)="stepperState.nextStep()">下一步</button>
 * ```
 *
 * @see {@link MznStepper} 搭配的元件
 */
@Injectable()
export class MznStepperState {
  private readonly _totalSteps: number;
  private readonly _currentStep = signal(0);

  readonly currentStep = this._currentStep.asReadonly();
  readonly isFirstStep = computed(() => this._currentStep() === 0);
  readonly isLastStep = computed(
    () => this._currentStep() === this._totalSteps - 1,
  );

  constructor({
    defaultStep = 0,
    totalSteps = Number.MAX_VALUE,
  }: MznStepperStateOptions = {}) {
    this._totalSteps = totalSteps;
    this._currentStep.set(defaultStep);
  }

  goToStep(step: number): void {
    this._currentStep.set(Math.max(0, Math.min(step, this._totalSteps - 1)));
  }

  nextStep(): void {
    this._currentStep.update((prev) =>
      Math.min(prev + 1, this._totalSteps - 1),
    );
  }

  prevStep(): void {
    this._currentStep.update((prev) => Math.max(prev - 1, 0));
  }
}
