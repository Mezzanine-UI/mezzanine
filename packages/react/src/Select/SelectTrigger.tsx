'use client';

import { forwardRef, MouseEventHandler, type JSX } from 'react';
import { selectClasses as classes } from '@mezzanine-ui/core/select';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import TextField, { TextFieldInteractiveStateProps } from '../TextField';
import {
  SelectTriggerComponentProps,
  SelectTriggerMultipleProps,
  SelectTriggerProps,
  SelectTriggerSingleProps,
} from './typings';
import { cx } from '../utils/cx';

import Icon from '../Icon';
import SelectTriggerTags from './SelectTriggerTags';

const isMultipleSelection = (
  props: SelectTriggerComponentProps,
): props is SelectTriggerMultipleProps => props.mode === 'multiple';

function SelectTriggerComponent(props: SelectTriggerMultipleProps): JSX.Element;
function SelectTriggerComponent(props: SelectTriggerSingleProps): JSX.Element;
function SelectTriggerComponent(props: SelectTriggerComponentProps) {
  const {
    active,
    className,
    disabled,
    ellipsis,
    forceHideSuffixActionIcon,
    inputProps,
    innerRef,
    inputRef,
    mode = 'single',
    onTagClose,
    placeholder,
    readOnly,
    required,
    searchText,
    size = 'main',
    showTextInputAfterTags = false,
    suffixAction,
    suffixActionIcon: suffixActionIconProp,
    type = 'default',
    onClick,
    ...restTextFieldProps
  } = props;

  /** Render value to string for single selection trigger input */
  const renderValue = () => {
    if (isMultipleSelection(props)) return;

    if (typeof props.renderValue === 'function') {
      return props.renderValue(props.value);
    }

    return props.value?.name ?? '';
  };

  /** Compute suffix action icon */
  const suffixActionIcon = suffixActionIconProp || (
    <Icon
      icon={ChevronDownIcon}
      onClick={(e) => {
        e.stopPropagation();

        if (suffixAction) {
          suffixAction();
        } else {
          (onClick as MouseEventHandler)?.(e);
        }
      }}
      className={cx(classes.triggerSuffixActionIcon, {
        [classes.triggerSuffixActionIconActive]: active,
      })}
    />
  );

  const interactiveProps: TextFieldInteractiveStateProps = (() => {
    if (disabled) {
      return { disabled: true };
    }

    if (readOnly) {
      return { readonly: true };
    }

    return {};
  })();

  return (
    <TextField
      ref={innerRef}
      {...interactiveProps}
      {...restTextFieldProps}
      onClick={onClick}
      active={active}
      className={cx(
        classes.trigger,
        classes.triggerMode(mode),
        classes.triggerSelected(
          Array.isArray(props.value) ? props.value?.length : props.value,
        ),
        className,
      )}
      error={type === 'error'}
      size={size}
      suffix={forceHideSuffixActionIcon ? undefined : suffixActionIcon}
    >
      {isMultipleSelection(props) && props.value?.length ? (
        <SelectTriggerTags
          disabled={disabled}
          ellipsis={ellipsis ?? false}
          inputProps={inputProps}
          inputRef={inputRef}
          onTagClose={onTagClose}
          readOnly={readOnly}
          required={required}
          searchText={searchText}
          size={size}
          showTextInputAfterTags={showTextInputAfterTags}
          value={props.value}
        />
      ) : (
        <input
          {...inputProps}
          ref={inputRef}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          readOnly={inputProps?.readOnly ?? true}
          required={required}
          type="text"
          value={renderValue()}
        />
      )}
    </TextField>
  );
}

const SelectTrigger = forwardRef<HTMLDivElement, SelectTriggerProps>(
  (props, ref) => {
    if (props.mode === 'multiple') {
      return (
        <SelectTriggerComponent
          {...(props as SelectTriggerMultipleProps)}
          innerRef={ref}
        />
      );
    }

    return (
      <SelectTriggerComponent
        {...(props as SelectTriggerSingleProps)}
        innerRef={ref}
      />
    );
  },
);

export default SelectTrigger;
