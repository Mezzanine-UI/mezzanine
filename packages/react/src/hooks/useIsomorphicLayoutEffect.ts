import { useLayoutEffect } from 'react';

/**
 * 在 DOM 繪製前同步執行副作用的 Hook，可安全用於 SSR。
 *
 * React 19 起，伺服器端渲染時呼叫 `useLayoutEffect` 不再產生警告（且同樣不會執行），
 * 因此此 Hook 直接等同於 `useLayoutEffect`；保留此 export 以維持既有 API 相容。
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
export const useIsomorphicLayoutEffect = useLayoutEffect;
