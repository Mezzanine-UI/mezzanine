<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import type { ComponentPublicInstance, VNodeArrayChildren } from 'vue';
import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import MznClearActions from '../clear-actions/clear-actions.vue';
import { provideModalControl } from './modal-control';
import MznModalFooter from './modal-footer.vue';
import MznModalHeader from './modal-header.vue';
import { useModalContainer } from './use-modal-container';
import type { ModalProps } from './modal.types';

/**
 * 對話框元件，以遮罩呈現需要使用者互動或確認的浮動視窗。
 *
 * `showModalHeader` 與 `showModalFooter` 分別啟用標題列與操作列；
 * `modalStatusType` 決定標題旁狀態圖示的樣子（info、success、warning、error、
 * email、delete）。`modalType` 支援 standard、extended、mediaPreview、
 * verification 與 extendedSplit 五種佈局，其中 extendedSplit 需同時給左右內容。
 * 內容超出高度時會自動在上下加上分隔線。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue';
 * import { MznModal } from '@mezzanine-ui/vue/modal';
 *
 * const open = ref(false);
 * <\/script>
 *
 * <template>
 *   <MznModal
 *     cancel-text="取消"
 *     confirm-text="確認"
 *     :open="open"
 *     show-modal-footer
 *     show-modal-header
 *     title="確認刪除"
 *     @cancel="open = false"
 *     @close="open = false"
 *     @confirm="remove"
 *   >
 *     <p>此操作無法復原，確定要刪除嗎？</p>
 *   </MznModal>
 * </template>
 * ```
 *
 * @see MznModalHeader 標題列
 * @see MznModalFooter 操作列
 * @see useModalContainer 自訂浮層時可重用的外殼
 */
/**
 * React spreads its rest props onto the dialog element inside the container,
 * and `backdropClassName` onto the container itself. Vue's fallthrough would
 * hand everything to the container instead, so both are placed explicitly.
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ModalProps>(), {
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
  cancelText: undefined,
  confirmButtonProps: undefined,
  confirmText: undefined,
  container: undefined,
  disableCloseOnBackdropClick: false,
  disableCloseOnEscapeKeyDown: false,
  disablePortal: false,
  extendedSplitLeftSideContent: undefined,
  extendedSplitRightSideContent: undefined,
  extendedSplitSidebarPosition: 'right',
  fullScreen: false,
  loading: false,
  modalStatusType: 'info',
  modalType: 'standard',
  open: undefined,
  passwordButtonProps: undefined,
  passwordButtonText: undefined,
  passwordChecked: undefined,
  passwordCheckedLabel: undefined,
  passwordCheckedOnChange: undefined,
  passwordOnClick: undefined,
  showCancelButton: undefined,
  showDismissButton: true,
  showModalFooter: false,
  showModalHeader: undefined,
  showStatusTypeIcon: undefined,
  size: 'regular',
  statusTypeIconLayout: undefined,
  supportingText: undefined,
  supportingTextAlign: undefined,
  title: undefined,
  titleAlign: undefined,
});

const emit = defineEmits<{
  backdropClick: [event: MouseEvent];
  cancel: [event: MouseEvent];
  close: [];
  confirm: [event: MouseEvent];
}>();

const slots = defineSlots<{
  /** The modal body. */
  default?: () => unknown;
}>();

const attrs = useAttrs();

const { Container: MznModalContainer } = useModalContainer();

provideModalControl(() => ({
  loading: props.loading,
  modalStatusType: props.modalStatusType,
}));

const bodyContent = ref<HTMLDivElement | null>(null);
const hasTopSeparator = ref(false);
const hasBottomSeparator = ref(false);

let scrollCleanup: (() => void) | null = null;

/**
 * Written as a function ref rather than a watcher because it has to run the
 * moment the container element appears and to tear down the moment it goes —
 * which is exactly when React's callback ref fires.
 */
function setBodyContainer(
  element: Element | ComponentPublicInstance | null,
): void {
  if (scrollCleanup) {
    scrollCleanup();
    scrollCleanup = null;
  }

  const node = element as HTMLDivElement | null;

  if (!node) {
    hasTopSeparator.value = false;
    hasBottomSeparator.value = false;

    return;
  }

  const checkScroll = (): void => {
    const { scrollTop, scrollHeight, clientHeight } = node;

    hasTopSeparator.value = scrollTop > 0;
    hasBottomSeparator.value = scrollTop + clientHeight < scrollHeight;
  };

  const rafId = requestAnimationFrame(checkScroll);

  node.addEventListener('scroll', checkScroll);

  const observer = new ResizeObserver(checkScroll);

  observer.observe(node);

  const content = bodyContent.value;

  if (content) {
    observer.observe(content);
  }

  scrollCleanup = (): void => {
    cancelAnimationFrame(rafId);
    node.removeEventListener('scroll', checkScroll);
    observer.disconnect();
  };
}

/**
 * What the slot actually renders, not whether one was passed: React skips the
 * whole body container when `children` is falsy, and a slot whose only content
 * is a false `v-if` still leaves a comment placeholder behind.
 */
