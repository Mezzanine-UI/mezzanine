import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { inputSpinnerButtonClasses as classes } from '@mezzanine-ui/core/input';
import { CaretDownFlatIcon, CaretUpFlatIcon } from '@mezzanine-ui/icons';
import type { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';

/**
 * 數字微調按鈕元件，提供上/下箭頭，搭配數字輸入框使用。
 *
 * `type` 決定方向：`'up'` 顯示向上箭頭，`'down'` 顯示向下箭頭。
 *
 * @example
 * ```html
 * import { MznInputSpinnerButton } from '@mezzanine-ui/ng/input';
 *
 * <div mznInputSpinnerButton type="up" (clicked)="onIncrement()" ></div>
 * <div mznInputSpinnerButton type="down" (clicked)="onDecrement()" ></div>
 * ```
 */
@Component({
  selector: '[mznInputSpinnerButton]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon],
  host: {
    style: 'display: contents',
    '[attr.disabled]': 'null',
    '[attr.size]': 'null',
    '[attr.type]': 'null',
  },
  template: `
    <button
      type="button"
      [class]="hostClasses()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel()"
      [title]="ariaLabel()"
      (click)="clicked.emit()"
    >
      <i mznIcon aria-hidden="true" [icon]="resolvedIcon()"></i>
    </button>
  `,
})
export class MznInputSpinnerButton {
  /**
   * 是否停用。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 按鈕尺寸。
   * @default 'main'
   */
  readonly size = input<'main' | 'sub'>('main');

  /**
   * 按鈕方向類型。
   */
  readonly type = input.required<'up' | 'down'>();

  /** 點擊事件。 */
  readonly clicked = output<void>();

  protected readonly resolvedIcon = computed(
    (): IconDefinition =>
      this.type() === 'up' ? CaretUpFlatIcon : CaretDownFlatIcon,
  );

  protected readonly ariaLabel = computed((): string =>
    this.type() === 'up' ? 'Increase value' : 'Decrease value',
  );

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.host,
      this.disabled() && classes.disabled,
      this.size() === 'main' ? classes.main : classes.sub,
    ),
  );
}
