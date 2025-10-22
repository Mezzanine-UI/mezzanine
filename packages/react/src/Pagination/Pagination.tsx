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
   * Callback fired when the page size is changed
   *
   * @param {number} pageSize
   */
  onChangePageSize?: PaginationPageSizeProps['onChange'];
  /**
   * Number of data per page
   * @default 10
   */
  pageSize?: PaginationPageSizeProps['value'];
  /**
   * Label display before page size selector
   */
  pageSizeLabel?: PaginationPageSizeProps['label'];
  /**
   * Page size options to render
   */
  pageSizeOptions?: PaginationPageSizeProps['options'];
  /**
   * Page size unit after `select`
   */
  pageSizeUnit?: PaginationPageSizeProps['unit'];
  /**
   * Render custom page size option name
   */
  renderPageSizeOptionName?: PaginationPageSizeProps['renderOptionName'];
  /**
   * Show jumper or not.
   */
  showJumper?: boolean;
  /**
   * Ship page size or not
   */
  showPageSizeOptions?: boolean;
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
    onChangePageSize,
    pageSize = 10,
    pageSizeLabel,
    pageSizeOptions,
    pageSizeUnit,
    renderPageSizeOptionName,
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
      className={cx(classes.host, className)}
    >
      <ul className={classes.container}>
        {showPageSizeOptions && (
          <li className={classes.pageSize}>
            <PaginationPageSize
              disabled={disabled}
              label={pageSizeLabel}
              onChange={onChangePageSize}
              options={pageSizeOptions}
              renderOptionName={renderPageSizeOptionName}
              unit={pageSizeUnit}
              value={pageSize}
            />
          </li>
        )}
        {items.map((item, index) => (
          <li className={classes.item} key={index}>
            {itemRender(item)}
          </li>
        ))}
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
