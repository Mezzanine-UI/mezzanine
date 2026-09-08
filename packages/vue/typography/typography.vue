<script setup lang="ts">
import { computed, Fragment, Text, useSlots, type VNode } from 'vue';
import {
  toTypographyCssVars,
  typographyClasses as classes,
} from '@mezzanine-ui/core/typography';
import type { Component } from 'vue';
import type { TypographySemanticType } from '@mezzanine-ui/system/typography';
import clsx from 'clsx';
import type { TypographyProps } from './typography.types';

/**
 * 文字排版元件，提供一致的語意化文字樣式。
 *
 * 透過 `variant` 套用設計系統中定義的語意排版類型（如 `h1`、`h2`、`h3`、`body`、`caption` 等），
 * 並自動推斷對應的 HTML 標籤（h1–h3 對應同名標籤，body 系列對應 p，其餘對應 span）。
 * 可透過 `color` 套用調色盤中的文字色彩，`align` 控制對齊方式，`ellipsis` 啟用單行截斷省略號。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznTypography } from '@mezzanine-ui/vue/typography';
 * <\/script>
 *
 * <template>
 *   <!-- 標題 -->
 *   <MznTypography variant="h1">頁面標題</MznTypography>
 *
 *   <!-- 本文 -->
 *   <MznTypography variant="body">這是一段說明文字。</MznTypography>
 *
 *   <!-- 套用色彩 -->
 *   <MznTypography variant="body" color="error">錯誤提示訊息</MznTypography>
 *
 *   <!-- 單行截斷（需搭配 block 或 inline-block 容器） -->
 *   <MznTypography variant="caption" ellipsis display="block">
 *     超長文字會在此被截斷顯示省略號...
 *   </MznTypography>
 * </template>
 * ```
 */
const props = withDefaults(defineProps<TypographyProps>(), {
  align: undefined,
  color: undefined,
  component: undefined,
  display: undefined,
  ellipsis: false,
  noWrap: false,
  variant: 'body',
});

defineSlots<{
  default?: () => unknown;
}>();

const slots = useSlots();

/** Mirrors React's `getComponentFromType`. */
function getTagFromType(type: TypographySemanticType): string {
  if (type === 'h1' || type === 'h2' || type === 'h3') return type;

  if (type.startsWith('body') || type.startsWith('text-link-body')) return 'p';

  return 'span';
}

/**
 * `:is` takes a tag name or a component, which is wider than
 * `TypographyComponent`: Vue's prop inference flattens the literal tag union
 * to `string` on the way through `defineProps`.
 */
const tag = computed(
  (): string | Component => props.component ?? getTagFromType(props.variant),
);

const hostClasses = computed((): string =>
  clsx(classes.type(props.variant), {
    [classes.align]: props.align,
    [classes.color]: props.color,
    [classes.display]: props.display,
    [classes.ellipsis]: props.ellipsis,
    [classes.noWrap]: props.noWrap,
  }),
);

const hostStyles = computed(
  (): Record<string, string> =>
    toTypographyCssVars({
      align: props.align,
      color: props.color,
      display: props.display,
    }) as Record<string, string>,
);

/**
 * React sets `title` to the children when `ellipsis` is on and the children
 * are a plain string, so a truncated line is still readable on hover. The
 * Angular port could not inspect projected content and silently dropped this;
 * Vue can read the slot's vnodes, so the behaviour is mirrored.
 */
const title = computed((): string | undefined => {
  if (!props.ellipsis) return undefined;

  const nodes = slots.default?.() ?? [];
  const flattened: VNode[] = nodes.flatMap((node) =>
    node.type === Fragment && Array.isArray(node.children)
      ? (node.children as VNode[])
      : [node],
  );

  if (flattened.length !== 1) return undefined;

  const [only] = flattened;

  return only.type === Text && typeof only.children === 'string'
    ? only.children
    : undefined;
});
</script>

<template>
  <component :is="tag" :class="hostClasses" :style="hostStyles" :title="title">
    <slot />
  </component>
</template>
