<script setup lang="ts">
import { computed, h, ref } from 'vue';
import type { VNodeChild } from 'vue';
import {
  defaultUploadPictureCardErrorMessage,
  uploadClasses as classes,
} from '@mezzanine-ui/core/upload';
import type {
  UploadItemStatus,
  UploadItemType,
} from '@mezzanine-ui/core/upload';
import { DangerousFilledIcon, InfoFilledIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import MznMediaPreviewModal from '../modal/media-preview-modal.vue';
import MznUploadItem from './upload-item.vue';
import MznUploadPictureCard from './upload-picture-card.vue';
import MznUploader from './uploader.vue';
import { isImageFile } from './upload-utils';
import type { UploaderProps } from './uploader.types';
import type { UploadFile, UploadProps } from './upload.types';

/**
 * 檔案上傳：一個觸發區加上一份檔案清單。
 *
 * `mode` 決定版面：`list` / `basic-list` / `button-list` 用清單呈現，`cards` /
 * `card-wall` 用圖片卡片。檔案狀態完全受控 —— 拿 `files` 進來、用 `change` 出去。
 * `onUpload` 的回傳值會被讀取，後端給的 id 與狀態會寫回清單。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznUpload } from '@mezzanine-ui/vue/upload';
 * <\/script>
 *
 * <template>
 *   <MznUpload :files="files" multiple @change="files = $event" />
 * </template>
 * ```
 *
 * @see MznUploader 只要觸發區時用這個
 */
const props = withDefaults(defineProps<UploadProps>(), {
  accept: undefined,
  ariaLabels: undefined,
  disabled: false,
  dropzoneHints: undefined,
  errorIcon: undefined,
  errorMessage: undefined,
  files: () => [],
  hints: undefined,
  id: undefined,
  inputProps: undefined,
  maxFiles: undefined,
  mode: 'list',
  multiple: false,
  name: undefined,
  onUpload: undefined,
  showFileSize: true,
  size: 'main',
  uploaderIcon: undefined,
  uploaderLabel: undefined,
});

const emit = defineEmits<{
  /** Fired when the file list changes. */
  change: [files: UploadFile[]];
  /** Fired when a file is deleted. */
  delete: [fileId: string, file: File];
  /** Fired when a file is downloaded (done state). */
  download: [fileId: string, file: File];
  /** Fired when the maximum number of files is exceeded. */
  maxFilesExceeded: [
    maxFiles: number,
    selectedCount: number,
    currentCount: number,
  ];
  /** Fired when a file upload is retried (error state). */
  reload: [fileId: string, file: File];
  /** Fired when zoom in is clicked on a picture card (done state). */
  zoomIn: [fileId: string, file: File];
}>();

/**
 * The list as the async upload flow last left it. React keeps the same thing in
 * a ref so that a handler resolving later works from the current list rather
 * than the one it closed over.
 */
let latestFiles: UploadFile[] = props.files;

const files = computed((): UploadFile[] => {
  latestFiles = props.files;

  return props.files;
});

const replaceFileId = ref<string | null>(null);
const replaceInput = ref<HTMLInputElement | null>(null);

const previewFile = ref<UploadFile | null>(null);
const isPreviewOpen = ref(false);
const previewObjectUrl = ref<string | null>(null);

const defaultErrorIconElement = computed(
  (): VNodeChild =>
    props.errorIcon ??
    h(MznIcon, { color: 'error', icon: DangerousFilledIcon, size: 24 }),
);

const isMaxFilesReached = computed((): boolean => {
  if (props.maxFiles === undefined) return false;

  return files.value.length >= props.maxFiles;
});

const effectiveDisabled = computed(
  (): boolean => props.disabled || isMaxFilesReached.value,
);

const findFileById = (fileId: string): UploadFile | undefined =>
  latestFiles.find((file) => file.id === fileId);

function emitChange(nextFiles: UploadFile[]): void {
  latestFiles = nextFiles;
  emit('change', nextFiles);
}

async function handleUpload(selectedFiles: File[]): Promise<void> {
  if (!selectedFiles.length) return;

  // A replacement drops the file it stands in for before anything else.
  if (replaceFileId.value !== null) {
    const fileIdToReplace = replaceFileId.value;

    replaceFileId.value = null;
    latestFiles = latestFiles.filter((file) => file.id !== fileIdToReplace);
  }

  let accepted = selectedFiles;

  if (props.maxFiles !== undefined) {
    const currentCount = latestFiles.length;
    const selectedCount = accepted.length;

    if (currentCount + selectedCount > props.maxFiles) {
      const allowedCount = Math.max(0, props.maxFiles - currentCount);

      if (allowedCount <= 0) {
        emit('maxFilesExceeded', props.maxFiles, selectedCount, currentCount);

        return;
      }

      accepted = accepted.slice(0, allowedCount);
      emit('maxFilesExceeded', props.maxFiles, selectedCount, currentCount);
    }
  }

  // A batch timestamp plus the index is unique within this batch, which is all
  // the id has to be until the backend hands back the real one.
  const batchId = Date.now();
  const tempFiles: UploadFile[] = accepted.map((file, index) => ({
    file,
    id: `temp-${batchId}-${index}`,
    progress: 0,
    status: 'loading' as UploadItemStatus,
  }));

  emitChange([...latestFiles, ...tempFiles]);

  if (!props.onUpload) {
    emitChange(
      latestFiles.map((file) =>
        tempFiles.some((temp) => temp.id === file.id)
          ? { ...file, progress: 100, status: 'done' as UploadItemStatus }
          : file,
      ),
    );

    return;
  }

  const tempIdToIndex = new Map<string, number>();

  tempFiles.forEach((tempFile, index) => {
    tempIdToIndex.set(tempFile.id, index);
  });

  const setProgress = (fileIndex: number, progress: number): void => {
    const targetFile = tempFiles[fileIndex];

    if (!targetFile) return;

    emitChange(
      latestFiles.map((file) =>
        file.id === targetFile.id ? { ...file, progress } : file,
      ),
    );
  };

  try {
    const result = await Promise.resolve(props.onUpload(accepted, setProgress));

    if (Array.isArray(result) && result.length > 0) {
      const [firstItem] = result;
      const isFullUploadFile = 'file' in firstItem && 'status' in firstItem;

      if (isFullUploadFile) {
        const backendFiles = result as UploadFile[];

        emitChange(
          latestFiles.map((file) => {
            const tempIndex = tempIdToIndex.get(file.id);

            if (tempIndex === undefined || tempIndex >= backendFiles.length) {
              return file;
            }

            const backendFile = backendFiles[tempIndex];

            if (backendFile.status === 'error') {
              return {
                ...backendFile,
                errorIcon:
                  backendFile.errorIcon ?? defaultErrorIconElement.value,
                errorMessage:
                  backendFile.errorMessage ??
                  props.errorMessage ??
                  defaultUploadPictureCardErrorMessage,
              };
            }

            return backendFile;
          }),
        );

        return;
      }

      const backendIds = result as Array<{ id: string }>;

      emitChange(
        latestFiles.map((file) => {
          const tempIndex = tempIdToIndex.get(file.id);

          if (tempIndex === undefined || tempIndex >= backendIds.length) {
            return file;
          }

          return {
            ...file,
            id: backendIds[tempIndex].id,
            progress: 100,
            status: 'done' as UploadItemStatus,
          };
        }),
      );

      return;
    }

    emitChange(
      latestFiles.map((file) =>
        tempFiles.some((temp) => temp.id === file.id)
          ? { ...file, progress: 100, status: 'done' as UploadItemStatus }
          : file,
      ),
    );
  } catch (error) {
    console.error('Upload failed:', error);

    emitChange(
      latestFiles.map((file) => {
        if (!tempFiles.some((temp) => temp.id === file.id)) return file;

        return {
          ...file,
          errorIcon: file.errorIcon ?? defaultErrorIconElement.value,
          errorMessage:
            file.errorMessage ??
            props.errorMessage ??
            defaultUploadPictureCardErrorMessage,
          status: 'error' as UploadItemStatus,
        };
      }),
    );
  }
}

function handleDelete(fileId: string): void {
  const file = findFileById(fileId);

  if (!file) return;

  emitChange(latestFiles.filter((item) => item.id !== fileId));

  if (file.file) emit('delete', fileId, file.file);
}

function handleReload(fileId: string): void {
  const file = findFileById(fileId);

  if (!file) return;

  emitChange(
    latestFiles.map((item) =>
      item.id === fileId
        ? { ...item, progress: 0, status: 'loading' as UploadItemStatus }
        : item,
    ),
  );

  if (file.file) emit('reload', fileId, file.file);
}

function handleDownload(fileId: string): void {
  const file = findFileById(fileId);

  if (file?.file) emit('download', fileId, file.file);
}

let previewObjectUrlToRevoke: string | null = null;

function handleZoomIn(fileId: string): void {
  const file = findFileById(fileId);

  if (!file) return;

  previewFile.value = file;
  isPreviewOpen.value = true;

  if (previewObjectUrlToRevoke) {
    URL.revokeObjectURL(previewObjectUrlToRevoke);
    previewObjectUrlToRevoke = null;
  }

  if (!file.url && file.file && isImageFile(file.file, file.url)) {
    previewObjectUrlToRevoke = URL.createObjectURL(file.file);
    previewObjectUrl.value = previewObjectUrlToRevoke;
  } else {
    previewObjectUrl.value = null;
  }

  if (file.file) emit('zoomIn', fileId, file.file);
}

const previewIsImage = computed((): boolean =>
  previewFile.value
    ? isImageFile(previewFile.value.file, previewFile.value.url)
    : false,
);

const previewImageSrc = computed(
  (): string => previewFile.value?.url ?? previewObjectUrl.value ?? '',
);

const imageFiles = computed((): UploadFile[] =>
  files.value.filter((file) => isImageFile(file.file, file.url)),
);

const nonImageFiles = computed((): UploadFile[] =>
  files.value.filter((file) => !isImageFile(file.file, file.url)),
);

const UPLOADER_CONFIG: Record<string, UploaderProps> = {
  'basic-list': { mode: 'basic', type: 'base' },
  'button-list': { type: 'button' },
  'card-wall': { mode: 'basic', type: 'base' },
  cards: { mode: 'basic', type: 'base' },
  list: { mode: 'dropzone', type: 'base' },
};

const uploaderConfig = computed(
  (): UploaderProps => UPLOADER_CONFIG[props.mode],
);

const topUploaderConfig = computed((): UploaderProps | null =>
  props.mode === 'card-wall' ? { mode: 'dropzone', type: 'base' } : null,
);

const shouldUsePictureCard = computed((): boolean =>
  /cards|card-wall/.test(props.mode),
);

const isSingleFileCardMode = computed(
  (): boolean => shouldUsePictureCard.value && props.maxFiles === 1,
);

/** The inline card uploader is redundant once a top one exists. */
const showInlineCardUploader = computed(
  (): boolean => topUploaderConfig.value === null,
);

const uploaderBindings = computed(() => ({
  accept: props.accept,
  disabled: effectiveDisabled.value,
  icon: props.uploaderIcon,
  inputProps: props.inputProps,
  label: props.uploaderLabel,
  multiple: props.multiple,
  name: props.name,
}));

const itemTypeOf = (file: UploadFile): UploadItemType =>
  isImageFile(file.file, file.url) ? 'thumbnail' : 'icon';

const renderableFiles = (list: UploadFile[]): UploadFile[] =>
  list.filter((file) => file.file || file.url);

const hintsClassName = computed((): string =>
  props.mode === 'list' || props.mode === 'card-wall' || props.mode === 'cards'
    ? classes.fillWidthHints
    : classes.hints,
);

const hasHints = computed((): boolean => Boolean(props.hints?.length));

const hostClasses = computed((): string =>
  clsx(classes.host, props.mode === 'cards' && classes.hostCards),
);

const uploadListClasses = computed((): string =>
  clsx(
    classes.uploadList,
    shouldUsePictureCard.value && classes.uploadListCards,
  ),
);

function onReplaceInputChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  const selectedFiles = Array.from(target.files ?? []);

  target.value = '';

  if (selectedFiles.length) void handleUpload(selectedFiles);
}

