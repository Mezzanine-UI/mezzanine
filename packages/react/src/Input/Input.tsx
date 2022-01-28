import {
  forwardRef,
  Ref,
  useContext,
  ChangeEventHandler,
  useRef,
} from 'react';
import {
  inputClasses as classes,
  InputSize,
} from '@mezzanine-ui/core/input';
import { selectClasses } from '@mezzanine-ui/core/select';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { useInputWithClearControlValue } from '../Form/useInputWithClearControlValue';
import { useInputWithTagsModeValue } from '../Form/useInputWithTagsModeValue';
import type { TagsType } from '../Form/useInputWithTagsModeValue';
import { FormControlContext } from '../Form';
import TextField, { TextFieldProps } from '../TextField';
import Tag from '../Tag';

export interface InputProps extends Omit<TextFieldProps, 'active' | 'children' | 'onClear' | 'onKeyDown'> {
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
  | `aria-${'disabled' | 'multiline' | 'readonly' | 'required'}`
  >;
  /**
   * The input value mode
   * @default 'default'
   */
  mode?: 'default' | 'tags';
  /**
   * The change event handler of input element.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * The placeholder of input.
   */
  placeholder?: string;
  /**
   * Whether the input is readonly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the input is required.
   * @default false
   */
  required?: boolean;
  /**
   * The size of input.
   * @default 'medium'
   */
  size?: InputSize;
  /**
    * The props for input element with tags mode.
    */
  tagsProps?: {
    /**
     * The initial value of tags
     */
    initialTagsValue?: string[];
    /**
     * The position of input field on tags mode
     * @default 'bottom''
     */
    inputPosition?: 'top' | 'bottom';
    /**
     * Maximum permitted length of the tags
     */
    maxTagsLength?: number;
    /**
    * The change event handler of input tags value.
    */
    onTagsChange?: (tags: TagsType) => void;
  };
  /**
   * The value of input.
   */
  value?: string;
}

/**
 * The react component for `mezzanine` input.
 */
const Input = forwardRef<HTMLDivElement, InputProps>(function Input(props, ref) {
  const {
    disabled: disabledFromFormControl,
    fullWidth: fullWidthFromFormControl,
    required: requiredFromFormControl,
    severity,
  } = useContext(FormControlContext) || {};
  const {
    className,
    clearable = false,
    defaultValue,
    disabled = disabledFromFormControl || false,
    error = severity === 'error' || false,
    fullWidth = fullWidthFromFormControl || false,
    inputProps,
    inputRef: inputRefProp,
    mode = 'default',
    onChange: onChangeProp,
    placeholder,
    prefix,
    readOnly = false,
    required = requiredFromFormControl || false,
    size = 'medium',
    suffix,
    tagsProps,
    value: valueProp,
  } = props;

  const {
    initialTagsValue,
    inputPosition = 'bottom',
    maxTagsLength,
    onTagsChange,
  } = tagsProps || {};

  const tagsMode = mode === 'tags';
  const inputRef = useRef<HTMLInputElement>(null);

  const [
    value,
    onChange,
    onClear,
  ] = useInputWithClearControlValue({
    defaultValue,
    onChange: onChangeProp,
    ref: inputRef,
    value: valueProp,
  });

  const [
    {
      tags,
      tagsReachedMax,
    },
    tagsModeOnChange,
    tagsModeOnClear,
    tagsModeOnRemove,
    onKeyDown,
  ] = useInputWithTagsModeValue({
    defaultValue,
    initialTagsValue,
    maxTagsLength,
    onTagsChange,
    ref: inputRef,
    skip: !tagsMode,
    tagValueMaxLength: inputProps?.maxLength,
    value: valueProp,
  });

  const composedInputRef = useComposeRefs([inputRefProp, inputRef]);

  const maxLength = () => (
    tagsMode
      ? Math.min(inputProps?.maxLength || 8, 8)
      : inputProps?.maxLength
  );

  const active = !!value;
  const mountInput = !tagsMode || !tagsReachedMax;

  return (
    <TextField
      ref={ref}
      active={active}
      className={cx(
        classes.host,
        tagsMode && classes.tagsMode,
        inputPosition === 'top' && classes.tagsModeInputOnTop,
        className,
      )}
      clearable={clearable}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      onClear={tagsMode ? tagsModeOnClear : onClear}
      prefix={mountInput ? prefix : undefined}
      suffix={mountInput ? suffix : undefined}
      size={size}
    >
      {tagsMode && (
        <div className={selectClasses.triggerTags}>
          {tags.map((tag) => (
            <Tag
              key={tag}
              closable
              disabled={disabled}
              size={size}
              onClose={(e) => {
                e.stopPropagation();
                tagsModeOnRemove?.(tag);
              }}
            >
              {tag}
            </Tag>
          ))}
        </div>
      )}

      {mountInput && (
        <input
          {...inputProps}
          aria-disabled={disabled}
          aria-multiline={false}
          aria-readonly={readOnly}
          aria-required={required}
          disabled={disabled}
          maxLength={maxLength()}
          onChange={tagsMode ? tagsModeOnChange : onChange}
          onKeyDown={tagsMode ? onKeyDown : inputProps?.onKeyDown}
          placeholder={placeholder}
          readOnly={readOnly}
          ref={composedInputRef}
          required={required}
          value={tagsMode ? undefined : value}
        />
      )}
    </TextField>
  );
});

export default Input;
