<script setup lang="ts">
import { computed } from 'vue';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import clsx from 'clsx';
import MznBadge from '../badge/badge.vue';
import MznIcon from '../icon/icon.vue';
import MznTooltip from '../tooltip/tooltip.vue';
import type { PopperPlacement } from '../popper/popper.types';
import type { DescriptionTitleProps } from './description-title.types';

/**
 * 描述列的標題。
 *
 * 給了 `badge` 就把標題文字交給徽章渲染，否則是一般文字。`icon` 會排在文字後面，
 * 再加上 `tooltip` 時滑鼠移上圖示會顯示提示。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznDescriptionTitle } from '@mezzanine-ui/vue/description';
 * <\/script>
 *
 * <template>
 *   <MznDescriptionTitle children="標題" />
 * </template>
 * ```
 *
 * @see MznDescription 把標題與內容排在一起的描述列
 */
const props = withDefaults(defineProps<DescriptionTitleProps>(), {
  badge: undefined,
  icon: undefined,
  size: undefined,
  tooltip: undefined,
  tooltipPlacement: undefined,
  widthType: 'stretch',
});

const hostClasses = computed((): string =>
  clsx(
    classes.titleHost,
    classes.titleWidth(props.widthType),
    props.size && classes.titleSize(props.size),
  ),
);

const tooltipOptions = computed(() => ({
  placement: (props.tooltipPlacement ?? 'top') as PopperPlacement,
}));
</script>

<template>
  <div :class="hostClasses">
    <MznBadge
      v-if="badge"
      :class="classes.titleText"
      :size="size"
      :text="children"
      :variant="badge"
    />
    <span v-else :class="classes.titleText">{{ children }}</span>
    <template v-if="icon">
      <MznTooltip v-if="tooltip" :options="tooltipOptions" :title="tooltip">
        <template #default="trigger">
          <MznIcon
            :ref="trigger.ref"
            :icon="icon"
            :size="16"
            @mouseenter="trigger.onMouseenter"
            @mouseleave="trigger.onMouseleave"
          />
        </template>
      </MznTooltip>
      <MznIcon v-else :icon="icon" :size="16" />
    </template>
  </div>
</template>
