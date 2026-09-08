<script setup lang="ts" generic="T extends TableDataSource = TableDataSource">
import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import type { ComponentPublicInstance, CSSProperties } from 'vue';
import {
  COLLECTABLE_COLUMN_WIDTH,
  COLLECTABLE_KEY,
  tableClasses as classes,
  TABLE_ACTIONS_KEY,
  TOGGLEABLE_COLUMN_WIDTH,
  TOGGLEABLE_KEY,
  type TableBulkActions as TableBulkActionsConfig,
  type TableDataSource,
  type TableRowSelectionCheckbox,
} from '@mezzanine-ui/core/table';
import { spacingPrefix } from '@mezzanine-ui/system/spacing';
import throttle from 'lodash/throttle';
import { getNumericCSSVariablePixelValue } from '../_internal/css-variable';
import MznScrollbar from '../scrollbar/scrollbar.vue';
import MznTableBody from './table-body.vue';
import MznTableBulkActions from './table-bulk-actions.vue';
import MznTableColGroup from './table-col-group.vue';
import MznTableHeader from './table-header.vue';
import MznTablePagination from './table-pagination.vue';
import { provideTableContext } from './table-context';
import type { TableContextValue } from './table-context';
import { provideTableDataContext } from './table-data-context';
import { provideTableSuperContext } from './table-super-context';
import {
  TABLE_DRAG_HANDLE_DESCRIPTION,
  TABLE_DRAG_VISUALLY_HIDDEN,
  useTableDragAndDrop,
} from './use-table-drag-and-drop';
import { useTableExpansion } from './use-table-expansion';
import { useTableFixedOffsets } from './use-table-fixed-offsets';
import { useTableResizedColumns } from './use-table-resized-columns';
import { useTableScroll } from './use-table-scroll';
import { useTableSelection } from './use-table-selection';
import { useTableSorting } from './use-table-sorting';
import type { ActionColumnConfig } from './table-hooks.types';
import type { TableColumn, TableProps } from './table.types';

/**
 * 資料表格元件，支援排序、選取、展開、虛擬捲動與拖曳排序等功能。
 *
 * 透過 `columns` 定義欄位結構，`dataSource` 傳入資料列；可搭配 `rowSelection`
 * 啟用勾選功能、`expandable` 展開子列、`scroll.virtualized` 開啟虛擬捲動以渲染大量資料。
 * `draggable` 與 `pinnable` 為互斥選項，無法同時啟用。
 *
 * 所有回呼都在設定物件裡，因此這個元件**沒有任何 emit** —— 與 React 端一致。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznTable } from '@mezzanine-ui/vue/table';
 *
 * const columns = [{ dataIndex: 'name', key: 'name', title: 'Name' }];
 * const dataSource = [{ key: '1', name: 'Mezzanine' }];
 * <\/script>
 *
 * <template>
 *   <MznTable :columns="columns" :data-source="dataSource" />
 * </template>
 * ```
 *
 * @see MznTableRow 每一列
 * @see useTableDataSource 讓新增與刪除帶動畫的資料來源
 */
const props = withDefaults(defineProps<TableProps<T>>(), {
  actions: undefined,
  collectable: undefined,
  draggable: undefined,
  emptyProps: undefined,
  expandable: undefined,
  fullWidth: false,
  highlight: 'row',
  loading: false,
  loadingRowsCount: 10,
  minHeight: undefined,
  nested: false,
  pagination: undefined,
  pinnable: undefined,
  resizable: false,
  rowHeightPreset: 'base',
  rowSelection: undefined,
  rowState: undefined,
  scroll: undefined,
  separatorAtRowIndexes: undefined,
  showHeader: true,
  size: 'main',
  sticky: true,
  toggleable: undefined,
  transitionState: undefined,
  zebraStriping: undefined,
});

const hostRef = shallowRef<HTMLDivElement | null>(null);
const paginationRef = shallowRef<ComponentPublicInstance | null>(null);

/** Feature: Row Height Preset */
const rowHeightVariableName = computed((): string => {
  switch (props.rowHeightPreset) {
    case 'condensed':
      return props.size === 'main'
        ? `--${spacingPrefix}-size-container-condensed`
        : `--${spacingPrefix}-size-container-reduced`;
    case 'detailed':
      return props.size === 'main'
        ? `--${spacingPrefix}-size-container-tiny`
        : `--${spacingPrefix}-size-container-tightened`;
    case 'roomy':
      return props.size === 'main'
        ? `--${spacingPrefix}-size-container-small`
        : `--${spacingPrefix}-size-container-medium`;
    case 'base':
    default:
      return props.size === 'main'
        ? `--${spacingPrefix}-size-container-minimized`
        : `--${spacingPrefix}-size-container-minimal`;
  }
});

