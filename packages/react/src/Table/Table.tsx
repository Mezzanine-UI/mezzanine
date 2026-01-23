'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import throttle from 'lodash/throttle';
import {
  COLLECTABLE_KEY,
  tableClasses as classes,
  TABLE_ACTIONS_KEY,
  TOGGLEABLE_KEY,
  type TableCollectable,
  type TableColumn,
  type TableDataSource,
  type TablePinnable,
  type TableRowSelectionCheckbox,
  type TableBulkActions as TableBulkActionsType,
  type TableToggleable,
  TOGGLEABLE_COLUMN_WIDTH,
  COLLECTABLE_COLUMN_WIDTH,
} from '@mezzanine-ui/core/table';
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DropResult,
} from '@hello-pangea/dnd';
import { cx } from '../utils/cx';
import {
  TableContext,
  TableDataContext,
  TableSuperContext,
  type TableContextValue,
} from './TableContext';
import { TableBody } from './components/TableBody';
import { TableColGroup } from './components/TableColGroup';
import { TableHeader } from './components/TableHeader';
import { TablePagination as TablePaginationComponent } from './components/TablePagination';
import { useTableResizedColumns } from './hooks/useTableResizedColumns';
import { useTableExpansion } from './hooks/useTableExpansion';
import { useTableFixedOffsets } from './hooks/useTableFixedOffsets';
import { useTableScroll } from './hooks/useTableScroll';
import { useTableSelection } from './hooks/useTableSelection';
import { useTableSorting } from './hooks/useTableSorting';
import { getNumericCSSVariablePixelValue } from '../utils/get-css-variable-value';
import { spacingPrefix } from '@mezzanine-ui/system/spacing';
import TableBulkActions from './components/TableBulkActions';
import { useComposeRefs } from '../hooks/useComposeRefs';
import Scrollbar from '../Scrollbar';
import type { TableProps, TableNonVirtualizedProps } from './typings';

