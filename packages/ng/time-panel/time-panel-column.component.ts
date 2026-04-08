import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  TimePanelUnit,
  timePanelClasses as classes,
} from '@mezzanine-ui/core/time-panel';
import { scrollbarClasses } from '@mezzanine-ui/core/scrollbar';
import clsx from 'clsx';

/**
 * 時間面板的單一欄位元件（時/分/秒），可滾動選取。
 *
 * @example
 * ```html
 * <mzn-time-panel-column
 *   [units]="hourUnits"
 *   [activeUnit]="currentHour"
 *   (unitChanged)="onHourChange($event)"
 * />
 * ```
 */
@Component({
  selector: 'mzn-time-panel-column',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'columnClass',
  },
  template: `
    <div
      #scrollContainer
      [class]="scrollClass"
      [style.max-height.px]="cellHeight() * 7"
      style="overflow-y: auto"
    >
      @for (ph of paddings; track $index) {
        <div
          [class]="placeholderClass"
          [style.height.px]="cellHeight()"
          aria-hidden="true"
        ></div>
      }
      @for (unit of units(); track unit.value) {
        <button
          type="button"
          [class]="getButtonClass(unit)"
          (click)="onSelect(unit)"
          >{{ unit.label }}</button
        >
      }
      @for (ph of paddings; track $index) {
        <div
          [class]="placeholderClass"
          [style.height.px]="cellHeight()"
          aria-hidden="true"
        ></div>
      }
    </div>
  `,
})
export class MznTimePanelColumn implements AfterViewInit {
  /** 可選單位列表。 */
  readonly units = input.required<ReadonlyArray<TimePanelUnit>>();

  /** 目前選取值。 */
  readonly activeUnit = input<number | undefined>(undefined);

  /**
   * 每個儲存格的高度（px），用於控制捲動位置。
   * @default 32
   */
  readonly cellHeight = input(32);

  /** 單位變更事件。 */
  readonly unitChanged = output<TimePanelUnit>();
  protected readonly paddings = [0, 1, 2]; // 3 placeholder cells

  protected readonly columnClass = classes.column;
  protected readonly scrollClass = scrollbarClasses.host;
  protected readonly placeholderClass = classes.columnPlaceholder;

  private readonly scrollContainer =
    viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  ngAfterViewInit(): void {
    this.scrollToActive('auto');
  }

  constructor() {
    effect(() => {
      this.activeUnit(); // track
      this.scrollToActive('smooth');
    });
  }

  protected getButtonClass(unit: TimePanelUnit): string {
    return clsx(classes.button, classes.columnButton, {
      [classes.buttonActive]: unit.value === this.activeUnit(),
    });
  }

  protected onSelect(unit: TimePanelUnit): void {
    this.unitChanged.emit(unit);
  }

  private scrollToActive(behavior: ScrollBehavior): void {
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;

    const active = this.activeUnit();
    if (active === undefined) return;

    const units = this.units();
    const idx = units.findIndex((u) => u.value === active);
    if (idx < 0) return;

    const height = this.cellHeight();

    if (typeof container.scrollTo === 'function') {
      container.scrollTo({
        behavior,
        top: idx * height,
      });
    } else {
      container.scrollTop = idx * height;
    }
  }
}
