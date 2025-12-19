'use client';

import { forwardRef, Fragment, memo, useMemo } from 'react';
import { getRowKey, tableV2Classes } from '@mezzanine-ui/core/tableV2';
import { Draggable } from '@hello-pangea/dnd';
import { cx } from '../../utils/cx';
import { useTableV2Context } from '../TableV2Context';
import { TableV2Row } from './TableV2Row';
import { TableV2ExpandedRow } from './TableV2ExpandedRow';
import { useTableV2Virtualization } from '../hooks/useTableV2Virtualization';
import Empty from '../../Empty';
import { Fade } from '../../Transition';
import { composeRefs } from '../../utils/composeRefs';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';

export interface TableV2BodyProps {
  className?: string;
  droppableRef?: React.Ref<HTMLTableSectionElement>;
}

const TableV2BodyInner = forwardRef<HTMLTableSectionElement, TableV2BodyProps>(
  function TableV2Body(props, ref) {
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
      virtualScrollEnabled,
    } = useTableV2Context();

    // Use virtualization with the scroll container ref from parent
    const virtualization = useTableV2Virtualization({
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

    const renderRows = () => {
      if (isEmpty && !loading) {
        return (
          <tr className={tableV2Classes.emptyRow}>
            <td className={tableV2Classes.empty} colSpan={totalColSpan}>
              <Empty title={emptyProps?.title ?? 'No Data'} {...emptyProps} />
            </td>
          </tr>
        );
      }

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
            {/* Render only visible virtual items */}
            {virtualization.virtualItems.map((virtualItem) => {
              const record = dataSource[virtualItem.index];
              const rowKey = getRowKey(record);
              const isExpanded = expansion?.isRowExpanded(rowKey) ?? false;

              return (
                <Fragment key={rowKey}>
                  <TableV2Row
                    data-index={virtualItem.index}
                    record={record}
                    ref={virtualization.measureElement}
                    rowIndex={virtualItem.index}
                  />
                  {isExpanded && expansion && (
                    <TableV2ExpandedRow record={record} />
                  )}
                </Fragment>
              );
            })}
            {/* Bottom spacer row to maintain scroll height */}
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

      // Draggable rows
      if (draggable?.enabled) {
        return dataSource.map((record, index) => {
          const rowKey = getRowKey(record);
          const isExpanded = expansion?.isRowExpanded(rowKey) ?? false;

          return (
            <Draggable
              draggableId={String(rowKey)}
              index={index}
              isDragDisabled={!draggable?.enabled}
              key={rowKey}
            >
              {(provided, snapshot) => (
                <Fragment>
                  <TableV2Row
                    className={
                      snapshot.isDragging
                        ? tableV2Classes.bodyRowDragging
                        : undefined
                    }
                    draggableProvided={provided}
                    record={record}
                    rowIndex={index}
                  />
                  {isExpanded && expansion && (
                    <TableV2ExpandedRow record={record} />
                  )}
                </Fragment>
              )}
            </Draggable>
          );
        });
      }

      // Normal rows
      return dataSource.map((record, index) => {
        const rowKey = getRowKey(record);
        const isExpanded = expansion?.isRowExpanded(rowKey) ?? false;

        return (
          <Fragment key={rowKey}>
            <TableV2Row record={record} rowIndex={index} />
            {expansion && (
              <Fade
                in={isExpanded}
                duration={{
                  enter: MOTION_DURATION.moderate,
                  exit: MOTION_DURATION.moderate,
                }}
                easing={{
                  enter: MOTION_EASING.entrance,
                  exit: MOTION_EASING.exit,
                }}
              >
                <TableV2ExpandedRow record={record} />
              </Fade>
            )}
          </Fragment>
        );
      });
    };

    return (
      <tbody
        className={cx(tableV2Classes.body, className)}
        ref={droppableRef ? composeRefs([ref, droppableRef]) : ref}
      >
        {renderRows()}
      </tbody>
    );
  },
);

export const TableV2Body = memo(TableV2BodyInner);
