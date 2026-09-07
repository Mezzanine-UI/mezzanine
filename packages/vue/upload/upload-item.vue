<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { uploadItemClasses as classes } from '@mezzanine-ui/core/upload';
import {
  DangerousFilledIcon,
  DownloadIcon,
  FileIcon,
  ResetIcon,
  TrashIcon,
} from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { resolveElement } from '../_internal/resolve-element';
import { useHasListener } from '../_internal/use-has-listener';
import MznClearActions from '../clear-actions/clear-actions.vue';
import MznIcon from '../icon/icon.vue';
import MznSpin from '../spin/spin.vue';
import MznTooltip from '../tooltip/tooltip.vue';
import MznTypography from '../typography/typography.vue';
import MznUploadPictureCard from './upload-picture-card.vue';
import { isImageFile } from './upload-utils';
import type { UploadItemProps } from './upload-item.types';

/**
 * 上傳清單裡的一列。
 *
 * `type` 決定左邊放圖示還是縮圖，`status` 決定右邊放什麼：上傳中是轉圈加取消、
 * 完成是下載、錯誤是重試。完成或錯誤時最右邊還有刪除。檔名過長會截斷並以
 * tooltip 補完。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznUploadItem } from '@mezzanine-ui/vue/upload';
 * <\/script>
 *
 * <template>
 *   <MznUploadItem :file="file" status="done" @delete="onDelete" />
 * </template>
 * ```
 *
 * @see MznUpload 管理整個上傳清單的元件
 */
const props = withDefaults(defineProps<UploadItemProps>(), {
  disabled: false,
  errorIcon: undefined,
  errorMessage: undefined,
  file: undefined,
  fileSize: undefined,
  icon: undefined,
  id: undefined,
  showFileSize: true,
  size: 'main',
  status: 'loading',
  type: 'icon',
  url: undefined,
});

const emit = defineEmits<{
  /** Fired when the cancel icon is clicked. */
  cancel: [event: MouseEvent];
  /** Fired when the delete icon is clicked. */
  delete: [event: MouseEvent];
  /** Fired when the download icon is clicked. */
  download: [event: MouseEvent];
  /** Fired when the reload icon is clicked. */
  reload: [event: MouseEvent];
}>();

/** React spreads the rest onto the inner container, not onto the host. */
defineOptions({ inheritAttrs: false });

const hasListener = useHasListener();

/**
 * Bound as objects rather than with `@click`, because React leaves each handler
 * off entirely when the consumer gave none — and an icon with a click listener
 * draws a pointer cursor.
 */
const cancelBindings = computed(() => ({
  class: classes.closeIcon,
  onClick: hasListener('cancel')
    ? (event: MouseEvent) => emit('cancel', event)
    : undefined,
  role: 'button',
}));

const downloadBindings = computed(() => ({
  class: classes.downloadIcon,
  icon: DownloadIcon,
  onClick: hasListener('download')
    ? (event: MouseEvent) => emit('download', event)
    : undefined,
  size: 16,
}));

const reloadBindings = computed(() => ({
  class: classes.resetIcon,
  icon: ResetIcon,
  onClick: hasListener('reload')
    ? (event: MouseEvent) => emit('reload', event)
    : undefined,
  size: 16,
}));

const deleteBindings = computed(() => ({
  class: classes.deleteIcon,
  color: 'neutral-solid' as const,
  icon: TrashIcon,
  onClick: hasListener('delete')
    ? (event: MouseEvent) => emit('delete', event)
    : undefined,
  size: 16,
}));

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

const fileSize = computed((): string | null => {
  if (!props.file && !props.fileSize) return null;

  const bytes = props.file?.size ?? props.fileSize;

  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  let index = 0;
  let size = bytes ?? 0;

  while (size >= k && index < sizes.length - 1) {
    size /= k;
    index += 1;
  }

  return `${Math.round(size * 10) / 10} ${sizes[index]}`;
});

const isFinished = computed((): boolean => /done|error/.test(props.status));

const shouldShowFileSize = computed((): boolean =>
  Boolean(props.showFileSize && isFinished.value && fileSize.value),
);

