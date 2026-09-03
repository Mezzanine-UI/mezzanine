<script setup lang="ts">
import { cloneVNode, computed, useAttrs, useSlots } from 'vue';
import type { FunctionalComponent, VNode } from 'vue';
import { buttonGroupClasses as classes } from '@mezzanine-ui/core/button';
import clsx from 'clsx';
import type { ButtonGroupProps } from './button-group.types';

/**
 * 按鈕群組，將多個 MznButton 水平或垂直排列。
 *
 * 群組的 `disabled`、`size`、`variant` 會填補子按鈕未指定的同名 prop —— 子按鈕
 * 自己指定的一律優先。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznButton, MznButtonGroup } from '@mezzanine-ui/vue/button';
 * <\/script>
 *
 * <template>
 *   <MznButtonGroup size="large" variant="base-secondary">
 *     <MznButton>取消</MznButton>
 *     <MznButton variant="base-primary">確認</MznButton>
 *   </MznButtonGroup>
 * </template>
 * ```
 *
 * @see MznButton 群組內的按鈕
 */
const props = withDefaults(defineProps<ButtonGroupProps>(), {
  disabled: false,
  fullWidth: false,
  orientation: 'horizontal',
  size: 'main',
  variant: 'base-primary',
});

defineSlots<{
  /**
   * Only accept button elements.
   */
  default?: () => unknown;
}>();

const attrs = useAttrs();
const slots = useSlots();

const hostClasses = computed((): string =>
  clsx(classes.host, classes.orientation(props.orientation), {
    [classes.fullWidth]: props.fullWidth,
  }),
);

const role = computed((): string => (attrs.role as string) ?? 'group');

/**
 * Each child is cloned with the group's values filling in whatever it did not
 * set itself, mirroring React's `cloneElement`. `disabled` uses `??` and the
 * other two `||`, exactly as React does: a button that opts out of the group's
 * disabled state passes `false`, which must survive.
 */
const GroupChildren: FunctionalComponent = () => {
  const children = (slots.default?.() ?? []) as VNode[];

  return children.map((child) => {
    if (!child) return child;

    const childProps = (child.props ?? {}) as Record<string, unknown>;

    return cloneVNode(child, {
      disabled: childProps.disabled ?? props.disabled,
      size: childProps.size || props.size,
      variant: childProps.variant || props.variant,
    });
  });
};
</script>

<template>
  <div :aria-orientation="orientation" :class="hostClasses" :role="role">
    <GroupChildren />
  </div>
</template>
