import { forwardRef, useRef } from 'react';
import { tableClasses as classes } from '@mezzanine-ui/core/table';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import Tooltip from '../Tooltip';

export interface TableCellProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * whether cell content should be ellipsis
   * @default true
   */
  ellipsis?: boolean;
  /**
   * whether tooltip is force to shown when hovered
   * @default false
   */
  forceShownTooltipWhenHovered?: boolean;
  /**
   * tooltip title that you want to display
   */
  tooltipTitle?: string | number;
}

const TableCell = forwardRef<HTMLDivElement, TableCellProps>(
  function TableCell(props, ref) {
    const {
      children,
      className,
      ellipsis = true,
      forceShownTooltipWhenHovered = false,
      tooltipTitle,
      ...rest
    } = props;

    const ellipsisRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={ref} {...rest} className={cx(classes.cell, className)}>
        {ellipsis || forceShownTooltipWhenHovered ? (
          <Tooltip
            title={`${tooltipTitle}`}
            options={{
              placement: 'top-start',
            }}
          >
            {({ onMouseEnter, onMouseLeave }) => (
              <div
                ref={ellipsisRef}
                className={ellipsis ? classes.cellEllipsis : ''}
                onMouseEnter={(e) => {
                  if (ellipsisRef.current) {
                    const { current: el } = ellipsisRef;

                    const isOverflow =
                      forceShownTooltipWhenHovered ||
                      el.scrollWidth > el.offsetWidth;

                    /** display tooltip only when content is overflow */
                    if (isOverflow) onMouseEnter(e);
                  }
                }}
                onMouseLeave={onMouseLeave}
              >
                {children}
              </div>
            )}
          </Tooltip>
        ) : (
          children
        )}
      </div>
    );
  },
);

export default TableCell;
