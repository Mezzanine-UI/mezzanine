import { ReactElement } from 'react';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface StepperProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * The type of step indicator.
   * - 'dot': Display as dots
   * - 'number': Display as numbers
   * @default 'number'
   */
  type?: 'dot' | 'number';

  /**
   * The orientation of the stepper.
   * - 'horizontal': Steps arranged horizontally
   * - 'vertical': Steps arranged vertically
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Set the processing step to replace step status.
   * @default 0 (process the first step)
   */
  processingIndex?: number;

  /**
   * Three or more `<Step />` components.
   */
  children: ReactElement<StepProps> | ReactElement<StepProps>[];
}

export interface StepProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'div'>,
    'title' | 'children'
  > {
  /**
   * The current status of the step, automatically set by the parent <Stepper />.
   * - 'processing': Currently active/in progress
   * - 'pending': Waiting to be processed
   * - 'succeeded': Successfully completed
   */
  status?: 'processing' | 'pending' | 'succeeded';

  /**
   * Whether the step is in error state.
   */
  error?: boolean;

  /**
   * Whether the step is disabled.
   */
  disabled?: boolean;

  /**
   * The step description, visible if value is not empty.
   */
  description?: string;

  /**
   * Step index. automatically set by the parent <Stepper />.
   */
  index?: number;

  /**
   * The orientation of the step, inherited from parent Stepper.
   * - 'horizontal': Step arranged horizontally
   * - 'vertical': Step arranged vertically
   */
  orientation?: 'horizontal' | 'vertical';

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
