import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  formFieldClasses as classes,
  formHintIcons,
} from '@mezzanine-ui/core/form';
import { IconDefinition } from '@mezzanine-ui/icons';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';

/**
 * 表單提示文字元件，顯示於輸入欄位下方。
 *
 * @example
 * ```html
 * <span mznFormHintText hintText="請輸入有效的電子郵件" severity="error" ></span>
 * ```
 */
@Component({
  selector: '[mznFormHintText]',
  host: {
    '[class]': 'hostClasses()',
    '[attr.hintText]': 'null',
    '[attr.hintTextIcon]': 'null',
    '[attr.severity]': 'null',
    '[attr.showHintTextIcon]': 'null',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon],
  template: `
    @if (showHintTextIcon()) {
      @if (resolvedIcon(); as icon) {
        <i
          mznIcon
          [class]="classes.hintTextIcon"
          [color]="severity()"
          [icon]="icon"
        ></i>
      }
    }
    {{ hintText() }}
  `,
})
export class MznFormHintText {
  protected readonly classes = classes;

  /** 提示文字。 */
  readonly hintText = input<string>();

  /** 自訂提示文字圖示。 */
  readonly hintTextIcon = input<IconDefinition>();

  /**
   * 嚴重程度，決定預設圖示。
   * @default 'info'
   */
  readonly severity = input<SeverityWithInfo>('info');

  /**
   * 是否顯示提示文字圖示。
   * @default true
   */
  readonly showHintTextIcon = input(true);

  protected readonly resolvedIcon = computed((): IconDefinition | null => {
    const custom = this.hintTextIcon();

    if (custom) return custom;

    const sev = this.severity();

    return sev ? (formHintIcons[sev] ?? null) : null;
  });

  protected readonly hostClasses = computed((): string => {
    const sev = this.severity();

    return clsx(
      classes.hintText,
      sev ? classes.hintTextSeverity(sev) : undefined,
    );
  });
}
