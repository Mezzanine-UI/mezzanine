import type { TabKey } from './tab-context';

export interface TabProps {
  /**
   * Current TabItem's index
   */
  activeKey?: TabKey;
  /**
   * Initial active TabItem's key, if activeKey is not set.
   */
  defaultActiveKey?: TabKey;
  /**
   * The direction of tab
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * The size of tab, controls padding around the tab group.
   * main: padding-horizontal-spacious + padding-vertical-spacious (top only)
   * sub: no padding
   * @default 'main'
   */
  size?: 'main' | 'sub';
}
