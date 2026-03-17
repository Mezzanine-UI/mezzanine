import { useEffect, useLayoutEffect } from 'react';

/**
 * 在瀏覽器環境使用 `useLayoutEffect`、在 SSR 環境降級為 `useEffect` 的 Hook。
 *
 * 用於需要在 DOM 繪製前同步執行副作用的場景（例如讀取 layout 資訊），
 * 同時避免伺服器端渲染時因 `useLayoutEffect` 產生警告。
 *
 * @example
 * ```tsx
 * import { useIsomorphicLayoutEffect } from '@mezzanine-ui/react';
 *
 * useIsomorphicLayoutEffect(() => {
 *   // 在 DOM 更新後、繪製前同步執行
 *   measureElement();
 * }, [deps]);
 * ```
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' &&
  window.document &&
  !!window.document.createElement
    ? useLayoutEffect
    : useEffect;
