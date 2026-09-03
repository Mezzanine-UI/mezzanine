/**
 * `disabled` and `readOnly` are only meaningful when `type` is `'default'`, and
 * React encodes that as a discriminated union whose `'warning' | 'error'` member
 * types both of them as `never`.
 *
 * Vue cannot express it: `defineProps` collapses such a union to `never` for the
 * whole props object — see the same note on `TextFieldProps`. The prop set, their
 * types and the runtime behaviour are identical to React's; only the compile-time
 * guarantee is lost, and the runtime already ignores both props unless
 * `type === 'default'`, exactly as React does.
 *
 * The unions below are written inline rather than extracted into exported
 * aliases, mirroring React — and it is also what keeps the two Controls panels
 * identical, since `vue-component-meta` cannot see the members of an imported
 * type alias.
 */
export interface TextareaProps {
  /**
   * Disabled state of the textarea. Only available on `type="default"`.
   * @default false
   */
  disabled?: boolean;
  /**
   * ReadOnly state of the textarea. Only available on `type="default"`.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Controls textarea CSS `resize` behavior with native `resize` values.
   * Any value other than `'none'` also renders the resize handle icon.
   * @default 'none'
   */
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  /**
   * ClassName apply to textarea.
   */
  textareaClassName?: string;
  /**
   * Set visual style type of the textarea.
   * @default 'default'
   */
  type?: 'default' | 'warning' | 'error';
}
