// ============================================================================
// Legacy Palette Types (將被 Semantic Colors 取代)
// ============================================================================

/** @deprecated Legacy */
export type MainColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'warning'
  | 'success';

/** @deprecated Legacy */
export type GradualMainColor = `${MainColor}-${'light' | 'dark'}`;

/** @deprecated Legacy */
export type StatefulMainColor = `${MainColor}-${'hover-bg' | 'active-bg'}`;

/** @deprecated Legacy */
export type MainContrastTextColor = `on-${MainColor}`;

/** @deprecated Legacy */
export type TextColor = `text-${'primary' | 'secondary' | 'disabled'}`;

/** @deprecated Legacy */
export type ActionForegroundColor =
  `action-${'active' | 'inactive' | 'disabled'}`;
/** @deprecated Legacy */
export type ActionBackgroundColor = `action-${'disabled-bg'}`;
/** @deprecated Legacy */
export type ActionColor = ActionForegroundColor | ActionBackgroundColor;

/** @deprecated Legacy */
export type Color =
  | MainColor
  | GradualMainColor
  | MainContrastTextColor
  | TextColor
  | ActionColor
  | 'bg'
  | 'surface'
  | 'border'
  | 'divider';

// ============================================================================
// Semantic Colors Types (新版顏色系統)
// ============================================================================

/**
 * Semantic color contexts - 語意化顏色的使用情境
 */
export type SemanticContext =
  | 'layer'
  | 'background'
  | 'text'
  | 'icon'
  | 'border'
  | 'separator'
  | 'overlay'
  | 'surface'
  | 'shadow';

/**
 * 圖層層級調性。
 *
 * - `'01'` — 第一層，最底層的介面層級
 * - `'02'` — 第二層，疊加於第一層之上
 * - `'03'` — 第三層，最高的介面層級
 */
export type LayerTone = '01' | '02' | '03';

/**
 * Background tones - 背景顏色調性
 */
export type BackgroundTone =
  | 'base'
  | 'menu'
  | 'inverse'
  | 'fixed-dark'
  | 'neutral-ghost'
  | 'neutral-faint'
  | 'neutral-subtle'
  | 'neutral'
  | 'neutral-strong'
  | 'neutral-solid'
  | 'brand-ghost'
  | 'brand-faint'
  | 'brand-subtle'
  | 'brand-light'
  | 'brand'
  | 'brand-strong'
  | 'brand-solid'
  | 'error-ghost'
  | 'error-faint'
  | 'error-subtle'
  | 'error-light'
  | 'error'
  | 'error-strong'
  | 'error-solid'
  | 'warning-ghost'
  | 'warning-faint'
  | 'warning'
  | 'success-ghost'
  | 'success-faint'
  | 'success'
  | 'info-ghost'
  | 'info-faint'
  | 'info';

/**
 * Text tones - 文字顏色調性
 */
export type TextTone =
  | 'fixed-light'
  | 'neutral-faint'
  | 'neutral-light'
  | 'neutral'
  | 'neutral-strong'
  | 'neutral-solid'
  | 'brand'
  | 'brand-strong'
  | 'brand-solid'
  | 'error'
  | 'error-strong'
  | 'error-solid'
  | 'warning'
  | 'warning-strong'
  | 'success'
  | 'info'
  | 'info-strong';

/**
 * Icon tones - 圖示顏色調性
 */
export type IconTone =
  | 'fixed-light'
  | 'neutral-faint'
  | 'neutral-light'
  | 'neutral'
  | 'neutral-strong'
  | 'neutral-bold'
  | 'neutral-solid'
  | 'brand'
  | 'brand-strong'
  | 'brand-solid'
  | 'error'
  | 'error-strong'
  | 'error-solid'
  | 'warning'
  | 'warning-strong'
  | 'success'
  | 'success-strong'
  | 'info'
  | 'info-strong';

/**
 * Border tones - 邊框顏色調性
 */
export type BorderTone =
  | 'fixed-light'
  | 'fixed-light-alpha'
  | 'neutral-faint'
  | 'neutral-light'
  | 'neutral'
  | 'neutral-strong'
  | 'brand'
  | 'error-subtle'
  | 'error'
  | 'warning-subtle'
  | 'warning';

/**
 * Separator tones - 分隔線顏色調性
 */
export type SeparatorTone =
  | 'neutral-faint'
  | 'neutral-light'
  | 'neutral'
  | 'brand';

/**
 * 遮罩顏色調性。
 *
 * - `'strong'` — 深色遮罩，遮蔽效果最強
 * - `'default'` — 預設遮罩，適用於一般對話框或抽屜
 * - `'subtle'` — 淡色遮罩，視覺干擾最低
 */
export type OverlayTone = 'strong' | 'default' | 'subtle';

/**
 * 表面顏色調性（半透明）。
 *
 * - `'solid'` — 不透明實色表面
 * - `'strong'` — 較高不透明度的半透明表面
 * - `'subtle'` — 較低不透明度的半透明表面
 * - `'ghost'` — 極淡的幾乎全透明表面
 */
export type SurfaceTone = 'solid' | 'strong' | 'subtle' | 'ghost';

/**
 * Shadow tones - 陰影顏色調性
 */
export type ShadowTone =
  | 'dark'
  | 'dark-light'
  | 'dark-faint'
  | 'dark-ghost'
  | 'light-faint'
  | 'brand';

/**
 * 所有 semantic tones 的聯集型別
 */
export type SemanticTone =
  | LayerTone
  | BackgroundTone
  | TextTone
  | IconTone
  | BorderTone
  | SeparatorTone
  | OverlayTone
  | SurfaceTone
  | ShadowTone;

/**
 * Context 與對應 Tone 的映射型別
 */
export type SemanticToneMap = {
  layer: LayerTone;
  background: BackgroundTone;
  text: TextTone;
  icon: IconTone;
  border: BorderTone;
  separator: SeparatorTone;
  overlay: OverlayTone;
  surface: SurfaceTone;
  shadow: ShadowTone;
};

/**
 * 取得特定 context 的 tone 型別
 * @example
 * type BgTone = SemanticToneFor<'background'>;
 */
export type SemanticToneFor<C extends SemanticContext> = SemanticToneMap[C];

/**
 * Semantic color 完整型別 - context + tone 組合
 * @example
 * const color: SemanticColor = 'background-brand';
 * const color2: SemanticColor = 'text-neutral';
 */
export type SemanticColor = {
  [C in SemanticContext]: `${C}-${SemanticToneFor<C>}`;
}[SemanticContext];

/**
 * 介面顏色模式。
 *
 * - `'light'` — 淺色模式，適用於明亮環境
 * - `'dark'` — 深色模式，適用於低光或夜間環境
 */
export type ColorMode = 'light' | 'dark';
