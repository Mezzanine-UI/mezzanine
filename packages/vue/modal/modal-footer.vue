<script setup lang="ts">
import { computed } from 'vue';
import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import clsx from 'clsx';
import MznButton from '../button/button.vue';
import MznButtonGroup from '../button/button-group.vue';
import type { ButtonProps } from '../button/button.types';
import MznCheckbox from '../checkbox/checkbox.vue';
import MznToggle from '../toggle/toggle.vue';
import MznTypography from '../typography/typography.vue';
import type { ModalFooterProps } from './modal-footer.types';

/**
 * Modal 的操作列：右側是取消與確認按鈕，左側可放一份輔助內容。
 *
 * `auxiliaryContentType` 決定左側放什麼 —— 註記文字、文字按鈕、核取方塊、
 * 切換開關，或密碼情境（記住我＋忘記密碼）。`loading` 會讓確認鈕轉圈、
 * 取消鈕停用。沒有輔助內容時，`actionsButtonLayout="fill"` 可讓兩顆按鈕等分寬度。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznModalFooter } from '@mezzanine-ui/vue/modal';
 * <\/script>
 *
 * <template>
 *   <MznModalFooter
 *     cancel-text="取消"
 *     confirm-text="確認"
 *     @cancel="close"
 *     @confirm="submit"
 *   />
 *
 *   <MznModalFooter
 *     annotation="這個動作無法復原"
 *     auxiliary-content-type="annotation"
 *     confirm-text="刪除"
 *     :show-cancel-button="false"
 *     @confirm="remove"
 *   />
 * </template>
 * ```
 *
 * @see MznModal 以 showModalFooter 渲染這個操作列
 */
const props = withDefaults(defineProps<ModalFooterProps>(), {
  actionsButtonLayout: 'fixed',
  annotation: undefined,
  auxiliaryContentButtonProps: undefined,
  auxiliaryContentButtonText: undefined,
  auxiliaryContentChecked: undefined,
  auxiliaryContentLabel: undefined,
  auxiliaryContentOnChange: undefined,
  auxiliaryContentOnClick: undefined,
  auxiliaryContentType: undefined,
  cancelButtonProps: undefined,
  cancelText: undefined,
  confirmButtonProps: undefined,
  confirmText: undefined,
  loading: undefined,
  passwordButtonProps: undefined,
  passwordButtonText: undefined,
  passwordChecked: undefined,
  passwordCheckedLabel: undefined,
  passwordCheckedOnChange: undefined,
  passwordOnClick: undefined,
  showCancelButton: true,
});

const emit = defineEmits<{
  cancel: [event: MouseEvent];
  confirm: [event: MouseEvent];
}>();

defineSlots<{
  /** Extra content, rendered after the action buttons. */
  default?: () => unknown;
}>();

/**
 * React spreads the button props and then writes `onClick` after them, so the
 * later one wins. A `v-bind` object does the same; two separate bindings would
 * instead *chain* the handlers, running both.
 */
type ButtonBindings = ButtonProps & {
  class?: string;
  onClick?: (event: MouseEvent) => void;
};

const cancelButtonDisabled = computed(
  (): boolean | undefined => props.cancelButtonProps?.disabled ?? props.loading,
);

const isActionsButtonFillLayout = computed(
  (): boolean =>
    props.actionsButtonLayout === 'fill' && !props.auxiliaryContentType,
);

const hostClasses = computed((): string =>
  clsx(classes.modalFooter, {
    [`${classes.modalFooter}--password-mode`]:
      props.auxiliaryContentType === 'password',
    [`${classes.modalFooter}--with-auxiliary-content`]:
      !!props.auxiliaryContentType && props.auxiliaryContentType !== 'password',
  }),
);

const actionsButtonContainerClasses = computed((): string =>
  clsx(classes.modalFooterActionsButtonContainer, {
    [`${classes.modalFooterActionsButtonContainer}--fill-layout`]:
      isActionsButtonFillLayout.value,
  }),
);

const passwordButtonBindings = computed(
  (): ButtonBindings => ({
    variant: 'base-text-link',
    ...props.passwordButtonProps,
    onClick: props.passwordOnClick,
  }),
);

const auxiliaryContentButtonBindings = computed(
  (): ButtonBindings => ({
    variant: 'base-text-link',
    ...props.auxiliaryContentButtonProps,
    onClick: props.auxiliaryContentOnClick,
  }),
);

const cancelButtonBindings = computed(
  (): ButtonBindings => ({
    variant: 'base-secondary',
    ...props.cancelButtonProps,
    class: classes.modalFooterActionsButton,
    disabled: cancelButtonDisabled.value,
    onClick: (event: MouseEvent) => emit('cancel', event),
  }),
);

const confirmButtonBindings = computed(
  (): ButtonBindings => ({
    variant: 'base-primary',
    ...props.confirmButtonProps,
    class: classes.modalFooterActionsButton,
    loading: props.loading,
    onClick: (event: MouseEvent) => emit('confirm', event),
  }),
);

function onPasswordCheckedChange(event: Event): void {
  props.passwordCheckedOnChange?.((event.target as HTMLInputElement).checked);
}

function onAuxiliaryContentChange(event: Event): void {
  props.auxiliaryContentOnChange?.((event.target as HTMLInputElement).checked);
}

const passwordContainerClass = classes.modalFooterPasswordContainer;
const auxiliaryContentContainerClass =
  classes.modalFooterAuxiliaryContentContainer;
</script>

<template>
  <div :class="hostClasses">
    <div
      v-if="auxiliaryContentType === 'password'"
      :class="passwordContainerClass"
    >
      <MznCheckbox
        :checked="passwordChecked"
        :label="passwordCheckedLabel"
        @change="onPasswordCheckedChange"
      />
      <MznButton v-bind="passwordButtonBindings">
        <component :is="() => passwordButtonText" />
      </MznButton>
    </div>
    <div
      v-if="auxiliaryContentType && auxiliaryContentType !== 'password'"
      :class="auxiliaryContentContainerClass"
    >
      <MznTypography
        v-if="auxiliaryContentType === 'annotation'"
        color="text-neutral"
        variant="caption"
      >
        <component :is="() => annotation" />
      </MznTypography>
      <MznButton
        v-if="auxiliaryContentType === 'button'"
        v-bind="auxiliaryContentButtonBindings"
      >
        <component :is="() => auxiliaryContentButtonText" />
      </MznButton>
      <MznCheckbox
        v-if="auxiliaryContentType === 'checkbox'"
        :checked="auxiliaryContentChecked"
        :label="auxiliaryContentLabel"
        @change="onAuxiliaryContentChange"
      />
      <MznToggle
        v-if="auxiliaryContentType === 'toggle'"
        :checked="auxiliaryContentChecked"
        :label="auxiliaryContentLabel"
        @change="onAuxiliaryContentChange"
      />
    </div>
    <MznButtonGroup :class="actionsButtonContainerClasses">
      <MznButton v-if="showCancelButton" v-bind="cancelButtonBindings">
        <component :is="() => cancelText" />
      </MznButton>
      <MznButton v-bind="confirmButtonBindings">
        <component :is="() => confirmText" />
      </MznButton>
    </MznButtonGroup>
    <slot />
  </div>
</template>
