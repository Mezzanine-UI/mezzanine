import type { VNodeChild } from 'vue';
import type { ButtonVariant } from '@mezzanine-ui/core/button';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import type { IconDefinition } from '@mezzanine-ui/icons';
import type { ButtonProps } from '../button/button.types';
import type { DropdownProps } from '../dropdown/dropdown.types';

/**
 * A footer action button described as data, the way `MznPageFooter` takes it.
 *
 * React passes its `ButtonProps` — `children` and `onClick` included —
 * straight into `<Button {...action} />`. Vue's label is a slot and its click
 * is a fallthrough listener, so the object form carries both the way `v-bind`
 * hands them to a component.
 */
export type PageFooterButtonAction = ButtonProps & {
  /** The button label. */
  children?: VNodeChild;
  /** Click handler. */
  onClick?: (event: MouseEvent) => void;
  /** The native button type. */
  type?: 'button' | 'reset' | 'submit';
};

/**
 * React's two members — primary alone, or primary with a secondary — flattened
 * into one shape. `defineProps` never sees this type, but keeping it flat
 * matches how the component reads it.
 */
export interface PageFooterActions {
  /**
   * The primary action, rendered on the right.
   */
  primaryButton: PageFooterButtonAction;
  /**
   * The secondary action, rendered to the left of the primary one.
   */
  secondaryButton?: PageFooterButtonAction;
}

/**
 * The overflow menu described as data. React spreads its `DropdownProps` —
 * handlers included — into `<Dropdown {...dropdownProps} />`; Vue's handlers
 * are emits, so the object form spells them the way `v-bind` hands a listener
 * to a component, as `DropdownActionConfig` does.
 */
export type PageFooterDropdownProps = Partial<DropdownProps> & {
  /** Cancel action clicked. */
  onActionCancel?: () => void;
  /** Clear action clicked. */
  onActionClear?: () => void;
  /** Confirm action clicked. */
  onActionConfirm?: () => void;
  /** Custom action clicked. */
  onActionCustom?: () => void;
  /** The menu closed. */
  onClose?: () => void;
  /** The pointer moved onto an option. */
  onItemHover?: (index: number) => void;
  /** The list scrolled away from the bottom. */
  onLeaveBottom?: () => void;
  /** The menu opened. */
  onOpen?: () => void;
  /** The list reached the bottom. */
  onReachBottom?: () => void;
  /** The list scrolled. */
  onScroll?: (
    computed: { maxScrollTop: number; scrollTop: number },
    target: HTMLDivElement,
  ) => void;
  /** An option was chosen. */
  onSelect?: (option: DropdownOption) => void;
  /** The open state changed. */
  onVisibilityChange?: (open: boolean) => void;
};

/**
 * The type of PageFooter annotation.
 * - `'standard'` — a text button on the left
 * - `'overflow'` — an icon button opening a dropdown
 * - `'information'` — plain caption text
 */
export type PageFooterType = 'information' | 'overflow' | 'standard';

/**
 * React's three members — one per `type` — flattened into a single interface.
 *
 * Each member allows only its own annotation props: `'standard'` takes the
 * supporting action, `'overflow'` requires `dropdownProps`, `'information'`
 * takes `annotation`. Vue's `defineProps` resolves a union discriminated on a
 * literal into something unusable, so all of them are optional here. The prop
 * names, their types and the runtime behaviour are unchanged; what is lost is
 * the compile-time guarantee.
 */
export interface PageFooterProps {
  /**
   * Action buttons configuration for primary and secondary actions.
   * Renders buttons in the order: secondary (left), primary (right).
   */
  actions?: PageFooterActions;
  /**
   * Information type: Plain text to display.
   */
  annotation?: string;
  /**
   * The class name of the annotation wrapper.
   */
  annotationClassName?: string;
  /**
   * Dropdown props for the supporting action button.
   * Required when `type` is 'overflow'.
   */
  dropdownProps?: PageFooterDropdownProps;
  /**
   * Overflow type: Icon for the icon-only button.
   * @default DotHorizontalIcon
   */
  supportingActionIcon?: IconDefinition;
  /**
   * The text/label for the supporting action button in the PageFooter annotation.
   */
  supportingActionName?: VNodeChild;
  /**
   * Click handler for the supporting action button in the PageFooter annotation.
   */
  supportingActionOnClick?: (event: MouseEvent) => void;
  /**
   * The HTML button type for the supporting action.
   */
  supportingActionType?: 'button' | 'reset' | 'submit';
  /**
   * Visual style variant of the supporting action button in the PageFooter
   * (for example, 'base-ghost', 'base-secondary').
   * @default 'base-ghost'
   */
  supportingActionVariant?: ButtonVariant;
  /**
   * The type of PageFooter annotation.
   * @default 'standard'
   */
  type?: PageFooterType;
  /**
   * The warning message in the middle.
   */
  warningMessage?: string;
}
