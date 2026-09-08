import type { ComputedRef, InjectionKey } from 'vue';

export interface AccordionControlContextValue {
  /** The id the content carries, derived from the title's own id. */
  contentId?: string;
  /** Whether the accordion refuses to toggle. */
  disabled: boolean;
  /** Whether the accordion is currently expanded. */
  expanded: boolean;
  /** The id of the title, used to label the content. */
  titleId?: string;
  /** Asks the accordion to move to the given expanded state. */
  toggleExpanded(e: boolean): void;
}

/**
 * Provided by `MznAccordion`, injected by its title and content.
 *
 * Carries a `ComputedRef` rather than a plain object so the parts re-render
 * when the accordion opens; React gets that from re-rendering the provider.
 */
export const ACCORDION_CONTROL_CONTEXT: InjectionKey<
  ComputedRef<AccordionControlContextValue>
> = Symbol('MznAccordionControlContext');
