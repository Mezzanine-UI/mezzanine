import { inject, Injectable } from '@angular/core';
import { IconDefinition } from '@mezzanine-ui/icons';
import { AlertBannerSeverity } from '@mezzanine-ui/core/alert-banner';
import { MznNotifierService } from '@mezzanine-ui/ng/notifier';
import { AlertBannerAction } from './alert-banner.component';

/** AlertBanner 新增時的輸入資料。 */
export interface AlertBannerData {
  readonly severity: AlertBannerSeverity;
  readonly message: string;
  readonly actions?: ReadonlyArray<AlertBannerAction>;
  readonly closable?: boolean;
  readonly icon?: IconDefinition;
  readonly key?: string;
  readonly onClose?: () => void;
}

/**
 * 全域橫幅通知 service。
 *
 * 對應 React 版的 `AlertBanner.info()` / `AlertBanner.warning()` 等靜態方法。
 *
 * @example
 * ```ts
 * import { MznAlertBannerService } from '@mezzanine-ui/ng/alert-banner';
 *
 * const alertBanner = inject(MznAlertBannerService);
 * alertBanner.warning('系統將於 30 分鐘後維護');
 * alertBanner.error('伺服器連線中斷');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class MznAlertBannerService {
  private readonly notifier = inject(MznNotifierService);

  /** 新增一則橫幅通知。回傳唯一 key。 */
  add(data: AlertBannerData): string {
    return this.notifier.add({
      ...data,
      key: data.key,
      createdAt: Date.now(),
    });
  }

  /** 移除指定通知。 */
  remove(key: string): void {
    this.notifier.remove(key);
  }

  /** 移除所有通知。 */
  destroy(): void {
    this.notifier.destroy();
  }

  /** 資訊橫幅。 */
  info(
    message: string,
    props?: Omit<AlertBannerData, 'message' | 'severity'>,
  ): string {
    return this.add({ ...props, message, severity: 'info' });
  }

  /** 警告橫幅。 */
  warning(
    message: string,
    props?: Omit<AlertBannerData, 'message' | 'severity'>,
  ): string {
    return this.add({ ...props, message, severity: 'warning' });
  }

  /** 錯誤橫幅。 */
  error(
    message: string,
    props?: Omit<AlertBannerData, 'message' | 'severity'>,
  ): string {
    return this.add({ ...props, message, severity: 'error' });
  }
}
