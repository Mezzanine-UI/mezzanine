import {
  forwardRef,
  useRef,
} from 'react';
import { tableClasses as classes } from '@mezzanine-ui/core/table';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import Tooltip from '../Tooltip';

export interface TableCellProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * whether cell content should be ellipsis
   * @default true
   */
  ellipsis?: boolean;
  /**
   * tooltip title that you want to display
   */
  tooltipTitle?: string | number;
}

const TableCell = forwardRef<HTMLDivElement, TableCellProps>(function TableCell(props, ref) {
  const {
    children,
    className,
    ellipsis = true,
    role = 'gridcell',
    tooltipTitle,
    ...rest
  } = props;

  const ellipsisRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      {...rest}
      className={cx(
        classes.cell,
        className,
      )}
      role={role}
    >
      {ellipsis ? (
        <Tooltip
          title={`${tooltipTitle}`}
          options={{
            placement: 'top-start',
          }}
        >
          {({ onMouseEnter, onMouseLeave }) => (
            <div
              ref={ellipsisRef}
              className={classes.cellEllipsis}
              onMouseEnter={(e) => {
                if (ellipsisRef.current) {
                  const { current: el } = ellipsisRef;

                  const isOverflow = el.scrollWidth > el.offsetWidth;

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
      ) : children}
    </div>
  );
});

export default TableCell;
