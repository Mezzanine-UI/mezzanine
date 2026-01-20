import { useEffect, useRef, useState } from 'react';
import { NavigationChild } from './Navigation';

export function useVisibleItems(items: NavigationChild[], collapsed: boolean) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number | null>(null);

  useEffect(() => {
    const contentEl = contentRef.current;

    if (!contentEl) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const calculateVisibleItems = () => {
      if (!collapsed) {
        setVisibleCount(null);

        return;
      }

      const contentHeight = contentEl.clientHeight;
      const ul = contentEl.querySelector('ul');

      const option = contentEl.querySelector('.mzn-navigation-option--level-1');

      const optionHeight = (option?.clientHeight || 0) + 4;
      const optionsGapTightFixed = 4;

      if (optionHeight === 0) {
        setVisibleCount(0);
        return;
      }

      if (!ul) return;

      const count =
        Math.floor(
          (contentHeight + optionsGapTightFixed) /
            (optionHeight + optionsGapTightFixed),
        ) - 1;

      setVisibleCount(count);
    };

    const debouncedCalculate = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        calculateVisibleItems();
      }, 100);
    };

    const resizeObserver = new ResizeObserver(() => {
      debouncedCalculate();
    });

    resizeObserver.observe(contentEl);
    calculateVisibleItems();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      resizeObserver.disconnect();
    };
  }, [collapsed, items]);

  return { contentRef, visibleCount };
}
