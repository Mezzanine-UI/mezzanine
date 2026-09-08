import type { Ref } from 'vue';
import { useDocumentTabKeyDown } from '../_internal/use-document-tab-key-down';

/**
 * 當焦點停在流程中的最後一個元素上並按下 Tab 時關閉浮層。
 *
 * @example
 * ```ts
 * useTabKeyClose(() => { open.value = false; }, lastElement);
 * ```
 *
 * @see usePickerDocumentEventClose 完整的關閉行為（點擊外部、Escape、Tab）
 */
export function useTabKeyClose(
  onClose: () => void,
  lastElementRefInFlow: Ref<HTMLElement | null>,
): void {
  useDocumentTabKeyDown(() => () => {
    const { activeElement } = document;

    if (activeElement === lastElementRefInFlow.value) {
      onClose();
    }
  });
}
