import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { IconDefinition } from '@mezzanine-ui/icons';
import {
  alertBannerClasses as classes,
  alertBannerIcons,
  AlertBannerSeverity,
} from '@mezzanine-ui/core/alert-banner';

export { AlertBannerSeverity };
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznClearActions } from '@mezzanine-ui/ng/clear-actions';
import { MOTION_DURATION } from '@mezzanine-ui/system/motion/duration';
import { MOTION_EASING } from '@mezzanine-ui/system/motion/easing';

/** AlertBanner 操作按鈕定義。 */
export interface AlertBannerAction {
  readonly content?: string;
  readonly onClick: (event: MouseEvent) => void;
}

/**
 * 橫幅通知元件，用於全域性重要訊息。
 *
 * 支援 info / warning / error 三種嚴重程度，
 * 可附帶操作按鈕（最多 2 個）與關閉按鈕。
 * 含入場/離場高度動畫。
 *
 * @example
 * ```html
 * import { MznAlertBanner } from '@mezzanine-ui/ng/alert-banner';
 *
 * <mzn-alert-banner
 *   severity="warning"
 *   message="系統將於 30 分鐘後維護"
 *   [closable]="true"
 *   (closed)="onClose()"
 * />
 * ```
 */
@Component({
  selector: 'mzn-alert-banner',
  standalone: true,
  imports: [MznIcon, MznButton, MznClearActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div #wrapper [class]="wrapperClass">
        <div [class]="hostClasses()" role="status" aria-live="polite">
          <div [class]="bodyClass">
            <i mznIcon [icon]="resolvedIcon()" [class]="iconClass"></i>
            <span [class]="messageClass">{{ message() }}</span>
          </div>
          <div [class]="controlsClass">
            @if (displayActions().length > 0) {
              <div [class]="actionsClass">
                @for (action of displayActions(); track $index) {
                  <button
                    mznButton
                    variant="inverse"
                    size="minor"
                    (click)="action.onClick($event)"
                    >{{ action.content }}</button
                  >
                }
              </div>
            }
            @if (showCloseButton()) {
              <mzn-clear-actions
                type="standard"
                variant="inverse"
                [class]="closeClass"
                (clicked)="handleClose()"
              />
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class MznAlertBanner implements OnInit {
  private readonly wrapperRef = viewChild<ElementRef<HTMLElement>>('wrapper');

  /**
   * 嚴重程度。
   */
  readonly severity = input.required<AlertBannerSeverity>();

  /**
   * 訊息文字。
   */
  readonly message = input.required<string>();

  /**
   * 操作按鈕（最多 2 個）。
   */
  readonly actions = input<ReadonlyArray<AlertBannerAction>>([]);

  /**
   * 建立時間戳（毫秒）。由 `MznAlertBannerService` 自動填入，用於排序多個橫幅通知。
   * @internal
   */
  readonly createdAt = input<number>();

  /**
   * 是否顯示關閉按鈕。
   * @default true
   */
  readonly closable = input(true);

  /**
   * 自訂圖示（預設依 severity 自動選擇）。
   */
  readonly icon = input<IconDefinition>();

  /**
   * AlertBanner 的唯一識別 key，可用於程式化關閉（透過 MznAlertBannerService.remove(reference)）。
   */
  readonly reference = input<string | number | undefined>(undefined);

  /** 關閉事件。 */
  readonly closed = output<void>();

  readonly visible = signal(true);

  protected readonly resolvedIcon = computed(
    (): IconDefinition => this.icon() ?? alertBannerIcons[this.severity()],
  );

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.severity(this.severity())),
  );

  protected readonly displayActions = computed(
    (): ReadonlyArray<AlertBannerAction> => {
      const acts = this.actions();

      if (acts.length > 2) {
        console.warn(
          'MznAlertBanner: actions 最多支援 2 個，超出部分將被截斷。',
        );
      }

      return acts.slice(0, 2);
    },
  );

  protected readonly showCloseButton = computed((): boolean => this.closable());

  protected readonly wrapperClass = classes.wrapper;
  protected readonly bodyClass = classes.body;
  protected readonly iconClass = classes.icon;
  protected readonly messageClass = classes.message;
  protected readonly controlsClass = classes.controls;
  protected readonly actionsClass = classes.actions;
  protected readonly closeClass = classes.close;

  ngOnInit(): void {
    requestAnimationFrame(() => {
      this.animateEnter();
    });
  }

  protected handleClose(): void {
    this.animateExit(() => {
      this.visible.set(false);
      this.closed.emit();
    });
  }

  private animateEnter(): void {
    const wrapper = this.wrapperRef()?.nativeElement;

    if (!wrapper) {
      return;
    }

    const height = wrapper.scrollHeight;

    wrapper.style.height = '0px';
    wrapper.style.overflow = 'hidden';

    // Force reflow
    void wrapper.scrollTop;

    wrapper.style.transition = `height ${MOTION_DURATION.moderate}ms ${MOTION_EASING.entrance}`;
    wrapper.style.height = `${height}px`;

    setTimeout(() => {
      wrapper.style.height = 'auto';
      wrapper.style.overflow = '';
      wrapper.style.transition = '';
    }, MOTION_DURATION.moderate);
  }

  private animateExit(onDone: () => void): void {
    const wrapper = this.wrapperRef()?.nativeElement;

    if (!wrapper) {
      onDone();

      return;
    }

    wrapper.style.height = `${wrapper.scrollHeight}px`;
    wrapper.style.overflow = 'hidden';

    // Force reflow
    void wrapper.scrollTop;

    wrapper.style.transition = `height ${MOTION_DURATION.moderate}ms ${MOTION_EASING.exit}`;
    wrapper.style.height = '0px';

    setTimeout(onDone, MOTION_DURATION.moderate);
  }
}
