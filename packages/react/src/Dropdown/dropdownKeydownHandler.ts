import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import { Dispatch, SetStateAction } from 'react';

/**
 * Provides a keyboard navigation handler for dropdown lists, encapsulating Arrow keys, Enter, and Escape behaviors.
 * Keeps logic centralized in DropdownItem for easy reuse.
 */
export function createDropdownKeydownHandler(params: {
  activeIndex: number | null;
  onEnterSelect?: (option: DropdownOption) => void;
  onEscape?: () => void;
  open: boolean;
  options: DropdownOption[];
  setActiveIndex: Dispatch<SetStateAction<number | null>>;
  /**
   * Optional setter for keyboard-only active index.
   * When provided, it is updated alongside `setActiveIndex` on arrow key navigation,
   * and cleared on Escape / directional keys that exit the list.
   */
  setKeyboardActiveIndex?: Dispatch<SetStateAction<number | null>>;
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
    setKeyboardActiveIndex,
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
          setKeyboardActiveIndex?.(() => 0);
          return;
        }
        setListboxHasVisualFocus(true);
        setActiveIndex((prev) => {
          const next =
            prev === null ? 0 : prev >= options.length - 1 ? 0 : prev + 1;
          setKeyboardActiveIndex?.(() => next);
          return next;
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
          setKeyboardActiveIndex?.(() => options.length - 1);
          return;
        }
        setListboxHasVisualFocus(true);
        setActiveIndex((prev) => {
          const next =
            prev === null
              ? options.length - 1
              : prev <= 0
                ? options.length - 1
                : prev - 1;
          setKeyboardActiveIndex?.(() => next);
          return next;
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
        setKeyboardActiveIndex?.(() => null);
        break;
      }

      default:
        break;
    }
  };
}
