<script setup lang="ts">
import { computed } from 'vue';
import { CloseIcon, DangerousFilledIcon } from '@mezzanine-ui/icons';
import {
  clearActionsClasses as classes,
  type ClearActionsType,
  type ClearActionsVariant,
} from '@mezzanine-ui/core/clear-actions';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import type { ClearActionsProps } from './clear-actions.types';

/**
 * 清除／關閉動作按鈕。
 *
 * `type` 決定使用情境：`standard` 為獨立按鈕、`embedded` 內嵌於其他控制項、
 * `clearable` 用於清除輸入內容（改用警示圖示）。`variant` 依 `type` 提供對應的視覺變體，
 * 未指定時 standard 取 `base`、embedded 取 `contrast`、clearable 固定為 `default`。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznClearActions } from '@mezzanine-ui/vue/clear-actions';
 * <\/script>
 *
 * <template>
 *   <MznClearActions @click="onClear" />
 *   <MznClearActions type="embedded" variant="emphasis" @click="onClear" />
 *   <MznClearActions type="clearable" @click="onClear" />
 * </template>
 * ```
 */
/**
 * No `withDefaults` here: combined with a discriminated union it makes Vue fall
 * back to `Record<string, any>` for the generated component type, which then
 * breaks `Meta<typeof …>` in the stories. React applies the same default in a
 * destructure rather than in the prop declaration, so resolving it here is the
 * closer mirror anyway.
 */
const props = defineProps<ClearActionsProps>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const type = computed((): ClearActionsType => props.type ?? 'standard');

const resolvedVariant = computed((): ClearActionsVariant => {
  if (type.value === 'clearable') return 'default';

  const variant = 'variant' in props ? props.variant : undefined;

  return variant ?? (type.value === 'standard' ? 'base' : 'contrast');
});

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    classes.type(type.value),
    classes.variant(resolvedVariant.value),
  ),
);

const icon = computed(() =>
  type.value === 'clearable' ? DangerousFilledIcon : CloseIcon,
);

const iconClass = classes.icon;
</script>

<template>
  <button
    aria-label="Close"
    :class="hostClasses"
    type="button"
    @click="emit('click', $event)"
  >
    <MznIcon :class="iconClass" :icon="icon" />
  </button>
</template>
