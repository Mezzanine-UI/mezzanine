'use client';

import { forwardRef, memo, useMemo } from 'react';
import {
  getCellAlignClass,
  tableClasses as classes,
  type TableActionsBase,
  type TableActionItemButton,
  type TableActionItemDropdown,
  type TableDataSource,
} from '@mezzanine-ui/core/table';
import { cx } from '../../utils/cx';
import { useTableContext } from '../TableContext';
import Button from '../../Button';
import Dropdown from '../../Dropdown';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';

export interface TableActionsCellProps<
  T extends TableDataSource = TableDataSource,
> {
  /** Actions configuration */
  actions: TableActionsBase<T>;
  /** Custom class name */
  className?: string;
  /** Column index for highlight calculation */
  columnIndex: number;
  /** Fixed position */
  fixed?: 'end' | 'start';
  /** Fixed offset */
  fixedOffset?: number;
  /** Row record */
  record: T;
  /** Row index */
  rowIndex: number;
  /** Whether to show shadow */
  showShadow?: boolean;
  /** Cell style */
  style?: React.CSSProperties;
  /** Explicit width for dragging state */
  width?: number;
}

const TableActionsCellInner = forwardRef<
  HTMLTableCellElement,
  TableActionsCellProps
>(function TableActionsCell(props, ref) {
  const {
    actions,
    className,
    columnIndex,
    fixed,
    fixedOffset = 0,
    record,
    rowIndex,
    showShadow = false,
    style,
    width,
  } = props;

  const { highlight, loading } = useTableContext();

  const actionItems = useMemo(
    () => actions.render(record, rowIndex),
    [actions, record, rowIndex],
  );

  const cellStyle = useMemo<React.CSSProperties>(() => {
    const baseStyle: React.CSSProperties = { ...style };

    if (width !== undefined) {
      baseStyle.width = width;
      baseStyle.minWidth = width;
      baseStyle.maxWidth = width;
      baseStyle.flexShrink = 0;
    }

    if (fixed === 'start') {
      (baseStyle as Record<string, string>)['--fixed-start-offset'] =
        `${fixedOffset}px`;
    } else if (fixed === 'end') {
      (baseStyle as Record<string, string>)['--fixed-end-offset'] =
        `${fixedOffset}px`;
    }

    return baseStyle;
  }, [style, fixed, fixedOffset, width]);

  const alignClass = getCellAlignClass(actions.align ?? 'end');

  const isCellHighlighted = useMemo(() => {
    if (!highlight) return false;

    const {
      columnIndex: hoveredColumn,
      mode,
      rowIndex: hoveredRow,
    } = highlight;

    if (hoveredRow === null || hoveredColumn === null) return false;

    switch (mode) {
      case 'cell':
        return hoveredRow === rowIndex && hoveredColumn === columnIndex;
      case 'column':
        return hoveredColumn === columnIndex;
      case 'cross':
        return hoveredColumn === columnIndex;
      case 'row':
      default:
        return false;
    }
  }, [highlight, rowIndex, columnIndex]);

  const handleMouseEnter = () => {
    highlight?.setHoveredCell(rowIndex, columnIndex);
  };

  if (loading) {
    return (
      <td
        className={cx(
          classes.cell,
          {
            [classes.cellFixed]: !!fixed,
            [classes.cellFixedEnd]: fixed === 'end',
            [classes.cellFixedShadow]: showShadow,
            [classes.cellFixedStart]: fixed === 'start',
            [classes.cellHighlight]: isCellHighlighted,
          },
          className,
        )}
        onMouseEnter={handleMouseEnter}
        ref={ref}
        style={cellStyle}
      />
    );
  }

  return (
    <td
      className={cx(
        classes.cell,
        {
          [classes.cellFixed]: !!fixed,
          [classes.cellFixedEnd]: fixed === 'end',
          [classes.cellFixedShadow]: showShadow,
          [classes.cellFixedStart]: fixed === 'start',
          [classes.cellHighlight]: isCellHighlighted,
        },
        className,
      )}
      onMouseEnter={handleMouseEnter}
      ref={ref}
      style={cellStyle}
    >
      <div className={cx(classes.cellContent, alignClass)}>
        <div className={classes.actionsCell}>
          {actionItems.map((item, actionIndex) => {
            const isDisabled = item.disabled?.(record) ?? false;
            const baseKey = `${item.name || 'name'}-${item.icon?.name || 'icon'}-${rowIndex}-${actionIndex}`;

            if (item.type === 'dropdown') {
              const dropdownItem = item as TableActionItemDropdown;

              return (
                <Dropdown
                  key={baseKey}
                  type="default"
                  maxHeight={dropdownItem.maxHeight}
                  onSelect={(option) =>
                    dropdownItem.onSelect(option, record, rowIndex)
                  }
                  options={dropdownItem.options}
                  placement={dropdownItem.placement ?? 'bottom-end'}
                >
                  <Button
                    iconType="icon-only"
                    icon={dropdownItem?.icon ?? DotHorizontalIcon}
                    size="sub"
                    type="button"
                    variant={dropdownItem.variant ?? 'base-text-link'}
                  >
                    {dropdownItem.name}
                  </Button>
                </Dropdown>
              );
            }

            // Default to button type
            const buttonItem = item as TableActionItemButton;

            return (
              <Button
                disabled={isDisabled}
                icon={buttonItem.icon}
                iconType={buttonItem.iconType}
                key={baseKey}
                onClick={() => buttonItem.onClick(record, rowIndex)}
                size="sub"
                type="button"
                variant={buttonItem.variant ?? actions.variant}
              >
                {buttonItem.name}
              </Button>
            );
          })}
        </div>
      </div>
    </td>
  );
});

export const TableActionsCell = memo(
  TableActionsCellInner,
) as typeof TableActionsCellInner;
