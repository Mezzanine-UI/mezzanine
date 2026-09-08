<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { cropperClasses as classes } from '@mezzanine-ui/core/cropper';
import clsx from 'clsx';
import MznModal from '../modal/modal.vue';
import MznCropperElement from './cropper-element.vue';
import type { CropArea } from './cropper.types';
import type { CropperModalProps } from './cropper-modal.types';

/**
 * 以對話框包裝的圖片裁切流程。
 *
 * 預設帶標題列與操作列，按下確認會把畫布、裁切區域與原圖交給 `onConfirm`，
 * 等它（可以是 Promise）完成之後才關閉；`onConfirm` 拋錯時對話框留在原地。
 * 裁切器本身的設定都放在 `cropperProps`，版面固定為 standard。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue';
 * import { cropToDataURL, MznCropperModal } from '@mezzanine-ui/vue/cropper';
 *
 * const open = ref(false);
 * <\/script>
 *
 * <template>
 *   <MznCropperModal
 *     :cropper-props="{ aspectRatio: 1, imageSrc: 'https://example.com/image.png' }"
 *     :open="open"
 *     @close="open = false"
 *   />
 * </template>
 * ```
 *
 * @see MznCropperElement 對話框內部的裁切畫布
 * @see MznCropperModal.open 命令式開啟的版本
 */
const props = withDefaults(defineProps<CropperModalProps>(), {
  actionsButtonLayout: undefined,
  annotation: undefined,
  auxiliaryContentButtonProps: undefined,
  auxiliaryContentButtonText: undefined,
  auxiliaryContentChecked: undefined,
  auxiliaryContentLabel: undefined,
  auxiliaryContentOnChange: undefined,
  auxiliaryContentOnClick: undefined,
  auxiliaryContentType: undefined,
  backdropClassName: undefined,
  cancelButtonProps: undefined,
  cancelText: '取消',
  confirmButtonProps: undefined,
  confirmText: '確認',
  container: undefined,
  cropperContentClassName: undefined,
  cropperProps: undefined,
  disableCloseOnBackdropClick: undefined,
  disableCloseOnEscapeKeyDown: undefined,
  disablePortal: undefined,
  fullScreen: undefined,
  loading: undefined,
  modalStatusType: undefined,
  onBackdropClick: undefined,
  onCancel: undefined,
  onClose: undefined,
  onConfirm: undefined,
  open: false,
  passwordButtonProps: undefined,
  passwordButtonText: undefined,
  passwordChecked: undefined,
  passwordCheckedLabel: undefined,
  passwordCheckedOnChange: undefined,
  passwordOnClick: undefined,
  showDismissButton: undefined,
  showModalFooter: true,
  showModalHeader: true,
  showStatusTypeIcon: undefined,
  size: 'wide',
  statusTypeIconLayout: undefined,
  supportingText: undefined,
  supportingTextAlign: undefined,
  title: '圖片裁切',
  titleAlign: undefined,
});

const currentCropArea = shallowRef<CropArea | null>(
  props.cropperProps?.initialCropArea ?? null,
);
const cropperElementRef = shallowRef<{
  canvas: HTMLCanvasElement | null;
} | null>(null);

const setCropperElement = (element: unknown): void => {
  cropperElementRef.value =
    (element as { canvas: HTMLCanvasElement | null } | null) ?? null;
};

function handleCropChange(area: CropArea): void {
  currentCropArea.value = area;
  props.cropperProps?.onCropChange?.(area);
}

function handleCancel(): void {
  props.onCancel?.();
  props.onClose?.();
}

async function handleConfirm(): Promise<void> {
  try {
    await props.onConfirm?.({
      canvas: cropperElementRef.value?.canvas ?? null,
      cropArea: currentCropArea.value,
      imageSrc: props.cropperProps?.imageSrc,
    });

    props.onClose?.();
  } catch (error) {
    console.error('CropperModal onConfirm failed:', error);
  }
}

/**
 * React hands the footer and header groups over as whole objects, so the text
 * props simply are not passed when the section is hidden.
 */
const modalFooterProps = computed(() =>
  props.showModalFooter
    ? {
        cancelText: props.cancelText,
        confirmText: props.confirmText,
        showModalFooter: true as const,
      }
    : { showModalFooter: false as const },
);

const modalHeaderProps = computed(() =>
  props.showModalHeader
    ? { showModalHeader: true as const, title: props.title }
    : { showModalHeader: false as const },
);

/** Everything CropperModal passes straight through to the modal. */
const restModalProps = computed(() => ({
  actionsButtonLayout: props.actionsButtonLayout,
  annotation: props.annotation,
  auxiliaryContentButtonProps: props.auxiliaryContentButtonProps,
  auxiliaryContentButtonText: props.auxiliaryContentButtonText,
  auxiliaryContentChecked: props.auxiliaryContentChecked,
  auxiliaryContentLabel: props.auxiliaryContentLabel,
  auxiliaryContentOnChange: props.auxiliaryContentOnChange,
  auxiliaryContentOnClick: props.auxiliaryContentOnClick,
  auxiliaryContentType: props.auxiliaryContentType,
  backdropClassName: props.backdropClassName,
  cancelButtonProps: props.cancelButtonProps,
  confirmButtonProps: props.confirmButtonProps,
  container: props.container,
  disableCloseOnBackdropClick: props.disableCloseOnBackdropClick,
  disableCloseOnEscapeKeyDown: props.disableCloseOnEscapeKeyDown,
  disablePortal: props.disablePortal,
  fullScreen: props.fullScreen,
  loading: props.loading,
  modalStatusType: props.modalStatusType,
  passwordButtonProps: props.passwordButtonProps,
  passwordButtonText: props.passwordButtonText,
  passwordChecked: props.passwordChecked,
  passwordCheckedLabel: props.passwordCheckedLabel,
  passwordCheckedOnChange: props.passwordCheckedOnChange,
  passwordOnClick: props.passwordOnClick,
  showDismissButton: props.showDismissButton,
  showStatusTypeIcon: props.showStatusTypeIcon,
  statusTypeIconLayout: props.statusTypeIconLayout,
  supportingText: props.supportingText,
  supportingTextAlign: props.supportingTextAlign,
  titleAlign: props.titleAlign,
}));

const contentClasses = computed((): string =>
  clsx(classes.content, props.cropperContentClassName),
);
</script>

<template>
  <MznModal
    modal-type="standard"
    :open="open"
    :size="size"
    v-bind="{ ...restModalProps, ...modalHeaderProps, ...modalFooterProps }"
    @backdrop-click="onBackdropClick?.($event)"
    @cancel="handleCancel"
    @close="onClose?.()"
    @confirm="handleConfirm"
  >
    <MznCropperElement
      :ref="setCropperElement"
      :aspect-ratio="cropperProps?.aspectRatio"
      :class="contentClasses"
      :image-src="cropperProps?.imageSrc"
      :initial-crop-area="cropperProps?.initialCropArea"
      :min-height="cropperProps?.minHeight"
      :min-width="cropperProps?.minWidth"
      :on-crop-change="handleCropChange"
      :on-crop-drag-end="cropperProps?.onCropDragEnd"
      :on-image-drag-end="cropperProps?.onImageDragEnd"
      :on-image-error="cropperProps?.onImageError"
      :on-image-load="cropperProps?.onImageLoad"
      :on-scale-change="cropperProps?.onScaleChange"
      :size="cropperProps?.size ?? 'main'"
    />
  </MznModal>
</template>
