import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  forwardRef,
  input,
} from '@angular/core';
import { accordionGroupClasses as classes } from '@mezzanine-ui/core/accordion';
import {
  AccordionGroupControl,
  MZN_ACCORDION_GROUP,
} from './accordion-group-context';
import { MznAccordion } from './accordion.component';

/**
 * 手風琴群組元件，管理多個 `MznAccordion` 的容器。
 *
 * 設定 `exclusive` 後，同一時間只允許一個 Accordion 展開。
 *
 * @example
 * ```html
 * import { MznAccordionGroup } from '@mezzanine-ui/ng/accordion';
 *
 * <mzn-accordion-group [exclusive]="true">
 *   <mzn-accordion>...</mzn-accordion>
 *   <mzn-accordion>...</mzn-accordion>
 * </mzn-accordion-group>
 * ```
 */
@Component({
  selector: 'mzn-accordion-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MZN_ACCORDION_GROUP,
      useFactory: (group: MznAccordionGroup): AccordionGroupControl => ({
        get exclusive(): boolean {
          return group.exclusive();
        },
        get size(): 'main' | 'sub' {
          return group.size();
        },
        onAccordionExpand(accordion: MznAccordion): void {
          group.handleAccordionExpand(accordion);
        },
      }),
      deps: [forwardRef(() => MznAccordionGroup)],
    },
  ],
  host: {
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class MznAccordionGroup {
  /**
   * 群組內手風琴尺寸。
   * @default 'main'
   */
  readonly size = input<'main' | 'sub'>('main');

  /**
   * 是否啟用互斥模式——同一時間只能展開一個 Accordion。
   * @default false
   */
  readonly exclusive = input(false);

  protected readonly hostClass = classes.host;

  /** 查詢所有子 MznAccordion。 */
  private readonly accordions = contentChildren(MznAccordion, {
    descendants: true,
  });

  /** 當某個 Accordion 展開時，若 exclusive=true，關閉其他已展開的 Accordion。 */
  handleAccordionExpand(expandedAccordion: MznAccordion): void {
    if (!this.exclusive()) return;

    this.accordions().forEach((accordion) => {
      if (accordion !== expandedAccordion && accordion.resolvedExpanded()) {
        accordion.onToggle(false);
      }
    });
  }
}
