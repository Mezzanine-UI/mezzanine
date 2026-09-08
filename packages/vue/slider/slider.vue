<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { ComponentPublicInstance, CSSProperties } from 'vue';
import {
  fixRangeSliderValue,
  fixSingleSliderValue,
  isRangeSlider,
  roundToStep,
  sliderClasses as classes,
  sortSliderValue,
} from '@mezzanine-ui/core/slider';
import type { RangeSliderValue } from '@mezzanine-ui/core/slider';
import { spacingPrefix } from '@mezzanine-ui/system/spacing';
import clsx from 'clsx';
import { resolveNumericCSSVariable } from '../_internal/css-variable';
import { useHasListener } from '../_internal/use-has-listener';
import MznIcon from '../icon/icon.vue';
import MznInput from '../input/input.vue';
import type { InputProps } from '../input/input.types';
import MznTooltip from '../tooltip/tooltip.vue';
import type { PopperOptions } from '../popper/popper.types';
import MznTypography from '../typography/typography.vue';
import { useSlider } from './use-slider';
import type { SliderProps } from './slider.types';

/**
 * 滑桿元件，值的型別決定渲染出單一把手還是範圍。
 *
 * 完全受控：`value` 一定要給，並且以 `change` 把新值寫回。給 `withInput` 會在
 * 兩側加上數字輸入框（範圍模式兩個、單值模式一個），給 `prefixIcon` 與
 * `suffixIcon` 則加上可點擊的加減圖示；沒有另外監聽 `prefix-icon-click` /
 * `suffix-icon-click` 時，圖示預設就是以 `step` 增減。`withTick` 可標出刻度，
 * 給數字表示等分、給陣列表示實際的值。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue';
 * import { MznSlider } from '@mezzanine-ui/vue/slider';
 * import { MinusIcon, PlusIcon } from '@mezzanine-ui/icons';
 *
 * const value = ref(30);
 * const range = ref<[number, number]>([10, 50]);
 * <\/script>
 *
 * <template>
 *   <MznSlider :value="value" with-input @change="value = $event" />
 *   <MznSlider
 *     :prefix-icon="MinusIcon"
 *     :suffix-icon="PlusIcon"
 *     :value="range"
 *     @change="range = $event"
 *   />
 *   <MznSlider :value="value" :with-tick="3" @change="value = $event" />
 * </template>
 * ```
 *
 * @see useSlider 拖曳與 CSS 變數的 composable
 * @see MznInput withInput 用到的輸入框
 */
const props = withDefaults(defineProps<SliderProps>(), {
  disabled: undefined,
  max: 100,
  min: 0,
  prefixIcon: undefined,
  step: 1,
  suffixIcon: undefined,
  withInput: undefined,
  withTick: undefined,
});

const emit = defineEmits<{
  change: [value: number | RangeSliderValue];
  prefixIconClick: [];
  suffixIconClick: [];
}>();

const hasListener = useHasListener();

const {
  activeHandleIndex,
  cssVars,
  handleClickTrackOrRail,
  handlePress,
  railRef,
} = useSlider({
  max: () => props.max,
  min: () => props.min,
  onChange: (next) => emit('change', next as number | RangeSliderValue),
  step: () => props.step,
  value: () => props.value,
});

const isRange = computed((): boolean => isRangeSlider(props.value));

/**
 * React branches on the handler prop being present; Vue has to ask whether the
 * consumer attached a listener, and has to ask afresh on every render.
 */
function changeable(): boolean {
  return hasListener('change');
}

function iconClickable(): boolean {
  return !props.disabled && changeable();
}

function shouldHaveInputHandlers(): boolean {
  return Boolean(props.withInput) && changeable() && !props.disabled;
}

const startInputValue = ref(
  isRangeSlider(props.value) ? `${props.value[0]}` : '',
);
const endInputValue = ref(
  isRangeSlider(props.value) ? `${props.value[1]}` : `${props.value}`,
);

