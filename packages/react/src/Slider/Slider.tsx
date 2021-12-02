import {
  ChangeEventHandler,
  FocusEventHandler,
  forwardRef,
  KeyboardEventHandler,
  Ref,
  useEffect,
  useState,
} from 'react';
import {
  isRangeSlider,
  RangeSliderValue,
  SingleSliderValue,
  sliderClasses as classes,
  sortSliderValue,
  roundToStep,
  fixSingleSliderValue,
  fixRangeSliderValue,
} from '@mezzanine-ui/core/slider';
import {
  NativeElementPropsWithoutKeyAndRef,
} from '../utils/jsx-types';
import { cx } from '../utils/cx';
import {
  UseRangeSliderProps,
  UseSingleSliderProps,
  useSlider,
} from './useSlider';
import Tooltip from '../Tooltip';
import Input, { InputProps } from '../Input';

export interface SliderBaseProps extends
  Omit<NativeElementPropsWithoutKeyAndRef<'div'>,
  | 'defaultChecked'
  | 'defaultValue'
  | 'onChange'
  > {
  /**
   * Whether the slider is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The maximum permitted value
   * @default 100
   */
  max?: number;
  /**
   * The minimum permitted value
   * @default 0
   */
  min?: number;
  /**
   * The stepping interval.
   * @default 0
   */
  step?: number;
  /**
   * Will render input if `withInput` is `true`.
   */
  withInput?: boolean;
  /**
   * The ref for Slider root.
   */
  innerRef?: Ref<HTMLDivElement>;
}

export type SingleSliderProps = SliderBaseProps & {
  onChange?: (value: SingleSliderValue) => void;
  value: UseSingleSliderProps['value'];
};
export type RangeSliderProps = SliderBaseProps & {
  onChange?: (value: RangeSliderValue) => void;
  value: UseRangeSliderProps['value'];
};
export type SliderComponentProps = SingleSliderProps | RangeSliderProps;
export type SliderProps = Omit<SliderComponentProps, 'innerRef'>;

