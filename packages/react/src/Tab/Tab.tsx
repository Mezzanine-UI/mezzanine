import {
  Children,
  cloneElement,
  CSSProperties,
  forwardRef,
  Key,
  MouseEvent,
  ReactElement,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { tabClasses as classes } from '@mezzanine-ui/core/tab';
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
   * Current TabItem's index
   */
  activeKey?: Key;
  /**
   * The TabItems in tab
   */
  children: TabsChild | TabsChild[];
  /**
   * Initial active TabItem's key, if activeKey is not set.
   */
  defaultActiveKey?: Key;
  /**
   * The direction of tab
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * The change event handler of Tab
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
    direction = 'horizontal',
    ...rest
  } = props;

  const [activeKey, setActiveKey] = useCustomControlValue({
    defaultValue: defaultActiveKey,
    onChange,
    value: activeKeyProp,
  });

  const activeTabItemRef = useRef<HTMLDivElement>(null);

  const tabItems = Children.map(children, (tabItem, index) => {
    if (!tabItem || tabItem.type !== TabItem) {
      return null;
    }

    const key = tabItem.key ?? index;
    const active = activeKey.toString() === key.toString();

    return cloneElement<TabItemProps & { ref?: React.Ref<HTMLDivElement> }>(
      tabItem,
      {
        key,
        active,
        ref: active ? activeTabItemRef : undefined,
        onClick: (event) => {
          if (!active) {
            setActiveKey(key);
          }

          if (onTabClick) {
            onTabClick(key, event);
          }
        },
      },
    );
  });

  // get active TabItem left and width for activeBar position
  const [activeBarStyle, setActiveBarStyle] = useState<CSSProperties>({
    '--active-bar-length': '0px',
    '--active-bar-shift': '0px',
  } as CSSProperties);

  useLayoutEffect(() => {
    const activeTabElement = activeTabItemRef.current;

    if (activeTabElement) {
      const { offsetLeft, offsetWidth, offsetTop, offsetHeight } =
        activeTabElement;

      setActiveBarStyle({
        '--active-bar-length':
          direction === 'horizontal' ? `${offsetWidth}px` : `${offsetHeight}px`,
        '--active-bar-shift':
          direction === 'horizontal' ? `${offsetLeft}px` : `${offsetTop}px`,
      } as CSSProperties);
    }
  }, [activeKey, direction]);

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(
        classes.host,
        {
          [classes.tabHorizontal]: direction === 'horizontal',
          [classes.tabVertical]: direction === 'vertical',
        },
        className,
      )}
    >
      {tabItems}
      <div className={classes.tabActiveBar} style={activeBarStyle} />
    </div>
  );
});

export default Tab;
