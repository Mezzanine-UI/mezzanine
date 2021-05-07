import { RefObject } from 'react';
import { useClickAway } from '../hooks/useClickAway';
import { useDocumentEscapeKeyDown } from '../hooks/useDocumentEscapeKeyDown';
import { useTabKeyClose } from './useTabKeyClose';

export interface UsePickerDocumentEventCloseProps {
  anchorRef: RefObject<HTMLElement>;
  lastElementRefInFlow: RefObject<HTMLElement>;
  onClose: VoidFunction;
  onChangeClose: VoidFunction;
  open?: boolean;
  popperRef: RefObject<HTMLElement>;
}

export function usePickerDocumentEventClose({
  anchorRef,
  lastElementRefInFlow,
  onClose,
  onChangeClose,
  open,
  popperRef,
}: UsePickerDocumentEventCloseProps) {
  useClickAway(
    () => {
      if (!open) {
        return;
      }

      return (event) => {
        if (!popperRef.current?.contains(event.target as HTMLElement)) {
          onChangeClose();
        }
      };
    },
    anchorRef,
    [open, onClose],
  );

  /** Close popper when escape key down */
  useDocumentEscapeKeyDown(() => () => {
    if (open) {
      onClose();
    }
  }, [open, onClose]);

  /** Close popper when tab key down */
  useTabKeyClose(
    onChangeClose,
    lastElementRefInFlow,
    [onChangeClose],
  );
}
