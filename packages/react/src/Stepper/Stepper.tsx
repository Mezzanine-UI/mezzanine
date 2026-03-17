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
 * 步驟進度指示器元件，以線性流程呈現多個步驟的完成狀態。
 *
 * 子元件必須為 `<Step />` 元件；`currentStep` 控制當前進行中的步驟（零基索引），
 * 之前的步驟自動標記為已完成，之後的步驟為待處理。支援 `horizontal`（水平）與
 * `vertical`（垂直）排列，以及 `number`（數字）與 `dot`（圓點）兩種指示器樣式。
 *
 * @example
 * ```tsx
 * import Stepper from '@mezzanine-ui/react/Stepper';
 * import Step from '@mezzanine-ui/react/Step';
 *
 * // 水平數字步驟條
 * <Stepper currentStep={1}>
 *   <Step title="填寫資料" description="請輸入基本資訊" />
 *   <Step title="確認內容" description="核對填寫資料" />
 *   <Step title="完成送出" />
 * </Stepper>
 *
 * // 垂直圓點步驟條
 * <Stepper currentStep={0} orientation="vertical" type="dot">
 *   <Step title="步驟一" />
 *   <Step title="步驟二" />
 *   <Step title="步驟三" />
 * </Stepper>
 *
 * // 監聽步驟變化
 * <Stepper currentStep={step} onStepChange={(idx) => console.log('step:', idx)}>
 *   <Step title="A" />
 *   <Step title="B" />
 *   <Step title="C" />
 * </Stepper>
 * ```
 *
 * @see {@link useStepper} 管理步驟狀態的 hook
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
        ...step.props,
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
