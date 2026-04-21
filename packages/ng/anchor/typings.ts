/**
 * 錨點項目資料結構。
 */
export interface AnchorItemData {
  /** 是否啟用平滑滾動至目標元素。 */
  readonly autoScrollTo?: boolean;
  /** 子錨點項目。 */
  readonly children?: readonly AnchorItemData[];
  /** 是否停用此錨點。 */
  readonly disabled?: boolean;
  /** 連結目標（含 hash）。 */
  readonly href: string;
  /** 唯一識別碼。 */
  readonly id: string;
  /** 顯示名稱。 */
  readonly name: string;
  /** 點擊回呼。 */
  readonly onClick?: VoidFunction;
  /** HTML title 屬性。 */
  readonly title?: string;
}