const rowHeight = shallowRef<number | undefined>(undefined);

watch(
  rowHeightVariableName,
  (name) => {
    rowHeight.value = getNumericCSSVariablePixelValue(name);
  },
  { flush: 'post', immediate: true },
);

/** Feature: Highlight */
const hoveredRowIndex = shallowRef<number | null>(null);
const hoveredColumnIndex = shallowRef<number | null>(null);

const setHoveredCell = (
  rowIndex: number | null,
  columnIndex: number | null,
): void => {
  hoveredRowIndex.value = rowIndex;
  hoveredColumnIndex.value = columnIndex;
};

/** Feature: Actions column */
const columnsWithRightControls = computed((): TableColumn<T>[] => {
  const { actions, collectable, columns, toggleable } = props;
  const result = [...columns];

  // Add toggleable column (rightControl area - after data columns)
  if (toggleable?.enabled) {
    result.push({
      align: toggleable.align ?? 'start',
      ellipsis: false,
      fixed: toggleable.fixed ? 'end' : undefined,
      key: TOGGLEABLE_KEY,
      render: () => null, // Placeholder, actual rendering is handled in MznTableRow
      title: toggleable.title,
      width: toggleable.minWidth ?? TOGGLEABLE_COLUMN_WIDTH,
      minWidth: toggleable.minWidth ?? TOGGLEABLE_COLUMN_WIDTH,
    } as TableColumn<T>);
  }

  // Add collectable column (rightControl area - after toggleable)
  if (collectable?.enabled) {
    result.push({
      align: collectable.align ?? 'start',
      ellipsis: false,
      fixed: collectable.fixed ? 'end' : undefined,
      key: COLLECTABLE_KEY,
      render: () => null, // Placeholder, actual rendering is handled in MznTableRow
      title: collectable.title,
      width: collectable.minWidth ?? COLLECTABLE_COLUMN_WIDTH,
      minWidth: collectable.minWidth ?? COLLECTABLE_COLUMN_WIDTH,
    } as TableColumn<T>);
  }

  // Add actions column (rightmost)
  if (actions) {
    result.push({
      ...actions,
      align: actions.align ?? 'end',
      ellipsis: false,
      key: TABLE_ACTIONS_KEY,
      render: () => null, // Placeholder, actual rendering is handled in MznTableRow
    } as TableColumn<T>);
  }

  return result;
});

/** Feature: sorting */
const sortingState = useTableSorting<T>({ columns: () => props.columns });

/** Feature: Row selection */
const selectionState = useTableSelection<T>({
  dataSource: () => props.dataSource,
  rowSelection: () => props.rowSelection,
});

/** Feature: Expansion */
const expansionState = useTableExpansion<T>({
  expandable: () => props.expandable,
  hasDragOrPinHandle: () =>
    Boolean(props.draggable?.enabled) || Boolean(props.pinnable?.enabled),
});

/** Feature: Column resized */
const columnState = useTableResizedColumns();

/** Feature: Scroll and dimensions calculation */
const {
  containerRef: scrollContainerRef,
  containerWidth,
  handleScrollbarScroll,
  handleViewportReady,
  isContainerReady,
  isScrollingHorizontally,
  scrollLeft,
} = useTableScroll({ enabled: () => !props.nested });

const virtualScrollEnabled = computed((): boolean =>
  Boolean(props.scroll?.virtualized && props.scroll?.y),
);

/** Feature: Column fixed */
const actionConfig = computed((): ActionColumnConfig => {
  const {
    collectable,
    draggable,
    expandable,
    pinnable,
    rowSelection,
    toggleable,
  } = props;

  return {
    hasDragOrPinHandle:
      Boolean(draggable?.enabled) || Boolean(pinnable?.enabled),
    dragOrPinHandleFixed: Boolean(draggable?.fixed) || Boolean(pinnable?.fixed),
    dragOrPinHandleType: draggable?.enabled
      ? ('drag' as const)
      : pinnable?.enabled
        ? ('pin' as const)
        : undefined,
    hasExpansion: Boolean(expandable),
    expansionFixed: Boolean(expandable?.fixed),
    hasSelection: Boolean(rowSelection),
    selectionFixed: Boolean(rowSelection?.fixed),
    hasToggleable: Boolean(toggleable?.enabled),
    toggleableMinWidth: toggleable?.minWidth ?? TOGGLEABLE_COLUMN_WIDTH,
    toggleableFixed: Boolean(toggleable?.fixed),
    hasCollectable: Boolean(collectable?.enabled),
    collectableMinWidth: collectable?.minWidth ?? COLLECTABLE_COLUMN_WIDTH,
    collectableFixed: Boolean(collectable?.fixed),
  };
});

