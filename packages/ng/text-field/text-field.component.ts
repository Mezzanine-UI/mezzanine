import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import {
  textFieldClasses as classes,
  TextFieldSize,
} from '@mezzanine-ui/core/text-field';
import clsx from 'clsx';
import { MznClearActions } from '@mezzanine-ui/ng/clear-actions';
import { MznTextFieldHost } from './text-field-host.directive';

/**
 * 文字欄位容器元件,包裝 input/textarea 並提供前後綴、清除按鈕、狀態樣式。
 *
 * 內部透過 `hostDirectives` 套用 {@link MznTextFieldHost},由 directive
 * 負責 host class 計算與 descendant `<input>` / `<textarea>` 的狀態追蹤
 * (focus / blur / input / hover / hasValue / typing)。本 component 只負責
 * 渲染 prefix / suffix 投影插槽與 clearable 清除按鈕。
 *
 * 對應 React `<TextField>` component,提供相同的 children / prefix / suffix /
 * clearable API。
 *
 * @example
 * ```html
 * import { MznTextField } from '@mezzanine-ui/ng/text-field';
 *
 * <div mznTextField>
 *   <input placeholder="請輸入" />
 * </div>
 *
 * <div mznTextField [clearable]="true" [hasPrefix]="true" [hasSuffix]="true" (cleared)="onClear()">
 *   <span prefix>$</span>
 *   <input placeholder="金額" />
 *   <span suffix>.00</span>
 * </div>
 * ```
 *
 * @see MznTextFieldHost
 */
@Component({
  selector: '[mznTextField]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznClearActions],
  hostDirectives: [
    {
      directive: MznTextFieldHost,
      inputs: [
        'active',
        'clearable',
        'disabled',
        'error',
        'fullWidth',
        'hasPrefix',
        'hasSuffix',
        'readonly',
        'size',
        'typing',
        'warning',
      ],
      outputs: ['hoveredChange', 'focusedChange', 'hasValueChange'],
    },
  ],
  host: {
    '[class.mzn-text-field--clearing]': 'shouldShowClearable()',
    '[attr.active]': 'null',
    '[attr.clearable]': 'null',
    '[attr.forceShowClearable]': 'null',
    '[attr.hideSuffixWhenClearable]': 'null',
    '[attr.disabled]': 'null',
    '[attr.error]': 'null',
    '[attr.fullWidth]': 'null',
    '[attr.hasPrefix]': 'null',
    '[attr.hasSuffix]': 'null',
    '[attr.readOnly]': 'null',
    '[attr.size]': 'null',
    '[attr.typing]': 'null',
    '[attr.warning]': 'null',
  },
  template: `
    @if (hasPrefix()) {
      <div [class]="classes.prefix">
        <ng-content select="[prefix]" />
      </div>
    }
    <ng-content />
    <!--
      Clear button 一律渲染(clearable=true 且非 hideSuffixWhenClearable 時),
      讓 layout 從一開始就預留空間;實際顯示 / 隱藏用 host 的
      .mzn-text-field--clearing modifier(opacity 0 → 1)控制。對齊 React
      TextField.tsx:328-339,避免條件渲染在 hover 時整個欄位寬度跳動。
    -->
    @if (clearable() && !hideSuffixWhenClearable()) {
      <button
        mznClearActions
        type="clearable"
        [class]="classes.clearIcon"
        (clicked)="onClearClick($event)"
      ></button>
    }
    @if (hasSuffix() || (hideSuffixWhenClearable() && clearable())) {
      <div [class]="suffixClasses()">
        <ng-content select="[suffix]" />
        @if (hideSuffixWhenClearable() && clearable()) {
          <button
            mznClearActions
            type="clearable"
            [class]="classes.clearIcon"
            (clicked)="onClearClick($event)"
          ></button>
        }
      </div>
    }
  `,
})
export class MznTextField {
  protected readonly classes = classes;

  private readonly host = inject(MznTextFieldHost);

  /**
   * 是否顯示清除按鈕。
   * @default false
   */
  readonly clearable = input(false);

  /**
   * 強制顯示清除按鈕,即使欄位目前無值。
   * @default false
   */
  readonly forceShowClearable = input(false);

  /**
   * 當清除按鈕顯示時,隱藏後綴內容([suffix])。
   * @default false
   */
  readonly hideSuffixWhenClearable = input(false);

  /**
   * 是否有前綴內容(影響 prefix slot 渲染與 slim-gap 計算)。
   * @default false
   */
  readonly hasPrefix = input(false);

  /**
   * 是否有後綴內容(影響 suffix slot 渲染與 slim-gap 計算)。
   * @default false
   */
  readonly hasSuffix = input(false);

  /** 清除按鈕點擊事件。 */
  readonly cleared = output<MouseEvent>();

  protected readonly shouldShowClearable = computed((): boolean => {
    if (!this.clearable()) return false;
    if (this.forceShowClearable()) return true;

    return (
      this.host.hasValueState() &&
      (this.host.isHoveredState() ||
        this.host.resolvedTyping() ||
        this.host.isFocusedState())
    );
  });

  protected readonly suffixClasses = computed((): string =>
    clsx(classes.suffix, {
      [classes.suffixOverlay]: this.hideSuffixWhenClearable(),
    }),
  );

  /**
   * 透過 size input 讀取 host directive 的值,供 parent / 消費者能從 template 參考。
   * (保留此 proxy 以維持原本的公開 API signature。)
   */
  get size(): TextFieldSize {
    return this.host.size();
  }

  protected onClearClick(event: MouseEvent): void {
    if (!this.host.disabled() && !this.host.readonly()) {
      this.cleared.emit(event);
    }
  }
}
