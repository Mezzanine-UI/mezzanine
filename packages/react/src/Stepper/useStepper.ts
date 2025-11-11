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
