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
        if (requestSeqRef.current === currentSeq) {
          setInternalLoading(false);
        }
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
