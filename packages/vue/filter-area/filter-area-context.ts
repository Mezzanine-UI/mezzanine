import type { ComputedRef, InjectionKey } from 'vue';
import type { FilterAreaSize } from '@mezzanine-ui/core/filter-area';

export interface FilterAreaContextValue {
  /** The size every field inside the filter area takes. */
  size?: FilterAreaSize;
}

/**
 * Provided by `MznFilterArea`, injected by every filter inside it.
 *
 * Carries a `ComputedRef` rather than a plain object so a filter re-renders
 * when the area's size changes; React gets that from re-rendering the provider.
 */
export const FILTER_AREA_CONTEXT: InjectionKey<
  ComputedRef<FilterAreaContextValue>
> = Symbol('MznFilterAreaContext');
