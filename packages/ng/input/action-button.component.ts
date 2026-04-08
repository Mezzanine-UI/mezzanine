import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { inputActionButtonClasses as classes } from '@mezzanine-ui/core/input';
import { CopyIcon } from '@mezzanine-ui/icons';
import type { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';

/**
 * 動作按鈕元件，常搭配 Input 使用（如複製、自訂動作）。
 *
 * 預設顯示 CopyIcon 與 "Copy" 文字，可透過 `icon` 與 `label` 自訂。
 *
 * @example
 * ```html
 * import { MznInputActionButton } from '@mezzanine-ui/ng/input';
 *
 * <mzn-input-action-button />
 * <mzn-input-action-button [icon]="CustomIcon" label="Download" />
 * ```
 */
@Component({
  selector: 'mzn-input-action-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon],
  host: {
    style: 'display: contents',
  },
  template: `
    <button
      type="button"
      [class]="hostClasses()"
      [disabled]="disabled()"
      [title]="label()"
      (click)="clicked.emit()"
    >
      <i mznIcon [class]="iconClass" [icon]="resolvedIcon()" [size]="16"></i>
      <span [class]="textClass">{{ label() }}</span>
    </button>
  `,
})
export class MznInputActionButton {
  protected readonly iconClass = classes.icon;
  protected readonly textClass = classes.text;

  /**
   * 是否停用。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 按鈕圖示。
   * @default CopyIcon
   */
  readonly icon = input<IconDefinition>();

  /**
   * 按鈕標籤文字。
   * @default 'Copy'
   */
  readonly label = input('Copy');

  /**
   * 按鈕尺寸。
   * @default 'main'
   */
  readonly size = input<'main' | 'sub'>('main');

  /** 點擊事件。 */
  readonly clicked = output<void>();

  protected readonly resolvedIcon = computed(
    (): IconDefinition => this.icon() ?? CopyIcon,
  );

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.host,
      this.disabled() && classes.disabled,
      this.size() === 'main' ? classes.main : classes.sub,
    ),
  );
}
