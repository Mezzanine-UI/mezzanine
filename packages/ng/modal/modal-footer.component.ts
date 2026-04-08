import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import clsx from 'clsx';
import { MznButton, MznButtonGroup } from '@mezzanine-ui/ng/button';
import { MznCheckbox } from '@mezzanine-ui/ng/checkbox';
import { MznToggle } from '@mezzanine-ui/ng/toggle';
import { ButtonVariant } from '@mezzanine-ui/core/button';
import { MZN_MODAL_CONTEXT, ModalContextValue } from './modal-context';

/**
 * Modal 底部操作列元件。
 *
 * 搭配 `MznModal` 使用，自動從父 Modal 的 context 取得 `loading` 狀態。
 * 支援確認/取消按鈕、annotation、checkbox/toggle/button/password 輔助內容。
 *
 * @example
 * ```html
 * import { MznModalFooter } from '@mezzanine-ui/ng/modal';
 *
 * <mzn-modal-footer
 *   confirmText="確認"
 *   cancelText="取消"
 *   (confirmed)="onConfirm()"
 *   (cancelled)="onCancel()"
 * />
 * ```
 *
 * @see MznModal
 */
@Component({
  selector: 'mzn-modal-footer',
  standalone: true,
  imports: [FormsModule, MznButton, MznButtonGroup, MznCheckbox, MznToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    @if (auxiliaryContentType() === 'password') {
      <div [class]="passwordContainerClass">
        <mzn-checkbox
          [checked]="passwordChecked()"
          [label]="passwordCheckedLabel()"
          (ngModelChange)="passwordCheckedChanged.emit($event)"
          [ngModel]="passwordChecked()"
        />
        <button
          mznButton
          variant="base-text-link"
          (click)="passwordClicked.emit()"
          >{{ passwordButtonText() }}</button
        >
      </div>
    }

    @if (auxiliaryContentType() && auxiliaryContentType() !== 'password') {
      <div [class]="auxiliaryContentContainerClass">
        @if (auxiliaryContentType() === 'annotation') {
          <span class="mzn-typography--caption mzn-typography--text-neutral">{{
            annotation()
          }}</span>
        }
        @if (auxiliaryContentType() === 'button') {
          <button
            mznButton
            variant="base-text-link"
            (click)="auxiliaryContentClicked.emit()"
            >{{ auxiliaryContentButtonText() }}</button
          >
        }
        @if (auxiliaryContentType() === 'checkbox') {
          <mzn-checkbox
            [checked]="auxiliaryContentChecked()"
            [label]="auxiliaryContentLabel()"
            (ngModelChange)="auxiliaryContentChanged.emit($event)"
            [ngModel]="auxiliaryContentChecked()"
          />
        }
        @if (auxiliaryContentType() === 'toggle') {
          <mzn-toggle
            [checked]="auxiliaryContentChecked()"
            [label]="auxiliaryContentLabel()"
            (ngModelChange)="auxiliaryContentChanged.emit($event)"
            [ngModel]="auxiliaryContentChecked()"
          />
        }
      </div>
    }

    <mzn-button-group [class]="actionsButtonContainerClasses()">
      @if (showCancelButton()) {
        <button
          mznButton
          variant="base-secondary"
          [disabled]="resolvedLoading()"
          [class]="actionsButtonClass"
          (click)="cancelled.emit()"
          >{{ cancelText() }}</button
        >
      }
      <button
        mznButton
        [variant]="confirmButtonVariant()"
        [loading]="resolvedLoading()"
        [class]="actionsButtonClass"
        (click)="confirmed.emit()"
        >{{ confirmText() }}</button
      >
    </mzn-button-group>

    <ng-content />
  `,
})
export class MznModalFooter {
  private readonly modalContext = inject<ModalContextValue>(MZN_MODAL_CONTEXT, {
    optional: true,
  });

  /** 操作按鈕排版方式。 */
  readonly actionsButtonLayout = input<'fill' | 'fixed'>('fixed');

  /** 顯示在 footer 左側的 annotation 文字。僅在 auxiliaryContentType 為 'annotation' 時生效。 */
  readonly annotation = input<string>();

  /** 輔助內容按鈕文字。僅在 auxiliaryContentType 為 'button' 時生效。 */
  readonly auxiliaryContentButtonText = input<string>();

  /** 輔助內容 checkbox/toggle 是否勾選。 */
  readonly auxiliaryContentChecked = input(false);

  /** 輔助內容 checkbox/toggle 標籤文字。 */
  readonly auxiliaryContentLabel = input<string>();

  /** 輔助內容類型。 */
  readonly auxiliaryContentType = input<
    'annotation' | 'button' | 'checkbox' | 'password' | 'toggle'
  >();

  /** 取消按鈕文字。 */
  readonly cancelText = input('取消');

  /** 確認按鈕的 variant。 @default 'base-primary' */
  readonly confirmButtonVariant = input<ButtonVariant>('base-primary');

  /** 確認按鈕文字。 */
  readonly confirmText = input('確認');

  /** password 模式的按鈕文字（如「Forgot password?」）。 */
  readonly passwordButtonText = input<string>();

  /** password 模式的 checkbox 是否勾選（如「Remember me」）。 */
  readonly passwordChecked = input(false);

  /** password 模式的 checkbox 標籤文字。 */
  readonly passwordCheckedLabel = input<string>();

  /** 是否顯示取消按鈕。 */
  readonly showCancelButton = input(true);

  /** 輔助內容 checkbox/toggle 變更事件。 */
  readonly auxiliaryContentChanged = output<boolean>();

  /** 輔助內容按鈕點擊事件。 */
  readonly auxiliaryContentClicked = output<void>();

  /** 取消事件。 */
  readonly cancelled = output<void>();

  /** 確認事件。 */
  readonly confirmed = output<void>();

  /** password 模式的按鈕點擊事件。 */
  readonly passwordClicked = output<void>();

  /** password 模式的 checkbox 變更事件。 */
  readonly passwordCheckedChanged = output<boolean>();

  /** 從父 Modal context 取得 loading 狀態。 */
  readonly resolvedLoading = computed(
    (): boolean => this.modalContext?.loading() ?? false,
  );

  protected readonly hostClasses = computed((): string =>
    clsx(classes.modalFooter, {
      [`${classes.modalFooter}--password-mode`]:
        this.auxiliaryContentType() === 'password',
      [`${classes.modalFooter}--with-auxiliary-content`]:
        !!this.auxiliaryContentType() &&
        this.auxiliaryContentType() !== 'password',
    }),
  );

  protected readonly actionsButtonContainerClasses = computed((): string =>
    clsx(classes.modalFooterActionsButtonContainer, {
      [`${classes.modalFooterActionsButtonContainer}--fill-layout`]:
        this.actionsButtonLayout() === 'fill' && !this.auxiliaryContentType(),
    }),
  );

  protected readonly auxiliaryContentContainerClass =
    classes.modalFooterAuxiliaryContentContainer;
  protected readonly actionsButtonClass = classes.modalFooterActionsButton;
  protected readonly passwordContainerClass =
    classes.modalFooterPasswordContainer;
}
