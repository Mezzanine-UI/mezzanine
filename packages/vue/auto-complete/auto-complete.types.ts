import type { AutoCompleteSelector } from '@mezzanine-ui/core/autocomplete';
import type {
  DropdownInputPosition,
  DropdownLoadingPosition,
} from '@mezzanine-ui/core/dropdown/dropdown';
import type { SelectValue } from '../select/select.types';
import type {
  SelectTriggerInputProps,
  SelectTriggerProps,
} from '../select/select-trigger.types';

/**
 * The single and multiple variants React expresses as a union, flattened into
 * one interface — the same reason `SelectProps` is flat: Vue's `defineProps`
 * cannot resolve a union discriminated on a literal, so `defaultValue` and
 * `value` accept both shapes here.
 */
export interface AutoCompleteProps
  extends Omit<
    SelectTriggerProps,
    | 'active'
    | 'clearable'
    | 'forceHideSuffixActionIcon'
    | 'fullWidth'
    | 'inputProps'
    | 'renderValue'
    | 'suffixActionIcon'
    | 'value'
  > {
  /**
   * Set to true when options can be added dynamically
   * @default false
   */
  addable?: boolean;
  /**
   * Whether the data is fetched asynchronously.
   * If true, input change will trigger loading until the search promise resolves.
   * @default false
   */
  asyncData?: boolean;
  /**
   * Whether option matching respects letter casing.
   * When `false` (default), typing `colorado` matches an option named `Colorado`.
   * Applies to both option filtering and the duplicate check used by `addable` mode,
   * so the create action is not offered for an option already visible in the list.
   * @default false
   */
  caseSensitive?: boolean;
  /**
   * Whether to clear search text when leaving the textfield/dropdown scope.
   * When `false`, typed text persists after blur. In `single` mode, a clearable
   * icon will appear if the user has typed text without selecting an option.
   * @default true
   */
  clearSearchText?: boolean;
  /**
   * Custom text for the create action button.
   * @default '建立 "{text}"'
   */
  createActionText?: (text: string) => string;
  /**
   * Default template for the create action button text.
   * Use this to customize the default text format when createActionText is not provided.
   * The template should contain {text} placeholder which will be replaced with the actual text.
   * @default '建立 "{text}"'
   */
  createActionTextTemplate?: string;
  /**
   * Characters that can be used to separate multiple items when creating.
   * When these characters are entered, they will trigger item creation.
   * @default [',', '+', '\n']
   */
  createSeparators?: string[];
  /**
   * The default selection.
   */
  defaultValue?: SelectValue[] | SelectValue;
  /**
   * Should the filter rules be disabled (If you need to control options filter by yourself)
   * @default false
   */
  disabledOptionsFilter?: boolean;
  /**
   * The z-index of the dropdown.
   */
  dropdownZIndex?: number | string;
  /**
   * The text of the dropdown empty status.
   * @default '沒有符合的項目'
   */
  emptyText?: string;
  /**
   * Whether to enable portal for the dropdown.
   * @default true
   */
  globalPortal?: boolean;
  /**
   * The id attribute of the input element.
   *
   * @important When using with form libraries or native forms, this prop is recommended.
   */
  id?: string;
  /**
   * The position of the search input relative to the dropdown.
   * - `'outside'`: input is always visible above the dropdown (default trigger layout).
   * - `'inside'`: input is rendered inside the dropdown panel; the trigger shows only
   *   the selected value(s) and opens the dropdown on click.
   * @default 'outside'
   */
  inputPosition?: DropdownInputPosition;
  /**
   * The other native props for input element.
   */
  inputProps?: Omit<
    SelectTriggerInputProps,
    | 'onChange'
    | 'placeholder'
    | 'role'
    | 'value'
    | `aria-${'controls' | 'expanded' | 'owns'}`
  >;
  /**
   * Whether the dropdown is in loading state.
   * @default false
   */
  loading?: boolean;
  /**
   * The position to display the loading status.
   * Only takes effect when `loading` is true.
   * @default 'bottom'
   */
  loadingPosition?: DropdownLoadingPosition;
  /**
   * The text of the dropdown loading status.
   * @default '載入中...'
   */
  loadingText?: string;
  /**
   * The max height of the dropdown list.
   */
  menuMaxHeight?: number | string;
  /**
   * The name attribute of the input element.
   *
   * @important When using with form libraries or native forms, this prop is recommended.
   */
  name?: string;
  /**
   * Callback fired when the user confirms a new item creation.
   * Receives the typed text and the current options array; must return the updated options array.
   * Use this to append the new item to your options state.
   * Required when `addable` is true; omitting it will disable the creation feature.
   *
   * A prop rather than an emit, uniquely among this component's callbacks: the
   * creation flow consumes the array it returns — to find the new option's id,
   * and as the base for the next item in a bulk create — and a Vue emit returns
   * nothing. The name and the signature are React's.
   */
  onInsert?: (text: string, currentOptions: SelectValue[]) => SelectValue[];
  /**
   * Whether the dropdown is open (controlled).
   */
  open?: boolean;
  /**
   * The options that mapped autocomplete options
   */
  options: SelectValue[];
  /**
   * select input placeholder
   */
  placeholder?: string;
  /**
   * Whether the selection is required.
   * @default false
   */
  required?: boolean;
  /**
   * The debounce time of the search event handler.
   * @default 300
   */
  searchDebounceTime?: number;
  /**
   * The selector of input.
   * @default 'input'
   */
  selector?: AutoCompleteSelector;
  /**
   * When true, pasted bulk text is kept in the input and user creates one item at a time
   * (create button shows only the first pending item; after create, input updates to remaining).
   * When false, pasted bulk text creates all items at once (default).
   * @default false
   */
  stepByStepBulkCreate?: boolean;
  /**
   * Whether to trim whitespace from created items.
   * @default true
   */
  trimOnCreate?: boolean;
  /**
   * The value of selection.
   * @default undefined
   */
  value?: SelectValue[] | SelectValue | null;
}
