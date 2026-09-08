<script setup lang="ts">
import { computed, ref } from 'vue';
import type { DateType } from '@mezzanine-ui/core/calendar';
import MznInputTriggerPopper from '../_internal/input-trigger-popper.vue';
import MznTimePanel from '../time-panel/time-panel.vue';
import type { TimePickerPanelProps } from './time-picker-panel.types';

/**
 * 時間面板的浮層版本，錨定在觸發輸入框下方。
 *
 * 只是把 MznTimePanel 包進 MznInputTriggerPopper，開關與值都由呼叫端控制。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznTimePickerPanel } from '@mezzanine-ui/vue/time-picker';
 * <\/script>
 *
 * <template>
 *   <MznTimePickerPanel :anchor="anchor" :open="open" :value="value" />
 * </template>
 * ```
 *
 * @see MznTimePicker 使用這個面板的元件
 */
withDefaults(defineProps<TimePickerPanelProps>(), {
  anchor: undefined,
  fadeProps: undefined,
  hideHour: undefined,
  hideMinute: undefined,
  hideSecond: undefined,
  hourStep: undefined,
  minuteStep: undefined,
  open: undefined,
  popperProps: undefined,
  secondStep: undefined,
  value: undefined,
});

const emit = defineEmits<{
  cancel: [];
  change: [value?: DateType];
  confirm: [];
}>();

const popper = ref<InstanceType<typeof MznInputTriggerPopper> | null>(null);

/**
 * React forwards a ref to the popper element; the same element is exposed
 * here so the picker can tell a click inside the panel from one outside it.
 */
defineExpose({
  element: computed((): HTMLElement | null => popper.value?.element ?? null),
});
</script>

<template>
  <MznInputTriggerPopper
    ref="popper"
    v-bind="popperProps"
    :anchor="anchor"
    :fade-props="fadeProps"
    :open="open"
  >
    <MznTimePanel
      :hide-hour="hideHour"
      :hide-minute="hideMinute"
      :hide-second="hideSecond"
      :hour-step="hourStep"
      :minute-step="minuteStep"
      :second-step="secondStep"
      :value="value"
      @cancel="emit('cancel')"
      @change="emit('change', $event)"
      @confirm="emit('confirm')"
    />
  </MznInputTriggerPopper>
</template>
