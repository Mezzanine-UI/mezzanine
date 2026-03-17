import { useRef } from 'react';

/**
 * 追蹤並回傳最新值的 ref Hook。
 *
 * 每次渲染時同步更新 ref 的 `current` 屬性，
 * 可用於在非同步回調或 effect 中存取最新的 prop 或 state，而無需將其加入依賴陣列。
 *
 * @example
 * ```tsx
 * import { useLastValue } from '@mezzanine-ui/react';
 *
 * const latestCount = useLastValue(count);
 * useEffect(() => {
 *   setTimeout(() => {
 *     console.log(latestCount.current); // 總是最新的值
 *   }, 1000);
 * }, []);
 * ```
 */
export function useLastValue<T>(value: T): { readonly current: T } {
  const ref = useRef(value);

  ref.current = value;

  return ref;
}
