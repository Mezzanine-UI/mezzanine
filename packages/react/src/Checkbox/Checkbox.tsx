'use client';

import {
  ChangeEventHandler,
  KeyboardEvent,
  MouseEvent,
  Ref,
  forwardRef,
  useCallback,
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
 * 核取方塊元件，支援預設（default）與晶片（chip）兩種模式。
 *
 * 提供受控與非受控兩種使用方式，可透過 `checked`／`defaultChecked` 切換狀態。
 * 在 `CheckboxGroup` 內使用時，必須提供 `value` 屬性；支援 `indeterminate` 中間狀態
 * 及 `withEditInput` 勾選後顯示附加輸入框的功能。
 *
 * @example
 * ```tsx
 * import Checkbox from '@mezzanine-ui/react/Checkbox';
 *
 * // 基本用法（非受控）
 * <Checkbox label="同意條款" defaultChecked />
 *
 * // 受控用法
 * const [checked, setChecked] = useState(false);
 * <Checkbox
 *   checked={checked}
 *   label="訂閱電子報"
 *   onChange={(e) => setChecked(e.target.checked)}
 * />
 *
 * // Chip 模式
 * <Checkbox label="熱門" mode="chip" size="sub" />
 *
 * // 含附加輸入框
 * <Checkbox label="其他" withEditInput editableInput={{ placeholder: '請輸入其他選項' }} />
 * ```
 *
 * @see {@link CheckboxGroup} 管理多個核取方塊的群組元件
 * @see {@link useCheckboxControlValue} 核取方塊受控值的自訂 Hook
 */
const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const checkboxGroup = useContext(CheckboxGroupContext);
    const { disabled: disabledFromGroup, name: nameFromGroup } =
      checkboxGroup || {};
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
      name = nameFromGroup,
      onChange: onChangeProp,
      severity = 'info',
      size = 'main',
      value,
      withEditInput = false,
      ...rest
    } = props;

    const { name: nameFromInputProps, ...restInputProps } = inputProps || {};

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
      const defaultName = resolvedName
        ? `${resolvedName}_input`
        : `${finalInputId}_input`;
      const defaultId = `${finalInputId}_input`;

      return {
        id: defaultId,
        name: defaultName,
        placeholder: 'Please enter...',
      } as Omit<BaseInputProps, 'variant'>;
    }, [withEditInput, editableInput, resolvedName, finalInputId]);

    const shouldShowEditableInput = withEditInput && defaultEditableInput;
    const prevIsCheckedRef = useRef(isChecked);

    useEffect(() => {
      if (isChecked && !prevIsCheckedRef.current && shouldShowEditableInput && editableInputRef.current) {
        editableInputRef.current.focus();
      }
      prevIsCheckedRef.current = isChecked;
    }, [isChecked, shouldShowEditableInput]);

    const handleChipHostClick = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        if (e.target === e.currentTarget) {
          inputElementRef.current?.click();
        }
      },
      [disabled],
    );

    const handleChipHostKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          inputElementRef.current?.click();
        }
      },
      [disabled],
    );

    const handleEditableInputMouseDown = useCallback(
      (event: MouseEvent<HTMLInputElement>) => {
        defaultEditableInput?.inputProps?.onMouseDown?.(event);
        if (event.defaultPrevented) {
          return;
        }
        if (!isChecked && !disabled && inputElementRef.current) {
          event.preventDefault(); // 阻止原生 focus-on-mousedown，讓 useEffect 統一控制 focus 時機
          inputElementRef.current.click();
        }
      },
      [defaultEditableInput, disabled, isChecked],
    );

    return (
      <div
        className={cx(
          classes.host,
          className,
          {
            [classes.checked]: isChecked,
            [classes.indeterminate]: isIndeterminate,
            [classes.disabled]: disabled,
            [classes.mode(mode)]: mode !== 'default',
            ...(severity && { [classes.severity(severity)]: true }),
          },
          classes.size(size),
        )}
        onClick={mode === 'chip' ? handleChipHostClick : undefined}
        onKeyDown={mode === 'chip' ? handleChipHostKeyDown : undefined}
      >
        <label ref={ref} {...rest} className={classes.labelContainer}>
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
                  className={cx(classes.icon, classes.chipIcon)}
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
                  size={9}
                />
              )}
              {mode !== 'chip' && isIndeterminate && (
                <span
                  aria-hidden="true"
                  className={classes.indeterminateLine}
                />
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
        {shouldShowEditableInput &&
          defaultEditableInput &&
          mode !== 'chip' &&
          !indeterminate && (
            <label
              className={classes.editableInputContainer}
              htmlFor={finalInputId}
            >
              <Input
                {...defaultEditableInput}
                {...(disabled &&
                  defaultEditableInput.disabled !== true
                  ? { disabled: true }
                  : {})}
                inputProps={{
                  ...defaultEditableInput.inputProps,
                  onMouseDown: handleEditableInputMouseDown,
                }}
                inputRef={composeRefs([
                  defaultEditableInput.inputRef,
                  editableInputRef,
                ])}
                variant="base"
              />
            </label>
          )}
      </div>
    );
  },
);

export default Checkbox;
