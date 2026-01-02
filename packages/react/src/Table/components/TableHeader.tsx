'use client';

import { forwardRef, memo } from 'react';
import {
  DRAG_HANDLE_KEY,
  EXPANSION_KEY,
  getCellAlignClass,
  SELECTION_KEY,
  tableClasses as classes,
  type FixedType,
  type TableColumn,
} from '@mezzanine-ui/core/table';
import {
  CaretDownIcon,
  CaretUpIcon,
  DotVerticalIcon,
  QuestionOutlineIcon,
} from '@mezzanine-ui/icons';
import { cx } from '../../utils/cx';
import Tooltip from '../../Tooltip';
import { useTableContext, useTableSuperContext } from '../TableContext';
import { TableDragHandleCell } from './TableDragHandleCell';
import { TableExpandCell } from './TableExpandCell';
import { TableResizeHandle } from './TableResizeHandle';
import { TableSelectionCell } from './TableSelectionCell';
import Icon from '../../Icon';

export type TableHeaderProps = unknown;

const TableHeaderInner = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader(_, ref) {
    const {
      columns,
      draggable,
      expansion,
      fixedOffsets,
      resizable,
      selection,
      sorting,
    } = useTableContext();

    const { containerWidth, scrollLeft } = useTableSuperContext();

    const parseFixed = (
      fixed: FixedType | undefined,
    ): 'end' | 'start' | null => {
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
        <TableDragHandleCell
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
        <TableSelectionCell
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
        <TableExpandCell
          expanded={false}
          fixed={isFixed}
          fixedOffset={offsetInfo?.offset ?? 0}
          isHeader
          showShadow={showShadow ?? false}
        />
      );
    };

    const renderHelpIcon = (column: TableColumn) => {
      if (!column.titleHelp) return null;

      return (
        <Tooltip title={column.titleHelp} disablePortal={false}>
          {({ onMouseEnter, onMouseLeave, ref: tooltipRef }) => (
            <Icon
              size={16}
              icon={QuestionOutlineIcon}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              className={classes.headerCellIcon}
              tabIndex={0}
              ref={tooltipRef}
            />
          )}
        </Tooltip>
      );
    };

    const renderSortIcon = (column: TableColumn) => {
      if (!column.onSort || !sorting) return null;

      const direction = column.sortOrder;

      return (
        <button
          className={classes.sortIcons}
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
            className={cx(classes.sortIcon, {
              [classes.sortIconActive]: direction === 'ascend',
            })}
            icon={CaretUpIcon}
            size={8}
          />
          <Icon
            className={cx(classes.sortIcon, {
              [classes.sortIconActive]: direction === 'descend',
            })}
            icon={CaretDownIcon}
            size={8}
          />
        </button>
      );
    };

    const renderMenuIcon = (column: TableColumn) => {
      if (!column.titleMenu) return null;

      /** @TODO wait for dropdown component */
      return (
        <Icon
          size={16}
          icon={DotVerticalIcon}
          className={classes.headerCellIcon}
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
              classes.headerCell,
              {
                [classes.cellFixed]: !!fixedPos,
                [classes.cellFixedEnd]: fixedPos === 'end',
                [classes.cellFixedShadow]: showShadow,
                [classes.cellFixedStart]: fixedPos === 'start',
                [classes.headerCellFixed]: !!fixedPos,
              },
              column.className,
              column.headerClassName,
            )}
            key={column.key}
            scope="col"
            style={cellStyle}
          >
            <div className={classes.headerCellContent}>
              <div className={cx(classes.headerCellActions, alignClass)}>
                <span className={classes.headerCellTitle}>{column.title}</span>
                {renderHelpIcon(column)}
                {renderSortIcon(column)}
              </div>
              {renderMenuIcon(column)}
            </div>
            {resizable && (
              <TableResizeHandle column={column} columnIndex={columnIndex} />
            )}
          </th>
        );
      });
    };

    return (
      <thead className={cx(classes.header)} ref={ref}>
        <tr>
          {renderDragHandleHeader()}
          {renderExpandHeader()}
          {renderSelectionHeader()}
          {renderHeaderCells()}
        </tr>
      </thead>
    );
  },
);

export const TableHeader = memo(TableHeaderInner);
