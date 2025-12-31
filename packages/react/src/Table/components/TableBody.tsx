'use client';

import { forwardRef, Fragment, memo, useMemo } from 'react';
import { getRowKey, tableClasses as classes } from '@mezzanine-ui/core/table';
import { Draggable } from '@hello-pangea/dnd';
import { cx } from '../../utils/cx';
import { useTableContext } from '../TableContext';
import { TableRow } from './TableRow';
import { TableExpandedRow } from './TableExpandedRow';
import { useTableVirtualization } from '../hooks/useTableVirtualization';
import Empty from '../../Empty';
import { Fade } from '../../Transition';
import { composeRefs } from '../../utils/composeRefs';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';

export interface TableBodyProps {
  className?: string;
  droppableRef?: React.Ref<HTMLTableSectionElement>;
}

const TableBodyInner = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody(props, ref) {
    const { className, droppableRef } = props;

    const {
      columns,
      dataSource,
      draggable,
      emptyProps,
      expansion,
      loading,
      scrollContainerRef,
      selection,
      size,
      virtualScrollEnabled,
    } = useTableContext();

    // Use virtualization with the scroll container ref from parent
    const virtualization = useTableVirtualization({
      dataSource,
      enabled: virtualScrollEnabled ?? false,
      isRowExpanded: expansion?.isRowExpanded,
      scrollContainerRef:
        scrollContainerRef as React.RefObject<HTMLDivElement | null>,
    });

    const isEmpty = dataSource.length === 0;

    // Calculate total column span for empty row
    const totalColSpan = useMemo(() => {
      let colSpan = columns.length;

      if (draggable?.enabled) colSpan += 1;
      if (selection) colSpan += 1;
      if (expansion) colSpan += 1;

      return colSpan;
    }, [columns.length, draggable?.enabled, expansion, selection]);

    // Helper to render expanded content with optional animation
    const renderExpandedContent = (
      record: (typeof dataSource)[number],
      isExpanded: boolean,
    ) => {
      if (!expansion) return null;

      return (
        <Fade
          duration={{
            enter: MOTION_DURATION.moderate,
            exit: MOTION_DURATION.moderate,
          }}
          easing={{
            enter: MOTION_EASING.entrance,
            exit: MOTION_EASING.exit,
          }}
          in={isExpanded}
        >
          <TableExpandedRow record={record} />
        </Fade>
      );
    };

    // Helper to render row and its expanded content
    const renderRowContent = (
      record: (typeof dataSource)[number],
      index: number,
      options?: {
        className?: string;
        draggableProvided?: Parameters<typeof TableRow>[0]['draggableProvided'];
        measureRef?: (node: HTMLElement | null) => void;
      },
    ) => {
      const rowKey = getRowKey(record);
      const isExpanded = expansion?.isRowExpanded(rowKey) ?? false;

      return (
        <>
          <TableRow
            className={options?.className}
            data-index={virtualization ? index : undefined}
            draggableProvided={options?.draggableProvided}
            record={record}
            ref={options?.measureRef}
            rowIndex={index}
          />
          {renderExpandedContent(record, isExpanded)}
        </>
      );
    };

    const renderRows = () => {
      // Empty state
      if (isEmpty && !loading) {
        const { size: emptySize = size, ...restEmptyProp } = emptyProps || {};

        return (
          <tr className={classes.emptyRow}>
            <td className={classes.empty} colSpan={totalColSpan}>
              <Empty size={emptySize} {...(restEmptyProp as any)} />
            </td>
          </tr>
        );
      }

      // Determine items to render (virtualized or all)
      const itemsToRender = virtualization
        ? virtualization.virtualItems.map((vi) => ({
            index: vi.index,
            measureRef: virtualization.measureElement,
            record: dataSource[vi.index],
          }))
        : dataSource.map((record, index) => ({
            index,
            measureRef: undefined,
            record,
          }));

      // Render each row, optionally wrapped with Draggable
      const rowElements = itemsToRender.map((item) => {
        const rowKey = getRowKey(item.record);

        // Draggable mode
        if (draggable?.enabled && !virtualization) {
          return (
            <Draggable
              draggableId={String(rowKey)}
              index={item.index}
              isDragDisabled={!draggable.enabled}
              key={rowKey}
            >
              {(provided, snapshot) => (
                <>
                  {renderRowContent(item.record, item.index, {
                    className: snapshot.isDragging
                      ? classes.bodyRowDragging
                      : undefined,
                    draggableProvided: provided,
                  })}
                </>
              )}
            </Draggable>
          );
        }

        // Normal or virtualized row
        return (
          <Fragment key={rowKey}>
            {renderRowContent(item.record, item.index, {
              measureRef: item.measureRef,
            })}
          </Fragment>
        );
      });

      // Virtualization needs padding rows for scroll height
      if (virtualization) {
        return (
          <>
            {virtualization.paddingTop > 0 && (
              <tr aria-hidden="true">
                <td
                  colSpan={totalColSpan}
                  style={{ height: virtualization.paddingTop, padding: 0 }}
                />
              </tr>
            )}
            {rowElements}
            {virtualization.paddingBottom > 0 && (
              <tr aria-hidden="true">
                <td
                  colSpan={totalColSpan}
                  style={{ height: virtualization.paddingBottom, padding: 0 }}
                />
              </tr>
            )}
          </>
        );
      }

      return rowElements;
    };

    return (
      <tbody
        className={cx(classes.body, className)}
        ref={droppableRef ? composeRefs([ref, droppableRef]) : ref}
      >
        {renderRows()}
      </tbody>
    );
  },
);

export const TableBody = memo(TableBodyInner);
