<script setup lang="ts">
import { computed, ref } from 'vue';
import { paginationJumperClasses as classes } from '@mezzanine-ui/core/pagination';
import { isImeComposing } from '@mezzanine-ui/core/utils';
import MznButton from '../button/button.vue';
import MznInput from '../input/input.vue';
import type { InputProps } from '../input/input.types';
import MznTypography from '../typography/typography.vue';
import type { PaginationJumperProps } from './pagination-jumper.types';

/**
 * 分頁列右側的跳頁欄：一段提示文字、一個數字輸入框與一顆確認按鈕。
 *
 * 輸入超出總頁數或不是數字時，輸入框會轉成錯誤狀態並清空；按 Enter 與按下按鈕
 * 等價（輸入法組字中不會誤觸）。
 *
 * @example
 * ```vue
 * <MznPaginationJumper
 *   button-text="確認"
 *   hint-text="前往"
 *   :total="100"
 *   @change="go"
 * />
 * ```
 *
 * @see MznPagination showJumper 時渲染這一段
 */
const props = withDefaults(defineProps<PaginationJumperProps>(), {
  buttonText: undefined,
  disabled: undefined,
  hintText: undefined,
  inputPlaceholder: undefined,
  pageSize: 5,
  total: 0,
});

const emit = defineEmits<{
  change: [page: number];
}>();

const value = ref('');
const error = ref(false);

const totalPages = computed((): number =>
  props.total ? Math.ceil(props.total / props.pageSize) : 1,
);

function valueValidator(): boolean {
  const stringToNumber = +value.value;
  const validNumber = !!stringToNumber;

  if (validNumber) {
    return !(stringToNumber > totalPages.value || stringToNumber < 1);
  }

  return false;
}

function handleClick(): void {
  const valid = valueValidator();

  if (valid) {
    error.value = false;
    emit('change', +value.value);
    value.value = '';
  } else {
    error.value = true;
    value.value = '';
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' && !isImeComposing(event)) {
    handleClick();
  }
}

function onInputChange(event: Event): void {
  value.value = (event.target as HTMLInputElement).value;
}

const inputProps = computed((): InputProps['inputProps'] => ({
  onKeydown: handleKeydown,
}));

const hostClass = classes.host;
const inputClass = classes.input;
</script>

<template>
  <div :class="hostClass">
    <MznTypography component="div" ellipsis variant="label-primary">
      {{ hintText }}
    </MznTypography>
    <MznInput
      :class="inputClass"
      :disabled="disabled"
      :error="error"
      :input-props="inputProps"
      :placeholder="inputPlaceholder"
      size="sub"
      :value="value"
      variant="number"
      @change="onInputChange"
    />
    <MznButton :disabled="disabled" size="sub" @click="handleClick">
      {{ buttonText }}
    </MznButton>
  </div>
</template>
