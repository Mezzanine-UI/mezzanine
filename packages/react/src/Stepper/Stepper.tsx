import {
  forwardRef,
  ReactElement,
  cloneElement,
  Children,
  useRef,
  CSSProperties,
  useEffect,
  useCallback,
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
      children,
      className,
      currentStep = 0,
      onStepChange,
      orientation = 'horizontal',
      type = 'number',
      ...rest
    } = props;

    const childrenArray = Children.toArray(children);

    const stepperRef = useRef<HTMLDivElement>(null);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    const mergedRef = useCallback(
      (element: HTMLDivElement | null) => {
        stepperRef.current = element;
        if (ref) {
          if (typeof ref === 'function') {
            ref(element);
          } else {
            ref.current = element;
          }
        }
      },
      [ref],
    );

    const stepPositions = useStepDistance(
      orientation,
      stepperRef,
      stepRefs,
      type,
      childrenArray,
    );

    const getStepStatus = (
      index: number,
      processingIndex: number,
    ): StepProps['status'] => {
      if (index === processingIndex) return 'processing';
      if (index < processingIndex) return 'succeeded';
      return 'pending';
    };

    const stepsWithState = childrenArray.map((element, index) => {
      const step = element as ReactElement<StepProps>;

      return cloneElement(step as ReactElement<any>, {
        index,
        orientation,
        ref: (el: HTMLDivElement | null) => {
          stepRefs.current[index] = el;
        },
        status: getStepStatus(index, currentStep),
        style: {
          '--connect-line-distance': stepPositions?.distances?.[index]
            ? `${stepPositions.distances[index]}px`
            : undefined,
          ...step.props.style,
        } as CSSProperties,
        type,
        ...step.props,
      });
    });

    useEffect(() => {
      if (typeof onStepChange === 'function') {
        onStepChange(currentStep);
      }
    }, [currentStep, onStepChange]);

    return (
      <div
        {...rest}
        className={cx(
          classes.host,
          {
            [classes.horizontal]: orientation === 'horizontal',
            [classes.vertical]: orientation === 'vertical',
            [classes.dot]: type === 'dot',
            [classes.number]: type === 'number',
          },
          className,
        )}
        ref={mergedRef}
      >
        {stepsWithState}
      </div>
    );
  },
);

export default Stepper;
