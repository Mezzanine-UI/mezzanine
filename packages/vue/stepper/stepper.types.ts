export interface StepperProps {
  /**
   * Set the processing step index to replace step status.
   * Index is zero-based (0 = first step, 1 = second step, etc.).
   * @default 0
   */
  currentStep?: number;

  /**
   * The orientation of the stepper.
   * - 'horizontal': Steps arranged horizontally
   * - 'vertical': Steps arranged vertically
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * The type of step indicator.
   * - 'dot': Display as dots
   * - 'number': Display as numbers
   * @default 'number'
   */
  type?: 'dot' | 'number';
}
