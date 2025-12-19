'use client';

import { forwardRef, memo } from 'react';
import Pagination, { PaginationProps } from '../../Pagination';

export type TableV2PaginationProps = PaginationProps;

const TableV2PaginationInner = forwardRef<HTMLElement, TableV2PaginationProps>(
  function TableV2Pagination(props, ref) {
    return <Pagination ref={ref} {...props} />;
  },
);

export const TableV2Pagination = memo(TableV2PaginationInner);
