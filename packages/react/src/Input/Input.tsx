'use client';

import {
  forwardRef,
  Ref,
  ChangeEventHandler,
  useRef,
  ReactNode,
  useState,
  MouseEventHandler,
} from 'react';
import { inputClasses as classes } from '@mezzanine-ui/core/input';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { useInputWithClearControlValue } from '../Form/useInputWithClearControlValue';
import TextField, { TextFieldAffixProps, TextFieldProps } from '../TextField';
import {
  SearchIcon,
  EyeIcon,
  EyeInvisibleIcon,
  IconDefinition,
} from '@mezzanine-ui/icons';
import Icon from '../Icon';
import SpinnerButton from './SpinnerButton';
import ActionButton from './ActionButton';
import SelectButton from './SelectButton';

/**
 * Base props shared by all Input variants
 */
export interface InputBaseProps
  extends Omit<
    TextFieldProps,
    'children' | 'clearable' | 'onClear' | 'prefix' | 'suffix'
  > {
  /**
   * The default value of input.
   */
  defaultValue?: string;
  /**
   * The react ref passed to input element.
   */
  inputRef?: Ref<HTMLInputElement>;
  /**
   * The other native props for input element.
   */
  inputProps?: Omit<
    NativeElementPropsWithoutKeyAndRef<'input'>,
    | 'defaultValue'
    | 'disabled'
    | 'onChange'
    | 'placeholder'
    | 'readOnly'
    | 'required'
    | 'value'
    | 'type'
    | `aria-${'disabled' | 'multiline' | 'readonly' | 'required'}`
  >;
  /**
   * The change event handler of input element.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * The placeholder of input.
   */
  placeholder?: string;
  /**
   * The value of input.
   */
  value?: string;
}

/**
 * Clearable props
 */
export type ClearableInput = Pick<TextFieldProps, 'clearable' | 'onClear'>;

/**
 * 1. Base Input - Basic input field
 */
export type BaseInputProps = InputBaseProps &
  ClearableInput & {
    /**
     * The type of input.
     * @default 'base'
     */
    type?: 'base';
  };

/**
 * 2. With Affix Input - Input with prefix/suffix decorations
 */
export type WithAffixInputProps = InputBaseProps &
  TextFieldAffixProps &
  ClearableInput & {
    type: 'affix';
  };

/**
 * 3. Search Input - Input with search icon prefix
 */
export type SearchInputProps = InputBaseProps &
  ClearableInput & {
    type: 'search';
  };

/**
 * 4. Number Input - Small numeric input (36x36)
 */
export type NumberInputProps = InputBaseProps & {
  type: 'number';
  /**
   * The minimum value.
   */
  min?: number;
  /**
   * The maximum value.
   */
  max?: number;
  /**
   * The step value.
   * @default 1
   */
  step?: number;
};

/**
 * 5. Unit Input - Input with unit text and spinner buttons
 */
export type UnitInputProps = InputBaseProps & {
  type: 'unit';
  /**
   * The unit text to show in suffix.
   */
  unit?: string;
  /**
   * Whether to show spinner buttons.
   * @default false
   */
  showSpinner?: boolean;
  /**
   * The minimum value.
   */
  min?: number;
  /**
   * The maximum value.
   */
  max?: number;
  /**
   * The step value.
   * @default 1
   */
  step?: number;
  /**
   * Callback when spinner up button is clicked.
   */
  onSpinUp?: () => void;
  /**
   * Callback when spinner down button is clicked.
   */
  onSpinDown?: () => void;
};

/**
 * 6. Action Input - Input with action button (button is adjacent to TextField, not inside)
 */
export type ActionInputProps = InputBaseProps & {
  type: 'action';
  /**
   * The action button props.
   */
  actionButton: {
    /**
     * The icon of action button.
     */
    icon?: IconDefinition;
    /**
     * The label of action button.
     */
    label: string;
    /**
     * The click handler of action button.
     */
    onClick: MouseEventHandler<HTMLButtonElement>;
    /**
     * Whether the action button is disabled.
     */
    disabled?: boolean;
  };
};

/**
 * 7. Select Input - Input with select button (button is adjacent to TextField, not inside)
 */
