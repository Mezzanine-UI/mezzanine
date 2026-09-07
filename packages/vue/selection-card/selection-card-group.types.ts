import type { SelectionCardProps } from './selection-card.types';

/**
 * A card described as data, the way `MznSelectionCardGroup` takes it.
 *
 * React's `SelectionCardProps` carries `onChange` and `onClick`; Vue's are
 * emits, so the object form spells them the way `v-bind` hands a listener to a
 * component, as `DropdownActionConfig` does.
 */
export type SelectionCardSelection = SelectionCardProps & {
  /** Invoked by the input change event. */
  onChange?: (event: Event) => void;
  /** Invoked when the card is clicked. */
  onClick?: (event: MouseEvent) => void;
};

export interface SelectionCardGroupProps {
  /**
   * The selections array.
   * When provided, selection cards will be automatically rendered.
   * Ignored when the default slot has content.
   */
  selections?: SelectionCardSelection[];
}
