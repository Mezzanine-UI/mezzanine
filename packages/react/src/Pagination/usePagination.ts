import { useMemo } from 'react';
import { PaginationItemProps } from './PaginationItem';

export interface UsePaginationParams {
  boundaryCount?: number;
  current?: number;
  disabled?: boolean;
  hideNextButton?: boolean;
  hidePreviousButton?: boolean;
  pageSize?: number;
  onChange?: (page: number) => void;
  siblingCount?: number;
  total?: number;
}

export const range = (start: number, end: number) => {
  const length = end - start + 1;

  return Array.from({ length }, (_, i) => start + i);
};

export function usePagination(props: UsePaginationParams = {}) {
  const {
    boundaryCount = 1,
    current = 1,
    disabled = false,
    hideNextButton = false,
    hidePreviousButton = false,
    pageSize = 10,
    onChange: handleChange,
    siblingCount = 1,
    total = 0,
  } = props;

  const totalPages = total ? Math.ceil(total / pageSize) : 1;

  const itemList: (number | string)[] = useMemo(() => {
    const startPages = range(1, Math.min(boundaryCount, totalPages));
    const endPages = range(
      Math.max(totalPages - boundaryCount + 1, boundaryCount + 1),
      totalPages,
    );

    const siblingsStart = Math.max(
      Math.min(
        current - siblingCount,
        totalPages - boundaryCount - siblingCount * 2 - 1,
      ),
      boundaryCount + 2,
    );

    const siblingsEnd = Math.min(
      Math.max(current + siblingCount, boundaryCount + siblingCount * 2 + 2),
      endPages.length > 0 ? endPages[0] - 2 : totalPages - 1,
    );

    return [
      ...(hidePreviousButton ? [] : ['previous']),

      ...startPages,

      // eslint-disable-next-line no-nested-ternary
      ...(siblingsStart > boundaryCount + 2
        ? ['ellipsis']
        : boundaryCount + 1 < totalPages - boundaryCount
          ? [boundaryCount + 1]
          : []),
      ...range(siblingsStart, siblingsEnd),
      // eslint-disable-next-line no-nested-ternary
      ...(siblingsEnd < totalPages - boundaryCount - 1
        ? ['ellipsis']
        : totalPages - boundaryCount > boundaryCount
          ? [totalPages - boundaryCount]
          : []),

      ...endPages,

      ...(hideNextButton ? [] : ['next']),
    ];
  }, [
    boundaryCount,
    current,
    hideNextButton,
    hidePreviousButton,
    siblingCount,
    totalPages,
  ]);

  const handleClick = (page: number) => {
    if (handleChange) {
      handleChange(page);
    }
  };

  const items: PaginationItemProps[] = useMemo(
    () =>
      itemList.map((item: string | number) => {
        if (typeof item === 'number') {
          return {
            active: item === current,
            'aria-current': item === current ? true : undefined,
            'aria-disabled': disabled ? true : undefined,
            'aria-label': `Go to ${item} page`,
            disabled,
            onClick: () => {
              handleClick(item);
            },
            page: item,
            type: 'page',
          };
        }

        const restItemProps: { [key: string]: PaginationItemProps } = {
          previous: {
            'aria-label': 'Go to previous Page',
            disabled: disabled || current - 1 < 1,
            onClick: () => {
              handleClick(current - 1);
            },
            type: item,
          },
          next: {
            'aria-label': 'Go to next Page',
            disabled: disabled || current + 1 > totalPages,
            onClick: () => {
              handleClick(current + 1);
            },
            type: item,
          },
          ellipsis: {
            disabled,
            type: item,
          },
        };

        return restItemProps[item] || { type: item };
      }),
    [current, disabled, itemList, totalPages],
  );

  return {
    items,
  };
}
