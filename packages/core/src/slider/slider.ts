import { CssVarInterpolations } from '@mezzanine-ui/system/css';

/** Types */
export type SingleSliderValue = number;
export type RangeSliderValue = [number, number];
export type SliderValue = SingleSliderValue | RangeSliderValue;
export type SliderRect = Pick<DOMRect, 'left' | 'width'>;

/** Classes */
export const sliderPrefix = 'mzn-slider';
export const sliderHandlerPrefix = `${sliderPrefix}__handler`;

export interface SliderCssVars {
  trackWidth: number;
  trackPosition: number;
  handlerPosition: number;
  handlerStartPosition: number;
  handlerEndPosition: number;
}

export const sliderClasses = {
  /**
   * Base
   */
  host: sliderPrefix,
  disabled: `${sliderPrefix}--disabled`,
  /**
   * Input
   */
  input: `${sliderPrefix}__input`,
  /**
   * Controls
   */
  controls: `${sliderPrefix}__controls`,
  /**
   * Rail
   */
  rail: `${sliderPrefix}__rail`,
  /**
   * Track
   */
  track: `${sliderPrefix}__track`,
  /**
   * Handler
   */
  handler: sliderHandlerPrefix,
  handlerActive: `${sliderHandlerPrefix}--active`,
  handlerPosition: `${sliderHandlerPrefix}__position`,
  handlerStartPosition: `${sliderHandlerPrefix}__position--start`,
  handlerEndPosition: `${sliderHandlerPrefix}__position--end`,
  handlerTooltip: `${sliderHandlerPrefix}__tooltip`,
  /** Icon */
  icon: `${sliderPrefix}__icon`,
  /** Tick */
  tick: `${sliderPrefix}__tick`,
} as const;

/** Methods */
export function toSliderCssVars(
  variables: SliderCssVars,
): CssVarInterpolations {
  const {
    trackWidth,
    trackPosition,
    handlerPosition,
    handlerStartPosition,
    handlerEndPosition,
  } = variables;

  return {
    [`--${sliderPrefix}-track-width`]: `${trackWidth}%`,
    [`--${sliderPrefix}-track-position`]: `${trackPosition}%`,
    [`--${sliderPrefix}-handler-position`]: `${handlerPosition}%`,
    [`--${sliderPrefix}-handler-start-position`]: `${handlerStartPosition}%`,
    [`--${sliderPrefix}-handler-end-position`]: `${handlerEndPosition}%`,
  };
}

export function isRangeSlider(value: SliderValue): value is RangeSliderValue {
  return Array.isArray(value);
}

export function sortSliderValue(value: SingleSliderValue): never;
export function sortSliderValue(value: RangeSliderValue): RangeSliderValue;
export function sortSliderValue(value: SliderValue) {
  if (typeof value !== 'object') {
    throw Error(
      'should provide `RangeSliderValue` to `sortSliderValue` method',
    );
  }

  return value[1] > value[0] ? [value[0], value[1]] : [value[1], value[0]];
}

// methods for computing handle and track position
export function getSliderRect(element: HTMLDivElement): SliderRect {
  const rect = element.getBoundingClientRect();

  return {
    left: Math.ceil(rect.left),
    width: Math.ceil(rect.width),
  };
}

export function getValueFromClientX(
  clientX: number,
  trackDims: SliderRect,
  min: number,
  max: number,
) {
  const { left, width } = trackDims;
  const percentageValue = (clientX - left) / width;
  const value = (max - min) * percentageValue;

  return value + min;
}

export function getPercentage(value: number, min: number, max: number) {
  if (min > max) return 0;

  return Math.max(0, Math.min(100, (value / Math.abs(max - min)) * 100));
}

export function getPrecision(step: number) {
  const stepString = step.toString();
  let precision = 0;

  if (stepString.indexOf('.') >= 0) {
    precision = stepString.length - stepString.indexOf('.') - 1;
  }

  return precision;
}

export function fixSingleSliderValue(
  value: SingleSliderValue,
  min: number,
  max: number,
): SingleSliderValue {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

export function fixRangeSliderValue(
  value: RangeSliderValue,
  min: number,
  max: number,
): RangeSliderValue {
  if (value[0] > max && value[1] > max) {
    return [max, max];
  }

  if (value[0] < min && value[1] < min) {
    return [min, min];
  }

  if (value[0] < min) {
    return [min, value[1]];
  }

  if (value[1] > max) {
    return [value[0], max];
  }

  return value;
}

export function roundToStep(
  value: number,
  step: number,
  min: number,
  max: number,
) {
  let left = min;
  let right = max;

  while (left < value && left + step < value) {
    left += step;
  }

  right = Math.min(left + step, max);

  if (value - left < right - value) {
    return parseFloat(left.toFixed(getPrecision(step)));
  }

  return parseFloat(right.toFixed(getPrecision(step)));
}

export function findClosetValueIndex(value: SliderValue, newValue: number) {
  if (!isRangeSlider(value)) return -1;
  const [closetValue] = [...value].sort(
    (a, b) => Math.abs(newValue - a) - Math.abs(newValue - b),
  );

  return value.findIndex((element) => element === closetValue);
}
