import type {
  DropdownCheckPosition,
  DropdownItemLevel,
  DropdownItemValidate,
  DropdownMode,
} from '@mezzanine-ui/core/dropdown/dropdown';
import type { IconDefinition } from '@mezzanine-ui/icons';

export interface DropdownItemCardProps {
  /**
   * Whether the option is currently active (highlighted by keyboard navigation).
   * Used to apply visual highlight and drive the `--active` CSS modifier.
   * Note: keyboard focus position is communicated to screen readers via `aria-activedescendant`
   * on the trigger element, not via `aria-selected` on the option itself.
   */
  active?: boolean;
  /**
   * The content to append.
   */
  appendContent?: string;
  /**
   * The icon to append.
   */
  appendIcon?: IconDefinition;
  /**
   * Controlled: Whether the option is selected/checked.
   * Controls checkbox state in multiple mode.
   * When provided, the state is controlled externally.
   */
  checked?: boolean;
  /**
   * The position of the checkbox.
   */
  checkSite?: DropdownCheckPosition;
  /**
   * Uncontrolled: Default checked/selected state.
   * Only used when `checked` is not provided.
   */
  defaultChecked?: boolean;
  /**
   * Whether the dropdown item card is disabled.
   */
  disabled?: boolean;
  /**
   * The text to follow.
   */
  followText?: string;
  /**
   * DOM id for the option, useful for aria-activedescendant.
   */
  id?: string;
  /**
   * Whether the checkbox is in indeterminate state.
   * Used in tree mode when some but not all children are selected.
   */
  indeterminate?: boolean;
  /**
   * The label of the dropdown item card.
   */
  label?: string;
  /**
   * The level of the dropdown item card.
   */
  level?: DropdownItemLevel;
  /**
   * The mode of the dropdown item card.
   */
  mode: DropdownMode;
  /**
   * The accessible name / label for the option.
   * Falls back to label if not provided.
   */
  name?: string;
  /**
   * The icon to prepend.
   */
  prependIcon?: IconDefinition;
  /**
   * Whether to show the underline.
   * @default false
   */
  showUnderline?: boolean;
  /**
   * The subtitle of the dropdown item card.
   */
  subTitle?: string;
  /**
   * Whether clicking the list item should toggle checked state in multiple mode.
   * Used in tree mode when clicking a parent node should toggle the checked state of all its children.
   * @default true
   */
  toggleCheckedOnClick?: boolean;
  /**
   * The validation of the dropdown item card.
   */
  validate?: DropdownItemValidate;
}
