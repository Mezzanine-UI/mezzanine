<script setup lang="ts">
import { computed } from 'vue';
import {
  modalClasses as classes,
  modalStatusTypeIcons,
} from '@mezzanine-ui/core/modal';
import type { ModalStatusType } from '@mezzanine-ui/core/modal';
import type { IconColor } from '@mezzanine-ui/core/icon';
import type { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import MznTypography from '../typography/typography.vue';
import { useModalControl } from './modal-control';
import type { ModalHeaderProps } from './modal-header.types';

/**
 * Modal 的標題列，顯示標題、輔助說明與狀態圖示。
 *
 * 狀態圖示取自 Modal 提供的 `modalStatusType`，圖示與顏色一一對應；
 * `statusTypeIconLayout` 決定圖示在標題左邊還是上方，`titleAlign` 與
 * `supportingTextAlign` 決定文字對齊。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznModalHeader } from '@mezzanine-ui/vue/modal';
 * <\/script>
 *
 * <template>
 *   <MznModalHeader show-status-type-icon title="確認刪除" />
 *   <MznModalHeader
 *     supporting-text="這個動作無法復原"
 *     title="確認刪除"
 *     title-align="center"
 *   />
 * </template>
 * ```
 *
 * @see MznModal 以 showModalHeader 渲染這個標題列
 */
const props = withDefaults(defineProps<ModalHeaderProps>(), {
  showStatusTypeIcon: false,
  statusTypeIconLayout: 'vertical',
  supportingText: undefined,
  supportingTextAlign: 'left',
  titleAlign: 'left',
});

const modalControl = useModalControl();

const iconColor = (type: ModalStatusType): IconColor => {
  switch (type) {
    case 'success':
      return 'success-strong';
    case 'warning':
      return 'warning';
    case 'error':
      return 'error-solid';
    case 'info':
      return 'info-strong';
    case 'email':
      return 'info-strong';
    case 'delete':
      return 'error-solid';
    default:
      return 'neutral';
  }
};

const statusTypeIcon = computed(
  (): IconDefinition =>
    modalStatusTypeIcons[modalControl.value.modalStatusType],
);

const statusTypeIconColor = computed(
  (): IconColor => iconColor(modalControl.value.modalStatusType),
);

const hostClasses = computed((): string =>
  clsx(classes.modalHeader, {
    [`${classes.modalHeader}--horizontal`]:
      props.statusTypeIconLayout === 'horizontal',
    [`${classes.modalHeader}--vertical`]:
      props.statusTypeIconLayout === 'vertical',
    [`${classes.modalHeader}--title-align-left`]: props.titleAlign === 'left',
    [`${classes.modalHeader}--title-align-center`]:
      props.titleAlign === 'center',
    [`${classes.modalHeader}--show-modal-status-type-icon`]:
      props.showStatusTypeIcon,
  }),
);

const supportingTextClasses = computed((): string =>
  clsx(classes.modalHeaderSupportingText, {
    [`${classes.modalHeaderSupportingText}--align-left`]:
      props.supportingTextAlign === 'left',
    [`${classes.modalHeaderSupportingText}--align-center`]:
      props.supportingTextAlign === 'center',
  }),
);

const statusTypeIconClass = classes.modalHeaderStatusTypeIcon;
const titleAndSupportingTextContainerClass =
  classes.modalHeaderTitleAndSupportingTextContainer;
const titleClass = classes.modalHeaderTitle;
</script>

<template>
  <div :class="hostClasses">
    <div v-if="showStatusTypeIcon" :class="statusTypeIconClass">
      <MznIcon :color="statusTypeIconColor" :icon="statusTypeIcon" :size="20" />
    </div>
    <div :class="titleAndSupportingTextContainerClass">
      <MznTypography
        :class="titleClass"
        color="text-neutral-solid"
        :title="title"
        variant="h2"
      >
        {{ title }}
      </MznTypography>
      <MznTypography
        :class="supportingTextClasses"
        color="text-neutral-strong"
        variant="body"
      >
        {{ supportingText }}
      </MznTypography>
    </div>
  </div>
</template>
