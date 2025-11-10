import { ReactElement } from 'react';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface StepperProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Three or more `<Step />` components.
   */
  children: ReactElement<StepProps> | ReactElement<StepProps>[];

  /**
   * The orientation of the stepper.
   * - 'horizontal': Steps arranged horizontally
   * - 'vertical': Steps arranged vertically
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Set the processing step index to replace step status.
   * Index is zero-based (0 = first step, 1 = second step, etc.).
   * @default 0
   */
  processingIndex?: number;

  /**
   * The type of step indicator.
   * - 'dot': Display as dots
   * - 'number': Display as numbers
   * @default 'number'
   */
  type?: 'dot' | 'number';
}

export interface StepProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'div'>,
    'title' | 'children'
  > {
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
   * Step index, automatically set by the parent <Stepper />.
   * Zero-based index (0 = first step, 1 = second step, etc.).
   */
  index?: number;

  /**
   * The orientation of the step, inherited from parent Stepper.
   * - 'horizontal': Step arranged horizontally
   * - 'vertical': Step arranged vertically
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * The current status of the step, automatically set by the parent <Stepper />.
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
   * The type of step indicator, inherited from parent Stepper.
   * - 'dot': Display as dot
   * - 'number': Display as number
   */
  type?: 'dot' | 'number';
}
