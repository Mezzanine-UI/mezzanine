import {
  forwardRef,
  ReactElement,
  cloneElement,
  Children,
  useRef,
  CSSProperties,
} from 'react';
import { stepperClasses as classes } from '@mezzanine-ui/core/stepper';
import { cx } from '../utils/cx';
import { StepperProps, StepProps } from './typings';
import { useStepDistance } from './useStepDistance';

/**
 * The react component for `mezzanine` stepper.
 */
const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  function Stepper(props, ref) {
    const {
      className,
      children,
      orientation,
      processingStep = -1,
      type,
      ...rest
    } = props;

    const childrenArray = Children.toArray(children);

    const stepperRef = useRef<HTMLDivElement>(null);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    const stepPositions = useStepDistance(
      orientation,
      stepperRef,
      stepRefs,
      type,
      childrenArray,
    );

    const stepsWithState = childrenArray.map((element, index) => {
      const step = element as ReactElement<StepProps>;

      const getStepStatus = (
        index: number,
        processingIndex: number,
      ): StepProps['status'] => {
        if (index === processingIndex) return 'processing';
        if (index < processingIndex) return 'succeeded';
        return undefined;
      };

      const appendProps: Partial<Pick<StepProps, 'index' | 'status'>> = {
        index,
        status: getStepStatus(index, processingIndex),
      };

      return cloneElement(step as ReactElement<any>, {
        ...appendProps,
        orientation,
        type,
        ref: (el: HTMLDivElement | null) => {
          stepRefs.current[index] = el;
        },
        style: {
          '--connect-line-distance': stepPositions?.distances?.[index]
            ? `${stepPositions.distances[index]}px`
            : undefined,
          ...step.props.style,
        } as CSSProperties,
        ...step.props,
      });
    });

    return (
      <div
        className={cx(
          classes.host,
          {
            // orientation
            [classes.horizontal]: orientation === 'horizontal',
            [classes.vertical]: orientation === 'vertical',
            // type
            [classes.dot]: type === 'dot',
            [classes.number]: type === 'number',
          },
          className,
        )}
        ref={(element) => {
          stepperRef.current = element;
          if (typeof ref === 'function') {
            ref(element);
          } else if (ref) {
            ref.current = element;
          }
        }}
        {...rest}
      >
        {stepsWithState}
      </div>
    );
  },
);

export default Stepper;
