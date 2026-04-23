import { RefObject, useRef } from 'react';
import { useClickAway } from '../hooks/useClickAway';
import { useDocumentEscapeKeyDown } from '../hooks/useDocumentEscapeKeyDown';
import { useDocumentTabKeyDown } from '../hooks/useDocumentTabKeyDown';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import {
  getFocusableElements,
  getNextTabbableAfter,
  getPreviousTabbableBefore,
} from './getFocusableElements';

export interface UsePickerDocumentEventCloseProps {
  anchorRef: RefObject<HTMLElement | null>;
  lastElementRefInFlow: RefObject<HTMLElement | null>;
  onClose: VoidFunction;
  onChangeClose: VoidFunction;
  open?: boolean;
  popperRef: RefObject<HTMLElement | null>;
}

export function usePickerDocumentEventClose({
  anchorRef,
  lastElementRefInFlow,
  onClose,
  onChangeClose,
  open,
  popperRef,
}: UsePickerDocumentEventCloseProps) {
  /**
   * Mirror the latest values into refs so the document-level event handlers
   * (which are installed once and only re-installed when deps change) always
   * read the freshest props rather than a closure captured at install time.
   */
  const openRef = useRef(open);
  const onCloseRef = useRef(onClose);
  const onChangeCloseRef = useRef(onChangeClose);

  useIsomorphicLayoutEffect(() => {
    openRef.current = open;
    onCloseRef.current = onClose;
    onChangeCloseRef.current = onChangeClose;
  });

  useClickAway(
    () => (event) => {
      if (!openRef.current) return;
      if (!popperRef.current?.contains(event.target as HTMLElement)) {
        onChangeCloseRef.current();
      }
    },
    anchorRef,
    [],
  );

  /**
   * Close popper on Escape and return focus to the trigger input so the
   * user does not lose their place in the page tab order.
   */
  useDocumentEscapeKeyDown(
    () => () => {
      if (!openRef.current) return;
      onCloseRef.current();
      const popper = popperRef.current;
      const active = document.activeElement as HTMLElement | null;
      if (popper && active && popper.contains(active)) {
        lastElementRefInFlow.current?.focus();
      }
    },
    [lastElementRefInFlow, popperRef],
  );

  /**
   * Keyboard navigation across the trigger input and the portalled popper.
   *
   * The popper is rendered into document.body via Portal, so the natural
   * Tab order skips it entirely. We bridge the trigger and the popper as
   * a logical sequence:
   *
   *   - Tab from trigger input  → first focusable inside popper  (handled by
   *     the direct trigger listener below, which uses `stopPropagation` so
   *     this document-level handler does not run again for that case)
   *   - Shift+Tab from trigger  → close popper                  (same)
   *   - Tab from last popper    → close + focus next tab stop after anchor
   *   - Shift+Tab from first    → return focus to trigger input
   *
   * Other Tabs inside the popper fall through to the browser's default
   * focus traversal, so users can walk through calendar buttons, footer
   * actions, etc. with the regular keyboard.
   */
  useDocumentTabKeyDown(
    () => (event) => {
      if (!openRef.current) return;

      const popper = popperRef.current;
      const anchor = anchorRef.current;
      const trigger = lastElementRefInFlow.current;

      if (!popper || !anchor) return;

      const active = document.activeElement as HTMLElement | null;

      if (!active || !popper.contains(active)) return;

      const focusables = getFocusableElements(popper);

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        onChangeCloseRef.current();
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
          onChangeCloseRef.current();
          getPreviousTabbableBefore(anchor)?.focus();
        }
      }
    },
    [anchorRef, popperRef, lastElementRefInFlow],
  );

  /**
   * Direct keydown listener on the trigger element for the Tab → popper
   * bridge. Binding directly on the trigger (instead of the document) is
   * more reliable: it still fires when the picker lives inside a Modal or
   * focus trap that stops keydown propagation before it reaches document.
   */
  useIsomorphicLayoutEffect(() => {
    const trigger = lastElementRefInFlow.current;

    if (!trigger) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      if (!openRef.current) return;

      const popper = popperRef.current;

      if (!popper) return;

      if (event.shiftKey) {
        onChangeCloseRef.current();
        return;
      }

      const focusables = getFocusableElements(popper);

      if (focusables.length === 0) {
        onChangeCloseRef.current();
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      focusables[0].focus();
    };

    trigger.addEventListener('keydown', handleKeyDown);
    return () => {
      trigger.removeEventListener('keydown', handleKeyDown);
    };
  }, [lastElementRefInFlow, popperRef]);
}
