<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { DateType } from '@mezzanine-ui/core/calendar';
import {
  getUnits,
  timePanelClasses as classes,
  type TimePanelUnit,
} from '@mezzanine-ui/core/time-panel';
import clsx from 'clsx';
import MznCalendarFooterActions from '../calendar/calendar-footer-actions.vue';
import { useCalendarContext } from '../calendar/calendar-context';
import MznTimePanelColumn from './time-panel-column.vue';
import type { TimePanelProps } from './time-panel.types';

/**
 * 時間面板，以時、分、秒三個捲動欄位選取時間。
 *
 * 每個欄位都可以個別隱藏，步進值也可分別設定；沒有 `value` 時以今天的
 * 零點為基準套用選取的單位。底部固定是取消與確認兩顆按鈕。
 * 必須放在 MznCalendarConfigProvider 底下。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznTimePanel } from '@mezzanine-ui/vue/time-panel';
 * <\/script>
 *
 * <template>
 *   <MznTimePanel
 *     :minute-step="5"
 *     :value="value"
 *     @cancel="onCancel"
 *     @change="onChange"
 *     @confirm="onConfirm"
 *   />
 * </template>
 * ```
 *
 * @see MznCalendar 日期面板
 * @see MznCalendarConfigProvider 提供日期函式庫與語系
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TimePanelProps>(), {
  hideHour: false,
  hideMinute: false,
  hideSecond: false,
  hourStep: 1,
  minuteStep: 1,
  secondStep: 1,
  value: undefined,
});

const emit = defineEmits<{
  cancel: [];
  change: [target: DateType];
  confirm: [];
}>();

const calendar = useCalendarContext();
const attrs = useAttrs();

const hourUnits = computed((): TimePanelUnit[] | undefined =>
  props.hideHour ? undefined : getUnits(0, 23, props.hourStep),
);

const minuteUnits = computed((): TimePanelUnit[] | undefined =>
  props.hideMinute ? undefined : getUnits(0, 59, props.minuteStep),
);

const secondUnits = computed((): TimePanelUnit[] | undefined =>
  props.hideSecond ? undefined : getUnits(0, 59, props.secondStep),
);

const activeHour = computed((): number | undefined =>
  props.value ? calendar.value.getHour(props.value) : undefined,
);

const activeMinute = computed((): number | undefined =>
  props.value ? calendar.value.getMinute(props.value) : undefined,
);

const activeSecond = computed((): number | undefined =>
  props.value ? calendar.value.getSecond(props.value) : undefined,
);

function handleChange(
  granularity: 'hour' | 'minute' | 'second',
  target: TimePanelUnit,
): void {
  const { getNow, setHour, setMinute, setSecond, startOf } = calendar.value;
  const setter = { hour: setHour, minute: setMinute, second: setSecond }[
    granularity
  ];
  const currentValue = props.value || startOf(getNow(), 'day');

  emit('change', setter(currentValue, target.value));
}

const actions = computed(() => ({
  secondaryButtonProps: {
    children: 'Cancel',
    onClick: () => emit('cancel'),
  },
  primaryButtonProps: {
    children: 'Ok',
    onClick: () => emit('confirm'),
  },
}));

const hostClasses = computed((): string =>
  clsx(classes.host, attrs.class as string),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const columnsClass = classes.columns;
</script>

<template>
  <div v-bind="forwardedAttrs" :class="hostClasses">
    <div :class="columnsClass">
      <MznTimePanelColumn
        v-if="!hideHour && hourUnits"
        :active-unit="activeHour"
        :units="hourUnits"
        @change="handleChange('hour', $event)"
      />
      <MznTimePanelColumn
        v-if="!hideMinute && minuteUnits"
        :active-unit="activeMinute"
        :units="minuteUnits"
        @change="handleChange('minute', $event)"
      />
      <MznTimePanelColumn
        v-if="!hideSecond && secondUnits"
        :active-unit="activeSecond"
        :units="secondUnits"
        @change="handleChange('second', $event)"
      />
    </div>
    <MznCalendarFooterActions :actions="actions" />
  </div>
</template>