function onReplace(fileId: string, event: MouseEvent): void {
  event.stopPropagation();
  replaceFileId.value = fileId;
  replaceInput.value?.click();
}

const REPLACE_INPUT_STYLE = { display: 'none' };
</script>

<template>
  <div :class="hostClasses">
    <MznUploader
      v-if="topUploaderConfig"
      v-bind="{ ...uploaderBindings, ...topUploaderConfig }"
      :hints="dropzoneHints"
      :id="id ? `${id}-top` : undefined"
      @upload="handleUpload"
    />
    <ul v-if="mode === 'card-wall' && hasHints" :class="hintsClassName">
      <li
        v-for="hint in hints"
        :key="hint.label"
        :class="classes.hint(hint.type || 'info')"
      >
        <MznIcon
          :color="hint.type === 'info' ? 'info' : 'error'"
          :icon="hint.type === 'info' ? InfoFilledIcon : DangerousFilledIcon"
          :size="14"
        />
        {{ hint.label }}
      </li>
    </ul>
    <div v-if="!shouldUsePictureCard" :class="classes.uploadButtonList">
      <MznUploader
        v-bind="{ ...uploaderBindings, ...uploaderConfig }"
        :hints="uploaderConfig.mode === 'dropzone' ? dropzoneHints : undefined"
        :id="id"
        @upload="handleUpload"
      />
      <ul v-if="hasHints" :class="hintsClassName">
        <li
          v-for="hint in hints"
          :key="hint.label"
          :class="classes.hint(hint.type || 'info')"
        >
          <MznIcon
            :color="hint.type === 'info' ? 'info' : 'error'"
            :icon="hint.type === 'info' ? InfoFilledIcon : DangerousFilledIcon"
            :size="14"
          />
          {{ hint.label }}
        </li>
      </ul>
    </div>
    <div :class="uploadListClasses">
      <template v-if="shouldUsePictureCard">
        <MznUploadPictureCard
          v-for="uploadFile in imageFiles"
          :key="uploadFile.id"
          :aria-labels="ariaLabels"
          :disabled="disabled"
          :error-message="uploadFile.errorMessage"
          :file="uploadFile.file"
          :id="uploadFile.id"
          :size="size"
          :status="uploadFile.status"
          :url="uploadFile.url"
          @delete="handleDelete(uploadFile.id)"
          @reload="handleReload(uploadFile.id)"
          v-on="
            isSingleFileCardMode
              ? {
                  replace: (event: MouseEvent) =>
                    onReplace(uploadFile.id, event),
                }
              : {
                  download: () => handleDownload(uploadFile.id),
                  zoomIn: () => handleZoomIn(uploadFile.id),
                }
          "
        />
        <MznUploadPictureCard
          v-for="uploadFile in nonImageFiles"
          :key="uploadFile.id"
          :aria-labels="ariaLabels"
          :disabled="disabled"
          :error-message="uploadFile.errorMessage"
          :file="uploadFile.file"
          :id="uploadFile.id"
          :size="size"
          :status="uploadFile.status"
          :url="uploadFile.url"
          @delete="handleDelete(uploadFile.id)"
          @reload="handleReload(uploadFile.id)"
          v-on="
            isSingleFileCardMode
              ? {}
              : { download: () => handleDownload(uploadFile.id) }
          "
        />
        <MznUploader
          v-if="
            showInlineCardUploader &&
            (!isSingleFileCardMode || imageFiles.length === 0)
          "
          v-bind="{ ...uploaderBindings, ...uploaderConfig }"
          :hints="
            uploaderConfig.mode === 'dropzone' ? dropzoneHints : undefined
          "
          :id="id"
          @upload="handleUpload"
        />
        <input
          v-if="isSingleFileCardMode"
          ref="replaceInput"
          :accept="accept"
          :style="REPLACE_INPUT_STYLE"
          type="file"
          @change="onReplaceInputChange"
        />
      </template>
      <template v-if="!shouldUsePictureCard">
        <MznUploadItem
          v-for="uploadFile in renderableFiles(nonImageFiles)"
          :key="uploadFile.id"
          :disabled="disabled"
          :file="uploadFile.file"
          :id="uploadFile.id"
          :show-file-size="showFileSize"
          :size="size"
          :status="uploadFile.status"
          :type="itemTypeOf(uploadFile)"
          :url="uploadFile.url"
          @delete="handleDelete(uploadFile.id)"
          @download="handleDownload(uploadFile.id)"
          @reload="handleReload(uploadFile.id)"
        />
        <MznUploadItem
          v-for="uploadFile in renderableFiles(imageFiles)"
          :key="uploadFile.id"
          :disabled="disabled"
          :file="uploadFile.file"
          :id="uploadFile.id"
          :show-file-size="showFileSize"
          :size="size"
          :status="uploadFile.status"
          :type="itemTypeOf(uploadFile)"
          :url="uploadFile.url"
          @delete="handleDelete(uploadFile.id)"
          @download="handleDownload(uploadFile.id)"
          @reload="handleReload(uploadFile.id)"
        />
      </template>
    </div>
    <ul v-if="mode === 'cards' && hasHints" :class="hintsClassName">
      <li
        v-for="hint in hints"
        :key="hint.label"
        :class="classes.hint(hint.type || 'info')"
      >
        <MznIcon
          :color="hint.type === 'info' ? 'info' : 'error'"
          :icon="hint.type === 'info' ? InfoFilledIcon : DangerousFilledIcon"
          :size="14"
        />
        {{ hint.label }}
      </li>
    </ul>
    <MznMediaPreviewModal
      v-if="previewFile && previewIsImage && previewImageSrc"
      :media-items="[previewImageSrc]"
      :open="isPreviewOpen"
      @close="isPreviewOpen = false"
    />
  </div>
</template>
