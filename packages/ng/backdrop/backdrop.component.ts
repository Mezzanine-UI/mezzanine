import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import {
  backdropClasses as classes,
  BackdropVariant,
} from '@mezzanine-ui/core/backdrop';
import clsx from 'clsx';
import { MznPortal } from '@mezzanine-ui/ng/portal';
import { MznFade } from '@mezzanine-ui/ng/transition';
import { ScrollLockService } from '@mezzanine-ui/ng/services';

/**
 * 全螢幕遮罩元件，常用於 Modal / Drawer 等覆蓋式 UI。
 *
 * 支援深色/淺色變體，自動鎖定 body 捲軸，並透過 Portal 渲染至全域容器。
 * 點擊遮罩區域時觸發 `backdropClick` 事件，可選擇禁用關閉行為。
 *
 * @example
 * ```html
 * import { MznBackdrop } from '@mezzanine-ui/ng/backdrop';
 *
 * <div mznBackdrop [open]="isOpen" (closed)="onClose()">
 *   <div>Modal content</div>
 * </div>
 * ```
 *
 * @see MznPortal
 */
@Component({
  selector: '[mznBackdrop]',
  host: {
    '[attr.open]': 'null',
    '[attr.variant]': 'null',
    '[attr.disableScrollLock]': 'null',
    '[attr.disableCloseOnBackdropClick]': 'null',
    '[attr.disablePortal]': 'null',
  },
  standalone: true,
  imports: [MznPortal, MznFade],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div mznPortal [disablePortal]="disablePortal()">
      <div
        [class]="hostClasses()"
        role="presentation"
        [attr.aria-hidden]="!open()"
      >
        <div [class]="mainClass">
          <div mznFade [in]="open()">
            <div
              [class]="backdropClasses()"
              aria-hidden="true"
              (click)="onBackdropClick()"
            ></div>
          </div>
          <div [class]="contentClass">
            <ng-content />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MznBackdrop {
  private readonly scrollLock = inject(ScrollLockService);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * 是否開啟遮罩。
   * @default false
   */
  readonly open = input(false);

  /**
   * 遮罩顏色變體。
   * @default 'dark'
   */
  readonly variant = input<BackdropVariant>('dark');

  /**
   * 是否禁用 scroll lock。
   * @default false
   */
  readonly disableScrollLock = input(false);

  /**
   * 是否禁用點擊遮罩關閉。
   * @default false
   */
  readonly disableCloseOnBackdropClick = input(false);

  /**
   * 是否禁用 Portal（內容渲染在原位置）。
   * @default false
   */
  readonly disablePortal = input(false);

  /** 遮罩被點擊時觸發。 */
  readonly backdropClick = output<void>();

  /** 關閉事件（點擊遮罩且未禁用關閉時觸發）。 */
  readonly closed = output<void>();

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.hostAbsolute, {
      [classes.hostOpen]: this.open(),
    }),
  );

  protected readonly backdropClasses = computed((): string =>
    clsx(classes.backdrop, classes.backdropVariant(this.variant())),
  );

  protected readonly mainClass = classes.main;
  protected readonly contentClass = classes.content;

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const disableScroll = this.disableScrollLock();

      if (isOpen && !disableScroll) {
        this.scrollLock.lock();
      } else {
        this.scrollLock.unlock();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.scrollLock.unlock();
    });
  }

  protected onBackdropClick(): void {
    this.backdropClick.emit();

    if (!this.disableCloseOnBackdropClick()) {
      this.closed.emit();
    }
  }
}
