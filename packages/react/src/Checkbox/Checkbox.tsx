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
  checkboxClasses as classes
} from '@mezzanine-ui/core/checkbox';

import { CheckedIcon } from '@mezzanine-ui/icons';

import { useCheckboxControlValue } from '../Form/useCheckboxControlValue';
import Icon from '../Icon';
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
      id,
      indeterminate = false,
      inputProps,
      inputRef: inputRefProp,
      label,
      mode = 'main',
      name = nameFromGroup,
      onChange: onChangeProp,
      value,
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

    return (
      <label
        ref={ref}
        {...rest}
        className={cx(
          classes.host,
          {
            [classes.checked]: isChecked,
            [classes.indeterminate]: isIndeterminate,
            [classes.disabled]: disabled,
          },
          classes.mode(mode),
          className,
        )}
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
            {description && mode !== 'chip' && (
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
    );
  },
);

export default Checkbox;

