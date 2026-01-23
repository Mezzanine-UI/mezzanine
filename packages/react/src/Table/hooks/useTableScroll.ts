'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { OverlayScrollbars } from 'overlayscrollbars';

export interface UseTableScrollReturn {
  /** Container width (viewport width) */
  containerWidth: number;
  /** OverlayScrollbars scroll event handler */
  handleScrollbarScroll: (instance: OverlayScrollbars, event: Event) => void;
  /** Handler to be passed to Scrollbar's onViewportReady prop */
  handleViewportReady: (
    viewport: HTMLDivElement,
    instance?: OverlayScrollbars,
  ) => void;
  /** Whether the scroll container ref has been set and is ready */
  isContainerReady: boolean;
  isScrollingHorizontally: boolean;
  scrollLeft: number;
  /** Ref object for internal use - points to the actual scrolling element */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Callback ref setter for disabled Scrollbar fallback (plain div) */
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
  const [isContainerReady, setIsContainerReady] = useState(false);
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

  // Setup ResizeObserver on an element
  const setupResizeObserver = useCallback(
    (element: HTMLDivElement) => {
      // Clean up previous observer
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }

      containerRef.current = element;

      if (element && enabled) {
        // Mark container as ready
        setIsContainerReady(true);

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

  // Callback ref for disabled Scrollbar (plain div) fallback
  const setContainerRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (element) {
        setupResizeObserver(element);
      } else {
        // Clean up when element is removed
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
          resizeObserverRef.current = null;
        }

        containerRef.current = null;
        setIsContainerReady(false);
      }
    },
    [setupResizeObserver],
  );

  // Handler for Scrollbar's onViewportReady - receives the viewport element
  const handleViewportReady = useCallback(
    (viewport: HTMLDivElement) => {
      setupResizeObserver(viewport);
    },
    [setupResizeObserver],
  );

  // OverlayScrollbars scroll event handler
  const handleScrollbarScroll = useCallback(
    (_instance: OverlayScrollbars, event: Event) => {
      const target = event.target as HTMLElement;
      const newScrollLeft = target.scrollLeft;

      setScrollLeft(newScrollLeft);
      setIsScrollingHorizontally(newScrollLeft > 0);
    },
    [],
  );

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
      containerRef,
      containerWidth,
      handleScrollbarScroll,
      handleViewportReady,
      isContainerReady,
      isScrollingHorizontally,
      scrollLeft,
      setContainerRef,
    }),
    [
      containerWidth,
      handleScrollbarScroll,
      handleViewportReady,
      isContainerReady,
      isScrollingHorizontally,
      scrollLeft,
      setContainerRef,
    ],
  );
}
