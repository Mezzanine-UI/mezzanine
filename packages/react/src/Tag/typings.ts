import { TagSize } from '@mezzanine-ui/core/tag';
import { MouseEventHandler } from 'react';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

type TagNativeProps<T extends 'span' | 'button'> = Omit<
  NativeElementPropsWithoutKeyAndRef<T>,
  'onClick' | 'type'
>;

type TagBaseProps<T extends 'span' | 'button'> = TagNativeProps<T> & {
  /** Custom class names on the host element. */
  className?: string;
  /**
   * Size of the tag.
   * @default main
   */
  size?: TagSize;
};

type TagSpanHostProps = TagBaseProps<'span'>;
type TagButtonHostProps = TagBaseProps<'button'>;

export type TagProps =
  | TagPropsStatic
  | TagPropsCounter
  | TagPropsOverflowCounter
  | TagPropsDismissable
  | TagPropsAddable;

type TagPropsStatic = TagSpanHostProps & {
  /**
   * Type of the tag.
   * @default static
   */
  type?: 'static';
  /** Text rendered inside label-based tags. */
  label: string;
  /** Applies read-only styling for static/overflow-counter tags. */
  readOnly?: boolean;
  /** Active state. Only available on dismissable/addable tags. */
  active?: never;
  /** Numeric value displayed by counter/overflow-counter variants. */
  count?: never;
  /** Disabled state. Only available on overflow-counter/dismissable/addable tags. */
  disabled?: never;
  /** Handler fired when the close button in dismissable tag is clicked. */
  onClose?: never;
  /** Handler fired when button-based tag clicked */
  onClick?: never;
};
type TagPropsCounter = TagSpanHostProps & {
  /** 標籤類型：計數器模式。 */
  type: 'counter';
  /** 標籤顯示的文字。 */
  label: string;
  /** 計數器顯示的數字。 */
  count: number;
  /** 此模式下不適用。 */
  active?: never;
  /** 此模式下不適用。 */
  disabled?: never;
  /** 此模式下不適用。 */
  onClose?: never;
  /** 此模式下不適用。 */
  onClick?: never;
  /** 此模式下不適用。 */
  readOnly?: never;
};
type TagPropsOverflowCounter = TagButtonHostProps & {
  /** 標籤類型：溢出計數器模式，顯示隱藏的項目數量。 */
  type: 'overflow-counter';
  /** 溢出的項目數量。 */
  count: number;
  /**
   * 是否禁用。
   * @default false
   */
  disabled?: boolean;
  /** 點擊時的回呼函式。 */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /**
   * 是否為唯讀。
   * @default false
   */
  readOnly?: boolean;
  /** 此模式下不適用。 */
  active?: never;
  /** 此模式下不適用。 */
  label?: never;
  /** 此模式下不適用。 */
  onClose?: never;
};
type TagPropsDismissable = TagSpanHostProps & {
  /** 標籤類型：可關閉模式。 */
  type: 'dismissable';
  active?: boolean;
  disabled?: boolean;
  readOnly?: never;
  label: string;
  onClose: MouseEventHandler<HTMLButtonElement>;
  /** 此模式下不適用。 */
  count?: never;
  /** 此模式下不適用。 */
  onClick?: never;
};
type TagPropsAddable = TagButtonHostProps & {
  /** 標籤類型：可新增模式。 */
  type: 'addable';
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** 此模式下不適用。 */
  count?: never;
  /** 此模式下不適用。 */
  onClose?: never;
  readOnly?: never;
};
