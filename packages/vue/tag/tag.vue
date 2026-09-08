<script setup lang="ts">
import { computed } from 'vue';
import { tagClasses as classes } from '@mezzanine-ui/core/tag';
import { CloseIcon, PlusIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznBadge from '../badge/badge.vue';
import MznIcon from '../icon/icon.vue';
import type { TagProps } from './tag.types';

/**
 * 標籤元件，用於分類、篩選或標記內容，支援靜態、計數、可關閉及可新增四種模式。
 *
 * 透過 `type` prop 切換顯示模式：`static` 純標籤（預設）、`counter` 帶數字的標籤、
 * `dismissable` 含關閉按鈕、`addable` 含新增按鈕。`overflow-counter` 適用於收合多餘標籤並顯示剩餘數量。
 * `dismissable` 與 `addable` 模式支援 `active` 和 `disabled` 狀態；
 * `overflow-counter` 與 `addable` 渲染為 `button`，其餘為 `span`。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznTag } from '@mezzanine-ui/vue/tag';
 * <\/script>
 *
 * <template>
 *   <MznTag label="設計" type="static" />
 *   <MznTag :count="3" label="待處理" type="counter" />
 *   <MznTag label="React" type="dismissable" @close="removeTag('React')" />
 *   <MznTag label="新增標籤" type="addable" @click="handleAdd" />
 *   <MznTag :count="5" type="overflow-counter" @click="handleExpand" />
 * </template>
 * ```
 *
 * @see MznTagGroup 以群組方式管理多個標籤
 */
const props = withDefaults(defineProps<TagProps>(), {
  active: undefined,
  count: undefined,
  disabled: undefined,
  label: undefined,
  readOnly: undefined,
  size: 'main',
  type: 'static',
});

const emit = defineEmits<{
  /** Handler fired when button-based tag clicked. */
  click: [event: MouseEvent];
  /** Handler fired when the close button in dismissable tag is clicked. */
  close: [event: MouseEvent];
}>();

const hostClasses = computed((): string =>
  clsx(classes.host, classes.size(props.size), classes.type(props.type), {
    [classes.disabled]: props.disabled,
    [classes.active]: props.active,
    [classes.readOnly]: props.readOnly,
  }),
);

const isButtonHost = computed(
  (): boolean => props.type === 'overflow-counter' || props.type === 'addable',
);

const iconClass = classes.icon;
const labelClass = classes.label;
const closeButtonClass = classes.closeButton;
</script>

<template>
  <button
    v-if="isButtonHost"
    :class="hostClasses"
    :disabled="disabled"
    type="button"
    @click="emit('click', $event)"
  >
    <MznIcon :class="iconClass" :icon="PlusIcon" :size="16" />
    <span :class="labelClass">{{
      type === 'overflow-counter' ? count : label
    }}</span>
  </button>
  <span v-else :aria-disabled="disabled" :class="hostClasses">
    <span v-if="type === 'static'" :class="labelClass">{{ label }}</span>
    <template v-if="type === 'counter'">
      <span :class="labelClass">{{ label }}</span>
      <MznBadge :count="count ?? 0" variant="count-info" />
    </template>
    <template v-if="type === 'dismissable'">
      <span :class="labelClass">{{ label }}</span>
      <button
        :class="closeButtonClass"
        :disabled="disabled"
        type="button"
        @click="emit('close', $event)"
      >
        <MznIcon :class="iconClass" :icon="CloseIcon" :size="16" />
      </button>
    </template>
  </span>
</template>
