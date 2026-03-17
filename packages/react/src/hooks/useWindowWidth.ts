import { useState, useEffect } from 'react';

/**
 * 追蹤目前視窗寬度的 Hook。
 *
 * 在元件掛載時以 `window.innerWidth` 初始化，並監聽 `resize` 事件持續更新，
 * 元件卸載時自動移除監聽器。
 *
 * @example
 * ```tsx
 * import { useWindowWidth } from '@mezzanine-ui/react';
 *
 * const width = useWindowWidth();
 * const isMobile = width !== undefined && width < 768;
 * ```
 */
export function useWindowWidth(): number | undefined {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  function handleResize(): void {
    setWindowWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return (): void => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
}