const fixedOffsetsState = useTableFixedOffsets({
  actionConfig: () => actionConfig.value,
  columns: () => columnsWithRightControls.value as TableColumn[],
  getResizedColumnWidth: columnState.getResizedColumnWidth,
});

/** Feature: Drag n Drop */
const { announcementId, droppable, hiddenTextId, message } =
  useTableDragAndDrop({
    dataSource: () => props.dataSource,
    draggable: () => props.draggable,
  });

/** Context values */
provideTableContext<T>(
  computed(
    (): TableContextValue<T> => ({
      actions: props.actions,
      collectable: props.collectable,
      columnState,
      dataSource: props.dataSource,
      draggable: props.draggable,
      emptyProps: props.emptyProps,
      expansion: expansionState.value,
      fixedOffsets: fixedOffsetsState.value,
      highlight: {
        columnIndex: hoveredColumnIndex.value,
        mode: props.highlight,
        rowIndex: hoveredRowIndex.value,
        setHoveredCell,
      },
      isContainerReady: isContainerReady.value,
      isInsideExpandedContentArea: props.nested,
      isScrollingHorizontally: isScrollingHorizontally.value,
      loading: props.loading,
      loadingRowsCount: props.loadingRowsCount,
      pagination: props.pagination || undefined,
      pinnable: props.pinnable as TableContextValue<T>['pinnable'],
      resizable: props.resizable,
      rowState: props.rowState as TableContextValue<T>['rowState'],
      rowHeight: rowHeight.value,
      scroll: props.scroll,
      scrollContainerRef,
      selection: selectionState.value,
      separatorAtRowIndexes: props.separatorAtRowIndexes,
      size: props.size,
      sorting: sortingState,
      toggleable: props.toggleable,
      transitionState: props.transitionState,
      virtualScrollEnabled: virtualScrollEnabled.value,
      zebraStriping: props.zebraStriping,
    }),
  ),
);

provideTableDataContext<T>(
  computed(() => ({
    columns: columnsWithRightControls.value,
    dataSource: props.dataSource,
  })),
);

/**
 * React wraps only the non-nested table in its super provider, so a nested one
 * keeps reading the outer table's measurements.
 */
if (!props.nested) {
  provideTableSuperContext(
    computed(() => ({
      containerWidth: containerWidth.value,
      getResizedColumnWidth: columnState.getResizedColumnWidth,
      scrollLeft: scrollLeft.value,
      expansionLeftPadding: expansionState.value?.expansionLeftPadding ?? 0,
      hasDragOrPinHandleFixed:
        (Boolean(props.draggable?.enabled) &&
          Boolean(props.draggable?.fixed)) ||
        (Boolean(props.pinnable?.enabled) && Boolean(props.pinnable?.fixed)),
    })),
  );
}

/** Computed styles */
const scrollContainerStyle = computed((): CSSProperties => {
  const style: CSSProperties = {};

  if (props.minHeight) {
    style.minHeight =
      typeof props.minHeight === 'number'
        ? `${props.minHeight}px`
        : props.minHeight;
  }

  return style;
});

const tableStyle = computed((): CSSProperties => {
  const style: CSSProperties = {};

  if (props.fullWidth) {
    style.width = '100%';
  }

  return style;
});

const tableClassName = computed(
  (): string =>
    `${classes.root} ${props.size === 'sub' ? classes.sub : classes.main}`,
);

// Scrollbar events for OverlayScrollbars
const scrollbarEvents = computed(() => ({ scroll: handleScrollbarScroll }));

/** Feature: bulk actions */
const bulkActionsConfig = computed(() => {
  const selection = selectionState.value;

  if (!selection || selection.mode !== 'checkbox') {
    return null;
  }

  const checkboxConfig = selection.config as TableRowSelectionCheckbox<T>;

  return {
    enabled:
      Boolean(checkboxConfig.bulkActions) && selection.selectedRowKeys.length,
    bulkActions: checkboxConfig.bulkActions as
      | TableBulkActionsConfig
      | undefined,
    onClearSelection: () => checkboxConfig.onChange([], null, []),
    selectedRowKeys: selection.selectedRowKeys,
  };
});