export type SelectInputProps = InputBaseProps & {
  type: 'select';
  /**
   * The select button props.
   */
  selectButton: {
    /**
     * The value of select button.
     */
    value: string;
    /**
     * The click handler of select button.
     */
    onClick: MouseEventHandler<HTMLButtonElement>;
    /**
     * Whether the select button is disabled.
     */
    disabled?: boolean;
  };
};

/**
 * 8. Password Input - Password input with visibility toggle
 */
export type PasswordInputProps = InputBaseProps &
  ClearableInput & {
    type: 'password';
  };

export type InputProps =
  | BaseInputProps
  | WithAffixInputProps
  | SearchInputProps
  | NumberInputProps
  | UnitInputProps
  | ActionInputProps
  | SelectInputProps
  | PasswordInputProps;

/**
 * The react component for `mezzanine` input.
 */
const Input = forwardRef<HTMLDivElement, InputProps>(
  function Input(props, ref) {
    const {
      active,
      className,
      defaultValue,
      disabled = false,
      error = false,
      fullWidth = true,
      inputProps,
      inputRef: inputRefProp,
      onChange: onChangeProp,
      placeholder,
      readonly,
      size = 'main',
      value: valueProp,
    } = props;

    const type = props.type || 'base';

    const inputRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [value, onChange, onClearFromHook] = useInputWithClearControlValue({
      defaultValue,
      onChange: onChangeProp,
      ref: inputRef,
      value: valueProp,
    });

    const composedInputRef = useComposeRefs([inputRefProp, inputRef]);

    // Determine input type and props based on variant
    let inputType: string = 'text';
    let prefix: ReactNode = undefined;
    let suffix: ReactNode = undefined;
    let clearable = false;
    let onClear: MouseEventHandler | undefined = undefined;
    let inputStyle: React.CSSProperties = {};
    let additionalInputProps: Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      | 'type'
      | 'style'
      | 'onChange'
      | 'value'
      | 'placeholder'
      | 'disabled'
      | 'readOnly'
    > = {};
    let externalButton: ReactNode = undefined;

    // Handle different input types with type narrowing
    if (type === 'base') {
      const baseProps = props as BaseInputProps;
      clearable = baseProps.clearable === true;
      if (clearable) {
        onClear = baseProps.onClear || onClearFromHook;
      }
    } else if (type === 'affix') {
      const affixProps = props as WithAffixInputProps;
      clearable = affixProps.clearable === true;
      if (clearable) {
        onClear = affixProps.onClear || onClearFromHook;
      }
      prefix = affixProps.prefix;
      suffix = affixProps.suffix;
    } else if (type === 'search') {
      const searchProps = props as SearchInputProps;
      clearable =
        searchProps.clearable !== undefined
          ? searchProps.clearable === true
          : true;
      if (clearable) {
        onClear = searchProps.onClear || onClearFromHook;
      }
      prefix = <Icon icon={SearchIcon} />;
    } else if (type === 'number') {
      const numberProps = props as NumberInputProps;
      inputType = 'number';
      additionalInputProps = {
        min: numberProps.min,
        max: numberProps.max,
        step: numberProps.step || 1,
      };
    } else if (type === 'unit') {
      const unitProps = props as UnitInputProps;
      inputType = 'number';
      inputStyle = { textAlign: 'right' };

      if (unitProps.unit) {
        suffix = <span>{unitProps.unit}</span>;
      }

      const showSpinner =
        unitProps.showSpinner !== undefined ? unitProps.showSpinner : false;

      if (showSpinner) {
        const handleSpinUp = () => {
          const currentValue = parseFloat(value || '0');
          const step = unitProps.step || 1;
          const max = unitProps.max;
          const newValue = currentValue + step;

          if (max === undefined || newValue <= max) {
            const syntheticEvent = {
              target: { value: String(newValue) },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
          }

          unitProps.onSpinUp?.();
        };

        const handleSpinDown = () => {
          const currentValue = parseFloat(value || '0');
          const step = unitProps.step || 1;
          const min = unitProps.min;
          const newValue = currentValue - step;

          if (min === undefined || newValue >= min) {
            const syntheticEvent = {
              target: { value: String(newValue) },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
          }

          unitProps.onSpinDown?.();
        };

        suffix = (
          <>
            {unitProps.unit && <span>{unitProps.unit}</span>}
            <SpinnerButton
              type="up"
              size={size}
              disabled={disabled}
              onClick={handleSpinUp}
            />
            <SpinnerButton
              type="down"
              size={size}
              disabled={disabled}
              onClick={handleSpinDown}
            />
          </>
        );
      }

      additionalInputProps = {
        min: unitProps.min,
        max: unitProps.max,
        step: unitProps.step || 1,
      };
    } else if (type === 'action') {
      const actionProps = props as ActionInputProps;
      const { actionButton } = actionProps;
      externalButton = (
        <ActionButton
          icon={actionButton.icon}
          label={actionButton.label}
          onClick={actionButton.onClick}
          disabled={actionButton.disabled || disabled}
          size={size}
        />
      );
    } else if (type === 'select') {
      const selectProps = props as SelectInputProps;
      const { selectButton } = selectProps;
      externalButton = (
        <SelectButton
          value={selectButton.value}
          onClick={selectButton.onClick}
          disabled={selectButton.disabled || disabled}
          size={size}
        />
      );
    } else if (type === 'password') {
      const passwordProps = props as PasswordInputProps;
      inputType = showPassword ? 'text' : 'password';
      clearable = passwordProps.clearable === true;
      if (clearable) {
        onClear = passwordProps.onClear || onClearFromHook;
      }

      const toggleIcon = showPassword ? (
        <Icon icon={EyeIcon} />
      ) : (
        <Icon icon={EyeInvisibleIcon} />
      );

      suffix = (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          style={{
            background: 'none',
            border: 'none',
            cursor: disabled ? 'default' : 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
          tabIndex={-1}
        >
          {toggleIcon}
        </button>
      );
    }

    // Prepare common TextField props
    const commonProps = {
      active,
      className: cx(
        classes.host,
        {
          [classes.number]: type === 'number',
        },
        classes.size(size),
        className,
      ),
      clearable,
      error,
      fullWidth,
      onClear,
      size,
    };

    // Render input element
    const renderInput = () => (
      <input
        {...inputProps}
        {...additionalInputProps}
        aria-disabled={disabled}
        aria-multiline={false}
        aria-readonly={readonly}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readonly}
        ref={composedInputRef}
        style={{ ...inputStyle, ...inputProps?.style }}
        type={inputType}
        value={value}
      />
    );

    // Build TextField with proper type discrimination
    let inputElement: ReactNode;

    if (disabled) {
      if (prefix !== undefined) {
        inputElement = (
          <TextField ref={ref} {...commonProps} prefix={prefix} disabled>
            {renderInput()}
          </TextField>
        );
      } else if (suffix !== undefined) {
        inputElement = (
          <TextField ref={ref} {...commonProps} suffix={suffix} disabled>
            {renderInput()}
          </TextField>
        );
      } else {
        inputElement = (
          <TextField ref={ref} {...commonProps} disabled>
            {renderInput()}
          </TextField>
        );
      }
    } else if (readonly) {
      if (prefix !== undefined) {
        inputElement = (
          <TextField ref={ref} {...commonProps} prefix={prefix} readonly>
            {renderInput()}
          </TextField>
        );
      } else if (suffix !== undefined) {
        inputElement = (
          <TextField ref={ref} {...commonProps} suffix={suffix} readonly>
            {renderInput()}
          </TextField>
        );
      } else {
        inputElement = (
          <TextField ref={ref} {...commonProps} readonly>
            {renderInput()}
          </TextField>
        );
      }
    } else {
      if (prefix !== undefined) {
        inputElement = (
          <TextField ref={ref} {...commonProps} prefix={prefix}>
            {renderInput()}
          </TextField>
        );
      } else if (suffix !== undefined) {
        inputElement = (
          <TextField ref={ref} {...commonProps} suffix={suffix}>
            {renderInput()}
          </TextField>
        );
      } else {
        inputElement = (
          <TextField ref={ref} {...commonProps}>
            {renderInput()}
          </TextField>
        );
      }
    }

    return (
      <div
        className={cx(classes.host, {
          [classes.withButton]: externalButton !== undefined,
        })}
      >
        {inputElement}
        {externalButton}
      </div>
    );
  },
);

export default Input;
