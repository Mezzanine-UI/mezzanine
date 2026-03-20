'use client';

import cx from 'clsx';
import {
  cloneElement,
  ReactElement,
  MouseEvent as ReactMouseEvent,
  Ref,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  dropdownClasses,
  DropdownInputPosition,
  DropdownItemSharedProps,
  DropdownLoadingPosition,
  DropdownOption,
  DropdownStatus as DropdownStatusType,
  DropdownType,
} from '@mezzanine-ui/core/dropdown/dropdown';

import { offset, size } from '@floating-ui/react-dom';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { TransitionGroup } from 'react-transition-group';

import Button, { ButtonProps } from '../Button';
import { useDocumentEvents } from '../hooks/useDocumentEvents';
import { InputProps } from '../Input';
import Popper, { PopperPlacement } from '../Popper';
import Translate, { TranslateFrom } from '../Transition/Translate';
import { composeRefs } from '../utils/composeRefs';

import { IconDefinition } from '@mezzanine-ui/icons';
import DropdownItem from './DropdownItem';

// Helper type to extract ref from a ReactElement.
// Models `ref` on the element itself, which is compatible with React 18 and 19.
type ReactElementWithRef<
  P,
  E extends Element = HTMLElement,
> = ReactElement<P> & {
  ref?: Ref<E>;
};

type TriggerElementProps = Partial<ButtonProps & InputProps> & {
  ref?: Ref<HTMLElement>;
};

/**
 * Extracts ref from a ReactElement, supporting both React 18 and 19.
 * In React 18, ref is on the element itself; in React 19, ref is in props.
 */
