import type { TagSize } from '@mezzanine-ui/core/tag';
import type { SelectValue } from './select.types';
import type { SelectTriggerInputProps } from './select-trigger.types';

export interface SelectTriggerTagsProps {
  /**
   * Whether the tags and the inline input are disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Other props you may provide to the inline input element.
   */
  inputProps?: SelectTriggerInputProps;
  /**
   * Tag overflow strategy.
   * - counter: collapse extra tags into a counter tag showing the remaining count.
   * - wrap: wrap to new lines to display all tags.
   */
  overflowStrategy: 'counter' | 'wrap';
  /**
   * Whether the tags are read only, which renders them static.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the inline input is required.
   * @default false
   */
  required?: boolean;
  /** The search text shown in the inline input. */
  searchText?: string;
  /**
   * Whether to render the inline text input after the tags.
   * @default false
   */
  showTextInputAfterTags?: boolean;
  /**
   * The size of the tags.
   */
  size?: TagSize;
  /** The selected values, one tag each. */
  value?: SelectValue[];
}
