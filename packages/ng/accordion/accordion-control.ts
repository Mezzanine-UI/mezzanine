import { InjectionToken } from '@angular/core';

/** Accordion 控制上下文介面，供子元件讀取展開/禁用狀態與 a11y id 連動。 */
export interface AccordionControl {
  readonly disabled: boolean;
  readonly expanded: boolean;
  /** AccordionTitle 的 id（鏡像 React useContext titleId）。 */
  readonly titleId: string | null;
  /** AccordionContent 的 id，由 titleId 衍生為 `${titleId}-content`。 */
  readonly contentId: string | null;
  toggleExpanded(value: boolean): void;
  /** 由 AccordionTitle 在 ngOnInit 時呼叫，將 host id 註冊到 control。 */
  setTitleId(id: string | null): void;
}

/** Accordion 控制上下文 InjectionToken。 */
export const MZN_ACCORDION_CONTROL = new InjectionToken<AccordionControl>(
  'MZN_ACCORDION_CONTROL',
);
