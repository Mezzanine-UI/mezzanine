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
 * <div mznAccordion>
 *   <div mznAccordionTitle>
 *     標題
 *     <div mznAccordionActions>
 *       <button mzn-button variant="outlined">編輯</button>
 *     </div>
 *   </div>
 *   <div mznAccordionContent>內容</div>
 * </div>
 * ```
 *
 * @see MznAccordionTitle
 */
@Component({
  selector: '[mznAccordionActions]',
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
