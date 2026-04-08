import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  inlineMessageGroupClasses as classes,
  InlineMessageSeverity,
} from '@mezzanine-ui/core/inline-message';
import { IconDefinition } from '@mezzanine-ui/icons';
import { MznInlineMessage } from './inline-message.component';

export interface InlineMessageGroupItem {
  content: string;
  icon?: IconDefinition;
  key: string | number;
  severity: InlineMessageSeverity;
}

/**
 * 行內訊息群組元件。
 *
 * 將多則行內訊息集中顯示，支援透過 items 陣列傳入並統一監聽關閉事件。
 *
 * @example
 * ```html
 * import { MznInlineMessageGroup } from '@mezzanine-ui/ng/inline-message';
 *
 * <mzn-inline-message-group
 *   [items]="messages"
 *   (itemClose)="onItemClose($event)"
 * />
 * ```
 */
@Component({
  selector: 'mzn-inline-message-group',
  standalone: true,
  imports: [MznInlineMessage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
    'aria-live': 'polite',
    role: 'region',
  },
  template: `
    @for (item of items(); track item.key) {
      <mzn-inline-message
        [content]="item.content"
        [icon]="item.icon"
        [severity]="item.severity"
        (closed)="handleItemClose(item.key)"
      />
    }
  `,
})
export class MznInlineMessageGroup {
  /** 行內訊息項目陣列。 */
  readonly items = input<ReadonlyArray<InlineMessageGroupItem>>([]);

  /** 當某項訊息被關閉時觸發，發送該項目的 key。 */
  readonly itemClose = output<string | number>();

  protected readonly hostClass = classes.host;

  protected handleItemClose(key: string | number): void {
    this.itemClose.emit(key);
  }
}
