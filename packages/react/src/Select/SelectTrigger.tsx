import { forwardRef, Ref } from 'react';
import {
  selectClasses as classes,
  SelectMode,
} from '@mezzanine-ui/core/select';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import TextField, { TextFieldProps } from '../TextField';
import { SelectValue } from './typings';
import { cx } from '../utils/cx';
import Tag from '../Tag';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';

export interface SelectTriggerProps
  extends
  Omit<TextFieldProps,
  | 'active'
  | 'children'
  | 'defaultChecked'
  | 'suffix'
  > {
  /**
   * Controls the chevron icon layout.
   */
  active?: boolean;
  /**
   * Other props you may provide to input element.
   */
  inputProps?: Omit<
  NativeElementPropsWithoutKeyAndRef<'input'>,
  | 'autoComplete'
  | 'children'
  | 'defaultValue'
  | 'disabled'
  | 'readOnly'
  | 'required'
  | 'type'
  | 'value'
  | `aria-${
    | 'autocomplete'
    | 'disabled'
    | 'haspopup'
    | 'multiline'
    | 'readonly'
    | 'required'
    }`
  >;
  /**
   * The ref object for input element.
   */
  inputRef?: Ref<HTMLInputElement>;
  /**
   * Controls the layout of trigger.
   */
  mode?: SelectMode;
  /**
   * The click handler for the cross icon on tags
   */
  onTagClose?: (target: SelectValue) => void;
  /**
   * Whether the input is readonly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Provide if you have a customize value rendering logic.
   * By default will have a comma between values.
   */
  renderValue?: (value: SelectValue[]) => string;
  /**
   * Whether the input is required.
   * @default false
   */
  required?: boolean;
  /**
   * The value of selection.
   * @default undefined
   */
  value?: SelectValue[];
}

const SelectTrigger = forwardRef<HTMLDivElement, SelectTriggerProps>(
  function SelectTrigger(props, ref) {
    const {
      active,
      className,
      disabled,
      inputProps,
      inputRef,
      mode,
      onTagClose,
      readOnly,
      renderValue: renderValueProp,
      required,
      size,
      suffixActionIcon: suffixActionIconProp,
      value,
      ...restTextFieldProps
    } = props;

    /** Render value to string for input */
    const renderValue = () => (
      renderValueProp?.(value || []) ??
      value?.map((v) => v.name).join(', ') ??
      ''
    );

    /** Compute suffix action icon */
    const suffixActionIcon = suffixActionIconProp || (
      <Icon
        icon={ChevronDownIcon}
        className={cx(
          classes.triggerSuffixActionIcon,
          {
            [classes.triggerSuffixActionIconActive]: active,
          },
        )}
      />
    );

    return (
      <TextField
        ref={ref}
        {...restTextFieldProps}
        active={!!value?.length}
        className={cx(classes.trigger, className)}
        disabled={disabled}
        size={size}
        suffixActionIcon={suffixActionIcon}
      >
        {mode === 'multiple' && value?.length ? (
          <div className={classes.triggerTags}>
            {value.map((selection) => (
              <Tag
                key={selection.id}
                closable
                disabled={disabled}
                onClose={(e) => {
                  e.stopPropagation();
                  onTagClose?.(selection);
                }}
                size={size}
              >
                {selection.name}
              </Tag>
            ))}
          </div>
        ) : (
          <input
            {...inputProps}
            ref={inputRef}
            aria-autocomplete="list"
            aria-disabled={disabled}
            aria-haspopup="listbox"
            aria-readonly={readOnly}
            aria-required={required}
            autoComplete="false"
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            type="search"
            value={renderValue()}
          />
        )}
      </TextField>
    );
  },
);

export default SelectTrigger;
