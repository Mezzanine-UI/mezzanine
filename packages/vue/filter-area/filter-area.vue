<script setup lang="ts">
import { computed, provide, ref, useSlots } from 'vue';
import type { FunctionalComponent, VNode } from 'vue';
import { filterAreaClasses as classes } from '@mezzanine-ui/core/filter-area';
import { ChevronDownIcon, ChevronUpIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import MznButton from '../button/button.vue';
import { FILTER_AREA_CONTEXT } from './filter-area-context';
import type { FilterAreaProps } from './filter-area.types';

/**
 * 篩選器容器，管理多條 MznFilterLine 的展開與收合。
 *
 * 預設只顯示第一行，超過一行時操作區會多出一顆展開／收合的按鈕。`size` 會一路
 * 傳到裡面每個欄位，`isDirty` 為 false 時重設按鈕停用。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznFilter, MznFilterArea, MznFilterLine } from '@mezzanine-ui/vue/filter-area';
 * <\/script>
 *
 * <template>
 *   <MznFilterArea submit-text="搜尋" reset-text="重設" @submit="onSubmit" @reset="onReset">
 *     <MznFilterLine>
 *       <MznFilter :span="2">...</MznFilter>
 *     </MznFilterLine>
 *   </MznFilterArea>
 * </template>
 * ```
 *
 * @see MznFilterLine 用來組成篩選器的單行條件列
 * @see MznFilter 包住單一篩選欄位
 */
const props = withDefaults(defineProps<FilterAreaProps>(), {
  actionsAlign: 'end',
  isDirty: true,
  resetButtonType: 'button',
  resetText: 'Reset',
  rowAlign: 'center',
  size: 'main',
  submitButtonType: 'button',
  submitText: 'Search',
});

const emit = defineEmits<{
  /** Fired when the reset button is clicked. */
  reset: [];
  /** Fired when the submit button is clicked. */
  submit: [];
}>();

defineSlots<{
  /** The filter lines the area shows. */
  default?: () => unknown;
}>();

const slots = useSlots();

provide(
  FILTER_AREA_CONTEXT,
  computed(() => ({ size: props.size })),
);

const filterLines = computed((): VNode[] => flattenChildren(slots.default?.()));

const hasMultipleLines = computed((): boolean => filterLines.value.length > 1);

const expanded = ref(false);

function handleToggleExpanded(): void {
  expanded.value = !expanded.value;
}

const hostClasses = computed((): string =>
  clsx(classes.host, { [classes.size(props.size)]: props.size }),
);

const rowClasses = computed((): string =>
  clsx(classes.row, classes.rowAlign(props.rowAlign)),
);

const actionsClasses = computed((): string =>
  clsx(classes.actions, classes.actionsAlign(props.actionsAlign), {
    [classes.actionsExpanded]: expanded.value,
  }),
);

const toggleLabel = computed((): string =>
  expanded.value ? 'Collapse filters' : 'Expand filters',
);

const FilterLines: FunctionalComponent = () => filterLines.value;
const FirstLine: FunctionalComponent = () => filterLines.value[0] ?? null;
</script>

<template>
  <div :class="hostClasses">
    <FilterLines v-if="expanded" />
    <div v-if="expanded || filterLines.length" :class="rowClasses">
      <FirstLine v-if="!expanded" />
      <div :class="actionsClasses">
        <MznButton
          :size="size"
          :type="submitButtonType"
          @click="emit('submit')"
        >
          {{ submitText }}
        </MznButton>
        <MznButton
          :disabled="!isDirty"
          :size="size"
          :type="resetButtonType"
          variant="base-secondary"
          @click="emit('reset')"
        >
          {{ resetText }}
        </MznButton>
        <MznButton
          v-if="hasMultipleLines"
          :aria-expanded="expanded"
          :aria-label="toggleLabel"
          :icon="expanded ? ChevronUpIcon : ChevronDownIcon"
          icon-type="icon-only"
          :size="size"
          :title="toggleLabel"
          type="button"
          variant="base-ghost"
          @click="handleToggleExpanded"
        />
      </div>
    </div>
  </div>
</template>
