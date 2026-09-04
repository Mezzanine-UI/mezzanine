import type { Ref } from 'vue';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import { isImeComposing } from '@mezzanine-ui/core/utils';

export interface CreateDropdownKeydownHandlerParams {
  /** The option the list is currently pointing at. */
  activeIndex: Ref<number | null>;
  /**
   * Optional keyboard-only active index.
   * When provided, it is updated alongside `activeIndex` on arrow key
   * navigation, and cleared on Escape / directional keys that exit the list.
   */
  keyboardActiveIndex?: Ref<number | null>;
  /** Called with `true` while the list is being driven by the keyboard. */
  setListboxHasVisualFocus: (focus: boolean) => void;
  /** Opens or closes the list. */
  setOpen: (open: boolean) => void;
  /** Called with the active option when Enter is pressed. */
  onEnterSelect?: (option: DropdownOption) => void;
  /** Called when Escape is pressed. */
  onEscape?: () => void;
  /** Whether the list is open. */
  open: () => boolean;
  /** The options the list is showing. */
  options: () => DropdownOption[];
}

/**
 * 下拉選單的鍵盤導覽處理器：上下鍵、Enter 與 Escape。
 *
 * 關閉狀態下按上下鍵會先開啟並選到頭或尾；開啟時循環移動。
 * Home／End／左右鍵視為離開清單，會清掉目前的高亮。組字中的按鍵一律忽略。
 *
 * @example
 * ```ts
 * const onKeydown = createDropdownKeydownHandler({
 *   activeIndex,
 *   open: () => open.value,
 *   options: () => props.options,
 *   setListboxHasVisualFocus: (focus) => { hasVisualFocus.value = focus; },
 *   setOpen: (next) => { open.value = next; },
 * });
 * ```
 *
 * @see MznDropdown 使用這個處理器的元件
 */
export function createDropdownKeydownHandler(
  params: CreateDropdownKeydownHandlerParams,
): (event: KeyboardEvent) => void {
  const {
    activeIndex,
    keyboardActiveIndex,
    onEnterSelect,
    onEscape,
    open,
    options,
    setListboxHasVisualFocus,
    setOpen,
  } = params;

  const setActiveIndex = (next: number | null): void => {
    activeIndex.value = next;

    if (keyboardActiveIndex) keyboardActiveIndex.value = next;
  };

  return (e: KeyboardEvent) => {
    const currentOptions = options();

    if (isImeComposing(e) || currentOptions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        e.stopPropagation();

        if (!open()) {
          setOpen(true);
          setListboxHasVisualFocus(true);
          setActiveIndex(0);

          return;
        }

        setListboxHasVisualFocus(true);

        const prev = activeIndex.value;

        setActiveIndex(
          prev === null ? 0 : prev >= currentOptions.length - 1 ? 0 : prev + 1,
        );
        break;
      }

      case 'ArrowUp': {
        e.preventDefault();
        e.stopPropagation();

        if (!open()) {
          setOpen(true);
          setListboxHasVisualFocus(true);
          setActiveIndex(currentOptions.length - 1);

          return;
        }

        setListboxHasVisualFocus(true);

        const prev = activeIndex.value;

        setActiveIndex(
          prev === null
            ? currentOptions.length - 1
            : prev <= 0
              ? currentOptions.length - 1
              : prev - 1,
        );
        break;
      }

      case 'Enter': {
        if (!open()) return;

        e.preventDefault();
        e.stopPropagation();

        if (activeIndex.value !== null && currentOptions[activeIndex.value]) {
          onEnterSelect?.(currentOptions[activeIndex.value]);
        }

        break;
      }

      case 'Escape': {
        e.preventDefault();
        e.stopPropagation();
        onEscape?.();
        break;
      }

      case 'Home':
      case 'End':
      case 'ArrowLeft':
      case 'ArrowRight': {
        setListboxHasVisualFocus(false);
        setActiveIndex(null);
        break;
      }

      default:
        break;
    }
  };
}
