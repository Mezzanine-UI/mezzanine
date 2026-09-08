<script setup lang="ts">
import { computed, h, ref, useSlots } from 'vue';
import type { FunctionalComponent, VNode } from 'vue';
import { accordionGroupClasses as classes } from '@mezzanine-ui/core/accordion';
import { flattenChildren } from '../_internal/flatten-children';
import MznAccordion from './accordion.vue';
import type { AccordionGroupProps } from './accordion-group.types';

/**
 * 把多個手風琴排成一組。
 *
 * `size` 會蓋掉每個子手風琴自己的尺寸。`exclusive` 時同時只會有一個展開：群組
 * 接手未受控子項的展開狀態，已經給了 `expanded` 的子項不受影響。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznAccordion, MznAccordionGroup } from '@mezzanine-ui/vue/accordion';
 * <\/script>
 *
 * <template>
 *   <MznAccordionGroup exclusive>
 *     <MznAccordion title="付款方式">支援多種付款方式。</MznAccordion>
 *     <MznAccordion title="運送政策">1-3 個工作天內出貨。</MznAccordion>
 *   </MznAccordionGroup>
 * </template>
 * ```
 *
 * @see MznAccordion 群組裡的單一手風琴
 */
const props = withDefaults(defineProps<AccordionGroupProps>(), {
  exclusive: false,
  size: undefined,
});

defineSlots<{
  /** The accordions the group arranges. */
  default?: () => unknown;
}>();

const slots = useSlots();

const expandedIndex = ref<number | null>(null);

const hyphenate = (name: string): string =>
  name.replace(/\B([A-Z])/g, '-$1').toLowerCase();

/**
 * A template writes a prop either way round, and a valueless one arrives as an
 * empty string. JSX has neither problem, so React reads `child.props` directly.
 */
function rawProp(vnode: VNode, name: string): unknown {
  const vnodeProps = (vnode.props ?? {}) as Record<string, unknown>;

  return vnodeProps[name] ?? vnodeProps[hyphenate(name)];
}

const children = computed((): VNode[] => flattenChildren(slots.default?.()));

const defaultExpandedIndex = computed((): number =>
  children.value.findIndex((child) => {
    if (child.type !== MznAccordion) return false;

    const defaultExpanded = rawProp(child, 'defaultExpanded');

    return (
      rawProp(child, 'expanded') === undefined &&
      (defaultExpanded === '' || Boolean(defaultExpanded))
    );
  }),
);

const resolvedExpandedIndex = computed((): number =>
  expandedIndex.value === null
    ? defaultExpandedIndex.value
    : expandedIndex.value,
);

function handleChange(index: number, open: boolean): void {
  expandedIndex.value = open ? index : -1;
}

/**
 * Rebuilt rather than cloned: cloning merges listeners into an array, and the
 * group's `onChange` already calls the child's own — the child would hear it
 * twice.
 */
const childrenWithProps = computed((): VNode[] =>
  children.value.map((child, index) => {
    if (child.type !== MznAccordion) return child;

    const childProps = (child.props ?? {}) as Record<string, unknown>;
    const extraProps: Record<string, unknown> = { size: props.size };

    if (props.exclusive) {
      const isExpandedControlled = rawProp(child, 'expanded') !== undefined;
      const ownChange = childProps.onChange as
        | ((open: boolean) => void)
        | undefined;

      if (!isExpandedControlled) {
        extraProps.expanded = resolvedExpandedIndex.value === index;
      }

      extraProps.onChange = (open: boolean): void => {
        ownChange?.(open);

        if (!isExpandedControlled) handleChange(index, open);
      };
    }

    return h(
      MznAccordion,
      { ...childProps, ...extraProps, key: child.key ?? undefined },
      child.children as never,
    );
  }),
);

const GroupChildren: FunctionalComponent = () => childrenWithProps.value;
</script>

<template>
  <div :class="classes.host"><GroupChildren /></div>
</template>
