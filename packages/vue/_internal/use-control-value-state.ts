import { computed, ref, watch } from 'vue';
import type { ComputedRef } from 'vue';

export interface UseControlValueStateOptions<V> {
  /** The value used while uncontrolled. */
  defaultValue: V;
  /** How two values are compared; identity by default. */
  equalityFn?: (a: V, b: V) => boolean;
  /** Reads the controlled value. `undefined` means uncontrolled. */
  value: () => V | undefined;
}

export interface ControlValueState<V> {
  /** How the two values are compared, handed back for reuse. */
  equalityFn: (a: V, b: V) => boolean;
  /** Sets the internal value; ignored while a controlled value is present. */
  setValue: (next: V) => void;
  /** The controlled value when there is one, else the internal one. */
  value: ComputedRef<V>;
}

/**
 * 受控／非受控狀態的底層管理 composable。
 *
 * 有 `value` 時以它為準，沒有時用內部狀態；`value` 從外部變動時內部狀態會跟著同步，
 * 因此之後若改為非受控也不會跳回舊值。
 *
 * @example
 * ```ts
 * const { setValue, value } = useControlValueState({
 *   defaultValue: '',
 *   value: () => props.value,
 * });
 * ```
 *
 * @see useInputControlValue 文字輸入的版本
 */
export function useControlValueState<V>(
  options: UseControlValueStateOptions<V>,
): ControlValueState<V> {
  const {
    defaultValue,
    equalityFn = (a, b) => a === b,
    value: valueProp,
  } = options;

  const internal = ref(valueProp() ?? defaultValue) as { value: V };

  /**
   * To sync value while changed from uncontrolled to controlled.
   */
  watch(valueProp, (next) => {
    if (typeof next !== 'undefined' && !equalityFn(next, internal.value)) {
      internal.value = next;
    }
  });

  return {
    equalityFn,
    setValue: (next: V) => {
      internal.value = next;
    },
    value: computed((): V => valueProp() ?? internal.value),
  };
}
