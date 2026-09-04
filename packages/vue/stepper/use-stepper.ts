import { computed, ref } from 'vue';
import type { ComputedRef, Ref } from 'vue';

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

export interface UseStepperReturn {
  currentStep: Ref<number>;
  goToStep: (step: number) => void;
  isFirstStep: ComputedRef<boolean>;
  isLastStep: ComputedRef<boolean>;
  nextStep: () => void;
  prevStep: () => void;
}

/**
 * 管理多步驟流程狀態的 composable。
 *
 * 維護當前步驟索引，並提供 `nextStep`、`prevStep`、`goToStep` 等導航方法，
 * 同時暴露 `isFirstStep` 與 `isLastStep` 兩個旗標以簡化邊界判斷。
 *
 * @example
 * ```ts
 * import { useStepper } from '@mezzanine-ui/vue/stepper';
 *
 * const { currentStep, nextStep, prevStep, isFirstStep, isLastStep } = useStepper({
 *   totalSteps: 3,
 *   defaultStep: 0,
 * });
 * ```
 *
 * @see MznStepper 搭配的元件
 */
export function useStepper({
  defaultStep = 0,
  totalSteps = Number.MAX_VALUE,
}: UseStepperOptions): UseStepperReturn {
  const currentStep = ref(defaultStep);

  const goToStep = (step: number): void => {
    currentStep.value = Math.max(0, Math.min(step, totalSteps - 1));
  };

  const isFirstStep = computed((): boolean => currentStep.value === 0);
  const isLastStep = computed(
    (): boolean => currentStep.value === totalSteps - 1,
  );

  const nextStep = (): void => {
    currentStep.value = Math.min(currentStep.value + 1, totalSteps - 1);
  };

  const prevStep = (): void => {
    currentStep.value = Math.max(currentStep.value - 1, 0);
  };

  return {
    currentStep,
    goToStep,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
  };
}
