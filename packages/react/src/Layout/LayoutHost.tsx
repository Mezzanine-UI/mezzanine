'use client';

import { forwardRef, useCallback, useMemo, useRef } from 'react';
import { layoutClasses as classes } from '@mezzanine-ui/core/layout';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { LayoutContext, LayoutContextValue } from './LayoutContext';

export interface LayoutHostProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /** The content rendered inside the layout host. */
  children?: React.ReactNode;
}

export const LayoutHost = forwardRef<HTMLDivElement, LayoutHostProps>(
  function LayoutHost(props, ref) {
    const { children, className, ...rest } = props;

    const hostRef = useRef<HTMLDivElement | null>(null);
    const mainRef = useRef<HTMLDivElement | null>(null);

    const registerMain = useCallback((el: HTMLDivElement | null) => {
      mainRef.current = el;
    }, []);

    const contextValue = useMemo<LayoutContextValue>(
      () => ({ hostRef, mainRef, registerMain }),
      [registerMain],
    );

    return (
      <LayoutContext.Provider value={contextValue}>
        <div
          {...rest}
          className={cx(classes.host, className)}
          ref={(node) => {
            hostRef.current = node;

            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
        >
          {children}
        </div>
      </LayoutContext.Provider>
    );
  },
);
