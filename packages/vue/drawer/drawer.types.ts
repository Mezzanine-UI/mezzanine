import type {
  ButtonIconType,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
import type { DrawerSize } from '@mezzanine-ui/core/drawer';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import type { IconDefinition } from '@mezzanine-ui/icons';
import type { BackdropProps } from '../backdrop/backdrop.types';

export interface DrawerProps
  extends Pick<
    BackdropProps,
    'container' | 'disableCloseOnBackdropClick' | 'disablePortal' | 'open'
  > {
  /**
   * Disabled state for the ghost action button.
   */
  bottomGhostActionDisabled?: boolean;
  /**
   * Icon for the ghost action button.
   */
  bottomGhostActionIcon?: IconDefinition;
  /**
   * Icon type for the ghost action button.
   */
  bottomGhostActionIconType?: ButtonIconType;
  /**
   * Loading state for the ghost action button.
   */
  bottomGhostActionLoading?: boolean;
  /**
   * Size for the ghost action button.
   */
  bottomGhostActionSize?: ButtonSize;
  /**
   * Text for the ghost action button in the bottom action area.
   */
  bottomGhostActionText?: string;
  /**
   * Variant for the ghost action button.
   * @default 'base-ghost'
   */
  bottomGhostActionVariant?: ButtonVariant;
  /**
   * Click handler for the ghost action button in the bottom action area.
   *
   * Stays a prop rather than becoming an emit: its name does not start with
   * `on`, so React counts it as an input and so does the contract.
   */
  bottomOnGhostActionClick?: VoidFunction;
  /**
   * Click handler for the primary action button in the bottom action area.
   */
  bottomOnPrimaryActionClick?: VoidFunction;
  /**
   * Click handler for the secondary action button in the bottom action area.
   */
  bottomOnSecondaryActionClick?: VoidFunction;
  /**
   * Disabled state for the primary action button.
   */
  bottomPrimaryActionDisabled?: boolean;
  /**
   * Icon for the primary action button.
   */
  bottomPrimaryActionIcon?: IconDefinition;
  /**
   * Icon type for the primary action button.
   */
  bottomPrimaryActionIconType?: ButtonIconType;
  /**
   * Loading state for the primary action button.
   */
  bottomPrimaryActionLoading?: boolean;
  /**
   * Size for the primary action button.
   */
  bottomPrimaryActionSize?: ButtonSize;
  /**
   * Text for the primary action button in the bottom action area.
   */
  bottomPrimaryActionText?: string;
  /**
   * Variant for the primary action button.
   * @default 'base-primary'
   */
  bottomPrimaryActionVariant?: ButtonVariant;
  /**
   * Disabled state for the secondary action button.
   */
  bottomSecondaryActionDisabled?: boolean;
  /**
   * Icon for the secondary action button.
   */
  bottomSecondaryActionIcon?: IconDefinition;
  /**
   * Icon type for the secondary action button.
   */
  bottomSecondaryActionIconType?: ButtonIconType;
  /**
   * Loading state for the secondary action button.
   */
  bottomSecondaryActionLoading?: boolean;
  /**
   * Size for the secondary action button.
   */
  bottomSecondaryActionSize?: ButtonSize;
  /**
   * Text for the secondary action button in the bottom action area.
   */
  bottomSecondaryActionText?: string;
  /**
   * Variant for the secondary action button.
   * @default 'base-secondary'
   */
  bottomSecondaryActionVariant?: ButtonVariant;
  /**
   * Key prop for forcing content remount when data changes.
   * Use this to prevent DOM residue when list items decrease (e.g., records.length).
   * If not provided, content will auto-remount when drawer reopens.
   */
  contentKey?: number | string;
  /**
   * Controls whether to disable closing drawer while escape key down.
   * @default false
   */
  disableCloseOnEscapeKeyDown?: boolean;
  /**
   * The label of the all radio in filter area.
   */
  filterAreaAllRadioLabel?: string;
  /**
   * The label of the custom button in filter area.
   */
  filterAreaCustomButtonLabel?: string;
  /**
   * The default value of the radio group in filter area.
   */
  filterAreaDefaultValue?: string;
  /**
   * Whether the filter area content is empty (for disabling custom button).
   */
  filterAreaIsEmpty?: boolean;
  /**
   * The callback function when the custom button is clicked in filter area.
   */
  filterAreaOnCustomButtonClick?: VoidFunction;
  /**
   * The callback function when the radio group value changes in filter area.
   */
  filterAreaOnRadioChange?: (event: Event) => void;
  /**
   * Callback fired when a filter bar dropdown option is selected.
   * Only used when `filterAreaOptions` is non-empty.
   */
  filterAreaOnSelect?: (option: DropdownOption) => void;
  /**
   * Options for the filter bar dropdown.
   * When non-empty, the right-side filter area button is replaced by a dropdown
   * triggered by a `DotHorizontalIcon` icon button.
   */
  filterAreaOptions?: DropdownOption[];
  /**
   * The label of the read radio in filter area.
   */
  filterAreaReadRadioLabel?: string;
  /**
   * Controls whether to display the filter area.
   * @default false
   */
  filterAreaShow?: boolean;
  /**
   * Controls whether to display the unread button in filter area.
   * @default false
   */
  filterAreaShowUnreadButton?: boolean;
  /**
   * The label of the unread radio in filter area.
   */
  filterAreaUnreadRadioLabel?: string;
  /**
   * The value of the radio group in filter area.
   */
  filterAreaValue?: string;
  /**
   * Title text displayed in the drawer header.
   */
  headerTitle?: string;
  /**
   * Controls whether to display the bottom action area.
   */
  isBottomDisplay?: boolean;
  /**
   * Controls whether to display the header area.
   */
  isHeaderDisplay?: boolean;
  /**
   * Controls the width of the drawer.
   * @default 'medium'
   */
  size?: DrawerSize;
}
