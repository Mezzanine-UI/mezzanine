import {
  Children,
  cloneElement,
  forwardRef,
  Key,
  MouseEvent,
  ReactElement,
  ReactNode,
  useRef,
} from 'react';
import { tabClasses as classes } from '@mezzanine-ui/core/tab';
import { ChevronLeftIcon, ChevronRightIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useCustomControlValue } from '../Form/useCustomControlValue';
import TabItem, { TabItemProps } from './TabItem';

export type TabsChild = ReactElement<TabItemProps>;

export interface TabProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'div'>,
    'onChange' | 'children'
  > {
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
}

/**
 * The react component for `mezzanine` tabs.
 */
const Tab = forwardRef<HTMLDivElement, TabProps>(function Tabs(
  props: TabProps,
  ref,
) {
  const {
    activeKey: activeKeyProp,
    children,
    className,
    defaultActiveKey = 0,
    onChange,
    onTabClick,
    ...rest
  } = props;

  const [activeKey, setActiveKey] = useCustomControlValue({
    defaultValue: defaultActiveKey,
    onChange,
    value: activeKeyProp,
  });

  const tabItems = Children.map(children, (tabItem, index) => {
    if (!tabItem || tabItem.type !== TabItem) {
      return null;
    }

    const key = tabItem.key ?? index;
    const active = activeKey.toString() === key.toString();

    return cloneElement<TabItemProps>(tabItem, {
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
    <div {...rest} ref={ref} className={cx(classes.host, className)}>
      {tabItems}
    </div>
  );
});

export default Tab;
