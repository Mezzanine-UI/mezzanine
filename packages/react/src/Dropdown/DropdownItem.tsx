'use client';

import keycode from 'keycode';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  DropdownCheckPosition,
  dropdownClasses,
  DropdownItemSharedProps,
  DropdownOption,
  DropdownOptionsByType,
  DropdownStatus as DropdownStatusType,
  DropdownType,
} from '@mezzanine-ui/core/dropdown/dropdown';
import { type IconDefinition } from '@mezzanine-ui/icons';

import { CaretDownIcon, CaretRightIcon } from '@mezzanine-ui/icons';

import { useElementHeight } from '../hooks/useElementHeight';
import Typography from '../Typography';
import DropdownAction, { type DropdownActionProps } from './DropdownAction';
import DropdownItemCard from './DropdownItemCard';
import DropdownStatus from './DropdownStatus';
import shortcutTextHandler from './shortcutTextHandler';

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
  } = props;

  const optionsContent = truncateArrayDepth(options, 3);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const hasActions = Boolean(actionConfig?.showActions);
  const hasHeader = Boolean(headerContent);

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

  const renderTreeOptions = (
    optionList: DropdownOption[] | undefined,
    depth: number,
    startIndex: number,
  ): { elements: ReactNode[]; nextIndex: number } => {
    let currentIndex = startIndex;

    const elements = (optionList ?? []).flatMap((option) => {
      currentIndex += 1;
      const optionIndex = currentIndex;
      const level = Math.min(depth, 2) as 0 | 1 | 2;
      const isActive = optionIndex === activeIndex;
      const isSelected = Array.isArray(value)
        ? value.includes(option.id)
        : value === option.id;
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

      const card = (
        <DropdownItemCard
          key={option.id}
          active={isActive}
          checked={isSelected}
          disabled={disabled}
          id={`${listboxId}-option-${optionIndex}`}
          label={option.name}
          level={level}
          mode={mode}
          name={option.name}
          onClick={() => {
            if (disabled) return;
            if (hasChildren && type === 'tree') {
              toggleExpand(option.id);
            } else {
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

      let checkSite: DropdownCheckPosition = 'none';

      if (option?.checkSite) {
        checkSite = option.checkSite;
      }

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

  // Show status when options are empty and status is provided
  const shouldShowStatus = optionsContent.length === 0 && status;

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
            <div className={dropdownClasses.listWrapper} style={listWrapperStyle}>
              {shouldShowStatus ? (
                <DropdownStatus
                  status={status}
                  loadingText={loadingText}
                  emptyText={emptyText}
                  emptyIcon={emptyIcon}
                />
              ) : (
                renderedOptions
              )}
            </div>
          )
          : shouldShowStatus ? (
            <DropdownStatus
              status={status}
              loadingText={loadingText}
              emptyText={emptyText}
              emptyIcon={emptyIcon}
            />
          ) : (
            renderedOptions
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
