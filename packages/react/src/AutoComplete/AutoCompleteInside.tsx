'use client';

import { type MouseEventHandler, type Ref } from 'react';

import type { InputProps } from '../Input';
import Input from '../Input';
import type { SelectTriggerInputProps } from '../Select/typings';

export interface AutoCompleteInsideTriggerProps {
  /**
   * Disabled state for the input.
   */
  disabled: boolean;
  /**
   * Error state for the input.
   */
  error: boolean;
  /**
   * Whether the trigger should render as active (focused/open).
   */
  active: boolean;
  /**
   * Input display value (usually the current search text).
   */
  value: string;
  /**
   * Input placeholder text.
   */
  placeholder?: string;
  /**
   * Input variant sizing.
   */
  size?: InputProps['size'];
  /**
   * Whether the input should occupy full width.
   */
  fullWidth?: boolean;
  /**
   * Additional class name for the trigger.
   */
  className?: string;
  /**
   * Input ref (points to the underlying <input/> element).
   */
  inputRef?: Ref<HTMLInputElement>;
  /**
   * Props forwarded to the underlying input element.
   */
  resolvedInputProps: SelectTriggerInputProps;
  /**
   * Whether to show the clear icon.
   */
  clearable: boolean;
  /**
   * Input clear handler.
   */
  onClear?: MouseEventHandler;
}

function extractIdAndName(props: SelectTriggerInputProps) {
  const { id, name, readOnly, onChange, ...rest } = props;
  return { id, name, readOnly, onChange, rest };
}

export default function AutoCompleteInsideTrigger(
  props: AutoCompleteInsideTriggerProps,
) {
  const {
    active,
    className,
    clearable,
    disabled,
    error,
    fullWidth,
    inputRef,
    onClear,
    placeholder,
    resolvedInputProps,
    size,
    value,
  } = props;

  const { id, name, readOnly, onChange, rest } =
    extractIdAndName(resolvedInputProps);

  return (
    <Input
      active={active}
      className={className}
      {...(disabled ? { disabled: true as const } : {})}
      error={error}
      fullWidth={fullWidth}
      id={id}
      name={name}
      placeholder={placeholder}
      readonly={readOnly || undefined}
      onChange={onChange}
      size={size}
      value={value}
      clearable={clearable}
      onClear={onClear}
      // keep clear icon visibility behavior consistent with SelectTrigger
      forceShowClearable={clearable}
      inputRef={inputRef}
      inputProps={rest}
    />
  );
}
