/* eslint-disable no-console */
import {
  forwardRef,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
} from 'react';
import { paginationClasses as classes } from '@mezzanine-ui/core/pagination';
import PaginationItem, { PaginationItemProps } from './PaginationItem';
import PaginationJumper from './PaginationJumper';
import { usePagination } from './usePagination';
import { cx } from '../utils/cx';

export interface PaginationProps
  extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>, 'onChange'> {
  /**
   * Number of always visible pages at the beginning and end.
   * @default 1
   */
  boundaryCount?: number;
  /**
   * The text displayed in the jumper `button` content.
   */
  buttonText?: string;
  /**
   * The current page number.
   * @default 1
   */
  current?: number;
  /**
   * Whether the fields is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, hide the next-page button.
   * @default false
   */
  hideNextButton?: boolean;
  /**
   * If `true`, hide the previous-page button.
   * @default false
   */
  hidePreviousButton?: boolean;
  /**
   * The hint text displayed in front of jumper `input`.
   */
  hintText?: string;
  /**
  * The hint displayed in the jumper `input` before the user enters a value.
  */
  inputPlaceholder?: string;
  /**
   * Render the item.
   * @param {PaginationRenderItemParams} params The props to spread on a PaginationItem.
   * @returns {ReactNode}
   * @default (item) => <PaginationItem {...item} />
   */
  itemRender?: (item: PaginationItemProps) => ReactNode;
  /**
   * Callback fired when the page is changed.
   *
   * @param {number} page The page active.
   */
  onChange?: (page: number) => void;
  /**
   * Number of data per page
   * @default 5
   */
  pageSize?: number;
  /**
   * Show jumper or not.
   */
  showJumper?: boolean;
  /**
   * Number of always visible pages before and after the current page.
   * @default 1
   */
  siblingCount?: number;
  /**
   * Items total count.
   * @default 0
   */
  total?: number;
}

/**
 * The react component for `mezzanine` pagination.
 */
const Pagination = forwardRef<HTMLElement, PaginationProps>((props, ref) => {
  const {
    className,
    boundaryCount = 1,
    buttonText,
    current = 1,
    disabled = false,
    hideNextButton = false,
    hidePreviousButton = false,
    hintText,
    inputPlaceholder,
    itemRender = (item) => <PaginationItem {...item} />,
    onChange,
    pageSize = 5,
    showJumper = false,
    siblingCount = 1,
    total = 0,
    ...rest
  } = props;

  const { items } = usePagination({
    boundaryCount,
    current,
    disabled,
    hideNextButton,
    hidePreviousButton,
    onChange,
    pageSize,
    siblingCount,
    total,
  });

  return (
    <nav
      {...rest}
      ref={ref}
      aria-label="pagination navigation"
      className={cx(
        classes.host,
        className,
      )}
    >
      <ul
        className={classes.container}
      >
        {
          items.map((item, index) => (
            <li
              className={classes.item}
              // eslint-disable-next-line react/no-array-index-key
              key={index}
            >
              {itemRender(item)}
            </li>
          ))
        }
        {
          showJumper && (
            <li
              className={classes.jumper}
            >
              <PaginationJumper
                buttonText={buttonText}
                disabled={disabled}
                hintText={hintText}
                inputPlaceholder={inputPlaceholder}
                onChange={onChange}
                pageSize={pageSize}
                total={total}
              />
            </li>
          )
        }
      </ul>
    </nav>
  );
});

export default Pagination;
