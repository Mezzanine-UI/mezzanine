import { useStepper } from './use-stepper';

describe('useStepper', () => {
  it('should start at the default step', () => {
    expect(useStepper({ defaultStep: 2 }).currentStep.value).toBe(2);
    expect(useStepper({}).currentStep.value).toBe(0);
  });

  it('should advance and retreat within bounds', () => {
    const { currentStep, nextStep, prevStep } = useStepper({ totalSteps: 3 });

    nextStep();
    expect(currentStep.value).toBe(1);

    nextStep();
    nextStep();
    expect(currentStep.value).toBe(2);

    prevStep();
    prevStep();
    prevStep();
    expect(currentStep.value).toBe(0);
  });

  it('should clamp goToStep to the available range', () => {
    const { currentStep, goToStep } = useStepper({ totalSteps: 3 });

    goToStep(99);
    expect(currentStep.value).toBe(2);

    goToStep(-5);
    expect(currentStep.value).toBe(0);
  });

  it('should report the boundaries', () => {
    const { isFirstStep, isLastStep, nextStep } = useStepper({ totalSteps: 2 });

    expect(isFirstStep.value).toBe(true);
    expect(isLastStep.value).toBe(false);

    nextStep();

    expect(isFirstStep.value).toBe(false);
    expect(isLastStep.value).toBe(true);
  });

  it('should never be the last step without a total', () => {
    expect(useStepper({}).isLastStep.value).toBe(false);
  });
});
