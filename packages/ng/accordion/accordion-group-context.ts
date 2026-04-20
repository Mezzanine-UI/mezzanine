import { InjectionToken } from '@angular/core';
import type { MznAccordion } from './accordion.component';

/** AccordionGroup 對子 Accordion 暴露的協調 API。 */
export interface AccordionGroupControl {
  /** 是否啟用互斥展開模式。 */
  readonly exclusive: boolean;
  /** 群組統一尺寸，優先於子 Accordion 自身的 size 設定。 */
  readonly size: 'main' | 'sub';
  /** 子 Accordion 呼叫此方法，通知群組某個 Accordion 被展開。 */
  onAccordionExpand(accordion: MznAccordion): void;
}

/** AccordionGroup 協調上下文 InjectionToken。 */
export const MZN_ACCORDION_GROUP = new InjectionToken<AccordionGroupControl>(
  'MZN_ACCORDION_GROUP',
);
