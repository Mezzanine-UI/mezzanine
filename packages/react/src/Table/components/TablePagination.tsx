'use client';

import { forwardRef, memo } from 'react';
import Pagination, { PaginationProps } from '../../Pagination';

export type TablePaginationProps = PaginationProps;

const TablePaginationInner = forwardRef<HTMLElement, TablePaginationProps>(
  function TablePagination(props, ref) {
    return <Pagination ref={ref} {...props} />;
  },
);

export const TablePagination = memo(TablePaginationInner);
