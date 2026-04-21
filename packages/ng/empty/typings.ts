export type EmptyType =
  | 'custom'
  | 'initial-data'
  | 'notification'
  | 'result'
  | 'system';

/**
 * 單一行動按鈕的設定物件，對應 React `ButtonProps` 的子集。
 *
 * 刻意省略 `size`、`variant` — Empty 會統一控制這兩項以確保風格一致。
 */
export interface EmptyActionConfig {
  /** 按鈕顯示文字。 */
  children?: string;
  /** 是否禁用。 */
  disabled?: boolean;
  /** 是否顯示載入狀態。 */
  loading?: boolean;
  /** 點擊事件處理函式。 */
  onClick?: () => void;
}

/**
 * Empty 的 `actions` input 合法型別。
 *
 * - 單一物件：視為 secondary 按鈕。
 * - `{ primaryButton?, secondaryButton }`：分別對應主/次按鈕。
 *
 * 鏡像 React `EmptyProps['actions']`。
 */
export type EmptyActions =
  | EmptyActionConfig
  | {
      primaryButton?: EmptyActionConfig;
      secondaryButton: EmptyActionConfig;
    };
