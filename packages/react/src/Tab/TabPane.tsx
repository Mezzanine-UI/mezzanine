import { forwardRef, ReactElement } from 'react';
import { tabClasses as classes } from '@mezzanine-ui/core/tab';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { TabItemProps } from './TabItem';

export interface TabPaneProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Only for tabs to control the tab pane.
   */
  tab: ReactElement<TabItemProps>;
}

/**
 * The react component for `mezzanine` tab pane.
 */
const TabPane = forwardRef<HTMLDivElement, TabPaneProps>(
  function TabPane(props, ref) {
    const {
      children,
      className,
      /**
       * Ignore it
       */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      tab,
      ...rest
    } = props;

    return (
      <div {...rest} ref={ref} className={cx(classes.pane, className)}>
        {children}
      </div>
    );
  },
);

export default TabPane;
