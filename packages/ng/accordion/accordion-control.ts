import { InjectionToken } from '@angular/core';

/** Accordion 控制上下文介面，供子元件讀取展開/禁用狀態。 */
export interface AccordionControl {
  readonly disabled: boolean;
  readonly expanded: boolean;
  toggleExpanded(value: boolean): void;
}

/** Accordion 控制上下文 InjectionToken。 */
export const MZN_ACCORDION_CONTROL = new InjectionToken<AccordionControl>(
  'MZN_ACCORDION_CONTROL',
);
