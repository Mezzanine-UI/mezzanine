<script setup lang="ts">
import { computed } from 'vue';
import type { VNodeArrayChildren, VNodeChild } from 'vue';
import { contentHeaderClasses as classes } from '@mezzanine-ui/core/content-header';
import { ChevronLeftIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { useHasListener } from '../_internal/use-has-listener';
import MznButton from '../button/button.vue';
import MznButtonGroup from '../button/button-group.vue';
import MznTypography from '../typography/typography.vue';
import {
  renderActionsProp,
  renderFilterProp,
  renderIconButtonsProp,
  resolveContentHeaderChild,
} from './content-header-utils';
import type { ContentHeaderProps } from './content-header.types';

/**
 * 內容區塊的標題列：標題、說明、篩選器、動作按鈕與工具圖示。
 *
 * 內容可以用 props 給（`filter`、`actions`、`utilities`），也可以直接把元件放進
 * 預設 slot —— 放進去的順序不重要，會依元件種類分派到對應的位置，而 props 優先
 * 於 slot。`size` 會強制蓋掉子項自己的尺寸。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznContentHeader } from '@mezzanine-ui/vue/content-header';
 * <\/script>
 *
 * <template>
 *   <MznContentHeader description="說明文字" size="main" title="標題">
 *     <a href="/back" title="back" />
 *     <MznInput placeholder="搜尋..." variant="search" />
 *     <MznButton variant="base-secondary">儲存草稿</MznButton>
 *     <MznButton>發布</MznButton>
 *   </MznContentHeader>
 * </template>
 * ```
 *
 * @see MznContentHeaderResponsive 只在某個斷點顯示的子項
 * @see MznPageFooter 對應的頁尾操作列
 */
const props = withDefaults(defineProps<ContentHeaderProps>(), {
  actions: undefined,
  backButtonLabel: 'Back',
  description: undefined,
  filter: undefined,
  size: 'main',
  titleComponent: undefined,
  utilities: undefined,
});

const emit = defineEmits<{
  backClick: [];
}>();

const slots = defineSlots<{
  /**
   * The back link, the filter, the action buttons and the utility icons, in
   * any order.
   */
  default?: () => unknown;
}>();

const hasListener = useHasListener();

const titleComponent = computed(
  (): NonNullable<ContentHeaderProps['titleComponent']> =>
    props.titleComponent ?? (props.size === 'main' ? 'h1' : 'h2'),
);

const renderFilter = computed(
  (): VNodeChild => renderFilterProp(props.filter, props.size),
);

const renderActions = computed((): VNodeChild[] | null =>
  props.actions ? renderActionsProp(props.actions, props.size) : null,
);

const renderUtilities = computed((): VNodeChild[] | null =>
  props.utilities ? renderIconButtonsProp(props.utilities, props.size) : null,
);

const resolved = computed(() =>
  resolveContentHeaderChild(
    slots.default?.() as VNodeArrayChildren | undefined,
    props.size,
    props.backButtonLabel,
  ),
);

/** The `back-click` listener takes precedence over a back link in the slot. */
const renderBackButton = computed(
  (): VNodeChild =>
    hasListener('backClick') ? null : resolved.value.backButton,
);

const hasBackClickListener = (): boolean => hasListener('backClick');

const hostClasses = computed((): string =>
  clsx(classes.host, classes.size(props.size)),
);

const actionAreaClass = classes.actionArea;
const backButtonClass = classes.backButton;
const textGroupClass = classes.textGroup;
const titleAreaClass = classes.titleArea;
const utilitiesClass = classes.utilities;
</script>

<template>
  <header :class="hostClasses">
    <span :class="titleAreaClass">
      <!-- title area -->
      <span
        v-if="(hasBackClickListener() || renderBackButton) && size !== 'sub'"
        :class="backButtonClass"
      >
        <MznButton
          v-if="hasBackClickListener()"
          :aria-label="backButtonLabel"
          :icon="ChevronLeftIcon"
          icon-type="icon-only"
          size="sub"
          type="button"
          variant="base-tertiary"
          @click="emit('backClick')"
        />
        <component :is="() => renderBackButton" v-else />
      </span>

      <span :class="textGroupClass">
        <MznTypography
          align="left"
          color="text-neutral-solid"
          :component="titleComponent"
          :variant="size === 'main' ? 'h2' : 'h3'"
        >
          {{ title }}
        </MznTypography>
        <MznTypography
          v-if="description"
          align="left"
          color="text-neutral"
          variant="caption"
        >
          {{ description }}
        </MznTypography>
      </span>
    </span>

    <!-- actions area -->
    <span :class="actionAreaClass">
      <component :is="() => renderFilter ?? resolved.filter" />
      <MznButtonGroup v-if="renderActions || resolved.actions.length > 0">
        <component :is="() => renderActions ?? resolved.actions" />
      </MznButtonGroup>
      <span
        v-if="renderUtilities || resolved.utilities.length > 0"
        :class="utilitiesClass"
      >
        <component :is="() => renderUtilities ?? resolved.utilities" />
      </span>
    </span>
  </header>
</template>
