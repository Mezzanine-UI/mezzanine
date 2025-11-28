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
  /** Type of the tag. */
  type: 'static';
  /** Text rendered inside label-based tags. */
  label: string;
  /** Active state. Only available on dismissable/addable tags. */
  active?: never;
  /** Numeric value displayed by counter and overflow-counter variants. */
  count?: never;
  /** Disabled state. Only available on dismissable/addable tags. */
  disabled?: never;
  /** Handler fired when the close button in dismissable tag is clicked. */
  onClose?: never;
  /** Handler fired when buttin-based tag clicked */
  onClick?: never;
  /** Applies read-only styling for dismissable tags. */
  readOnly?: never;
};
type TagPropsCounter = TagSpanHostProps & {
  type: 'counter';
  label: string;
  count: number;
  active?: never;
  disabled?: never;
  onAdd?: never;
  onClose?: never;
  onClick?: never;
  readOnly?: never;
};
type TagPropsOverflowCounter = TagButtonHostProps & {
  type: 'overflow-counter';
  count: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  active?: never;
  disabled?: never;
  label?: never;
  onAdd?: never;
  onClose?: never;
  readOnly?: never;
};
type TagPropsDismissable = TagSpanHostProps & {
  type: 'dismissable';
  active?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  label: string;
  onClose: MouseEventHandler<HTMLButtonElement>;
  count?: never;
  onAdd?: never;
  onClick?: never;
};
type TagPropsAddable = TagButtonHostProps & {
  active?: boolean;
  disabled?: boolean;
  type: 'addable';
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  count?: never;
  onClose?: never;
  readOnly?: never;
};
