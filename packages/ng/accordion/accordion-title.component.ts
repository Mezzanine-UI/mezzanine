import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { accordionClasses as classes } from '@mezzanine-ui/core/accordion';
import { ChevronRightIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { AccordionControl, MZN_ACCORDION_CONTROL } from './accordion-control';

/**
 * 手風琴標題元件，點擊可展開/收合對應的 AccordionContent。
 *
 * 自動從 `MZN_ACCORDION_CONTROL` 讀取展開與禁用狀態。
 * 右側可透過 `<ng-content select="[actions]">` 投射操作按鈕。
 *
 * @example
 * ```html
 * <mzn-accordion-title>
 *   標題文字
 *   <div actions>
 *     <button>操作</button>
 *   </div>
 * </mzn-accordion-title>
 * ```
 */
@Component({
  selector: 'mzn-accordion-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon],
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <button
      [class]="mainPartClass"
      [disabled]="control?.disabled"
      [attr.aria-expanded]="control?.expanded"
      type="button"
      (click)="onToggle($event)"
    >
      <i mznIcon [class]="iconClasses()" [icon]="chevronIcon" [size]="16"></i>
      <ng-content />
    </button>
    <ng-content select="[actions]" />
  `,
})
export class MznAccordionTitle {
  protected readonly control = inject<AccordionControl>(MZN_ACCORDION_CONTROL, {
    optional: true,
  });
  protected readonly chevronIcon = ChevronRightIcon;
  protected readonly mainPartClass = classes.titleMainPart;

  protected readonly hostClasses = computed((): string =>
    clsx(classes.title, {
      [classes.titleExpanded]: this.control?.expanded,
      [classes.titleDisabled]: this.control?.disabled,
    }),
  );

  protected readonly iconClasses = computed((): string =>
    clsx(classes.titleIcon, {
      [classes.titleIconDisabled]: this.control?.disabled,
      [classes.titleIconExpanded]: this.control?.expanded,
    }),
  );

  protected onToggle(event: MouseEvent): void {
    event.stopPropagation();

    if (this.control && !this.control.disabled) {
      this.control.toggleExpanded(!this.control.expanded);
    }
  }
}
