<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import type { CSSProperties, FunctionalComponent } from 'vue';
import {
  dropdownClasses,
  type DropdownCheckPosition,
  type DropdownOption,
} from '@mezzanine-ui/core/dropdown/dropdown';
import { isImeComposing } from '@mezzanine-ui/core/utils';
import { CaretDownIcon, CaretRightIcon } from '@mezzanine-ui/icons';
import type { IconDefinition } from '@mezzanine-ui/icons';
import keycode from 'keycode';
import { useElementHeight } from '../_internal/use-element-height';
import MznScrollbar from '../scrollbar/scrollbar.vue';
import MznTypography from '../typography/typography.vue';
import MznDropdownAction from './dropdown-action.vue';
import MznDropdownItemCard from './dropdown-item-card.vue';
import MznDropdownStatus from './dropdown-status.vue';
import shortcutTextHandler from './shortcut-text-handler';
import type { DropdownItemCardProps } from './dropdown-item-card.types';
import type { DropdownItemProps, DropdownItemRow } from './dropdown-item.types';

// Helper function to get only leaf descendant IDs from a tree option (nodes without children)
function getLeafDescendantIds(option: DropdownOption): string[] {
  if (!option.children || option.children.length === 0) {
    return [String(option.id)];
  }

  return option.children.flatMap(getLeafDescendantIds);
}

/**
 * Limits DropdownOption array to a maximum depth, truncating extra children
 * levels and showing an error message if exceeded.
 */
function truncateArrayDepth(
  input: DropdownOption[],
  maxDepth = 3,
  warn = true,
): DropdownOption[] {
  const truncate = (
    options: DropdownOption[],
    currentDepth = 1,
  ): DropdownOption[] => {
    if (currentDepth >= maxDepth) {
      // Stop going deeper once maximum depth is reached, remove children
      return options.map(({ children: _children, ...option }) => option);
    }

    return options.map((option) => {
      if (!option.children) return option;

      return {
        ...option,
        children: truncate(option.children, currentDepth + 1),
      };
    });
  };

  const getDepth = (
    options: DropdownOption[] | undefined,
    depth = 1,
  ): number => {
    if (!options || options.length === 0) return depth - 1;

    return Math.max(
      ...options.map((option) => {
        if (!option.children || option.children.length === 0) {
          return depth - 1;
        }

        return getDepth(option.children, depth + 1);
      }),
    );
  };

  if (getDepth(input) <= maxDepth) return input;

  // Exceeds maximum depth → warn
  if (warn) {
    console.error(
      `[truncateArrayDepth] Input DropdownOption array exceeds ${maxDepth} levels. Extra levels were truncated.`,
    );
  }

  return truncate(input);
}

/**
 * 下拉選單的清單本體。
 *
 * `type` 決定結構：`default` 是平的、`grouped` 多一層群組標題、`tree` 最多三層可展開。
 * 超過三層會被截斷並在 console 報錯。選項可帶快捷鍵，清單取得焦點時按下就會選取。
 * 設了 `maxHeight` 會啟用捲動（預設走 MznScrollbar），並在到底／離底時送出事件。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznDropdownItem } from '@mezzanine-ui/vue/dropdown';
 * <\/script>
 *
 * <template>
 *   <MznDropdownItem
 *     :active-index="activeIndex"
 *     listbox-id="listbox"
 *     :options="options"
 *     @select="onSelect"
 *   />
 * </template>
 * ```
 *
 * @see MznDropdown 帶觸發元素與浮層的完整元件
 * @see MznDropdownItemCard 單一選項列
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownItemProps>(), {
  actionConfig: undefined,
  disabled: false,
  emptyIcon: undefined,
  emptyText: undefined,
  expandedNodes: undefined,
  followText: undefined,
  headerContent: undefined,
  keyboardActiveIndex: undefined,
  listboxLabel: undefined,
  loadingPosition: 'full',
  loadingText: undefined,
  maxHeight: undefined,
  minWidth: undefined,
  mode: 'single',
  sameWidth: false,
  scrollbarDefer: true,
  scrollbarDisabled: false,
  scrollbarMaxWidth: undefined,
  scrollbarOptions: undefined,
  status: undefined,
  toggleCheckedOnClick: undefined,
  type: undefined,
  value: undefined,
});

const emit = defineEmits<{
  hover: [index: number];
  leaveBottom: [];
  reachBottom: [];
  scroll: [
    computed: { maxScrollTop: number; scrollTop: number },
    target: HTMLDivElement,
  ];
  select: [option: DropdownOption];
  toggleExpand: [id: string];
}>();

/** React takes the header as a node prop, so this renders one. */
const HeaderContent: FunctionalComponent = () => props.headerContent;

