import { forwardRef, Ref } from 'react';
import {
  selectClasses as classes,
} from '@mezzanine-ui/core/select';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import TextField, { TextFieldProps } from '../TextField';
import { SelectValue } from './typings';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';
import SelectTriggerTags from './SelectTriggerTags';

export type SelectTriggerInputProps = Omit<
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

export interface SelectTriggerBaseProps
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
   * Tags arg ellipsis or not.
   */
  ellipsis?: boolean;
  /**
   * force hide suffixAction icons
   */
  forceHideSuffixActionIcon?: boolean;
  /**
   * The ref for SelectTrigger root.
   */
  innerRef?: Ref<HTMLDivElement>;
  /**
   * Other props you may provide to input element.
   */
  inputProps?: SelectTriggerInputProps;
  /**
   * The ref object for input element.
   */
  inputRef?: Ref<HTMLInputElement>;
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
  renderValue?: (value: SelectValue[] | SelectValue | null) => string;
  /**
   * Whether the input is required.
   * @default false
   */
  required?: boolean;
  searchText?: string;
  showTextInputAfterTags?: boolean;
  suffixAction?: VoidFunction;
}

export type SelectTriggerMultipleProps = SelectTriggerBaseProps & {
  /**
   * Controls the layout of trigger.
   */
  mode: 'multiple';
  /**
   * The value of selection.
   * @default undefined
   */
  value?: SelectValue[];
  /**
   * Provide if you have a customize value rendering logic.
   * By default will have a comma between values.
   */
  renderValue?: (value: SelectValue[]) => string;
};

export type SelectTriggerSingleProps = SelectTriggerBaseProps & {
  /**
   * Controls the layout of trigger.
   */
  mode?: 'single';
  /**
   * The value of selection.
   * @default undefined
   */
  value?: SelectValue | null;
  /**
   * Provide if you have a customize value rendering logic.
   * By default will have a comma between values.
   */
  renderValue?: (value: SelectValue | null) => string;
};

export type SelectTriggerComponentProps = SelectTriggerMultipleProps | SelectTriggerSingleProps;
export type SelectTriggerProps = Omit<SelectTriggerComponentProps, 'innerRef'>;

function SelectTriggerComponent(props: SelectTriggerMultipleProps): JSX.Element;
function SelectTriggerComponent(props: SelectTriggerSingleProps): JSX.Element;
function SelectTriggerComponent(props: SelectTriggerComponentProps) {
  const {
    active,
    className,
    disabled,
    ellipsis = false,
    forceHideSuffixActionIcon,
    inputProps,
    innerRef,
    inputRef,
    mode,
    onTagClose,
    readOnly,
    renderValue: renderValueProp,
    required,
    searchText,
    size,
    showTextInputAfterTags = false,
    suffixAction,
    suffixActionIcon: suffixActionIconProp,
    value,
    ...restTextFieldProps
  } = props;

  /** Render value to string for input */
  const renderValue = () => {
    if (typeof renderValueProp === 'function') {
      return renderValueProp(value || (mode === 'multiple' ? [] : null));
    }

    if (value) {
      if (Array.isArray(value)) {
        return value.map((v) => v.name).join(', ');
      }

      return value.name;
    }

    return '';
  };

  /** Compute suffix action icon */
  const suffixActionIcon = suffixActionIconProp || (
    <Icon
      icon={ChevronDownIcon}
      onClick={suffixAction}
      className={cx(
        classes.triggerSuffixActionIcon,
        {
          [classes.triggerSuffixActionIconActive]: active,
        },
      )}
    />
  );

  const getTextFieldActive = () => {
    if (value) {
      if (Array.isArray(value)) {
        return !!value?.length;
      }

      return !!value;
    }

    return false;
  };

  return (
    <TextField
      ref={innerRef}
      {...restTextFieldProps}
      active={getTextFieldActive()}
      className={cx(classes.trigger, className)}
      disabled={disabled}
      size={size}
      suffixActionIcon={forceHideSuffixActionIcon ? undefined : suffixActionIcon}
    >
      {mode === 'multiple' && (value as SelectValue[])?.length ? (
        <SelectTriggerTags
          disabled={disabled}
          ellipsis={ellipsis}
          inputProps={inputProps}
          inputRef={inputRef}
          onTagClose={onTagClose}
          readOnly={readOnly}
          required={required}
          searchText={searchText}
          size={size}
          showTextInputAfterTags={showTextInputAfterTags}
          value={value}
        />
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
}

const SelectTrigger = forwardRef<HTMLDivElement, SelectTriggerProps>((props, ref) => {
  if (props.mode === 'multiple') {
    return (
      <SelectTriggerComponent {...(props as SelectTriggerMultipleProps)} innerRef={ref} />
    );
  }

  return (
    <SelectTriggerComponent {...(props as SelectTriggerSingleProps)} innerRef={ref} />
  );
});

export default SelectTrigger;
