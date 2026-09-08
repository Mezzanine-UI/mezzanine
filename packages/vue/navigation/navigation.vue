<script setup lang="ts">
import { computed, provide, ref, useSlots, watch } from 'vue';
import type {
  ComponentPublicInstance,
  CSSProperties,
  FunctionalComponent,
  VNode,
} from 'vue';
import { navigationClasses as classes } from '@mezzanine-ui/core/navigation';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import MznInput from '../input/input.vue';
import MznScrollbar from '../scrollbar/scrollbar.vue';
import {
  NAVIGATION_ACTIVATED_CONTEXT,
  NAVIGATION_OPTION_LEVEL_CONTEXT,
  navigationOptionLevelContextDefaultValues,
} from './navigation-context';
import MznNavigationFooter from './navigation-footer.vue';
import MznNavigationHeader from './navigation-header.vue';
import MznNavigationOptionCategory from './navigation-option-category.vue';
import MznNavigationOption from './navigation-option.vue';
import MznNavigationOverflowMenu from './navigation-overflow-menu.vue';
import { useCurrentPathname } from './use-current-pathname';
import { useVisibleItems } from './use-visible-items';
import type { NavigationProps } from './navigation.types';

/**
 * 側邊導覽列。
 *
 * slot 依元件種類分派：MznNavigationHeader 到頂部、MznNavigationFooter 到底部，
 * 其餘的選項與分類排成清單。收合時放不下的第一層選項會收進「更多」浮層；
 * `filter` 打開搜尋框後，標題或 href 對不上的選項會被藏起來。第一次載入時會拿
 * 目前網址比對各選項的 `href`，命中的那條路徑自動展開並標成作用中。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznNavigation, MznNavigationOption } from '@mezzanine-ui/vue/navigation';
 * <\/script>
 *
 * <template>
 *   <MznNavigation>
 *     <MznNavigationOption title="首頁" href="/" />
 *   </MznNavigation>
 * </template>
 * ```
 *
 * @see MznNavigationOption 側邊欄裡的單一選項
 */
const props = withDefaults(defineProps<NavigationProps>(), {
  activatedPath: undefined,
  collapsed: undefined,
  exactActivatedMatch: false,
  filter: undefined,
  optionsAnchorComponent: undefined,
});

const emit = defineEmits<{
  /** Fired when the collapsed state changes. */
  collapseChange: [collapsed: boolean];
  /** Fired when a navigation option is clicked. */
  optionClick: [activePath?: string[]];
}>();

defineSlots<{
  /** The header, footer, options and categories the navigation shows. */
  default?: () => unknown;
}>();

const slots = useSlots();

const collapsedState = ref(props.collapsed || false);

const collapsed = computed(
  (): boolean => props.collapsed ?? collapsedState.value,
);

function handleCollapseChange(newCollapsed: boolean): void {
  collapsedState.value = newCollapsed;
  emit('collapseChange', newCollapsed);
}

const innerActivatedPath = ref<string[]>(props.activatedPath || []);
const activatedPathKey = ref<string>(
  props.activatedPath ? props.activatedPath.join('::') : '',
);

function setActivatedPath(newActivatedPath: string[]): void {
  emit('optionClick', newActivatedPath);
  innerActivatedPath.value = newActivatedPath;
  activatedPathKey.value = newActivatedPath.join('::');
}

const currentPathname = useCurrentPathname();

const filterText = ref('');

interface ResolvedChildren {
  footer: VNode | null;
  header: VNode | null;
  items: VNode[];
  level1Items: VNode[];
}

const childrenOf = (vnode: VNode): VNode[] =>
  flattenChildren(
    (
      vnode.children as { default?: () => VNode[] } | null
    )?.default?.() as VNode[],
  );

const resolved = computed((): ResolvedChildren => {
  let header: VNode | null = null;
  let footer: VNode | null = null;
  const items: VNode[] = [];
  const level1Items: VNode[] = [];

  flattenChildren(slots.default?.()).forEach((child) => {
    switch (child.type) {
      case MznNavigationHeader: {
        header = child;
        break;
      }

      case MznNavigationFooter: {
        footer = child;
        break;
      }

      case MznNavigationOptionCategory: {
        level1Items.push(...childrenOf(child));
        items.push(child);
        break;
      }

      case MznNavigationOption: {
        level1Items.push(child);
        items.push(child);
        break;
      }

      default:
        console.warn(
          '[Mezzanine][Navigation]: Navigation only accepts NavigationOption, NavigationOptionCategory, NavigationHeader or NavigationFooter as children.',
        );
    }
  });

  return { footer, header, items, level1Items };
});

