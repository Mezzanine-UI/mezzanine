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
  tableClasses as classes,
  TABLE_ACTIONS_KEY,
  type TableColumn,
  type TableDataSource,
  type TablePinnable,
  type TableRowSelectionCheckbox,
  type TableBulkActions as TableBulkActionsType,
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
    transitionState,
    zebraStriping,
    separatorAtRowIndexes,
    ...restProps
  } = props as TableNonVirtualizedProps<T> & { pinnable?: TablePinnable };

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
  const columnsWithActions = useMemo(() => {
    if (!actions) return columns as TableColumn<T>[];

    const actionsColumn: TableColumn<T> = {
      ...actions,
      align: actions.align ?? 'end',
      ellipsis: false,
      key: TABLE_ACTIONS_KEY,
      render: () => null, // Placeholder, actual rendering is handled in TableRow
    };

    return [...(columns as TableColumn<T>[]), actionsColumn];
  }, [actions, columns]);

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
    handleScroll,
    isScrollingHorizontally,
    scrollLeft,
    containerRef: scrollContainerRef,
    setContainerRef,
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
    }),
    [
      draggable?.enabled,
      draggable?.fixed,
      pinnable?.enabled,
      pinnable?.fixed,
      expandable,
      rowSelection,
    ],
  );

  const fixedOffsetsState = useTableFixedOffsets({
    actionConfig,
    columns: columnsWithActions as TableColumn[],
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

  /** Context values */
  const contextValue = useMemo(
    () => ({
      actions: actions as TableContextValue['actions'],
      columnState,
      dataSource: dataSourceForRender,
      draggable: draggableState,
      emptyProps,
      expansion: expansionState as TableContextValue['expansion'],
      fixedOffsets: fixedOffsetsState,
      pinnable: pinnableState,
      resizable,
      rowHeight,
      highlight: highlightValue,
      isScrollingHorizontally: isScrollingHorizontally,
      isInsideExpandedContentArea: nested,
      loading,
      pagination: pagination || undefined,
      scroll,
      scrollContainerRef,
      selection: selectionState as TableContextValue['selection'],
      size,
      separatorAtRowIndexes,
      sorting: sortingState,
      transitionState,
      virtualScrollEnabled,
      zebraStriping,
    }),
    [
      actions,
      columnState,
      dataSourceForRender,
      draggableState,
      emptyProps,
      expansionState,
      fixedOffsetsState,
      pinnableState,
      resizable,
      rowHeight,
      highlightValue,
      loading,
      pagination,
      scroll,
      scrollContainerRef,
      isScrollingHorizontally,
      selectionState,
      size,
      sortingState,
      transitionState,
      virtualScrollEnabled,
      zebraStriping,
      separatorAtRowIndexes,
      nested,
    ],
  );

  const dataContextValue = useMemo(
    () => ({
      columns: columnsWithActions as TableColumn[],
      dataSource,
    }),
    [columnsWithActions, dataSource],
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

    if (scroll?.y) {
      containerStyle.maxHeight = scroll.y;
    }

    if (nested) {
      containerStyle.position = 'unset';
      containerStyle.overflow = 'unset';
    }

    if (minHeight) {
      containerStyle.minHeight = minHeight;
    }

    return containerStyle;
  }, [scroll?.y, nested, minHeight]);

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

  const composedScrollContainerRef = useCallback(
    (element: HTMLDivElement | null) => {
      setContainerRef(element);

      if (droppableInnerRefSetter.current) {
        droppableInnerRefSetter.current(element);
      }
    },
    [setContainerRef],
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
            <div
              {...droppableProvided?.droppableProps}
              className={cx(classes.scrollContainer, {
                [classes.sticky]: !!sticky,
              })}
              onScroll={handleScroll}
              ref={
                droppableProvided ? composedScrollContainerRef : setContainerRef
              }
              style={scrollContainerStyle}
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
            </div>
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