const hasChildren = computed((): boolean =>
  Boolean(
    flattenChildren(slots.default?.() as VNodeArrayChildren | undefined).length,
  ),
);

const isBodyContainerType = computed(
  (): boolean =>
    props.modalType === 'standard' ||
    props.modalType === 'verification' ||
    props.modalType === 'extended' ||
    props.modalType === 'mediaPreview',
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    classes.modalStatusType(props.modalStatusType),
    classes.size(props.size),
    {
      [classes.fullScreen]: props.fullScreen,
      [classes.withCloseIcon]: props.showDismissButton,
    },
    attrs.class as string,
  ),
);

const bodyContainerClasses = computed((): string =>
  clsx(classes.modalBodyContainer, {
    [classes.modalBodyContainerWithTopSeparator]:
      props.modalType === 'extended' || hasTopSeparator.value,
    [classes.modalBodyContainerWithBottomSeparator]:
      props.modalType === 'extended' || hasBottomSeparator.value,
  }),
);

const extendedSplitClasses = computed((): string =>
  clsx(classes.modalBodyContainerExtendedSplit, {
    [classes.modalBodyContainerExtendedSplitSidebarLeft]:
      props.extendedSplitSidebarPosition === 'left',
  }),
);

const footerBindings = computed(() => ({
  actionsButtonLayout: props.actionsButtonLayout,
  annotation: props.annotation,
  auxiliaryContentButtonProps: props.auxiliaryContentButtonProps,
  auxiliaryContentButtonText: props.auxiliaryContentButtonText,
  auxiliaryContentChecked: props.auxiliaryContentChecked,
  auxiliaryContentLabel: props.auxiliaryContentLabel,
  auxiliaryContentOnChange: props.auxiliaryContentOnChange,
  auxiliaryContentOnClick: props.auxiliaryContentOnClick,
  auxiliaryContentType: props.auxiliaryContentType,
  cancelButtonProps: props.cancelButtonProps,
  cancelText: props.cancelText,
  confirmButtonProps: props.confirmButtonProps,
  confirmText: props.confirmText,
  loading: props.loading,
  passwordButtonProps: props.passwordButtonProps,
  passwordButtonText: props.passwordButtonText,
  passwordChecked: props.passwordChecked,
  passwordCheckedLabel: props.passwordCheckedLabel,
  passwordCheckedOnChange: props.passwordCheckedOnChange,
  passwordOnClick: props.passwordOnClick,
  showCancelButton: props.showCancelButton,
}));

const closeIconClass = classes.closeIcon;
const extendedSplitLeftClass = classes.modalBodyContainerExtendedSplitLeft;
const extendedSplitLeftSideContentClass =
  classes.modalBodyContainerExtendedSplitLeftSideContent;
const extendedSplitRightClass = classes.modalBodyContainerExtendedSplitRight;
</script>

<template>
  <MznModalContainer
    :class="backdropClassName"
    :container="container"
    :disable-close-on-backdrop-click="disableCloseOnBackdropClick"
    :disable-close-on-escape-key-down="disableCloseOnEscapeKeyDown"
    :disable-portal="disablePortal"
    :open="open"
    @backdrop-click="emit('backdropClick', $event)"
    @close="emit('close')"
  >
    <div
      :aria-modal="open ? true : undefined"
      v-bind="forwardedAttrs"
      :class="hostClasses"
      role="dialog"
    >
      <MznModalHeader
        v-if="showModalHeader"
        :show-status-type-icon="showStatusTypeIcon"
        :status-type-icon-layout="statusTypeIconLayout"
        :supporting-text="supportingText"
        :supporting-text-align="supportingTextAlign"
        :title="title as string"
        :title-align="titleAlign"
      />
      <div v-if="modalType === 'extendedSplit'" :class="extendedSplitClasses">
        <div :class="extendedSplitRightClass">
          <component :is="() => extendedSplitRightSideContent" />
        </div>
        <div :class="extendedSplitLeftClass">
          <div :class="extendedSplitLeftSideContentClass">
            <component :is="() => extendedSplitLeftSideContent" />
          </div>
          <MznModalFooter
            v-if="showModalFooter"
            v-bind="footerBindings"
            @cancel="emit('cancel', $event)"
            @confirm="emit('confirm', $event)"
          />
        </div>
      </div>
      <template v-if="isBodyContainerType">
        <div
          v-if="hasChildren"
          :ref="setBodyContainer"
          :class="bodyContainerClasses"
        >
          <div ref="bodyContent"><slot /></div>
        </div>
        <MznModalFooter
          v-if="showModalFooter"
          v-bind="footerBindings"
          @cancel="emit('cancel', $event)"
          @confirm="emit('confirm', $event)"
        />
      </template>
      <MznClearActions
        v-if="showDismissButton"
        :class="closeIconClass"
        variant="base"
        @click="emit('close')"
      />
    </div>
  </MznModalContainer>
</template>