const isBulkActionsFixed = shallowRef(false);

watch(
  () => Boolean(bulkActionsConfig.value?.enabled),
  (enabled, _previous, onCleanup) => {
    if (!enabled) return;

    const calculateFixedState = (): void => {
      const hostEl = hostRef.value;

      if (!hostEl) return;

      const hostRect = hostEl.getBoundingClientRect();
      const paginationHeightWithPx = hostEl.style.getPropertyValue(
        '--mzn-table-pagination-height',
      );

      const paginationHeight = paginationHeightWithPx
        ? Number(paginationHeightWithPx.replace('px', ''))
        : 0;

      const viewportHeight = window.innerHeight;

      const bottomSpacing = getNumericCSSVariablePixelValue(
        `--${spacingPrefix}-padding-vertical-relaxed`,
      );

      const bulkActionsFixedBottom = viewportHeight - bottomSpacing;

      const shouldBeFixed =
        hostRect.bottom > viewportHeight + paginationHeight &&
        hostRect.top < bulkActionsFixedBottom;

      isBulkActionsFixed.value = shouldBeFixed;

      if (shouldBeFixed) {
        /** Table 不一定在 viewport 中間 */
        const centerLeft = hostRect.left + hostRect.width / 2;

        hostEl.style.setProperty(
          '--mzn-bulk-actions-fixed-left',
          `${centerLeft}px`,
        );
      }
    };

    /** @NOTE 如果覺得位置更新的不夠即時，再把 throttle 拔掉 (目前先以減少觸發次數做效能優化) */
    const throttledCalculateFixedState = throttle(calculateFixedState, 50);

    calculateFixedState();

    window.addEventListener('scroll', throttledCalculateFixedState, false);
    window.addEventListener('resize', throttledCalculateFixedState, false);

    onCleanup(() => {
      throttledCalculateFixedState.cancel();
      window.removeEventListener('scroll', throttledCalculateFixedState, false);
      window.removeEventListener('resize', throttledCalculateFixedState, false);
    });
  },
  { flush: 'post', immediate: true },
);

/** Get Dynamic Pagination Height */
let paginationObserver: ResizeObserver | null = null;

onMounted(() => {
  const paginationEl = paginationRef.value?.$el as HTMLElement | undefined;

  if (!paginationEl) return;

  paginationObserver = new ResizeObserver(() => {
    hostRef.value?.style.setProperty(
      '--mzn-table-pagination-height',
      `${paginationEl.offsetHeight}px`,
    );
  });

  paginationObserver.observe(paginationEl);
});

onBeforeUnmount(() => {
  paginationObserver?.disconnect();
  paginationObserver = null;
});

const handleScrollbarViewportReady = (viewport: HTMLDivElement): void => {
  handleViewportReady(viewport);
  droppable.value.innerRef(viewport);
};
</script>

<template>
  <div ref="hostRef" :class="classes.host">
    <MznScrollbar
      v-bind="nested ? {} : droppable.droppableProps"
      :class="sticky ? classes.sticky : undefined"
      :defer="false"
      :disabled="nested"
      :events="scrollbarEvents"
      :max-height="scroll?.y"
      :style="scrollContainerStyle"
      @viewport-ready="handleScrollbarViewportReady"
    >
      <table :class="tableClassName" :style="tableStyle">
        <MznTableColGroup />
        <MznTableHeader v-if="showHeader" />
        <MznTableBody />
        <tbody v-if="!nested && droppable.placeholder" />
      </table>
    </MznScrollbar>
    <Teleport v-if="!nested" to="body">
      <div
        :id="announcementId"
        aria-atomic="true"
        aria-live="assertive"
        :style="TABLE_DRAG_VISUALLY_HIDDEN"
      >
        {{ message }}
      </div>
      <div :id="hiddenTextId" :style="{ display: 'none' }">
        {{ TABLE_DRAG_HANDLE_DESCRIPTION }}
      </div>
    </Teleport>
    <MznTablePagination
      v-if="pagination"
      ref="paginationRef"
      v-bind="pagination"
    />
    <MznTableBulkActions
      v-if="bulkActionsConfig?.enabled && bulkActionsConfig.bulkActions"
      :bulk-actions="bulkActionsConfig.bulkActions"
      :is-fixed="isBulkActionsFixed"
      :selected-row-keys="bulkActionsConfig.selectedRowKeys"
      @clear-selection="bulkActionsConfig.onClearSelection()"
    />
  </div>
</template>
