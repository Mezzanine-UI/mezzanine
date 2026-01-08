'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  TableSize,
  tableClasses as classes,
  type HighlightMode,
  type TableColumn,
  type TableColumnWithMinWidth,
  type TableDataSource,
  type TableDraggable,
  type TableExpandable,
  type TableRowSelection,
  type TableRowSelectionCheckbox,
  type TableScroll,
  type TableBulkActions as TableBulkActionsType,
} from '@mezzanine-ui/core/table';
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DropResult,
} from '@hello-pangea/dnd';
import { cx } from '../utils/cx';
import type { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import {
  TableContext,
  TableDataContext,
  TableSuperContext,
  type TableContextValue,
} from './TableContext';
import type { TableTransitionState } from './hooks/useTableDataSource';
import { TableBody } from './components/TableBody';
import { TableColGroup } from './components/TableColGroup';
import { TableHeader } from './components/TableHeader';
import {
  TablePagination as TablePaginationComponent,
  TablePaginationProps,
} from './components/TablePagination';
import { useTableResizedColumns } from './hooks/useTableResizedColumns';
import { useTableExpansion } from './hooks/useTableExpansion';
import { useTableFixedOffsets } from './hooks/useTableFixedOffsets';
import { useTableScroll } from './hooks/useTableScroll';
import { useTableSelection } from './hooks/useTableSelection';
import { useTableSorting } from './hooks/useTableSorting';
import type { EmptyProps } from '../Empty';
import { getNumericCSSVariablePixelValue } from '../utils/get-css-variable-value';
import { spacingPrefix } from '@mezzanine-ui/system/spacing';
import TableBulkActions from './components/TableBulkActions';
import { useComposeRefs } from '../hooks/useComposeRefs';

export interface TableBaseProps<T extends TableDataSource = TableDataSource>
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'table'>,
    'children' | 'draggable' | 'summary' | 'onChange'
  > {
  /** Data source */
  dataSource: T[];
  /** Props for Empty component when no data */
  emptyProps?: EmptyProps & { height?: number | string };
  /** Expandable row configuration */
  expandable?: TableExpandable<T>;
  /** Highlight mode for hover effects
   * @default 'row'
   */
  highlight?: HighlightMode;
  /** Loading state */
  loading?: boolean;
  /** Number of rows to display when loading */
  loadingRowsCount?: number;
  /** Minimum height of the table */
  minHeight?: number | string;
  /**
   * Whether the table is nested inside an expanded row content area
   */
  nested?: boolean;
  /** Pagination configuration */
  pagination?: TablePaginationProps;
  /**
   * Row height preset token.
   */
  rowHeightPreset?: 'base' | 'condensed' | 'detailed' | 'roomy';
  /** Row selection configuration */
  rowSelection?: TableRowSelection<T>;
  /** Show header row */
  showHeader?: boolean;
  /** Custom size variant
   * @default 'main'
   */
  size?: TableSize;
  /** Whether to enable sticky header
   *  @default true
   */
  sticky?: boolean;
  /** Transition state for row add/remove animations (from useTableDataSource hook) */
  transitionState?: TableTransitionState;
}

/**
 * Props when resizable is enabled.
 * Requires minWidth on all columns.
 */
export interface TableResizableProps<
  T extends TableDataSource = TableDataSource,
> extends TableBaseProps<T> {
  /** Column configuration - minWidth required for each column when resizable */
  columns: TableColumnWithMinWidth<T>[];
  /**
   * Whether columns are resizable by user interaction
   */
  resizable: true;
}

/**
 * Props when resizable is disabled or not specified.
 */
export interface TableNonResizableProps<
  T extends TableDataSource = TableDataSource,
> extends TableBaseProps<T> {
  /** Column configuration */
  columns: TableColumn<T>[];
  /**
   * Whether columns are resizable by user interaction
   * @default false
   */
  resizable?: false;
}

/**
 * Props when virtualized scrolling is enabled.
 * Draggable is not allowed in this mode.
 */
export type TableVirtualizedProps<T extends TableDataSource = TableDataSource> =
  (TableResizableProps<T> | TableNonResizableProps<T>) & {
    /** Draggable row configuration - not available when virtualized is enabled */
    draggable?: never;
    /** Scroll configuration with virtualized enabled */
    scroll: TableScroll & { virtualized: true; y: number | string };
  };

/**
 * Props when virtualized scrolling is disabled or not specified.
 * Draggable is allowed in this mode.
 */
export type TableNonVirtualizedProps<
  T extends TableDataSource = TableDataSource,
> = (TableResizableProps<T> | TableNonResizableProps<T>) & {
  /** Draggable row configuration */
  draggable?: TableDraggable<T>;
  /** Scroll configuration for scrolling (virtualized defaults to false) */
  scroll?: TableScroll & { virtualized?: false };
};

/**
 * TableProps - discriminated union to ensure draggable and virtualized
 * scrolling are mutually exclusive at the type level, and resizable
 * requires minWidth on all columns.
 */
export type TableProps<T extends TableDataSource = TableDataSource> =
  | TableVirtualizedProps<T>
  | TableNonVirtualizedProps<T>;

function TableInner<T extends TableDataSource = TableDataSource>(
  props: TableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    columns,
    dataSource,
    draggable,
    emptyProps,
    expandable,
    highlight = 'row',
    loading = false,
    loadingRowsCount = 10,
    minHeight,
    nested = false,
    pagination,
    resizable = false,
    rowHeightPreset = 'base',
    rowSelection,
    scroll,
    showHeader = true,
    size = 'main',
    sticky = true,
    style,
    transitionState,
    ...restProps
  } = props as TableNonVirtualizedProps<T>;

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

  /** Feature: Row selection */
  const selectionState = useTableSelection({
    dataSource,
    rowSelection,
  });

  /** Feature: Expansion */
  const expansionState = useTableExpansion({
    expandable,
    hasDragHandle: !!draggable?.enabled,
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
      hasDragHandle: !!draggable?.enabled,
      dragHandleFixed: !!draggable?.fixed,
      hasExpansion: !!expandable,
      expansionFixed: !!expandable?.fixed,
      hasSelection: !!rowSelection,
      selectionFixed: !!rowSelection?.fixed,
    }),
    [draggable?.enabled, draggable?.fixed, expandable, rowSelection],
  );

  const fixedOffsetsState = useTableFixedOffsets({
    actionConfig,
    columns: columns as TableColumn[],
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

  /** Context values */
  const contextValue = useMemo(
    () => ({
      columnState,
      dataSource: dataSourceForRender,
      draggable: draggableState,
      emptyProps,
      expansion: expansionState as TableContextValue['expansion'],
      fixedOffsets: fixedOffsetsState,
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
      sorting: sortingState,
      transitionState,
      virtualScrollEnabled,
    }),
    [
      columnState,
      dataSourceForRender,
      draggableState,
      emptyProps,
      expansionState,
      fixedOffsetsState,
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
      nested,
    ],
  );

  const dataContextValue = useMemo(
    () => ({
      columns: columns as TableColumn[],
      dataSource,
    }),
    [columns, dataSource],
  );

  const superContextValue = useMemo(
    () => ({
      containerWidth: containerWidth,
      getResizedColumnWidth: columnState.getResizedColumnWidth,
      scrollLeft: scrollLeft,
      expansionLeftPadding: expansionState?.expansionLeftPadding ?? 0,
      hasDragHandleFixed: !!draggable?.enabled && draggable.fixed,
    }),
    [
      scrollLeft,
      expansionState?.expansionLeftPadding,
      containerWidth,
      columnState.getResizedColumnWidth,
      draggable?.enabled,
      draggable?.fixed,
    ],
  );

  /** Computed styles */
  const scrollContainerStyle = useMemo<React.CSSProperties>(() => {
    const containerStyle: React.CSSProperties = {};

    if (scroll?.y) {
      containerStyle.maxHeight = scroll.y;
      containerStyle.overflowY = 'auto';
    }

    if (scroll?.x) {
      containerStyle.overflowX = 'auto';
    }

    if (nested) {
      containerStyle.position = 'unset';
      containerStyle.overflow = 'unset';
    }

    if (minHeight) {
      containerStyle.minHeight = minHeight;
    }

    return containerStyle;
  }, [scroll?.x, scroll?.y, nested, minHeight]);

  const tableStyle = useMemo<React.CSSProperties>(() => {
    const baseStyle: React.CSSProperties = {};

    if (scroll?.x) {
      baseStyle.minWidth = scroll.x;
      baseStyle.width = '100%';
    }
    return baseStyle;
  }, [scroll?.x]);

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
    };

    calculateFixedState();

    window.addEventListener('scroll', calculateFixedState, false);
    window.addEventListener('resize', calculateFixedState, false);

    return () => {
      window.removeEventListener('scroll', calculateFixedState, false);
      window.removeEventListener('resize', calculateFixedState, false);
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
