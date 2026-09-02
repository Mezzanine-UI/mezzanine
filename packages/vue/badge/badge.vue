<script setup lang="ts">
import { computed, useSlots } from 'vue';
import {
  badgeClasses as classes,
  type BadgeCountVariant,
  type BadgeVariant,
} from '@mezzanine-ui/core/badge';
import clsx from 'clsx';
import type { BadgeProps } from './badge.types';

/**
 * 徽章元件，用於顯示數字計數、狀態圓點或文字標籤。
 *
 * 支援四種 variant 類型：count（數字計數）、dot（狀態圓點）、dot 含文字以及 text（純文字標籤）。
 * 計數型徽章可設定 `overflowCount` 限制最大顯示數值；當 `count` 為 0 時徽章自動隱藏。
 * 使用預設 slot 時（僅限 dot 型），徽章會以覆疊方式出現在子元素右上角。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznBadge } from '@mezzanine-ui/vue/badge';
 * <\/script>
 *
 * <template>
 *   <!-- 數字計數徽章 -->
 *   <MznBadge variant="count-alert" :count="5" />
 *
 *   <!-- 超出上限顯示 99+ -->
 *   <MznBadge variant="count-brand" :count="120" :overflow-count="99" />
 *
 *   <!-- 狀態圓點（附著於圖示右上角） -->
 *   <MznBadge variant="dot-error">
 *     <BellIcon />
 *   </MznBadge>
 *
 *   <!-- 文字徽章 -->
 *   <MznBadge variant="text-info" text="NEW" />
 * </template>
 * ```
 */
const props = defineProps<BadgeProps>();

/**
 * React spreads `...rest` and merges `className` onto the inner span element,
 * not onto the container div. Vue would put fallthrough attributes on the root
 * by default, so inheritance is turned off and `$attrs` is bound explicitly.
 *
 * Note: element names are written without angle brackets on purpose. An
 * unbalanced tag inside a script comment breaks SFC parsing, and the compiler
 * reports it as "Element is missing end tag" at end-of-file.
 */
defineOptions({ inheritAttrs: false });

defineSlots<{
  default?: () => unknown;
}>();

const slots = useSlots();

const isCountVariant = (variant: BadgeVariant): variant is BadgeCountVariant =>
  [
    'count-alert',
    'count-inactive',
    'count-inverse',
    'count-brand',
    'count-info',
  ].includes(variant);

const containerClasses = computed((): string =>
  classes.container(!!slots.default),
);

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    classes.variant(props.variant),
    { [classes.hide]: isCountVariant(props.variant) && props.count === 0 },
    props.size && classes.size(props.size),
  ),
);

const content = computed((): string | number | undefined => {
  if (!isCountVariant(props.variant)) return props.text;

  const { count, overflowCount } = props;

  return overflowCount && count > overflowCount ? `${overflowCount}+` : count;
});
</script>

<template>
  <div :class="containerClasses">
    <slot />

    <span v-bind="$attrs" :class="hostClasses">{{ content }}</span>
  </div>
</template>
