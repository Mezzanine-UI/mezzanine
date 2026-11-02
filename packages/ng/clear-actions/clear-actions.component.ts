import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import {
  clearActionsClasses as classes,
  ClearActionsEmbeddedVariant,
  ClearActionsStandardVariant,
  ClearActionsType,
  ClearActionsVariant,
} from '@mezzanine-ui/core/clear-actions';
import { CloseIcon, DangerousFilledIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';

/**
 * 清除操作按鈕元件，提供關閉或清除功能。
 *
 * 根據 `type` 決定圖示與視覺樣式：
 * - `standard`：使用 CloseIcon，支援 `base` / `inverse` 變體
 * - `embedded`：使用 CloseIcon，支援 `contrast` / `emphasis` 變體
 * - `clearable`：使用 DangerousFilledIcon
 *
 * @example
 * ```html
 * import { MznClearActions } from '@mezzanine-ui/ng/clear-actions';
 *
 * <button mznClearActions (clicked)="onClose()" ></button>
 * <button mznClearActions type="embedded" variant="contrast" (clicked)="onClose()" ></button>
 * <button mznClearActions type="clearable" (clicked)="onClear()" ></button>
 * ```
 */
@Component({
  selector: 'button[mznClearActions]',
  host: {
    '[attr.type]': "'button'",
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.variant]': 'null',
    '[class]': 'hostClasses()',
    '(click)': 'clicked.emit($event)',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon],
  template: `
    @if (type() === 'clearable') {
      <i mznIcon [class]="iconClass" [icon]="dangerousIcon"></i>
    } @else {
      <i mznIcon [class]="iconClass" [icon]="closeIcon"></i>
    }
  `,
})
export class MznClearActions {
  protected readonly closeIcon = CloseIcon;
  protected readonly dangerousIcon = DangerousFilledIcon;
  protected readonly iconClass = classes.icon;

  /**
   * 點擊事件。
   */
  readonly clicked = output<MouseEvent>();

  /**
   * 清除操作類型。
   * @default 'standard'
   */
  readonly type = input<ClearActionsType>('standard');

  /**
   * Accessible name of the button; callers may override it.
   * @default 'Close'
   */
  readonly ariaLabel = input<string>('Close', { alias: 'aria-label' });

  /**
   * 視覺變體，依 type 而定。
   * - standard: 'base' | 'inverse'
   * - embedded: 'contrast' | 'emphasis'
   */
  readonly variant = input<
    ClearActionsEmbeddedVariant | ClearActionsStandardVariant
  >();

  protected readonly resolvedVariant = computed((): ClearActionsVariant => {
    const t = this.type();

    if (t === 'clearable') return 'default';

    const v = this.variant();

    return v ?? (t === 'standard' ? 'base' : 'contrast');
  });

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.host,
      classes.type(this.type()),
      classes.variant(this.resolvedVariant()),
    ),
  );
}
