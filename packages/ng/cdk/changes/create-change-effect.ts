export type ChangeEffectFn<T> = (current: T, prev: T | undefined) => void;

export type ChangeEffectEqualFn<T> = (x: T, y: T) => boolean;

export function createChangeEffect<T>(
  effect: ChangeEffectFn<T>,
  equalFn: ChangeEffectEqualFn<T> = (x, y) => x === y,
) {
  let initialized = false;
  let prev: T | undefined;

  function trigger(current: T) {
    if (
      !initialized ||
      !equalFn(current, prev as T)
    ) {
      effect(current, prev);
      prev = current;
    }

    if (!initialized) {
      initialized = true;
    }
  }

  return trigger;
}
