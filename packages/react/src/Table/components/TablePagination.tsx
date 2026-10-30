'use client';

import { type RefAttributes, memo } from 'react';
import Pagination, { PaginationProps } from '../../Pagination';

export type TablePaginationProps = PaginationProps;

const TablePaginationInner = function TablePagination({
  ref,
  ...props
}: TablePaginationProps & RefAttributes<HTMLElement>) {
  return <Pagination ref={ref} {...props} />;
};

export const TablePagination = memo(TablePaginationInner);
