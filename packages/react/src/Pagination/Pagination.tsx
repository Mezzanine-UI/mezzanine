import {
  forwardRef,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
} from 'react';
import { paginationClasses as classes } from '@mezzanine-ui/core/pagination';
import PaginationItem, { PaginationItemProps } from './PaginationItem';
import PaginationJumper from './PaginationJumper';
import PaginationPageSize, {
  PaginationPageSizeProps,
} from './PaginationPageSize';
import { usePagination } from './usePagination';
import { cx } from '../utils/cx';
import Typography from '../Typography';

export interface PaginationProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
    'onChange'
  > {
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
   * If `true`, the fields are disabled.
   */
  disabled?: true;
  /**
   * The hint text displayed in front of jumper `input`.
   */
  hintText?: string;
  /**
   * The placeholder displayed in the jumper input before the user enters a value.
   */
  inputPlaceholder?: string;
  /**
   * Render the item.
   * @param {PaginationItemProps} item The props to spread on a PaginationItem.
   * @returns {ReactNode}
   * @default (item) => <PaginationItem {...item} />
   */
  itemRender?: (item: PaginationItemProps) => ReactNode;
  /**
   * Callback fired when the page is changed.
   * @param {number} page The active page number.
   */
  onChange?: (page: number) => void;
  /**
   * Callback fired when the page size is changed.
   * @param {number} pageSize The new page size.
   */
  onChangePageSize?: PaginationPageSizeProps['onChange'];
  /**
   * Number of items per page.
   * @default 10
   */
  pageSize?: PaginationPageSizeProps['value'];
  /**
   * Label displayed before page size selector.
   */
  pageSizeLabel?: PaginationPageSizeProps['label'];
  /**
   * Page size options to render.
   */
  pageSizeOptions?: PaginationPageSizeProps['options'];
  /**
   * Render custom result summary.
   * @param {number} from Start index of current page.
   * @param {number} to End index of current page.
   * @param {number} total Total number of items.
   * @returns {string}
   * @example (from, to, total) => `目前顯示 ${from}-${to} 筆，共 ${total} 筆資料`
   */
  renderResultSummary?: (from: number, to: number, total: number) => string;
  /**
   * Render custom page size option name.
   */
  renderPageSizeOptionName?: PaginationPageSizeProps['renderOptionName'];
  /**
   * If `true`, show jumper.
   * @default false
   */
  showJumper?: boolean;
  /**
   * If `true`, show page size options.
   * @default false
   */
  showPageSizeOptions?: boolean;
  /**
   * Number of always visible pages before and after the current page.
   * @default 1
   */
  siblingCount?: number;
  /**
   * Total number of items.
   * @default 0
   */
  total?: number;
}

/**
 * The react component for `mezzanine` pagination.
 */
const Pagination = forwardRef<HTMLElement, PaginationProps>((props, ref) => {
  const {
    boundaryCount = 1,
    buttonText,
    className,
    current = 1,
    disabled,
    hintText,
    inputPlaceholder,
    itemRender = (item) => <PaginationItem {...item} />,
    onChange,
    onChangePageSize,
    pageSize = 10,
    pageSizeLabel,
    pageSizeOptions,
    renderPageSizeOptionName,
    renderResultSummary,
    showJumper = false,
    showPageSizeOptions = false,
    siblingCount = 1,
    total = 0,
    ...rest
  } = props;

  const { items } = usePagination({
    boundaryCount,
    current,
    disabled,
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
      className={cx(classes.host, className)}
    >
      {renderResultSummary && (
        <Typography variant="label-primary" className={classes.resultSummary}>
          {renderResultSummary(
            pageSize * (current - 1) + 1,
            Math.min(pageSize * current, total),
            total,
          )}
        </Typography>
      )}
      {showPageSizeOptions && (
        <li className={classes.pageSize}>
          <PaginationPageSize
            disabled={disabled}
            label={pageSizeLabel}
            onChange={onChangePageSize}
            options={pageSizeOptions}
            renderOptionName={renderPageSizeOptionName}
            value={pageSize}
          />
        </li>
      )}

      <ul className={classes.container}>
        <li>
          <ul className={classes.itemList}>
            {items.map((item, index) => (
              <li className={classes.item} key={index}>
                {itemRender(item)}
              </li>
            ))}
          </ul>
        </li>
        {showJumper && (
          <li className={classes.jumper}>
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
        )}
      </ul>
    </nav>
  );
});

export default Pagination;
