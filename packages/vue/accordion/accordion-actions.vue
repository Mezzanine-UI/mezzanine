<script setup lang="ts">
import { computed, h, Text, useSlots } from 'vue';
import type { FunctionalComponent, VNode, VNodeArrayChildren } from 'vue';
import { accordionClasses } from '@mezzanine-ui/core/accordion';
import { flattenChildren } from '../_internal/flatten-children';
import MznButton from '../button/button.vue';
import MznButtonGroup from '../button/button-group.vue';
import MznDropdown from '../dropdown/dropdown.vue';
import type { AccordionActionsProps } from './accordion-actions.types';

/**
 * 手風琴標題右側的操作按鈕區。
 *
 * 只收 MznButton 與 MznDropdown，其餘子項會被丟掉並印出警告。內容可以放在預設
 * slot，也可以放進 `children` 欄位 —— 後者是 MznAccordionTitle 的 `actions`
 * 設定物件使用的形式。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznAccordionActions } from '@mezzanine-ui/vue/accordion';
 * <\/script>
 *
 * <template>
 *   <MznAccordionActions>
 *     <MznButton variant="base-text-link">編輯</MznButton>
 *   </MznAccordionActions>
 * </template>
 * ```
 *
 * @see MznAccordionTitle 承載這一區的標題列
 */
const props = defineProps<AccordionActionsProps>();

defineSlots<{
  /** The buttons the actions area shows. */
  default?: () => unknown;
}>();

const slots = useSlots();

/**
 * A slot hands back an array, but the `children` field of an actions config
 * can be a single node.
 */
const toChildren = (value: unknown): VNodeArrayChildren => {
  if (Array.isArray(value)) return value as VNodeArrayChildren;

  return value == null ? [] : [value as VNode];
};

const children = computed((): VNode[] =>
  flattenChildren(slots.default?.() ?? toChildren(props.children)).filter(
    (child) => {
      // React's `isValidElement` is false for text, so text is neither warned
      // about nor dropped.
      if (child.type === Text) return true;

      if (child.type !== MznButton && child.type !== MznDropdown) {
        console.warn(
          '[Mezzanine][Accordion] Only Button or Dropdown is allowed as the child of AccordionActions.',
        );

        return false;
      }

      return true;
    },
  ),
);

/**
 * Built with `h` rather than written in the template because the button group
 * reads its own slot to clone each button: a wrapper component in between
 * would be the only child it ever sees.
 */
const Actions: FunctionalComponent = () =>
  h(
    MznButtonGroup,
    {
      class: accordionClasses.titleActions,
      disabled: props.disabled,
      fullWidth: props.fullWidth,
      orientation: props.orientation,
      size: props.size,
      variant: props.variant,
    },
    { default: () => children.value },
  );
</script>

<template>
  <Actions />
</template>
