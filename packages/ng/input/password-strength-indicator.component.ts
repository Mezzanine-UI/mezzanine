import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  inputPasswordStrengthIndicatorClasses as classes,
  InputStrength,
} from '@mezzanine-ui/core/input';
import { formFieldClasses, formHintIcons } from '@mezzanine-ui/core/form';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';

/** 密碼提示項目。 */
export interface PasswordHintText {
  /** 提示嚴重程度。 */
  readonly severity: 'error' | 'info' | 'success' | 'warning';
  /** 提示文字。 */
  readonly hint: string;
}

/**
 * 密碼強度指示器，顯示強度進度條、文字標籤與提示訊息。
 *
 * 依據 `strength` 切換進度條寬度與顏色，並在下方顯示可選的提示文字。
 *
 * @example
 * ```html
 * import { MznPasswordStrengthIndicator } from '@mezzanine-ui/ng/input';
 *
 * <mzn-password-strength-indicator strength="medium" />
 * <mzn-password-strength-indicator strength="strong" [hintTexts]="hints" />
 * ```
 */
@Component({
  selector: 'mzn-password-strength-indicator',
  standalone: true,
  imports: [MznIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
  },
  template: `
    <div [class]="barClasses()"></div>
    <span [class]="textClass">
      {{ strengthTextPrefix() }}<mark>{{ resolvedStrengthText() }}</mark>
    </span>
    @if (hintTexts()?.length) {
      <div [class]="hintTextGroupClass">
        @for (item of hintTexts(); track item.hint) {
          <span [class]="getHintTextClasses(item.severity)">
            @if (getHintIcon(item.severity); as icon) {
              <i
                mznIcon
                [class]="hintTextIconClass"
                [icon]="icon"
                [color]="item.severity"
              ></i>
            }
            {{ item.hint }}
          </span>
        }
      </div>
    }
  `,
})
export class MznPasswordStrengthIndicator {
  protected readonly hostClass = classes.host;
  protected readonly textClass = classes.text;
  protected readonly hintTextGroupClass = classes.hintTextGroup;
  protected readonly hintTextIconClass = formFieldClasses.hintTextIcon;

  /**
   * 密碼提示項目清單。
   */
  readonly hintTexts = input<readonly PasswordHintText[]>();

  /**
   * 密碼強度等級。
   * @default 'weak'
   */
  readonly strength = input<InputStrength>('weak');

  /**
   * 強度文字（覆蓋預設的「低／中／高」）。
   */
  readonly strengthText = input<string>();

  /**
   * 強度文字前綴。
   * @default '密碼強度：'
   */
  readonly strengthTextPrefix = input('密碼強度：');

  protected readonly resolvedStrengthText = computed((): string => {
    const custom = this.strengthText();

    if (custom) return custom;

    const s = this.strength();

    return s === 'weak' ? '低' : s === 'medium' ? '中' : '高';
  });

  protected readonly barClasses = computed((): string =>
    clsx(classes.bar, classes.barState(this.strength())),
  );

  protected getHintTextClasses(severity: PasswordHintText['severity']): string {
    return clsx(
      formFieldClasses.hintText,
      formFieldClasses.hintTextSeverity(severity),
    );
  }

  protected getHintIcon(
    severity: PasswordHintText['severity'],
  ): (typeof formHintIcons)[keyof typeof formHintIcons] | null {
    return formHintIcons[severity] ?? null;
  }
}
