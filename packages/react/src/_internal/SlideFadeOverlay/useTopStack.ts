import { useEffect, useMemo, useCallback } from 'react';

let seedStack: number[] = [];

let seed = 1;

export default function useTopStack(open?: boolean) {
  const modalSeed = useMemo(() => seed, []);

  useEffect(() => {
    seed += 1;
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    seedStack = [...seedStack, modalSeed];

    return () => {
      seedStack = seedStack.filter((s) => s !== modalSeed);
    };
  }, [open, modalSeed]);

  return useCallback(
    () => seedStack[seedStack.length - 1] === modalSeed,
    [modalSeed],
  );
}
