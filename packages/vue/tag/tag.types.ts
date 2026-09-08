import type { TagSize, TagType } from '@mezzanine-ui/core/tag';

/**
 * The five tag variants React expresses as a discriminated union on `type`,
 * flattened into one interface.
 *
 * Vue's `defineProps` resolves a union whose members discriminate on a literal
 * down to something unusable — the same limitation TextField's and Input's
 * props document — so every variant's props live here as optional. The prop
 * names, their types and the runtime behaviour are unchanged; what is lost is
 * the compile-time guarantee that, say, `count` cannot be passed to a `static`
 * tag.
 *
 * `label` and `count` are required by the variants that render them, so they
 * cannot be marked required here either; the component renders nothing for a
 * missing one, exactly as React would with `undefined`.
 */
export interface TagProps {
  /**
   * Active state. Only available on dismissable/addable tags.
   * @default false
   */
  active?: boolean;
  /**
   * Numeric value displayed by counter/overflow-counter variants.
   */
  count?: number;
  /**
   * Disabled state. Only available on overflow-counter/dismissable/addable tags.
   * @default false
   */
  disabled?: boolean;
  /**
   * Text rendered inside label-based tags.
   */
  label?: string;
  /**
   * Applies read-only styling for static/overflow-counter tags.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Size of the tag.
   * @default 'main'
   */
  size?: TagSize;
  /**
   * Type of the tag.
   * @default 'static'
   */
  type?: TagType;
}
