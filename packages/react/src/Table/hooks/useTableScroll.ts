'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

export interface UseTableScrollReturn {
  /** Container width (viewport width) */
  containerWidth: number;
  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  isScrollingHorizontally: boolean;
  scrollLeft: number;
  /** Set refs for measuring container width */
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

  const setContainerRef = useCallback((element: HTMLDivElement | null) => {
    containerRef.current = element;
  }, []);

  const measureDimensions = useCallback(() => {
    if (containerRef.current) {
      const newContainerWidth = containerRef.current.clientWidth;

      setContainerWidth((prev) =>
        prev !== newContainerWidth ? newContainerWidth : prev,
      );
    }
  }, []);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const newScrollLeft = target.scrollLeft;

    setScrollLeft(newScrollLeft);
    setIsScrollingHorizontally(newScrollLeft > 0);
  }, []);

  // Set up ResizeObserver to track dimension changes
  useEffect(() => {
    const { current: container } = containerRef;

    if (!container || !enabled) return;

    const resizeObserver = new ResizeObserver(() => {
      measureDimensions();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [measureDimensions, enabled]);

  // Initial measurement after mount
  useEffect(() => {
    if (enabled) {
      measureDimensions();
    }
  }, [measureDimensions, enabled]);

  return useMemo(
    () => ({
      containerWidth,
      handleScroll,
      isScrollingHorizontally,
      scrollLeft,
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
