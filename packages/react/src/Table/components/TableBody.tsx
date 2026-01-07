'use client';

import { forwardRef, Fragment, memo, useMemo } from 'react';
import { getRowKey, tableClasses as classes } from '@mezzanine-ui/core/table';
import { Draggable } from '@hello-pangea/dnd';
import { cx } from '../../utils/cx';
import { useTableContext, useTableDataContext } from '../TableContext';
import { TableRow } from './TableRow';
import { TableExpandedRow } from './TableExpandedRow';
import { useTableVirtualization } from '../hooks/useTableVirtualization';
import Empty from '../../Empty';
import { Fade } from '../../Transition';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';

export type TableBodyProps = unknown;

const TableBodyInner = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody(_, ref) {
    const {
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
    const { columns } = useTableDataContext();

    // Use virtualization with the scroll container ref from parent
    const virtualization = useTableVirtualization({
      dataSource,
      enabled: virtualScrollEnabled,
      isRowExpanded: expansion?.isRowExpanded,
      scrollContainerRef:
        scrollContainerRef as React.RefObject<HTMLDivElement | null>,
    });

    const isEmpty = useMemo(() => !dataSource.length, [dataSource.length]);

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
        isDragging?: boolean;
        draggableProvided?: Parameters<typeof TableRow>[0]['draggableProvided'];
        measureRef?: (node: HTMLElement | null) => void;
      },
    ) => {
      const rowKey = getRowKey(record);
      const isExpanded = expansion?.isRowExpanded(rowKey) ?? false;

      return (
        <>
          <TableRow
            className={
              options?.isDragging ? classes.bodyRowDragging : undefined
            }
            data-index={virtualization ? index : undefined}
            draggableProvided={options?.draggableProvided}
            record={record}
            ref={options?.measureRef}
            rowIndex={index}
          />
          {/** @NOTE isExpanded 不能透過判斷 isDragging 來強制變 false，因為拖一開始時，套件會計算好高度，如果開始拖曳後才關閉，高度會計算錯誤 */}
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
                    isDragging: snapshot.isDragging,
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
      <tbody className={cx(classes.body)} ref={ref}>
        {renderRows()}
      </tbody>
    );
  },
);

export const TableBody = memo(TableBodyInner);
