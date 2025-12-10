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
  type: 'counter';
  label: string;
  count: number;
  active?: never;
  disabled?: never;
  onClose?: never;
  onClick?: never;
  readOnly?: never;
};
type TagPropsOverflowCounter = TagButtonHostProps & {
  type: 'overflow-counter';
  count: number;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  readOnly?: boolean;
  active?: never;
  label?: never;
  onClose?: never;
};
type TagPropsDismissable = TagSpanHostProps & {
  type: 'dismissable';
  active?: boolean;
  disabled?: boolean;
  readOnly?: never;
  label: string;
  onClose?: MouseEventHandler<HTMLButtonElement>;
  count?: never;
  onClick?: never;
};
type TagPropsAddable = TagButtonHostProps & {
  type: 'addable';
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  count?: never;
  onClose?: never;
  readOnly?: never;
};
