import type { IconDefinition } from '@mezzanine-ui/icons';

export const dropdownPrefix = 'mzn-dropdown';

export type dropdownPlacement = 'top' | 'bottom' | 'left' | 'right';

export type dropdownStatus = 'loading' | 'empty';

export type dropdownMode = 'single' | 'multiple';

export type dropdownType = 'default' | 'tree' | 'grouped';

export type dropdownItemLevel = 0 | 1 | 2;

export type dropdownItemValidate = 'default' | 'danger';

export type dropdownCheckPosition = 'prepend' | 'append' | 'none';

export type dropdownInputPosition = 'inside' | 'outside';

export type Max3D<T> = T | T[] | T[][] | T[][][];

/**
 * Base dropdown option interface
 */
export interface DropdownOption {
  /**
   * The name of the dropdown option.
   */
  name: string;
  /**
   * The id of the dropdown option.
   */
  id: string;
  /**
   * Whether to show the checkbox.
   * @default false
   */
  showCheckbox?: boolean;
  /**
   * Whether to show the underline.
   * @default false
   */
  showUnderline?: boolean;
  /**
   * The icon of the dropdown option.
   */
  icon?: IconDefinition;
  /**
   * The validation type of the dropdown option.
   */
  validate?: dropdownItemValidate;
  /**
   * The position of the checkbox.
   */
  checkSite?: dropdownCheckPosition;
  /**
   * The children options for tree/grouped structure.
   * If provided, this option will be rendered as a group with expand/collapse functionality.
   * Maximum depth: 3 levels (enforced at runtime by truncateArrayDepth)
   */
  children?: DropdownOption[];
  /**
   * The shortcut keys of the dropdown option.
   */
  shortcutKeys?: Array<string | number>;
  /**
   * The shortcut text of the dropdown option.
   */
  shortcutText?: string;
}

/**
 * Base option without children
 */
type DropdownOptionBase = Omit<DropdownOption, 'children'>;

/**
 * Flat dropdown option (no children) - for 'default' type
 */
export type DropdownOptionFlat = DropdownOptionBase;

/**
 * Grouped dropdown option (one level of children) - for 'grouped' type
 * Children cannot have nested children.
 */
export interface DropdownOptionGrouped extends DropdownOptionBase {
  /**
   * Children options for grouped structure.
   * Children cannot have nested children.
   */
  children: DropdownOptionFlat[];
}

/**
 * Recursive type helper to limit tree depth to exactly N levels
 * Level 1: no children
 * Level 2: children with no nested children
 * Level 3: children with children that have no nested children
 */
type DropdownOptionTreeLevel1 = DropdownOptionBase;
type DropdownOptionTreeLevel2 = DropdownOptionBase & {
  children?: DropdownOptionTreeLevel1[];
};
type DropdownOptionTreeLevel3 = DropdownOptionBase & {
  children?: DropdownOptionTreeLevel2[];
};

/**
 * Tree dropdown option (nested children up to 3 levels) - for 'tree' type
 * Maximum depth is enforced at compile time: 3 levels
 * - Level 1: root options (no children)
 * - Level 2: options with children (children have no nested children)
 * - Level 3: options with children that have children (grandchildren have no nested children)
 */
export type DropdownOptionTree = DropdownOptionTreeLevel3;

/**
 * Type helper to get the appropriate options array type based on dropdown type.
 * This enforces structure constraints at compile time:
 * - 'default': flat array (no children allowed)
 * - 'grouped': array with one level of children (children cannot have children)
 * - 'tree': array with nested children up to 3 levels
 */
export type DropdownOptionsByType<T extends dropdownType | undefined> =
  T extends 'default'
    ? DropdownOptionFlat[]
    : T extends 'grouped'
      ? DropdownOptionGrouped[]
      : T extends 'tree'
        ? DropdownOptionTree[]
        : DropdownOption[]; // Fallback: allow all types

export interface DropdownItemSharedProps {
  disabled?: boolean;
  mode?: dropdownMode;
  onSelect?: (option: DropdownOption) => void;
  type?: dropdownType;
  value?: string | string[];
}

export const dropdownClasses = {
  root: `${dropdownPrefix}`,
  inputPosition: (inputPosition: dropdownInputPosition) =>
    `${dropdownPrefix}--${inputPosition}`,
  // dropdown list
  list: `${dropdownPrefix}-list`,
  listWrapper: `${dropdownPrefix}-list-wrapper`,
  listHeader: `${dropdownPrefix}-list-header`,
  listHeaderInner: `${dropdownPrefix}-list-header-inner`,
  option: `${dropdownPrefix}-option`,
  optionActive: `${dropdownPrefix}-option--active`,
  groupLabel: `${dropdownPrefix}-group-label`,
  // dropdown status
  status: `${dropdownPrefix}-status`,
  statusText: `${dropdownPrefix}-status-text`,
  // dropdown action
  action: `${dropdownPrefix}-action`,
  actionTopBar: `${dropdownPrefix}-action--top-bar`,
  actionTools: `${dropdownPrefix}-action-tools`,
  // dropdown item card
  card: `${dropdownPrefix}-item-card`,
  cardContainer: `${dropdownPrefix}-item-card-container`,
  cardActive: `${dropdownPrefix}-item-card--active`,
  cardDisabled: `${dropdownPrefix}-item-card--disabled`,
  cardUnderline: `${dropdownPrefix}-item-card-underline`,
  cardLevel: (level: dropdownItemLevel) =>
    `${dropdownPrefix}-item-card--level-${level}`,
  cardBody: `${dropdownPrefix}-item-card-body`,
  cardTitle: `${dropdownPrefix}-item-card-title`,
  cardDescription: `${dropdownPrefix}-item-card-description`,
  cardHighlightedText: `${dropdownPrefix}-item-card-highlighted-text`,
  cardPrependContent: `${dropdownPrefix}-item-card-prepend-content`,
  cardAppendContent: `${dropdownPrefix}-item-card-append-content`,
};
