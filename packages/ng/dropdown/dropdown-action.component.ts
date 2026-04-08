import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { dropdownClasses as classes } from '@mezzanine-ui/core/dropdown';
import { CloseIcon } from '@mezzanine-ui/icons';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznIcon } from '@mezzanine-ui/ng/icon';

/**
 * MznDropdownAction 的輸入屬性介面，也用於 MznDropdownItem 的 actionConfig。
 * 對應 React 的 DropdownActionProps。
 */
export interface DropdownActionProps {
  /** 自訂操作按鈕文字（custom mode）。 */
  actionText?: string;
  /** 取消按鈕文字。 */
  cancelText?: string;
  /** 清除按鈕文字。 */
  clearText?: string;
  /** 確認按鈕文字。 */
  confirmText?: string;
  /**
   * Click handler for cancel (React API compat).
   * Used to infer mode in MznDropdownItem.resolvedActionMode.
   */
  onCancel?: () => void;
  /**
   * Click handler for clear (React API compat).
   * Used to infer mode in MznDropdownItem.resolvedActionMode.
   */
  onClear?: () => void;
  /**
   * Click handler for confirm (React API compat).
   */
  onConfirm?: () => void;
  /**
   * Click handler for custom action (React API compat).
   * Used to infer mode in MznDropdownItem.resolvedActionMode.
   */
  onClick?: () => void;
  /** 是否顯示操作區域。 */
  showActions?: boolean;
  /** 是否顯示頂部分隔線。 */
  showTopBar?: boolean;
}

/**
 * Dropdown 操作按鈕區域元件，提供取消、確認、清除或自訂等操作。
 *
 * 透過 `mode` 控制顯示的按鈕組合：
 * - `'default'` — 顯示取消與確認按鈕
 * - `'clear'` — 僅顯示清除按鈕（帶關閉圖示）
 * - `'custom'` — 顯示自訂操作按鈕（以 `actionText` 設定文字）
 *
 * @example
 * ```html
 * import { MznDropdownAction } from '@mezzanine-ui/ng/dropdown';
 *
 * <mzn-dropdown-action
 *   [showActions]="true"
 *   cancelText="取消"
 *   confirmText="套用"
 *   (cancelled)="onCancel()"
 *   (confirmed)="onConfirm()"
 * />
 * ```
 *
 * @see MznDropdown
 */
@Component({
  selector: 'mzn-dropdown-action',
  standalone: true,
  imports: [MznButton, MznIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showActions()) {
      <div [class]="actionClass">
        @if (showTopBar()) {
          <i [class]="actionTopBarClass"></i>
        }
        <div [class]="actionToolsClass">
          @if (mode() === 'default') {
            <button
              mznButton
              variant="base-ghost"
              size="minor"
              (click)="cancelled.emit()"
            >
              {{ resolvedCancelText() }}
            </button>
            <button mznButton size="minor" (click)="confirmed.emit()">
              {{ resolvedConfirmText() }}
            </button>
          }
          @if (mode() === 'clear') {
            <button
              mznButton
              variant="base-ghost"
              size="minor"
              iconType="leading"
              (click)="cleared.emit()"
            >
              <i mznIcon [icon]="closeIcon"></i>
              {{ resolvedClearText() }}
            </button>
          }
          @if (mode() === 'custom') {
            <button
              mznButton
              variant="base-ghost"
              size="minor"
              (mousedown)="$event.preventDefault()"
              (click)="customClicked.emit()"
            >
              {{ resolvedActionText() }}
            </button>
          }
        </div>
      </div>
    }
  `,
})
export class MznDropdownAction {
  /** 自訂操作按鈕文字（custom mode）。 @default 'Custom Action' */
  readonly actionText = input<string>();

  /** 取消按鈕文字。 @default 'Cancel' */
  readonly cancelText = input<string>();

  /** 清除按鈕文字。 @default 'Clear Options' */
  readonly clearText = input<string>();

  /** 確認按鈕文字。 @default 'Confirm' */
  readonly confirmText = input<string>();

  /**
   * 操作模式。
   * - `'default'` — 顯示取消與確認按鈕
   * - `'clear'` — 僅顯示清除按鈕
   * - `'custom'` — 顯示自訂操作按鈕
   * @default 'default'
   */
  readonly mode = input<'clear' | 'custom' | 'default'>('default');

  /** 是否顯示操作區域。 @default false */
  readonly showActions = input(false);

  /** 是否顯示頂部分隔線。 @default false */
  readonly showTopBar = input(false);

  /** 取消事件。 */
  readonly cancelled = output<void>();

  /** 清除事件。 */
  readonly cleared = output<void>();

  /** 確認事件。 */
  readonly confirmed = output<void>();

  /** 自訂操作按鈕點擊事件。 */
  readonly customClicked = output<void>();

  protected readonly closeIcon = CloseIcon;
  protected readonly actionClass = classes.action;
  protected readonly actionTopBarClass = classes.actionTopBar;
  protected readonly actionToolsClass = classes.actionTools;

  protected readonly resolvedActionText = computed(
    (): string => this.actionText() ?? 'Custom Action',
  );

  protected readonly resolvedCancelText = computed(
    (): string => this.cancelText() ?? 'Cancel',
  );

  protected readonly resolvedClearText = computed(
    (): string => this.clearText() ?? 'Clear Options',
  );

  protected readonly resolvedConfirmText = computed(
    (): string => this.confirmText() ?? 'Confirm',
  );
}
