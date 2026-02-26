'use client';

import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { layoutClasses as classes } from '@mezzanine-ui/core/layout';
import { cx } from '../utils/cx';
import { useDocumentEvents } from '../hooks/useDocumentEvents';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

const MIN_PANEL_WIDTH = 240;
const ARROW_KEY_STEP = 10;

export interface LayoutMainProps {
  /** The content rendered inside the main area. */
  children?: React.ReactNode;
}

export function LayoutMain({ children }: LayoutMainProps) {
  return <>{children}</>;
}

LayoutMain.displayName = 'Layout.Main';

export interface LayoutSidePanelProps {
  /** The content rendered inside the side panel. */
  children?: React.ReactNode;
}

export function LayoutSidePanel({ children }: LayoutSidePanelProps) {
  return <>{children}</>;
}

LayoutSidePanel.displayName = 'Layout.SidePanel';

export interface LayoutProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /** The slot children: use `Layout.Main` and `Layout.SidePanel` as direct children. */
  children?: React.ReactNode;
  /** Initial width (in px) of the side panel. Clamped to a minimum of 240px. */
  defaultSidePanelWidth?: number;
  /** Callback fired when the side panel width changes during resize. */
  onSidePanelWidthChange?: (width: number) => void;
  /** Controls whether the side panel and divider are visible. */
  open?: boolean;
}

const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  function Layout(props, ref) {
    const {
      children,
      className,
      defaultSidePanelWidth = 320,
      onSidePanelWidthChange,
      open = false,
      style,
      ...rest
    } = props;

    const [isDragging, setIsDragging] = useState(false);
    const [sidePanelWidth, setSidePanelWidth] = useState(() => {
      const maxWidth =
        typeof window !== 'undefined'
          ? window.innerWidth - MIN_PANEL_WIDTH - 1
          : Infinity;

      return Math.min(
        maxWidth,
        Math.max(MIN_PANEL_WIDTH, defaultSidePanelWidth),
      );
    });
    const dragStartRef = useRef<{ width: number; x: number } | null>(null);
    const rafIdRef = useRef<number | null>(null);

    useEffect(() => {
      return () => {
        if (rafIdRef.current !== null) {
          window.cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      };
    }, []);

    let mainContent: React.ReactNode = null;
    let sidePanelContent: React.ReactNode = null;

    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;

      if (child.type === LayoutMain) {
        mainContent = (child as React.ReactElement<LayoutMainProps>).props
          .children;
      } else if (child.type === LayoutSidePanel) {
        sidePanelContent = (child as React.ReactElement<LayoutSidePanelProps>)
          .props.children;
      }
    });

    const handleDividerKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

        e.preventDefault();

        const step = e.key === 'ArrowLeft' ? ARROW_KEY_STEP : -ARROW_KEY_STEP;
        const maxWidth = window.innerWidth - MIN_PANEL_WIDTH - 1;
        const newWidth = Math.min(
          maxWidth,
          Math.max(MIN_PANEL_WIDTH, sidePanelWidth + step),
        );

        setSidePanelWidth(newWidth);
        onSidePanelWidthChange?.(newWidth);
      },
      [onSidePanelWidthChange, sidePanelWidth],
    );

    const handleDividerMouseDown = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        dragStartRef.current = { width: sidePanelWidth, x: e.clientX };
      },
      [sidePanelWidth],
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

            const delta = dragStartRef.current.x - e.clientX;
            const newWidth = dragStartRef.current.width + delta;
            const maxWidth = window.innerWidth - MIN_PANEL_WIDTH - 1;
            const clamped = Math.min(
              maxWidth,
              Math.max(MIN_PANEL_WIDTH, newWidth),
            );

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
    }, [isDragging, onSidePanelWidthChange]);

    return (
      <div
        {...rest}
        className={cx(classes.host, { [classes.hostOpen]: open }, className)}
        ref={ref}
        style={
          {
            ...style,
            '--mzn-layout-side-panel-width': `${sidePanelWidth}px`,
          } as React.CSSProperties
        }
      >
        <main className={classes.main}>{mainContent}</main>
        {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- WAI-ARIA 1.2: focusable separator with aria-valuenow is an interactive widget */}
        {open && (
          <div
            aria-label="Resize side panel"
            aria-orientation="vertical"
            aria-valuemax={
              typeof window !== 'undefined'
                ? window.innerWidth - MIN_PANEL_WIDTH - 1
                : undefined
            }
            aria-valuemin={MIN_PANEL_WIDTH}
            aria-valuenow={sidePanelWidth}
            className={cx(classes.divider, {
              [classes.dividerDragging]: isDragging,
            })}
            onKeyDown={handleDividerKeyDown}
            onMouseDown={handleDividerMouseDown}
            role="separator"
            tabIndex={0}
          />
        )}
        {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
        {open && (
          <aside aria-label="Side panel" className={classes.sidePanel}>
            {sidePanelContent}
          </aside>
        )}
      </div>
    );
  },
);

const LayoutWithSubComponents = Object.assign(Layout, {
  Main: LayoutMain,
  SidePanel: LayoutSidePanel,
});

export default LayoutWithSubComponents;
