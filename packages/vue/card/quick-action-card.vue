<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import type {
  QuickActionCardComponent,
  QuickActionCardProps,
} from './quick-action-card.types';

/**
 * 小尺寸的快捷卡片：一個圖示加上標題與副標題。
 *
 * 預設渲染成 `button`，`mode` 決定圖示在文字左邊還是上方。圖示與標題至少要給
 * 一個。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznQuickActionCard } from '@mezzanine-ui/vue/card';
 * import { CalendarIcon } from '@mezzanine-ui/icons';
 * <\/script>
 *
 * <template>
 *   <MznQuickActionCard :icon="CalendarIcon" subtitle="查看行程" title="行事曆" />
 *   <MznQuickActionCard :icon="CalendarIcon" mode="vertical" title="行事曆" />
 * </template>
 * ```
 *
 * @see MznCardGroup 把多張卡片排成一列
 */
/**
 * React takes `component` out of the spread; Vue's fallthrough would leave it
 * on the element as an attribute.
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<QuickActionCardProps>(), {
  disabled: false,
  icon: undefined,
  mode: 'horizontal',
  readOnly: false,
  subtitle: undefined,
  title: undefined,
});

const attrs = useAttrs();

const component = computed(
  (): QuickActionCardComponent =>
    (attrs.component as QuickActionCardComponent) ?? 'button',
);

const forwardedAttrs = computed(() => {
  const { class: _class, component: _component, ...rest } = attrs;

  return rest;
});

const hostClasses = computed((): string =>
  clsx(
    classes.quickAction,
    {
      [classes.quickActionDisabled]: props.disabled,
      [classes.quickActionReadOnly]: props.readOnly,
      [classes.quickActionVertical]: props.mode === 'vertical',
    },
    attrs.class as string,
  ),
);

const contentClass = classes.quickActionContent;
const iconClass = classes.quickActionIcon;
const subtitleClass = classes.quickActionSubtitle;
const titleClass = classes.quickActionTitle;
</script>

<template>
  <component
    :is="component"
    v-bind="forwardedAttrs"
    :aria-disabled="disabled || undefined"
    :aria-readonly="readOnly || undefined"
    :class="hostClasses"
  >
    <MznIcon v-if="icon" :class="iconClass" :icon="icon" :size="24" />
    <div v-if="title || subtitle" :class="contentClass">
      <span v-if="title" :class="titleClass">{{ title }}</span>
      <span v-if="subtitle" :class="subtitleClass">{{ subtitle }}</span>
    </div>
  </component>
</template>
