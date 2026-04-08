import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { type DropdownOption } from '@mezzanine-ui/core/dropdown';
import { type ToggleSize } from '@mezzanine-ui/core/toggle';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznDropdown } from '@mezzanine-ui/ng/dropdown';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznToggle } from '@mezzanine-ui/ng/toggle';
import { FormsModule } from '@angular/forms';

/**
 * 動作按鈕的外觀變體，僅限文字連結類型。
 * - `'base-text-link'` — 預設文字連結樣式
 * - `'destructive-text-link'` — 危險操作文字連結樣式
 */
export type BaseCardActionVariant = 'base-text-link' | 'destructive-text-link';

/**
 * 卡片標題區右側操作的類型。
 * - `'default'` — 無操作
 * - `'action'` — 顯示動作按鈕
 * - `'overflow'` — 顯示下拉式選單（待實作）
 * - `'toggle'` — 顯示切換開關
 */
export type BaseCardType = 'default' | 'action' | 'overflow' | 'toggle';

/**
 * 基本卡片元件，支援標題、描述與內容區域。
 *
 * 透過 `type` 輸入可在標題右側渲染不同的操作元素：
 * - `type="action"` 搭配 `actionName` / `actionVariant` 顯示動作按鈕
 * - `type="default"`（預設）僅渲染 `[header-action]` 投射插槽
 * 支援 `active`、`disabled` 與 `readOnly` 狀態。
 *
 * @example
 * ```html
 * import { MznBaseCard } from '@mezzanine-ui/ng/card';
 *
 * <div mznBaseCard title="卡片標題" description="卡片描述">
 *   <p>卡片內容</p>
 * </div>
 *
 * <div mznBaseCard title="含動作按鈕" type="action" actionName="查看詳情">
 *   <p>卡片內容</p>
 * </div>
 * ```
 * @see MznCardGroup
 */
@Component({
  selector: '[mznBaseCard]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MznButton, MznDropdown, MznIcon, MznToggle],
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-disabled]': 'disabled() || undefined',
    '[attr.aria-readonly]': 'readOnly() || undefined',
    '[attr.actionName]': 'null',
    '[attr.actionVariant]': 'null',
    '[attr.active]': 'null',
    '[attr.checked]': 'null',
    '[attr.description]': 'null',
    '[attr.defaultChecked]': 'null',
    '[attr.disabled]': 'null',
    '[attr.options]': 'null',
    '[attr.readOnly]': 'null',
    '[attr.title]': 'null',
    '[attr.toggleLabel]': 'null',
    '[attr.toggleSize]': 'null',
    '[attr.toggleSupportingText]': 'null',
    '[attr.type]': 'null',
  },
  template: `
    @if (title() || description()) {
      <div [class]="headerClass">
        <div [class]="headerContentClass">
          @if (title()) {
            <span [class]="headerTitleClass">{{ title() }}</span>
          }
          @if (description()) {
            <span [class]="headerDescriptionClass">{{ description() }}</span>
          }
        </div>
        @if (type() === 'action' && actionName()) {
          <div [class]="headerActionClass">
            <button
              mznButton
              [disabled]="disabled()"
              [variant]="actionVariant()"
              size="sub"
              type="button"
              (click)="onActionButtonClick($event)"
              >{{ actionName() }}</button
            >
          </div>
        } @else if (type() === 'overflow') {
          <div [class]="headerActionClass">
            <button
              #overflowTrigger
              mznButton
              [disabled]="disabled()"
              iconType="icon-only"
              size="sub"
              variant="base-text-link"
              type="button"
              (click)="toggleOverflow()"
            >
              <i mznIcon [icon]="dotHorizontalIcon"></i>
            </button>
            <div
              mznDropdown
              [anchor]="overflowTrigger"
              [open]="overflowOpen()"
              [options]="options()"
              mode="single"
              (selected)="onOverflowOptionSelect($event)"
              (closed)="overflowOpen.set(false)"
            ></div>
          </div>
        } @else if (type() === 'toggle') {
          <div [class]="headerActionClass">
            <div
              mznToggle
              [disabled]="disabled()"
              [label]="toggleLabel()"
              [(ngModel)]="toggleChecked"
              [size]="toggleSize()"
              [supportingText]="toggleSupportingText()"
            ></div>
          </div>
        } @else {
          <div [class]="headerActionClass">
            <ng-content select="[header-action]" />
          </div>
        }
      </div>
    }
    <div [class]="contentClass">
      <ng-content />
    </div>
  `,
})
export class MznBaseCard {
  protected readonly headerClass = classes.baseHeader;
  protected readonly headerContentClass = classes.baseHeaderContentWrapper;
  protected readonly headerTitleClass = classes.baseHeaderTitle;
  protected readonly headerDescriptionClass = classes.baseHeaderDescription;
  protected readonly headerActionClass = classes.baseHeaderAction;
  protected readonly contentClass = classes.baseContent;

