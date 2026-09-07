<script setup lang="ts">
import { computed } from 'vue';
import { pageFooterClasses as classes } from '@mezzanine-ui/core/page-footer';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznButton from '../button/button.vue';
import MznButtonGroup from '../button/button-group.vue';
import MznDropdown from '../dropdown/dropdown.vue';
import MznTypography from '../typography/typography.vue';
import type { PageFooterProps } from './page-footer.types';

/**
 * 頁面底部的操作列，右側放主要與次要按鈕，左側放一份補充內容。
 *
 * `type` 決定左側放什麼 —— `standard` 是一顆文字按鈕、`overflow` 是一顆開啟
 * 下拉選單的圖示按鈕、`information` 是一段說明文字。中間可放一句警告訊息，
 * 右側的按鈕由 `actions` 以資料形式給定。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznPageFooter } from '@mezzanine-ui/vue/page-footer';
 * <\/script>
 *
 * <template>
 *   <MznPageFooter
 *     :actions="{ primaryButton: { children: '發佈' }, secondaryButton: { children: '儲存草稿' } }"
 *     supporting-action-name="查看發佈紀錄"
 *   />
 *
 *   <MznPageFooter
 *     annotation="發佈後將無法編輯"
 *     :actions="{ primaryButton: { children: '發佈' } }"
 *     type="information"
 *   />
 * </template>
 * ```
 *
 * @see MznPageHeader 對應的頁首
 */
const props = withDefaults(defineProps<PageFooterProps>(), {
  actions: undefined,
  annotation: undefined,
  annotationClassName: undefined,
  dropdownProps: undefined,
  supportingActionIcon: undefined,
  supportingActionName: undefined,
  supportingActionOnClick: undefined,
  supportingActionType: undefined,
  supportingActionVariant: 'base-ghost',
  type: 'standard',
  warningMessage: undefined,
});

const annotationClasses = computed((): string =>
  clsx(classes.annotation, props.annotationClassName),
);

const dropdownBindings = computed(() => ({
  ...props.dropdownProps,
  options: props.dropdownProps?.options || [],
  placement: props.dropdownProps?.placement || 'top',
}));

/**
 * `children` is pulled out of the spread and rendered as the slot: React's
 * `children` becomes the button's content, while a Vue `v-bind` would leave it
 * on the element as an attribute nobody asked for.
 */
const secondaryButtonBindings = computed(() => {
  const { children: _children, ...rest } = props.actions?.secondaryButton ?? {};

  return { size: 'main' as const, variant: 'base-secondary' as const, ...rest };
});

const primaryButtonBindings = computed(() => {
  const { children: _children, ...rest } = props.actions?.primaryButton ?? {};

  return { size: 'main' as const, variant: 'base-primary' as const, ...rest };
});

const hostClass = classes.host;
const messageClass = classes.message;
</script>

<template>
  <footer :class="hostClass">
    <div :class="annotationClasses">
      <MznButton
        v-if="type === 'standard' && supportingActionName"
        size="main"
        :type="supportingActionType"
        :variant="supportingActionVariant"
        @click="supportingActionOnClick"
      >
        <component :is="() => supportingActionName" />
      </MznButton>
      <MznDropdown
        v-else-if="type === 'overflow' && dropdownProps"
        v-bind="dropdownBindings"
      >
        <template #default="triggerProps">
          <MznButton
            v-bind="triggerProps"
            type="button"
            icon-type="icon-only"
            :icon="supportingActionIcon || DotHorizontalIcon"
            size="main"
            variant="base-ghost"
          />
        </template>
      </MznDropdown>
      <MznTypography
        v-else-if="type === 'information' && annotation"
        color="text-neutral"
        variant="caption"
      >
        {{ annotation }}
      </MznTypography>
    </div>
    <div :class="messageClass">
      <MznTypography
        v-if="warningMessage"
        align="right"
        color="text-warning"
        variant="caption"
      >
        {{ warningMessage }}
      </MznTypography>
    </div>
    <MznButtonGroup>
      <MznButton
        v-if="actions?.secondaryButton"
        v-bind="secondaryButtonBindings"
      >
        <component :is="() => actions?.secondaryButton?.children" />
      </MznButton>
      <MznButton v-if="actions?.primaryButton" v-bind="primaryButtonBindings">
        <component :is="() => actions?.primaryButton?.children" />
      </MznButton>
    </MznButtonGroup>
  </footer>
</template>
