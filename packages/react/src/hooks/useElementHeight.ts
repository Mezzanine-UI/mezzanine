import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Custom hook to measure element height using ResizeObserver.
 * Returns the height of the element referenced by the returned ref.
 * @param enabled - Whether the observer is enabled
 * @returns A tuple of [ref, height]
 */
export function useElementHeight<T extends HTMLElement = HTMLElement>(
  enabled: boolean,
): [RefObject<T | null>, number] {
  const ref = useRef<T | null>(null);
  const [height, setHeight] = useState(0);
  const [element, setElement] = useState<T | null>(null);
  const prevElementRef = useRef<T | null>(null);

  // Track element changes using useLayoutEffect to catch ref.current changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const currentElement = ref.current;
    if (currentElement !== prevElementRef.current) {
      prevElementRef.current = currentElement;
      setElement(currentElement);
    }
  });

  useEffect(() => {
    if (!enabled || !element) {
      setHeight(0);
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [enabled, element]);

  return [ref, height];
}
