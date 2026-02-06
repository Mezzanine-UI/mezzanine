'use client';

import {
  ChangeEventHandler,
  Ref,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react';

import {
  CheckboxSize,
  checkboxClasses as classes,
} from '@mezzanine-ui/core/checkbox';

import { CheckedIcon } from '@mezzanine-ui/icons';

import { useCheckboxControlValue } from '../Form/useCheckboxControlValue';
import Icon from '../Icon';
import Input, { BaseInputProps } from '../Input';
import Typography, { TypographyColor } from '../Typography';
import { composeRefs } from '../utils/composeRefs';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { CheckboxGroupContext } from './CheckboxGroupContext';
import { CheckboxPropsBase } from './typings';

type CheckboxInputElementProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'input'>,
  | 'checked'
  | 'defaultChecked'
  | 'disabled'
  | 'onChange'
  | 'placeholder'
  | 'type'
  | 'value'
  | `aria-${'disabled' | 'checked'}`
> & {
  /**
   * The id attribute can be provided via inputProps, but it's recommended to use the `id` prop directly.
   * If both are provided, the `id` prop takes precedence.
   */
  id?: string;
  /**
   * The name attribute can be provided via inputProps, but it's recommended to use the `name` prop directly.
   * If both are provided, the `name` prop takes precedence.
   */
  name?: string;
};

export interface CheckboxProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'label'>, 'onChange'>,
  CheckboxPropsBase {
  /**
   * Whether to show an editable input when checkbox is checked.
   * When `true`, an Input component will be displayed after the checkbox when checked.
   * If `editableInput` is not provided, default values will be used (name, id, placeholder).
   * 
   * @example Simple usage
   * ```tsx
   * <Checkbox
   *   label="其他"
   *   withEditInput
   *   value={otherValue}
   *   onChange={(e) => setOtherValue(e.target.value)}
   * />
   * ```
   * 
   * @example With custom editableInput
   * ```tsx
   * <Checkbox
   *   label="其他"
   *   withEditInput
   *   editableInput={{
   *     placeholder: "請輸入其他選項",
   *     name: "otherOption",
   *     value: otherValue,
   *     onChange: (e) => setOtherValue(e.target.value),
   *   }}
   * />
   * ```
   * 
   * @example With react-hook-form
   * ```tsx
   * const { register, watch } = useForm();
   * const isOtherChecked = watch('options.other');
   * 
   * <Checkbox
   *   label="其他"
   *   {...register('options.other')}
   *   withEditInput
   *   editableInput={{
   *     ...register('otherOption', { required: isOtherChecked }),
   *     placeholder: "請輸入其他選項",
   *   }}
   * />
   * ```
   */
  withEditInput?: boolean;
  /**
   * Configuration for editable input that appears when checkbox is checked.
   * When `withEditInput` is `true` and this prop is not provided, default values will be used.
   * 
   * Default values when not provided:
   * - `name`: `{checkboxName}_input` or `{checkboxId}_input`
   * - `id`: `{checkboxId}_input`
   * - `placeholder`: "Please enter..."
   */
  editableInput?: Omit<BaseInputProps, 'variant'>;
  /**
   * The id of input element.
   */
  id?: string;
  /**
   * Since at Mezzanine we use a host element to wrap our input, most derived props will be passed to the host element.
   * If you need direct control to the input element, use this prop to provide to it.
   */
  inputProps?: CheckboxInputElementProps;
  /**
   * The react ref passed to input element.
   * 
   * @important When using with react-hook-form's `register`, pass the ref through this prop:
   * ```tsx
   * const { register } = useForm();
   * <Checkbox inputRef={register('fieldName').ref} name="fieldName" />
   * ```
   * 
   * For CheckboxGroup, use `Controller` instead of `register` for better array value handling.
   */
  inputRef?: Ref<HTMLInputElement>;
  /**
   * The name attribute of the input element.
   * 
   * @important When using with react-hook-form or inside a CheckboxGroup, this prop is recommended.
   * For CheckboxGroup, all checkboxes should share the same `name` attribute.
   * 
   * When using with react-hook-form's `register`, ensure this matches the field name:
   * ```tsx
   * const { register } = useForm();
   * <Checkbox {...register('fieldName')} inputRef={register('fieldName').ref} />
   * ```
   */
  name?: string;
  /**
   * Invoked by input change event.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * The value of checkbox. Used when checkbox is inside a CheckboxGroup.
   * 
   * @important This prop is required when checkbox is inside a CheckboxGroup.
   * It is also recommended when integrating with react-hook-form.
   */
  value?: string;
  /**
   * The size of checkbox.
   * When mode is 'chip', size can be 'main' | 'sub' | 'minor'.
   * When mode is 'default', size can be 'main' | 'sub'.
   * @default 'main'
   */
  size?: CheckboxSize<NonNullable<CheckboxPropsBase['mode']>>;
}

/**
 * The react component for `mezzanine` checkbox.
 */
const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const checkboxGroup = useContext(CheckboxGroupContext);
    const {
      disabled: disabledFromGroup,
      name: nameFromGroup,
    } = checkboxGroup || {};
    const {
      checked: checkedProp,
      className,
      defaultChecked,
      description,
      disabled = disabledFromGroup,
      editableInput,
      id,
      indeterminate = false,
      inputProps,
      inputRef: inputRefProp,
      label,
      mode = 'default',
      size = 'main',
      name = nameFromGroup,
      onChange: onChangeProp,
      value,
      withEditInput = false,
      ...rest
    } = props;

    const {
      name: nameFromInputProps,
      ...restInputProps
    } = inputProps || {};

    // Generate unique id if not provided
    const generatedId = useId();
    const finalInputId = id ?? generatedId;

    if (checkboxGroup && value == null) {
      throw new Error(
        'Checkbox: `value` is required when the checkbox is used inside a CheckboxGroup.',
      );
    }

    const [checked, onChange] = useCheckboxControlValue({
      checked: checkedProp,
      defaultChecked,
      onChange: onChangeProp,
      checkboxGroup,
      value,
    });

    // Warn when checkbox is standalone and missing a name (helpful for form libs)
    useEffect(() => {
      if (!checkboxGroup && !name && !nameFromInputProps && label) {
        console.warn(
          'Checkbox: The `name` prop is recommended when integrating with react-hook-form. ' +
          `Checkbox with label "${label}" is missing the \`name\` prop.`,
        );
      }
    }, [checkboxGroup, name, nameFromInputProps, label]);

    const isChecked = checked && !indeterminate;
    const isIndeterminate = indeterminate;

    const resolvedName = useMemo(() => {
      if (name) return name;
      if (nameFromInputProps) return nameFromInputProps;

      return finalInputId;
    }, [finalInputId, name, nameFromInputProps]);

    const labelColor: TypographyColor = useMemo(() => {
      if (mode === 'chip' && disabled) {
        return 'text-neutral-light';
      }
      return 'text-neutral-solid';
    }, [mode, disabled]);

    const inputElementRef = useRef<HTMLInputElement | null>(null);

    const composedInputRef = useMemo(
      () => composeRefs([inputRefProp, inputElementRef]),
      [inputRefProp],
    );

    useEffect(() => {
      if (inputElementRef.current) {
        inputElementRef.current.indeterminate = isIndeterminate;
      }
    }, [isIndeterminate]);

    const editableInputRef = useRef<HTMLInputElement | null>(null);

    // Generate default editable input config when withEditInput is true but editableInput is not provided
    const defaultEditableInput = useMemo(() => {
      if (!withEditInput) return undefined;

      if (editableInput) {
        return editableInput;
      }

      // Default values when editableInput is not provided
      const defaultName = resolvedName ? `${resolvedName}_input` : `${finalInputId}_input`;
      const defaultId = `${finalInputId}_input`;

      return {
        id: defaultId,
        name: defaultName,
        placeholder: 'Please enter...',
      } as Omit<BaseInputProps, 'variant'>;
    }, [withEditInput, editableInput, resolvedName, finalInputId]);

    const shouldShowEditableInput = withEditInput && defaultEditableInput;

    return (
      <div className={cx(
        classes.host,
        className,
        {
          [classes.checked]: isChecked,
          [classes.indeterminate]: isIndeterminate,
          [classes.disabled]: disabled,
          [classes.mode(mode)]: mode !== 'default',
        },
        classes.size(size),
      )}>
        <label
          ref={ref}
          {...rest}
          className={classes.labelContainer}
        >
          <div className={classes.inputContainer}>
            <div className={classes.inputContent}>
              <input
                {...restInputProps}
                aria-checked={isIndeterminate ? 'mixed' : checked}
                aria-disabled={disabled}
                checked={isChecked}
                className={classes.input}
                disabled={disabled}
                id={finalInputId}
                name={resolvedName}
                onChange={onChange}
                ref={composedInputRef}
                type="checkbox"
                value={value}
              />
              {mode === 'chip' && isChecked && (
                <Icon
                  aria-hidden="true"
                  className={classes.icon}
                  color="brand"
                  icon={CheckedIcon}
                  size={16}
                />
              )}
              {mode !== 'chip' && isChecked && (
                <Icon
                  aria-hidden="true"
                  className={classes.icon}
                  color="fixed-light"
                  icon={CheckedIcon}
                  size={7}
                />
              )}
              {mode !== 'chip' && isIndeterminate && (
                <span aria-hidden="true" className={classes.indeterminateLine} />
              )}
            </div>
          </div>
          {(label || description) && (
            <span className={classes.textContainer}>
              {label && (
                <Typography
                  className={classes.label}
                  color={labelColor}
                  variant="label-primary"
                >
                  {label}
                </Typography>
              )}
              {description && mode !== 'chip' && !shouldShowEditableInput && (
                <Typography
                  className={classes.description}
                  color="text-neutral"
                  variant="caption"
                >
                  {description}
                </Typography>
              )}
            </span>
          )}
        </label>
        {shouldShowEditableInput && defaultEditableInput && mode !== 'chip' && !indeterminate && (
          <div className={classes.editableInputContainer}>
            <Input
              {...defaultEditableInput}
              {...((!isChecked || disabled) && defaultEditableInput.disabled !== true ? { disabled: true } : {})}
              inputRef={composeRefs([
                defaultEditableInput.inputRef,
                editableInputRef,
              ])}
              variant="base"
            />
          </div>
        )}
      </div>
    );
  },
);

export default Checkbox;

