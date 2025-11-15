import { TagSize, TagType } from '@mezzanine-ui/core/tag';
import { MouseEventHandler } from 'react';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

/**
 * Props for the Tag component covering static, counter, overflow, dismissable, and addable variants.
 */
export type TagProps = TagPropsShared &
  (
    | TagPropsStatic
    | TagPropsCounter
    | TagPropsOverflowCounter
    | TagPropsDismissable
    | TagPropsAddable
  );

type TagPropsShared = NativeElementPropsWithoutKeyAndRef<'span'> & {
  /** Custom class names on the host element. */
  className?: string;
  /** Active state. Only available on dismissable/addable tags. */
  active?: boolean;
  /** Disabled state. Only available on dismissable/addable tags. */
  disabled?: boolean;
  /** Text rendered inside label-based tags. */
  label?: string;
  /** Numeric value displayed by counter and overflow-counter variants. */
  count?: number;
  /** Handler fired when the addable tag is clicked. */
  onAdd?: () => void;
  /** Handler fired when the close button is clicked. */
  onClose?: MouseEventHandler;
  /** Applies read-only styling for dismissable tags. */
  readOnly?: boolean;
  /**
   * Size of the tag.
   * @default main
   */
  size?: TagSize;
  /**
   * Type of the tag.
   */
  type: TagType;
};

type TagPropsStatic = {
  active?: never;
  count?: never;
  disabled?: never;
  onAdd?: never;
  onClose?: never;
  readOnly?: never;
  label: string;
  type: 'static';
};

type TagPropsCounter = {
  active?: never;
  disabled?: never;
  onAdd?: never;
  onClose?: never;
  readOnly?: never;
  label: string;
  count: number;
  type: 'counter';
};

type TagPropsOverflowCounter = {
  active?: never;
  disabled?: never;
  label?: never;
  onAdd?: never;
  onClose?: never;
  readOnly?: never;
  count: number;
  type: 'overflow-counter';
};

type TagPropsDismissable = {
  count?: never;
  onAdd?: never;
  label: string;
  onClose: MouseEventHandler;
  type: 'dismissable';
};

type TagPropsAddable = {
  count?: never;
  onClose?: never;
  readOnly?: never;
  label: string;
  type: 'addable';
};
