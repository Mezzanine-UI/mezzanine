import { RefObject, useEffect, useState } from 'react';

type ScrollState = 'begin' | 'middle' | 'end';

export default function useTabsOverflow(tabsRef: RefObject<HTMLElement>) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [scrollState, setScrollState] = useState<ScrollState>('begin');
  const isScrollToBegin = scrollState === 'begin';
  const isScrollToEnd = scrollState === 'end';

  function scrollToLeft() {
    if (tabsRef.current) {
      tabsRef.current.scrollTo(0, 0);
    }
  }

  function scrollToRight() {
    if (tabsRef.current) {
      const offsetRight =
        tabsRef.current.scrollWidth - tabsRef.current.clientWidth;

      tabsRef.current.scrollTo(offsetRight, 0);
    }
  }

  useEffect(() => {
    if (tabsRef.current) {
      const handleOverflowingState = () => {
        if (tabsRef.current) {
          setIsOverflowing(
            tabsRef.current.scrollWidth > tabsRef.current.clientWidth,
          );
        }
      };

      const handleScrollState = () => {
        if (tabsRef.current) {
          const offsetRight =
            tabsRef.current.scrollWidth - tabsRef.current.clientWidth;

          if (tabsRef.current.scrollLeft === 0) {
            setScrollState('begin');
          } else if (tabsRef.current.scrollLeft >= offsetRight) {
            setScrollState('end');
          } else {
            setScrollState('middle');
          }
        }
      };

      // init isOverflowing when mounting
      handleOverflowingState();

      window.addEventListener('resize', handleOverflowingState);
      tabsRef.current.addEventListener('scroll', handleScrollState);

      return () => {
        if (tabsRef.current) {
          window.removeEventListener('resize', handleOverflowingState);
          tabsRef.current.removeEventListener('scroll', handleScrollState);
        }
      };
    }
  }, [tabsRef.current]);

  return {
    isOverflowing,
    isScrollToBegin,
    isScrollToEnd,
    scrollToLeft,
    scrollToRight,
  };
}
