<script setup lang="ts">
import { computed } from 'vue';
import { dropdownClasses as classes } from '@mezzanine-ui/core/dropdown/dropdown';
import { FolderOpenIcon } from '@mezzanine-ui/icons';
import MznIcon from '../icon/icon.vue';
import MznSpin from '../spin/spin.vue';
import MznTypography from '../typography/typography.vue';
import type { DropdownStatusProps } from './dropdown-status.types';

/**
 * 下拉選單的載入中／無資料狀態。
 *
 * `loading` 顯示轉圈，其餘顯示資料夾圖示；兩者的文字都可覆寫。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznDropdownStatus } from '@mezzanine-ui/vue/dropdown';
 * <\/script>
 *
 * <template>
 *   <MznDropdownStatus status="empty" empty-text="沒有符合的選項" />
 * </template>
 * ```
 *
 * @see MznDropdown 顯示這個狀態的元件
 */
const props = withDefaults(defineProps<DropdownStatusProps>(), {
  emptyIcon: undefined,
  emptyText: undefined,
  loadingText: undefined,
});

const defaultStatusText = computed((): string => {
  if (props.status === 'loading') {
    return props.loadingText ?? 'Loading...';
  }

  if (props.status === 'empty') {
    return props.emptyText ?? 'No matching options.';
  }

  return '';
});

const icon = computed(() => props.emptyIcon ?? FolderOpenIcon);

const statusClass = classes.status;
const statusTextClass = classes.statusText;
</script>

<template>
  <div :class="statusClass">
    <MznSpin v-if="status === 'loading'" loading size="minor" />
    <MznIcon v-else :icon="icon" :size="16" />
    <MznTypography :class="statusTextClass">
      {{ defaultStatusText }}
    </MznTypography>
  </div>
</template>
