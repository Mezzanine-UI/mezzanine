<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  watch,
} from 'vue';
import { overflowTooltipClasses as classes } from '@mezzanine-ui/core/overflow-tooltip';
import clsx from 'clsx';
import { resolveElement } from '../_internal/resolve-element';
import MznTag from '../tag/tag.vue';
import MznOverflowTooltip from './overflow-tooltip.vue';
import type { OverflowCounterTagProps } from './overflow-counter-tag.types';

/**
 * 顯示收合標籤數量的計數標籤，點一下展開 MznOverflowTooltip。
 *
 * 點在觸發標籤或浮層以外的地方就收起；`disabled`、`readOnly` 或 `tagSize` 改變時也會收起。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznOverflowCounterTag } from '@mezzanine-ui/vue/overflow-tooltip';
 * <\/script>
 *
 * <template>
 *   <MznOverflowCounterTag :tags="hiddenTags" @tag-dismiss="remove" />
 * </template>
 * ```
 *
 * @see MznOverflowTooltip 被它展開的浮層
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<OverflowCounterTagProps>(), {
  disabled: undefined,
  placement: undefined,
  readOnly: undefined,
  tagSize: undefined,
});

const emit = defineEmits<{
  /** Fired when a tag's dismiss icon is clicked, returning the removed tag's index for syncing state. */
  tagDismiss: [tagIndex: number];
}>();

const attrs = useAttrs();

const open = ref(false);
const trigger = ref<InstanceType<typeof MznTag> | null>(null);
const tooltip = ref<InstanceType<typeof MznOverflowTooltip> | null>(null);

const triggerElement = computed((): HTMLElement | null =>
  resolveElement(trigger.value?.$el),
);

/**
 * React hands the trigger out through `forwardRef`; Vue's equivalent is the
 * parent placing a `ref` on this component, so the element is exposed.
 */
defineExpose({ element: triggerElement });

/**
 * A click anywhere but the trigger and the tooltip closes it. The tooltip is
 * portalled, so it cannot be reached by containment from the trigger — both
 * elements are checked, exactly as React checks both of its refs.
 */
function handleClickAway(event: MouseEvent | TouchEvent): void {
  const target = event.target as HTMLElement | null;
  const triggerNode = triggerElement.value;
  const tooltipNode = tooltip.value?.element ?? null;

  if (
    target === triggerNode ||
    target === tooltipNode ||
    triggerNode?.contains(target) ||
    tooltipNode?.contains(target)
  ) {
    return;
  }

  open.value = false;
}

onMounted(() => {
  document.addEventListener('click', handleClickAway, false);
  document.addEventListener('touchend', handleClickAway, false);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickAway, false);
  document.removeEventListener('touchend', handleClickAway, false);
});

watch([() => props.disabled, () => props.readOnly, () => props.tagSize], () => {
  open.value = false;
});

function handleTriggerClick(event: MouseEvent): void {
  open.value = !open.value;
  (attrs.onClick as ((event: MouseEvent) => void) | undefined)?.(event);
}

const forwardedAttrs = computed(() => {
  const { class: _class, onClick: _onClick, ...rest } = attrs;

  return rest;
});

const triggerClasses = computed((): unknown[] => [
  clsx(classes.counterTagHost, {
    [classes.counterTagDisabled]: props.disabled,
    [classes.counterTagReadOnly]: props.readOnly,
  }),
  attrs.class,
]);
</script>

<template>
  <MznTag
    ref="trigger"
    :class="triggerClasses"
    v-bind="forwardedAttrs"
    :count="tags.length"
    :disabled="disabled"
    :read-only="readOnly"
    :size="tagSize"
    type="overflow-counter"
    @click="handleTriggerClick"
  />
  <MznOverflowTooltip
    ref="tooltip"
    :anchor="triggerElement"
    :open="open"
    :placement="placement"
    :read-only="readOnly"
    :tag-size="tagSize"
    :tags="tags"
    @tag-dismiss="emit('tagDismiss', $event)"
  />
</template>