function TableInner<T extends TableDataSource = TableDataSource>(
  props: TableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    actions,
    className,
    columns,
    dataSource,
    draggable,
    emptyProps,
    expandable,
    fullWidth = false,
    highlight = 'row',
    loading = false,
    loadingRowsCount = 10,
    minHeight,
    nested = false,
    pagination,
    pinnable,
    resizable = false,
    rowHeightPreset = 'base',
    rowSelection,
    scroll,
    showHeader = true,
    size = 'main',
    sticky = true,
    style,
    toggleable,
    collectable,
    transitionState,
    zebraStriping,
    separatorAtRowIndexes,
    ...restProps
  } = props as TableNonVirtualizedProps<T> & {
    pinnable?: TablePinnable;
    toggleable?: TableToggleable;
    collectable?: TableCollectable;
  };

  const hostRef = useRef<HTMLDivElement | null>(null);
  const composedHostRef = useComposeRefs([ref, hostRef]);

  /** Feature: Loading */
  const dataSourceForRender = loading
    ? Array.from({ length: Math.max(loadingRowsCount, 1) }).map((_, idx) => ({
        key: `${idx}`,
      }))
    : dataSource;

  /** Feature: Row Height Preset */
  const rowHeight = useMemo(() => {
    switch (rowHeightPreset) {
      case 'condensed':
        return size === 'main'
          ? getNumericCSSVariablePixelValue(
              `--${spacingPrefix}-size-container-condensed`,
            )
          : getNumericCSSVariablePixelValue(
              `--${spacingPrefix}-size-container-reduced`,
            );
      case 'detailed':
        return size === 'main'
          ? getNumericCSSVariablePixelValue(
              `--${spacingPrefix}-size-container-tiny`,
            )
          : getNumericCSSVariablePixelValue(
              `--${spacingPrefix}-size-container-tightened`,
            );
      case 'roomy':
        return size === 'main'
          ? getNumericCSSVariablePixelValue(
              `--${spacingPrefix}-size-container-small`,
            )
          : getNumericCSSVariablePixelValue(
              `--${spacingPrefix}-size-container-medium`,
            );
      case 'base':
      default:
        return size === 'main'
          ? getNumericCSSVariablePixelValue(
              `--${spacingPrefix}-size-container-minimized`,
            )
          : getNumericCSSVariablePixelValue(
              `--${spacingPrefix}-size-container-minimal`,
            );
    }
  }, [rowHeightPreset, size]);

  /** Feature: Highlight */
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [hoveredColumnIndex, setHoveredColumnIndex] = useState<number | null>(
    null,
  );

  const setHoveredCell = useCallback(
    (rowIndex: number | null, columnIndex: number | null) => {
      setHoveredRowIndex(rowIndex);
      setHoveredColumnIndex(columnIndex);
    },
    [],
  );

  const highlightValue = useMemo(
    () => ({
      columnIndex: hoveredColumnIndex,
      mode: highlight,
      rowIndex: hoveredRowIndex,
      setHoveredCell,
    }),
    [highlight, hoveredColumnIndex, hoveredRowIndex, setHoveredCell],
  );

  /** Feature: sorting */
  const sortingState = useTableSorting({
    columns,
  });

  /** Feature: Actions column */
  const columnsWithRightControls = useMemo(() => {
    const result = [...(columns as TableColumn<T>[])];

    // Add toggleable column (rightControl area - after data columns)
    if (toggleable?.enabled) {
      const toggleableColumn: TableColumn<T> = {
        align: toggleable.align ?? 'start',
        ellipsis: false,
        fixed: toggleable.fixed ? 'end' : undefined,
        key: TOGGLEABLE_KEY,
        render: () => null, // Placeholder, actual rendering is handled in TableRow
        title: toggleable.title,
        width: toggleable.minWidth ?? TOGGLEABLE_COLUMN_WIDTH,
        minWidth: toggleable.minWidth ?? TOGGLEABLE_COLUMN_WIDTH,
      };

      result.push(toggleableColumn);
    }

    // Add collectable column (rightControl area - after toggleable)
    if (collectable?.enabled) {
      const collectableColumn: TableColumn<T> = {
        align: collectable.align ?? 'start',
        ellipsis: false,
        fixed: collectable.fixed ? 'end' : undefined,
        key: COLLECTABLE_KEY,
        render: () => null, // Placeholder, actual rendering is handled in TableRow
        title: collectable.title,
        width: collectable?.minWidth ?? COLLECTABLE_COLUMN_WIDTH,
        minWidth: collectable?.minWidth ?? COLLECTABLE_COLUMN_WIDTH,
      };

      result.push(collectableColumn);
    }

    // Add actions column (rightmost)
    if (actions) {
      const actionsColumn: TableColumn<T> = {
        ...actions,
        align: actions.align ?? 'end',
        ellipsis: false,
        key: TABLE_ACTIONS_KEY,
        render: () => null, // Placeholder, actual rendering is handled in TableRow
      };

      result.push(actionsColumn);
    }

    return result;
  }, [actions, collectable, columns, toggleable]);

  /** Feature: Row selection */
  const selectionState = useTableSelection({
    dataSource,
    rowSelection,
  });

  /** Feature: Expansion */
  const expansionState = useTableExpansion({
    expandable,
    hasDragOrPinHandle: !!draggable?.enabled || !!pinnable?.enabled,
  });

  /** Feature: Column resized */
  const columnState = useTableResizedColumns();

  /** Feature: Scroll and dimensions calculation */
  const {
    containerWidth,
    handleScrollbarScroll,
    handleViewportReady,
    isContainerReady,
    isScrollingHorizontally,
    scrollLeft,
    containerRef: scrollContainerRef,
  } = useTableScroll({
    enabled: !nested,
  });

  const virtualScrollEnabled = useMemo(
    () => !!(scroll?.virtualized && scroll?.y),
    [scroll?.virtualized, scroll?.y],
  );

  /** Feature: Column fixed */
  const actionConfig = useMemo(
    () => ({
      hasDragOrPinHandle: !!draggable?.enabled || !!pinnable?.enabled,
      dragOrPinHandleFixed: !!draggable?.fixed || !!pinnable?.fixed,
      dragOrPinHandleType: draggable?.enabled
        ? ('drag' as const)
        : pinnable?.enabled
          ? ('pin' as const)
          : undefined,
      hasExpansion: !!expandable,
      expansionFixed: !!expandable?.fixed,
      hasSelection: !!rowSelection,
      selectionFixed: !!rowSelection?.fixed,
      hasToggleable: !!toggleable?.enabled,
      toggleableMinWidth: toggleable?.minWidth ?? TOGGLEABLE_COLUMN_WIDTH,
      toggleableFixed: !!toggleable?.fixed,
      hasCollectable: !!collectable?.enabled,
      collectableMinWidth: collectable?.minWidth ?? COLLECTABLE_COLUMN_WIDTH,
      collectableFixed: !!collectable?.fixed,
    }),
    [
      collectable?.enabled,
      collectable?.minWidth,
      collectable?.fixed,
      draggable?.enabled,
      draggable?.fixed,
      pinnable?.enabled,
      pinnable?.fixed,
      expandable,
      rowSelection,
      toggleable?.enabled,
      toggleable?.minWidth,
      toggleable?.fixed,
    ],
  );

  const fixedOffsetsState = useTableFixedOffsets({
    actionConfig,
    columns: columnsWithRightControls as TableColumn[],
    getResizedColumnWidth: columnState.getResizedColumnWidth,
  });

  /** Feature: Drag n Drop */
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination || !draggable) return;

      const sourceIndex = result.source.index;
      const destIndex = result.destination.index;

      if (sourceIndex === destIndex) return;

      const newData = [...dataSource];
      const [removed] = newData.splice(sourceIndex, 1);

      newData.splice(destIndex, 0, removed);

      draggable.onDragEnd?.(newData, {
        draggingId: result.draggableId,
        fromIndex: sourceIndex,
        toIndex: destIndex,
      });
    },
    [dataSource, draggable],
  );

  const draggableState = useMemo(
    () =>
      draggable
        ? {
            enabled: draggable.enabled,
            fixed: draggable.fixed,
          }
        : undefined,
    [draggable],
  );

  const pinnableState = useMemo(
    () =>
      pinnable
        ? {
            enabled: pinnable.enabled,
            fixed: pinnable.fixed,
            pinnedRowKeys: pinnable.pinnedRowKeys,
            onPinChange: pinnable.onPinChange,
          }
        : undefined,
    [pinnable],
  );

  const toggleableState = useMemo(
    () =>
      toggleable
        ? {
            enabled: toggleable.enabled,
            fixed: toggleable.fixed,
            isRowDisabled: toggleable.isRowDisabled,
            onToggleChange: toggleable.onToggleChange,
            title: toggleable.title,
            toggledRowKeys: toggleable.toggledRowKeys,
          }
        : undefined,
    [toggleable],
  );

  const collectableState = useMemo(
    () =>
      collectable
        ? {
            enabled: collectable.enabled,
            collectedRowKeys: collectable.collectedRowKeys,
            fixed: collectable.fixed,
            isRowDisabled: collectable.isRowDisabled,
            onCollectChange: collectable.onCollectChange,
            title: collectable.title,
          }
        : undefined,
    [collectable],
  );

  /** Context values */
  const contextValue = useMemo(
    () => ({
      actions: actions as TableContextValue['actions'],
      collectable: collectableState,
      columnState,
      dataSource: dataSourceForRender,
      draggable: draggableState,
      emptyProps,
      expansion: expansionState as TableContextValue['expansion'],
      fixedOffsets: fixedOffsetsState,
      highlight: highlightValue,
      isContainerReady,
      isInsideExpandedContentArea: nested,
      isScrollingHorizontally: isScrollingHorizontally,
      loading,
      pagination: pagination || undefined,
      pinnable: pinnableState,
      resizable,
      rowHeight,
      scroll,
      scrollContainerRef,
      selection: selectionState as TableContextValue['selection'],
      separatorAtRowIndexes,
      size,
      sorting: sortingState,
      toggleable: toggleableState,
      transitionState,
      virtualScrollEnabled,
      zebraStriping,
    }),
    [
      actions,
      collectableState,
      columnState,
      dataSourceForRender,
      draggableState,
      emptyProps,
      expansionState,
      fixedOffsetsState,
      highlightValue,
      isContainerReady,
      isScrollingHorizontally,
      loading,
      nested,
      pagination,
      pinnableState,
      resizable,
      rowHeight,
      scroll,
      scrollContainerRef,
      selectionState,
      separatorAtRowIndexes,
      size,
      sortingState,
      toggleableState,
      transitionState,
      virtualScrollEnabled,
      zebraStriping,
    ],
  );

  const dataContextValue = useMemo(
    () => ({
      columns: columnsWithRightControls as TableColumn[],
      dataSource,
    }),
    [columnsWithRightControls, dataSource],
  );

  const superContextValue = useMemo(
    () => ({
      containerWidth: containerWidth,
      getResizedColumnWidth: columnState.getResizedColumnWidth,
      scrollLeft: scrollLeft,
      expansionLeftPadding: expansionState?.expansionLeftPadding ?? 0,
      hasDragOrPinHandleFixed:
        (!!draggable?.enabled && draggable.fixed) ||
        (!!pinnable?.enabled && pinnable.fixed),
    }),
    [
      scrollLeft,
      expansionState?.expansionLeftPadding,
      containerWidth,
      columnState.getResizedColumnWidth,
      draggable?.enabled,
      draggable?.fixed,
      pinnable?.enabled,
      pinnable?.fixed,
    ],
  );

  /** Computed styles */
  const scrollContainerStyle = useMemo<React.CSSProperties>(() => {
    const containerStyle: React.CSSProperties = {};

    if (minHeight) {
      containerStyle.minHeight = minHeight;
    }

    return containerStyle;
  }, [minHeight]);

  const tableStyle = useMemo<React.CSSProperties>(() => {
    const baseStyle: React.CSSProperties = {};

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    return baseStyle;
  }, [fullWidth]);

  /** Scroll Container Ref */
  const droppableInnerRefSetter = useRef<
    ((instance: HTMLDivElement | null) => void) | null
  >(null);

  // Handler for Scrollbar's onViewportReady - composes with handleViewportReady and droppable innerRef
  const handleScrollbarViewportReady = useCallback(
    (
      viewport: HTMLDivElement,
      instance?: Parameters<typeof handleViewportReady>[1],
    ) => {
      handleViewportReady(viewport, instance);

      // Also set droppable innerRef to viewport element for DnD
      if (droppableInnerRefSetter.current) {
        droppableInnerRefSetter.current(viewport);
      }
    },
    [handleViewportReady],
  );

  // Scrollbar events for OverlayScrollbars
  const scrollbarEvents = useMemo(
    () => ({
      scroll: handleScrollbarScroll,
    }),
    [handleScrollbarScroll],
  );

  /** Feature: bulk actions */
  const bulkActionsConfig = useMemo(() => {
    if (!selectionState || selectionState.mode !== 'checkbox') {
      return null;
    }

    const checkboxConfig =
      selectionState.config as TableRowSelectionCheckbox<T>;

    return {
      enabled:
        !!checkboxConfig.bulkActions && selectionState.selectedRowKeys.length,
      bulkActions: checkboxConfig.bulkActions as TableBulkActionsType,
      onClearSelection: () => checkboxConfig.onChange([], null, []),
      selectedRowKeys: selectionState.selectedRowKeys,
    };
  }, [selectionState]);

  const [isBulkActionsFixed, setIsBulkActionsFixed] = useState(false);

  useEffect(() => {
    if (!bulkActionsConfig?.enabled) {
      return;
    }

    const calculateFixedState = () => {
      const { current: hostEl } = hostRef;

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

      setIsBulkActionsFixed(shouldBeFixed);

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

    return () => {
      throttledCalculateFixedState.cancel();
      window.removeEventListener('scroll', throttledCalculateFixedState, false);
      window.removeEventListener('resize', throttledCalculateFixedState, false);
    };
  }, [bulkActionsConfig?.enabled]);

  /** Get Dynamic Pagination Height */
  const paginationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { current: paginationEl } = paginationRef;

    if (paginationEl) {
      const resizeObserver = new ResizeObserver(() => {
        hostRef.current?.style.setProperty(
          '--mzn-table-pagination-height',
          `${paginationEl.offsetHeight}px`,
        );
      });

      resizeObserver.observe(paginationEl);

      return () => {
        resizeObserver.disconnect();
      };
    }

    return;
  }, []);

  /** Main render */
  const renderMainTable = (droppableProvided?: DroppableProvided) => {
    if (droppableProvided) {
      droppableInnerRefSetter.current = droppableProvided.innerRef;
    } else {
      droppableInnerRefSetter.current = null;
    }

    return (
      <TableContext.Provider value={contextValue}>
        <TableDataContext.Provider value={dataContextValue}>
          <div
            className={cx(classes.host, className)}
            ref={composedHostRef}
            style={style}
            {...restProps}
          >
            <Scrollbar
              {...droppableProvided?.droppableProps}
              className={sticky ? classes.sticky : undefined}
              defer={false}
              disabled={nested}
              events={scrollbarEvents}
              onViewportReady={handleScrollbarViewportReady}
              style={scrollContainerStyle}
              maxHeight={scroll?.y}
            >
              <table
                className={cx(
                  classes.root,
                  size === 'sub' ? classes.sub : classes.main,
                )}
                style={tableStyle}
              >
                <TableColGroup />
                {showHeader && <TableHeader />}
                <TableBody />
                {droppableProvided?.placeholder ? (
                  <tbody>{droppableProvided.placeholder}</tbody>
                ) : null}
              </table>
            </Scrollbar>
            {pagination && (
              <TablePaginationComponent {...pagination} ref={paginationRef} />
            )}
            {bulkActionsConfig?.enabled ? (
              <TableBulkActions
                bulkActions={bulkActionsConfig.bulkActions}
                isFixed={isBulkActionsFixed}
                onClearSelection={bulkActionsConfig.onClearSelection}
                selectedRowKeys={bulkActionsConfig.selectedRowKeys}
              />
            ) : null}
          </div>
        </TableDataContext.Provider>
      </TableContext.Provider>
    );
  };

  if (nested) {
    return renderMainTable();
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="mzn-table-dnd">
        {(provided) => (
          <TableSuperContext.Provider value={superContextValue}>
            {renderMainTable(provided)}
          </TableSuperContext.Provider>
        )}
      </Droppable>
    </DragDropContext>
  );
}

/**
 * Table is a high-performance data table component with support for
 * virtual scrolling, column resizing, fixed columns, row selection,
 * sorting, expandable rows, and drag-and-drop row reordering.
 */
export const Table = forwardRef(
  TableInner as Parameters<typeof forwardRef>[0],
) as <T extends TableDataSource = TableDataSource>(
  props: TableProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement;

export default Table;