watch([() => props.min, () => props.max, () => props.value], () => {
  const { max, min, value } = props;

  if (max <= min) return;

  if (isRangeSlider(value)) {
    if (
      (value[0] > max && value[1] > max) ||
      (value[0] < min && value[1] < min) ||
      value[0] < min ||
      value[1] > max
    ) {
      emit('change', fixRangeSliderValue(value, min, max));
    }

    return;
  }

  if (value < min || value > max) {
    emit('change', fixSingleSliderValue(value, min, max));
  }
});

watch([() => props.value, () => props.withInput], () => {
  const { value, withInput } = props;

  if (!withInput) return;

  if (isRangeSlider(value)) {
    startInputValue.value = `${value[0]}`;
    endInputValue.value = `${value[1]}`;

    return;
  }

  endInputValue.value = value.toString();
});

function preventValueOverflow(target: number): number {
  const { max, min, step } = props;

  if (target > max) {
    return max;
  }

  if (target < min) {
    return min;
  }

  return roundToStep(target, step, min, max);
}

function handleIconKeydown(event: KeyboardEvent, handler: () => void): void {
  if (!iconClickable()) return;

  if (event.key === 'Enter') {
    handler();

    return;
  }

  if (event.key === ' ') {
    event.preventDefault();
    handler();
  }
}

function handlePrefixIconClick(): void {
  if (!iconClickable()) return;

  if (hasListener('prefixIconClick')) {
    emit('prefixIconClick');

    return;
  }

  const { step, value } = props;

  if (isRangeSlider(value)) {
    emit('change', [preventValueOverflow(value[0] - step), value[1]]);
  } else {
    emit('change', preventValueOverflow(value - step));
  }
}

function handleSuffixIconClick(): void {
  if (!iconClickable()) return;

  if (hasListener('suffixIconClick')) {
    emit('suffixIconClick');

    return;
  }

  const { step, value } = props;

  if (isRangeSlider(value)) {
    emit('change', [value[0], preventValueOverflow(value[1] + step)]);
  } else {
    emit('change', preventValueOverflow(value + step));
  }
}

function handlePrefixIconKeydown(event: KeyboardEvent): void {
  handleIconKeydown(event, handlePrefixIconClick);
}

function handleSuffixIconKeydown(event: KeyboardEvent): void {
  handleIconKeydown(event, handleSuffixIconClick);
}

function handleTrackOrRailMousedown(event: MouseEvent): void {
  if (!changeable()) return;

  handleClickTrackOrRail?.(event);
}

function onStartInputChange(event: Event): void {
  if (!shouldHaveInputHandlers()) return;

  startInputValue.value = (event.target as HTMLInputElement).value;
}

function onEndInputChange(event: Event): void {
  if (!shouldHaveInputHandlers()) return;

  endInputValue.value = (event.target as HTMLInputElement).value;
}

function onStartInputBlur(): void {
  const { value } = props;

  if (!isRangeSlider(value)) return;

  emit(
    'change',
    sortSliderValue([
      value[1],
      preventValueOverflow(Number(startInputValue.value)),
    ]),
  );
}

function onEndInputBlur(): void {
  const { value } = props;

  if (isRangeSlider(value)) {
    emit(
      'change',
      sortSliderValue([
        value[0],
        preventValueOverflow(Number(endInputValue.value)),
      ]),
    );

    return;
  }

  emit('change', preventValueOverflow(Number(endInputValue.value)));
}

function onStartInputKeydown(event: KeyboardEvent): void {
  const { value } = props;

  if (!isRangeSlider(value)) return;

  switch (event.code) {
    case 'Enter': {
      const result = sortSliderValue([
        value[1],
        preventValueOverflow(Number(startInputValue.value)),
      ]);

      startInputValue.value = result[0].toString();
      endInputValue.value = result[1].toString();
      emit('change', result);

      break;
    }

    case 'Escape': {
      startInputValue.value = value[0].toString();
      endInputValue.value = value[1].toString();

      break;
    }

    default:
      break;
  }
}

