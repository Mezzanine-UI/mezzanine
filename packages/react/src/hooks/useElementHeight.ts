import { RefObject, useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    if (!enabled || !ref.current) {
      setHeight(0);
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [enabled]);

  return [ref, height];
}
