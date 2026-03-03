/**
 * Spacing primitive scales - 間距原始級距（對應 px 值）
 */
export type SpacingScale =
  | 0
  | 1
  | 2
  | 4
  | 6
  | 8
  | 10
  | 12
  | 14
  | 16
  | 18
  | 20
  | 24
  | 28
  | 32
  | 36
  | 40
  | 48
  | 52
  | 56
  | 60
  | 64
  | 80
  | 160
  | 240
  | 280
  | 320
  | 360
  | 400
  | 480
  | 560
  | 640
  | 720
  | 960
  | 1140;

/**
 * Spacing primitives configuration
 */
export type SpacingPrimitives = Partial<Record<SpacingScale, string | number>>;

/**
 * Spacing semantic contexts - 語意化間距的使用情境
 */
export type SpacingContext = 'size' | 'gap' | 'padding';

/**
 * Spacing mode - 間距模式
 */
export type SpacingMode = 'default' | 'compact';

/**
 * Size categories - 尺寸分類
 */
export type SizeCategory = 'element' | 'container';

/**
 * Padding categories - 內邊距分類
 */
export type PaddingCategory = 'horizontal' | 'vertical';

/**
 * Element size tones - 元素尺寸調性
 */
export type ElementTone =
  | 'hairline'
  | 'tiny'
  | 'tight'
  | 'compact'
  | 'slim'
  | 'narrow'
  | 'base'
  | 'base-fixed'
  | 'gentle'
  | 'relaxed'
  | 'airy'
  | 'roomy'
  | 'loose'
  | 'extra-wide'
  | 'extra-wide-condense'
  | 'expansive'
  | 'extra'
  | 'max';

/**
 * Container size tones - 容器尺寸調性
 */
export type ContainerTone =
  | 'collapsed'
  | 'tiny'
  | 'tight'
  | 'slim'
  | 'slender'
  | 'narrow'
  | 'compact'
  | 'standard'
  | 'balanced'
  | 'broad'
  | 'wide'
  | 'expanded'
  | 'max';

/**
 * Gap tones - 間隙調性
 */
export type GapTone =
  | 'none'
  | 'micro'
  | 'tiny'
  | 'tight'
  | 'compact'
  | 'base'
  | 'base-fixed'
  | 'comfortable'
  | 'roomy'
  | 'spacious'
  | 'relaxed'
  | 'airy'
  | 'generous'
  | 'breath'
  | 'wide';

/**
 * Horizontal padding tones - 水平內邊距調性
 */
export type HorizontalPaddingTone =
  | 'none'
  | 'micro'
  | 'tiny'
  | 'tiny-fixed'
  | 'tight'
  | 'tight-fixed'
  | 'base'
  | 'base-fixed'
  | 'calm'
  | 'comfort'
  | 'comfort-fixed'
  | 'roomy'
  | 'spacious'
  | 'relaxed'
  | 'airy'
  | 'breath'
  | 'wide'
  | 'max';

/**
 * Vertical padding tones - 垂直內邊距調性
 */
export type VerticalPaddingTone =
  | 'none'
  | 'micro'
  | 'tiny'
  | 'tight'
  | 'base'
  | 'calm'
  | 'comfort'
  | 'roomy'
  | 'spacious'
  | 'generous'
  | 'relaxed';

/**
 * Category 與對應 Tone 的映射型別
 */
export type SpacingToneMap = {
  size: {
    element: ElementTone;
    container: ContainerTone;
  };
  gap: GapTone;
  padding: {
    horizontal: HorizontalPaddingTone;
    vertical: VerticalPaddingTone;
  };
};

/**
 * 取得特定 context 的 tone 型別
 * @example
 * type GapT = SpacingToneFor<'gap'>; // GapTone
 */
export type SpacingToneFor<C extends SpacingContext> =
  SpacingToneMap[C] extends infer T
    ? T extends { element: any }
      ? never // size 和 padding 需要指定 category
      : T
    : never;

/**
 * 取得特定 context + category 的 tone 型別
 * @example
 * type EleTone = SpacingCategoryToneFor<'size', 'element'>; // ElementTone
 */
export type SpacingCategoryToneFor<
  C extends SpacingContext,
  Cat extends C extends 'size'
    ? SizeCategory
    : C extends 'padding'
      ? PaddingCategory
      : never,
> = C extends 'size'
  ? Cat extends SizeCategory
    ? SpacingToneMap['size'][Cat]
    : never
  : C extends 'padding'
    ? Cat extends PaddingCategory
      ? SpacingToneMap['padding'][Cat]
      : never
    : never;

/**
 * Semantic spacing 完整型別 - context + category + tone 組合
 * @example
 * const spacing1: SemanticSpacing = 'size-element-base';
 * const spacing2: SemanticSpacing = 'gap-comfortable';
 * const spacing3: SemanticSpacing = 'padding-horizontal-calm';
 */
export type SemanticSpacing =
  | `size-element-${ElementTone}`
  | `size-container-${ContainerTone}`
  | `gap-${GapTone}`
  | `padding-horizontal-${HorizontalPaddingTone}`
  | `padding-vertical-${VerticalPaddingTone}`;
