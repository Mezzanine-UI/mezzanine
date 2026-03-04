'use client';

import { useContext } from 'react';
import { cx } from '../utils/cx';
import { layoutClasses as classes } from '@mezzanine-ui/core/layout';
import { LayoutContext } from './LayoutContext';
import Scrollbar, { ScrollbarProps } from '../Scrollbar';

export interface LayoutMainProps {
  /** The content rendered inside the main area. */
  children?: React.ReactNode;
  /**
   * Additional class name applied to the main element.
   */
  className?: string;
  /**
   * Props passed to the internal `Scrollbar` component. If not provided, the main area will still be scrollable but without the custom scrollbar styling and behavior.
   */
  scrollbarProps?: Omit<ScrollbarProps, 'children'>;
}

export function LayoutMain(props: LayoutMainProps) {
  const { children, className, scrollbarProps = {} } = props;
  const context = useContext(LayoutContext);

  return (
    <div
      ref={context?.registerMain ?? null}
      className={cx(classes.main, className)}
    >
      <Scrollbar {...scrollbarProps}>
        <div className={classes.mainContent}>{children}</div>
      </Scrollbar>
    </div>
  );
}

LayoutMain.displayName = 'Layout.Main';
