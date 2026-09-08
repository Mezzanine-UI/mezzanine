<script setup lang="ts">
import { computed, ref } from 'vue';
import { selectClasses as classes } from '@mezzanine-ui/core/select';
import clsx from 'clsx';
import MznOverflowCounterTag from '../overflow-tooltip/overflow-counter-tag.vue';
import MznTag from '../tag/tag.vue';
import MznTagGroup from '../tag/tag-group.vue';
import type { SelectValue } from './select.types';
import type { SelectTriggerTagsProps } from './select-trigger-tags.types';
import { useSelectTriggerTags } from './use-select-trigger-tags';

/**
 * 多選 Select 觸發器裡的標籤列。
 *
 * `overflowStrategy="counter"` 時只顯示放得下的標籤，其餘收進計數標籤；
 * `"wrap"` 時全部換行顯示。`showTextInputAfterTags` 會在標籤後補一個搜尋輸入框。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznSelectTriggerTags } from '@mezzanine-ui/vue/select';
 * <\/script>
 *
 * <template>
 *   <MznSelectTriggerTags overflow-strategy="counter" :value="selections" @tag-close="remove" />
 * </template>
 * ```
 *
 * @see MznSelectTrigger 放置這個標籤列的觸發器
 */
const props = withDefaults(defineProps<SelectTriggerTagsProps>(), {
  disabled: undefined,
  inputProps: undefined,
  readOnly: undefined,
  required: undefined,
  searchText: undefined,
  showTextInputAfterTags: undefined,
  size: undefined,
  value: () => [],
});

const emit = defineEmits<{
  /** The click handler for the cross icon on tags. */
  tagClose: [target: SelectValue];
}>();

const wrapper = ref<HTMLElement | null>(null);
const tags = ref<HTMLElement | null>(null);

const { FakeTags, overflowSelections, visibleSelections } =
  useSelectTriggerTags({
    containerRef: wrapper,
    enabled: () => props.overflowStrategy === 'counter',
    size: () => props.size,
    tagsRef: tags,
    value: () => props.value,
  });

const displaySelections = computed((): SelectValue[] =>
  props.overflowStrategy === 'counter' ? visibleSelections.value : props.value,
);

const overflowTagNames = computed((): string[] =>
  overflowSelections.value.map((selection) => selection.name),
);

function handleTagClose(event: MouseEvent, selection: SelectValue): void {
  event.stopPropagation();
  emit('tagClose', selection);
}

function handleOverflowDismiss(tagIndex: number): void {
  const target = overflowSelections.value[tagIndex];

  if (!target) return;

  emit('tagClose', target);
}

function stopPropagation(event: MouseEvent): void {
  event.stopPropagation();
}

const wrapperClasses = computed((): string =>
  clsx(classes.triggerTagsInputWrapper, {
    [classes.triggerTagsInputWrapperEllipsis]:
      props.overflowStrategy === 'counter',
  }),
);

const tagsClasses = computed((): string =>
  clsx(classes.triggerTags, {
    [classes.triggerTagsEllipsis]: props.overflowStrategy === 'counter',
  }),
);

const wrapWrapperClasses = clsx(
  classes.triggerTagsInputWrapper,
  classes.triggerTagsInputWrapperWrap,
);
const tagsInputClass = classes.triggerTagsInput;
</script>

<template>
  <div
    v-if="overflowStrategy === 'wrap'"
    ref="wrapper"
    :class="wrapWrapperClasses"
  >
    <span v-for="selection in value" :key="selection.id">
      <MznTag
        v-if="readOnly"
        :label="selection.name"
        read-only
        :size="size"
        type="static"
      />
      <MznTag
        v-else
        :disabled="disabled"
        :label="selection.name"
        :size="size"
        type="dismissable"
        @close="handleTagClose($event, selection)"
      />
    </span>
    <div v-if="showTextInputAfterTags" :class="tagsInputClass">
      <input
        v-bind="inputProps"
        aria-autocomplete="list"
        :aria-disabled="disabled"
        aria-haspopup="listbox"
        :aria-readonly="readOnly"
        :aria-required="required"
        autocomplete="off"
        :disabled="disabled"
        :readonly="readOnly"
        :required="required"
        type="search"
        :value="searchText"
      />
    </div>
  </div>
  <div v-else ref="wrapper" :class="wrapperClasses">
    <div ref="tags" :class="tagsClasses">
      <MznTagGroup>
        <MznTag
          v-for="selection in displaySelections"
          :key="selection.id"
          :disabled="readOnly ? undefined : disabled"
          :label="selection.name"
          :read-only="readOnly ? true : undefined"
          :size="size"
          :type="readOnly ? 'static' : 'dismissable'"
          @close="handleTagClose($event, selection)"
        />
        <MznOverflowCounterTag
          v-if="overflowSelections.length"
          key="overflow-counter"
          :disabled="disabled"
          :read-only="readOnly"
          :tag-size="size"
          :tags="overflowTagNames"
          @click="stopPropagation"
          @tag-dismiss="handleOverflowDismiss"
        />
      </MznTagGroup>

      <FakeTags />
    </div>

    <div v-if="showTextInputAfterTags" :class="tagsInputClass">
      <input
        v-bind="inputProps"
        aria-autocomplete="list"
        :aria-disabled="disabled"
        aria-haspopup="listbox"
        :aria-readonly="readOnly"
        :aria-required="required"
        autocomplete="off"
        :disabled="disabled"
        :readonly="readOnly"
        :required="required"
        type="search"
        :value="searchText"
      />
    </div>
  </div>
</template>
