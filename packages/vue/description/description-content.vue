<script setup lang="ts">
import { computed, inject } from 'vue';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import { CaretDownIcon, CaretUpIcon } from '@mezzanine-ui/icons';
import type { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { useHasListener } from '../_internal/use-has-listener';
import MznIcon from '../icon/icon.vue';
import {
  DESCRIPTION_CONTEXT,
  descriptionContextDefaultValue,
} from './description-context';
import type { DescriptionContentProps } from './description-content.types';

/**
 * 描述列的內容。
 *
 * `variant` 決定樣式：`trend-up` / `trend-down` 會在文字前加上箭頭，`with-icon`
 * 會在文字後面加上可點的圖示。尺寸沒指定時跟著所在的 MznDescription 走。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznDescriptionContent } from '@mezzanine-ui/vue/description';
 * <\/script>
 *
 * <template>
 *   <MznDescriptionContent children="12,345" variant="statistic" />
 * </template>
 * ```
 *
 * @see MznDescription 把標題與內容排在一起的描述列
 */
const props = withDefaults(defineProps<DescriptionContentProps>(), {
  icon: undefined,
  size: undefined,
  variant: 'normal',
});

const emit = defineEmits<{
  /** Fired when the trailing icon is clicked. */
  clickIcon: [];
}>();

const hasListener = useHasListener();

const context = inject(DESCRIPTION_CONTEXT, undefined);

const size = computed(
  () =>
    props.size ?? context?.value.size ?? descriptionContextDefaultValue.size,
);

/**
 * Bound as an object rather than with `@click`, because React leaves the
 * handler off entirely when the consumer gave none — and an icon with a click
 * listener draws a pointer cursor.
 */
const iconBindings = computed(() => ({
  class: classes.contentIcon,
  icon: props.icon as IconDefinition,
  onClick: hasListener('clickIcon') ? () => emit('clickIcon') : undefined,
  size: 16,
}));

const hostClasses = computed((): string =>
  clsx(
    classes.contentHost,
    classes.contentVariant(props.variant),
    classes.contentSize(size.value),
  ),
);
</script>

<template>
  <span :class="hostClasses">
    <MznIcon
      v-if="variant === 'trend-up'"
      :class="classes.contentTrendUp"
      :icon="CaretUpIcon"
      :size="16"
    />
    <MznIcon
      v-if="variant === 'trend-down'"
      :class="classes.contentTrendDown"
      :icon="CaretDownIcon"
      :size="16"
    />
    {{ children }}
    <MznIcon v-if="variant === 'with-icon' && icon" v-bind="iconBindings" />
  </span>
</template>
