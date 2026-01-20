'use client';

import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { inputClasses as classes } from '@mezzanine-ui/core/input';
import { EyeIcon, EyeInvisibleIcon, SearchIcon } from '@mezzanine-ui/icons';
import {
  ChangeEventHandler,
  forwardRef,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  Ref,
  useCallback,
  useRef,
  useState,
} from 'react';
import Dropdown from '../Dropdown';
import { useInputWithClearControlValue } from '../Form/useInputWithClearControlValue';
import { useComposeRefs } from '../hooks/useComposeRefs';
import Icon from '../Icon';
import { PopperPlacement } from '../Popper';
import TextField, {
  TextFieldAffixProps,
  TextFieldInteractiveStateProps,
  TextFieldProps,
} from '../TextField';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import ActionButton, { ActionButtonProps } from './ActionButton';
import PasswordStrengthIndicator, {
  PasswordStrengthIndicatorProps,
} from './PasswordStrengthIndicator';
import SelectButton, { SelectButtonProps } from './SelectButton';
import SpinnerButton from './SpinnerButton';

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
   * Formatter function to transform the value for display.
   * Common use cases: currency formatting (1000 → "1,000"), phone numbers, etc.
   * @example
   * formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
   */
  formatter?: (value: string) => string;
  /**
   * The id of input element.
   */
  id?: string;
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
    | 'value'
    | 'type'
    | 'id'
    | 'name'
    | `aria-${'disabled' | 'multiline' | 'readonly'}`
  >;
  /**
   * The input type of input element.
   * @default 'text'
   */
  inputType?: NativeElementPropsWithoutKeyAndRef<'input'>['type'];
  /**
   * The name of input element.
   */
  name?: string;
  /**
   * The change event handler of input element.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * Parser function to extract the raw value from formatted display value.
   * Should reverse the formatter transformation.
   * @example
   * parser={(value) => value.replace(/,/g, '')}
   */
  parser?: (value: string) => string;
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
 * Number input
 */
