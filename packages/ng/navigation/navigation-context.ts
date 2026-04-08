import { InjectionToken } from '@angular/core';

/** Navigation 全域啟用狀態上下文。 */
export interface NavigationActivatedState {
  readonly activatedPath: readonly string[];
  readonly collapsed: boolean;
  setActivatedPath(path: readonly string[]): void;
  handleCollapseChange(collapsed: boolean): void;
}

/** Navigation 啟用狀態 InjectionToken。 */
export const MZN_NAVIGATION_ACTIVATED =
  new InjectionToken<NavigationActivatedState>('MZN_NAVIGATION_ACTIVATED');

/** NavigationOption 層級上下文。 */
export interface NavigationOptionLevel {
  readonly level: number;
  readonly path: readonly string[];
}

/** NavigationOption 層級 InjectionToken。 */
export const MZN_NAVIGATION_OPTION_LEVEL =
  new InjectionToken<NavigationOptionLevel>('MZN_NAVIGATION_OPTION_LEVEL');
