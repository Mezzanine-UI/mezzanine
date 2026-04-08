import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  inputCheckClasses as classes,
  InputCheckSize,
} from '@mezzanine-ui/core/_internal/input-check';
import clsx from 'clsx';

/**
 * Checkbox / Radio 共用的勾選控制項佈局元件（內部元件，不公開匯出）。
 *
 * 負責渲染 label、control slot、hint 文字，以及各種狀態 CSS class。
 *
 * @example
 * ```html
 * <mzn-input-check [size]="'main'" [disabled]="false">
 *   <ng-container control><input type="checkbox" /></ng-container>
 *   Label text
 * </mzn-input-check>
 * ```
 */
@Component({
  selector: 'mzn-input-check',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <span [class]="controlClasses()">
      <ng-content select="[control]" />
    </span>
    @if (hasLabel()) {
      <span [class]="labelClass">
        <ng-content />
        @if (hint()) {
          <span [class]="hintClass">{{ hint() }}</span>
        }
      </span>
    }
  `,
})
export class MznInputCheck {
  /**
   * 尺寸。
   * @default 'main'
   */
  readonly size = input<InputCheckSize>('main');

  /**
   * 是否禁用。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 是否為錯誤狀態。
   * @default false
   */
  readonly error = input(false);

  /**
   * 是否顯示焦點樣式。
   * @default false
   */
  readonly focused = input(false);

  /**
   * 提示文字。
   */
  readonly hint = input<string>();

  /**
   * 是否有 label 內容。
   * @default true
   */
  readonly hasLabel = input(true);

  /**
   * 是否為 segmented 樣式。
   * @default false
   */
  readonly segmentedStyle = input(false);

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.size(this.size()), {
      [classes.disabled]: this.disabled(),
      [classes.error]: this.error(),
      [classes.segmented]: this.segmentedStyle(),
      [classes.withLabel]: this.hasLabel(),
    }),
  );

  protected readonly controlClasses = computed((): string =>
    clsx(classes.control, {
      [classes.controlFocused]: this.focused(),
      [classes.controlSegmented]: this.segmentedStyle(),
    }),
  );

  protected readonly labelClass = classes.label;
  protected readonly hintClass = classes.hint;
}
