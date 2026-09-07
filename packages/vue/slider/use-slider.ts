import { computed, ref } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import {
  findClosetValueIndex,
  fixRangeSliderValue,
  fixSingleSliderValue,
  getPercentage,
  getSliderRect,
  getValueFromClientX,
  isRangeSlider,
  roundToStep,
  sortSliderValue,
  toSliderCssVars,
} from '@mezzanine-ui/core/slider';
import type { RangeSliderValue, SliderValue } from '@mezzanine-ui/core/slider';
import type { CssVarInterpolation } from '@mezzanine-ui/system/css';
import { useDocumentEvents } from '../_internal/use-document-events';

export interface UseSliderOptions {
  /** The maximum permitted value. */
  max: () => number;
  /** The minimum permitted value. */
  min: () => number;
  /**
   * Called with the next value.
   *
   * Leaving it out makes the slider read-only: `handleClickTrackOrRail` is
   * `undefined` and dragging never writes anything back, which is what React
   * does when no `onChange` reaches it.
   */
  onChange?: (value: SliderValue) => void;
  /** The stepping interval. */
  step: () => number;
  /** The current value. A tuple renders a range, a number a single handle. */
  value: () => SliderValue;
}

export interface UseSliderResult {
  /** Index of the handle being dragged, or `undefined` when idle. */
  activeHandleIndex: ComputedRef<number | undefined>;
  /** Track / handle positions, to be written onto the root as inline styles. */
  cssVars: ComputedRef<Record<string, CssVarInterpolation>>;
  /** Bind to the rail and the track; absent when the slider is read-only. */
  handleClickTrackOrRail:
    | ((event: MouseEvent | TouchEvent) => void)
    | undefined;
  /** Bind to each handle's mouse/touch down. */
  handlePress: (event: MouseEvent | TouchEvent, index?: number) => void;
  /** The rail element, measured to translate a pointer position into a value. */
  railRef: Ref<HTMLDivElement | null>;
}

/**
 * 管理 Slider 拖曳互動與 CSS 變數計算的 composable。
 *
 * 支援單值（`SingleSliderValue`）與範圍值（`RangeSliderValue`）兩種模式，
 * 處理滑鼠／觸控拖曳事件並計算出對應的 CSS 自訂屬性供樣式使用。
 * 按住把手或點擊軌道時會在 document 上掛載拖曳監聽器，放開後移除。
 *
 * @example
 * ```ts
 * import { useSlider } from '@mezzanine-ui/vue/slider';
 *
 * const { cssVars, handlePress, handleClickTrackOrRail, railRef } = useSlider({
 *   max: () => 100,
 *   min: () => 0,
 *   onChange: (next) => emit('change', next),
 *   step: () => 1,
 *   value: () => props.value,
 * });
 * ```
 *
 * @see MznSlider 搭配的元件
 */
export function useSlider(options: UseSliderOptions): UseSliderResult {
  const { max, min, onChange, step, value } = options;
  const railRef = ref<HTMLDivElement | null>(null);
  const anchorValue = ref<number | undefined>(undefined);
  const dragging = ref(false);

  const activeHandleIndex = computed((): number | undefined => {
    const anchor = anchorValue.value;

    if (typeof anchor !== 'number') {
      return undefined;
    }

    const current = value();

    return isRangeSlider(current)
      ? Math.abs(1 - current.indexOf(anchor))
      : undefined;
  });

  const cssVars = computed((): Record<string, CssVarInterpolation> => {
    const current = value();
    const lower = min();
    const upper = max();
    const fixedValue = isRangeSlider(current)
      ? fixRangeSliderValue(current, lower, upper)
      : fixSingleSliderValue(current, lower, upper);

    return toSliderCssVars({
      trackWidth: getPercentage(
        isRangeSlider(fixedValue)
          ? Math.abs(fixedValue[0] - fixedValue[1])
          : fixedValue - lower,
        lower,
        upper,
      ),
      trackPosition: getPercentage(
        isRangeSlider(fixedValue)
          ? Math.abs(Math.min(...fixedValue) - lower)
          : 0,
        lower,
        upper,
      ),
      handlerPosition: getPercentage(
        isRangeSlider(fixedValue) ? 0 : fixedValue - lower,
        lower,
        upper,
      ),
      handlerStartPosition: getPercentage(
        isRangeSlider(fixedValue)
          ? Math.abs(Math.min(...fixedValue) - lower)
          : fixedValue,
        lower,
        upper,
      ),
      handlerEndPosition: getPercentage(
        isRangeSlider(fixedValue)
          ? Math.abs(Math.max(...fixedValue) - lower)
          : fixedValue,
        lower,
        upper,
      ),
    });
  });

  const getRoundedNewValue = (
    event: MouseEvent | TouchEvent,
    railElement: HTMLDivElement,
  ): number => {
    const clientX =
      event.type === 'touchmove'
        ? (event as TouchEvent).changedTouches[0].clientX
        : (event as MouseEvent).clientX;
    const trackDims = getSliderRect(railElement);

    const newValue = getValueFromClientX(clientX, trackDims, min(), max());
    const roundedNewValue = roundToStep(newValue, step(), min(), max());

    return roundedNewValue;
  };

  const handlePress = (
    event: MouseEvent | TouchEvent,
    index?: number,
  ): void => {
    event.preventDefault();

    const current = value();

    dragging.value = true;
    anchorValue.value = isRangeSlider(current)
      ? current[Math.abs(1 - (index as number))]
      : current;
  };

  const handleDrag = onChange
    ? (event: MouseEvent | TouchEvent): void => {
        event.preventDefault();

        const railElement = railRef.value;

        if (!railElement) return;

        const roundedNewValue = getRoundedNewValue(event, railElement);
        const activeIndex = activeHandleIndex.value as number;
        const current = value();

        if (isRangeSlider(current)) {
          const newValue = [
            ...current.slice(0, activeIndex),
            roundedNewValue,
            ...current.slice(activeIndex + 1),
          ] as RangeSliderValue;

          onChange(sortSliderValue(newValue));

          return;
        }

        onChange(roundedNewValue);
      }
    : undefined;

  const handleDragEnd = (event: MouseEvent | TouchEvent): void => {
    event.preventDefault();

    dragging.value = false;
    anchorValue.value = undefined;
  };

  const handleClickTrackOrRail = onChange
    ? (event: MouseEvent | TouchEvent): void => {
        dragging.value = true;

        const railElement = railRef.value;

        if (!railElement) return;

        const roundedNewValue = getRoundedNewValue(event, railElement);
        const current = value();
        const closetHandlerIndex = findClosetValueIndex(
          current,
          roundedNewValue,
        );

        if (isRangeSlider(current)) {
          anchorValue.value = current[Math.abs(1 - closetHandlerIndex)];

          const newValue = [
            ...current.slice(0, closetHandlerIndex),
            roundedNewValue,
            ...current.slice(closetHandlerIndex + 1),
          ] as RangeSliderValue;

          onChange(sortSliderValue(newValue));

          return;
        }

        onChange(roundedNewValue);
      }
    : undefined;

  useDocumentEvents(() =>
    dragging.value
      ? {
          mousemove: handleDrag,
          touchmove: handleDrag,
          mouseleave: handleDragEnd,
          mouseup: handleDragEnd,
          touchend: handleDragEnd,
          touchcancel: handleDragEnd,
        }
      : undefined,
  );

  return {
    activeHandleIndex,
    cssVars,
    handleClickTrackOrRail,
    handlePress,
    railRef,
  };
}