function onEndInputKeydown(event: KeyboardEvent): void {
  const { value } = props;

  switch (event.code) {
    case 'Enter': {
      if (isRangeSlider(value)) {
        const result = sortSliderValue([
          value[0],
          preventValueOverflow(Number(endInputValue.value)),
        ]);

        startInputValue.value = result[0].toString();
        endInputValue.value = result[1].toString();
        emit('change', result);

        return;
      }

      const result = preventValueOverflow(Number(endInputValue.value));

      endInputValue.value = result.toString();
      emit('change', result);

      break;
    }

    case 'Escape': {
      if (isRangeSlider(value)) {
        startInputValue.value = value[0].toString();
        endInputValue.value = value[1].toString();

        return;
      }

      endInputValue.value = value.toString();

      break;
    }

    default:
      break;
  }
}

function startInputProps(): InputProps['inputProps'] {
  const enabled = shouldHaveInputHandlers() && isRange.value;

  return {
    max: props.max,
    min: props.min,
    onBlur: enabled ? onStartInputBlur : undefined,
    onKeydown: enabled ? onStartInputKeydown : undefined,
  };
}

function endInputProps(): InputProps['inputProps'] {
  const enabled = shouldHaveInputHandlers();

  return {
    max: props.max,
    min: props.min,
    onBlur: enabled ? onEndInputBlur : undefined,
    onKeydown: enabled ? onEndInputKeydown : undefined,
  };
}

interface SliderTick {
  percent: number;
  text: number;
}

const ticks = computed((): SliderTick[] => {
  const { max, min, withTick } = props;

  if (!withTick) return [];

  const marks: SliderTick[] = [{ percent: 0, text: min }];

  if (Array.isArray(withTick)) {
    withTick.forEach((tick) => {
      if (tick < max && tick > min) {
        marks.push({
          percent: ((tick - min) / (max - min)) * 100,
          text: tick,
        });
      }
    });
  } else {
    Array.from({ length: withTick }, (_, index) => index + 1).forEach(
      (tick) => {
        marks.push({
          percent: (tick / (withTick + 1)) * 100,
          text: (tick / (withTick + 1)) * (max - min) + min,
        });
      },
    );
  }

  marks.push({ percent: 100, text: max });

  return marks;
});

interface SliderHandle {
  index: number;
  value: number;
}

const handles = computed((): SliderHandle[] => {
  const { value } = props;

  return isRangeSlider(value)
    ? [
        { index: 0, value: value[0] },
        { index: 1, value: value[1] },
      ]
    : [{ index: -1, value }];
});

const hostClasses = computed((): string =>
  clsx(classes.host, props.disabled && classes.disabled),
);

/**
 * The track and handle positions are custom properties, which Vue's
 * `CSSProperties` only types under a `--${string}` key. They are written by
 * `toSliderCssVars` and always carry that prefix.
 */
const hostStyle = computed((): CSSProperties => cssVars.value as CSSProperties);

/**
 * A function ref rather than the ref object: a template unwraps a `Ref`, so
 * binding it directly would hand the element's own value back to Vue.
 */
const setRail = (element: Element | ComponentPublicInstance | null): void => {
  railRef.value = element as HTMLDivElement | null;
};

const handlePositionClasses = (index: number): string =>
  clsx(
    classes.handlerPosition,
    index === 0 && classes.handlerStartPosition,
    index === 1 && classes.handlerEndPosition,
  );

const handlerClasses = (index: number): string =>
  clsx(
    classes.handler,
    index === activeHandleIndex.value && classes.handlerActive,
  );

const tickStyle = (percent: number): CSSProperties => ({ left: `${percent}%` });

const CLICKABLE_ICON_STYLE: CSSProperties = { cursor: 'pointer' };

const TOOLTIP_OPTIONS: PopperOptions = { placement: 'top' };

/**
 * Compensate for the handler circle expanding into the outer hit-target div on
 * hover. handler div = size-element-relaxed (24px), circle at rest =
 * size-element-base (16px), so the circle top is (24-16)/2 = 4px inside the div
 * top — add 4px so the visual gap stays at least gap-base.
 */