const list = ref<HTMLUListElement | null>(null);
const listWrapper = ref<HTMLDivElement | null>(null);
const viewport = ref<HTMLDivElement | null>(null);
const header = ref<HTMLLIElement | null>(null);
const action = ref<HTMLDivElement | null>(null);
const internalExpandedNodes = ref<Set<string>>(new Set());
let wasAtBottom = false;

const optionsContent = computed((): DropdownOption[] =>
  truncateArrayDepth(props.options as DropdownOption[], 3),
);

const expandedNodes = computed(
  (): Set<string> => props.expandedNodes ?? internalExpandedNodes.value,
);

const hasActions = computed((): boolean =>
  Boolean(props.actionConfig?.showActions),
);
const hasHeader = computed((): boolean => Boolean(props.headerContent));
const shouldUseScrollbar = computed((): boolean =>
  Boolean(props.maxHeight && !props.scrollbarDisabled),
);

// Measure the areas that eat into the scrollable height
const { height: actionHeight } = useElementHeight(action, () =>
  Boolean(hasActions.value && props.maxHeight),
);
const { height: headerHeight } = useElementHeight(header, () =>
  Boolean(hasHeader.value && props.maxHeight),
);

function toggleExpand(optionId: string): void {
  if (props.expandedNodes) {
    emit('toggleExpand', optionId);

    return;
  }

  const next = new Set(internalExpandedNodes.value);

  if (next.has(optionId)) {
    next.delete(optionId);
  } else {
    next.add(optionId);
  }

  internalExpandedNodes.value = next;
}

const activeIndexForCard = computed((): number | null =>
  props.keyboardActiveIndex !== undefined
    ? props.keyboardActiveIndex
    : props.activeIndex,
);

function calculateNodeSelectionState(
  option: DropdownOption,
  selectedIds: string[],
): { checked: boolean; indeterminate: boolean } {
  if (!option.children || option.children.length === 0) {
    return {
      checked: selectedIds.includes(String(option.id)),
      indeterminate: false,
    };
  }

  // Only check leaf descendants since parent nodes are never added to selectedIds
  const leafIds = getLeafDescendantIds(option);
  const selectedLeafCount = leafIds.filter((id) =>
    selectedIds.includes(id),
  ).length;

  if (selectedLeafCount === 0) return { checked: false, indeterminate: false };

  if (selectedLeafCount === leafIds.length) {
    return { checked: true, indeterminate: false };
  }

  return { checked: false, indeterminate: true };
}

const shortcutTextOf = (option: DropdownOption): string =>
  option.shortcutText
    ? option.shortcutText
    : shortcutTextHandler(option.shortcutKeys ?? []);

const isSelected = (option: DropdownOption): boolean =>
  Array.isArray(props.value)
    ? props.value.includes(option.id)
    : props.value === option.id;

/**
 * The list, flattened in render order with React's running index: a group
 * label does not consume one, every card does, and a tree's children are
 * numbered immediately after their parent.
 */
