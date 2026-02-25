'use client';

import { forwardRef, useCallback, useRef, useState } from 'react';
import { layoutClasses as classes } from '@mezzanine-ui/core/layout';
import { cx } from '../utils/cx';
import { useDocumentEvents } from '../hooks/useDocumentEvents';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

// size-container-slim = 240px
const MIN_PANEL_WIDTH = 240;

export interface LayoutProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  children: React.ReactNode;
  defaultSidePanelWidth?: number;
  onSidePanelWidthChange?: (width: number) => void;
  sidePanelChildren: React.ReactNode;
}

const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  function Layout(props, ref) {
    const {
      children,
      className,
      defaultSidePanelWidth = 320,
      onSidePanelWidthChange,
      sidePanelChildren,
      style,
      ...rest
    } = props;

    const [isDragging, setIsDragging] = useState(false);
    const [sidePanelWidth, setSidePanelWidth] = useState(defaultSidePanelWidth);
    const dragStartRef = useRef<{ width: number; x: number } | null>(null);
    const rafIdRef = useRef<number | null>(null);

    const handleDividerMouseDown = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        dragStartRef.current = { width: sidePanelWidth, x: e.clientX };
      },
      [sidePanelWidth],
    );

    useDocumentEvents(
      () => {
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

              const delta = dragStartRef.current.x - e.clientX;
              const newWidth = dragStartRef.current.width + delta;
              const maxWidth = window.innerWidth - MIN_PANEL_WIDTH - 1;
              const clamped = Math.min(maxWidth, Math.max(MIN_PANEL_WIDTH, newWidth));

              setSidePanelWidth(clamped);
              onSidePanelWidthChange?.(clamped);
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
      },
      [isDragging, onSidePanelWidthChange],
    );

    return (
      <div
        {...rest}
        className={cx(classes.host, className)}
        ref={ref}
        style={{
          ...style,
          '--mzn-layout-side-panel-width': `${sidePanelWidth}px`,
        } as React.CSSProperties}
      >
        <main className={classes.main}>{children}</main>
        <div
          aria-orientation="vertical"
          className={cx(classes.divider, { [classes.dividerDragging]: isDragging })}
          onMouseDown={handleDividerMouseDown}
          role="separator"
        />
        <aside className={classes.sidePanel}>{sidePanelChildren}</aside>
      </div>
    );
  },
);

export default Layout;
