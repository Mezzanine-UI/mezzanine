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
 * Focus types - 聚焦類型
 */
export type FocusType = 'primary' | 'error';

/**
 * Effect contexts - 效果情境
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
