<script setup lang="ts">
import { computed } from 'vue';
import type { VNodeChild } from 'vue';
import {
  getRowKey,
  tableClasses as classes,
  type TableDataSource,
} from '@mezzanine-ui/core/table';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { CloseIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznButton from '../button/button.vue';
import MznDropdown from '../dropdown/dropdown.vue';
import { useTableDataContext } from './table-data-context';
import type { TableBulkActionsProps } from './table-bulk-actions.types';

/**
 * 有列被選取時浮在表格下方的批次操作列。
 *
 * 左側是選取摘要（點一下清空選取），右側依序是主要操作、破壞性操作與收在下拉裡的其餘操作。
 * 表格捲出視窗時會切成固定定位。
 *
 * @example
 * ```vue
 * <template>
 *   <MznTableBulkActions :bulk-actions="config" :selected-row-keys="keys" @clear-selection="clear" />
 * </template>
 * ```
 *
 * @see MznTable 決定何時渲染它的元件
 */
const props = withDefaults(defineProps<TableBulkActionsProps>(), {
  isFixed: undefined,
});

const emit = defineEmits<{
  /** Fired when the summary button clears every selection. */
  clearSelection: [];
}>();

const data = useTableDataContext();

const selectedRows = computed((): TableDataSource[] =>
  data.value.dataSource.filter((record) =>
    props.selectedRowKeys.includes(getRowKey(record)),
  ),
);

const label = computed((): VNodeChild => {
  const { renderSelectionSummary } = props.bulkActions;

  if (renderSelectionSummary) {
    return renderSelectionSummary(
      props.selectedRowKeys.length,
      props.selectedRowKeys,
      selectedRows.value,
    );
  }

  return `${props.selectedRowKeys.length} item${props.selectedRowKeys.length > 1 ? 's' : ''} selected`;
});

const hostClasses = computed((): string =>
  clsx(classes.bulkActions, {
    [classes.bulkActionsFixed]: props.isFixed,
  }),
);

function handleOverflowSelect(option: DropdownOption): void {
  props.bulkActions.overflowAction?.onSelect(
    option,
    props.selectedRowKeys,
    selectedRows.value,
  );
}
</script>

<template>
  <div v-if="selectedRowKeys.length" :class="hostClasses">
    <div :class="classes.bulkActionsSelectionSummary">
      <MznButton
        icon-type="trailing"
        :icon="CloseIcon"
        size="sub"
        type="button"
        variant="inverse"
        @click="emit('clearSelection')"
      >
        <component :is="() => label" />
      </MznButton>
    </div>
    <div :class="classes.bulkActionsActionArea">
      <!-- Main Actions -->
      <MznButton
        v-for="(action, index) in bulkActions.mainActions"
        :key="`main-action-${index}`"
        icon-type="leading"
        :icon="action.icon"
        size="sub"
        type="button"
        variant="inverse-ghost"
        @click="action.onClick(selectedRowKeys, selectedRows)"
      >
        {{ action.label }}
      </MznButton>

      <!-- Destructive Action -->
      <template v-if="bulkActions.destructiveAction">
        <div :class="classes.bulkActionsSeparator" />
        <MznButton
          icon-type="leading"
          :icon="bulkActions.destructiveAction.icon"
          size="sub"
          type="button"
          variant="destructive-ghost"
          @click="
            bulkActions.destructiveAction.onClick(selectedRowKeys, selectedRows)
          "
        >
          {{ bulkActions.destructiveAction.label }}
        </MznButton>
      </template>

      <!-- Overflow Action -->
      <template v-if="bulkActions.overflowAction">
        <div :class="classes.bulkActionsSeparator" />
        <MznDropdown
          :max-height="bulkActions.overflowAction.maxHeight"
          :options="bulkActions.overflowAction.options"
          :placement="bulkActions.overflowAction.placement ?? 'top'"
          @select="handleOverflowSelect"
        >
          <template #default="triggerProps">
            <MznButton
              v-bind="triggerProps"
              size="sub"
              type="button"
              variant="inverse-ghost"
              icon-type="leading"
              :icon="bulkActions.overflowAction.icon"
            >
              {{ bulkActions.overflowAction.label }}
            </MznButton>
          </template>
        </MznDropdown>
      </template>
    </div>
  </div>
</template>
