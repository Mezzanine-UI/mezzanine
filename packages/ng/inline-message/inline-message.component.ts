import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import {
  inlineMessageClasses as classes,
  inlineMessageIcons,
  InlineMessageSeverity,
} from '@mezzanine-ui/core/inline-message';
import { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznClearActions } from '@mezzanine-ui/ng/clear-actions';

/**
 * 行內訊息元件。
 *
 * 用於表單欄位旁的即時回饋，支援 info / warning / error 三種語意。
 * info 模式可附帶關閉按鈕。
 *
 * @example
 * ```html
 * import { MznInlineMessage } from '@mezzanine-ui/ng/inline-message';
 *
 * <div mznInlineMessage
 *   severity="error"
 *   content="此欄位為必填"
 * ></div>
 * ```
 */
@Component({
  selector: '[mznInlineMessage]',
  standalone: true,
  imports: [MznIcon, MznClearActions],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    role: 'status',
    'aria-live': 'polite',
    '[attr.severity]': 'null',
    '[attr.content]': 'null',
    '[attr.icon]': 'null',
  },
  template: `
    @if (visible()) {
      <div [class]="contentContainerClass">
        <i mznIcon [icon]="resolvedIcon()" [class]="iconClass"></i>
        <span [class]="contentClass">{{ content() }}</span>
      </div>
      @if (severity() === 'info') {
        <mzn-clear-actions
          type="standard"
          variant="base"
          (clicked)="handleClose()"
        />
      }
    }
  `,
})
export class MznInlineMessage {
  /** 嚴重程度（必填）。 */
  readonly severity = input.required<InlineMessageSeverity>();

  /** 訊息文字（必填）。 */
  readonly content = input.required<string>();

  /** 自訂圖示（預設依 severity 自動選擇）。 */
  readonly icon = input<IconDefinition>();

  /** 關閉事件。 */
  readonly closed = output<void>();

  readonly visible = signal(true);

  protected readonly resolvedIcon = computed(
    (): IconDefinition => this.icon() ?? inlineMessageIcons[this.severity()],
  );

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.severity(this.severity())),
  );

  protected readonly contentContainerClass = classes.contentContainer;
  protected readonly iconClass = classes.icon;
  protected readonly contentClass = classes.content;

  protected handleClose(): void {
    this.visible.set(false);
    this.closed.emit();
  }
}
