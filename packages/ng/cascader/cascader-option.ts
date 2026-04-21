/**
 * 串接式選單的選項資料結構。
 *
 * 每個選項可包含子選項（`children`），形成樹狀結構供使用者逐層選取。
 */
export interface CascaderOption {
  /** 子選項清單。若有值，代表此選項為非葉節點，點選後展開下一層面板。 */
  readonly children?: CascaderOption[];

  /** 是否停用此選項。 */
  readonly disabled?: boolean;

  /** 選項的唯一識別碼。 */
  readonly id: string;

  /** 選項顯示名稱。 */
  readonly name: string;
}
