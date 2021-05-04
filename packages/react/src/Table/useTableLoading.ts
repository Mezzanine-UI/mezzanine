import { useControlValueState } from '../Form/useControlValueState';
import { useLastCallback } from '../hooks/useLastCallback';

const equalityFn = (a: boolean, b: boolean) => a === b;

export const SELECTED_ALL_KEY = 'MZN-TABLE-ROW-SELECTION-ALL';

export interface UseTableLoading {
  loading?: boolean;
}

export function useTableLoading(props: UseTableLoading) {
  const {
    loading: loadingProp,
  } = props || {};

  const [loading, setLoading] = useControlValueState({
    defaultValue: false,
    equalityFn,
    value: loadingProp,
  });

  const onChange = useLastCallback<(l: boolean) => void>((isLoading) => {
    if (!equalityFn(loading, isLoading)) setLoading(isLoading);
  });

  return [loading, onChange] as const;
}
