import { onScopeDispose, ref } from 'vue';
import type { Ref } from 'vue';

export interface UseDelayMouseEnterLeaveOptions {
  /**
   * Reads the delay before hiding on mouse leave, in seconds.
   * @default 0.1
   */
  mouseLeaveDelay?: () => number | undefined;
}

export interface DelayMouseEnterLeave {
  onLeave: () => void;
  onPopperEnter: () => void;
  onTargetEnter: (event: MouseEvent) => void;
  visible: Ref<boolean>;
}

/**
 * 管理帶有延遲的滑鼠移入／移出可見性狀態的 composable。
 *
 * 在滑鼠離開目標或 popper 時，會等待 `mouseLeaveDelay` 秒後才隱藏，
 * 讓使用者有時間將游標移入 popper 內容區域而不觸發消失。
 *
 * @example
 * ```ts
 * const { visible, onTargetEnter, onLeave, onPopperEnter } =
 *   useDelayMouseEnterLeave({ mouseLeaveDelay: () => props.mouseLeaveDelay });
 * ```
 */
export function useDelayMouseEnterLeave(
  options: UseDelayMouseEnterLeaveOptions = {},
): DelayMouseEnterLeave {
  const { mouseLeaveDelay = () => 0.1 } = options;

  /** state that control tooltip visible/invisible */
  const visible = ref(false);
  /** timer for mouse leaving delay */
  let timer: ReturnType<typeof setTimeout> | null = null;

  function clearVisibilityDelayTimeout(): void {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function onLeave(): void {
    timer = setTimeout(
      () => {
        visible.value = false;
        clearVisibilityDelayTimeout();
      },
      (mouseLeaveDelay() ?? 0.1) * 1000,
    );
  }

  function onPopperEnter(): void {
    clearVisibilityDelayTimeout();
    visible.value = true;
  }

  function onTargetEnter(event: MouseEvent): void {
    event.stopPropagation();
    clearVisibilityDelayTimeout();
    visible.value = true;
  }

  onScopeDispose(clearVisibilityDelayTimeout);

  return { onLeave, onPopperEnter, onTargetEnter, visible };
}
