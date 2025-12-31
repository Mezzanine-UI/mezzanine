import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';

/**
 * 提供下拉清單的鍵盤導覽處理器，封裝上下鍵 / Enter / Escape 行為。
 * 將邏輯集中於 DropdownItem 以便複用。
 */
export function createDropdownKeydownHandler(params: {
  activeIndex: number | null;
  onEnterSelect?: (option: DropdownOption) => void;
  onEscape?: () => void;
  open: boolean;
  options: DropdownOption[];
  setActiveIndex: (updater: (prev: number | null) => number | null) => void;
  setListboxHasVisualFocus: (focus: boolean) => void;
  setOpen: (open: boolean) => void;
}) {
  const {
    activeIndex,
    onEnterSelect,
    onEscape,
    open,
    options,
    setActiveIndex,
    setListboxHasVisualFocus,
    setOpen,
  } = params;

  return (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (options.length === 0) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        e.stopPropagation();
        if (!open) {
          setOpen(true);
          setListboxHasVisualFocus(true);
          setActiveIndex(() => 0);
          return;
        }
        setListboxHasVisualFocus(true);
        setActiveIndex((prev) => {
          if (prev === null) return 0;
          return prev >= options.length - 1 ? 0 : prev + 1;
        });
        break;
      }

      case 'ArrowUp': {
        e.preventDefault();
        e.stopPropagation();
        if (!open) {
          setOpen(true);
          setListboxHasVisualFocus(true);
          setActiveIndex(() => options.length - 1);
          return;
        }
        setListboxHasVisualFocus(true);
        setActiveIndex((prev) => {
          if (prev === null) return options.length - 1;
          return prev <= 0 ? options.length - 1 : prev - 1;
        });
        break;
      }

      case 'Enter': {
        if (!open) return;
        e.preventDefault();
        e.stopPropagation();
        if (activeIndex !== null && options[activeIndex]) {
          onEnterSelect?.(options[activeIndex]);
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
        setActiveIndex(() => null);
        break;
      }

      default:
        break;
    }
  };
}
