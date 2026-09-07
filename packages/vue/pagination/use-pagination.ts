import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import type { PaginationItemProps } from './pagination-item.types';

/**
 * A computed item, ready to be spread onto `MznPaginationItem`. The aria
 * attributes and the click handler ride along as attributes, the way React
 * spreads them.
 */
export type PaginationItem = PaginationItemProps & {
  'aria-current'?: true;
  'aria-disabled'?: true;
  'aria-label'?: string;
  onClick?: () => void;
};

export interface UsePaginationParams {
  boundaryCount?: () => number | undefined;
  current?: () => number | undefined;
  disabled?: () => boolean | undefined;
  hideFirstButton?: () => boolean | undefined;
  hideLastButton?: () => boolean | undefined;
  hideNextButton?: () => boolean | undefined;
  hidePreviousButton?: () => boolean | undefined;
  onChange?: (page: number) => void;
  pageSize?: () => number | undefined;
  siblingCount?: () => number | undefined;
  total?: () => number | undefined;
}

export interface UsePaginationResult {
  /** The items to render, in order. */
  items: ComputedRef<PaginationItem[]>;
}

export const range = (start: number, end: number): number[] => {
  const length = end - start + 1;

  return Array.from({ length }, (_, i) => start + i);
};

/**
 * 計算分頁項目清單的 composable。
 *
 * 依 `total`、`pageSize`、`current`、`boundaryCount` 與 `siblingCount` 算出頁碼
 * 按鈕、省略號與上一頁／下一頁的項目陣列。
 *
 * @example
 * ```ts
 * import { usePagination } from '@mezzanine-ui/vue/pagination';
 *
 * const { items } = usePagination({
 *   current: () => current.value,
 *   onChange: (page) => (current.value = page),
 *   pageSize: () => 10,
 *   total: () => 100,
 * });
 * ```
 *
 * @see MznPagination 搭配的元件
 */
export function usePagination(
  params: UsePaginationParams = {},
): UsePaginationResult {
  const boundaryCount = (): number => params.boundaryCount?.() ?? 1;
  const current = (): number => params.current?.() ?? 1;
  const disabled = (): boolean => params.disabled?.() ?? false;
  const pageSize = (): number => params.pageSize?.() ?? 10;
  const siblingCount = (): number => params.siblingCount?.() ?? 1;
  const total = (): number => params.total?.() ?? 0;

  const totalPages = computed((): number =>
    total() ? Math.ceil(total() / pageSize()) : 1,
  );

  const itemList = computed((): (number | string)[] => {
    const boundary = boundaryCount();
    const siblings = siblingCount();
    const pages = totalPages.value;
    const page = current();

    const startPages = range(1, Math.min(boundary, pages));
    const endPages = range(Math.max(pages - boundary + 1, boundary + 1), pages);

    const siblingsStart = Math.max(
      Math.min(page - siblings, pages - boundary - siblings * 2 - 1),
      boundary + 2,
    );

    const siblingsEnd = Math.min(
      Math.max(page + siblings, boundary + siblings * 2 + 2),
      endPages.length > 0 ? endPages[0] - 2 : pages - 1,
    );

    return [
      'previous',

      ...startPages,

      ...(siblingsStart > boundary + 2
        ? ['ellipsis']
        : boundary + 1 < pages - boundary
          ? [boundary + 1]
          : []),
      ...range(siblingsStart, siblingsEnd),

      ...(siblingsEnd < pages - boundary - 1
        ? ['ellipsis']
        : pages - boundary > boundary
          ? [pages - boundary]
          : []),

      ...endPages,

      'next',
    ];
  });

  const handleClick = (page: number): void => {
    params.onChange?.(page);
  };

  const items = computed((): PaginationItem[] =>
    itemList.value.map((item) => {
      const page = current();
      const isDisabled = disabled();

      if (typeof item === 'number') {
        return {
          active: item === page,
          'aria-current': item === page ? true : undefined,
          'aria-disabled': isDisabled ? true : undefined,
          'aria-label': `Go to ${item} page`,
          disabled: isDisabled,
          onClick: () => {
            handleClick(item);
          },
          page: item,
          type: 'page',
        };
      }

      const restItemProps: Record<string, PaginationItem> = {
        previous: {
          'aria-label': 'Go to previous page',
          disabled: isDisabled || page === 1,
          onClick: () => {
            handleClick(page - 1);
          },
          type: item,
        },
        next: {
          'aria-label': 'Go to next page',
          disabled: isDisabled || page === totalPages.value,
          onClick: () => {
            handleClick(page + 1);
          },
          type: item,
        },
        ellipsis: {
          disabled: isDisabled,
          type: item,
        },
      };

      return restItemProps[item] || { type: item };
    }),
  );

  return { items };
}
