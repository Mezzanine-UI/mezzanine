import { forwardRef, useContext, RefObject } from 'react';
import { tableClasses as classes } from '@mezzanine-ui/core/table';
import { TableContext } from '../TableContext';
import { NativeElementPropsWithoutKeyAndRef } from '../../utils/jsx-types';
import { cx } from '../../utils/cx';
import Pagination from '../../Pagination';
import { useTablePagination } from './useTablePagination';

export interface TablePaginationProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * body scroll ref
   */
  bodyRef: RefObject<HTMLDivElement | null>;
}

const TablePagination = forwardRef<HTMLDivElement, TablePaginationProps>(
  function TablePagination(props, ref) {
    const { className, bodyRef, ...rest } = props;

    const { pagination } = useContext(TableContext) || {};

    const {
      current: currentPageProp,
      onChange: onChangePageProp,
      total,
      options: paginationOptions = {},
    } = pagination || {};

    const [currentPage, setCurrentPage] = useTablePagination({
      bodyRef,
      current: currentPageProp,
      onChange: onChangePageProp,
    });

    const {
      boundaryCount,
      className: paginationClassName,
      disabled,
      hideNextButton,
      hidePreviousButton,
      jumperButtonText,
      jumperHintText,
      jumperInputPlaceholder,
      onChangePageSize,
      pageSize: pageSizeProp,
      pageSizeLabel,
      pageSizeOptions,
      pageSizeUnit,
      renderPageSizeOptionName,
      renderPaginationSummary,
      showJumper,
      showPageSizeOptions,
      siblingCount,
    } = paginationOptions;

    const currentStartCount: number =
      (pageSizeProp as number) * (currentPage - 1) + 1;
    const currentEndCount: number = Math.min(
      (pageSizeProp as number) * currentPage,
      total as number,
    );

    return (
      <div {...rest} ref={ref} className={cx(classes.pagination, className)}>
        <span className={classes.paginationIndicator}>
          {renderPaginationSummary?.(currentStartCount, currentEndCount) ??
            `目前顯示 ${currentStartCount} - ${currentEndCount} 筆，共 ${total} 筆資料`}
        </span>
        <div className={classes.paginationActions}>
          <Pagination
            boundaryCount={boundaryCount}
            buttonText={jumperButtonText}
            className={paginationClassName}
            current={currentPage}
            disabled={disabled}
            hideNextButton={hideNextButton}
            hidePreviousButton={hidePreviousButton}
            hintText={jumperHintText}
            inputPlaceholder={jumperInputPlaceholder}
            onChange={setCurrentPage}
            onChangePageSize={onChangePageSize}
            pageSize={pageSizeProp}
            pageSizeLabel={pageSizeLabel}
            pageSizeOptions={pageSizeOptions}
            pageSizeUnit={pageSizeUnit}
            renderPageSizeOptionName={renderPageSizeOptionName}
            showJumper={showJumper}
            showPageSizeOptions={showPageSizeOptions}
            siblingCount={siblingCount}
            total={total}
          />
        </div>
      </div>
    );
  },
);

export default TablePagination;
