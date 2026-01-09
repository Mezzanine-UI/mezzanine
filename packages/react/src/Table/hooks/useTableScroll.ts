'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

export interface UseTableScrollReturn {
  /** Container width (viewport width) */
  containerWidth: number;
  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  isScrollingHorizontally: boolean;
  scrollLeft: number;
  /** Ref object for internal use */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Callback ref setter that should be used for the scroll container */
  setContainerRef: (element: HTMLDivElement | null) => void;
}

export function useTableScroll({
  enabled,
}: {
  enabled: boolean;
}): UseTableScrollReturn {
  const [isScrollingHorizontally, setIsScrollingHorizontally] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const measureDimensions = useCallback(() => {
    if (containerRef.current) {
      const newContainerWidth = containerRef.current.clientWidth;

      setContainerWidth((prev) =>
        prev !== newContainerWidth ? newContainerWidth : prev,
      );
    }
  }, []);

  // Callback ref that sets up ResizeObserver when element is attached
  const setContainerRef = useCallback(
    (element: HTMLDivElement | null) => {
      // Clean up previous observer
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }

      containerRef.current = element;

      if (element && enabled) {
        // Measure immediately
        measureDimensions();

        // Set up ResizeObserver
        resizeObserverRef.current = new ResizeObserver(() => {
          measureDimensions();
        });
        resizeObserverRef.current.observe(element);
      }
    },
    [enabled, measureDimensions],
  );

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const newScrollLeft = target.scrollLeft;

    setScrollLeft(newScrollLeft);
    setIsScrollingHorizontally(newScrollLeft > 0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  return useMemo(
    () => ({
      containerWidth,
      handleScroll,
      isScrollingHorizontally,
      scrollLeft,
      containerRef,
      setContainerRef,
    }),
    [
      containerWidth,
      handleScroll,
      isScrollingHorizontally,
      scrollLeft,
      setContainerRef,
    ],
  );
}
