import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { accordionClasses as classes } from '@mezzanine-ui/core/accordion';
import { AccordionControl, MZN_ACCORDION_CONTROL } from './accordion-control';

/**
 * 手風琴內容元件，根據 `MZN_ACCORDION_CONTROL` 的展開狀態顯示或隱藏。
 *
 * @example
 * ```html
 * <mzn-accordion-content>
 *   <p>展開後顯示的內容。</p>
 * </mzn-accordion-content>
 * ```
 */
@Component({
  selector: 'mzn-accordion-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'contentClass',
    '[style.display]': 'control?.expanded ? null : "none"',
    role: 'region',
  },
  template: `<ng-content />`,
})
export class MznAccordionContent {
  protected readonly control = inject<AccordionControl>(MZN_ACCORDION_CONTROL, {
    optional: true,
  });
  protected readonly contentClass = classes.content;
}
