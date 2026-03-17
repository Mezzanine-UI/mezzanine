/**
 * Shadow types - 陰影類型
 */
export type ShadowType =
  | 'none'
  | 'raised'
  | 'floating'
  | 'modal'
  | 'table-sticky'
  | 'slider-handle'
  | 'inner-top-and-bottom';

/**
 * 聚焦效果類型。
 *
 * - `'primary'` — 主要聚焦樣式，用於一般互動元素
 * - `'error'` — 錯誤狀態聚焦樣式，用於驗證失敗的輸入元素
 */
export type FocusType = 'primary' | 'error';

/**
 * 視覺效果的使用情境。
 *
 * - `'shadow'` — 陰影效果，用於表達元素的高度與層次
 * - `'focus'` — 聚焦效果，用於表達鍵盤或互動焦點
 */
export type EffectContext = 'shadow' | 'focus';

/**
 * Effect type mapping
 */
export type EffectTypeMap = {
  shadow: ShadowType;
  focus: FocusType;
};

/**
 * 取得特定 context 的 type
 */
export type EffectTypeFor<C extends EffectContext> = EffectTypeMap[C];

/**
 * Effect 完整型別 - context + type 組合
 * @example
 * const effect: Effect = 'shadow-raised';
 * const effect2: Effect = 'focus-primary';
 */
export type Effect = {
  [C in EffectContext]: `${C}-${EffectTypeFor<C>}`;
}[EffectContext];
