<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import type { FunctionalComponent } from 'vue';
import { uploaderClasses as classes } from '@mezzanine-ui/core/upload';
import {
  DangerousFilledIcon,
  InfoFilledIcon,
  UploadIcon,
} from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznButton from '../button/button.vue';
import MznIcon from '../icon/icon.vue';
import MznTypography from '../typography/typography.vue';
import type { UploaderProps } from './uploader.types';

/**
 * 上傳觸發區：一個包住 file input 的 label。
 *
 * `type="base"` 是可拖放的區塊，`type="button"` 是一顆按鈕；`mode="dropzone"`
 * 時區塊會填滿寬度並顯示提示文字。拖曳進來的檔案透過 `upload` 送出。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznUploader } from '@mezzanine-ui/vue/upload';
 * <\/script>
 *
 * <template>
 *   <MznUploader mode="dropzone" type="base" @upload="onUpload" />
 * </template>
 * ```
 *
 * @see MznUpload 把觸發區與清單組合起來的元件
 */
const props = withDefaults(defineProps<UploaderProps>(), {
  accept: undefined,
  disabled: false,
  externalHints: undefined,
  hints: undefined,
  icon: undefined,
  id: undefined,
  inputProps: undefined,
  label: undefined,
  mode: 'basic',
  multiple: false,
  name: undefined,
  type: undefined,
});

const emit = defineEmits<{
  /** Fired by the input's own change event. */
  change: [event: Event];
  /** Fired after the user selected files. */
  upload: [files: File[]];
}>();

/** React spreads the rest onto the label, and the hints are a second root. */
defineOptions({ inheritAttrs: false });

/** The input element, exposed so a consumer can drive the file dialog. */
const input = ref<HTMLInputElement | null>(null);

defineExpose({ input });

const generatedId = useId();

const restInputProps = computed(() => {
  const { id: _id, name: _name, ...rest } = props.inputProps ?? {};

  return rest;
});

const inputId = computed(
  (): string =>
    props.id ?? (props.inputProps?.id as string | undefined) ?? generatedId,
);

const resolvedName = computed(
  (): string =>
    props.name ??
    (props.inputProps?.name as string | undefined) ??
    inputId.value,
);

const isDropzone = computed((): boolean => props.mode === 'dropzone');
const isDragging = ref(false);

function handleChange(event: Event): void {
  emit('change', event);

  const target = event.target as HTMLInputElement;
  const { files: fileList } = target;

  if (fileList) {
    const files: File[] = [];

    for (let i = 0; i < fileList.length; i += 1) {
      files.push(fileList[i]);
    }

    emit('upload', files);
  }

  // Reset input value to allow selecting the same file again
  (event.currentTarget as HTMLInputElement).value = '';
}

const dragDisabled = computed(
  (): boolean => props.disabled || props.type === 'button',
);

function handleDragOver(event: DragEvent): void {
  if (dragDisabled.value) return;

  event.preventDefault();
  event.stopPropagation();
}

function handleDragEnter(event: DragEvent): void {
  if (dragDisabled.value) return;

  event.preventDefault();
  event.stopPropagation();
  isDragging.value = true;
}

function handleDragLeave(event: DragEvent): void {
  if (dragDisabled.value) return;

  // Only clear dragging state if leaving the label itself (not a child)
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const { clientX: x, clientY: y } = event;

  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    isDragging.value = false;
  }
}

function handleDrop(event: DragEvent): void {
  if (dragDisabled.value) return;

  event.preventDefault();
  event.stopPropagation();
  isDragging.value = false;

  const { dataTransfer } = event;

  if (dataTransfer?.files && dataTransfer.files.length > 0) {
    const files: File[] = [];

    for (let i = 0; i < dataTransfer.files.length; i += 1) {
      files.push(dataTransfer.files[i]);
    }

    emit('upload', files);
  }

  // The input's files cannot be set from a drop, so no change event follows;
  // a consumer that needs it has to listen for `upload`.
}

function handleClickToUpload(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();

  if (!props.disabled && input.value) input.value.click();
}

const uploadIcon = computed(() => props.icon?.upload ?? UploadIcon);

const uploadLabel = computed((): string => {
  if (props.label?.uploadLabel) return props.label.uploadLabel;

  return isDropzone.value ? 'Drag the file here or' : 'Upload';
});

const clickToUploadLabel = computed(
  (): string => props.label?.clickToUpload ?? 'Click to upload',
);

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    props.type && classes.type(props.type),
    props.type !== 'button' && isDropzone.value && classes.fillWidth,
    isDragging.value && classes.dragging,
    props.type !== 'button' && props.disabled && classes.disabled,
  ),
);

/**
 * React writes `{uploadLabel}{' '}` — two text nodes — before the highlighted
 * part, so the label is handed over as its parts.
 */
const LabelParts: FunctionalComponent<{ parts: string[] }> = (partProps) =>
  partProps.parts;
</script>

<template>
  <label
    v-bind="$attrs"
    :class="hostClasses"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <div v-if="type === 'base' && isDropzone" :class="classes.uploadContent">
      <MznIcon :class="classes.uploadIcon" :icon="uploadIcon" />
      <MznTypography :class="classes.uploadLabel">
        <LabelParts v-if="uploadLabel" :parts="[uploadLabel, ' ']" />
        <span :class="classes.clickToUpload">{{ clickToUploadLabel }}</span>
      </MznTypography>
      <MznTypography
        v-for="(hint, index) in hints"
        :key="index"
        :class="classes.fillWidthHints"
      >
        {{ hint.label }}
      </MznTypography>
    </div>
    <div v-if="type === 'base' && !isDropzone" :class="classes.uploadContent">
      <MznIcon :class="classes.uploadIcon" :icon="uploadIcon" />
      <MznTypography :class="classes.uploadLabel">
        {{ uploadLabel }}
      </MznTypography>
    </div>
    <MznButton
      v-if="type === 'button'"
      :disabled="disabled"
      :icon="UploadIcon"
      icon-type="leading"
      @click="handleClickToUpload"
    >
      <MznTypography
        align="center"
        :class="classes.uploadButtonText"
        color="text-fixed-light"
        variant="button-highlight"
      >
        {{ uploadLabel }}
      </MznTypography>
    </MznButton>
    <input
      ref="input"
      v-bind="restInputProps"
      :accept="accept"
      :aria-disabled="disabled"
      :class="classes.input"
      :disabled="disabled"
      :id="inputId"
      :multiple="multiple"
      :name="resolvedName"
      type="file"
      @change="handleChange"
    />
  </label>
  <ul
    v-if="externalHints && externalHints.length > 0"
    :class="classes.externalHints"
  >
    <li
      v-for="hint in externalHints"
      :key="hint.label"
      :class="classes.externalHint(hint.type || 'info')"
    >
      <MznIcon
        :color="hint.type === 'info' ? 'info' : 'error'"
        :icon="hint.type === 'info' ? InfoFilledIcon : DangerousFilledIcon"
        :size="14"
      />
      {{ hint.label }}
    </li>
  </ul>
</template>
