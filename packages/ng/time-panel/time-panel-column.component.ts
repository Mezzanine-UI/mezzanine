import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  TimePanelUnit,
  timePanelClasses as classes,
} from '@mezzanine-ui/core/time-panel';
import { scrollbarClasses } from '@mezzanine-ui/core/scrollbar';
import { getCSSVariablePixelValue } from '@mezzanine-ui/ng/utils';
import clsx from 'clsx';

/**
 * 時間面板的單一欄位元件（時/分/秒），可滾動選取。
 *
 * @example
 * ```html
 * <div mznTimePanelColumn
 *   [units]="hourUnits"
 *   [activeUnit]="currentHour"
 *   (unitChanged)="onHourChange($event)"
 * ></div>
 * ```
 */
@Component({
  selector: '[mznTimePanelColumn]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'columnClass',
    '[attr.units]': 'null',
    '[attr.activeUnit]': 'null',
    '[attr.cellHeight]': 'null',
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
export class MznTimePanelColumn {
  private readonly destroyRef = inject(DestroyRef);

  /** 可選單位列表。 */
  readonly units = input.required<ReadonlyArray<TimePanelUnit>>();

  /** 目前選取值。 */
  readonly activeUnit = input<number | undefined>(undefined);

  /**
   * 每個儲存格的高度（px），用於控制捲動位置。
   * 預設從 CSS variable `--mzn-spacing-size-element-loose` 讀取，
   * 與 React `TimePanelColumn` 的行為一致。
   */
  readonly cellHeight = input(
    getCSSVariablePixelValue('--mzn-spacing-size-element-loose', 32),
  );

  /** 單位變更事件。 */
  readonly unitChanged = output<TimePanelUnit>();
  protected readonly paddings = [0, 1, 2]; // 3 placeholder cells

  protected readonly columnClass = classes.column;
  protected readonly scrollClass = scrollbarClasses.host;
  protected readonly placeholderClass = classes.columnPlaceholder;

  private readonly scrollContainer =
    viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  /**
   * 首次捲動使用 'auto'（瞬間），後續使用 'smooth'（平滑動畫），
   * 對齊 React 的 preferSmoothScrollRef 行為。
   */
  private firstScroll = true;
  private scrollTimerId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      this.activeUnit(); // track
      this.scheduleScroll();
    });

    this.destroyRef.onDestroy(() => {
      if (this.scrollTimerId !== null) clearTimeout(this.scrollTimerId);
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

  /**
   * 排程捲動到選取項目。使用 requestAnimationFrame 確保容器已完成 layout
   * （對齊 React useEffect 的 post-paint 時序），避免在 display:none
   * 的 Popper 中呼叫 scrollTo 無效的問題。
   */
  private scheduleScroll(): void {
    if (this.scrollTimerId !== null) {
      clearTimeout(this.scrollTimerId);
      this.scrollTimerId = null;
    }

    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;

    const active = this.activeUnit();
    if (active === undefined) return;

    const units = this.units();
    const idx = units.findIndex((u) => u.value === active);
    if (idx < 0) return;

    const top = idx * this.cellHeight();
    const behavior: ScrollBehavior = this.firstScroll ? 'auto' : 'smooth';

    this.scrollTimerId = setTimeout(() => {
      container.scrollTo({ behavior, top });
      this.firstScroll = false;
      this.scrollTimerId = null;
    });
  }
}
