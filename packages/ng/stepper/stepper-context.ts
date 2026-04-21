import { InjectionToken, Signal } from '@angular/core';
import { StepOrientation, StepType } from './step.component';

/**
 * 由 `MznStepper` 提供的上下文，供子 `MznStep` 以 pull-based 方式
 * 計算自身狀態（索引、排列方向、指示器類型、進度狀態）。
 *
 * 使用註冊模式：Step 在建構時呼叫 `register` 取得自身索引信號，
 * 確保所有狀態在首次變更偵測前已穩定，避免 NG0100。
 */
export interface StepperContext {
  readonly currentStep: Signal<number>;
  readonly orientation: Signal<StepOrientation>;
  readonly type: Signal<StepType>;
  readonly register: (step: unknown) => Signal<number>;
  readonly unregister: (step: unknown) => void;
}

export const MZN_STEPPER_CONTEXT = new InjectionToken<StepperContext>(
  'MZN_STEPPER_CONTEXT',
);
