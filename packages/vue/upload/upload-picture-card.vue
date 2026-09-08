<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import type { CSSProperties } from 'vue';
import { uploadPictureCardClasses as classes } from '@mezzanine-ui/core/upload';
import {
  DownloadIcon,
  FileIcon,
  ImageIcon,
  ResetIcon,
  TrashIcon,
  ZoomInIcon,
} from '@mezzanine-ui/icons';
import type { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { useHasListener } from '../_internal/use-has-listener';
import MznButton from '../button/button.vue';
import MznClearActions from '../clear-actions/clear-actions.vue';
import MznIcon from '../icon/icon.vue';
import MznSpin from '../spin/spin.vue';
import MznTypography from '../typography/typography.vue';
import { isImageFile } from './upload-utils';
import type {
  UploadPictureCardAriaLabels,
  UploadPictureCardProps,
} from './upload-picture-card.types';

/**
 * 圖片上傳的卡片式預覽。
 *
 * 圖片以 blob 或網址顯示，非圖片顯示檔名。`status` 決定右上角的操作：上傳中是
 * 取消加轉圈、完成是放大／下載／刪除、錯誤是重試加刪除。`readable` 讓卡片變成
 * 純展示；有人監聽 `replace` 且已完成時，整張卡片變成重新選檔的觸發區。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznUploadPictureCard } from '@mezzanine-ui/vue/upload';
 * <\/script>
 *
 * <template>
 *   <MznUploadPictureCard :file="file" status="done" @delete="onDelete" />
 * </template>
 * ```
 *
 * @see MznUpload 管理整組卡片的元件
 */
const props = withDefaults(defineProps<UploadPictureCardProps>(), {
  ariaLabels: undefined,
  disabled: false,
  errorIcon: undefined,
  errorMessage: undefined,
  file: undefined,
  id: undefined,
  imageFit: 'cover',
  readable: false,
  size: 'main',
  status: 'loading',
  url: undefined,
});

const emit = defineEmits<{
  /** Fired when the delete action is used. */
  delete: [event: MouseEvent];
  /** Fired when the download action is used. */
  download: [event: MouseEvent];
  /** Fired when the reload action is used. */
  reload: [event: MouseEvent];
  /** Fired when the card is clicked while it stands for a replacement. */
  replace: [event: MouseEvent];
  /** Fired when the zoom-in action is used. */
  zoomIn: [event: MouseEvent];
}>();

const hasListener = useHasListener();

const DEFAULT_ARIA_LABELS: Required<UploadPictureCardAriaLabels> = {
  cancelUpload: 'Cancel upload',
  clickToReplace: 'Click to Replace',
  delete: 'Delete file',
  download: 'Download file',
  reload: 'Retry upload',
  uploading: 'Uploading',
  zoomIn: 'Zoom in image',
};

const labels = computed(
  (): Required<UploadPictureCardAriaLabels> => ({
    ...DEFAULT_ARIA_LABELS,
    ...props.ariaLabels,
  }),
);

const isImage = computed((): boolean => isImageFile(props.file, props.url));

const fileName = computed((): string => {
  if (props.file?.name && !props.url) return props.file.name;

  if (props.url) {
    try {
      const url = new URL(props.url);

      return url.pathname.split('/').pop() || '';
    } catch {
      const urlWithoutQuery = props.url.split('?')[0].split('#')[0];

      return urlWithoutQuery.split('/').pop() || '';
    }
  }

  return '';
});

const imageUrl = ref('');

let objectUrl: string | null = null;

function revokeObjectUrl(): void {
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
    objectUrl = null;
  }
}

watch(
  [
    (): File | undefined => props.file,
    (): string | undefined => props.url,
    isImage,
  ],
  ([file, url, image]) => {
    revokeObjectUrl();

    if (url && image) {
      imageUrl.value = url;

      return;
    }

    if (file && image) {
      try {
        objectUrl = URL.createObjectURL(file);
        imageUrl.value = objectUrl;
      } catch (error) {
        console.error('Failed to create object URL for image:', error);
        imageUrl.value = '';
      }

      return;
    }

    imageUrl.value = '';
  },
  { immediate: true },
);

onBeforeUnmount(revokeObjectUrl);

watch(
  [(): File | undefined => props.file, (): string | undefined => props.url],
  ([file, url]) => {
    if (!file && !url) {
      console.warn(
        'UploadPictureCard: Both `file` and `url` props are missing. At least one should be provided to display the upload picture card.',
      );
    }
  },
  { immediate: true },
);

const errorIconContent = computed((): IconDefinition => {
  if (props.errorIcon) return props.errorIcon;

  return isImage.value ? ImageIcon : FileIcon;
});

const errorMessageContent = computed((): string => {
  if (props.errorMessage) return props.errorMessage;

  return fileName.value ? fileName.value : 'Upload error';
});

