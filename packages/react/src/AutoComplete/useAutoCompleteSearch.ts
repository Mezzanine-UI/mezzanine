import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type UseAutoCompleteSearchParams = {
  asyncData: boolean;
  loading: boolean;
  onSearch?: (input: string) => void | Promise<void>;
  searchDebounceTime: number;
};

type RunSearchOptions = {
  immediate?: boolean;
};

export function useAutoCompleteSearch({
  asyncData,
  loading,
  onSearch,
  searchDebounceTime,
}: UseAutoCompleteSearchParams) {
  const [internalLoading, setInternalLoading] = useState(false);
  const requestSeqRef = useRef(0);

  const executeSearch = useCallback(
    (searchValue: string) => {
      if (!onSearch) {
        if (asyncData) setInternalLoading(false);
        return;
      }

      if (!asyncData) {
        onSearch(searchValue);
        return;
      }

      const currentSeq = requestSeqRef.current + 1;
      requestSeqRef.current = currentSeq;
      setInternalLoading(true);

      try {
        const result = onSearch(searchValue);
        const finalize = () => {
          if (requestSeqRef.current === currentSeq) {
            setInternalLoading(false);
          }
        };

        if (result instanceof Promise) {
          result.finally(finalize);
        } else {
          finalize();
        }
      } catch (error) {
        // Handle synchronous errors that occur before Promise creation
        // Reset loading state to prevent UI from being stuck in loading state
        if (requestSeqRef.current === currentSeq) {
          setInternalLoading(false);
        }
        // Re-throw error to allow calling code to handle it
        // This is necessary because the error occurred synchronously and the caller
        // should be aware of it (e.g., for error logging or user notification)
        throw error;
      }
    },
    [asyncData, onSearch],
  );

  const debouncedSearch = useMemo(
    () => debounce((value: string) => executeSearch(value), searchDebounceTime),
    [executeSearch, searchDebounceTime],
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const runSearch = useCallback(
    (searchValue: string, options?: RunSearchOptions) => {
      if (options?.immediate) {
        debouncedSearch.cancel();
        executeSearch(searchValue);
        return;
      }

      if (!searchValue) {
        debouncedSearch.cancel();
        executeSearch(searchValue);
        return;
      }

      debouncedSearch(searchValue);
    },
    [debouncedSearch, executeSearch],
  );

  return {
    cancelSearch: debouncedSearch.cancel,
    internalLoading,
    isLoading: asyncData ? internalLoading || loading : loading,
    runSearch,
  };
}
