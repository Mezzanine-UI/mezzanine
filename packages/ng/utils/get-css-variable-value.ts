/**
 * 讀取 `:root` 上的 CSS custom property 並解析為 px 數值。
 * 支援 `rem`、`px` 及無單位數值，與 React 的
 * `getNumericCSSVariablePixelValue` 行為一致（rem 以 16px 為基準）。
 *
 * @param variableName CSS custom property 名稱，例如 `'--mzn-spacing-size-element-loose'`
 * @param fallback 無法解析時的回退值
 */
export function getCSSVariablePixelValue(
  variableName: string,
  fallback: number = 0,
): number {
  if (typeof document === 'undefined') return fallback;

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();

  if (!raw) return fallback;

  if (raw.endsWith('rem')) {
    const n = Number(raw.slice(0, -3).trim());
    return Number.isFinite(n) ? n * 16 : fallback;
  }

  if (raw.endsWith('px')) {
    const n = Number(raw.slice(0, -2).trim());
    return Number.isFinite(n) ? n : fallback;
  }

  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}
