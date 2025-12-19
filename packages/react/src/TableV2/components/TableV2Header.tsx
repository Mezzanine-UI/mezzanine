'use client';

import { forwardRef, memo, useCallback, useRef } from 'react';
import {
  DRAG_HANDLE_KEY,
  EXPANSION_KEY,
  getCellAlignClass,
  SELECTION_KEY,
  tableV2Classes,
  type FixedType,
  type TableV2Column,
} from '@mezzanine-ui/core/tableV2';
import {
  CaretDownIcon,
  CaretUpIcon,
  DotVerticalIcon,
  QuestionOutlineIcon,
} from '@mezzanine-ui/icons';
import { cx } from '../../utils/cx';
import Tooltip from '../../Tooltip';
import { useTableV2Context, useTableV2SuperContext } from '../TableV2Context';
import { TableV2DragHandleCell } from './TableV2DragHandleCell';
import { TableV2ExpandCell } from './TableV2ExpandCell';
import { TableV2SelectionCell } from './TableV2SelectionCell';
import Icon from '../../Icon';

export interface TableV2HeaderProps {
  className?: string;
}

const TableV2HeaderInner = forwardRef<
  HTMLTableSectionElement,
  TableV2HeaderProps
>(function TableV2Header(props, ref) {
  const { className } = props;

  const { columns, draggable, expansion, fixedOffsets, selection, sorting } =
    useTableV2Context();

  const { containerWidth, scrollLeft } = useTableV2SuperContext();

  const parseFixed = (fixed: FixedType | undefined): 'end' | 'start' | null => {
    if (fixed === true || fixed === 'start') return 'start';
    if (fixed === 'end') return 'end';

    return null;
  };

  const renderDragHandleHeader = () => {
    if (!draggable?.enabled) return null;

    const offsetInfo = fixedOffsets?.getDragHandleOffset();
    const isFixed = !!draggable.fixed;
    const showShadow =
      isFixed &&
      fixedOffsets?.shouldShowShadow(
        DRAG_HANDLE_KEY,
        scrollLeft ?? 0,
        containerWidth ?? 0,
      );

    return (
      <TableV2DragHandleCell
        fixed={isFixed}
        fixedOffset={offsetInfo?.offset ?? 0}
        isHeader
        showShadow={showShadow ?? false}
      />
    );
  };

  const renderSelectionHeader = () => {
    if (!selection) return null;

    const offsetInfo = fixedOffsets?.getSelectionOffset();
    const isFixed = !!selection.config?.fixed;
    const showShadow =
      isFixed &&
      fixedOffsets?.shouldShowShadow(
        SELECTION_KEY,
        scrollLeft ?? 0,
        containerWidth ?? 0,
      );

    return (
      <TableV2SelectionCell
        fixed={isFixed}
        fixedOffset={offsetInfo?.offset ?? 0}
        indeterminate={selection.isIndeterminate}
        isHeader
        hidden={selection.config?.hideSelectAll}
        onChange={selection.toggleAll}
        selected={selection.isAllSelected}
        showShadow={showShadow ?? false}
      />
    );
  };

  const renderExpandHeader = () => {
    if (!expansion) return null;

    const offsetInfo = fixedOffsets?.getExpansionOffset();
    const isFixed = !!expansion.config?.fixed;
    const showShadow =
      isFixed &&
      fixedOffsets?.shouldShowShadow(
        EXPANSION_KEY,
        scrollLeft ?? 0,
        containerWidth ?? 0,
      );

    return (
      <TableV2ExpandCell
        expanded={false}
        fixed={isFixed}
        fixedOffset={offsetInfo?.offset ?? 0}
        isHeader
        showShadow={showShadow ?? false}
      />
    );
  };

  const renderHelpIcon = (column: TableV2Column) => {
    if (!column.titleHelp) return null;

    return (
      <Tooltip title={column.titleHelp} disablePortal={false}>
        {({ onMouseEnter, onMouseLeave, ref: tooltipRef }) => (
          <Icon
            size={16}
            icon={QuestionOutlineIcon}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={tableV2Classes.headerCellIcon}
            tabIndex={0}
            ref={tooltipRef}
          />
        )}
      </Tooltip>
    );
  };

  const renderSortIcon = (column: TableV2Column) => {
    if (!column.onSort || !sorting) return null;

    const direction = column.sortOrder;

    return (
      <button
        className={tableV2Classes.sortIcons}
        type="button"
        onClick={(evt) => {
          evt.stopPropagation();
          sorting.onSort(column.key);
        }}
        onKeyDown={(evt) => {
          evt.stopPropagation();
          if (evt.key === 'Enter' || evt.key === ' ') {
            evt.preventDefault();
            sorting.onSort(column.key);
          }
        }}
      >
        <Icon
          className={cx(tableV2Classes.sortIcon, {
            [tableV2Classes.sortIconActive]: direction === 'ascend',
          })}
          icon={CaretUpIcon}
          size={8}
        />
        <Icon
          className={cx(tableV2Classes.sortIcon, {
            [tableV2Classes.sortIconActive]: direction === 'descend',
          })}
          icon={CaretDownIcon}
          size={8}
        />
      </button>
    );
  };

  const renderMenuIcon = (column: TableV2Column) => {
    if (!column.titleMenu) return null;

    /** @TODO wait for dropdown component */
    return (
      <Icon
        size={16}
        icon={DotVerticalIcon}
        className={tableV2Classes.headerCellIcon}
      />
    );
  };

  const renderHeaderCells = () => {
    return columns.map((column, columnIndex) => {
      const fixedPos = parseFixed(column.fixed);
      const alignClass = getCellAlignClass(column.align);
      const offsetInfo = fixedOffsets?.getColumnOffset(column.key);
      const offset = offsetInfo?.offset ?? 0;

      const cellStyle: React.CSSProperties = {};

      if (fixedPos === 'start') {
        (cellStyle as Record<string, string>)['--fixed-start-offset'] =
          `${offset}px`;
      } else if (fixedPos === 'end') {
        (cellStyle as Record<string, string>)['--fixed-end-offset'] =
          `${offset}px`;
      }

      // Show shadow based on scroll position and sticky state
      const showShadow =
        !!fixedPos &&
        fixedOffsets?.shouldShowShadow(
          column.key,
          scrollLeft ?? 0,
          containerWidth ?? 0,
        );

      const ariaSort = (() => {
        if (column.sortOrder === 'ascend') return 'ascending';
        if (column.sortOrder === 'descend') return 'descending';

        return undefined;
      })();

      return (
        <th
          aria-sort={ariaSort}
          className={cx(
            tableV2Classes.headerCell,
            alignClass,
            {
              [tableV2Classes.cellFixed]: !!fixedPos,
              [tableV2Classes.cellFixedEnd]: fixedPos === 'end',
              [tableV2Classes.cellFixedShadow]: showShadow,
              [tableV2Classes.cellFixedStart]: fixedPos === 'start',
              [tableV2Classes.headerCellFixed]: !!fixedPos,
            },
            column.className,
          )}
          key={column.key}
          scope="col"
          style={cellStyle}
        >
          <div className={tableV2Classes.headerCellContent}>
            <div className={tableV2Classes.headerCellActions}>
              <span className={tableV2Classes.headerCellTitle}>
                {column.title}
              </span>
              {renderHelpIcon(column)}
              {renderSortIcon(column)}
            </div>
            {renderMenuIcon(column)}
          </div>
          {column.resizable && (
            <TableV2ResizeHandle column={column} columnIndex={columnIndex} />
          )}
        </th>
      );
    });
  };

  return (
    <thead className={cx(tableV2Classes.header, className)} ref={ref}>
      <tr className={tableV2Classes.headerRow}>
        {renderDragHandleHeader()}
        {renderExpandHeader()}
        {renderSelectionHeader()}
        {renderHeaderCells()}
      </tr>
    </thead>
  );
});

