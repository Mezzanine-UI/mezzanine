import type {
  DropdownInputPosition,
  DropdownItemSharedProps,
  DropdownLoadingPosition,
  DropdownOption,
  DropdownStatus,
  DropdownType,
} from '@mezzanine-ui/core/dropdown/dropdown';
import type { IconDefinition } from '@mezzanine-ui/icons';
import type { PartialOptions } from 'overlayscrollbars';
import type { ComponentPublicInstance } from 'vue';
import type { ButtonProps } from '../button/button.types';
import type { PopperPlacement } from '../popper/popper.types';

/**
 * What the default slot receives: spread it onto the trigger so the dropdown
 * can position itself against it, open on click and drive keyboard navigation.
 */
export interface DropdownTriggerProps {
  'aria-activedescendant': string | undefined;
  'aria-autocomplete'?: 'list';
  'aria-controls': string;
  'aria-expanded': boolean;
  'aria-haspopup': 'listbox';
  onBlur?: (event: FocusEvent) => void;
  onClick: (event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onKeydown: (event: KeyboardEvent) => void;
  ref: (element: Element | ComponentPublicInstance | null) => void;
  role?: 'combobox';
}

export interface DropdownProps extends DropdownItemSharedProps {
  /**
   * The text of the cancel button.
   */
  actionCancelText?: string;
  /**
   * The text of the clear button.
   */
  actionClearText?: string;
  /**
   * The text of the confirm button.
   */
  actionConfirmText?: string;
  /**
   * The custom action button props of the dropdown.
   */
  actionCustomButtonProps?: ButtonProps;
  /**
   * The text of the custom action button.
   */
  actionText?: string;
  /**
   * The active option index for hover/focus state and Enter selection.
   * Can be set by both keyboard navigation and mouse hover (e.g. in AutoComplete).
   */
  activeIndex?: number | null;
  /**
   * Custom width for the dropdown.
   * Can be a number (pixels) or a string (e.g., '200px', '50%').
   * If provided, this takes precedence over `sameWidth`.
   */
  customWidth?: number | string;
  /**
   * Whether the dropdown is disabled.
   */
  disabled?: boolean;
  /**
   * The icon of the dropdown empty status.
   */
  emptyIcon?: IconDefinition;
  /**
   * The text of the dropdown empty status.
   */
  emptyText?: string;
  /**
   * Whether to enable floating-ui `flip` middleware.
   * When `true`, the dropdown automatically flips to the opposite side along
   * the main axis if it would overflow the viewport, and the enter transition
   * slides from the resolved side. The flip is main-axis only, so a `sameWidth`
   * menu stays horizontally aligned with its anchor.
   * @default false
   */
  flip?: boolean;
  /**
   * The text to follow for highlighting in dropdown options.
   * If provided, this will be used instead of auto-extracting from the trigger.
   */
  followText?: string;
  /**
   * Whether to enable portal.
   * This prop is only relevant when `inputPosition` is set to 'outside'.
   * @default true
   */
  globalPortal?: boolean;
  /**
   * The id of the dropdown.
   */
  id?: string;
  /**
   * The position of the input.
   * @default 'outside'
   */
  inputPosition?: DropdownInputPosition;
  /**
   * Whether to match the input value.
   * @default false
   */
  isMatchInputValue?: boolean;
  /**
   * The keyboard-only active index.
   * When provided, only this index triggers the focus ring (`--keyboard-active`).
   * Mouse hover updates `activeIndex` for Enter selection but should not update this.
   */
  keyboardActiveIndex?: number | null;
  /**
   * The listbox id of the dropdown.
   */
  listboxId?: string;
  /**
   * The aria-label for the listbox.
   * If not provided, a default label will be used when there are no options.
   */
  listboxLabel?: string;
  /**
   * The position to display the loading status.
   * Only takes effect when `status === 'loading'`.
   * @default 'full'
   */
  loadingPosition?: DropdownLoadingPosition;
  /**
   * The text of the dropdown loading status.
   */
  loadingText?: string;
  /**
   * The max height of the dropdown list.
   */
  maxHeight?: number | string;
  /**
   * Override the default `min-width` of the dropdown list.
   * Accepts a number (pixels) or any valid CSS length string.
   * Pass `0` to remove the minimum width constraint entirely.
   */
  minWidth?: number | string;
  /**
   * Whether the dropdown is open (controlled).
   */
  open?: boolean;
  /**
   * The options of the dropdown.
   */
  options: DropdownOption[];
  /**
   * The placement of the dropdown.
   */
  placement?: PopperPlacement;
  /**
   * Whether to set the same width as its anchor element.
   * @default false
   */
  sameWidth?: boolean;
  /**
   * Whether to defer the initialization of OverlayScrollbars.
   * @default true
   */
  scrollbarDefer?: boolean | object;
  /**
   * Whether to disable the custom scrollbar component.
   * @default false
   */
  scrollbarDisabled?: boolean;
  /**
   * The maximum width of the scrollable container.
   */
  scrollbarMaxWidth?: number | string;
  /**
   * Additional options to pass to OverlayScrollbars.
   */
  scrollbarOptions?: PartialOptions;
  /**
   * Whether to enable floating-ui `shift` middleware.
   * When `true`, the dropdown slides along the cross axis to stay inside the
   * viewport instead of being clipped.
   * @default false
   */
  shift?: boolean;
  /**
   * If true, display a bar at the top of the dropdown action area.
   * @default false
   */
  showActionShowTopBar?: boolean;
  /**
   * Whether to show the actions.
   */
  showDropdownActions?: boolean;
  /**
   * The status of the dropdown (loading or empty).
   */
  status?: DropdownStatus;
  /**
   * Whether clicking an option row should toggle checked state in multiple mode.
   * Passed through to `MznDropdownItem`.
   */
  toggleCheckedOnClick?: boolean;
  /**
   * The type of the dropdown.
   */
  type?: DropdownType;
  /**
   * The z-index of the dropdown.
   */
  zIndex?: number | string;
}
