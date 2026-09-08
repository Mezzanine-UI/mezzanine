<script setup lang="ts">
import { ref } from 'vue';
import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import { MOTION_EASING } from '@mezzanine-ui/system/motion';
import { useDocumentEscapeKeyDown } from '../_internal/use-document-escape-key-down';
import { useFocusTrap } from '../_internal/use-focus-trap';
import { useHasListener } from '../_internal/use-has-listener';
import { useTopStack } from '../_internal/use-top-stack';
import MznBackdrop from '../backdrop/backdrop.vue';
import MznScale from '../transition/scale.vue';
import {
  modalContainerDefaultOptions as defaultOptions,
  type ModalContainerProps,
} from './modal-container.types';

/**
 * Modal 的外殼：遮罩、進出場縮放、Escape 關閉與焦點困住。
 *
 * 內容以 dialog 的焦點模型呈現：開啟時焦點移入內容、Tab 在其中環繞、關閉時
 * 還原給原本的元素；巢狀浮層共用 `useTopStack`，只有最上層會攔 Escape 與 Tab。
 * 完全關閉並播完離場動畫之前不會卸載。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useModalContainer } from '@mezzanine-ui/vue/modal';
 *
 * const { Container } = useModalContainer();
 * <\/script>
 *
 * <template>
 *   <Container :open="open" @close="open = false">
 *     <div>自訂浮層內容</div>
 *   </Container>
 * </template>
 * ```
 *
 * @see MznBackdrop 遮罩底層
 * @see MznModal 以此為外殼的對話框
 */
const props = withDefaults(defineProps<ModalContainerProps>(), {
  container: undefined,
  disableCloseOnBackdropClick: defaultOptions.disableCloseOnBackdropClick,
  disableCloseOnEscapeKeyDown: defaultOptions.disableCloseOnEscapeKeyDown,
  disablePortal: defaultOptions.disablePortal,
  open: defaultOptions.open,
});

const emit = defineEmits<{
  backdropClick: [event: MouseEvent];
  close: [];
}>();

defineSlots<{
  default?: () => unknown;
}>();

const hasListener = useHasListener();

const exited = ref(true);

/**
 * Dialog focus model: focus moves into the content on open, Tab cycles inside
 * it, and the previously focused element gets focus back on close.
 */
const content = ref<HTMLDivElement | null>(null);

/** Escape keydown close: escape will only close the top modal */
const checkIsOnTheTop = useTopStack(() => props.open);

useDocumentEscapeKeyDown(() => {
  if (
    !props.open ||
    props.disableCloseOnEscapeKeyDown ||
    !hasListener('close')
  ) {
    return undefined;
  }

  return (event) => {
    if (checkIsOnTheTop()) {
      event.stopPropagation();

      emit('close');
    }
  };
});

const { focusFirst } = useFocusTrap({
  containerRef: content,
  enabled: () => Boolean(props.open),
  isTopStack: checkIsOnTheTop,
});

function onEntered(): void {
  exited.value = false;
  // The content is portalled and animated in, so it can be moved after mount —
  // which drops focus back to the body. Re-assert it once the enter transition
  // has finished.
  focusFirst();
}

const SCALE_EASING = {
  enter: MOTION_EASING.entrance,
  exit: MOTION_EASING.exit,
};

defineExpose({ content });

const contentWrapperClass = classes.contentWrapper;
</script>

<template>
  <MznBackdrop
    v-if="open || !exited"
    :container="container"
    :disable-close-on-backdrop-click="disableCloseOnBackdropClick"
    :disable-portal="disablePortal"
    :open="open"
    role="presentation"
    @backdrop-click="emit('backdropClick', $event)"
    @close="emit('close')"
  >
    <MznScale
      :easing="SCALE_EASING"
      :in="open"
      @entered="onEntered"
      @exited="exited = true"
    >
      <div ref="content" :class="contentWrapperClass" tabindex="-1">
        <slot />
      </div>
    </MznScale>
  </MznBackdrop>
</template>
