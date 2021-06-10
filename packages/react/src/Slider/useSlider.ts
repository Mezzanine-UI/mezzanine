import {
  RangeSliderValue,
  findClosetValueIndex,
  getPercentage,
  getSliderRect,
  getValueFromClientX,
  isRangeSlider,
  roundToStep,
  sortSliderValue,
  toSliderCssVars,
  SingleSliderValue,
} from '@mezzanine-ui/core/slider';
import { CssVarInterpolation } from '@mezzanine-ui/system/css';
import {
  RefObject,
  useRef,
  useState,
} from 'react';
import { useDocumentEvents } from '../hooks/useDocumentEvents';

export interface UseSliderCommonProps {
  max: number;
  min: number;
  step: number;
}

export interface UseSingleSliderProps extends UseSliderCommonProps {
  onChange(value: RangeSliderValue): never;
  onChange(value: SingleSliderValue): void;
  value: SingleSliderValue;
}

export interface UseRangeSliderProps extends UseSliderCommonProps {
  onChange(value: RangeSliderValue): void;
  onChange(value: SingleSliderValue): never;
  value: RangeSliderValue;
}

export interface UseSliderProps extends UseSliderCommonProps {
  onChange?: UseRangeSliderProps['onChange'] | UseSingleSliderProps['onChange'];
  value: SingleSliderValue | RangeSliderValue;
}

export interface UseSliderResult {
  activeHandleIndex: number | undefined;
  cssVars: Record<string, CssVarInterpolation>;
  handleClickTrackOrRail?: (e: any) => void;
  handlePress: (e: any, index?: number | undefined) => void;
  railRef: RefObject<HTMLDivElement>;
}

export function useSlider(props: UseRangeSliderProps): UseSliderResult;
export function useSlider(props: UseSingleSliderProps): UseSliderResult;
export function useSlider(props: UseSliderProps) {
  const {
    max,
    min,
    onChange,
    step,
    value,
  } = props;
  const railRef = useRef<HTMLDivElement>(null);
  const [anchorValue, setAnchorValue] = useState<number | undefined>(undefined);
  const [dragging, setDragging] = useState<boolean>(false);

  function getActiveIndex() {
    if (typeof anchorValue !== 'number') {
      return undefined;
    }

    return isRangeSlider(value) ? Math.abs(1 - value.indexOf(anchorValue)) : undefined;
  }

  const cssVars = toSliderCssVars({
    trackWidth: getPercentage(
      isRangeSlider(value) ? Math.abs(value[0] - value[1]) : value,
      min,
      max,
    ),
    trackPosition: getPercentage(
      isRangeSlider(value) ? Math.abs(Math.min(...value) - min) : 0,
      min,
      max,
    ),
    handlerPosition: getPercentage(
      isRangeSlider(value) ? 0 : value,
      min,
      max,
    ),
    handlerStartPosition: getPercentage(
      isRangeSlider(value) ? Math.abs(Math.min(...value) - min) : value,
      min,
      max,
    ),
    handlerEndPosition: getPercentage(
      isRangeSlider(value) ? Math.abs(Math.max(...value) - min) : value,
      min,
      max,
    ),
  });

  const getRoundedNewValue = (e: any, railElement: HTMLDivElement) => {
    const clientX =
      e.type === 'touchmove' ? e.changedTouches[0].clientX : e.clientX;
    const trackDims = getSliderRect(railElement);

    const newValue = getValueFromClientX(clientX, trackDims, min, max);
    const roundedNewValue = roundToStep(newValue, step, min, max);

    return roundedNewValue;
  };

  const handlePress = (e: any, index?: number) => {
    e.preventDefault();

    setDragging(true);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setAnchorValue(isRangeSlider(value) ? value[Math.abs(1 - index!)] : value);
  };

  const handleDrag = onChange ? (e: any) => {
    e.preventDefault();

    const { current: railElement } = railRef;

    if (!railElement) return;

    const roundedNewValue = getRoundedNewValue(e, railElement);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const activeIndex = getActiveIndex()!;

    if (isRangeSlider(value)) {
      const newValue: RangeSliderValue = [
        ...value.slice(0, activeIndex),
        roundedNewValue,
        ...value.slice(activeIndex + 1),
      ] as RangeSliderValue;

      onChange(sortSliderValue(newValue));

      return;
    }

    onChange(roundedNewValue);
  } : undefined;

  const handleDragEnd = (e: any) => {
    e.preventDefault();

    setDragging(false);
    setAnchorValue(undefined);
  };

  const handleClickTrackOrRail = onChange ? (e: any) => {
    setDragging(true);

    const { current: railElement } = railRef;

    if (!railElement) return;

    const roundedNewValue = getRoundedNewValue(e, railElement);
    const closetHandlerIndex = findClosetValueIndex(value, roundedNewValue);

    if (isRangeSlider(value)) {
      setAnchorValue(value[Math.abs(1 - closetHandlerIndex)]);

      const newValue: RangeSliderValue = [
        ...value.slice(0, closetHandlerIndex),
        roundedNewValue,
        ...value.slice(closetHandlerIndex + 1),
      ] as RangeSliderValue;

      onChange(
        sortSliderValue(newValue),
      );

      return;
    }

    onChange(roundedNewValue);
  } : undefined;

  useDocumentEvents(() => (
    dragging
      ? {
        mousemove: handleDrag,
        touchmove: handleDrag,
        mouseleave: handleDragEnd,
        mouseup: handleDragEnd,
        touchend: handleDragEnd,
        touchcancel: handleDragEnd,
      }
      : undefined),
  [
    dragging,
    min,
    max,
    step,
    onChange,
  ]);

  return {
    activeHandleIndex: getActiveIndex(),
    cssVars,
    handleClickTrackOrRail,
    handlePress,
    railRef,
  };
}
