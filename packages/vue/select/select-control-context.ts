import type { ComputedRef, InjectionKey } from 'vue';
import type { SelectControl } from './select.types';

/**
 * Provided by `MznSelect`, injected by anything inside it that has to read or
 * change the current selection — AutoComplete's dropdown items, for one.
 *
 * Carries a `ComputedRef` rather than a plain object so a consumer re-renders
 * when the selection moves; React gets that from re-rendering the provider.
 */
export const selectControlKey: InjectionKey<
  ComputedRef<SelectControl | undefined>
> = Symbol('MznSelectControl');
