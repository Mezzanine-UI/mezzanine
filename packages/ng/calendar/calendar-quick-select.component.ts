import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';
import { CheckedIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';

export interface CalendarQuickSelectOption {
  /** 選項唯一識別碼。 */
  readonly id: string;
  /** 顯示文字（對應 React 的 `name`）。 */
  readonly name: string;
  /** 是否禁用。 */
  readonly disabled?: boolean;
  /** 點擊事件。 */
  readonly onClick: () => void;
}

/**
 * 日曆快速選取面板元件，顯示一組快速選取按鈕。
 *
 * @example
 * ```html
 * <div mznCalendarQuickSelect
 *   [activeId]="activeQuickId"
 *   [options]="quickOptions"
 * ></div>
 * ```
 */
@Component({
  selector: '[mznCalendarQuickSelect]',
  standalone: true,
  imports: [MznIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
    '[attr.activeId]': 'null',
    '[attr.options]': 'null',
  },
  template: `
    @for (option of options(); track option.id) {
      <button
        type="button"
        [disabled]="option.disabled ?? false"
        [attr.aria-disabled]="option.disabled ?? false"
        [class]="getButtonClass(option.id)"
        (click)="option.onClick()"
      >
        <span>{{ option.name }}</span>
        @if (option.id === activeId()) {
          <i mznIcon [icon]="checkedIcon" [size]="16"></i>
        }
      </button>
    }
  `,
})
export class MznCalendarQuickSelect {
  /** 目前作用中選項的 id。 */
  readonly activeId = input<string | undefined>(undefined);

  /** 快速選取選項陣列。 */
  readonly options = input<ReadonlyArray<CalendarQuickSelectOption>>([]);

  protected readonly checkedIcon = CheckedIcon;
  protected readonly hostClass = classes.quickSelect;

  protected getButtonClass(id: string): string {
    return clsx(
      classes.quickSelectButton,
      id === this.activeId() && classes.quickSelectButtonActive,
    );
  }
}
