import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { accordionClasses as classes } from '@mezzanine-ui/core/accordion';
import { AccordionControl, MZN_ACCORDION_CONTROL } from './accordion-control';

/**
 * 手風琴內容元件。實際的展開/收合渲染由父層 `MznAccordion` 控制
 * （條件式 mount 整棵 wrapper 樹），本元件只負責標記 host 為內容 region，
 * 並依 control 的 titleId 衍生 a11y 連動屬性
 * （`id` / `aria-labelledby`）。
 *
 * @example
 * ```html
 * <div mznAccordionContent>
 *   <p>展開後顯示的內容。</p>
 * </div>
 * ```
 */
@Component({
  selector: '[mznAccordionContent]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'contentClass',
    '[attr.id]': 'control?.contentId',
    '[attr.aria-labelledby]': 'control?.titleId',
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
