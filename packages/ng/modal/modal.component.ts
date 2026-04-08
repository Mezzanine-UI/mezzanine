import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  modalClasses as classes,
  ModalSize,
  ModalStatusType,
  ModalType,
} from '@mezzanine-ui/core/modal';
import clsx from 'clsx';
import { MznBackdrop } from '@mezzanine-ui/ng/backdrop';
import { MznClearActions } from '@mezzanine-ui/ng/clear-actions';
import { mznScaleAnimation } from '@mezzanine-ui/ng/transition';
import { EscapeKeyService } from '@mezzanine-ui/ng/services';
import { TopStackService } from '@mezzanine-ui/ng/services';
import { MZN_MODAL_CONTEXT, ModalContextValue } from './modal-context';

/**
 * 對話框元件，以 Backdrop 遮罩呈現需要使用者互動或確認的浮動視窗。
 *
 * 使用 content projection 組合 `mzn-modal-header` 與 `mzn-modal-footer`，
 * 並透過 DI token 向子元件提供 `modalStatusType` 和 `loading` 狀態。
 * 支援 Escape 鍵關閉（搭配 TopStackService 確保只關閉最上層）與
 * 點擊遮罩關閉。
 *
 * @example
 * ```html
 * import { MznModal, MznModalHeader, MznModalFooter } from '@mezzanine-ui/ng/modal';
 *
 * <div mznModal [open]="isOpen" (closed)="isOpen = false">
 *   <mzn-modal-header title="確認刪除" supportingText="此操作無法復原" />
 *   <div class="mzn-modal__body-container">
 *     <p>確定要刪除嗎？</p>
 *   </div>
 *   <mzn-modal-footer>
 *     <button mznButton variant="base-secondary" (click)="isOpen = false">取消</button>
 *     <button mznButton variant="base-primary" (click)="onConfirm()">確認</button>
 *   </mzn-modal-footer>
 * </div>
 * ```
 *
 * @see MznModalHeader
 * @see MznModalFooter
 * @see MznBackdrop
 */
@Component({
  selector: '[mznModal]',
  host: {
    '[attr.backdropClassName]': 'null',
    '[attr.disableCloseOnBackdropClick]': 'null',
    '[attr.disableCloseOnEscapeKeyDown]': 'null',
    '[attr.disablePortal]': 'null',
    '[attr.fullScreen]': 'null',
    '[attr.loading]': 'null',
    '[attr.modalStatusType]': 'null',
    '[attr.modalType]': 'null',
    '[attr.open]': 'null',
    '[attr.showDismissButton]': 'null',
    '[attr.showModalFooter]': 'null',
    '[attr.showModalHeader]': 'null',
    '[attr.size]': 'null',
  },
  standalone: true,
  imports: [MznBackdrop, MznClearActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [mznScaleAnimation],
  providers: [
    {
      provide: MZN_MODAL_CONTEXT,
      useFactory: (): ModalContextValue => {
        const statusType = signal<ModalStatusType>('info');
        const loading = signal(false);
        const modalType = signal<ModalType>('standard');

        return {
          modalStatusType: statusType.asReadonly(),
          loading: loading.asReadonly(),
          modalType: modalType.asReadonly(),
          _setStatusType: statusType.set.bind(statusType),
          _setLoading: loading.set.bind(loading),
          _setModalType: modalType.set.bind(modalType),
        } as ModalContextValue & {
          _setStatusType: (v: ModalStatusType) => void;
          _setLoading: (v: boolean) => void;
          _setModalType: (v: ModalType) => void;
        };
      },
    },
  ],
  template: `
    <div
      mznBackdrop
      [open]="open()"
      [class]="backdropClassName()"
      [disableCloseOnBackdropClick]="disableCloseOnBackdropClick()"
      [disablePortal]="disablePortal()"
      (closed)="onBackdropClose()"
      (backdropClick)="backdropClick.emit()"
    >
      @if (open()) {
        <div [class]="hostClasses()" role="dialog" @mznScale>
          @if (showModalHeader()) {
            <ng-content select="mzn-modal-header" />
          }
          <ng-content />
          @if (showModalFooter()) {
            <ng-content select="mzn-modal-footer" />
          }
          @if (showDismissButton()) {
            <button
              mznClearActions
              [class]="closeIconClass"
              variant="base"
              (clicked)="closed.emit()"
            ></button>
          }
        </div>
      }
    </div>
  `,
})
export class MznModal {
  private readonly escapeKey = inject(EscapeKeyService);
  private readonly topStack = inject(TopStackService);
  private readonly modalContext = inject(
    MZN_MODAL_CONTEXT,
  ) as ModalContextValue & {
    _setStatusType: (v: ModalStatusType) => void;
    _setLoading: (v: boolean) => void;
    _setModalType: (v: ModalType) => void;
  };

  /** 套用在 Backdrop 容器上的自訂 CSS class。 */
  readonly backdropClassName = input<string>();

  /** 是否禁用點擊遮罩關閉。 */
  readonly disableCloseOnBackdropClick = input(false);

  /** 是否禁用 Escape 鍵關閉。 */
  readonly disableCloseOnEscapeKeyDown = input(false);

  /** 是否禁用 Portal。 */
  readonly disablePortal = input(false);

  /** 是否全螢幕。 */
  readonly fullScreen = input(false);

  /** 是否載入中。 */
  readonly loading = input(false);

  /** Modal 狀態類型。 */
  readonly modalStatusType = input<ModalStatusType>('info');

  /** Modal 版面配置類型。 */
  readonly modalType = input<ModalType>('standard');

  /** 是否開啟 Modal。 */
  readonly open = input(false);

  /** 是否顯示關閉按鈕。 */
  readonly showDismissButton = input(true);

  /** 是否顯示 footer slot。 */
  readonly showModalFooter = input(false);

  /** 是否顯示 header slot。 */
  readonly showModalHeader = input(false);

  /** Modal 尺寸。 */
  readonly size = input<ModalSize>('regular');

  /** 遮罩點擊事件。 */
  readonly backdropClick = output<void>();

  /** 關閉事件。 */
  readonly closed = output<void>();

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.host,
      classes.modalStatusType(this.modalStatusType()),
      classes.size(this.size()),
      {
        [classes.fullScreen]: this.fullScreen(),
        [classes.withCloseIcon]: this.showDismissButton(),
      },
    ),
  );

  protected readonly closeIconClass = classes.closeIcon;

  constructor() {
    // Sync inputs to context for child components
    effect(() => {
      this.modalContext._setStatusType(this.modalStatusType());
    });

    effect(() => {
      this.modalContext._setLoading(this.loading());
    });

    effect(() => {
      this.modalContext._setModalType(this.modalType());
    });

    // Manage top stack and escape key
    effect((onCleanup) => {
      const isOpen = this.open();

      if (isOpen) {
        const entry = this.topStack.register();

        const escapeCleanup = this.escapeKey.listen(() => {
          if (!this.disableCloseOnEscapeKeyDown() && entry.isTop()) {
            this.closed.emit();
          }
        });

        onCleanup(() => {
          escapeCleanup();
          entry.unregister();
        });
      }
    });
  }

  protected onBackdropClose(): void {
    this.closed.emit();
  }
}
