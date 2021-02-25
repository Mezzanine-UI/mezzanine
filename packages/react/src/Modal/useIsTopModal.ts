import {
  useEffect,
  useMemo,
  useCallback,
} from 'react';

let seedStack: number[] = [];

let seed = 1;

export function useIsTopModal(open?: boolean) {
  const modalSeed = useMemo(() => {
    seed += 1;

    return seed;
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

  return useCallback(() => seedStack[seedStack.length - 1] === modalSeed, [modalSeed]);
}