const rows = computed((): DropdownItemRow[] => {
  const result: DropdownItemRow[] = [];
  let currentIndex = -1;

  const pushCard = (
    option: DropdownOption,
    cardProps: DropdownItemCardProps & { class?: string },
    handlers: { onCheckedChange?: () => void; onClick: () => void },
    optionIndex: number,
  ): void => {
    result.push({
      kind: 'card',
      option,
      optionIndex,
      props: cardProps,
      ...handlers,
    });
  };

  const renderGrouped = (optionList: DropdownOption[]): void => {
    optionList.forEach((groupOption) => {
      if (!groupOption.children || groupOption.children.length === 0) return;

      result.push({
        id: groupOption.id,
        kind: 'group',
        name: groupOption.name,
      });

      groupOption.children.forEach((option) => {
        currentIndex += 1;

        const optionIndex = currentIndex;

        pushCard(
          option,
          {
            active: optionIndex === activeIndexForCard.value,
            appendContent: shortcutTextOf(option),
            checked: isSelected(option),
            checkSite: option?.checkSite ?? 'suffix',
            disabled: props.disabled,
            followText: props.followText,
            id: `${props.listboxId}-option-${optionIndex}`,
            label: option.name,
            mode: props.mode,
            name: option.name,
            showUnderline: option.showUnderline ?? false,
            toggleCheckedOnClick: props.toggleCheckedOnClick,
            validate: option.validate ?? 'default',
          },
          {
            onClick: () => {
              if (props.disabled) return;

              emit('select', option);
            },
          },
          optionIndex,
        );
      });
    });
  };

  const renderTree = (optionList: DropdownOption[], depth: number): void => {
    const selectedIds = Array.isArray(props.value)
      ? props.value.map((id) => String(id))
      : props.value
        ? [String(props.value)]
        : [];

    optionList.forEach((option) => {
      currentIndex += 1;

      const optionIndex = currentIndex;
      const level = Math.min(depth, 2) as 0 | 1 | 2;
      const hasChildren = Boolean(
        option.children && option.children.length > 0,
      );
      const isExpanded = hasChildren && expandedNodes.value.has(option.id);
      let prependIcon: IconDefinition | undefined = undefined;

      if (hasChildren && level !== 2) {
        prependIcon = isExpanded ? CaretDownIcon : CaretRightIcon;
      }

      const checkSite: DropdownCheckPosition = option.showCheckbox
        ? 'prefix'
        : (option.checkSite ?? (props.mode === 'single' ? 'suffix' : 'none'));
      const selectionState =
        hasChildren && props.mode === 'multiple'
          ? calculateNodeSelectionState(option, selectedIds)
          : {
              checked: selectedIds.includes(String(option.id)),
              indeterminate: false,
            };
      const resolvedToggleCheckedOnClick =
        props.toggleCheckedOnClick ??
        !(
          hasChildren &&
          props.type === 'tree' &&
          props.mode === 'multiple' &&
          option.showCheckbox
        );

      pushCard(
        option,
        {
          active: optionIndex === activeIndexForCard.value,
          appendContent: shortcutTextOf(option),
          checked: selectionState.checked,
          checkSite,
          class:
            !hasChildren && level === 1
              ? dropdownClasses.cardLeafLevel1
              : undefined,
          disabled: props.disabled,
          followText: props.followText,
          id: `${props.listboxId}-option-${optionIndex}`,
          indeterminate: selectionState.indeterminate,
          label: option.name,
          level,
          mode: props.mode,
          name: option.name,
          prependIcon,
          showUnderline: option.showUnderline ?? false,
          toggleCheckedOnClick: resolvedToggleCheckedOnClick,
          validate: option.validate ?? 'default',
        },
        {
          onCheckedChange: () => {
            if (!props.disabled) {
              emit('select', option);
            }
          },
          onClick: () => {
            if (props.disabled) return;

            if (hasChildren && props.type === 'tree') {
              toggleExpand(option.id);

              return;
            }

            // In `tree` + `multiple` mode the card already triggers selection
            // through `checkedChange` when the row is clicked, so calling
            // `select` here would fire it twice for leaf nodes. The same holds
            // in `multiple` mode whenever `toggleCheckedOnClick` is enabled.
            if (
              !(props.type === 'tree' && props.mode === 'multiple') &&
              !(props.mode === 'multiple' && resolvedToggleCheckedOnClick)
            ) {
              emit('select', option);
            }
          },
        },
        optionIndex,
      );

      if (hasChildren && isExpanded && props.type === 'tree') {
        renderTree(option.children!, depth + 1);
      }
    });
  };

  const renderDefault = (optionList: DropdownOption[]): void => {
    optionList.forEach((option) => {
      currentIndex += 1;

      const optionIndex = currentIndex;

      pushCard(
        option,
        {
          active: optionIndex === activeIndexForCard.value,
          appendContent: shortcutTextOf(option),
          checked: isSelected(option),
          checkSite: option?.checkSite ?? 'suffix',
          disabled: props.disabled,
          followText: props.followText,
          id: `${props.listboxId}-option-${optionIndex}`,
          label: option.name,
          mode: props.mode,
          name: option.name,
          prependIcon: option.icon,
          showUnderline: option.showUnderline ?? false,
          toggleCheckedOnClick: props.toggleCheckedOnClick,
          validate: option.validate ?? 'default',
        },
        {
          onClick: () => {
            if (props.disabled) return;

            emit('select', option);
          },
        },
        optionIndex,
      );
    });
  };

  if (props.type === 'grouped') {
    renderGrouped(optionsContent.value);
  } else if (props.type === 'tree') {
    renderTree(optionsContent.value, 0);
  } else {
    renderDefault(optionsContent.value);
  }

  return result;
});

