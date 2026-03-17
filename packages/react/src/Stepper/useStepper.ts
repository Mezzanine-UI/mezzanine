import { useState } from 'react';

export interface UseStepperOptions {
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
 * 管理多步驟流程狀態的 Hook。
 *
 * 維護當前步驟索引，並提供 `nextStep`、`prevStep`、`goToStep` 等導航方法，
 * 同時暴露 `isFirstStep` 與 `isLastStep` 兩個旗標以簡化邊界判斷。
 *
 * @example
 * ```tsx
 * import { useStepper } from '@mezzanine-ui/react';
 *
 * const { currentStep, nextStep, prevStep, isFirstStep, isLastStep } = useStepper({
 *   totalSteps: 3,
 *   defaultStep: 0,
 * });
 * ```
 *
 * @see {@link Stepper} 搭配的元件
 */
export const useStepper = ({
  defaultStep = 0,
  totalSteps = Number.MAX_VALUE,
}: UseStepperOptions) => {
  const [currentStep, setCurrentStep] = useState(defaultStep);

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return {
    currentStep,
    goToStep,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
  };
};
