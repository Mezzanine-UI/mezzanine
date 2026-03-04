'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { layoutClasses as classes } from '@mezzanine-ui/core/layout';
import { cx } from '../utils/cx';
import { useDocumentEvents } from '../hooks/useDocumentEvents';
import Scrollbar, { ScrollbarProps } from '../Scrollbar';
import { LayoutContext } from './LayoutContext';

const MIN_PANEL_WIDTH = 240;
const CONTENT_WRAPPER_MIN_WIDTH = 480;
const ARROW_KEY_STEP = 10;

export interface LayoutRightPanelProps {
  /** The content rendered inside the right panel. */
  children?: React.ReactNode;
  /** Additional class name applied to the panel element. */
  className?: string;
  /** Initial width (in px) of the panel. Clamped to a minimum of 240px. */
  defaultWidth?: number;
  /** Callback fired when the panel width changes during resize. */
  onWidthChange?: (width: number) => void;
  /** Controls whether the panel and its divider are visible. */
  open?: boolean;
  /** Props passed to the internal `Scrollbar` component. */
  scrollbarProps?: Omit<ScrollbarProps, 'children'>;
}

export function LayoutRightPanel({
  children,
  className,
  defaultWidth = 320,
  onWidthChange,
  open = false,
  scrollbarProps = {},
}: LayoutRightPanelProps) {
  const context = useContext(LayoutContext);

  const [isDragging, setIsDragging] = useState(false);
  const [width, setWidth] = useState(() =>
    Math.max(MIN_PANEL_WIDTH, defaultWidth),
  );
  const dragStartRef = useRef<{
    width: number;
    x: number;
    maxWidth: number;
  } | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  const handleDividerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      const mainWidth =
        context?.mainRef.current?.offsetWidth || window.innerWidth;
      const maxWidth =
        width + Math.max(0, mainWidth - CONTENT_WRAPPER_MIN_WIDTH);

      setIsDragging(true);
      dragStartRef.current = { maxWidth, width, x: e.clientX };
    },
    [context, width],
  );

  const handleDividerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

      e.preventDefault();

      const mainWidth =
        context?.mainRef.current?.offsetWidth || window.innerWidth;
      const maxWidth =
        width + Math.max(0, mainWidth - CONTENT_WRAPPER_MIN_WIDTH);
      const step = e.key === 'ArrowLeft' ? ARROW_KEY_STEP : -ARROW_KEY_STEP;
      const newWidth = Math.min(
        maxWidth,
        Math.max(MIN_PANEL_WIDTH, width + step),
      );

      setWidth(newWidth);
      onWidthChange?.(newWidth);
    },
    [context, onWidthChange, width],
  );

  useDocumentEvents(() => {
    if (!isDragging) return undefined;

    return {
      mousemove: (e: MouseEvent) => {
        if (!dragStartRef.current) return;

        if (rafIdRef.current !== null) {
          window.cancelAnimationFrame(rafIdRef.current);
        }

        rafIdRef.current = window.requestAnimationFrame(() => {
          rafIdRef.current = null;

          if (!dragStartRef.current) return;

          const delta = e.clientX - dragStartRef.current.x;
          const newWidth = dragStartRef.current.width - delta;
          const clamped = Math.min(
            dragStartRef.current.maxWidth,
            Math.max(MIN_PANEL_WIDTH, newWidth),
          );

          setWidth(clamped);
          onWidthChange?.(clamped);
        });
      },
      mouseup: () => {
        if (rafIdRef.current !== null) {
          window.cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }

        setIsDragging(false);
        dragStartRef.current = null;
      },
    };
  }, [isDragging, onWidthChange]);

  if (!open) return null;

  return (
    <aside
      aria-label="Right panel"
      className={cx(classes.sidePanel, classes.sidePanelRight, className)}
      style={{ inlineSize: width }}
    >
      {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- WAI-ARIA 1.2: focusable separator with aria-valuenow is an interactive widget */}
      <div
        aria-label="Resize right panel"
        aria-orientation="vertical"
        aria-valuemin={MIN_PANEL_WIDTH}
        aria-valuenow={width}
        className={cx(classes.divider, {
          [classes.dividerDragging]: isDragging,
        })}
        onKeyDown={handleDividerKeyDown}
        onMouseDown={handleDividerMouseDown}
        role="separator"
        tabIndex={0}
      />
      {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
      <div className={classes.sidePanelContent}>
        <Scrollbar {...scrollbarProps}>{children}</Scrollbar>
      </div>
    </aside>
  );
}

LayoutRightPanel.displayName = 'Layout.RightPanel';
