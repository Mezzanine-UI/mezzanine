<script setup lang="ts">
import { cloneVNode, computed, h, useAttrs } from 'vue';
import type {
  FunctionalComponent,
  VNode,
  VNodeArrayChildren,
  VNodeChild,
} from 'vue';
import { breadcrumbClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import { SlashIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import MznIcon from '../icon/icon.vue';
import MznBreadcrumbItem from './breadcrumb-item.vue';
import MznBreadcrumbOverflowMenu from './breadcrumb-overflow-menu.vue';
import type { BreadcrumbItemProps } from './breadcrumb-item.types';
import type { BreadcrumbProps } from './breadcrumb.types';

/**
 * 麵包屑導覽列。
 *
 * 節點可以用 `items` 以資料形式給定，也可以直接把 MznBreadcrumbItem 放進預設
 * slot。超過四個節點時中間會收進「…」選單；`condensed` 則只留最後兩個，其餘
 * 一律收起來。最後一個節點自動標成 `current`。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznBreadcrumb, MznBreadcrumbItem } from '@mezzanine-ui/vue/breadcrumb';
 * <\/script>
 *
 * <template>
 *   <MznBreadcrumb :items="items" />
 *
 *   <MznBreadcrumb condensed>
 *     <MznBreadcrumbItem href="/" name="Home" />
 *     <MznBreadcrumbItem name="Detail" />
 *   </MznBreadcrumb>
 * </template>
 * ```
 *
 * @see MznBreadcrumbItem 每一個節點
 */
/**
 * React writes `aria-label` and `className` after its rest spread, so both win
 * over anything a consumer passed. Vue's fallthrough is the other way round.
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  condensed: undefined,
  items: undefined,
});

const slots = defineSlots<{
  /** The items, as components. `items` is the other way to give them. */
  default?: () => unknown;
}>();

const attrs = useAttrs();

type BreadcrumbEntry = BreadcrumbItemProps | VNode;

const entries = computed((): BreadcrumbEntry[] => {
  if (props.items) return props.items;

  return flattenChildren(slots.default?.() as VNodeArrayChildren | undefined);
});

const isVNode = (entry: BreadcrumbEntry): entry is VNode =>
  typeof (entry as VNode).type !== 'undefined';

function renderItemWithProps(
  entry: BreadcrumbEntry | undefined,
  appendProps?: Partial<BreadcrumbItemProps>,
): VNodeChild {
  if (entry && isVNode(entry)) {
    return appendProps ? cloneVNode(entry, appendProps) : entry;
  }

  // React renders `<BreadcrumbItem {...undefined} current />` for the empty
  // list too, so the cast keeps that reachable rather than widening the prop.
  return h(MznBreadcrumbItem, {
    ...entry,
    ...appendProps,
  } as unknown as BreadcrumbItemProps);
}

function convertToPropsWithId(
  entry: BreadcrumbEntry,
): BreadcrumbItemProps & { id: string } {
  const itemProps = (
    isVNode(entry) ? (entry.props ?? {}) : entry
  ) as BreadcrumbItemProps;

  return { id: itemProps.id || itemProps.name, ...itemProps };
}

const nodes = computed((): VNodeChild[] => {
  const items = entries.value;
  const out: VNodeChild[] = [];

  if (!items) return out;

  const lastIndex = items.length - 1;
  const { condensed } = props;
  const hasOverflowDropdownIcon = !condensed || items.length > 2;
  const collapsedProps = hasOverflowDropdownIcon
    ? condensed
      ? items.map(convertToPropsWithId).slice(0, lastIndex - 1)
      : items.map(convertToPropsWithId).slice(2, lastIndex - 1)
    : [];

  const separator = (): VNodeChild =>
    h(MznIcon, { icon: SlashIcon, key: `slash-${out.length}`, size: 14 });

  // home
  if (!condensed && lastIndex >= 0) {
    out.push(renderItemWithProps(items[0], { current: lastIndex === 0 }));
  }

  // second
  if (!condensed && lastIndex >= 1) {
    out.push(separator());
    out.push(renderItemWithProps(items[1], { current: lastIndex === 1 }));
  }

  // default mode with length <= 4
  if (!condensed && items.length <= 4) {
    if (lastIndex >= 2) {
      out.push(separator());
      out.push(renderItemWithProps(items[2], { current: lastIndex === 2 }));
    }

    if (lastIndex === 3) {
      out.push(separator());
      out.push(renderItemWithProps(items[3], { current: true }));
    }
  }

  // default mode with length > 4 or condensed mode with length > 2
  if (items.length > 4 || condensed) {
    if (!condensed) out.push(separator());

    if (hasOverflowDropdownIcon) {
      out.push(
        h(MznBreadcrumbOverflowMenu, { collapsedProps, key: 'overflow' }),
      );
      out.push(separator());
    }

    // parent of current
    if (lastIndex - 1 >= 0) {
      out.push(renderItemWithProps(items[lastIndex - 1]));
      out.push(separator());
    }

    // current
    out.push(renderItemWithProps(items[lastIndex], { current: true }));
  }

  return out;
});

/**
 * A stable component, not an inline arrow: a new identity on every render
 * would remount the overflow menu and drop the state it holds open.
 */
const BreadcrumbNodes: FunctionalComponent = () => nodes.value;

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const hostClasses = computed((): string =>
  clsx(classes.host, attrs.class as string),
);
</script>

<template>
  <nav v-bind="forwardedAttrs" aria-label="Breadcrumb" :class="hostClasses">
    <BreadcrumbNodes />
  </nav>
</template>
