import { RefObject, useEffect, useState } from 'react';
import { useWindowWidth } from '../hooks/useWindowWidth';

type ScrollState = 'begin' | 'middle' | 'end';

export default function useTabsOverflow(tabsRef: RefObject<HTMLElement>) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [scrollState, setScrollState] = useState<ScrollState>('begin');
  const isScrollToBegin = scrollState === 'begin';
  const isScrollToEnd = scrollState === 'end';

  const windowWidth = useWindowWidth();

  function handleScrollState() {
    if (tabsRef.current) {
      const offsetRight = tabsRef.current.scrollWidth - tabsRef.current.clientWidth;

      if (tabsRef.current.scrollLeft === 0) {
        setScrollState('begin');
      } else if (tabsRef.current.scrollLeft >= offsetRight) {
        setScrollState('end');
      } else {
        setScrollState('middle');
      }
    }
  }

  function scrollToLeft() {
    if (tabsRef.current) {
      tabsRef.current.scrollTo(0, 0);
    }
  }

  function scrollToRight() {
    if (tabsRef.current) {
      const offsetRight = tabsRef.current.scrollWidth - tabsRef.current.clientWidth;

      tabsRef.current.scrollTo(offsetRight, 0);
    }
  }

  useEffect(() => {
    if (tabsRef.current) {
      const isXOverflowing = tabsRef.current.scrollWidth > tabsRef.current.clientWidth;

      if (isOverflowing !== isXOverflowing) {
        setIsOverflowing(isXOverflowing);
      }
    }
  }, [isOverflowing, windowWidth]);

  useEffect(() => {
    if (tabsRef.current) {
      tabsRef.current.addEventListener('scroll', handleScrollState);

      return () => tabsRef.current?.removeEventListener('scroll', handleScrollState);
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