export const TableV2Header = memo(TableV2HeaderInner);

/** Resize Handle Component */
interface TableV2ResizeHandleProps {
  column: TableV2Column;
  columnIndex: number;
}

const DEFAULT_MIN_WIDTH = 50;
const DEFAULT_MAX_WIDTH = Infinity;

const TableV2ResizeHandle = memo(function TableV2ResizeHandle({
  column,
  columnIndex,
}: TableV2ResizeHandleProps) {
  const { columnState, columns } = useTableV2Context();
  const { getResizedColumnWidth, setResizedColumnWidth } = columnState || {};
  const startWidthRef = useRef(0);
  const nextStartWidthRef = useRef(0);
  const startXRef = useRef(0);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      // Get next column (the one to the right)
      const nextColumn = columns[columnIndex + 1];

      if (!nextColumn) {
        // If there's no next column, we can't do adjacent resize
        return;
      }

      const currentWidth =
        getResizedColumnWidth?.(column.key) ?? column.width ?? 0;
      const nextWidth =
        getResizedColumnWidth?.(nextColumn.key) ?? nextColumn.width ?? 0;

      startXRef.current = event.clientX;
      startWidthRef.current = currentWidth;
      nextStartWidthRef.current = nextWidth;

      // Get min/max constraints
      const minWidth = column.minWidth ?? DEFAULT_MIN_WIDTH;
      const maxWidth = column.maxWidth ?? DEFAULT_MAX_WIDTH;
      const nextMinWidth = nextColumn.minWidth ?? DEFAULT_MIN_WIDTH;
      const nextMaxWidth = nextColumn.maxWidth ?? DEFAULT_MAX_WIDTH;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const diff = moveEvent.clientX - startXRef.current;

        // Calculate desired new widths
        let newWidth = startWidthRef.current + diff;
        let newNextWidth = nextStartWidthRef.current - diff;

        // Apply constraints for current column
        if (newWidth < minWidth) {
          const adjustment = minWidth - newWidth;

          newWidth = minWidth;
          newNextWidth = newNextWidth + adjustment;
        }

        if (newWidth > maxWidth) {
          const adjustment = newWidth - maxWidth;

          newWidth = maxWidth;
          newNextWidth = newNextWidth + adjustment;
        }

        // Apply constraints for next column
        if (newNextWidth < nextMinWidth) {
          const adjustment = nextMinWidth - newNextWidth;

          newNextWidth = nextMinWidth;
          newWidth = newWidth - adjustment;
        }

        if (newNextWidth > nextMaxWidth) {
          const adjustment = newNextWidth - nextMaxWidth;

          newNextWidth = nextMaxWidth;
          newWidth = newWidth + adjustment;
        }

        // Final clamp to ensure both columns are within bounds
        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        newNextWidth = Math.max(
          nextMinWidth,
          Math.min(nextMaxWidth, newNextWidth),
        );

        setResizedColumnWidth?.(column.key, newWidth);
        setResizedColumnWidth?.(nextColumn.key, newNextWidth);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [
      column,
      columnIndex,
      columns,
      setResizedColumnWidth,
      getResizedColumnWidth,
    ],
  );

  // Don't show resize handle for the last column (no adjacent column to resize)
  if (columnIndex >= columns.length - 1) {
    return null;
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <span
      aria-orientation="vertical"
      className={tableV2Classes.resizeHandle}
      onMouseDown={handleMouseDown}
      role="separator"
    />
  );
});