const keyOf = (item: VNode): string => {
  const itemProps = (item.props ?? {}) as Record<string, string | undefined>;

  return itemProps.id || itemProps.title || itemProps.href || '';
};

/**
 * On the first load the browser's pathname decides which option is active, so
 * the matching branch opens itself without the consumer saying so.
 */
const hrefActivated = ref(false);

watch(
  currentPathname,
  (pathname) => {
    if (hrefActivated.value || !pathname) return;

    const checkActivatedPathKey = (
      candidates: VNode[],
      path: string[],
    ): boolean => {
      for (const item of candidates) {
        if (item.type !== MznNavigationOption) continue;

        const itemProps = (item.props ?? {}) as Record<
          string,
          string | undefined
        >;
        const newKey = itemProps.id || itemProps.title || itemProps.href;

        if (!newKey) continue;

        const newPath = [...path, newKey];
        const href = itemProps.href;

        const hrefMatches = props.exactActivatedMatch
          ? href === pathname
          : pathname === href || pathname.startsWith(`${href}/`);

        if (href && hrefMatches) {
          setActivatedPath(newPath);

          return true;
        }

        if (checkActivatedPathKey(childrenOf(item), newPath)) return true;
      }

      return false;
    };

    checkActivatedPathKey(resolved.value.level1Items, []);
    hrefActivated.value = true;
  },
  { immediate: true },
);

const { contentRef, visibleCount } = useVisibleItems(
  () => resolved.value.items,
  () => collapsed.value,
);

const collapsedMenuItems = computed((): VNode[] =>
  visibleCount.value !== null
    ? resolved.value.level1Items.slice(visibleCount.value)
    : [],
);

const collapsedHiddenKeys = computed((): Set<string> => {
  if (!collapsed.value || visibleCount.value === null) return new Set<string>();

  return new Set(
    resolved.value.level1Items.slice(visibleCount.value).map(keyOf),
  );
});

provide(
  NAVIGATION_ACTIVATED_CONTEXT,
  computed(() => ({
    activatedPath: props.activatedPath || innerActivatedPath.value,
    activatedPathKey: activatedPathKey.value,
    collapsed: collapsed.value,
    collapsedHiddenKeys: collapsedHiddenKeys.value,
    currentPathname: currentPathname.value,
    filterText: filterText.value,
    handleCollapseChange,
    optionsAnchorComponent: props.optionsAnchorComponent,
    setActivatedPath,
  })),
);

provide(
  NAVIGATION_OPTION_LEVEL_CONTEXT,
  computed(() => navigationOptionLevelContextDefaultValues),
);

const hostClasses = computed((): string =>
  clsx(classes.host, collapsed.value ? classes.collapsed : classes.expand),
);

const showOverflowMenu = computed(
  (): boolean =>
    collapsed.value &&
    visibleCount.value !== null &&
    visibleCount.value < resolved.value.level1Items.length,
);

/** A template unwraps a ref bound with `:ref`, so the content box is set by hand. */
function setContent(element: Element | ComponentPublicInstance | null): void {
  contentRef.value = element as HTMLDivElement | null;
}

function onFilterChange(event: Event): void {
  filterText.value = (event.target as HTMLInputElement).value;
}

const scrollbarStyle: CSSProperties = { flex: '1 1 0', minHeight: 0 };

const NavigationItems: FunctionalComponent = () => resolved.value.items;
const Header: FunctionalComponent = () => resolved.value.header;
const Footer: FunctionalComponent = () => resolved.value.footer;
</script>

<template>
  <nav :class="hostClasses">
    <Header />
    <div :ref="setContent" :class="classes.content">
      <div v-if="filter" :class="classes.searchInput">
        <MznInput
          size="sub"
          variant="search"
          :value="filterText"
          @change="onFilterChange"
        />
      </div>
      <MznScrollbar :disabled="collapsed" :style="scrollbarStyle">
        <ul :class="classes.list">
          <NavigationItems />

          <MznNavigationOverflowMenu
            v-if="showOverflowMenu"
            :items="collapsedMenuItems"
          />
        </ul>
      </MznScrollbar>
    </div>
    <Footer />
  </nav>
</template>
