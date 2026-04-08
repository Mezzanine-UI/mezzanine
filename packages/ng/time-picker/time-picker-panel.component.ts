import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
} from '@angular/core';
import { DateType } from '@mezzanine-ui/core/calendar';
import { MznPopper } from '@mezzanine-ui/ng/popper';
import { MznTimePanel } from '@mezzanine-ui/ng/time-panel';

/**
 * 時間選擇面板元件，將 `MznTimePanel` 包裹在 `MznPopper` 浮動層中。
 *
 * 可獨立使用，也可由 `MznTimePicker` 內部使用。
 * 面板的開關、錨點元素、顯示值與步長均透過 inputs 控制。
 *
 * @example
 * ```html
 * import { MznTimePickerPanel } from '@mezzanine-ui/ng/time-picker';
 *
 * <button #anchor>Open</button>
 * <mzn-time-picker-panel
 *   [anchor]="anchor"
 *   [open]="isOpen"
 *   [value]="pendingTime"
 *   (timeChanged)="onTimeChange($event)"
 *   (confirmed)="onConfirm()"
 *   (cancelled)="onCancel()"
 * />
 * ```
 *
 * @see {@link MznTimePicker} 時間選擇器元件
 * @see {@link MznTimePanel} 時間面板元件
 */
@Component({
  selector: 'mzn-time-picker-panel',
  standalone: true,
  imports: [MznPopper, MznTimePanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      mznPopper
      [anchor]="anchor()"
      [open]="open()"
      placement="bottom-start"
      [offsetOptions]="{ mainAxis: 4 }"
    >
      <mzn-time-panel
        [value]="value()"
        [hideHour]="hideHour()"
        [hideMinute]="hideMinute()"
        [hideSecond]="hideSecond()"
        [hourStep]="hourStep()"
        [minuteStep]="minuteStep()"
        [secondStep]="secondStep()"
        (timeChanged)="timeChanged.emit($event)"
        (confirmed)="confirmed.emit()"
        (cancelled)="cancelled.emit()"
      />
    </div>
  `,
})
export class MznTimePickerPanel {
  /**
   * 錨定（觸發）元素，Popper 將定位於此元素附近。
   * @default null
   */
  readonly anchor = input<HTMLElement | ElementRef<HTMLElement> | null>(null);

  /**
   * 是否隱藏小時欄。
   * @default false
   */
  readonly hideHour = input(false);

  /**
   * 是否隱藏分鐘欄。
   * @default false
   */
  readonly hideMinute = input(false);

  /**
   * 是否隱藏秒鐘欄。
   * @default false
   */
  readonly hideSecond = input(false);

  /**
   * 小時步長。
   * @default 1
   */
  readonly hourStep = input(1);

  /**
   * 分鐘步長。
   * @default 1
   */
  readonly minuteStep = input(1);

  /**
   * 是否顯示面板。
   * @default false
   */
  readonly open = input(false);

  /**
   * 秒鐘步長。
   * @default 1
   */
  readonly secondStep = input(1);

  /**
   * 面板顯示的時間值。
   */
  readonly value = input<DateType | undefined>(undefined);

  /** 使用者取消選擇時發出。 */
  readonly cancelled = output<void>();

  /** 使用者確認選擇時發出。 */
  readonly confirmed = output<void>();

  /** 面板中時間變更時發出，攜帶新的 `DateType` 值。 */
  readonly timeChanged = output<DateType>();
}
