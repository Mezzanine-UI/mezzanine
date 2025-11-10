import { ReactNode } from 'react';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface StepperProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * The type of step indicator.
   * - 'dot': Display as dots
   * - 'number': Display as numbers
   */
  type: 'dot' | 'number';

  /**
   * The orientation of the stepper.
   * - 'horizontal': Steps arranged horizontally
   * - 'vertical': Steps arranged vertically
   */
  orientation: 'horizontal' | 'vertical';

  /**
   * Set the processing step to replace step status.
   */
  processingStep?: number;

  /**
   * Three or more `<Step />` components.
   */
  children: ReactNode;
}

export interface StepProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'div'>,
    'title' | 'children'
  > {
  /**
   * The current status of the step.
   * - 'processing': Currently active/in progress
   * - 'pending': Waiting to be processed
   * - 'succeeded': Successfully completed
   * - 'error': Failed or has errors
   * - 'disabled': Not available for interaction
   */
  status?: 'processing' | 'pending' | 'succeeded' | 'error' | 'disabled';

  /**
   * The step description, visible if value is not empty.
   */
  description?: string;

  /**
   * Step indicator number. automatically set by the parent <Stepper />.
   */
  indicatorNumber?: number;

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
