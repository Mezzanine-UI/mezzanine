import type { Component, ComputedRef, InjectionKey } from 'vue';

export interface NavigationOptionLevelContextValue {
  /** How deep the surrounding option is; the top level is 0. */
  level: number;
  /** The keys of every option above this one, root first. */
  path: string[];
}

export const navigationOptionLevelContextDefaultValues: NavigationOptionLevelContextValue =
  {
    level: 0,
    path: [],
  };

export interface NavigationActivatedContextValue {
  /** The path of the option currently marked active. */
  activatedPath: string[];
  /** That same path joined with `::`, for prefix comparisons. */
  activatedPathKey: string;
  /** Whether the navigation is showing its collapsed rail. */
  collapsed: boolean;
  /** The keys of the level-1 options the collapsed rail could not fit. */
  collapsedHiddenKeys: Set<string>;
  /** The pathname the browser is on, once it is known. */
  currentPathname: string | null;
  /** What the search field currently holds. */
  filterText: string;
  /** Asks the navigation to collapse or expand. */
  handleCollapseChange: (newCollapsed: boolean) => void;
  /** The component every option with an `href` renders as. */
  optionsAnchorComponent?: Component | string;
  /** Reports the path of the option that was just chosen. */
  setActivatedPath: (path: string[]) => void;
}

/**
 * Provided by `MznNavigation`, injected by everything inside it.
 *
 * Carries a `ComputedRef` rather than a plain object so the parts re-render
 * when the navigation collapses or the activated path moves; React gets that
 * from re-rendering the provider.
 */
export const NAVIGATION_ACTIVATED_CONTEXT: InjectionKey<
  ComputedRef<NavigationActivatedContextValue>
> = Symbol('MznNavigationActivatedContext');

/**
 * How deep the options nested inside this one are. Provided afresh by every
 * option, so each level sees its own.
 */
export const NAVIGATION_OPTION_LEVEL_CONTEXT: InjectionKey<
  ComputedRef<NavigationOptionLevelContextValue>
> = Symbol('MznNavigationOptionLevelContext');
