import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
} from '@angular/core';
import { accordionClasses as classes } from '@mezzanine-ui/core/accordion';
import { ChevronRightIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznRotate } from '@mezzanine-ui/ng/transition';
import { AccordionControl, MZN_ACCORDION_CONTROL } from './accordion-control';

/**
 * 手風琴標題元件，點擊可展開/收合對應的 AccordionContent。
 *
 * 自動從 `MZN_ACCORDION_CONTROL` 讀取展開與禁用狀態，並在 init 時將
 * host 的 `id` 屬性註冊到 control，讓兄弟 AccordionContent 能透過
 * `${id}-content` 形成 a11y 連動（aria-controls / aria-labelledby）。
 *
 * 右側可透過 `<ng-content select="[actions]">` 投射操作按鈕。
 *
 * @example
 * ```html
 * <div mznAccordionTitle id="faq-1">
 *   標題文字
 *   <div actions>
 *     <button>操作</button>
 *   </div>
 * </div>
 * ```
 */
@Component({
  selector: '[mznAccordionTitle]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon, MznRotate],
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <button
      [class]="mainPartClass"
      [disabled]="control?.disabled"
      [attr.aria-expanded]="control?.expanded"
      [attr.aria-controls]="control?.contentId"
      type="button"
      (click)="onToggle($event)"
    >
      <i
        mznIcon
        mznRotate
        [class]="iconClasses()"
        [icon]="chevronIcon"
        [size]="16"
        [in]="!!control?.expanded"
        [degrees]="-90"
      ></i>
      <ng-content />
    </button>
    <ng-content select="[actions]" />
  `,
})
export class MznAccordionTitle implements OnInit {
  protected readonly control = inject<AccordionControl>(MZN_ACCORDION_CONTROL, {
    optional: true,
  });
  private readonly elementRef = inject(ElementRef<HTMLElement>);
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
    }),
  );

  ngOnInit(): void {
    const hostId = this.elementRef.nativeElement.getAttribute('id');

    this.control?.setTitleId(hostId);
  }

  protected onToggle(event: MouseEvent): void {
    event.stopPropagation();

    if (this.control && !this.control.disabled) {
      this.control.toggleExpanded(!this.control.expanded);
    }
  }
}
