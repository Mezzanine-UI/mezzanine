<script setup lang="ts">
import { cloneVNode, computed, h, inject, useSlots } from 'vue';
import type { CSSProperties, FunctionalComponent, VNode } from 'vue';
import {
  filterAreaClasses as classes,
  filterAreaPrefix,
} from '@mezzanine-ui/core/filter-area';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import { FILTER_AREA_CONTEXT } from './filter-area-context';
import type { FilterProps } from './filter.types';

/**
 * 單一篩選條件，決定欄位在行裡佔多寬。
 *
 * 一行是 6 欄的 Grid，`span` 決定佔幾欄；`grow` 為 true 時直接填滿整行，此時
 * `span` 不生效。所在 MznFilterArea 的 `size` 會補到裡面沒有自己指定尺寸的輸入
 * 元件上。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznFilter } from '@mezzanine-ui/vue/filter-area';
 * import { MznFormField } from '@mezzanine-ui/vue/form';
 * import { MznInput } from '@mezzanine-ui/vue/input';
 * <\/script>
 *
 * <template>
 *   <MznFilter :span="2">
 *     <MznFormField label="名稱" name="name" layout="horizontal">
 *       <MznInput placeholder="請輸入" />
 *     </MznFormField>
 *   </MznFilter>
 * </template>
 * ```
 *
 * @see MznFilterLine 包住多個 MznFilter 的行容器
 * @see MznFilterArea 管理整個篩選器的容器
 */
const props = withDefaults(defineProps<FilterProps>(), {
  align: 'stretch',
  grow: false,
  minWidth: undefined,
  span: 2,
});

defineSlots<{
  /** The form fields this filter holds. */
  default?: () => unknown;
}>();

const slots = useSlots();

const context = inject(FILTER_AREA_CONTEXT, undefined);

const hostClasses = computed((): string =>
  clsx(classes.filter, {
    [classes.filterGrow]: props.grow,
    [classes.filterAlign(props.align)]: props.align,
  }),
);

const hostStyle = computed((): CSSProperties => {
  const style: CSSProperties = {};

  if (props.minWidth) {
    style.minWidth =
      typeof props.minWidth === 'number'
        ? `${props.minWidth}px`
        : props.minWidth;
  }

  if (!props.grow) {
    (style as Record<string, unknown>)[`--${filterAreaPrefix}-filter-span`] =
      props.span;
  }

  return style;
});

/**
 * The area's size fills in for every input that did not ask for one, one level
 * inside each form field. React reaches them the same way, through the field's
 * own children.
 */
const sizedChildren = computed((): VNode[] => {
  const children = flattenChildren(slots.default?.());
  const size = context?.value.size;

  if (!size) return children;

  return children.map((formField) => {
    const fieldSlots = formField.children as
      | { default?: () => unknown }
      | undefined;

    const sizedInputs = flattenChildren(fieldSlots?.default?.() as never).map(
      (input) =>
        (input.props as { size?: string } | null)?.size === undefined
          ? cloneVNode(input, { size })
          : input,
    );

    return h(formField.type as never, formField.props, {
      default: () => sizedInputs,
    });
  });
});

const FilterChildren: FunctionalComponent = () => sizedChildren.value;
</script>

<template>
  <div :class="hostClasses" :style="hostStyle"><FilterChildren /></div>
</template>