function getElementRef<E extends Element = HTMLElement>(
  element: ReactElementWithRef<unknown, E>,
): Ref<E> | undefined {
  // React 19: ref is in props
  const propsRef = (element.props as { ref?: Ref<E> })?.ref;
  // React 18: ref is on the element itself
  return propsRef ?? element.ref;
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
   * The keyboard-only active index.
   * When provided, only this index triggers the focus ring (`--keyboard-active` CSS class).
   * Mouse hover updates `activeIndex` for Enter selection but should not update this.
   * When omitted, falls back to the internal uncontrolled index (set only by built-in keyboard navigation).
   */
  keyboardActiveIndex?: number | null;
  /**
   * The children of the dropdown.
   * This can be a button or an input.
   */
  children: ReactElement<ButtonProps> | ReactElement<InputProps>;
  /**
   * Whether the dropdown is disabled.
   */
  disabled?: boolean;
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
   * The text to follow for highlighting in dropdown options.
   * If provided, this will be used instead of auto-extracting from children props.
   */
  followText?: string;
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
   * The max height of the dropdown list.
   */
  maxHeight?: number | string;
  /**
   * Override the default `min-width` of the dropdown list.
   * Accepts a number (pixels) or any valid CSS length string.
   * Pass `0` to remove the minimum width constraint entirely — useful when `sameWidth` controls the width.
   * @default spacing token `size-container-tiny`
   */
  minWidth?: number | string;
  /**
   * Whether the dropdown is open (controlled).
   */
  open?: boolean;
  /**
   * Callback fired when the action cancel is clicked.
   */
  onActionCancel?: () => void;
  /**
   * Callback fired when the action clear is clicked.
   */
  onActionClear?: () => void;
  /**
   * Callback fired when the action confirm is clicked.
   */
  onActionConfirm?: () => void;
  /**
   * Callback fired when the action custom is clicked.
   */
  onActionCustom?: () => void;
  /**
   * Callback fired when the dropdown is closed.
   */
  onClose?: () => void;
  /**
   * Callback fired when the item is hovered.
   */
  onItemHover?: (index: number) => void;
  /**
   * Callback fired when the dropdown is opened.
   */
  onOpen?: () => void;
  /**
   * Callback fired when the dropdown visibility changes.
   */
  onVisibilityChange?: (open: boolean) => void;
  /**
   * Callback fired when the item is selected.
   */
  onSelect?: (option: DropdownOption) => void;
  /**
   * The options of the dropdown.
   */
  options: DropdownOption[];
  /**
   * The placement of the dropdown.
   */
  placement?: PopperPlacement;
  /**
   * Custom width for the dropdown.
   * Can be a number (pixels) or a string (e.g., '200px', '50%').
   * If provided, this takes precedence over `sameWidth`.
   */
  customWidth?: number | string;
  /**
   * Whether to set the same width as its anchor element.
   * @default false
   */
  sameWidth?: boolean;
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
   * The type of the dropdown.
   */
  type?: DropdownType;
  /**
   * Whether clicking an option row should toggle checked state in multiple mode.
   * Passed through to `DropdownItem`.
   */
  toggleCheckedOnClick?: boolean;
  /**
   * The z-index of the dropdown.
   */
  zIndex?: number | string;
  /**
   * The status of the dropdown (loading or empty).
   */
  status?: DropdownStatusType;
  /**
   * The text of the dropdown loading status.
   */
  loadingText?: string;
  /**
   * The text of the dropdown empty status.
   */
  emptyText?: string;
  /**
   * The icon of the dropdown empty status.
   */
  emptyIcon?: IconDefinition;
  /**
   * The position to display the loading status.
   * Only takes effect when `status === 'loading'`.
   * @default 'full'
   */
  loadingPosition?: DropdownLoadingPosition;
  /**
   * Whether to enable portal.
   * This prop is only relevant when `inputPosition` is set to 'outside'.
   * Controls whether the dropdown content is rendered within the current hierarchy or portaled to the body.
   * @default true
   */
  globalPortal?: boolean;
  /**
   * Callback fired when the dropdown list reaches the bottom.
   * Only fires when `maxHeight` is set and the list is scrollable.
   */
  onReachBottom?: () => void;
  /**
   * Callback fired when the dropdown list leaves the bottom.
   * Only fires when `maxHeight` is set and the list is scrollable.
   */
  onLeaveBottom?: () => void;
  /**
   * Callback fired when the dropdown list is scrolled.
   * Receives the scroll event and computed scroll information.
   */
  onScroll?: (
    computed: { scrollTop: number; maxScrollTop: number },
    target: HTMLDivElement,
  ) => void;
  /**
   * Whether to defer the initialization of OverlayScrollbars.
   * This can improve initial render performance.
   * @default true
   */
  scrollbarDefer?: boolean | object;
  /**
   * Whether to disable the custom scrollbar component.
   * When false (default), Scrollbar component will be used when maxHeight is set.
   * When true, falls back to native div scrolling (backward compatible).
   * @default false
   */
  scrollbarDisabled?: boolean;
  /**
   * The maximum width of the scrollable container.
   * Can be a CSS value string (e.g., '500px', '100%') or a number (treated as pixels).
   */
  scrollbarMaxWidth?: number | string;
  /**
   * Additional options to pass to OverlayScrollbars.
   * @see https://kingsora.github.io/OverlayScrollbars/#!documentation/options
   */
  scrollbarOptions?: import('overlayscrollbars').PartialOptions;
}