export type NumberInput = {
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
 * 1. Base Input - Basic input field
 */
export type BaseInputProps = InputBaseProps &
  ClearableInput & {
    /**
     * The type of input.
     * @default 'base'
     */
    variant?: 'base';
  };

/**
 * 2. With Affix Input - Input with prefix/suffix decorations
 */
export type WithAffixInputProps = InputBaseProps &
  TextFieldAffixProps &
  ClearableInput & {
    variant: 'affix';
  };

/**
 * 3. Search Input - Input with search icon prefix
 */
export type SearchInputProps = InputBaseProps &
  ClearableInput & {
    variant: 'search';
  };

/**
 * 4. Number Input - Small numeric input (36x36)
 */
export type NumberInputProps = InputBaseProps &
  NumberInput & {
    variant: 'number';
  };

/**
 * 5. Unit Input - Input with unit text and spinner buttons
 */
export type UnitInputProps = InputBaseProps &
  NumberInput &
  TextFieldAffixProps & {
    variant: 'unit';
    /**
     * Whether to show spinner buttons.
     * @default false
     */
    showSpinner?: boolean;
    /**
     * Callback when spinner up button is clicked.
     */
    onSpinUp?: VoidFunction;
    /**
     * Callback when spinner down button is clicked.
     */
    onSpinDown?: VoidFunction;
  };

/**
 * 6. Action Input - Input with action button (button is adjacent to TextField, not inside)
 */
export type ActionInputProps = InputBaseProps & {
  variant: 'action';
  /**
   * The action button props.
   */
  actionButton: ActionButtonProps & {
    position: 'prefix' | 'suffix';
  };
};

/**
 * 7. Select Input - Input with select button (button is adjacent to TextField, not inside)
 */
export type SelectInputProps = InputBaseProps & {
  variant: 'select';
  /**
   * The select button props.
   */
  selectButton: SelectButtonProps & {
    position: 'prefix' | 'suffix' | 'both';
  };
  /**
   * The options of the dropdown.
   */
  options?: DropdownOption[];
  /**
   * The selected value of the dropdown.
   */
  selectedValue?: string;
  /**
   * The onChange event handler of the dropdown.
   */
  onSelect?: (value: string) => void;
  /**
   * The width of the dropdown.
   */
  dropdownWidth?: number | string;
  /**
   * The max height of the dropdown.
   */
  dropdownMaxHeight?: number | string;
  /**
   * The placement of the dropdown.
   */
  dropdownPlacement?: PopperPlacement;
};

/**
 * 8. Password Input - Password input with visibility toggle
 */
export type WithPasswordStrengthIndicator =
  | {
    /**
     * Whether to show password strength indicator.
     */
    showPasswordStrengthIndicator?: false;
    passwordStrengthIndicator?: never;
  }
  | {
    /**
     * Whether to show password strength indicator.
     */
    showPasswordStrengthIndicator: true;
    /**
     * The props for password strength indicator.
     */
    passwordStrengthIndicator: PasswordStrengthIndicatorProps;
  };

export type PasswordInputProps = InputBaseProps &
  ClearableInput &
  WithPasswordStrengthIndicator & {
    variant: 'password';
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
      formatter,
      fullWidth = true,
      id,
      inputProps,
      inputType,
      inputRef: inputRefProp,
      name,
      onChange: onChangeProp,
      parser,
      placeholder,
      readonly,
      size = 'main',
      typing,
      variant = 'base',
      value: valueProp,
    } = props;

    const inputRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [value, onChange, onClearFromHook] = useInputWithClearControlValue({
      defaultValue,
      onChange: onChangeProp,
      ref: inputRef,
      value: valueProp,
    });

    // Handle formatter/parser logic
    const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
      (event) => {
        let newValue = event.target.value;

        // Parse the formatted value back to raw value if parser is provided
        if (parser) {
          newValue = parser(newValue);
        }

        // Create a new event with parsed value for onChange callback
        const syntheticEvent = {
          ...event,
          target: {
            ...event.target,
            value: newValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);
      },
      [parser, onChange],
    );

    // Format the display value
    const displayValue = formatter ? formatter(value) : value;

    const composedInputRef = useComposeRefs([inputRefProp, inputRef]);

    // Determine input type and props based on variant
    let defaultInputType: string = 'text';
    let prefix: ReactNode = undefined;
    let suffix: ReactNode = undefined;
    let clearable = false;
    let onClear: MouseEventHandler | undefined = undefined;
    let inputStyle: React.CSSProperties = {};
    let defaultInputProps: Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      | 'type'
      | 'style'
      | 'onChange'
      | 'value'
      | 'placeholder'
      | 'disabled'
      | 'readOnly'
    > = {};
    let prefixExternalButton: ReactNode = undefined;
    let suffixExternalButton: ReactNode = undefined;
    let showPasswordStrengthIndicator: boolean = false;
    let passwordStrengthIndicatorProps:
      | PasswordStrengthIndicatorProps
      | undefined = undefined;

    // Handle different input types with type narrowing
    switch (variant) {
      case 'base': {
        const baseProps = props as BaseInputProps;

        if (baseProps.clearable) {
          clearable = baseProps.clearable;
          onClear = baseProps.onClear || onClearFromHook;
        }

        break;
      }
      case 'affix': {
        const affixProps = props as WithAffixInputProps;

        if (affixProps.clearable) {
          clearable = affixProps.clearable;
          onClear = affixProps.onClear || onClearFromHook;
        }

        prefix = affixProps.prefix;
        suffix = affixProps.suffix;

        break;
      }
      case 'search': {
        const searchProps = props as SearchInputProps;

        // 預設為可清除
        clearable =
          typeof searchProps.clearable !== 'undefined'
            ? searchProps.clearable
            : true;

        if (clearable) {
          onClear = searchProps.onClear || onClearFromHook;
        }

        // 預設有 search icon 在前綴
        prefix = <Icon icon={SearchIcon} />;

        break;
      }
      case 'number': {
        const numberProps = props as NumberInputProps;
        const { step = 1, max, min } = numberProps;

        // Input type 應是 number
        defaultInputType = 'number';
        // 額外的屬性
        defaultInputProps = {
          min: min,
          max: max,
          step: step,
        };

        break;
      }
      case 'unit': {
        const unitProps = props as UnitInputProps;
        const { step = 1, max, min, onSpinUp, onSpinDown } = unitProps;

        // 預設置右對齊
        inputStyle = { textAlign: 'right' };
        // 允許填入 prefix/suffix
        prefix = unitProps.prefix;
        suffix = unitProps.suffix;

        defaultInputProps = {
          min: min,
          max: max,
          step: step,
        };

        if (unitProps.showSpinner) {
          const handleSpinUp = () => {
            const currentValue = parseFloat(value || '0');
            const newValue = currentValue + step;

            if (typeof max === 'undefined' || newValue <= max) {
              onChange({
                target: { value: String(newValue) },
              } as React.ChangeEvent<HTMLInputElement>);
            }

            onSpinUp?.();
          };

          const handleSpinDown = () => {
            const currentValue = parseFloat(value || '0');
            const newValue = currentValue - step;

            if (typeof min === 'undefined' || newValue >= min) {
              onChange({
                target: { value: String(newValue) },
              } as React.ChangeEvent<HTMLInputElement>);
            }

            onSpinDown?.();
          };

          suffix = (
            <>
              {unitProps.suffix}
              <div className={classes.spinners}>
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
              </div>
            </>
          );
        }

        break;
      }
      case 'action': {
        const actionProps = props as ActionInputProps;
        const { actionButton } = actionProps;

        if (actionButton.position === 'prefix') {
          const { ...restActionButtonProps } = actionButton;

          prefixExternalButton = (
            <ActionButton
              {...restActionButtonProps}
              disabled={restActionButtonProps.disabled || disabled}
              size={size}
            />
          );
        }

        if (actionButton.position === 'suffix') {
          const { ...restActionButtonProps } = actionButton;

          suffixExternalButton = (
            <ActionButton
              {...restActionButtonProps}
              disabled={restActionButtonProps.disabled || disabled}
              size={size}
            />
          );
        }

        break;
      }
      case 'select': {
        const selectProps = props as SelectInputProps;
        const { selectButton, options, dropdownWidth = 120, dropdownMaxHeight = 114 } = selectProps;
        const defaultOptions = options || [];
        const selectedOptions: DropdownOption[] = defaultOptions.length > 0
          ? defaultOptions.map((option) => ({
            ...option,
            ...(option.id === selectProps.selectedValue
              ? { checkSite: 'suffix' }
              : {}),
          }))
          : [];

        if (
          selectButton.position === 'both' ||
          selectButton.position === 'prefix'
        ) {
          const { ...restSelectButtonProps } = selectButton;

          prefixExternalButton = (
            <Dropdown
              options={selectedOptions}
              value={selectProps.selectedValue}
              customWidth={dropdownWidth}
              maxHeight={dropdownMaxHeight}
              placement="bottom-start"
              onSelect={(option) => {
                selectProps.onSelect?.(option.id);
              }}
            >
              <SelectButton
                {...restSelectButtonProps}
                disabled={restSelectButtonProps.disabled || disabled}
                size={size}
              />
            </Dropdown>
          );
        }

        if (
          selectButton.position === 'both' ||
          selectButton.position === 'suffix'
        ) {
          const { ...restSelectButtonProps } = selectButton;

          suffixExternalButton = (
            <Dropdown
              options={selectedOptions}
              value={selectProps.selectedValue}
              customWidth={dropdownWidth}
              maxHeight={dropdownMaxHeight}
              placement="bottom-start"
              onSelect={(option) => {
                selectProps.onSelect?.(option.id);
              }}
            >
              <SelectButton
                {...restSelectButtonProps}
                disabled={restSelectButtonProps.disabled || disabled}
                size={size}
              />
            </Dropdown>
          );
        }

        break;
      }
      case 'password': {
        const passwordProps = props as PasswordInputProps;
        defaultInputType = showPassword ? 'text' : 'password';

        if (passwordProps.clearable) {
          onClear = passwordProps.onClear || onClearFromHook;
        }

        const handlePasswordToggle: KeyboardEventHandler<HTMLElement> = (
          event,
        ) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setShowPassword((prev) => !prev);
          }
        };

        suffix = (
          <Icon
            icon={showPassword ? EyeIcon : EyeInvisibleIcon}
            onClick={() => setShowPassword((prev) => !prev)}
            role="button"
            tabIndex={0}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onKeyDown={handlePasswordToggle}
          />
        );

        if (passwordProps.showPasswordStrengthIndicator) {
          showPasswordStrengthIndicator = true;
          passwordStrengthIndicatorProps =
            passwordProps.passwordStrengthIndicator;
        }

        break;
      }

      default:
        break;
    }

    const interactiveProps: TextFieldInteractiveStateProps = (() => {
      if (disabled) {
        return { disabled: true };
      }
      if (readonly) {
        return { readonly: true };
      }
      if (typing) {
        return { typing: true };
      }
      return {};
    })();

    return (
      <div ref={ref} className={cx(classes.container, className)}>
        <div
          className={cx(classes.host, {
            [classes.withPrefixExternalAction]:
              prefixExternalButton !== undefined,
            [classes.withSuffixExternalAction]:
              suffixExternalButton !== undefined,
          })}
        >
          {prefixExternalButton}
          <TextField
            active={active}
            className={cx(
              classes.field,
              {
                [classes.number]: variant === 'number',
              },
              classes.size(size),
            )}
            clearable={clearable}
            error={error}
            fullWidth={fullWidth}
            onClear={onClear}
            size={size}
            prefix={prefix}
            suffix={suffix}
            {...interactiveProps}
          >
            <input
              {...defaultInputProps}
              {...inputProps}
              id={id}
              name={name}
              aria-disabled={disabled}
              aria-multiline={false}
              aria-readonly={readonly}
              disabled={disabled}
              onChange={formatter || parser ? handleChange : onChange}
              placeholder={placeholder}
              readOnly={readonly}
              ref={composedInputRef}
              style={{ ...inputStyle, ...inputProps?.style }}
              type={inputType ?? defaultInputType}
              value={displayValue}
            />
          </TextField>
          {suffixExternalButton}
        </div>
        {variant === 'password' && showPasswordStrengthIndicator ? (
          <PasswordStrengthIndicator
            {...(passwordStrengthIndicatorProps || {})}
            className={cx(
              classes.indicatorContainer,
              passwordStrengthIndicatorProps?.className,
            )}
          />
        ) : null}
      </div>
    );
  },
);

export default Input;