  /**
   * 動作按鈕文字，僅在 `type="action"` 時有效。
   */
  readonly actionName = input<string>();

  /**
   * 動作按鈕外觀變體，僅在 `type="action"` 時有效。
   * @default 'base-text-link'
   */
  readonly actionVariant = input<BaseCardActionVariant>('base-text-link');

  /**
   * 是否為啟用（選取）狀態。
   * @default false
   */
  readonly active = input(false);

  /**
   * 切換開關的受控勾選狀態，僅在 `type="toggle"` 時有效。
   */
  readonly checked = input<boolean>();

  /** 卡片描述。 */
  readonly description = input<string>();

  /**
   * 切換開關的預設勾選狀態（非受控），僅在 `type="toggle"` 時有效。
   */
  readonly defaultChecked = input<boolean>();

  /**
   * 是否停用。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * Dropdown 選項列表，僅在 `type="overflow"` 時有效。
   */
  readonly options = input<ReadonlyArray<DropdownOption>>([]);

  /**
   * 是否唯讀。
   * @default false
   */
  readonly readOnly = input(false);

  /** 卡片標題。 */
  readonly title = input<string>();

  /**
   * 切換開關的標籤文字，僅在 `type="toggle"` 時有效。
   */
  readonly toggleLabel = input<string>();

  /**
   * 切換開關的尺寸，僅在 `type="toggle"` 時有效。
   */
  readonly toggleSize = input<ToggleSize>();

  /**
   * 切換開關的輔助說明文字，僅在 `type="toggle"` 時有效。
   */
  readonly toggleSupportingText = input<string>();

  /**
   * 標題區右側操作類型。
   * @default 'default'
   */
  readonly type = input<BaseCardType>('default');

  /** 動作按鈕點擊事件，僅在 `type="action"` 時觸發。 */
  readonly actionClick = output<MouseEvent>();

  /** Dropdown 選項選取事件，僅在 `type="overflow"` 時觸發。 */
  readonly optionSelect = output<DropdownOption>();

  /** 切換開關狀態變更事件。 */
  readonly toggleChange = output<boolean>();

  /** 切換開關的受控狀態（用於 ngModel 雙向綁定）。 */
  protected toggleChecked = false;

  /** DotHorizontalIcon for overflow type. */
  protected readonly dotHorizontalIcon = DotHorizontalIcon;

  /** Overflow dropdown open state. */
  protected readonly overflowOpen = signal(false);

  protected readonly hostClasses = computed((): string =>
    clsx(classes.base, {
      [classes.baseDisabled]: this.disabled(),
      [classes.baseReadOnly]: this.readOnly(),
      [`${classes.base}--active`]: this.active(),
    }),
  );

  protected onActionButtonClick(event: MouseEvent): void {
    event.stopPropagation();
    this.actionClick.emit(event);
  }

  protected toggleOverflow(): void {
    this.overflowOpen.update((v) => !v);
  }

  protected onOverflowOptionSelect(option: DropdownOption): void {
    this.optionSelect.emit(option);
    this.overflowOpen.set(false);
  }
}