// Show full status when options are empty and status is provided.
// Empty status always shows as full; loading respects loadingPosition.
const shouldShowFullStatus = computed((): boolean =>
  Boolean(
    optionsContent.value.length === 0 &&
      props.status &&
      (props.status === 'empty' || props.loadingPosition !== 'bottom'),
  ),
);

const shouldShowBottomLoading = computed((): boolean =>
  Boolean(props.status === 'loading' && props.loadingPosition === 'bottom'),
);

const listStyle = computed((): CSSProperties | undefined => {
  const styles: CSSProperties & Record<string, unknown> = {};

  if (props.maxHeight) {
    styles.maxHeight =
      typeof props.maxHeight === 'number'
        ? `${props.maxHeight}px`
        : props.maxHeight;
  }

  if (props.minWidth !== undefined) {
    styles['--mzn-dropdown-list-min-width'] =
      typeof props.minWidth === 'number'
        ? `${props.minWidth}px`
        : props.minWidth;
  }

  return Object.keys(styles).length > 0 ? styles : undefined;
});

const listWrapperMaxHeight = computed((): string | undefined => {
  if (!props.maxHeight) return undefined;

  const maxHeightValue =
    typeof props.maxHeight === 'number'
      ? props.maxHeight
      : parseFloat(props.maxHeight);

  return `${Math.max(0, maxHeightValue - actionHeight.value - headerHeight.value)}px`;
});

const listWrapperStyle = computed((): CSSProperties | undefined =>
  props.maxHeight ? { maxHeight: listWrapperMaxHeight.value } : undefined,
);

const getIsAtBottom = (element: HTMLElement): boolean => {
  const { scrollTop, scrollHeight, clientHeight } = element;

  return scrollTop + clientHeight >= scrollHeight - 1;
};

const visibleShortcutOptions = computed((): DropdownOption[] => {
  const result: DropdownOption[] = [];

  const collectTree = (optionList?: DropdownOption[]): void => {
    optionList?.forEach((option) => {
      result.push(option);

      if (option.children && expandedNodes.value.has(option.id)) {
        collectTree(option.children);
      }
    });
  };

  if (props.type === 'grouped') {
    optionsContent.value.forEach((groupOption) => {
      groupOption.children?.forEach((option) => result.push(option));
    });
  } else if (props.type === 'tree') {
    collectTree(optionsContent.value);
  } else {
    optionsContent.value.forEach((option) => result.push(option));
  }

  return result;
});

function matchShortcut(
  event: KeyboardEvent,
  shortcut: number | string,
): boolean {
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
    requireMeta !== event.metaKey ||
    requireCtrl !== event.ctrlKey ||
    requireAlt !== event.altKey ||
    requireShift !== event.shiftKey
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

  return (
    typeof eventKeyName === 'string' && eventKeyName.toLowerCase() === mainToken
  );
}

