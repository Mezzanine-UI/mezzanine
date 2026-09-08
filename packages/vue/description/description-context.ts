import type { ComputedRef, InjectionKey } from 'vue';
import type { DescriptionSize } from '@mezzanine-ui/core/description';

export interface DescriptionContextValue {
  /** The text size every part of the description takes. */
  size: DescriptionSize;
}

/**
 * Provided by `MznDescription`, injected by its content.
 *
 * Carries a `ComputedRef` rather than a plain object so the content re-renders
 * when the description's size changes; React gets that from re-rendering the
 * provider.
 */
export const DESCRIPTION_CONTEXT: InjectionKey<
  ComputedRef<DescriptionContextValue>
> = Symbol('MznDescriptionContext');

export const descriptionContextDefaultValue: DescriptionContextValue = {
  size: 'main',
};
