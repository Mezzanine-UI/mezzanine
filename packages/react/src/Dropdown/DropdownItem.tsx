'use client';

import keycode from 'keycode';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  DropdownCheckPosition,
  dropdownClasses,
  DropdownItemSharedProps,
  DropdownLoadingPosition,
  DropdownOption,
  DropdownOptionsByType,
  DropdownStatus as DropdownStatusType,
  DropdownType,
} from '@mezzanine-ui/core/dropdown/dropdown';
import { type IconDefinition } from '@mezzanine-ui/icons';

import { CaretDownIcon, CaretRightIcon } from '@mezzanine-ui/icons';

import type { OverlayScrollbars, PartialOptions } from 'overlayscrollbars';
import type { OverlayScrollbarsComponentProps } from 'overlayscrollbars-react';

import { useElementHeight } from '../hooks/useElementHeight';
import Scrollbar from '../Scrollbar';
import Typography from '../Typography';
import DropdownAction, { type DropdownActionProps } from './DropdownAction';
import DropdownItemCard from './DropdownItemCard';
import DropdownStatus from './DropdownStatus';
import shortcutTextHandler from './shortcutTextHandler';

// Helper function to recursively get all descendant IDs from a tree option (excluding the option itself)
function getAllDescendantIds(option: DropdownOption): string[] {
  const ids: string[] = [];

  if (option.children && option.children.length > 0) {
    option.children.forEach((child) => {
      ids.push(String(child.id));
      ids.push(...getAllDescendantIds(child));
    });
  }

  return ids;
}

export interface DropdownItemProps<T extends DropdownType | undefined = DropdownType> extends Omit<DropdownItemSharedProps, 'type'> {
  /**
   * The action configuration for the dropdown.
   */
  actionConfig?: DropdownActionProps;
  /**
   * The active option index for hover/focus state.
   */
  activeIndex: number | null;
  /**
   * The text to follow.
   */
  followText?: string;
  /**
   * Custom content rendered before options (e.g. inline trigger).
   */
  headerContent?: ReactNode;
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
   * The max height of the dropdown list.
   */
  maxHeight?: number | string;
  /**
   * Whether to set the same width as its anchor element.
   * @default false
   */
  sameWidth?: boolean;
  /**
   * Callback when hovering option index changes.
  */
  onHover?: (index: number) => void;
  /**
   * Options to render.
   * The structure is constrained based on the `type` prop:
   * - 'default': flat array (no children allowed)
   * - 'grouped': array with one level of children (children cannot have children)
   * - 'tree': array with nested children up to 3 levels (strictly enforced at compile time)
   */
  options: DropdownOptionsByType<T>;
  /**
   * The type of the dropdown.
   * This prop determines the structure of the `options` array:
   * - 'default': flat array (no children allowed)
   * - 'grouped': array with one level of children (children cannot have children)
   * - 'tree': array with nested children up to 3 levels
   */
  type?: DropdownType;
  /**
   * Whether clicking an option row should toggle checked state in multiple mode.
   * If not provided, tree parent nodes with checkboxes default to `false`,
   * while other options default to `true`.
   */
  toggleCheckedOnClick?: boolean;
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
  scrollbarOptions?: PartialOptions;
}

/**
 * Limits DropdownOption array to a maximum depth, truncating extra children levels and showing error message if exceeded.
 * @param input - The original DropdownOption array
 * @param maxDepth - Maximum depth (default: 3)
 * @param warn - Whether to show warning (default: true)
 * @returns DropdownOption array with at most the specified depth
 */
function truncateArrayDepth(
  input: DropdownOption[],
  maxDepth: number = 3,
  warn: boolean = true
): DropdownOption[] {
  // Internal recursive function: truncates children to specified depth
  const truncate = (options: DropdownOption[], currentDepth: number = 1): DropdownOption[] => {
    if (currentDepth >= maxDepth) {
      // Stop going deeper once maximum depth is reached, remove children
      return options.map(({ children: _children, ...option }) => option);
    }
    return options.map(option => {
      if (!option.children) return option;
      return {
        ...option,
        children: truncate(option.children, currentDepth + 1),
      };
    });
  };

  // Calculate maximum depth by checking all elements (not just the first one)
  const getDepth = (options: DropdownOption[] | undefined, depth: number = 1): number => {
    if (!options || options.length === 0) return depth - 1;

    // Find the maximum depth among all options
    return Math.max(
      ...options.map((option) => {
        if (!option.children || option.children.length === 0) {
          return depth - 1;
        }
        return getDepth(option.children, depth + 1);
      })
    );
  };

  const depth = getDepth(input);
  if (depth <= maxDepth) return input;

  // Exceeds maximum depth → warn
  if (warn) {
    console.error(
      `[truncateArrayDepth] Input DropdownOption array exceeds ${maxDepth} levels. Extra levels were truncated.`
    );
  }

  // Truncate to specified depth
  return truncate(input);
}

