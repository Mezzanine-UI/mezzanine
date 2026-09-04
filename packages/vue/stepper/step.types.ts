export interface StepProps {
  /**
   * The step description, visible if value is not empty.
   */
  description?: string;

  /**
   * Whether the step is disabled.
   * Only applies when status is not 'processing'.
   */
  disabled?: boolean;

  /**
   * Whether the step is in error state.
   * Only applies when status is not 'processing'.
   */
  error?: boolean;

  /**
   * Step index, automatically set by the parent stepper.
   * Zero-based index (0 = first step, 1 = second step, etc.).
   */
  index?: number;

  /**
   * The orientation of the step, inherited from parent stepper.
   * - 'horizontal': Step arranged horizontally
   * - 'vertical': Step arranged vertically
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * The current status of the step, automatically set by the parent stepper.
   * - 'processing': Currently active/in progress
   * - 'pending': Waiting to be processed (default for future steps)
   * - 'succeeded': Successfully completed
   */
  status?: 'processing' | 'pending' | 'succeeded';

  /**
   * The step title.
   */
  title?: string;

  /**
   * The type of step indicator, inherited from parent stepper.
   * - 'dot': Display as dot
   * - 'number': Display as number
   */
  type?: 'dot' | 'number';
}