const unsupported = computed(
  (): boolean => !isImage.value && props.size === 'minor',
);

watch(
  unsupported,
  (value) => {
    if (value) {
      console.warn(
        'UploadPictureCard: minor size is not supported for non-image files',
      );
    }
  },
  { immediate: true },
);

const canZoomIn = computed((): boolean => hasListener('zoomIn'));
const canDownload = computed((): boolean => hasListener('download'));
const canReplace = computed((): boolean => hasListener('replace'));

const isReplaceTrigger = computed(
  (): boolean => !props.readable && canReplace.value && props.status === 'done',
);

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    classes.size(props.size),
    props.disabled && classes.disabled,
    props.readable && classes.readable,
    isReplaceTrigger.value && classes.replaceMode,
  ),
);

const imageStyle = computed(
  (): CSSProperties => ({
    objectFit: props.imageFit,
    objectPosition: 'center',
  }),
);

function onHostClick(event: MouseEvent): void {
  if (isReplaceTrigger.value) emit('replace', event);
}

function onHostKeydown(event: KeyboardEvent): void {
  if (!isReplaceTrigger.value) return;

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    (event.currentTarget as HTMLElement).click();
  }
}

function onDelete(event: MouseEvent): void {
  event.stopPropagation();
  emit('delete', event);
}

function onDownload(event: MouseEvent): void {
  event.stopPropagation();
  emit('download', event);
}

function onZoomIn(event: MouseEvent): void {
  event.stopPropagation();
  emit('zoomIn', event);
}
</script>

<template>
  <div
    v-if="!unsupported"
    :aria-disabled="disabled"
    :class="hostClasses"
    role="group"
    :tabindex="disabled || readable ? -1 : 0"
    @click="onHostClick"
    @keydown="onHostKeydown"
  >
    <div :class="classes.container">
      <img
        v-if="isImage && imageUrl && status !== 'error'"
        :alt="fileName"
        :src="imageUrl"
        :style="imageStyle"
      />
      <div
        v-if="status === 'done' && size !== 'minor' && !isImage"
        :class="classes.content"
      >
        <MznIcon color="brand" :icon="FileIcon" :size="16" />
        <MznTypography :class="classes.name" ellipsis>
          {{ fileName }}
        </MznTypography>
      </div>
      <div
        v-if="status === 'error' && size !== 'minor'"
        aria-live="polite"
        :class="classes.errorMessage"
        role="alert"
      >
        <MznIcon color="error" :icon="errorIconContent" :size="16" />
        <MznTypography :class="classes.errorMessageText">
          {{ errorMessageContent }}
        </MznTypography>
      </div>
      <div :class="[classes.actions, classes.actionsStatus(status)]">
        <template v-if="status === 'loading' && size !== 'minor' && !readable">
          <MznClearActions
            :aria-label="labels.cancelUpload"
            :class="classes.clearActionsIcon"
            type="embedded"
            variant="contrast"
            @click="emit('delete', $event)"
          />
          <div :aria-label="labels.uploading" :class="classes.loadingIcon">
            <MznSpin loading size="sub" />
          </div>
        </template>
        <template v-if="status === 'done' && size !== 'minor' && !readable">
          <div :class="classes.tools">
            <div :class="classes.toolsContent">
              <MznButton
                v-if="canZoomIn"
                :aria-label="labels.zoomIn"
                :icon="ZoomInIcon"
                icon-type="icon-only"
                size="minor"
                variant="base-secondary"
                @click="onZoomIn"
              />
              <MznButton
                v-if="canDownload"
                :aria-label="labels.download"
                :icon="DownloadIcon"
                icon-type="icon-only"
                size="minor"
                variant="base-secondary"
                @click="onDownload"
              />
              <MznButton
                :aria-label="labels.delete"
                :icon="TrashIcon"
                icon-type="icon-only"
                size="minor"
                variant="base-secondary"
                @click="onDelete"
              />
            </div>
          </div>
          <span v-if="canReplace" :class="classes.replaceLabel">
            {{ labels.clickToReplace }}
          </span>
        </template>
        <template v-if="status === 'error' && size !== 'minor' && !readable">
          <div :class="classes.tools">
            <div :class="classes.toolsContent">
              <MznButton
                :aria-label="labels.reload"
                :icon="ResetIcon"
                icon-type="icon-only"
                size="minor"
                variant="base-secondary"
                @click="emit('reload', $event)"
              />
              <MznButton
                :aria-label="labels.delete"
                :icon="TrashIcon"
                icon-type="icon-only"
                size="minor"
                variant="base-secondary"
                @click="emit('delete', $event)"
              />
            </div>
          </div>
        </template>
        <MznIcon
          v-if="size === 'minor' && !readable"
          color="fixed-light"
          :icon="ZoomInIcon"
          :size="24"
        />
      </div>
    </div>
  </div>
</template>
