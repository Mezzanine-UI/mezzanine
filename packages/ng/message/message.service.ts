import { inject, Injectable } from '@angular/core';
import { MznNotifierService } from '@mezzanine-ui/ng/notifier';
import { IconDefinition } from '@mezzanine-ui/icons';
import { MessageSeverity } from '@mezzanine-ui/core/message';

/** Message 新增時的輸入資料。 */
export interface MessageData {
  readonly message: string;
  readonly severity?: MessageSeverity;
  readonly icon?: IconDefinition;
  readonly duration?: number | false;
  readonly key?: string;
}

/**
 * 全域 toast 訊息 service。
 *
 * 對應 React 版的 `Message.success()` / `Message.error()` 等靜態方法。
 * 內部使用 `MznNotifierService` 管理通知列表。
 *
 * @example
 * ```ts
 * import { MznMessageService } from '@mezzanine-ui/ng/message';
 *
 * const message = inject(MznMessageService);
 * message.success('操作成功！');
 * message.error('發生錯誤');
 * message.info('提示訊息');
 * message.warning('請注意');
 * message.loading('處理中...');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class MznMessageService {
  private readonly notifier = inject(MznNotifierService);

  /** 新增一則訊息。回傳唯一 key。 */
  add(data: MessageData): string {
    return this.notifier.add({
      ...data,
      key: data.key,
    });
  }

  /** 移除指定訊息。 */
  remove(key: string): void {
    this.notifier.remove(key);
  }

  /** 移除所有訊息。 */
  destroy(): void {
    this.notifier.destroy();
  }

  /** 更新 notifier 設定。 */
  config(config: { duration?: number | false; maxCount?: number }): void {
    this.notifier.config(config);
  }

  /** 成功訊息。 */
  success(
    message: string,
    props?: Omit<MessageData, 'message' | 'severity'>,
  ): string {
    return this.add({ ...props, message, severity: 'success' });
  }

  /** 錯誤訊息。 */
  error(
    message: string,
    props?: Omit<MessageData, 'message' | 'severity'>,
  ): string {
    return this.add({ ...props, message, severity: 'error' });
  }

  /** 資訊訊息。 */
  info(
    message: string,
    props?: Omit<MessageData, 'message' | 'severity'>,
  ): string {
    return this.add({ ...props, message, severity: 'info' });
  }

  /** 警告訊息。 */
  warning(
    message: string,
    props?: Omit<MessageData, 'message' | 'severity'>,
  ): string {
    return this.add({ ...props, message, severity: 'warning' });
  }

  /** 載入中訊息（不自動關閉）。 */
  loading(
    message: string,
    props?: Omit<MessageData, 'message' | 'severity'>,
  ): string {
    return this.add({
      ...props,
      message,
      severity: 'loading',
      duration: false,
    });
  }
}
