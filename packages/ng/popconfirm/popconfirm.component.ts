import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { IconDefinition, WarningFilledIcon } from '@mezzanine-ui/icons';
import { type Placement } from '@floating-ui/dom';
import { MznPopper } from '@mezzanine-ui/ng/popper';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { ClickAwayService } from '@mezzanine-ui/ng/services';
import { mznFadeAnimation } from '@mezzanine-ui/ng/transition';

const popconfirmPrefix = 'mzn-popconfirm';

/**
 * 確認彈出框元件，點擊後在錨點旁顯示確認對話框。
 *
 * 使用 `MznPopper` 進行浮動定位，支援 click-away 自動關閉。
 * 提供確認/取消按鈕與自訂圖示。
 *
 * @example
 * ```html
 * import { MznPopconfirm } from '@mezzanine-ui/ng/popconfirm';
 *
 * <button #anchor (click)="showConfirm = !showConfirm">Delete</button>
 * <mzn-popconfirm
 *   [anchor]="anchor"
 *   [open]="showConfirm"
 *   title="確定要刪除嗎？"
 *   confirmText="確認"
 *   cancelText="取消"
 *   (confirmed)="onConfirm()"
 *   (cancelled)="showConfirm = false"
 *   (closed)="showConfirm = false"
 * />
 * ```
 *
 * @see MznPopper
 */
@Component({
  selector: 'mzn-popconfirm',
  standalone: true,
  imports: [MznPopper, MznIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [mznFadeAnimation],
  template: `
    <div
      mznPopper
      [anchor]="anchor()"
      [open]="open()"
      [placement]="placement()"
      [offsetOptions]="{ mainAxis: 4 }"
    >
      @if (open()) {
        <div [class]="hostClass" @mznFade>
          <div [class]="titleClass">
            <i mznIcon [icon]="resolvedIcon()" [class]="iconClass"></i>
            <span>{{ title() }}</span>
          </div>
          <div [class]="contentClass">
            <ng-content />
            @if (cancelText()) {
              <button
                type="button"
                [class]="cancelBtnClass"
                (click)="onCancel()"
                >{{ cancelText() }}</button
              >
            }
            @if (confirmText()) {
              <button
                type="button"
                [class]="confirmBtnClass"
                [disabled]="loading()"
                (click)="onConfirm()"
                >{{ confirmText() }}</button
              >
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class MznPopconfirm {
  private readonly clickAway = inject(ClickAwayService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostElRef = inject(ElementRef<HTMLElement>);

  /** 錨定元素。 */
  readonly anchor = input.required<HTMLElement | ElementRef<HTMLElement>>();

  /** 取消按鈕文字。 */
  readonly cancelText = input<string>();

  /** 確認按鈕文字。 */
  readonly confirmText = input<string>();

  /** 是否禁用 click-away 關閉。 */
  readonly disableClickAway = input(false);

  /** 自訂圖示。 */
  readonly icon = input<IconDefinition>();

  /** 是否載入中。 */
  readonly loading = input(false);

  /** 是否開啟。 */
  readonly open = input(false);

  /** 定位方向。 */
  readonly placement = input<Placement>('top');

  /** 標題。 */
  readonly title = input<string>('');

  /** 取消事件。 */
  readonly cancelled = output<void>();

  /** 關閉事件（包含 click-away）。 */
  readonly closed = output<void>();

  /** 確認事件。 */
  readonly confirmed = output<void>();

  protected readonly resolvedIcon = computed(
    (): IconDefinition => this.icon() ?? WarningFilledIcon,
  );

  protected readonly hostClass = popconfirmPrefix;
  protected readonly iconClass = `${popconfirmPrefix}__icon`;
  protected readonly titleClass = `${popconfirmPrefix}__title`;
  protected readonly contentClass = `${popconfirmPrefix}__content`;
  protected readonly cancelBtnClass = `${popconfirmPrefix}__cancel-btn`;
  protected readonly confirmBtnClass = `${popconfirmPrefix}__confirm-btn`;

  constructor() {
    effect((onCleanup) => {
      const isOpen = this.open();

      if (isOpen && !this.disableClickAway()) {
        const cleanup = this.clickAway.listen(
          this.hostElRef.nativeElement,
          () => this.closed.emit(),
          this.destroyRef,
        );

        onCleanup(() => cleanup());
      }
    });
  }

  protected onConfirm(): void {
    this.confirmed.emit();
  }

  protected onCancel(): void {
    this.cancelled.emit();
  }
}
