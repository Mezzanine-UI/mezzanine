<script setup lang="ts">
import { computed } from 'vue';
import { dropdownClasses as classes } from '@mezzanine-ui/core/dropdown/dropdown';
import { CloseIcon } from '@mezzanine-ui/icons';
import { useHasListener } from '../_internal/use-has-listener';
import MznButton from '../button/button.vue';
import type { DropdownActionProps } from './dropdown-action.types';

/**
 * 下拉選單底部的操作列。
 *
 * 三種模式由「有哪些事件被監聽」決定：只監聽 `clear` 是清除模式、只監聽 `click`
 * 是自訂動作模式，其餘為預設的取消／確認模式；完全沒有監聽者則整列不渲染。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznDropdownAction } from '@mezzanine-ui/vue/dropdown';
 * <\/script>
 *
 * <template>
 *   <MznDropdownAction show-actions @cancel="onCancel" @confirm="onConfirm" />
 * </template>
 * ```
 *
 * @see MznDropdown 顯示這個操作列的元件
 */
const props = withDefaults(defineProps<DropdownActionProps>(), {
  actionText: undefined,
  cancelText: undefined,
  clearText: undefined,
  confirmText: undefined,
  customActionButtonProps: undefined,
  showActions: false,
  showTopBar: undefined,
});

const emit = defineEmits<{
  cancel: [];
  clear: [];
  click: [];
  confirm: [];
}>();

const hasListener = useHasListener();

const actionButtonSize = 'minor';

const cancelLabel = computed((): string => props.cancelText || 'Cancel');
const confirmLabel = computed((): string => props.confirmText || 'Confirm');
const actionLabel = computed((): string => props.actionText || 'Custom Action');
const clearLabel = computed((): string => props.clearText || 'Clear Options');

/**
 * Which buttons appear is decided by which events the caller listens for —
 * React reads the presence of `onCancel`, `onConfirm`, `onClick` and `onClear`
 * for exactly the same purpose.
 */
function mode(): {
  hasAnyEvent: boolean;
  hasCancel: boolean;
  hasConfirm: boolean;
  isClearMode: boolean;
  isCustomMode: boolean;
} {
  const onCancel = hasListener('cancel');
  const onConfirm = hasListener('confirm');
  const onClick = hasListener('click');
  const onClear = hasListener('clear');
  const isClearMode = Boolean(onClear && !onClick);
  const isCustomMode = Boolean(onClick && !onClear);
  const isDefaultMode = !isClearMode && !isCustomMode;

  return {
    hasAnyEvent: Boolean(onCancel || onConfirm || onClick || onClear),
    hasCancel: Boolean(onCancel && isDefaultMode),
    hasConfirm: Boolean(onConfirm && isDefaultMode),
    isClearMode,
    isCustomMode,
  };
}

const actionClass = classes.action;
const actionTopBarClass = classes.actionTopBar;
const actionToolsClass = classes.actionTools;
</script>

<template>
  <div v-if="showActions && mode().hasAnyEvent" :class="actionClass">
    <i v-if="showTopBar" :class="actionTopBarClass" />
    <div :class="actionToolsClass">
      <MznButton
        v-if="mode().hasCancel"
        :size="actionButtonSize"
        variant="base-ghost"
        @click="emit('cancel')"
      >
        {{ cancelLabel }}
      </MznButton>
      <MznButton
        v-if="mode().hasConfirm"
        :size="actionButtonSize"
        :style="mode().hasCancel ? undefined : { marginLeft: 'auto' }"
        @click="emit('confirm')"
      >
        {{ confirmLabel }}
      </MznButton>
      <MznButton
        v-if="mode().isCustomMode"
        :size="actionButtonSize"
        variant="base-ghost"
        v-bind="customActionButtonProps"
        @click="emit('click')"
        @mousedown="(event: MouseEvent) => event.preventDefault()"
      >
        {{ actionLabel }}
      </MznButton>
      <MznButton
        v-if="mode().isClearMode"
        :icon="CloseIcon"
        icon-type="leading"
        :size="actionButtonSize"
        variant="base-ghost"
        @click="emit('clear')"
      >
        {{ clearLabel }}
      </MznButton>
    </div>
  </div>
</template>
