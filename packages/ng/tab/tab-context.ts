import { InjectionToken, Signal } from '@angular/core';
import type { MznTabItem } from './tab-item.component';

/** Tabs 提供給子 TabItem 的共享狀態與方法。 */
export interface TabsContext {
  /** 實際生效的 active key（受控或非受控模式）。 */
  readonly resolvedActiveKey: Signal<string | number>;
  /** 子 TabItem 列表。 */
  readonly tabItems: Signal<readonly MznTabItem[]>;
  /** 處理 tab 點擊。 */
  handleTabClick(key: string | number, index: number): void;
}

/**
 * Tabs → TabItem 的 DI token。
 */
export const MZN_TABS_CONTEXT = new InjectionToken<TabsContext>(
  'MZN_TABS_CONTEXT',
);