/**
 * 下拉選單元件，以 `Button` 或 `Input` 作為觸發元素，點擊後展開選項列表。
 *
 * 支援受控（`open`）與非受控兩種開關模式，可透過 `type` 切換單選或多選行為，
 * 並透過 `inputPosition` 選擇彈出（outside）或內嵌（inside）的輸入框位置。
 * 可搭配 `showDropdownActions` 顯示確認／取消操作列，以及 `status` 設定
 * 載入中或空狀態的顯示內容。
 *
 * @example
 * ```tsx
 * import Dropdown from '@mezzanine-ui/react/Dropdown';
 * import Button from '@mezzanine-ui/react/Button';
 * import Input from '@mezzanine-ui/react/Input';
 *
 * // 以 Button 為觸發元素
 * <Dropdown
 *   options={[{ label: '選項一', value: '1' }, { label: '選項二', value: '2' }]}
 *   onSelect={(option) => console.log(option)}
 * >
 *   <Button>請選擇</Button>
 * </Dropdown>
 *
 * // 以 Input 為觸發元素，同寬展開
 * <Dropdown
 *   options={[{ label: '台北', value: 'tpe' }, { label: '台中', value: 'txg' }]}
 *   sameWidth
 *   onSelect={(opt) => setValue(opt.value)}
 * >
 *   <Input placeholder="搜尋城市" />
 * </Dropdown>
 *
 * // 多選模式搭配操作列
 * <Dropdown
 *   type="multiple"
 *   options={options}
 *   showDropdownActions
 *   actionConfirmText="確認"
 *   actionCancelText="取消"
 *   onActionConfirm={handleConfirm}
 * >
 *   <Button>多選</Button>
 * </Dropdown>
 * ```
 *
 * @see {@link Select} 封裝好選取邏輯的選擇器元件
 * @see {@link AutoComplete} 具備自動補全功能的輸入元件
 */
