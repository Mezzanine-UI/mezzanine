import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import {
  selectClasses as classes,
  SelectInputSize,
  SelectMode,
} from '@mezzanine-ui/core/select';
import { textFieldClasses } from '@mezzanine-ui/core/text-field';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznClearActions } from '@mezzanine-ui/ng/clear-actions';
import { MznIcon } from '@mezzanine-ui/ng/icon';

/**
 * 選擇器觸發器元件，負責渲染 Select 的可點擊觸發區域。
 *
 * 包含前綴文字、顯示文字（或佔位符）、清除按鈕與後綴圖示。
 * 可獨立使用或組合於 `MznSelect` 中。
 *
 * @example
 * ```html
 * import { MznSelectTrigger } from '@mezzanine-ui/ng/select';
 *
 * <div mznSelectTrigger
 *   [active]="isOpen"
 *   [clearable]="true"
 *   [displayText]="selectedLabel"
 *   placeholder="請選擇"
 *   (cleared)="onClear()"
 *   (triggerClicked)="onToggle()"
 * ></div>
 * ```
 *
 * @see MznSelect
 * @see MznSelectTriggerTags
 */
@Component({
  selector: '[mznSelectTrigger]',
  standalone: true,
  imports: [MznClearActions, MznIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '(click)': 'onTriggerClick()',
    '[attr.active]': 'null',
    '[attr.clearable]': 'null',
    '[attr.disabled]': 'null',
    '[attr.displayText]': 'null',
    '[attr.error]': 'null',
    '[attr.hasValue]': 'null',
    '[attr.mode]': 'null',
    '[attr.placeholder]': 'null',
    '[attr.prefix]': 'null',
    '[attr.readOnly]': 'null',
    '[attr.size]': 'null',
    '[attr.suffixActionIcon]': 'null',
  },
  template: `
    @if (prefix()) {
      <span [class]="prefixClass">{{ prefix() }}</span>
    }

    <input
      readonly
      type="text"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      autocomplete="off"
      [class]="triggerInputClass"
      [value]="hasValue() ? displayText() : ''"
      [attr.placeholder]="hasValue() ? null : placeholder()"
    />
    <ng-content />

    @if (clearable() && hasValue()) {
      <button
        mznClearActions
        type="clearable"
        class="mzn-text-field__clear-icon"
        tabindex="-1"
        (mousedown)="$event.preventDefault()"
        (clicked)="onClearClick($event)"
      ></button>
    }

    <div class="mzn-text-field__suffix">
      <i
        mznIcon
        [icon]="resolvedSuffixIcon()"
        [class]="suffixIconClasses()"
      ></i>
    </div>
  `,
})
export class MznSelectTrigger {
  /**
   * 是否處於啟用（展開）狀態，控制後綴圖示旋轉。
   * @default false
   */
  readonly active = input(false);

  /**
   * 是否顯示清除按鈕。清除按鈕僅在有值時才顯示。
   * @default false
   */
  readonly clearable = input(false);

  /**
   * 是否禁用。禁用時點擊不觸發事件。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 觸發器顯示的文字。空字串時顯示 `placeholder`。
   * @default ''
   */
  readonly displayText = input('');

  /**
   * 是否為錯誤狀態。
   * @default false
   */
  readonly error = input(false);

  /**
   * 是否有選取值。控制是否顯示 ng-content（標籤區域）或 displayText。
   * @default false
   */
  readonly hasValue = input(false);

  /**
   * 選取模式，影響觸發器 CSS class。
   * @default 'single'
   */
  readonly mode = input<SelectMode>('single');

  /**
   * 佔位文字，當 `displayText` 為空時顯示。
   * @default ''
   */
  readonly placeholder = input('');

  /**
   * 前綴文字。
   */
  readonly prefix = input<string>();

  /**
   * 是否唯讀。唯讀時點擊不觸發事件。
   * @default false
   */
  readonly readOnly = input(false);

  /**
   * 輸入框尺寸。
   * @default 'main'
   */
  readonly size = input<SelectInputSize>('main');

  /**
   * 自訂後綴動作圖示。預設為 `ChevronDownIcon`。
   */
  readonly suffixActionIcon = input<typeof ChevronDownIcon>(ChevronDownIcon);

  /** 點擊清除按鈕時發出。 */
  readonly cleared = output<MouseEvent>();

  /** 點擊觸發器時發出（禁用或唯讀時不觸發）。 */
  readonly triggerClicked = output<void>();

  protected readonly prefixClass = clsx(classes.triggerPrefix);
  protected readonly triggerInputClass = classes.triggerInput;

  protected readonly hostClasses = computed((): string =>
    clsx(
      textFieldClasses.host,
      textFieldClasses.fullWidth,
      this.size() === 'sub' ? textFieldClasses.sub : textFieldClasses.main,
      classes.trigger,
      classes.triggerMode(this.mode()),
      classes.triggerSelected(this.hasValue() ? true : null),
      {
        [classes.triggerDisabled]: this.disabled(),
        [classes.triggerReadOnly]: this.readOnly(),
        [textFieldClasses.clearable]: this.clearable() && this.hasValue(),
        [textFieldClasses.disabled]: this.disabled(),
        [textFieldClasses.readonly]: this.readOnly(),
        [textFieldClasses.error]: this.error(),
      },
    ),
  );

  protected readonly suffixIconClasses = computed((): string =>
    clsx(classes.triggerSuffixActionIcon, {
      [classes.triggerSuffixActionIconActive]: this.active(),
    }),
  );

  protected readonly resolvedSuffixIcon = computed(
    (): typeof ChevronDownIcon => this.suffixActionIcon() ?? ChevronDownIcon,
  );

  protected onTriggerClick(): void {
    if (this.disabled() || this.readOnly()) return;
    this.triggerClicked.emit();
  }

  protected onClearClick(event: MouseEvent): void {
    event.stopPropagation();
    this.cleared.emit(event);
  }
}