function handleShortcutKeyDown(event: KeyboardEvent): void {
  if (event.repeat || isImeComposing(event)) return;

  const targetOption = visibleShortcutOptions.value.find((option) => {
    if (
      !Array.isArray(option.shortcutKeys) ||
      option.shortcutKeys.length === 0
    ) {
      return false;
    }

    return option.shortcutKeys.some((shortcut) =>
      matchShortcut(event, shortcut),
    );
  });

  if (!targetOption) return;

  event.preventDefault();
  event.stopPropagation();

  if (
    props.type === 'tree' &&
    targetOption.children &&
    targetOption.children.length > 0
  ) {
    toggleExpand(targetOption.id);

    return;
  }

  emit('select', targetOption);
}

let boundList: HTMLUListElement | null = null;

const unbindShortcuts = (): void => {
  boundList?.removeEventListener('keydown', handleShortcutKeyDown);
  boundList = null;
};

watch(
  [list, () => props.disabled],
  ([element, disabled]) => {
    unbindShortcuts();

    if (!element || disabled) return;

    boundList = element;
    element.addEventListener('keydown', handleShortcutKeyDown);
  },
  { immediate: true },
);

onBeforeUnmount(unbindShortcuts);

function reportScroll(element: HTMLElement): void {
  const { scrollTop, scrollHeight, clientHeight } = element;

  emit(
    'scroll',
    { maxScrollTop: scrollHeight - clientHeight, scrollTop },
    element as HTMLDivElement,
  );

  const isAtBottom = getIsAtBottom(element);

  if (isAtBottom && !wasAtBottom) emit('reachBottom');
  if (!isAtBottom && wasAtBottom) emit('leaveBottom');

  wasAtBottom = isAtBottom;
}

function handleViewportReady(element: HTMLDivElement): void {
  viewport.value = element;
  listWrapper.value = element;
  wasAtBottom = getIsAtBottom(element);
}

const scrollbarEvents = computed(() => ({
  scroll: () => {
    if (viewport.value) reportScroll(viewport.value);
  },
}));

function handleWrapperScroll(event: Event): void {
  reportScroll(event.target as HTMLElement);
}

/**
 * Auto-scroll to the bottom when the bottom loading row appears and the user
 * was already at the bottom.
 */
watch(shouldShowBottomLoading, (loading, previous) => {
  if (!loading || previous) return;

  const element = shouldUseScrollbar.value
    ? viewport.value
    : props.maxHeight
      ? listWrapper.value
      : null;

  if (!element || !wasAtBottom) return;

  // Wait for the loading row to be in the DOM before measuring again.
  requestAnimationFrame(() => {
    element.scrollTop = element.scrollHeight;
  });
});

/**
 * Keep focus on the trigger while pressing an option: without this, mousedown
 * blurs the input before the click lands, and a consumer that resets its
 * search text on blur re-renders the list underneath the cursor. The header
 * is excluded because it may hold a real input.
 */
function handleListMouseDown(event: MouseEvent): void {
  if (header.value?.contains(event.target as Node)) return;

  event.preventDefault();
}

const ariaLabel = computed(
  (): string | undefined =>
    props.listboxLabel ||
    (optionsContent.value.length === 0 ? 'Dropdown options' : undefined),
);

const groupLabelClass = dropdownClasses.groupLabel;
const listClass = dropdownClasses.list;
const listHeaderClass = dropdownClasses.listHeader;
const listHeaderInnerClass = dropdownClasses.listHeaderInner;
const listWrapperClass = dropdownClasses.listWrapper;
const loadingMoreClass = dropdownClasses.loadingMore;
const actionWrapperStyle = { position: 'relative', zIndex: 0 } as const;
</script>

