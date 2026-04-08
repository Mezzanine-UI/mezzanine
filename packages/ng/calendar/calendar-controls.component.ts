import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
} from '@mezzanine-ui/icons';
import { MznIcon } from '@mezzanine-ui/ng/icon';

/**
 * 日曆導覽控制列元件，含前/後一步、前/後一大步按鈕。
 *
 * @example
 * ```html
 * <div mznCalendarControls
 *   [showPrev]="true"
 *   [showNext]="true"
 *   (prev)="onPrev()"
 *   (next)="onNext()"
 * >
 *   <button>Jan</button>
 *   <button>2024</button>
 * </div>
 * ```
 */
@Component({
  selector: '[mznCalendarControls]',
  standalone: true,
  imports: [MznIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'controlsClass',
    '[attr.disableOnNext]': 'null',
    '[attr.disableOnDoubleNext]': 'null',
    '[attr.disableOnPrev]': 'null',
    '[attr.disableOnDoublePrev]': 'null',
    '[attr.showPrev]': 'null',
    '[attr.showDoublePrev]': 'null',
    '[attr.showNext]': 'null',
    '[attr.showDoubleNext]': 'null',
  },
  template: `
    <div [class]="actionsClass">
      @if (showDoublePrev()) {
        <button
          type="button"
          [class]="buttonClass"
          [disabled]="disableOnDoublePrev()"
          [attr.aria-disabled]="disableOnDoublePrev()"
          aria-label="Go to previous year"
          title="Previous Year"
          (click)="doublePrev.emit()"
        >
          <i mznIcon [icon]="doubleChevronLeftIcon"></i>
        </button>
      }
      @if (showPrev()) {
        <button
          type="button"
          [class]="buttonClass"
          [disabled]="disableOnPrev()"
          [attr.aria-disabled]="disableOnPrev()"
          aria-label="Go to previous month"
          title="Previous Month"
          (click)="prev.emit()"
        >
          <i mznIcon [icon]="chevronLeftIcon"></i>
        </button>
      }
      @if (!showPrev() && !showDoublePrev()) {
        <div [class]="buttonClass" style="pointer-events: none"></div>
      }
    </div>
    <div [class]="mainClass">
      <ng-content />
    </div>
    <div [class]="actionsClass">
      @if (showNext()) {
        <button
          type="button"
          [class]="buttonClass"
          [disabled]="disableOnNext()"
          [attr.aria-disabled]="disableOnNext()"
          aria-label="Go to next month"
          title="Next Month"
          (click)="next.emit()"
        >
          <i mznIcon [icon]="chevronRightIcon"></i>
        </button>
      }
      @if (showDoubleNext()) {
        <button
          type="button"
          [class]="buttonClass"
          [disabled]="disableOnDoubleNext()"
          [attr.aria-disabled]="disableOnDoubleNext()"
          aria-label="Go to next year"
          title="Next Year"
          (click)="doubleNext.emit()"
        >
          <i mznIcon [icon]="doubleChevronRightIcon"></i>
        </button>
      }
      @if (!showNext() && !showDoubleNext()) {
        <div [class]="buttonClass" style="pointer-events: none"></div>
      }
    </div>
  `,
})
export class MznCalendarControls {
  /** 是否禁用下一步。 */
  readonly disableOnNext = input(false);
  /** 是否禁用下一大步。 */
  readonly disableOnDoubleNext = input(false);
  /** 是否禁用上一步。 */
  readonly disableOnPrev = input(false);
  /** 是否禁用上一大步。 */
  readonly disableOnDoublePrev = input(false);
  /** 是否顯示上一步按鈕。 */
  readonly showPrev = input(false);
  /** 是否顯示上一大步按鈕。 */
  readonly showDoublePrev = input(false);
  /** 是否顯示下一步按鈕。 */
  readonly showNext = input(false);
  /** 是否顯示下一大步按鈕。 */
  readonly showDoubleNext = input(false);

  /** 上一步事件。 */
  readonly prev = output<void>();
  /** 上一大步事件。 */
  readonly doublePrev = output<void>();
  /** 下一步事件。 */
  readonly next = output<void>();
  /** 下一大步事件。 */
  readonly doubleNext = output<void>();

  protected readonly chevronLeftIcon = ChevronLeftIcon;
  protected readonly chevronRightIcon = ChevronRightIcon;
  protected readonly doubleChevronLeftIcon = DoubleChevronLeftIcon;
  protected readonly doubleChevronRightIcon = DoubleChevronRightIcon;

  protected readonly controlsClass = classes.controls;
  protected readonly actionsClass = classes.controlsActions;
  protected readonly buttonClass = classes.controlsButton;
  protected readonly mainClass = classes.controlsMain;
}
