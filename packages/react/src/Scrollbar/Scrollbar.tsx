import 'overlayscrollbars/overlayscrollbars.css';

import { forwardRef, useCallback, useEffect, useMemo } from 'react';
import {
  ClickScrollPlugin,
  OverlayScrollbars,
  type PartialOptions,
} from 'overlayscrollbars';
import type { OverlayScrollbarsComponentProps } from 'overlayscrollbars-react';
import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentRef,
} from 'overlayscrollbars-react';
import { scrollbarClasses as classes } from '@mezzanine-ui/core/scrollbar';
import { cx } from '../utils/cx';
import type { ScrollbarProps } from './typings';

/**
 * The react component for `mezzanine` scrollbar.
 * A customizable scrollbar container that provides consistent styling across all browsers
 */
const Scrollbar = forwardRef<
  OverlayScrollbarsComponentRef<'div'>,
  ScrollbarProps
>(function Scrollbar(props, ref) {
  const {
    children,
    className,
    defer = true,
    disabled = false,
    events,
    maxHeight,
    maxWidth,
    onViewportReady,
    options,
    style,
    ...rest
  } = props;

  // Register ClickScrollPlugin once (required for clickScroll option to work)
  useEffect(() => {
    OverlayScrollbars.plugin(ClickScrollPlugin);
  }, []);

  const mergedOptions = useMemo<PartialOptions>(
    () => ({
      ...options,
      overflow: {
        x: 'scroll',
        y: 'scroll',
      },
      scrollbars: {
        autoHide: 'scroll',
        autoHideDelay: 600,
        clickScroll: true,
        ...options?.scrollbars,
      },
    }),
    [options],
  );

  const containerStyle = useMemo(
    () => ({
      ...style,
      maxHeight,
      maxWidth,
    }),
    [maxHeight, maxWidth, style],
  );

  // Merge events with onViewportReady callback
  const mergedEvents = useMemo<
    OverlayScrollbarsComponentProps['events']
  >(() => {
    if (!onViewportReady && !events) return undefined;

    return {
      ...events,
      initialized: (instance: OverlayScrollbars) => {
        const { viewport } = instance.elements();

        onViewportReady?.(viewport as HTMLDivElement, instance);

        if (events && typeof events !== 'boolean' && events.initialized) {
          const initializedHandler = events.initialized;

          if (Array.isArray(initializedHandler)) {
            initializedHandler.forEach((handler) => handler(instance));
          } else {
            initializedHandler(instance);
          }
        }
      },
    };
  }, [events, onViewportReady]);

  // Callback ref for disabled mode - triggers onViewportReady with the div element
  const disabledRef = useCallback(
    (element: HTMLDivElement | null) => {
      // Forward to user ref if provided
      if (typeof ref === 'function') {
        (ref as (instance: HTMLDivElement | null) => void)(element);
      } else if (ref) {
        (ref as React.RefObject<HTMLDivElement | null>).current = element;
      }

      // Call onViewportReady with the div element (no OverlayScrollbars instance)
      if (element && onViewportReady) {
        onViewportReady(element, null as unknown as OverlayScrollbars);
      }
    },
    [onViewportReady, ref],
  );

  // When disabled, render a plain div instead of OverlayScrollbarsComponent
  if (disabled) {
    return (
      <div
        {...rest}
        ref={disabledRef}
        className={className}
        style={containerStyle}
      >
        {children}
      </div>
    );
  }

  return (
    <OverlayScrollbarsComponent
      {...rest}
      ref={ref}
      className={cx(classes.host, className)}
      defer={defer}
      element="div"
      events={mergedEvents}
      options={mergedOptions}
      style={containerStyle}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
});

export default Scrollbar;
