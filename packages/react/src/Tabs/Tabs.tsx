import {
  Children,
  cloneElement,
  forwardRef,
  Key,
  MouseEvent,
  ReactElement,
  ReactNode,
} from 'react';
import { tabsClasses as classes } from '@mezzanine-ui/core/tabs';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useCustomControlValue } from '../Form/useCustomControlValue';
import { TabProps } from './Tab';
import { TabPaneProps } from './TabPane';

export type TabsChild = ReactElement<TabPaneProps>;

export interface TabsProps extends
  Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onChange' | 'children'> {
  /**
   * Current TabPane's index
   */
  activeKey?: Key;
  /**
   * The tab panes in tabs
   */
  children: TabsChild | TabsChild[];
  /**
   * Initial active TabPane's key, if activeKey is not set.
   */
  defaultActiveKey?: Key;
  /**
   * The change event handler of Tabs
   */
  onChange?: (activeKey: Key) => void;
  /**
   * Callback executed when tab is clicked
   */
  onTabClick?: (key: Key, event: MouseEvent) => void;
  /**
   * The className of tabBar
   */
  tabBarClassName?: string;
}

/**
 * The react component for `mezzanine` tabs.
 */
const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(props: TabsProps, ref) {
  const {
    activeKey: activeKeyProp,
    children,
    className,
    defaultActiveKey = 0,
    onChange,
    onTabClick,
    tabBarClassName,
    ...rest
  } = props;
  const [activeKey, setActiveKey] = useCustomControlValue({
    defaultValue: defaultActiveKey,
    onChange,
    value: activeKeyProp,
  });
  let pane: ReactNode | undefined;
  const tabs = Children.map(children, (tabPane, index) => {
    const key = tabPane.key ?? index;
    const { tab } = tabPane.props;
    const active = activeKey.toString() === key.toString();

    if (active) {
      pane = tabPane;
    }

    return cloneElement<TabProps>(tab, {
      key,
      active,
      onClick: (event) => {
        if (!active) {
          setActiveKey(key);
        }

        if (onTabClick) {
          onTabClick(key, event);
        }
      },
    });
  });

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(
        classes.host,
        className,
      )}
    >
      <div
        className={cx(
          classes.tabBar,
          tabBarClassName,
        )}
      >
        {tabs}
      </div>
      {pane}
    </div>
  );
});

export default Tabs;
