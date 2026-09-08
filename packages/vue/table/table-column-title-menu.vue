<script setup lang="ts">
import { ref } from 'vue';
import { tableClasses as classes } from '@mezzanine-ui/core/table';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { DotVerticalIcon } from '@mezzanine-ui/icons';
import MznDropdown from '../dropdown/dropdown.vue';
import MznIcon from '../icon/icon.vue';
import type { TableColumnTitleMenuProps } from './table-column-title-menu.types';

/**
 * 表頭欄位右側的選單，只有欄位給了 `titleMenu` 時才渲染。
 *
 * @example
 * ```vue
 * <template>
 *   <MznTableColumnTitleMenu :column="column" />
 * </template>
 * ```
 *
 * @see MznTableHeader 渲染它的元件
 */
const props = defineProps<TableColumnTitleMenuProps>();

const isMenuOpen = ref(false);

function handleSelect(option: DropdownOption): void {
  props.column.titleMenu?.onSelect?.(option);
  isMenuOpen.value = false;
}
</script>

<template>
  <MznDropdown
    v-if="column.titleMenu"
    :max-height="column.titleMenu.maxHeight"
    :open="isMenuOpen"
    :options="column.titleMenu.options"
    :placement="column.titleMenu.placement"
    z-index="var(--mzn-table-title-menu-z-index)"
    @select="handleSelect"
    @visibility-change="isMenuOpen = $event"
  >
    <template #default="triggerProps">
      <MznIcon
        v-bind="triggerProps"
        :class="classes.headerCellIcon"
        :icon="DotVerticalIcon"
        :size="16"
      />
    </template>
  </MznDropdown>
</template>
