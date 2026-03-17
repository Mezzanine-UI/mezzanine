/**
 * 元件狀態嚴重性。
 *
 * - `'success'` — 成功，表示操作正常完成
 * - `'warning'` — 警告，表示需要注意的狀態
 * - `'error'` — 錯誤，表示操作失敗或有問題需處理
 */
export type Severity = 'success' | 'warning' | 'error';

export type SeverityWithInfo = Severity | 'info';
