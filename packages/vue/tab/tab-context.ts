import type { ComputedRef, InjectionKey } from 'vue';

/** Mirrors React's `Key` for the subset Vue vnode keys can carry. */
export type TabKey = string | number;

export interface TabContext {
  /** The key of the currently active item, controlled or internal. */
  activeKey: ComputedRef<TabKey>;
  /** Registers an item on mount and returns its zero-based position. */
  register(): number;
  /** Removes an item's registration on unmount. */
  unregister(index: number): void;
  /** Called by an item when it is clicked while not already active. */
  select(key: TabKey, index: number): void;
  /**
   * Reported by whichever item is active so the parent can measure it for the
   * active bar. React reaches the same element through a ref passed down by
   * `cloneElement`.
   */
  setActiveElement(element: HTMLButtonElement | null): void;
}

export const TAB_CONTEXT: InjectionKey<TabContext> = Symbol('MznTabContext');
