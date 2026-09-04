<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import { inputSelectButtonClasses as classes } from '@mezzanine-ui/core/input';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import clsx from 'clsx';
import MznDropdown from '../dropdown/dropdown.vue';
import MznIcon from '../icon/icon.vue';
import MznRotate from '../transition/rotate.vue';
import type { SelectButtonProps } from './select-button.types';

/**
 * 貼在輸入框旁邊的下拉選擇按鈕。
 *
 * 目前的值會顯示在按鈕上並標記為已選；箭頭在開啟時旋轉。
 * 預設選完就關閉，`closeOnSelect` 設為 false 可留著。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznInputSelectButton } from '@mezzanine-ui/vue/input';
 * <\/script>
 *
 * <template>
 *   <MznInputSelectButton :options="options" value="TWD" @select="onSelect" />
 * </template>
 * ```
 *
 * @see MznInput `variant="select"` 會渲染這顆按鈕
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SelectButtonProps>(), {
  closeOnSelect: true,
  disabled: undefined,
  dropdownMaxHeight: 114,
  dropdownPlacement: 'bottom-start',
  dropdownWidth: 120,
  options: () => [],
  size: 'main',
  value: undefined,
});

const emit = defineEmits<{
  select: [value: string];
}>();

const attrs = useAttrs();

const open = ref(false);

function handleVisibilityChange(next: boolean): void {
  if (props.disabled && next) return;

  open.value = next;
}

function handleSelect(option: DropdownOption): void {
  emit('select', option.id);

  if (props.closeOnSelect) {
    open.value = false;
  }
}

const dropdownOptions = computed((): DropdownOption[] =>
  props.options.map((option) => ({
    ...option,
    ...(option.id === props.value ? { checkSite: 'suffix' as const } : {}),
  })),
);

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    props.disabled && classes.disabled,
    props.size === 'main' ? classes.main : classes.sub,
    attrs.class as string,
  ),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const rotateDuration = MOTION_DURATION.fast;
const rotateEasing = MOTION_EASING.standard;
const iconClass = classes.icon;
const textClass = classes.text;
</script>

<template>
  <MznDropdown
    :custom-width="dropdownWidth"
    :disabled="disabled"
    :max-height="dropdownMaxHeight"
    :open="open"
    :options="dropdownOptions"
    :placement="dropdownPlacement"
    :value="value"
    @select="handleSelect"
    @visibility-change="handleVisibilityChange"
  >
    <template #default="triggerProps">
      <button
        v-bind="{ ...forwardedAttrs, ...triggerProps }"
        :class="hostClasses"
        :disabled="disabled"
        :title="value"
        type="button"
      >
        <span :class="textClass">{{ value }}</span>
        <MznRotate :duration="rotateDuration" :easing="rotateEasing" :in="open">
          <MznIcon :class="iconClass" :icon="ChevronDownIcon" :size="16" />
        </MznRotate>
      </button>
    </template>
  </MznDropdown>
</template>
