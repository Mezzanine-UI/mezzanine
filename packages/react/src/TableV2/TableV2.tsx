'use client';

import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import {
  tableV2Classes,
  type HighlightMode,
  type TableV2Column,
  type TableV2DataSource,
  type TableV2Draggable,
  type TableV2Expandable,
  type TableV2RowSelection,
  type TableV2Scroll,
} from '@mezzanine-ui/core/tableV2';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { cx } from '../utils/cx';
import type { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import {
  TableV2Context,
  TableV2DataContext,
  TableV2SuperContext,
  type TableV2ContextValue,
} from './TableV2Context';
import { TableV2Body } from './components/TableV2Body';
import { TableV2ColGroup } from './components/TableV2ColGroup';
import { TableV2Header } from './components/TableV2Header';
import {
  TableV2Pagination as TableV2PaginationComponent,
  TableV2PaginationProps,
} from './components/TableV2Pagination';
import { useTableV2Columns } from './hooks/useTableV2Columns';
import { useTableV2Expansion } from './hooks/useTableV2Expansion';
import { useTableV2FixedOffsets } from './hooks/useTableV2FixedOffsets';
import { useTableV2Scroll } from './hooks/useTableV2Scroll';
import { useTableV2Selection } from './hooks/useTableV2Selection';
import { useTableV2Sorting } from './hooks/useTableV2Sorting';
import type { EmptyProps } from '../Empty';
import { composeRefs } from '../utils/composeRefs';

export interface TableV2Props<T extends TableV2DataSource = TableV2DataSource>
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'table'>,
    'children' | 'draggable' | 'summary' | 'onChange'
  > {
  /** Column configuration */
  columns: TableV2Column<T>[];
  /** Data source */
  dataSource: T[];
  /** Draggable row configuration */
  draggable?: TableV2Draggable<T>;
  /** Props for Empty component when no data */
  emptyProps?: EmptyProps;
  /** Expandable row configuration */
  expandable?: TableV2Expandable<T>;
  /** Highlight mode for hover effects
   * @default 'row'
   */
  highlight?: HighlightMode;
  /** Loading state */
  loading?: boolean;
  /**
   * Whether the table is nested inside an expanded row content area
   */
  nested?: boolean;
  /** Pagination configuration */
  pagination?: TableV2PaginationProps;
  /** Row selection configuration */
  rowSelection?: TableV2RowSelection<T>;
  /** Scroll configuration for virtual scrolling */
  scroll?: TableV2Scroll;
  /** Show header row */
  showHeader?: boolean;
  /** Custom size variant
   * @default 'main'
   */
  size?: 'main' | 'sub';
  /** Whether to enable sticky header
   *  @default true
   */
  sticky?: boolean;
}

function TableV2Inner<T extends TableV2DataSource = TableV2DataSource>(
  props: TableV2Props<T>,
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
    nested = false,
    pagination,
    rowSelection,
    scroll,
    showHeader = true,
    size = 'main',
    sticky = true,
    style,
    ...restProps
  } = props;

  const hostRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);

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
  const sortingState = useTableV2Sorting({
    columns,
  });

  const selectionState = useTableV2Selection({
    dataSource,
    rowSelection,
  });

  const expansionState = useTableV2Expansion({
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

  const columnState = useTableV2Columns({
    actionConfig,
    columns,
  });

  const scrollState = useTableV2Scroll({
    enabled: !nested,
  });

  // Fixed column offset calculations
  const fixedOffsetsState = useTableV2FixedOffsets({
    actionConfig,
    columns: columns as TableV2Column[],
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
  const virtualScrollEnabled = !!scroll?.y;

  // Context value - cast to any to avoid complex generic issues
  const contextValue = useMemo(
    () => ({
      columnState,
      columns: columns as TableV2Column[],
      dataSource,
      draggable: draggableValue,
      emptyProps,
      expansion: expansionState as TableV2ContextValue['expansion'],
      fixedOffsets: fixedOffsetsState,
      highlight: highlightValue,
      isScrollingHorizontally: scrollState.isScrollingHorizontally,
      isInsideExpandedContentArea: nested,
      loading,
      pagination: pagination || undefined,
      scroll,
      scrollContainerRef,
      selection: selectionState as TableV2ContextValue['selection'],
      sorting: sortingState,
      virtualScrollEnabled,
    }),
    [
      columnState,
      columns,
      dataSource,
      draggableValue,
      emptyProps,
      expansionState,
      fixedOffsetsState,
      highlightValue,
      loading,
      pagination,
      scroll,
      scrollContainerRef,
      scrollState.isScrollingHorizontally,
      selectionState,
      sortingState,
      virtualScrollEnabled,
      nested,
    ],
  );

  const dataContextValue = useMemo(
    () => ({
      columns: columns as TableV2Column[],
      dataSource,
    }),
    [columns, dataSource],
  );

  const superContextValue = useMemo(
    () => ({
      containerWidth: scrollState.containerWidth,
      scrollLeft: scrollState.scrollLeft,
      expansionLeftPadding: expansionState?.expansionLeftPadding ?? 0,
    }),
    [
      scrollState.scrollLeft,
      expansionState?.expansionLeftPadding,
      scrollState.containerWidth,
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

  const sizeClass = size === 'sub' ? tableV2Classes.sub : tableV2Classes.main;

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

  const { setContainerRef } = scrollState;

  const handleScrollContainerRef = useCallback(
    (element: HTMLDivElement | null) => {
      scrollContainerRef.current = element;
      setContainerRef(element);
    },
    [setContainerRef],
  );

  const mainTable = (
    <TableV2Context.Provider value={contextValue}>
      <TableV2DataContext.Provider value={dataContextValue}>
        <div
          className={cx(
            tableV2Classes.host,
            {
              [tableV2Classes.loading]: loading,
            },
            className,
          )}
          ref={ref}
          style={style}
          {...restProps}
        >
          <div
            className={cx(tableV2Classes.scrollContainer, {
              [tableV2Classes.sticky]: !!sticky,
            })}
            onScroll={scrollState.handleScroll}
            ref={handleScrollContainerRef}
            style={scrollContainerStyle}
          >
            <table
              className={cx(tableV2Classes.root, sizeClass)}
              ref={tableRef}
              style={tableStyle}
            >
              <TableV2ColGroup />
              {showHeader && <TableV2Header />}
              <TableV2Body />
            </table>
          </div>
          {pagination && <TableV2PaginationComponent {...pagination} />}
        </div>
      </TableV2DataContext.Provider>
    </TableV2Context.Provider>
  );

  if (nested) {
    return mainTable;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="mzn-table-v2-dnd">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={composeRefs([hostRef, provided.innerRef])}
          >
            <TableV2SuperContext.Provider value={superContextValue}>
              {mainTable}
            </TableV2SuperContext.Provider>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

/**
 * TableV2 is a high-performance data table component with support for
 * virtual scrolling, column resizing, fixed columns, row selection,
 * sorting, expandable rows, and drag-and-drop row reordering.
 */
export const TableV2 = forwardRef(
  TableV2Inner as Parameters<typeof forwardRef>[0],
) as <T extends TableV2DataSource = TableV2DataSource>(
  props: TableV2Props<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement;
