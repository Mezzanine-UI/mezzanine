import { computed, onBeforeUnmount, ref } from 'vue';
import type { ComputedRef } from 'vue';
import debounce from 'lodash/debounce';

export interface UseAutoCompleteSearchOptions {
  asyncData: () => boolean;
  loading: () => boolean;
  onSearch?: (input: string) => Promise<void> | void;
  searchDebounceTime: () => number;
}

export interface RunSearchOptions {
  /** Skip the debounce and search now. */
  immediate?: boolean;
}

export interface AutoCompleteSearch {
  /** Drops a pending debounced search. */
  cancelSearch: () => void;
  /** Whether the list should show its loading status. */
  isLoading: ComputedRef<boolean>;
  runSearch: (searchValue: string, options?: RunSearchOptions) => void;
}

/**
 * 觸發搜尋並追蹤載入狀態的 composable。
 *
 * 有輸入時 debounce，清空時立刻執行；`asyncData` 開啟時等待 `onSearch` 回傳的
 * Promise 結束才收掉 loading，並以序號忽略過期的請求。
 *
 * @example
 * ```ts
 * const { isLoading, runSearch } = useAutoCompleteSearch({
 *   asyncData: () => props.asyncData,
 *   loading: () => props.loading,
 *   onSearch: (text) => emit('search', text),
 *   searchDebounceTime: () => props.searchDebounceTime,
 * });
 * ```
 *
 * @see MznAutoComplete 使用這個 composable 的元件
 */
export function useAutoCompleteSearch(
  options: UseAutoCompleteSearchOptions,
): AutoCompleteSearch {
  const { asyncData, loading, onSearch, searchDebounceTime } = options;

  const internalLoading = ref(false);
  let requestSeq = 0;

  function executeSearch(searchValue: string): void {
    if (!onSearch) {
      if (asyncData()) internalLoading.value = false;

      return;
    }

    if (!asyncData()) {
      onSearch(searchValue);

      return;
    }

    requestSeq += 1;

    const currentSeq = requestSeq;

    internalLoading.value = true;

    try {
      const result = onSearch(searchValue);
      const finalize = (): void => {
        if (requestSeq === currentSeq) internalLoading.value = false;
      };

      if (result instanceof Promise) {
        result.finally(finalize);
      } else {
        finalize();
      }
    } catch (error) {
      // Handle synchronous errors that occur before Promise creation
      // Reset loading state to prevent UI from being stuck in loading state
      if (requestSeq === currentSeq) internalLoading.value = false;

      // Re-throw so the caller can log or surface it: the failure happened
      // synchronously, before any promise existed to carry it.
      throw error;
    }
  }

  const debouncedSearch = debounce(
    (value: string) => executeSearch(value),
    searchDebounceTime(),
  );

  onBeforeUnmount(() => debouncedSearch.cancel());

  return {
    cancelSearch: () => debouncedSearch.cancel(),
    isLoading: computed((): boolean =>
      asyncData() ? internalLoading.value || loading() : loading(),
    ),
    runSearch: (searchValue: string, runOptions?: RunSearchOptions) => {
      if (runOptions?.immediate || !searchValue) {
        debouncedSearch.cancel();
        executeSearch(searchValue);

        return;
      }

      debouncedSearch(searchValue);
    },
  };
}