function SliderComponent(props: SingleSliderProps): JSX.Element;
function SliderComponent(props: RangeSliderProps): JSX.Element;
function SliderComponent(props: SliderComponentProps) {
  const {
    className,
    disabled,
    innerRef,
    max = 100,
    min = 0,
    onChange,
    step = 1,
    style: styleProp,
    value,
    withInput,
    ...rest
  } = props;

  const {
    activeHandleIndex,
    cssVars,
    handleClickTrackOrRail,
    handlePress,
    railRef,
  } = useSlider({
    max,
    min,
    onChange,
    step,
    value,
  } as UseRangeSliderProps | UseRangeSliderProps);

  const style = {
    ...cssVars,
    ...styleProp,
  };

  const shouldHaveInputHandlers = withInput && onChange && !disabled;

  const getHandle = (
    handlerValue: number,
    index: number,
  ) => (
    <div
      className={cx(
        classes.handlerPosition,
        index === 0 && classes.handlerStartPosition,
        index === 1 && classes.handlerEndPosition,
      )}
    >
      <Tooltip
        disablePortal
        options={{
          placement: 'top',
        }}
        title={handlerValue.toString()}
      >
        {({ onMouseEnter, onMouseLeave }) => (
          <div
            className={
              cx(
                classes.handler,
                index === activeHandleIndex && classes.handlerActive,
              )
            }
            aria-disabled={disabled}
            aria-label={`Slider Handler ${index}`}
            aria-valuemax={max}
            aria-valuemin={min}
            aria-valuenow={handlerValue}
            onFocus={() => {}}
            onMouseDown={(e) => handlePress(e, index)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onTouchStart={(e) => handlePress(e, index)}
            role="slider"
            tabIndex={index}
          />
        )}
      </Tooltip>
    </div>
  );

  const inputSize = Math.max(min.toString().length, max.toString().length);

  const [startInputValue, setStartInputValue] = useState(() => {
    if (!isRangeSlider(value)) {
      return '';
    }

    return `${value[0]}`;
  });

  const [endInputValue, setEndInputValue] = useState(() => {
    if (!isRangeSlider(value)) {
      return `${value}`;
    }

    return `${value[1]}`;
  });

  useEffect(() => {
    if (max > min) {
      if (isRangeSlider(value)) {
        if (
          (value[0] > max && value[1] > max) ||
          (value[0] < min && value[1] < min) ||
          value[0] < min ||
          value[1] > max
        ) {
          (onChange as UseRangeSliderProps['onChange'])(fixRangeSliderValue(value, min, max));
        }

        return;
      }

      if (value < min || value > max) {
        (onChange as UseSingleSliderProps['onChange'])(fixSingleSliderValue(value, min, max));
      }
    }
  }, [min, max, onChange, value]);

  useEffect(() => {
    if (withInput) {
      if (isRangeSlider(value)) {
        setStartInputValue(`${value[0]}`);
        setEndInputValue(`${value[1]}`);

        return;
      }

      setEndInputValue(value.toString());
    }
  }, [value, withInput]);

  function preventValueOverflow(target: number) {
    if (target > max) {
      return max;
    }

    if (target < min) {
      return min;
    }

    return roundToStep(target, step, min, max);
  }

  const onStartInputChange: ChangeEventHandler<HTMLInputElement> | undefined = shouldHaveInputHandlers ? (e) => {
    setStartInputValue(e.target.value);
  } : undefined;

  const onEndInputChange: ChangeEventHandler<HTMLInputElement> | undefined = shouldHaveInputHandlers ? (e) => {
    setEndInputValue(e.target.value);
  } : undefined;

  const onStartInputBlur: FocusEventHandler<HTMLInputElement> | undefined =
  shouldHaveInputHandlers && isRangeSlider(value)
    ? () => {
      const result = sortSliderValue([
        value[1],
        preventValueOverflow(Number(startInputValue)),
      ]);

      (onChange as UseRangeSliderProps['onChange'])(result);
    }
    : undefined;

  const onEndInputBlur: FocusEventHandler<HTMLInputElement> | undefined = shouldHaveInputHandlers
    ? () => {
      if (isRangeSlider(value)) {
        const result = sortSliderValue([
          value[0],
          preventValueOverflow(Number(endInputValue)),
        ]);

        (onChange as UseRangeSliderProps['onChange'])(result);

        return;
      }

      (onChange as UseSingleSliderProps['onChange'])(preventValueOverflow(Number(endInputValue)));
    }
    : undefined;

  const onStartInputKeydown: KeyboardEventHandler<HTMLInputElement> | undefined =
  shouldHaveInputHandlers && isRangeSlider(value)
    ? (e) => {
      switch (e.code) {
        case 'Enter': {
          const result = sortSliderValue([
            value[1],
            preventValueOverflow(Number(startInputValue)),
          ]);

          setStartInputValue(result[0].toString());
          setEndInputValue(result[1].toString());
          (onChange as UseRangeSliderProps['onChange'])(result);

          break;
        }

        case 'Escape': {
          setStartInputValue(value[0].toString());
          setEndInputValue(value[1].toString());

          break;
        }

        default:
          break;
      }
    }
    : undefined;

  const onEndInputKeydown: KeyboardEventHandler<HTMLInputElement> | undefined = shouldHaveInputHandlers
    ? (e) => {
      switch (e.code) {
        case 'Enter': {
          if (isRangeSlider(value)) {
            const result = sortSliderValue([
              value[0],
              preventValueOverflow(Number(endInputValue)),
            ]);

            setStartInputValue(result[0].toString());
            setEndInputValue(result[1].toString());
            (onChange as UseRangeSliderProps['onChange'])(result);

            return;
          }

          const result = preventValueOverflow(Number(endInputValue));

          setEndInputValue(result.toString());
          (onChange as UseSingleSliderProps['onChange'])(result);

          break;
        }

        case 'Escape': {
          if (isRangeSlider(value)) {
            setStartInputValue(value[0].toString());
            setEndInputValue(value[1].toString());

            return;
          }

          setEndInputValue(value.toString());

          break;
        }

        default:
          break;
      }
    }
    : undefined;

  const inputProps: InputProps['inputProps'] = {
    max,
    min,
    style: {
      width: `${inputSize}ch`,
    },
    type: 'number',
  };

  return (
    <div
      {...rest}
      ref={innerRef}
      className={
        cx(
          classes.host,
          disabled && classes.disabled,
          className,
        )
      }
      style={style}
    >
      {withInput && isRangeSlider(value) ? (
        <Input
          className={classes.input}
          disabled={disabled}
          onChange={onStartInputChange}
          value={startInputValue}
          inputProps={{
            ...inputProps,
            onKeyDown: onStartInputKeydown,
            onBlur: onStartInputBlur,
          }}
        />
      ) : null}
      <div className={classes.controls}>
        <div
          ref={railRef}
          className={
            classes.rail
          }
          role="presentation"
          onMouseDown={handleClickTrackOrRail}
        />
        <div
          className={classes.track}
          role="presentation"
          onMouseDown={handleClickTrackOrRail}
        />
        {
          isRangeSlider(value) ? (
            <>
              {getHandle(value[0], 0)}
              {getHandle(value[1], 1)}
            </>
          ) : getHandle(value, -1)
        }
      </div>
      {withInput ? (
        <Input
          className={classes.input}
          disabled={disabled}
          onChange={onEndInputChange}
          value={endInputValue}
          inputProps={{
            ...inputProps,
            onKeyDown: onEndInputKeydown,
            onBlur: onEndInputBlur,
          }}
        />
      ) : null}
    </div>
  );
}

/**
 * The react component for `mezzanine` slider.
 * The outcome will be base on the type of given value.
 * Notice that slider is a fully controlled component. Property value is always needed.
 */
const Slider = forwardRef<HTMLDivElement, SliderProps>((props, ref) => {
  if (isRangeSlider(props.value)) {
    return (
      <SliderComponent {...(props as RangeSliderProps)} innerRef={ref} />
    );
  }

  return (
    <SliderComponent {...(props as SingleSliderProps)} innerRef={ref} />
  );
});

export default Slider;