export default function DropdownItem<T extends DropdownType | undefined = DropdownType>(props: DropdownItemProps<T>) {
  const {
    activeIndex,
    disabled = false,
    listboxId,
    listboxLabel,
    mode = 'single',
    options,
    toggleCheckedOnClick,
    value,
    type,
    maxHeight,
    actionConfig,
    onHover,
    onSelect,
    followText,
    headerContent,
    status,
    loadingText,
    emptyText,
    emptyIcon,
    loadingPosition = 'full',
    onReachBottom,
    onLeaveBottom,
    onScroll,
    scrollbarDefer = true,
    scrollbarDisabled = false,
    scrollbarMaxWidth,
    scrollbarOptions,
  } = props;

  const optionsContent = truncateArrayDepth(options, 3);
  const listRef = useRef<HTMLUListElement | null>(null);
  const listWrapperRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const wasAtBottomRef = useRef(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const hasActions = Boolean(actionConfig?.showActions);
  const hasHeader = Boolean(headerContent);
  const shouldUseScrollbar = maxHeight && !scrollbarDisabled;

  // Use custom hook to measure element heights
  const [actionRef, actionHeight] = useElementHeight<HTMLDivElement>(hasActions && !!maxHeight);
  const [headerRef, headerHeight] = useElementHeight<HTMLLIElement>(hasHeader && !!maxHeight);

  const toggleExpand = useCallback((optionId: string) => {
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

  const visibleShortcutOptions = useMemo(() => {
    const result: DropdownOption[] = [];

    const collectDefault = (optionList?: DropdownOption[]) => {
      optionList?.forEach((option) => {
        result.push(option);
      });
    };

    const collectGrouped = (optionList?: DropdownOption[]) => {
      optionList?.forEach((groupOption) => {
        groupOption.children?.forEach((option) => {
          result.push(option);
        });
      });
    };

    const collectTree = (optionList?: DropdownOption[]) => {
      optionList?.forEach((option) => {
        result.push(option);
        if (option.children && expandedNodes.has(option.id)) {
          collectTree(option.children);
        }
      });
    };

    if (type === 'grouped') {
      collectGrouped(optionsContent);
    } else if (type === 'tree') {
      collectTree(optionsContent);
    } else {
      collectDefault(optionsContent);
    }

    return result;
  }, [expandedNodes, optionsContent, type]);

  const matchShortcut = useCallback((event: KeyboardEvent, shortcut: number | string) => {
    const eventCode = event.which ?? event.keyCode;

    if (typeof shortcut === 'number') {
      return eventCode === shortcut;
    }

    const tokens = shortcut
      .split('+')
      .map((token) => token.trim().toLowerCase())
      .filter(Boolean);

    let requireMeta = false;
    let requireCtrl = false;
    let requireAlt = false;
    let requireShift = false;
    let mainToken: string | null = null;

    tokens.forEach((token) => {
      switch (token) {
        case 'cmd':
        case 'meta':
        case 'command':
          requireMeta = true;
          break;
        case 'ctrl':
        case 'control':
          requireCtrl = true;
          break;
        case 'alt':
        case 'option':
          requireAlt = true;
          break;
        case 'shift':
          requireShift = true;
          break;
        default:
          mainToken = token;
          break;
      }
    });

    if (!mainToken) return false;
    if (
      requireMeta !== event.metaKey
      || requireCtrl !== event.ctrlKey
      || requireAlt !== event.altKey
      || requireShift !== event.shiftKey
    ) {
      return false;
    }

    const mainCode = keycode(mainToken);
    if (typeof mainCode === 'number' && eventCode === mainCode) {
      return true;
    }

    const eventKey = event.key?.toLowerCase();
    if (eventKey && eventKey === mainToken) {
      return true;
    }

    const eventKeyName = keycode(eventCode);
    return typeof eventKeyName === 'string' && eventKeyName.toLowerCase() === mainToken;
  }, []);

  const renderGroupedOptions = (
    optionList: DropdownOption[] | undefined,
    startIndex: number,
  ): { elements: ReactNode[]; nextIndex: number } => {
    let currentIndex = startIndex;

    const elements = (optionList ?? []).flatMap((groupOption) => {
      const hasChildren = Boolean(groupOption.children && groupOption.children.length > 0);
      const groupElements: ReactNode[] = [];

      if (hasChildren) {
        groupElements.push(
          <Typography
            key={groupOption.id}
            variant="body"
            className={dropdownClasses.groupLabel}
          >
            {groupOption.name}
          </Typography>
        )
        groupOption.children?.forEach((option) => {
          currentIndex += 1;
          const optionIndex = currentIndex;
          const isActive = optionIndex === activeIndex;
          const isSelected = Array.isArray(value)
            ? value.includes(option.id)
            : value === option.id;
          const shortcutText = option.shortcutText
            ? option.shortcutText
            : shortcutTextHandler(option.shortcutKeys ?? []);

          groupElements.push(
            <DropdownItemCard
              followText={followText}
              key={option.id}
              active={isActive}
              checked={isSelected}
              disabled={disabled}
              id={`${listboxId}-option-${optionIndex}`}
              label={option.name}
              mode={mode}
              name={option.name}
              toggleCheckedOnClick={toggleCheckedOnClick}
              onClick={() => {
                if (disabled) return;
                onSelect?.(option);
              }}
              checkSite="none"
              validate={option.validate ?? 'default'}
              onMouseEnter={() => onHover?.(optionIndex)}
              showUnderline={option.showUnderline ?? false}
              appendContent={shortcutText}
            />
          );
        });
      }

      return groupElements;
    });

    return { elements, nextIndex: currentIndex };
  };

  const calculateNodeSelectionState = useCallback(
    (option: DropdownOption, selectedIds: string[]): { checked: boolean; indeterminate: boolean } => {
      if (!option.children || option.children.length === 0) {
        const isSelected = selectedIds.includes(String(option.id));
        return { checked: isSelected, indeterminate: false };
      }

      // Get all descendant IDs (excluding the parent node itself)
      const allDescendantIds = getAllDescendantIds(option);
      const selectedDescendants = allDescendantIds.filter((id) => selectedIds.includes(id));
      const totalDescendants = allDescendantIds.length;

      if (totalDescendants === 0) {
        // No descendants, check if parent itself is selected
        const isSelected = selectedIds.includes(String(option.id));
        return { checked: isSelected, indeterminate: false };
      }

      if (selectedDescendants.length === 0) {
        return { checked: false, indeterminate: false };
      }
      if (selectedDescendants.length === totalDescendants) {
        // All descendants are selected
        return { checked: true, indeterminate: false };
      }

      // Some but not all descendants are selected
      return { checked: false, indeterminate: true };
    },
    [],
  );

  const renderTreeOptions = (
    optionList: DropdownOption[] | undefined,
    depth: number,
    startIndex: number,
  ): { elements: ReactNode[]; nextIndex: number } => {
    let currentIndex = startIndex;
    const selectedIds = Array.isArray(value) ? value.map((id) => String(id)) : value ? [String(value)] : [];

    const elements = (optionList ?? []).flatMap((option) => {
      currentIndex += 1;
      const optionIndex = currentIndex;
      const level = Math.min(depth, 2) as 0 | 1 | 2;
      const isActive = optionIndex === activeIndex;
      const hasChildren = Boolean(option.children && option.children.length > 0);
      const isExpanded = hasChildren && expandedNodes.has(option.id);
      let prependIcon: IconDefinition | undefined = undefined;

      if (hasChildren && level !== 2) {
        prependIcon = isExpanded ? CaretDownIcon : CaretRightIcon;
      }
      const checkSite: DropdownCheckPosition = option.showCheckbox ? 'prefix' : 'none';
      const shortcutText = option.shortcutText
        ? option.shortcutText
        : shortcutTextHandler(option.shortcutKeys ?? []);
      const selectionState = hasChildren && mode === 'multiple'
        ? calculateNodeSelectionState(option, selectedIds)
        : {
          checked: selectedIds.includes(String(option.id)),
          indeterminate: false,
        };
      const resolvedToggleCheckedOnClick = toggleCheckedOnClick ?? !(
        hasChildren
        && type === 'tree'
        && mode === 'multiple'
        && option.showCheckbox
      );

      const card = (
        <DropdownItemCard
          key={option.id}
          active={isActive}
          checked={selectionState.checked}
          indeterminate={selectionState.indeterminate}
          disabled={disabled}
          id={`${listboxId}-option-${optionIndex}`}
          label={option.name}
          level={level}
          mode={mode}
          name={option.name}
          toggleCheckedOnClick={resolvedToggleCheckedOnClick}
          onClick={() => {
            if (disabled) return;
            if (hasChildren && type === 'tree' && mode === 'multiple' && option.showCheckbox) {
              toggleExpand(option.id);
            } else if (hasChildren && type === 'tree') {
              toggleExpand(option.id);
            } else {
              // In `tree` + `multiple` mode, `DropdownItemCard` already triggers selection via
              // `onCheckedChange` when row is clicked (it toggles checked first, then calls `onClick`),
              // so calling `onSelect` here would cause it to fire twice for leaf nodes.
              if (!(type === 'tree' && mode === 'multiple')) {
                onSelect?.(option);
              }
            }
          }}
          onCheckedChange={() => {
            if (!disabled) {
              onSelect?.(option);
            }
          }}
          followText={followText}
          checkSite={checkSite}
          onMouseEnter={() => onHover?.(optionIndex)}
          prependIcon={prependIcon}
          showUnderline={option.showUnderline ?? false}
          validate={option.validate ?? 'default'}
          appendContent={shortcutText}
        />
      );

      if (hasChildren && isExpanded && type === 'tree') {
        const childResult = renderTreeOptions(option.children, depth + 1, currentIndex);
        currentIndex = childResult.nextIndex;
        return [card, ...childResult.elements];
      }

      return [card];
    });

    return { elements, nextIndex: currentIndex };
  };

  const renderDefaultOptions = (
    optionList: DropdownOption[] | undefined,
    startIndex: number,
  ): { elements: ReactNode[]; nextIndex: number } => {
    let currentIndex = startIndex;

    const elements = (optionList ?? []).flatMap((option) => {
      currentIndex += 1;

      const optionIndex = currentIndex;
      const isSelected = Array.isArray(value)
        ? value.includes(option.id)
        : value === option.id;
      const isActive = optionIndex === activeIndex;
      const shortcutText = option.shortcutText
        ? option.shortcutText
        : shortcutTextHandler(option.shortcutKeys ?? []);

      const checkSite: DropdownCheckPosition = option?.checkSite ?? 'none';

      return (
        <DropdownItemCard
          followText={followText}
          key={option.id}
          active={isActive}
          checked={isSelected}
          disabled={disabled}
          id={`${listboxId}-option-${optionIndex}`}
          label={option.name}
          mode={mode}
          name={option.name}
          toggleCheckedOnClick={toggleCheckedOnClick}
          onClick={() => {
            if (disabled) return;
            onSelect?.(option);
          }}
          onMouseEnter={() => onHover?.(optionIndex)}
          prependIcon={option.icon}
          validate={option.validate ?? 'default'}
          showUnderline={option.showUnderline ?? false}
          checkSite={checkSite}
          appendContent={shortcutText}
        />
      )
    })

    return { elements, nextIndex: currentIndex };
  };

  const renderOptions = (
    optionList: DropdownOption[] | undefined,
    depth: number,
    startIndex: number,
  ): { elements: ReactNode[]; nextIndex: number } => {
    if (type === 'grouped') {
      return renderGroupedOptions(optionList, startIndex);
    }

    if (type === 'tree') {
      return renderTreeOptions(optionList, depth, startIndex);
    }

    return renderDefaultOptions(optionList, startIndex);
  };

  const { elements: renderedOptions } = renderOptions(optionsContent, 0, -1);

  // Show full status when options are empty and status is provided, but not when loadingPosition is 'bottom'
  const shouldShowFullStatus = optionsContent.length === 0 && status && loadingPosition !== 'bottom';

  // Show bottom loading when status is loading and loadingPosition is bottom
  const shouldShowBottomLoading = status === 'loading' && loadingPosition === 'bottom';

  const listStyle = useMemo((): React.CSSProperties | undefined => {
    if (!maxHeight) {
      return undefined;
    }

    return {
      maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
    };
  }, [maxHeight]);

  const listWrapperStyle = useMemo((): React.CSSProperties | undefined => {
    if (!maxHeight) {
      return undefined;
    }

    const maxHeightValue = typeof maxHeight === 'number' ? maxHeight : parseFloat(maxHeight);
    const availableHeight = Math.max(0, maxHeightValue - actionHeight - headerHeight);

    return {
      maxHeight: `${availableHeight}px`,
    };
  }, [maxHeight, actionHeight, headerHeight]);

  const getIsAtBottom = useCallback((viewport: HTMLDivElement) => {
    const { scrollTop, scrollHeight, clientHeight } = viewport;
    return scrollTop + clientHeight >= scrollHeight - 1;
  }, []);

  useEffect(() => {
    const listElement = listRef.current;
    if (!listElement || disabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      const targetOption = visibleShortcutOptions.find((option) => {
        if (!Array.isArray(option.shortcutKeys) || option.shortcutKeys.length === 0) {
          return false;
        }
        return option.shortcutKeys.some((shortcut) => matchShortcut(event, shortcut));
      });

      if (!targetOption) return;

      event.preventDefault();
      event.stopPropagation();

      if (type === 'tree' && targetOption.children && targetOption.children.length > 0) {
        toggleExpand(targetOption.id);
        return;
      }

      onSelect?.(targetOption);
    };

    listElement.addEventListener('keydown', handleKeyDown);

    return () => {
      listElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [disabled, matchShortcut, onSelect, type, toggleExpand, visibleShortcutOptions]);

  const handleViewportReady = useCallback(
    (viewport: HTMLDivElement) => {
      viewportRef.current = viewport;
      listWrapperRef.current = viewport;
      wasAtBottomRef.current = getIsAtBottom(viewport);
    },
    [getIsAtBottom],
  );

  // Track previous loading state to only scroll when loading appears (not when it disappears)
  const prevShouldShowBottomLoadingRef = useRef(false);

  // Auto-scroll to bottom when bottom loading appears and user was at bottom
  useEffect(() => {
    // Only scroll when loading appears (transitions from false to true)
    const loadingJustAppeared = shouldShowBottomLoading && !prevShouldShowBottomLoadingRef.current;
    prevShouldShowBottomLoadingRef.current = shouldShowBottomLoading;

    if (!loadingJustAppeared) return;

    const scrollToBottom = (element: HTMLDivElement) => {
      // Use requestAnimationFrame to ensure DOM is updated after loading element is rendered
      requestAnimationFrame(() => {
        element.scrollTop = element.scrollHeight;
      });
    };

    if (shouldUseScrollbar) {
      const viewport = viewportRef.current;
      if (viewport && wasAtBottomRef.current) {
        scrollToBottom(viewport);
      }
    } else {
      const listWrapperElement = listWrapperRef.current;
      if (listWrapperElement && maxHeight && wasAtBottomRef.current) {
        scrollToBottom(listWrapperElement);
      }
    }
  }, [shouldShowBottomLoading, shouldUseScrollbar, maxHeight]);

  useEffect(() => {
    if (shouldUseScrollbar) {
      return;
    }

    const listWrapperElement = listWrapperRef.current;
    if (!listWrapperElement || !maxHeight || (!onReachBottom && !onLeaveBottom && !onScroll)) {
      return;
    }

    // Initialize wasAtBottom state by checking current position
    const checkInitialState = () => {
      const { scrollTop, scrollHeight, clientHeight } = listWrapperElement;
      return scrollTop + clientHeight >= scrollHeight - 1;
    };

    let wasAtBottom = checkInitialState();

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = listWrapperElement;
      const maxScrollTop = scrollHeight - clientHeight;

      // Call onScroll callback if provided
      if (onScroll) {
        onScroll(
          {
            scrollTop,
            maxScrollTop,
          },
          listWrapperElement,
        );
      }

      // Check if scrolled to bottom (with 1px threshold for rounding errors)
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

      // Trigger onReachBottom when entering bottom state
      if (isAtBottom && !wasAtBottom) {
        onReachBottom?.();
      }

      // Trigger onLeaveBottom when leaving bottom state
      if (!isAtBottom && wasAtBottom) {
        onLeaveBottom?.();
      }

      wasAtBottom = isAtBottom;
    };

    listWrapperElement.addEventListener('scroll', handleScroll);

    return () => {
      listWrapperElement.removeEventListener('scroll', handleScroll);
    };
  }, [maxHeight, onReachBottom, onLeaveBottom, onScroll, shouldUseScrollbar]);

  const scrollbarEvents = useMemo<OverlayScrollbarsComponentProps['events'] | undefined>(() => {
    if (!shouldUseScrollbar || (!onReachBottom && !onLeaveBottom && !onScroll)) {
      return undefined;
    }

    return {
      scroll: (_instance: OverlayScrollbars, _event: Event) => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const { scrollTop, scrollHeight, clientHeight } = viewport;
        const maxScrollTop = scrollHeight - clientHeight;

        if (onScroll) {
          onScroll(
            {
              scrollTop,
              maxScrollTop,
            },
            viewport,
          );
        }

        const isAtBottom = getIsAtBottom(viewport);

        if (isAtBottom && !wasAtBottomRef.current) {
          onReachBottom?.();
        }

        if (!isAtBottom && wasAtBottomRef.current) {
          onLeaveBottom?.();
        }

        wasAtBottomRef.current = isAtBottom;
      },
    };
  }, [getIsAtBottom, shouldUseScrollbar, onReachBottom, onLeaveBottom, onScroll]);

  return (
    <ul
      aria-label={listboxLabel || (optionsContent.length === 0 ? 'Dropdown options' : undefined)}
      className={dropdownClasses.list}
      id={listboxId}
      ref={listRef}
      role="listbox"
      style={listStyle}
      tabIndex={-1}
    >
      {hasHeader && (
        <li
          className={dropdownClasses.listHeader}
          role="presentation"
          ref={headerRef}
        >
          <div className={dropdownClasses.listHeaderInner}>
            {headerContent}
          </div>
        </li>
      )}
      {
        maxHeight
          ? (
            shouldUseScrollbar ? (
              <Scrollbar
                className={dropdownClasses.listWrapper}
                defer={scrollbarDefer}
                disabled={false}
                events={scrollbarEvents}
                maxHeight={listWrapperStyle?.maxHeight}
                maxWidth={scrollbarMaxWidth}
                onViewportReady={handleViewportReady}
                options={scrollbarOptions}
              >
                {shouldShowFullStatus ? (
                  <DropdownStatus
                    status={status}
                    loadingText={loadingText}
                    emptyText={emptyText}
                    emptyIcon={emptyIcon}
                  />
                ) : (
                  <>
                    {renderedOptions}
                    {shouldShowBottomLoading && (
                      <li
                        className={dropdownClasses.loadingMore}
                        aria-live="polite"
                        role="status"
                      >
                        <DropdownStatus
                          status="loading"
                          loadingText={loadingText}
                        />
                      </li>
                    )}
                  </>
                )}
              </Scrollbar>
            ) : (
              <div
                ref={listWrapperRef}
                className={dropdownClasses.listWrapper}
                style={listWrapperStyle}
              >
                {shouldShowFullStatus ? (
                  <DropdownStatus
                    status={status}
                    loadingText={loadingText}
                    emptyText={emptyText}
                    emptyIcon={emptyIcon}
                  />
                ) : (
                  <>
                    {renderedOptions}
                    {shouldShowBottomLoading && (
                      <li
                        className={dropdownClasses.loadingMore}
                        aria-live="polite"
                        role="status"
                      >
                        <DropdownStatus
                          status="loading"
                          loadingText={loadingText}
                        />
                      </li>
                    )}
                  </>
                )}
              </div>
            )
          )
          : shouldShowFullStatus ? (
            <DropdownStatus
              status={status}
              loadingText={loadingText}
              emptyText={emptyText}
              emptyIcon={emptyIcon}
            />
          ) : (
            <>
              {renderedOptions}
              {shouldShowBottomLoading && (
                <li
                  className={dropdownClasses.loadingMore}
                  aria-live="polite"
                  role="status"
                >
                  <DropdownStatus
                    status="loading"
                    loadingText={loadingText}
                  />
                </li>
              )}
            </>
          )
      }
      {hasActions && (
        <div ref={actionRef}>
          <DropdownAction {...actionConfig} />
        </div>
      )}
    </ul>
  );
}
