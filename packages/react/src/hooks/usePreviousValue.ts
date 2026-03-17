import { useRef, useEffect } from 'react';

/**
 * 回傳上一次渲染時的值的 Hook。
 *
 * 以 `useEffect` 在渲染完成後更新 ref，因此在本次渲染中取得的是前一次的值，
 * 適用於需要比較前後值差異的情境。
 *
 * @example
 * ```tsx
 * import { usePreviousValue } from '@mezzanine-ui/react';
 *
 * const previousCount = usePreviousValue(count);
 * // previousCount 為 count 上一次渲染的值
 * ```
 */
export function usePreviousValue<T>(value: T): T {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
