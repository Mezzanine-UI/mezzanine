import type {
  DropdownItemSharedProps,
  DropdownLoadingPosition,
  DropdownOption,
  DropdownOptionsByType,
  DropdownStatus,
  DropdownType,
} from '@mezzanine-ui/core/dropdown/dropdown';
import type { IconDefinition } from '@mezzanine-ui/icons';
import type { PartialOptions } from 'overlayscrollbars';
import type { VNodeChild } from 'vue';
import type { DropdownActionConfig } from './dropdown-action.types';
import type { DropdownItemCardProps } from './dropdown-item-card.types';

export interface DropdownItemProps<
  T extends DropdownType | undefined = DropdownType,
> extends Omit<DropdownItemSharedProps, 'type'> {
  /**
   * The action configuration for the dropdown.
   */
  actionConfig?: DropdownActionConfig;
  /**
   * The active option index for hover/focus state and Enter selection.
   */
  activeIndex: number | null;
  /**
   * The icon of the dropdown empty status.
   */
  emptyIcon?: IconDefinition;
  /**
   * The text of the dropdown empty status.
   */
  emptyText?: string;
  /**
   * Controlled set of expanded node IDs for tree type.
   * When provided, expansion state is managed externally.
   */
  expandedNodes?: Set<string>;
  /**
   * The text to follow.
   */
  followText?: string;
  /**
   * Custom content rendered before options (e.g. inline trigger).
   */
  headerContent?: VNodeChild;
  /**
   * Keyboard-only active index. When provided, only this index applies the
   * focus ring (`--keyboard-active`) and active background via `MznDropdownItemCard`'s `active` prop.
   * Mouse hover should update `activeIndex` (for Enter selection) but NOT this value.
   * Falls back to `activeIndex` when not provided.
   */
  keyboardActiveIndex?: number | null;
  /**
   * The listbox id for aria usage.
   */
  listboxId: string;
  /**
   * The aria-label for the listbox.
   * If not provided, a default label will be used when there are no options.
   */
  listboxLabel?: string;
  /**
   * The text of the dropdown loading status.
   */
  loadingText?: string;
  /**
   * The position to display the loading status.
   * Only takes effect when `status === 'loading'`.
   * @default 'full'
   */
  loadingPosition?: DropdownLoadingPosition;
  /**
   * The max height of the dropdown list.
   */
  maxHeight?: number | string;
  /**
   * Override the default `min-width` of the dropdown list.
   * Accepts a number (pixels) or any valid CSS length string.
   * Pass `0` to remove the minimum width constraint entirely.
   * @default spacing token `size-container-tiny`
   */
  minWidth?: number | string;
  /**
   * Options to render.
   * The structure is constrained based on the `type` prop:
   * - 'default': flat array (no children allowed)
   * - 'grouped': array with one level of children (children cannot have children)
   * - 'tree': array with nested children up to 3 levels
   */
  options: DropdownOptionsByType<T>;
  /**
   * Whether to set the same width as its anchor element.
   * @default false
   */
  sameWidth?: boolean;
  /**
   * Whether to defer the initialization of OverlayScrollbars.
   * This can improve initial render performance.
   * @default true
   */
  scrollbarDefer?: boolean | object;
  /**
   * Whether to disable the custom scrollbar component.
   * When false (default), the Scrollbar component is used when maxHeight is set.
   * @default false
   */
  scrollbarDisabled?: boolean;
  /**
   * The maximum width of the scrollable container.
   */
  scrollbarMaxWidth?: number | string;
  /**
   * Additional options to pass to OverlayScrollbars.
   * @see https://kingsora.github.io/OverlayScrollbars/#!documentation/options
   */
  scrollbarOptions?: PartialOptions;
  /**
   * The status of the dropdown (loading or empty).
   */
  status?: DropdownStatus;
  /**
   * Whether clicking an option row should toggle checked state in multiple mode.
   * If not provided, tree parent nodes with checkboxes default to `false`,
   * while other options default to `true`.
   */
  toggleCheckedOnClick?: boolean;
  /**
   * The type of the dropdown.
   * - 'default': flat array (no children allowed)
   * - 'grouped': array with one level of children (children cannot have children)
   * - 'tree': array with nested children up to 3 levels
   */
  type?: DropdownType;
}

/** One row of the rendered list. */
export type DropdownItemRow =
  | {
      id: string;
      kind: 'group';
      name: string;
    }
  | {
      kind: 'card';
      option: DropdownOption;
      props: DropdownItemCardProps & { class?: string };
      onCheckedChange?: () => void;
      onClick: () => void;
      optionIndex: number;
    };