export default function Dropdown(props: DropdownProps) {
  const {
    activeIndex: activeIndexProp,
    keyboardActiveIndex: keyboardActiveIndexProp,
    id,
    children,
    options = [],
    type = 'default',
    toggleCheckedOnClick,
    maxHeight,
    minWidth,
    disabled = false,
    showDropdownActions = false,
    actionCancelText,
    actionConfirmText,
    actionText,
    actionClearText,
    actionCustomButtonProps,
    showActionShowTopBar,
    isMatchInputValue = false,
    inputPosition = 'outside',
    placement = 'bottom-start',
    customWidth,
    sameWidth = false,
    listboxId: listboxIdProp,
    listboxLabel,
    onClose,
    onOpen,
    open: openProp,
    onVisibilityChange,
    onSelect,
    onActionConfirm,
    onActionCancel,
    onActionCustom,
    onActionClear,
    onItemHover,
    zIndex,
    status,
    loadingText,
    emptyText,
    emptyIcon,
    loadingPosition = 'full',
    followText: followTextProp,
    globalPortal = true,
    onReachBottom,
    onLeaveBottom,
    onScroll,
    mode,
    value,
    scrollbarDefer,
    scrollbarDisabled,
    scrollbarMaxWidth,
    scrollbarOptions,
  } = props;
  const isInline = inputPosition === 'inside';
  const inputId = useId();
  const defaultListboxId = `${inputId}-listbox`;
  const listboxId = listboxIdProp ?? defaultListboxId;
  const actionConfig = useMemo(() => {
    return {
      showActions: showDropdownActions,
      cancelText: actionCancelText,
      confirmText: actionConfirmText,
      clearText: actionClearText,
      actionText,
      customActionButtonProps: actionCustomButtonProps,
      showTopBar: showActionShowTopBar,
      onConfirm: onActionConfirm,
      onCancel: onActionCancel,
      onClick: onActionCustom,
      onClear: onActionClear,
    };
  }, [
    showDropdownActions,
    actionCancelText,
    actionConfirmText,
    actionClearText,
    actionText,
    actionCustomButtonProps,
    showActionShowTopBar,
    onActionConfirm,
    onActionCancel,
    onActionCustom,
    onActionClear,
  ]);

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpenControlled = openProp !== undefined;
  const isOpen = isOpenControlled ? !!openProp : uncontrolledOpen;
  const [uncontrolledActiveIndex, setUncontrolledActiveIndex] = useState<
    number | null
  >(activeIndexProp ?? null);
  const isActiveIndexControlled = activeIndexProp !== undefined;
  const mergedActiveIndex = isActiveIndexControlled
    ? activeIndexProp
    : uncontrolledActiveIndex;
  // For keyboard-only visual focus (focus ring). When not externally controlled,
  // `uncontrolledActiveIndex` is already set only by keyboard (never by hover).
  const mergedKeyboardActiveIndex =
    keyboardActiveIndexProp !== undefined
      ? keyboardActiveIndexProp
      : uncontrolledActiveIndex;
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Expansion state for tree type (lifted here so keyboard nav can track visible options)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const handleToggleExpand = useCallback((optionId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(optionId)) {
        next.delete(optionId);
      } else {
        next.add(optionId);
      }
      return next;
    });
  }, []);

  // Flat list of navigable options, respecting tree expansion state
  const flatNavigableOptions = useMemo(() => {
    const opts = options as DropdownOption[];
    if (type === 'grouped') {
      return opts.flatMap((g) => g.children ?? []);
    }
    if (type === 'tree') {
      const flatten = (items: DropdownOption[]): DropdownOption[] =>
        items.flatMap((item) => {
          if (item.children?.length && expandedNodes.has(item.id)) {
            return [item, ...flatten(item.children)];
          }
          return [item];
        });
      return flatten(opts);
    }
    return opts;
  }, [options, type, expandedNodes]);

  const ariaActivedescendant = useMemo(() => {
    if (mergedActiveIndex !== null && mergedActiveIndex >= 0) {
      return `${listboxId}-option-${mergedActiveIndex}`;
    }
    return undefined;
  }, [mergedActiveIndex, listboxId]);

  const translateProps = useMemo(
    () => ({
      duration: {
        enter: MOTION_DURATION.moderate,
        exit: MOTION_DURATION.moderate,
      },
      easing: {
        enter: MOTION_EASING.standard,
        exit: MOTION_EASING.standard,
      },
    }),
    [],
  );

  const followText = useMemo(() => {
    // If followText is explicitly provided, use it
    if (followTextProp !== undefined) {
      return followTextProp != null ? String(followTextProp) : undefined;
    }
    // Otherwise, auto-extract from children props
    if (children.type === Button) {
      return undefined;
    }
    if (!isMatchInputValue) {
      return undefined;
    }
    // Try to get value from Input component props
    const inputValue =
      (children.props as InputProps)?.value ??
      (children.props as InputProps)?.defaultValue ??
      '';
    // Ensure the value is a string or undefined
    return inputValue != null ? String(inputValue) : undefined;
  }, [children, isMatchInputValue, followTextProp]);

  const popoverPlacement: PopperPlacement = useMemo(() => {
    if (inputPosition === 'outside') {
      return placement;
    }

    return 'bottom';
  }, [inputPosition, placement]);

  const customWidthMiddleware = useMemo(() => {
    if (!customWidth) {
      return null;
    }

    const widthValue =
      typeof customWidth === 'number' ? `${customWidth}px` : customWidth;

    return {
      name: 'customWidth',
      fn: ({ elements }: { elements: { floating: HTMLElement } }) => {
        Object.assign(elements.floating.style, {
          width: widthValue,
        });
        return {};
      },
    };
  }, [customWidth]);

  const sameWidthMiddleware = useMemo(() => {
    // If customWidth is set, don't apply sameWidth
    if (customWidth || !sameWidth) {
      return null;
    }

    return size({
      apply({ rects, elements }) {
        Object.assign(elements.floating.style, {
          width: `${rects.reference.width}px`,
        });
      },
    });
  }, [customWidth, sameWidth]);

  const offsetMiddleware = useMemo(() => {
    return offset({ mainAxis: 4 });
  }, []);

  // Set z-index for popper to ensure it appears above other elements
  const zIndexMiddleware = useMemo(() => {
    const zIndexValue = zIndex ?? 1;
    return {
      name: 'zIndex',
      fn: ({ elements }: { elements: { floating: HTMLElement } }) => {
        const zIndexNum =
          typeof zIndexValue === 'number'
            ? zIndexValue
            : typeof zIndexValue === 'string'
              ? parseInt(zIndexValue, 10) || zIndexValue
              : 1;
        Object.assign(elements.floating.style, {
          zIndex: zIndexNum,
        });
        return {};
      },
    };
  }, [zIndex]);

  const prevIsOpenRef = useRef(isOpen);
  const translateFrom = useMemo<TranslateFrom>(() => {
    if (isInline) {
      return 'bottom';
    }

    const placementBase = popoverPlacement.split('-')[0];
    return placementBase === 'top' ? 'top' : 'bottom';
  }, [isInline, popoverPlacement]);

  const setOpen = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      const nextValue =
        typeof next === 'function'
          ? (next as (prev: boolean) => boolean)(isOpen)
          : next;

      if (!isOpenControlled) {
        setUncontrolledOpen(nextValue);
      }

      onVisibilityChange?.(nextValue);
    },
    [isOpen, isOpenControlled, onVisibilityChange],
  );

  useEffect(() => {
    if (prevIsOpenRef.current === isOpen) return;

    if (isOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }

    prevIsOpenRef.current = isOpen;
  }, [isOpen, onClose, onOpen]);

  const anchorRef = useRef<HTMLElement | null>(null);
  const popperRef = useRef<HTMLDivElement | null>(null);
  const popperControllerRef = useRef<
    import('../Popper').PopperController | null
  >(null);

  // Extract combobox props logic to avoid duplication
  const getComboboxProps = useMemo(() => {
    const isInput = (children as { type: unknown }).type !== Button;

    if (!isInput) {
      // Button trigger: expose listbox ARIA so screen readers can navigate
      return {
        'aria-haspopup': 'listbox' as const,
        'aria-expanded': isOpen,
        'aria-controls': listboxId,
        'aria-activedescendant': ariaActivedescendant,
      };
    }

    return {
      role: 'combobox' as const,
      'aria-controls': listboxId,
      'aria-expanded': isOpen,
      'aria-haspopup': 'listbox' as const,
      'aria-autocomplete': isMatchInputValue ? ('list' as const) : undefined,
      'aria-activedescendant': ariaActivedescendant,
    };
  }, [children, listboxId, isOpen, isMatchInputValue, ariaActivedescendant]);

  const handleItemHover = useCallback(
    (index: number) => {
      onItemHover?.(index);
    },
    [onItemHover],
  );

  // Reset active index when dropdown closes (uncontrolled only)
  useEffect(() => {
    if (!isOpen && !isActiveIndexControlled) {
      setUncontrolledActiveIndex(null);
    }
  }, [isOpen, isActiveIndexControlled]);

  // Scroll the active option into view whenever activeIndex changes
  useEffect(() => {
    if (!isOpen || mergedActiveIndex === null) return;
    requestAnimationFrame(() => {
      document
        .getElementById(`${listboxId}-option-${mergedActiveIndex}`)
        ?.scrollIntoView({ block: 'nearest' });
    });
  }, [mergedActiveIndex, isOpen, listboxId]);

  // Built-in keyboard navigation (only when activeIndex is not controlled externally)
  const handleBuiltinKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (isActiveIndexControlled) return;

      const count = flatNavigableOptions.length;

      if (!isOpen) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          setOpen(true);
        }
        return;
      }

      if (count === 0) return;

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          setUncontrolledActiveIndex((prev) =>
            prev === null ? 0 : (prev + 1) % count,
          );
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          setUncontrolledActiveIndex((prev) =>
            prev === null ? count - 1 : (prev - 1 + count) % count,
          );
          break;
        }
        case 'Enter': {
          if (mergedActiveIndex !== null && mergedActiveIndex >= 0) {
            const activeOption = flatNavigableOptions[mergedActiveIndex];
            if (activeOption) {
              event.preventDefault();
              if (type === 'tree' && activeOption.children?.length) {
                handleToggleExpand(activeOption.id);
              } else {
                onSelect?.(activeOption);
                if (mode !== 'multiple') {
                  setOpen(false);
                }
              }
            }
          }
          break;
        }
        case 'Escape': {
          event.preventDefault();
          setOpen(false);
          break;
        }
        default:
          break;
      }
    },
    [
      isActiveIndexControlled,
      isOpen,
      flatNavigableOptions,
      mergedActiveIndex,
      type,
      mode,
      handleToggleExpand,
      onSelect,
      setOpen,
    ],
  );

  // Extract shared DropdownItem props to avoid duplication
  const baseDropdownItemProps = useMemo(
    () => ({
      actionConfig,
      activeIndex: mergedActiveIndex,
      keyboardActiveIndex: mergedKeyboardActiveIndex,
      disabled,
      expandedNodes,
      followText,
      listboxId,
      listboxLabel,
      maxHeight,
      minWidth,
      sameWidth,
      onHover: handleItemHover,
      onSelect,
      onToggleExpand: handleToggleExpand,
      onReachBottom,
      onLeaveBottom,
      onScroll,
      options,
      type,
      status,
      loadingText,
      emptyText,
      emptyIcon,
      loadingPosition,
      mode,
      value,
      scrollbarDefer,
      scrollbarDisabled,
      scrollbarMaxWidth,
      scrollbarOptions,
      toggleCheckedOnClick,
    }),
    [
      actionConfig,
      mergedActiveIndex,
      mergedKeyboardActiveIndex,
      disabled,
      followText,
      listboxId,
      listboxLabel,
      maxHeight,
      minWidth,
      sameWidth,
      handleItemHover,
      handleToggleExpand,
      expandedNodes,
      onSelect,
      onReachBottom,
      onLeaveBottom,
      onScroll,
      options,
      type,
      status,
      loadingText,
      emptyText,
      emptyIcon,
      loadingPosition,
      mode,
      value,
      scrollbarDefer,
      scrollbarDisabled,
      scrollbarMaxWidth,
      scrollbarOptions,
      toggleCheckedOnClick,
    ],
  );

  const triggerElement = useMemo(() => {
    const childWithRef = children as ReactElementWithRef<
      ButtonProps | InputProps,
      HTMLElement
    >;
    const childProps = childWithRef.props;
    const childRef = getElementRef(childWithRef);
    const composedRef = composeRefs<HTMLElement>([anchorRef, childRef]);
    const originalOnClick = childProps.onClick as
      | React.MouseEventHandler<HTMLElement>
      | undefined;
    const originalOnKeyDown = childProps.onKeyDown as
      | React.KeyboardEventHandler<HTMLElement>
      | undefined;

    return cloneElement(childWithRef, {
      ref: composedRef,
      ...getComboboxProps,
      onClick: (event: ReactMouseEvent<HTMLElement>) => {
        originalOnClick?.(event);
        if (event?.defaultPrevented) return;

        if (!isInline) {
          setOpen((prev) => !prev);
        }
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
        originalOnKeyDown?.(event);
        if (event?.defaultPrevented) return;
        handleBuiltinKeyDown(event);
      },
    } as TriggerElementProps);
  }, [children, getComboboxProps, handleBuiltinKeyDown, isInline, setOpen]);

  const inlineTriggerElement = useMemo(() => {
    if (!isInline) {
      return null;
    }

    const childWithRef = children as ReactElementWithRef<
      ButtonProps | InputProps,
      HTMLElement
    >;
    const childProps = childWithRef.props;
    const childRef = getElementRef(childWithRef);
    const composedRef = composeRefs<HTMLElement>([childRef]);
    const originalOnBlur = childProps.onBlur as
      | React.FocusEventHandler<HTMLElement>
      | undefined;
    const originalOnClick = childProps.onClick as
      | React.MouseEventHandler<HTMLElement>
      | undefined;
    const originalOnFocus = childProps.onFocus as
      | React.FocusEventHandler<HTMLElement>
      | undefined;
    const originalOnKeyDown = childProps.onKeyDown as
      | React.KeyboardEventHandler<HTMLElement>
      | undefined;

    return cloneElement(childWithRef, {
      ref: composedRef,
      ...getComboboxProps,
      onBlur: (event: React.FocusEvent<HTMLElement>) => {
        originalOnBlur?.(event);
        if (event?.defaultPrevented) return;

        // When open is controlled, don't automatically close on blur
        // Let the controlled state handle the visibility
        if (isOpenControlled) {
          return;
        }

        const nextFocusTarget = event?.relatedTarget as HTMLElement | null;
        const container = containerRef.current;

        if (
          container &&
          nextFocusTarget &&
          container.contains(nextFocusTarget)
        ) {
          return;
        }

        setOpen(false);
      },
      onClick: (event: ReactMouseEvent<HTMLElement>) => {
        originalOnClick?.(event);
        if (event?.defaultPrevented) return;

        setOpen(true);
      },
      onFocus: (event: React.FocusEvent<HTMLElement>) => {
        originalOnFocus?.(event);
        if (event?.defaultPrevented) return;

        setOpen(true);
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
        originalOnKeyDown?.(event);
        if (event?.defaultPrevented) return;
        handleBuiltinKeyDown(event);
      },
    } as TriggerElementProps);
  }, [
    children,
    getComboboxProps,
    handleBuiltinKeyDown,
    isInline,
    isOpenControlled,
    setOpen,
  ]);

  useDocumentEvents(() => {
    if (!isOpen) {
      return;
    }

    const handleClickAway = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = anchorRef.current;
      const popper = popperRef.current;
      const container = containerRef.current;

      if (!target) return;

      if (isInline) {
        if (container && !container.contains(target)) {
          setOpen(false);
        }
        return;
      }

      if (
        anchor &&
        popper &&
        !anchor.contains(target) &&
        !popper.contains(target)
      ) {
        setOpen(false);
      }
    };

    return {
      click: handleClickAway,
      touchend: handleClickAway,
    };
  }, [isInline, isOpen, setOpen]);

  return (
    <div
      id={id}
      ref={containerRef}
      className={cx(
        dropdownClasses.root,
        dropdownClasses.inputPosition(inputPosition),
      )}
    >
      {isInline && (
        <TransitionGroup component={null}>
          {!isOpen && inlineTriggerElement && (
            <Translate
              {...translateProps}
              from={translateFrom}
              key="inline-trigger"
              in
            >
              <div>{inlineTriggerElement}</div>
            </Translate>
          )}
          {isOpen && (
            <Translate
              {...translateProps}
              from={translateFrom}
              key="inline-list"
              in
            >
              <div>
                <DropdownItem
                  {...baseDropdownItemProps}
                  headerContent={inlineTriggerElement}
                />
              </div>
            </Translate>
          )}
        </TransitionGroup>
      )}
      {!isInline && (
        <Popper
          ref={popperRef}
          anchor={anchorRef}
          className={dropdownClasses.popperWithPortal}
          controllerRef={popperControllerRef}
          open={isOpen}
          disablePortal={!globalPortal}
          options={{
            placement: popoverPlacement,
            middleware: [
              offsetMiddleware,
              zIndexMiddleware,
              ...(customWidthMiddleware ? [customWidthMiddleware] : []),
              ...(sameWidthMiddleware ? [sameWidthMiddleware] : []),
            ],
          }}
        >
          <TransitionGroup component={null}>
            {isOpen && (
              <Translate
                {...translateProps}
                from={translateFrom}
                key="popper-list"
                in
              >
                <div>
                  <DropdownItem {...baseDropdownItemProps} />
                </div>
              </Translate>
            )}
          </TransitionGroup>
        </Popper>
      )}
      {!isInline && triggerElement}
    </div>
  );
}
