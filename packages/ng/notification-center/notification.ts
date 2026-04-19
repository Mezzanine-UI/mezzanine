import type {
  NotificationSeverity,
  NotificationType,
} from '@mezzanine-ui/core/notification-center';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';

export type { NotificationSeverity, NotificationType };

/**
 * 通知項目設定（對齊 React `NotificationData` 形狀）。
 * 用於 `MznNotificationCenterDrawer` 的 `[notificationList]` input，
 * 或直接以 props 組合渲染 `<div mznNotificationCenter>` 單項。
 */
export interface NotificationItem {
  /**
   * 唯一識別鍵，用於時間分組排序與抽屜列表追蹤（對應 React `key`）。
   * 使用 `MznNotificationCenterDrawer` 的 `[notificationList]` 時必填；
   * 其他情境可留空，元件會 fallback 到 `id`。
   */
  readonly key?: string | number;

  /** 通知類型。@default 'drawer' */
  readonly type?: NotificationType;

  /** 嚴重程度。@default 'info' */
  readonly severity?: NotificationSeverity;

  /** 標題。 */
  readonly title?: string;

  /** 描述內容。 */
  readonly description?: string;

  /** 確認按鈕文字；搭配 `onConfirm` 使用時才顯示。 */
  readonly confirmButtonText?: string;

  /** 取消按鈕文字；搭配 `onCancel` / `onClose` 時才顯示。 */
  readonly cancelButtonText?: string;

  /** 時間戳記，可傳 `Date`、ISO 字串或數字（毫秒）。 */
  readonly timeStamp?: string | number | Date;

  /** 時間戳記地區。@default 'zh-TW' */
  readonly timeStampLocale?: string;

  /** 項目上方的時間分組標籤（例如「今天」）。 */
  readonly prependTips?: string;

  /** 項目下方的備註文字。 */
  readonly appendTips?: string;

  /** drawer mode 右上角點點按鈕上的紅點徽章。 */
  readonly showBadge?: boolean;

  /** drawer mode 點點按鈕打開的 Dropdown 選項。 */
  readonly options?: readonly DropdownOption[];

  /**
   * @deprecated 舊版 Angular-only API 保留相容用，請改用 `key`。
   */
  readonly id?: string;

  /** @deprecated 舊版 Angular-only API 保留相容用。 */
  readonly timestamp?: Date;

  /** @deprecated 舊版 Angular-only API 保留相容用。 */
  readonly read?: boolean;
}