<template>
  <ul
    ref="list"
    :aria-label="ariaLabel"
    :class="listClass"
    :id="listboxId"
    role="listbox"
    :style="listStyle"
    :tabindex="-1"
    @mousedown="handleListMouseDown"
  >
    <li
      v-if="hasHeader"
      ref="header"
      :class="listHeaderClass"
      role="presentation"
    >
      <div :class="listHeaderInnerClass"><HeaderContent /></div>
    </li>
    <template v-if="maxHeight">
      <MznScrollbar
        v-if="shouldUseScrollbar"
        :class="listWrapperClass"
        :defer="scrollbarDefer"
        :disabled="false"
        :events="scrollbarEvents"
        :max-height="listWrapperMaxHeight"
        :max-width="scrollbarMaxWidth"
        :options="scrollbarOptions"
        @viewport-ready="handleViewportReady"
      >
        <MznDropdownStatus
          v-if="shouldShowFullStatus"
          :empty-icon="emptyIcon"
          :empty-text="emptyText"
          :loading-text="loadingText"
          :status="status!"
        />
        <template v-else>
          <template
            v-for="row in rows"
            :key="row.kind === 'group' ? row.id : row.option.id"
          >
            <MznTypography
              v-if="row.kind === 'group'"
              :class="groupLabelClass"
              variant="body"
            >
              {{ row.name }}
            </MznTypography>
            <MznDropdownItemCard
              v-else
              v-bind="row.props"
              @checked-change="row.onCheckedChange?.()"
              @click="row.onClick()"
              @mouse-enter="emit('hover', row.optionIndex)"
            />
          </template>
          <li
            v-if="shouldShowBottomLoading"
            aria-live="polite"
            :class="loadingMoreClass"
            role="status"
          >
            <MznDropdownStatus :loading-text="loadingText" status="loading" />
          </li>
        </template>
      </MznScrollbar>
      <div
        v-else
        ref="listWrapper"
        :class="listWrapperClass"
        :style="listWrapperStyle"
        @scroll="handleWrapperScroll"
      >
        <MznDropdownStatus
          v-if="shouldShowFullStatus"
          :empty-icon="emptyIcon"
          :empty-text="emptyText"
          :loading-text="loadingText"
          :status="status!"
        />
        <template v-else>
          <template
            v-for="row in rows"
            :key="row.kind === 'group' ? row.id : row.option.id"
          >
            <MznTypography
              v-if="row.kind === 'group'"
              :class="groupLabelClass"
              variant="body"
            >
              {{ row.name }}
            </MznTypography>
            <MznDropdownItemCard
              v-else
              v-bind="row.props"
              @checked-change="row.onCheckedChange?.()"
              @click="row.onClick()"
              @mouse-enter="emit('hover', row.optionIndex)"
            />
          </template>
          <li
            v-if="shouldShowBottomLoading"
            aria-live="polite"
            :class="loadingMoreClass"
            role="status"
          >
            <MznDropdownStatus :loading-text="loadingText" status="loading" />
          </li>
        </template>
      </div>
    </template>
    <MznDropdownStatus
      v-else-if="shouldShowFullStatus"
      :empty-icon="emptyIcon"
      :empty-text="emptyText"
      :loading-text="loadingText"
      :status="status!"
    />
    <template v-else>
      <template
        v-for="row in rows"
        :key="row.kind === 'group' ? row.id : row.option.id"
      >
        <MznTypography
          v-if="row.kind === 'group'"
          :class="groupLabelClass"
          variant="body"
        >
          {{ row.name }}
        </MznTypography>
        <MznDropdownItemCard
          v-else
          v-bind="row.props"
          @checked-change="row.onCheckedChange?.()"
          @click="row.onClick()"
          @mouse-enter="emit('hover', row.optionIndex)"
        />
      </template>
      <li
        v-if="shouldShowBottomLoading"
        aria-live="polite"
        :class="loadingMoreClass"
        role="status"
      >
        <MznDropdownStatus :loading-text="loadingText" status="loading" />
      </li>
    </template>
    <div v-if="hasActions" ref="action" :style="actionWrapperStyle">
      <MznDropdownAction v-bind="actionConfig" />
    </div>
  </ul>
</template>
