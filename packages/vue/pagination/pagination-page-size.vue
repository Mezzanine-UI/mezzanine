<script setup lang="ts">
import { computed, ref } from 'vue';
import { paginationPageSizeClasses as classes } from '@mezzanine-ui/core/pagination';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import MznDropdown from '../dropdown/dropdown.vue';
import MznSelectTrigger from '../select/select-trigger.vue';
import MznTypography from '../typography/typography.vue';
import type { PaginationPageSizeProps } from './pagination-page-size.types';

/**
 * 分頁列左側的每頁筆數選擇器：一段標籤與一個下拉選單。
 *
 * @example
 * ```vue
 * <MznPaginationPageSize
 *   label="每頁顯示："
 *   :options="[10, 20, 50]"
 *   :value="pageSize"
 *   @change="pageSize = $event"
 * />
 * ```
 *
 * @see MznPagination showPageSizeOptions 時渲染這一段
 */
const props = withDefaults(defineProps<PaginationPageSizeProps>(), {
  disabled: false,
  label: undefined,
  options: () => [10, 20, 50, 100],
  renderOptionName: (pageSize: number) => `${pageSize}`,
  value: undefined,
});

const emit = defineEmits<{
  change: [pageSize: number];
}>();

const open = ref(false);

const currentValue = computed((): DropdownOption | undefined =>
  props.value
    ? {
        id: `${props.value}`,
        name: props.renderOptionName(props.value),
      }
    : undefined,
);

const selectOptions = computed((): DropdownOption[] =>
  props.options.map((option) => ({
    id: `${option}`,
    name: props.renderOptionName(option),
  })),
);

function dropdownOnSelect(option: DropdownOption): void {
  emit('change', Number(option.id));
  open.value = false;
}

const hostClass = classes.host;
const selectClass = classes.select;
</script>

<template>
  <div :class="hostClass">
    <MznTypography
      v-if="label"
      component="div"
      ellipsis
      variant="label-primary"
    >
      {{ label }}
    </MznTypography>
    <MznDropdown
      :disabled="disabled"
      flip
      :min-width="0"
      :open="open"
      :options="selectOptions"
      same-width
      :value="currentValue?.id"
      @select="dropdownOnSelect"
      @visibility-change="open = $event"
    >
      <template #default="triggerProps">
        <MznSelectTrigger
          v-bind="triggerProps"
          :class="selectClass"
          :disabled="disabled"
          size="sub"
          :value="currentValue"
        />
      </template>
    </MznDropdown>
  </div>
</template>
