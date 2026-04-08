import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { IconDefinition } from '@mezzanine-ui/icons';
import {
  messageClasses as classes,
  messageIcons,
  MessageSeverity,
} from '@mezzanine-ui/core/message';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznSpin } from '@mezzanine-ui/ng/spin';
import { mznTranslateBottomAnimation } from '@mezzanine-ui/ng/transition';
import { messageTimerController } from './message-timer-controller';

/**
 * 單則全域 toast 訊息元件。
 *
 * 通常由 `MznMessageService` 動態建立，不需直接使用。
 *
 * @example
 * ```html
 * <mzn-message severity="success" message="操作成功！" />
 * ```
 *
 * @see MznMessageService
 */
@Component({
  selector: 'mzn-message',
  standalone: true,
  imports: [MznIcon, MznSpin],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [mznTranslateBottomAnimation],
  host: {
    '[class]': 'hostClasses()',
    role: 'status',
    '[@mznTranslateBottom]': '""',
    '(mouseenter)': 'onHoverStart()',
    '(mouseleave)': 'onHoverEnd()',
    '(focus)': 'onHoverStart()',
    '(blur)': 'onHoverEnd()',
  },
  template: `
    @if (severity() === 'loading') {
      <span [class]="iconClass">
        <div mznSpin [loading]="true" size="minor"></div>
      </span>
    } @else if (resolvedIcon(); as icon) {
      <i mznIcon [icon]="icon" [class]="iconClass"></i>
    }
    <span [class]="contentClass">{{ message() }}</span>
  `,
})
export class MznMessage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  private timerRef: ReturnType<typeof setTimeout> | null = null;
  private startTime = 0;
  private remainingTime = 0;

  /**
   * 自動關閉時間（毫秒）。設為 `false` 不自動關閉。
   * @default 3000
   */
  readonly duration = input<number | false>(3000);

  /**
   * 自訂圖示。
   */
  readonly icon = input<IconDefinition>();

  /**
   * 訊息文字。
   */
  readonly message = input.required<string>();

  /**
   * 訊息的唯一 key（由 NotifierService 產生）。
   */
  readonly messageKey = input.required<string>();

  /**
   * 訊息的參考識別符（對應 React 的 `reference` prop）。
   * 可作為 timer controller 的識別鍵，供 `MessageService` 更新或移除特定訊息。
   */
  readonly reference = input<string | number>();

  /**
   * 嚴重程度。
   */
  readonly severity = input<MessageSeverity>();

  /** 關閉事件。 */
  readonly closed = output<string>();

  protected readonly resolvedIcon = computed((): IconDefinition | undefined => {
    const sev = this.severity();

    if (this.icon()) {
      return this.icon();
    }

    if (sev && sev !== 'loading' && messageIcons[sev]) {
      return messageIcons[sev];
    }

    return undefined;
  });

  protected readonly hostClasses = computed((): string => {
    const sev = this.severity();

    return clsx(classes.host, sev ? classes.severity(sev) : undefined);
  });

  protected readonly iconClass = classes.icon;
  protected readonly contentClass = classes.content;

  ngOnInit(): void {
    this.remainingTime =
      typeof this.duration() === 'number' ? (this.duration() as number) : 0;
    this.startTimer();

    messageTimerController.register(this.messageKey(), {
      pause: () => this.pauseTimer(),
      resume: () => this.resumeTimer(),
    });

    this.destroyRef.onDestroy(() => {
      this.clearTimer();
      messageTimerController.unregister(this.messageKey());
    });
  }

  protected onHoverStart(): void {
    messageTimerController.pause();
  }

  protected onHoverEnd(): void {
    messageTimerController.resume();
  }

  private startTimer(): void {
    if (this.duration() === false || this.remainingTime <= 0) {
      return;
    }

    this.startTime = Date.now();
    this.timerRef = setTimeout(() => {
      this.closed.emit(this.messageKey());
    }, this.remainingTime);
  }

  private pauseTimer(): void {
    if (this.timerRef) {
      clearTimeout(this.timerRef);
      this.timerRef = null;
      this.remainingTime -= Date.now() - this.startTime;
    }
  }

  private resumeTimer(): void {
    this.startTimer();
  }

  private clearTimer(): void {
    if (this.timerRef) {
      clearTimeout(this.timerRef);
      this.timerRef = null;
    }
  }
}