const shouldSingleLineCenter = computed((): boolean =>
  Boolean(
    props.type === 'thumbnail' && fileName.value && !shouldShowFileSize.value,
  ),
);

watch(
  [(): File | undefined => props.file, (): string | undefined => props.url],
  ([file, url]) => {
    if (!file && !url) {
      console.warn(
        'UploadItem: Both `file` and `url` props are missing. At least one should be provided to display the upload item.',
      );
    }
  },
  { immediate: true },
);

const nameElement = ref<HTMLElement | null>(null);
const isTextTruncated = ref(false);

/** Measured once the name is laid out, exactly as React's layout effect does. */
watch(
  [nameElement, fileName, (): string => props.size],
  () => {
    const element = nameElement.value;

    if (!element) {
      isTextTruncated.value = false;

      return;
    }

    isTextTruncated.value = element.scrollWidth > element.clientWidth;
  },
  { flush: 'post', immediate: true },
);

function setName(element: Element | ComponentPublicInstance | null): void {
  nameElement.value = resolveElement(element);
}

const hostClasses = computed((): string =>
  clsx(classes.host, classes.size(props.size), {
    [classes.alignCenter]: props.status !== 'done',
    [classes.disabled]: props.disabled,
    [classes.error]: props.status === 'error',
    [classes.singleLineContent]: shouldSingleLineCenter.value,
  }),
);

const TOOLTIP_OPTIONS = { placement: 'bottom' as const };
</script>

<template>
  <div :class="hostClasses">
    <div
      v-bind="$attrs"
      :aria-disabled="disabled"
      :class="classes.container"
      role="group"
      :tabindex="disabled ? -1 : 0"
    >
      <div :class="classes.contentWrapper">
        <div :class="classes.icon">
          <template v-if="type === 'thumbnail'">
            <MznUploadPictureCard
              v-if="isImage"
              :class="classes.thumbnail"
              :file="file"
              size="minor"
              :url="url"
            />
            <div v-else :class="classes.thumbnail">
              <MznIcon :class="classes.icon" :icon="FileIcon" :size="16" />
            </div>
          </template>
          <MznIcon
            v-else
            :class="classes.icon"
            :icon="icon ?? FileIcon"
            :size="16"
          />
        </div>
        <div :class="classes.content">
          <MznTooltip
            :options="TOOLTIP_OPTIONS"
            :title="isTextTruncated ? fileName : undefined"
          >
            <template #default="tooltip">
              <MznTypography
                :ref="
                  (element) => {
                    setName(element);
                    tooltip.ref(element);
                  }
                "
                :class="classes.name"
                ellipsis
                @mouseenter="tooltip.onMouseenter"
                @mouseleave="tooltip.onMouseleave"
              >
                {{ fileName }}
              </MznTypography>
            </template>
          </MznTooltip>
          <MznTypography v-if="shouldShowFileSize" :class="classes.fontSize">
            {{ fileSize }}
          </MznTypography>
        </div>
      </div>
      <div :class="classes.actions">
        <template v-if="status === 'loading'">
          <div :class="classes.loadingIcon">
            <MznSpin loading size="minor" />
          </div>
          <MznClearActions v-bind="cancelBindings" />
        </template>
        <MznIcon
          v-if="status === 'done' && !disabled"
          v-bind="downloadBindings"
        />
        <MznIcon
          v-if="status === 'error' && !disabled"
          v-bind="reloadBindings"
        />
      </div>
    </div>
    <div v-if="isFinished && !disabled" :class="classes.deleteContent">
      <MznIcon v-bind="deleteBindings" />
    </div>
  </div>
  <div v-if="status === 'error' && errorMessage" :class="classes.errorMessage">
    <MznIcon
      :class="classes.errorIcon"
      color="error"
      :icon="errorIcon ?? DangerousFilledIcon"
      :size="14"
    />
    <MznTypography
      :class="classes.errorMessageText"
      color="text-error"
      variant="caption"
    >
      {{ errorMessage }}
    </MznTypography>
  </div>
</template>
