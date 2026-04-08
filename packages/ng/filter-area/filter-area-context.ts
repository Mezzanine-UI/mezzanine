import { InjectionToken, Signal } from '@angular/core';
import type { FilterAreaSize } from '@mezzanine-ui/core/filter-area';

export interface FilterAreaContextValue {
  readonly expanded: Signal<boolean>;
  readonly size: FilterAreaSize;
}

/**
 * FilterArea 透過此 token 向子元件提供 size 與 expanded 上下文。
 * 子元件可透過 `inject(MZN_FILTER_AREA_CONTEXT, { optional: true })` 取得。
 */
export const MZN_FILTER_AREA_CONTEXT =
  new InjectionToken<FilterAreaContextValue>('MZN_FILTER_AREA_CONTEXT');
