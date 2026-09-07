<script setup lang="ts">
import { computed } from 'vue';
import { navigationIconButtonClasses as classes } from '@mezzanine-ui/core/navigation';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import type { NavigationIconButtonProps } from './navigation-icon-button.types';

/**
 * 側邊欄裡只有圖示的按鈕。
 *
 * 沒有文字內容，因此 `aria-label` 是輔助技術唯一能唸出來的東西。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznNavigationIconButton } from '@mezzanine-ui/vue/navigation';
 * import { QuestionOutlineIcon } from '@mezzanine-ui/icons';
 * <\/script>
 *
 * <template>
 *   <MznNavigationIconButton aria-label="說明" :icon="QuestionOutlineIcon" />
 * </template>
 * ```
 *
 * @see MznNavigationFooter 側邊欄底部放這些按鈕的地方
 */
const props = defineProps<NavigationIconButtonProps>();

/**
 * Vue camelises a declared prop's name, so what a caller writes as `aria-label`
 * arrives as `ariaLabel` at runtime even though the type spells it React's way.
 */
const ariaLabel = computed(
  (): string | undefined => (props as { ariaLabel?: string }).ariaLabel,
);

const hostClasses = computed((): string =>
  clsx(classes.host, props.active && classes.active),
);
</script>

<template>
  <button :aria-label="ariaLabel" :class="hostClasses" type="button">
    <MznIcon :icon="icon" :size="16" />
  </button>
</template>
