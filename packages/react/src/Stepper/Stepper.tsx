import {
  forwardRef,
  ReactElement,
  cloneElement,
  Children,
  ReactNode,
} from 'react';
import { stepperClasses as classes } from '@mezzanine-ui/core/stepper';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface StepperProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Set the active step (zero based index) and set other `<Step />` to completed or disabled depending on index.
   * Set to -1 to disable all the steps.
   * @default -1
   */
  activeStep?: number;
  /**
   * Two or more `<Step />` components.
   */
  children: ReactNode;
}

/**
 * The react component for `mezzanine` stepper.
 */
const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  function Stepper(props, ref) {
    const { activeStep = -1, children, className, ...rest } = props;

    const childrenArray = Children.toArray(children);
    const stepsWithState = childrenArray.map((element, index) => {
      const step = element as ReactElement<any>;
      const state = {
        index,
        active: activeStep === index,
        completed: activeStep > index,
        disabled: activeStep < index,
      };

      if (step.props.active || step.props.disabled || step.props.completed) {
        state.active = false;
        state.completed = false;
        state.disabled = false;
      }

      return cloneElement(step, {
        ...state,
        ...step.props,
      });
    });

    return (
      <div className={cx(classes.host, className)} ref={ref} {...rest}>
        {stepsWithState}
      </div>
    );
  },
);

export default Stepper;
