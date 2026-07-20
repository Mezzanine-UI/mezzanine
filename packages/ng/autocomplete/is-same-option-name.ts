/**
 * 正規化選項名稱以供比較;預設轉為小寫忽略大小寫,`caseSensitive` 為
 * `true` 時原樣返回,不做任何轉換。
 *
 * 是 `isSameOptionName`、選項過濾(substring 比對)、與批次新增流程
 * 中以 `Set` 判斷是否重複的共用基礎,避免每個呼叫點各自寫一份
 * `caseSensitive ? x : x.toLowerCase()` 三元判斷。
 */
export function normalizeOptionName(
  name: string,
  caseSensitive = false,
): string {
  return caseSensitive ? name : name.toLowerCase();
}

/**
 * 比較兩個選項名稱是否相同;預設忽略大小寫,`caseSensitive` 為 `true`
 * 時才比對完全一致的字母大小寫。
 *
 * 對齊 React `isSameOptionName`(`packages/react/src/AutoComplete/isSameOptionName.ts`):
 * 選項過濾與 `addable` 模式的重複檢查共用同一份語義 — 若輸入
 * `colorado` 能在清單中找到 `Colorado`,建立流程也必須視為同一個選項,
 * 否則 `addable` 模式會誤將使用者已看到的選項當成可建立的新項目。
 */
export function isSameOptionName(
  a: string,
  b: string,
  caseSensitive = false,
): boolean {
  return (
    normalizeOptionName(a, caseSensitive) ===
    normalizeOptionName(b, caseSensitive)
  );
}
