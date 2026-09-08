import { onBeforeUnmount, watch } from 'vue';
import type { Ref } from 'vue';
import { useClickAway } from '../_internal/use-click-away';
import { useDocumentEscapeKeyDown } from '../_internal/use-document-escape-key-down';
import { useDocumentTabKeyDown } from '../_internal/use-document-tab-key-down';
import {
  getFocusableElements,
  getNextTabbableAfter,
  getPreviousTabbableBefore,
} from './get-focusable-elements';

export interface UsePickerDocumentEventCloseProps {
  /** The element the popper is anchored to — usually the trigger's host. */
  anchorRef: Ref<HTMLElement | null>;
  /** The element focus returns to; usually the trigger's input. */
  lastElementRefInFlow: Ref<HTMLElement | null>;
  /** Closes the popper and discards the pending change. */
  onChangeClose: () => void;
  /** Closes the popper. */
  onClose: () => void;
  /** Whether the popper is open. */
  open?: Ref<boolean | undefined>;
  /** The popper element. */
  popperRef: Ref<HTMLElement | null>;
}

/**
 * 以點擊外部、Escape 與 Tab 關閉 picker 浮層。
 *
 * 浮層是 portal 出去的，原生 Tab 順序會整個跳過它，因此這裡把輸入框與浮層接成一段
 * 邏輯上的順序：由輸入框 Tab 進浮層的第一個可聚焦元素、Shift+Tab 關閉；
 * 由浮層最後一個元素 Tab 出去會關閉並跳到錨點之後的下一個 tab stop，
 * Shift+Tab 則回到輸入框。其餘的 Tab 交給瀏覽器自己走。
 *
 * @example
 * ```ts
 * usePickerDocumentEventClose({
 *   anchorRef, lastElementRefInFlow, onChangeClose, onClose, open, popperRef,
 * });
 * ```
 *
 * @see useTabKeyClose 只處理 Tab 的簡化版
 */
export function usePickerDocumentEventClose({
  anchorRef,
  lastElementRefInFlow,
  onChangeClose,
  onClose,
  open,
  popperRef,
}: UsePickerDocumentEventCloseProps): void {
  const isOpen = (): boolean => Boolean(open?.value);

  useClickAway(
    () => (event) => {
      if (!isOpen()) return;

      if (!popperRef.value?.contains(event.target as HTMLElement)) {
        onChangeClose();
      }
    },
    anchorRef,
  );

  /**
   * Close popper on Escape and return focus to the trigger input so the
   * user does not lose their place in the page tab order.
   */
  useDocumentEscapeKeyDown(() => () => {
    if (!isOpen()) return;

    onClose();

    const popper = popperRef.value;
    const active = document.activeElement as HTMLElement | null;

    if (popper && active && popper.contains(active)) {
      lastElementRefInFlow.value?.focus();
    }
  });

  useDocumentTabKeyDown(() => (event) => {
    if (!isOpen()) return;

    const popper = popperRef.value;
    const anchor = anchorRef.value;
    const trigger = lastElementRefInFlow.value;

    if (!popper || !anchor) return;

    const active = document.activeElement as HTMLElement | null;

    if (!active || !popper.contains(active)) return;

    const focusables = getFocusableElements(popper);

    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      onChangeClose();

      const next = getNextTabbableAfter(anchor, popper);

      if (next) {
        next.focus();
      } else {
        trigger?.blur();
      }

      return;
    }

    if (event.shiftKey && active === first) {
      event.preventDefault();

      if (trigger) {
        trigger.focus();
      } else {
        onChangeClose();
        getPreviousTabbableBefore(anchor)?.focus();
      }
    }
  });

  /**
   * Direct keydown listener on the trigger element for the Tab → popper
   * bridge. Binding directly on the trigger (instead of the document) is
   * more reliable: it still fires when the picker lives inside a Modal or
   * focus trap that stops keydown propagation before it reaches document.
   */
  function handleTriggerKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    if (!isOpen()) return;

    const popper = popperRef.value;

    if (!popper) return;

    if (event.shiftKey) {
      onChangeClose();

      return;
    }

    const focusables = getFocusableElements(popper);

    if (focusables.length === 0) {
      onChangeClose();

      return;
    }

    event.preventDefault();
    event.stopPropagation();
    focusables[0].focus();
  }

  let boundTrigger: HTMLElement | null = null;

  const unbind = (): void => {
    boundTrigger?.removeEventListener('keydown', handleTriggerKeyDown);
    boundTrigger = null;
  };

  watch(
    lastElementRefInFlow,
    (trigger) => {
      unbind();

      if (!trigger) return;

      boundTrigger = trigger;
      trigger.addEventListener('keydown', handleTriggerKeyDown);
    },
    { immediate: true },
  );

  onBeforeUnmount(unbind);
}