const handlerTooltipExtraOffset =
  (resolveNumericCSSVariable(`--${spacingPrefix}-size-element-relaxed`) -
    resolveNumericCSSVariable(`--${spacingPrefix}-size-element-base`)) /
  2;

const handlerTooltipOffsetMainAxis =
  resolveNumericCSSVariable(`--${spacingPrefix}-gap-base`) +
  handlerTooltipExtraOffset;

const controlsClass = classes.controls;
const handlerTooltipClass = classes.handlerTooltip;
const iconClass = classes.icon;
const inputClass = classes.input;
const railClass = classes.rail;
const tickClass = classes.tick;
const trackClass = classes.track;
</script>

<template>
  <div :class="hostClasses" :style="hostStyle">
    <MznInput
      v-if="withInput && isRange"
      :class="inputClass"
      :disabled="disabled || undefined"
      :input-props="startInputProps()"
      :value="startInputValue"
      variant="number"
      @change="onStartInputChange"
    />
    <span
      v-if="prefixIcon"
      :aria-label="iconClickable() ? 'Decrease value' : undefined"
      :class="iconClass"
      :role="iconClickable() ? 'button' : undefined"
      :style="iconClickable() ? CLICKABLE_ICON_STYLE : undefined"
      :tabindex="iconClickable() ? 0 : undefined"
      @click="handlePrefixIconClick"
      @keydown="handlePrefixIconKeydown"
    >
      <MznIcon :icon="prefixIcon" />
    </span>
    <div :class="controlsClass">
      <!-- interactive area -->
      <div
        :ref="setRail"
        :class="railClass"
        role="presentation"
        @mousedown="handleTrackOrRailMousedown"
      >
        <!-- line -->
        <span />
      </div>
      <div
        :class="trackClass"
        role="presentation"
        @mousedown="handleTrackOrRailMousedown"
      >
        <!-- line -->
        <span />
      </div>
      <!-- ticks dot and label -->
      <span
        v-for="tick in ticks"
        :key="tick.text"
        aria-hidden="true"
        :class="tickClass"
        :style="tickStyle(tick.percent)"
      >
        <MznTypography variant="caption">{{ tick.text }}</MznTypography>
      </span>
      <!-- handlers -->
      <div
        v-for="handle in handles"
        :key="handle.index"
        :class="handlePositionClasses(handle.index)"
      >
        <MznTooltip
          :class="handlerTooltipClass"
          :offset-main-axis="handlerTooltipOffsetMainAxis"
          :options="TOOLTIP_OPTIONS"
          :title="handle.value.toString()"
        >
          <template #default="tooltipProps">
            <div
              :ref="tooltipProps.ref"
              :aria-disabled="disabled"
              :aria-label="`Slider Handler ${handle.index}`"
              :aria-valuemax="max"
              :aria-valuemin="min"
              :aria-valuenow="handle.value"
              :class="handlerClasses(handle.index)"
              role="slider"
              tabindex="0"
              @mousedown="handlePress($event, handle.index)"
              @mouseenter="tooltipProps.onMouseenter"
              @mouseleave="tooltipProps.onMouseleave"
              @touchstart="handlePress($event, handle.index)"
            >
              <!-- handler circle icon -->
              <span />
            </div>
          </template>
        </MznTooltip>
      </div>
    </div>
    <MznInput
      v-if="withInput"
      :class="inputClass"
      :disabled="disabled || undefined"
      :input-props="endInputProps()"
      :value="endInputValue"
      variant="number"
      @change="onEndInputChange"
    />
    <span
      v-if="suffixIcon"
      :aria-label="iconClickable() ? 'Increase value' : undefined"
      :class="iconClass"
      :role="iconClickable() ? 'button' : undefined"
      :style="iconClickable() ? CLICKABLE_ICON_STYLE : undefined"
      :tabindex="iconClickable() ? 0 : undefined"
      @click="handleSuffixIconClick"
      @keydown="handleSuffixIconKeydown"
    >
      <MznIcon :icon="suffixIcon" />
    </span>
  </div>
</template>
