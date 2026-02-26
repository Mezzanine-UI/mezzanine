'use client';

import { forwardRef, useCallback, useMemo, useState } from 'react';
import { layoutClasses as classes } from '@mezzanine-ui/core/layout';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { LayoutPanelContext, LayoutPanelContextValue } from './LayoutContext';

const MIN_PANEL_WIDTH = 240;

export interface LayoutHostProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /** The content rendered inside the layout host. */
  children?: React.ReactNode;
  /** SSR hint: initial open state read from LayoutSidePanel.props.open */
  initialOpen?: boolean;
  /** SSR hint: initial width read from LayoutSidePanel.props.defaultSidePanelWidth */
  initialSidePanelWidth?: number;
}

export const LayoutHost = forwardRef<HTMLDivElement, LayoutHostProps>(
  function LayoutHost(props, ref) {
    const {
      children,
      className,
      initialOpen = false,
      initialSidePanelWidth = 320,
      style,
      ...rest
    } = props;

    const [isOpen, setIsOpen] = useState(initialOpen);
    const [sidePanelWidth, setSidePanelWidth] = useState(() =>
      Math.max(MIN_PANEL_WIDTH, initialSidePanelWidth),
    );

    const onPanelStateChange = useCallback<
      LayoutPanelContextValue['onPanelStateChange']
    >(({ isOpen: nextIsOpen, width }) => {
      setIsOpen(nextIsOpen);
      setSidePanelWidth(width);
    }, []);

    const contextValue = useMemo<LayoutPanelContextValue>(
      () => ({ onPanelStateChange }),
      [onPanelStateChange],
    );

    return (
      <LayoutPanelContext.Provider value={contextValue}>
        <div
          {...rest}
          className={cx(
            classes.host,
            { [classes.hostOpen]: isOpen },
            className,
          )}
          ref={ref}
          style={
            {
              ...style,
              '--mzn-layout-side-panel-width': `${sidePanelWidth}px`,
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      </LayoutPanelContext.Provider>
    );
  },
);
