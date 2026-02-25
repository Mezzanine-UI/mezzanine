'use client';

import { selectClasses as classes } from '@mezzanine-ui/core/select';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import { forwardRef } from 'react';
import TextField, { TextFieldInteractiveStateProps } from '../TextField';
import { cx } from '../utils/cx';
import {
  SelectTriggerComponentProps,
  SelectTriggerMultipleProps,
  SelectTriggerProps,
} from './typings';

import Icon from '../Icon';
import SelectTriggerTags from './SelectTriggerTags';

const isMultipleSelection = (
  props: SelectTriggerComponentProps,
): props is SelectTriggerMultipleProps => props.mode === 'multiple';

function SelectTriggerComponent(props: SelectTriggerComponentProps) {
  const {
    active,
    className,
    clearable: clearableProp = false,
    disabled,
    forceHideSuffixActionIcon,
    inputProps,
    innerRef,
    inputRef,
    isForceClearable = false,
    mode = 'single',
    onTagClose,
    overflowStrategy = 'counter',
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

  const renderValueProp = 'renderValue' in props ? props.renderValue : undefined;

  // Exclude renderValue to avoid leaking unknown props to DOM.
  const sanitizedTextFieldProps = (() => {
    if ('renderValue' in restTextFieldProps) {
      const { renderValue: _removed, ...rest } = restTextFieldProps;
      return rest;
    }
    return restTextFieldProps;
  })();

  /** Render value to string for single selection trigger input */
  const renderValue = () => {
    if (isMultipleSelection(props)) return;

    if (typeof renderValueProp === 'function') {
      return renderValueProp(props.value);
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
          // Delegate to trigger click behavior without fabricating a synthetic event.
          e.currentTarget
            .closest(`.${classes.trigger}`)
            ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
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

  const hasMultipleSelections =
    mode === 'multiple' && Array.isArray(props.value) && props.value.length > 0;
  const shouldEnableClearable =
    isForceClearable || (clearableProp && hasMultipleSelections);

  return (
    <TextField
      ref={innerRef}
      {...interactiveProps}
      {...sanitizedTextFieldProps}
      onClick={onClick}
      active={active}
      className={cx(
        classes.trigger,
        classes.triggerMode(mode),
        classes.triggerSelected(
          Array.isArray(props.value) ? props.value?.length : props.value,
        ),
        {
          [classes.triggerReadOnly]: readOnly,
          [classes.triggerDisabled]: disabled,
        },
        className,
      )}
      error={type === 'error'}
      forceShowClearable={shouldEnableClearable}
      size={size}
      suffix={forceHideSuffixActionIcon ? undefined : suffixActionIcon}
      clearable={shouldEnableClearable}
    >
      <input
        {...inputProps}
        ref={inputRef}
        aria-autocomplete="list"
        aria-haspopup="listbox"
        autoComplete="off"
        className={cx(classes.triggerInput, inputProps?.className)}
        disabled={disabled}
        placeholder={placeholder}
        readOnly={inputProps?.readOnly ?? true}
        required={required}
        type="text"
        value={renderValue()}
      />

      {
        isMultipleSelection(props) && props.value?.length
          ? (
            <SelectTriggerTags
              disabled={disabled}
              overflowStrategy={overflowStrategy}
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
          )
          : null
      }
    </TextField>
  );
}

const SelectTrigger = forwardRef<HTMLDivElement, SelectTriggerProps>(
  (props, ref) => {
    if (props.mode === 'multiple') {
      const {
        mode: _mode,
        value,
        ...multipleModeProps
      } = props;

      return (
        <SelectTriggerComponent
          {...multipleModeProps}
          innerRef={ref}
          mode="multiple"
          value={Array.isArray(value) ? value : undefined}
        />
      );
    }

    const {
      mode: _mode,
      overflowStrategy: _overflowStrategy,
      value,
      ...singleModeProps
    } = props;

    return (
      <SelectTriggerComponent
        {...singleModeProps}
        innerRef={ref}
        mode="single"
        value={Array.isArray(value) ? undefined : value}
      />
    );
  },
);

export default SelectTrigger;
