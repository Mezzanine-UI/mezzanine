import {
  ChangeEventHandler,
  FocusEventHandler,
  forwardRef,
  Fragment,
  KeyboardEventHandler,
  Ref,
  useCallback,
  useEffect,
  useState,
  type JSX,
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
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import {
  UseRangeSliderProps,
  UseSingleSliderProps,
  useSlider,
} from './useSlider';
import Tooltip from '../Tooltip';
import Input, { InputProps } from '../Input';
import { IconDefinition } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import Typography from '../Typography';

export interface SliderBaseProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'div'>,
    'defaultChecked' | 'defaultValue' | 'onChange'
  > {
  /**
   * Whether the slider is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The ref for Slider root.
   */
  innerRef?: Ref<HTMLDivElement>;
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
   * Whether to show tick marks on the slider.
   * If a number is given, it represents the number of equally spaced segments between min and max to display tick marks (excluding min and max).
   * If a number array is given, the values represent the actual slider values at which to show the tick marks (not percentages).
   * @example
   * 3 // means show tick marks at values 25, 50, and 75 (for min=0, max=100)
   * [20, 50, 80] // means show tick marks at values 20, 50, and 80
   */
  withTick?: number | number[];
}

export type SliderWithInputProps = SliderBaseProps & {
  prefixIcon?: never;
  suffixIcon?: never;
  /**
   * Whether to show input box to allow user to input value.
   */
  withInput: true;
};

export type SliderWithIconProps = SliderBaseProps & {
  /**
   * Set prefix icon.
   */
  prefixIcon: IconDefinition;
  /**
   * Set suffix icon.
   */
  suffixIcon: IconDefinition;
  withInput?: never;
};

export type SliderWithoutAddonsProps = SliderBaseProps & {
  prefixIcon?: never;
  suffixIcon?: never;
  withInput?: never;
};

export type SliderAddonProps =
  | SliderWithInputProps
  | SliderWithIconProps
  | SliderWithoutAddonsProps;

export type SingleSliderProps = SliderAddonProps & {
  onChange?: (value: SingleSliderValue) => void;
  /**
   * The value of the slider.
   */
  value: UseSingleSliderProps['value'];
};

export type RangeSliderProps = SliderAddonProps & {
  onChange?: (value: RangeSliderValue) => void;
  /**
   * The value of the slider.
   */
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
    prefixIcon,
    step = 1,
    style: styleProp,
    suffixIcon,
    value,
    withInput,
    withTick,
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

  const getHandle = (handlerValue: number, index: number) => (
    <div
      className={cx(
        classes.handlerPosition,
        index === 0 && classes.handlerStartPosition,
        index === 1 && classes.handlerEndPosition,
      )}
    >
      <Tooltip
        options={{
          placement: 'top',
        }}
        title={handlerValue.toString()}
        className={classes.handlerTooltip}
      >
        {({ onMouseEnter, onMouseLeave, ref }) => (
          <div
            ref={ref}
            className={cx(
              classes.handler,
              index === activeHandleIndex && classes.handlerActive,
            )}
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
            tabIndex={0}
          >
            {/* handler circle icon */}
            <span />
          </div>
        )}
      </Tooltip>
    </div>
  );

  const getTick = useCallback(
    (tickText: number | string, leftPercent: number) => {
      return (
        <span
          aria-hidden="true"
          className={classes.tick}
          key={tickText}
          style={{ left: `${leftPercent}%` }}
        >
          <Typography variant="caption">{tickText}</Typography>
        </span>
      );
    },
    [],
  );

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
          (onChange as UseRangeSliderProps['onChange'])(
            fixRangeSliderValue(value, min, max),
          );
        }

        return;
      }

      if (value < min || value > max) {
        (onChange as UseSingleSliderProps['onChange'])(
          fixSingleSliderValue(value, min, max),
        );
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

  const onStartInputChange: ChangeEventHandler<HTMLInputElement> | undefined =
    shouldHaveInputHandlers
      ? (e) => {
          setStartInputValue(e.target.value);
        }
      : undefined;

  const onEndInputChange: ChangeEventHandler<HTMLInputElement> | undefined =
    shouldHaveInputHandlers
      ? (e) => {
          setEndInputValue(e.target.value);
        }
      : undefined;

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

  const onEndInputBlur: FocusEventHandler<HTMLInputElement> | undefined =
    shouldHaveInputHandlers
      ? () => {
          if (isRangeSlider(value)) {
            const result = sortSliderValue([
              value[0],
              preventValueOverflow(Number(endInputValue)),
            ]);

            (onChange as UseRangeSliderProps['onChange'])(result);

            return;
          }

          (onChange as UseSingleSliderProps['onChange'])(
            preventValueOverflow(Number(endInputValue)),
          );
        }
      : undefined;

  const onStartInputKeydown:
    | KeyboardEventHandler<HTMLInputElement>
    | undefined =
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

  const onEndInputKeydown: KeyboardEventHandler<HTMLInputElement> | undefined =
    shouldHaveInputHandlers
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
    type: 'number',
  };

  return (
    <div
      {...rest}
      ref={innerRef}
      className={cx(classes.host, disabled && classes.disabled, className)}
      style={style}
    >
      {withInput && isRangeSlider(value) ? (
        <Input
          className={classes.input}
          disabled={disabled || undefined}
          onChange={onStartInputChange}
          value={startInputValue}
          inputProps={{
            ...inputProps,
            onKeyDown: onStartInputKeydown,
            onBlur: onStartInputBlur,
          }}
        />
      ) : null}
      {prefixIcon ? (
        <span className={classes.icon}>
          <Icon icon={prefixIcon} />
        </span>
      ) : null}
      <div className={classes.controls}>
        {/* interactive area */}
        <div
          className={classes.rail}
          onMouseDown={handleClickTrackOrRail}
          ref={railRef}
          role="presentation"
        >
          {/* line */}
          <span />
        </div>
        <div
          className={classes.track}
          onMouseDown={handleClickTrackOrRail}
          role="presentation"
        >
          {/* line */}
          <span />
        </div>
        {/* ticks dot and label */}
        {withTick ? (
          <>
            {getTick(min, 0)}
            {Array.isArray(withTick)
              ? withTick.map((tick) =>
                  tick <= max && tick >= min
                    ? getTick(tick, ((tick - min) / (max - min)) * 100)
                    : null,
                )
              : Array.from({ length: withTick }, (_, i) => i + 1).map((tick) =>
                  getTick(
                    (tick / (withTick + 1)) * (max - min) + min,
                    (tick / (withTick + 1)) * 100,
                  ),
                )}
            {getTick(max, 100)}
          </>
        ) : null}
        {/* handlers */}
        {isRangeSlider(value) ? (
          <>
            {getHandle(value[0], 0)}
            {getHandle(value[1], 1)}
          </>
        ) : (
          getHandle(value, -1)
        )}
      </div>
      {withInput ? (
        <Input
          className={classes.input}
          disabled={disabled || undefined}
          onChange={onEndInputChange}
          value={endInputValue}
          inputProps={{
            ...inputProps,
            onKeyDown: onEndInputKeydown,
            onBlur: onEndInputBlur,
          }}
        />
      ) : null}
      {suffixIcon ? (
        <span className={classes.icon}>
          <Icon icon={suffixIcon} />
        </span>
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
    return <SliderComponent {...(props as RangeSliderProps)} innerRef={ref} />;
  }

  return <SliderComponent {...(props as SingleSliderProps)} innerRef={ref} />;
});

export default Slider;
