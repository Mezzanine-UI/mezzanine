<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { CSSProperties } from 'vue';
import { modalClasses } from '@mezzanine-ui/core/modal';
import clsx from 'clsx';
import { useHasListener } from '../_internal/use-has-listener';
import MznTypography from '../typography/typography.vue';
import type { ModalBodyForVerificationProps } from './modal-body-for-verification.types';

/**
 * Modal 裡的驗證碼輸入區，一個字元一格。
 *
 * 輸入後自動跳到下一格，Backspace 會清掉目前這格或退回上一格，方向鍵可左右
 * 移動，貼上一整串驗證碼會自動填滿。全部填完時發出 `complete`。
 * 只有在有人監聽 `resend` 時才會顯示重新寄送的那一行。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznModalBodyForVerification } from '@mezzanine-ui/vue/modal';
 * <\/script>
 *
 * <template>
 *   <MznModalBodyForVerification
 *     :length="6"
 *     @complete="verify"
 *     @resend="resend"
 *   />
 * </template>
 * ```
 *
 * @see MznModal modalType="verification" 時的內容
 */
const props = withDefaults(defineProps<ModalBodyForVerificationProps>(), {
  autoFocus: true,
  disabled: false,
  error: false,
  length: 4,
  readOnly: false,
  resendPrompt: '收不到驗證碼？',
  resendText: '點此重新寄送',
  value: '',
});

const emit = defineEmits<{
  change: [value: string];
  complete: [value: string];
  resend: [];
}>();

const hasListener = useHasListener();

/**
 * Seeded from `value` once, exactly as React seeds its state: later changes to
 * the prop are not mirrored back into the boxes.
 */
const codes = ref<string[]>(
  props.value
    .split('')
    .slice(0, props.length)
    .concat(Array(props.length - props.value.length).fill('')),
);

const inputs = ref<(HTMLInputElement | null)[]>([]);

function setInput(index: number, element: unknown): void {
  inputs.value[index] = (element as HTMLInputElement | null) ?? null;
}

// Auto focus first input when mounted
onMounted(() => {
  if (props.autoFocus && !props.disabled && !props.readOnly) {
    inputs.value[0]?.focus();
  }
});

function handleChange(index: number, newValue: string): void {
  if (props.disabled || props.readOnly) return;

  // Only allow single digit/letter
  const sanitized = newValue.slice(-1);

  const newCodes = [...codes.value];

  newCodes[index] = sanitized;
  codes.value = newCodes;

  const fullValue = newCodes.join('');

  emit('change', fullValue);

  // Auto focus next input
  if (sanitized && index < props.length - 1) {
    inputs.value[index + 1]?.focus();
  }

  // Call onComplete when all filled
  if (fullValue.length === props.length) {
    emit('complete', fullValue);
  }
}

/**
 * React's controlled input rewrites the DOM value on every render; Vue only
 * patches when the bound value actually moved, so a keystroke the state
 * rejects would otherwise stay visible in the box.
 */
function handleInput(index: number, event: Event): void {
  const target = event.target as HTMLInputElement;

  handleChange(index, target.value);

  const next = codes.value[index] || '';

  if (target.value !== next) {
    target.value = next;
  }
}

function handleKeydown(index: number, event: KeyboardEvent): void {
  // Handle backspace
  if (event.key === 'Backspace') {
    if (props.disabled || props.readOnly) return;

    if (!codes.value[index] && index > 0) {
      // If current is empty, focus previous
      inputs.value[index - 1]?.focus();
    } else {
      // Clear current
      const newCodes = [...codes.value];

      newCodes[index] = '';
      codes.value = newCodes;
      emit('change', newCodes.join(''));
    }
  }
  // Handle arrow keys
  else if (event.key === 'ArrowLeft' && index > 0) {
    inputs.value[index - 1]?.focus();
  } else if (event.key === 'ArrowRight' && index < props.length - 1) {
    inputs.value[index + 1]?.focus();
  }
}

function handlePaste(event: ClipboardEvent): void {
  if (props.disabled || props.readOnly) return;

  event.preventDefault();

  const pastedData =
    event.clipboardData?.getData('text').slice(0, props.length) ?? '';
  const newCodes = pastedData
    .split('')
    .concat(Array(props.length - pastedData.length).fill(''));

  codes.value = newCodes;
  emit('change', pastedData);

  // Focus the next empty input or the last input
  const nextEmptyIndex = Math.min(pastedData.length, props.length - 1);

  inputs.value[nextEmptyIndex]?.focus();

  if (pastedData.length === props.length) {
    emit('complete', pastedData);
  }
}

const inputsClasses = computed((): string =>
  clsx(modalClasses.modalBodyVerificationInputs, {
    [modalClasses.modalBodyVerificationInputsExtended]: props.length > 4,
  }),
);

const inputClasses = computed((): string =>
  clsx(modalClasses.modalBodyVerificationInput, {
    [modalClasses.modalBodyVerificationInputError]: props.error,
  }),
);

const RESEND_LINK_STYLE: CSSProperties = {
  cursor: 'pointer',
  textDecoration: 'underline',
};

const hostClass = modalClasses.modalBodyVerification;
const resendClass = modalClasses.modalBodyVerificationResend;
const resendLinkClass = modalClasses.modalBodyVerificationResendLink;
</script>

<template>
  <div :class="hostClass">
    <div :class="inputsClasses">
      <input
        v-for="(_, index) in length"
        :key="index"
        :ref="(element) => setInput(index, element)"
        autocomplete="off"
        :class="inputClasses"
        :disabled="disabled"
        inputmode="numeric"
        :maxlength="1"
        :readonly="readOnly"
        type="text"
        :value="codes[index] || ''"
        @input="handleInput(index, $event)"
        @keydown="handleKeydown(index, $event)"
        @paste="handlePaste"
      />
    </div>
    <div v-if="hasListener('resend')" :class="resendClass">
      <MznTypography color="text-neutral" variant="caption">
        {{ resendPrompt }}
      </MznTypography>
      <MznTypography
        :class="resendLinkClass"
        color="text-neutral"
        component="span"
        :style="RESEND_LINK_STYLE"
        variant="caption"
        @click="emit('resend')"
      >
        {{ resendText }}
      </MznTypography>
    </div>
  </div>
</template>
