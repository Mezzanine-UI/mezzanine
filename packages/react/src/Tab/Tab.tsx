import {
  Children,
  cloneElement,
  CSSProperties,
  forwardRef,
  Key,
  ReactElement,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { tabClasses as classes } from '@mezzanine-ui/core/tab';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import TabItem, { TabItemProps } from './TabItem';
import { flattenChildren } from '../utils/flatten-children';

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
  onChange?: (activeKey: Key, index: number) => void;
  /**
   * The size of tab, controls padding around the tab group.
   * main: padding-horizontal-spacious + padding-vertical-spacious (top only)
   * sub: no padding
   * @default 'main'
   */
  size?: 'main' | 'sub';
}

/**
 * 頁籤導航元件，透過底部滑動指示條標示當前選取的頁籤。
 *
 * 以 `TabItem` 作為子元件定義每個頁籤項目，支援水平（`horizontal`）與垂直（`vertical`）
 * 兩種排列方向。可透過 `activeKey`（受控）或 `defaultActiveKey`（非受控）指定當前頁籤，
 * `onChange` 回呼在切換時接收新的 `activeKey` 與索引。
 *
 * @example
 * ```tsx
 * import Tab from '@mezzanine-ui/react/Tab';
 * import TabItem from '@mezzanine-ui/react/TabItem';
 *
 * // 基本用法（非受控）
 * <Tab defaultActiveKey="home">
 *   <TabItem key="home">首頁</TabItem>
 *   <TabItem key="profile">個人資料</TabItem>
 *   <TabItem key="settings">設定</TabItem>
 * </Tab>
 *
 * // 受控用法
 * const [activeKey, setActiveKey] = useState<Key>('tab1');
 * <Tab activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
 *   <TabItem key="tab1">頁籤一</TabItem>
 *   <TabItem key="tab2">頁籤二</TabItem>
 * </Tab>
 *
 * // 垂直方向
 * <Tab direction="vertical" size="sub">
 *   <TabItem key="a">分類 A</TabItem>
 *   <TabItem key="b">分類 B</TabItem>
 * </Tab>
 * ```
 *
 * @see {@link TabItem} 頁籤項目元件
 */
const Tab = forwardRef<HTMLDivElement, TabProps>(function Tab(
  props: TabProps,
  ref,
) {
  const {
    activeKey: activeKeyProp,
    children,
    className,
    defaultActiveKey = 0,
    direction = 'horizontal',
    onChange,
    size = 'main',
    ...rest
  } = props;

  const [activeKeyInternal, setActiveKey] = useState(defaultActiveKey);
  const activeKey = activeKeyProp ?? activeKeyInternal;

  const activeTabItemRef = useRef<HTMLButtonElement>(null);

  const flattenedChildren = useMemo(
    () => flattenChildren(children),
    [children],
  );

  const tabItems = Children.map(
    flattenedChildren as TabProps['children'],
    (tabItem, index) => {
      if (!tabItem || tabItem.type !== TabItem) {
        return null;
      }

      const key = tabItem.key ?? index;
      const active = activeKey === key;

      return cloneElement<
        TabItemProps & { ref?: React.Ref<HTMLButtonElement> }
      >(tabItem, {
        key,
        active,
        ref: active ? activeTabItemRef : undefined,
        onClick: (event) => {
          if (!active) {
            setActiveKey(key);
            onChange?.(key, index);
          }

          tabItem.props.onClick?.(event);
        },
      });
    },
  );

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
          [classes.tabSizeMain]: size === 'main',
          [classes.tabSizeSub]: size === 'sub',
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
