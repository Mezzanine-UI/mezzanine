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
      isContainerReady,
      loading,
      loadingRowsCount = 10,
      scrollContainerRef,
      selection,
      size,
      virtualScrollEnabled,
    } = useTableContext();
    const { columns } = useTableDataContext();

    /** Feature: Empty State */
    const isEmpty = useMemo(() => !dataSource.length, [dataSource.length]);

    /** Feature: Virtualized Scroll */
    const virtualization = useTableVirtualization({
      dataSource,
      enabled: virtualScrollEnabled,
      isContainerReady,
      isRowExpanded: expansion?.isRowExpanded,
      scrollContainerRef:
        scrollContainerRef as React.RefObject<HTMLDivElement | null>,
    });

    /** Calculate total columns */
    const totalColSpan = useMemo(() => {
      let colSpan = columns.length;

      if (draggable?.enabled) colSpan += 1;
      if (selection) colSpan += 1;
      if (expansion) colSpan += 1;

      return colSpan;
    }, [columns.length, draggable?.enabled, expansion, selection]);

    /** Feature: Expanded Row render */
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

    /** Main Render */
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
          {/** @NOTE isExpanded 不能透過判斷 isDragging 來強制變 false，因為拖曳開始時，套件會計算好高度，如果開始拖曳後才關閉，高度會計算錯誤 */}
          {renderExpandedContent(record, isExpanded)}
        </>
      );
    };

    /**
     * Feature: Loading
     *
     * Skeleton rows are rendered without a record on purpose — a fabricated
     * row would not satisfy the consumer's `T` and every record callback
     * (`column.render`, `rowExpandable`, `rowState`, …) would be handed a
     * shape it never agreed to. `TableRow` and its cells therefore take
     * `record?: T` and skip every consumer callback when it is absent, which
     * makes the "no record callback runs while loading" contract enforced by
     * the type system rather than by remembering to guard each call site.
     *
     * Expanded rows and drag wrappers are skipped as well: both key off the
     * row's record and are meaningless for a placeholder.
     */
    const renderSkeletonRows = () =>
      Array.from({ length: Math.max(loadingRowsCount, 1) }, (_, index) => (
        <TableRow key={`skeleton-${index}`} rowIndex={index} />
      ));

    const renderRows = () => {
      if (loading) {
        return renderSkeletonRows();
      }

      if (isEmpty) {
        const {
          size: emptySize = size,
          height,
          ...restEmptyProp
        } = emptyProps || {};

        return (
          <tr className={classes.emptyRow}>
            <td
              className={classes.empty}
              colSpan={totalColSpan}
              style={height ? { height } : undefined}
            >
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
