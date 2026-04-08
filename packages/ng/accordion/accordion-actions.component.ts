import { ChangeDetectionStrategy, Component } from '@angular/core';
import { accordionClasses as classes } from '@mezzanine-ui/core/accordion';

/**
 * 手風琴操作列元件，用於在 `MznAccordionTitle` 中放置操作按鈕。
 *
 * 僅允許投影 `MznButton` 或 `MznDropdown` 作為子元素。
 *
 * @example
 * ```html
 * import { MznAccordionActions } from '@mezzanine-ui/ng/accordion';
 * import { MznButton } from '@mezzanine-ui/ng/button';
 *
 * <mzn-accordion>
 *   <mzn-accordion-title>
 *     標題
 *     <mzn-accordion-actions>
 *       <button mzn-button variant="outlined">編輯</button>
 *     </mzn-accordion-actions>
 *   </mzn-accordion-title>
 *   <mzn-accordion-content>內容</mzn-accordion-content>
 * </mzn-accordion>
 * ```
 *
 * @see MznAccordionTitle
 */
@Component({
  selector: 'mzn-accordion-actions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class MznAccordionActions {
  protected readonly hostClass = classes.titleActions;
}
