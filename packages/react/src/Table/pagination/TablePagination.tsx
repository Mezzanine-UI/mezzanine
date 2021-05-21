import {
  forwardRef,
  useContext,
  RefObject,
} from 'react';
import {
  tableClasses as classes,
} from '@mezzanine-ui/core/table';
import { TableContext, TableDataContext } from '../TableContext';
import { NativeElementPropsWithoutKeyAndRef } from '../../utils/jsx-types';
import { cx } from '../../utils/cx';
import Pagination from '../../Pagination';
import { useTablePagination } from './useTablePagination';

export interface TablePaginationProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * body scroll ref
   */
  bodyRef: RefObject<HTMLDivElement>;
}

const TablePagination = forwardRef<HTMLDivElement, TablePaginationProps>(
  function TablePagination(props, ref) {
    const {
      className,
      bodyRef,
      ...rest
    } = props;

    const {
      pagination,
    } = useContext(TableContext) || {};

    const {
      dataSource = [],
    } = useContext(TableDataContext) || {};

    const [currentPage, setCurrentPage, options] = useTablePagination({
      bodyRef,
      current: pagination?.current,
      dataSource,
      onChange: pagination?.onChange,
      options: pagination?.options,
      total: pagination?.total,
    });

    const currentStartCount: number = (options.pageSize * (currentPage - 1)) + 1;
    const currentEndCount: number = Math.min(options.pageSize * currentPage, options.total);

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(
          classes.pagination,
          className,
        )}
      >
        <span className={classes.paginationIndicator}>
          {`目前顯示 ${currentStartCount} - ${currentEndCount} 筆，共 ${options.total} 筆資料`}
        </span>
        <div className={classes.paginationActions}>
          <Pagination
            boundaryCount={options.boundaryCount}
            className={options.className}
            current={currentPage}
            disabled={options.disabled}
            hideNextButton={options.hideNextButton}
            hidePreviousButton={options.hidePreviousButton}
            onChange={setCurrentPage}
            pageSize={options.pageSize}
            siblingCount={options.siblingCount}
            total={options.total}
          />
        </div>
      </div>
    );
  },
);

export default TablePagination;
