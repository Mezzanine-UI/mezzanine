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
import { TabItemProps } from './TabItem';
import { TabPaneProps } from './TabPane';
import useTabsOverflow from './useTabsOverflow';

export type TabsChild = ReactElement<TabPaneProps>;

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
   * Actions on the right side of tabBar
   */
  actions?: ReactNode;
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
const Tab = forwardRef<HTMLDivElement, TabProps>(function Tabs(
  props: TabProps,
  ref,
) {
  const {
    activeKey: activeKeyProp,
    actions,
    children,
    className,
    defaultActiveKey = 0,
    onChange,
    onTabClick,
    tabBarClassName,
    ...rest
  } = props;
  const tabsRef = useRef(null);

  const [activeKey, setActiveKey] = useCustomControlValue({
    defaultValue: defaultActiveKey,
    onChange,
    value: activeKeyProp,
  });

  const tabs = Children.map(children, (tabPane, index) => {
    const key = tabPane.key ?? index;
    const { tab } = tabPane.props;
    const active = activeKey.toString() === key.toString();

    return cloneElement<TabItemProps>(tab, {
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

  let pane: ReactNode | undefined;
  Children.forEach(children, (tabPane, index) => {
    const child = tabPane as TabsChild;
    const key = child.key ?? index;

    if (activeKey.toString() === key.toString()) {
      pane = child;
    }
  });

  const {
    isOverflowing,
    isScrollToBegin,
    isScrollToEnd,
    scrollToLeft,
    scrollToRight,
  } = useTabsOverflow(tabsRef);

  return (
    <div {...rest} ref={ref} className={cx(classes.host, className)}>
      <div className={cx(classes.tabBar, tabBarClassName)}>
        <div className={classes.overflow}>
          {isOverflowing && !isScrollToBegin && (
            <button
              aria-label="scrollToLeft"
              className={classes.scrollBtn}
              onClick={() => scrollToLeft()}
              type="button"
            >
              <Icon icon={ChevronLeftIcon} />
            </button>
          )}
          <div ref={tabsRef} className={classes.tab}>
            {tabs}
          </div>
          {isOverflowing && !isScrollToEnd && (
            <button
              aria-label="scrollToRight"
              className={classes.scrollBtn}
              onClick={() => scrollToRight()}
              type="button"
            >
              <Icon icon={ChevronRightIcon} />
            </button>
          )}
        </div>
        {actions}
      </div>
      {pane}
    </div>
  );
});

export default Tab;
