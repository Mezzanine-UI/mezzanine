import type { VNodeChild } from 'vue';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import type { IconDefinition } from '@mezzanine-ui/icons';
import type { ButtonProps } from '../button/button.types';
import type { CheckboxProps } from '../checkbox/checkbox.types';
import type { DropdownProps } from '../dropdown/dropdown.types';
import type { InputProps } from '../input/input.types';
import type { SelectProps } from '../select/select.types';
import type { ToggleProps } from '../toggle/toggle.types';

/**
 * A button described as data, the way `MznContentHeader` takes it. React
 * spreads its `ButtonProps` — `children` and `onClick` included — straight
 * into `<Button {...props} />`; Vue's label is a slot and its click a
 * fallthrough listener, so the object form carries both.
 */
export type ContentHeaderAction = ButtonProps & {
  /** The button label. */
  children?: VNodeChild;
  /** Click handler. */
  onClick?: (event: MouseEvent) => void;
  /** The native button type. */
  type?: 'button' | 'reset' | 'submit';
};

/**
 * The filter described as data. React writes `{ variant } & (SearchInputProps
 * | SelectProps | …)`, so the variant is not correlated with the rest; this
 * keeps that shape and adds the handlers each component turns into emits.
 */
export type ContentHeaderFilter = {
  /** Which control the filter renders as. */
  variant: 'checkbox' | 'search' | 'segmentedControl' | 'select' | 'toggle';
} & (
  | (InputProps & {
      onChange?: (event: Event) => void;
      onClear?: (event: MouseEvent) => void;
    })
  | (SelectProps & {
      onChange?: (value: unknown) => void;
      onClear?: (event: MouseEvent) => void;
    })
  | (ToggleProps & { onChange?: (event: Event) => void })
  | (CheckboxProps & { onChange?: (event: Event) => void })
  | { mock: 'SegmentedControlProps' }
);

/**
 * A utility described as data: either an icon-only button, or a dropdown whose
 * `children` is that button.
 */
export type ContentHeaderUtility =
  | (ButtonProps & {
      /** The icon the button shows. Having one is what makes it a button. */
      icon: IconDefinition;
      /** Click handler. */
      onClick?: (event: MouseEvent) => void;
    })
  | (DropdownProps & {
      /** The trigger, which has to be an icon button. */
      children?: VNodeChild;
      /** An option was chosen. */
      onSelect?: (option: DropdownOption) => void;
    });

/**
 * React's two members — one per `size` — flattened into one interface, since
 * `defineProps` cannot resolve a union discriminated on a literal. The names,
 * the types and the runtime behaviour are unchanged; what is lost is the
 * compile-time guarantee that a `sub` header takes no back button.
 */
export interface ContentHeaderProps {
  /**
   * Button configuration for actions.
   * Automatically applies proper styling and order.
   * When conflicting with the default slot, these take priority.
   * Buttons with variants other than primary, secondary, and destructive will not be rendered.
   */
  actions?: ContentHeaderAction[];
  /**
   * Accessible name for the back button.
   *
   * The back button renders as a bare chevron with no visible text, so this is
   * the only thing a screen reader can announce for it — translate it along
   * with the rest of your interface.
   * @default 'Back'
   */
  backButtonLabel?: string;
  /** Optional description text displayed below the title */
  description?: string;
  /** Filter component (search input, select, toggle or checkbox) */
  filter?: ContentHeaderFilter;
  /**
   * Size variant of the toolbar.
   * Affects the size of buttons and the filter component.
   * @default 'main'
   */
  size?: 'main' | 'sub';
  /** Main title text for the content header */
  title: string;
  /**
   * HTML element type for the title (defaults to 'h1' for main size and 'h2' for sub size)
   */
  titleComponent?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  /**
   * Icon-only utility buttons.
   * They usually appear as smaller buttons with only an icon and no text.
   */
  utilities?: ContentHeaderUtility[];
}
