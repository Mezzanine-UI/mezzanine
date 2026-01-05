'use client';

import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import {
  TableSize,
  tableClasses as classes,
  type HighlightMode,
  type TableColumn,
  type TableDataSource,
  type TableDraggable,
  type TableExpandable,
  type TableRowSelection,
  type TableScroll,
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
  type TableTransitionState,
} from './TableContext';
import { TableBody } from './components/TableBody';
import { TableColGroup } from './components/TableColGroup';
import { TableHeader } from './components/TableHeader';
import {
  TablePagination as TablePaginationComponent,
  TablePaginationProps,
} from './components/TablePagination';
import { useTableColumns } from './hooks/useTableColumns';
import { useTableExpansion } from './hooks/useTableExpansion';
import { useTableFixedOffsets } from './hooks/useTableFixedOffsets';
import { useTableScroll } from './hooks/useTableScroll';
import { useTableSelection } from './hooks/useTableSelection';
import { useTableSorting } from './hooks/useTableSorting';
import type { EmptyProps } from '../Empty';
import { getNumericCSSVariablePixelValue } from '../utils/get-css-variable-value';
import { spacingPrefix } from '@mezzanine-ui/system/spacing';
import TableBulkActions from './components/TableBulkActions';

export interface TableBaseProps<T extends TableDataSource = TableDataSource>
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'table'>,
    'children' | 'draggable' | 'summary' | 'onChange'
  > {
  /** Column configuration */
  columns: TableColumn<T>[];
  /** Data source */
  dataSource: T[];
  /** Props for Empty component when no data */
  emptyProps?: EmptyProps;
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
  /**
   * Whether the table is nested inside an expanded row content area
   */
  nested?: boolean;
  /** Pagination configuration */
  pagination?: TablePaginationProps;
  /**
   * Whether columns are resizable by user interaction
   * @default false
   */
  resizable?: boolean;
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
 * Props when virtualized scrolling is enabled.
 * Draggable is not allowed in this mode.
 */
export interface TableVirtualizedProps<
  T extends TableDataSource = TableDataSource,
> extends TableBaseProps<T> {
  /** Draggable row configuration - not available when virtualized is enabled */
  draggable?: never;
  /** Scroll configuration with virtualized enabled */
  scroll: TableScroll & { virtualized: true; y: number | string };
}

/**
 * Props when virtualized scrolling is disabled or not specified.
 * Draggable is allowed in this mode.
 */
export interface TableNonVirtualizedProps<
  T extends TableDataSource = TableDataSource,
> extends TableBaseProps<T> {
  /** Draggable row configuration */
  draggable?: TableDraggable<T>;
  /** Scroll configuration for scrolling (virtualized defaults to false) */
  scroll?: TableScroll & { virtualized?: false };
}

/**
 * TableProps - discriminated union to ensure draggable and virtualized
 * scrolling are mutually exclusive at the type level.
 */
export type TableProps<T extends TableDataSource = TableDataSource> =
  | TableVirtualizedProps<T>
  | TableNonVirtualizedProps<T>;

function TableInner<T extends TableDataSource = TableDataSource>(
  props: TableVirtualizedProps<T> | TableNonVirtualizedProps<T>,
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

  const tableRef = useRef<HTMLTableElement | null>(null);

  // mock loading dataSource
  const dataSourceForRender = loading
    ? Array.from({ length: Math.max(loadingRowsCount, 1) }).map((_, idx) => ({
        key: idx,
      }))
    : dataSource;

  // get row height from preset
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

  // Highlight state for hover effects
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

  // Hooks
  const sortingState = useTableSorting({
    columns,
  });

  const selectionState = useTableSelection({
    dataSource,
    rowSelection,
  });

  const expansionState = useTableExpansion({
    expandable,
    hasDragHandle: !!draggable?.enabled,
  });

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

  const columnState = useTableColumns({
    actionConfig,
    columns,
  });

  const scrollState = useTableScroll({
    enabled: !nested,
  });

  const { containerRef: scrollContainerRef, setContainerRef } = scrollState;

  // Fixed column offset calculations
  const fixedOffsetsState = useTableFixedOffsets({
    actionConfig,
    columns: columns as TableColumn[],
    getResizedColumnWidth: columnState.getResizedColumnWidth,
  });

  // Stabilize draggable object
  const draggableValue = useMemo(
    () =>
      draggable
        ? {
            draggingId: null,
            enabled: true,
            fixed: draggable.fixed,
          }
        : undefined,
    [draggable],
  );

  // Stabilize highlight object
  const highlightValue = useMemo(
    () => ({
      columnIndex: hoveredColumnIndex,
      mode: highlight,
      rowIndex: hoveredRowIndex,
      setHoveredCell,
    }),
    [highlight, hoveredColumnIndex, hoveredRowIndex, setHoveredCell],
  );

  // Determine if virtual scrolling should be enabled
  // Requires scroll.virtualized to be true AND scroll.y to be set
  const virtualScrollEnabled = !!(scroll?.virtualized && scroll?.y);

  // Context value - cast to any to avoid complex generic issues
  const contextValue = useMemo(
    () => ({
      columnState,
      columns: columns as TableColumn[],
      dataSource: dataSourceForRender,
      draggable: draggableValue,
      emptyProps,
      expansion: expansionState as TableContextValue['expansion'],
      fixedOffsets: fixedOffsetsState,
      resizable,
      rowHeight,
      highlight: highlightValue,
      isScrollingHorizontally: scrollState.isScrollingHorizontally,
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
      columns,
      dataSourceForRender,
      draggableValue,
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
      scrollState.isScrollingHorizontally,
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
      containerWidth: scrollState.containerWidth,
      getResizedColumnWidth: columnState.getResizedColumnWidth,
      scrollLeft: scrollState.scrollLeft,
      expansionLeftPadding: expansionState?.expansionLeftPadding ?? 0,
    }),
    [
      scrollState.scrollLeft,
      expansionState?.expansionLeftPadding,
      scrollState.containerWidth,
      columnState.getResizedColumnWidth,
    ],
  );

  // Drag and drop handler
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination || !draggable) return;

      const sourceIndex = result.source.index;
      const destIndex = result.destination.index;

      if (sourceIndex === destIndex) return;

      const newData = [...dataSource];
      const [removed] = newData.splice(sourceIndex, 1);

      newData.splice(destIndex, 0, removed);

      draggable.onDragEnd?.(newData);
    },
    [dataSource, draggable],
  );

  const sizeClass = size === 'sub' ? classes.sub : classes.main;

  // Scroll container style
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

    return containerStyle;
  }, [scroll?.x, scroll?.y, nested]);

  // Table style with min-width for horizontal scroll
  const tableStyle = useMemo<React.CSSProperties>(() => {
    const baseStyle: React.CSSProperties = {};

    if (scroll?.x) {
      baseStyle.minWidth = scroll.x;
      baseStyle.width = '100%';
    }

    return baseStyle;
  }, [scroll?.x]);

  // Create a stable ref callback for droppable integration
  // We need to use a ref to store the latest droppableProvided.innerRef
  // since it can change between renders
  const droppableInnerRefRef = useRef<
    ((instance: HTMLDivElement | null) => void) | null
  >(null);

  const composedScrollContainerRef = useCallback(
    (element: HTMLDivElement | null) => {
      // Call our setContainerRef
      setContainerRef(element);

      // Call droppable's innerRef if it exists
      if (droppableInnerRefRef.current) {
        droppableInnerRefRef.current(element);
      }
    },
    [setContainerRef],
  );

  const renderMainTable = (droppableProvided?: DroppableProvided) => {
    if (droppableProvided) {
      droppableInnerRefRef.current = droppableProvided.innerRef as (
        instance: HTMLDivElement | null,
      ) => void;
    } else {
      droppableInnerRefRef.current = null;
    }

    return (
      <TableContext.Provider value={contextValue}>
        <TableDataContext.Provider value={dataContextValue}>
          <div
            className={cx(classes.host, className)}
            ref={ref}
            style={style}
            {...restProps}
          >
            <div
              {...droppableProvided?.droppableProps}
              className={cx(classes.scrollContainer, {
                [classes.sticky]: !!sticky,
              })}
              onScroll={scrollState.handleScroll}
              ref={
                droppableProvided ? composedScrollContainerRef : setContainerRef
              }
              style={scrollContainerStyle}
            >
              <table
                className={cx(classes.root, sizeClass)}
                ref={tableRef}
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
            {pagination && <TablePaginationComponent {...pagination} />}
            <TableBulkActions />
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
