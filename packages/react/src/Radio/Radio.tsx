'use client';

import {
  ChangeEventHandler,
  forwardRef,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { radioClasses as classes, RadioSize } from '@mezzanine-ui/core/radio';
import { InputCheckSize } from '@mezzanine-ui/core/_internal/input-check';
import { IconDefinition } from '@mezzanine-ui/icons';
import InputCheck, {
  InputCheckProps,
} from '../_internal/InputCheck/InputCheck';
import { cx } from '../utils/cx';
import { useRadioControlValue } from '../Form/useRadioControlValue';
import { RadioGroupContext } from './RadioGroupContext';
import Input, { BaseInputProps } from '../Input';
import Icon from '../Icon';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface RadioBaseProps
  extends Omit<InputCheckProps, 'control' | 'htmlFor'> {
  /**
   * Whether the radio is checked.
   */
  checked?: boolean;
  /**
   * Whether the radio is checked by default.
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * Since at Mezzanine we use a host element to wrap our input, most derived props will be passed to the host element.
   *  If you need direct control to the input element, use this prop to provide to it.
   *
   * Noticed that if you pass an id within this prop,
   *  the rendered label element will have `htmlFor` sync with passed in id.
   */
  inputProps?: Omit<
    NativeElementPropsWithoutKeyAndRef<'input'>,
    | 'checked'
    | 'defaultChecked'
    | 'disabled'
    | 'onChange'
    | 'placeholder'
    | 'readOnly'
    | 'required'
    | 'type'
    | 'value'
    | `aria-${'disabled' | 'checked'}`
  >;
  /**
   * The change event handler of input in radio.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * The size of radio.
   * @default 'main'
   */
  size?: RadioSize;
  /**
   * The value of input in radio.
   */
  value?: string;
}

export interface RadioNormalProps extends RadioBaseProps {
  /** 此模式下不適用，僅限 segment 類型。 */
  icon?: never;
  /** 顯示在 radio 標籤下方的輔助說明文字。 */
  hint?: string;
  /**
   * The type of radio.
   * @default 'radio'
   */
  type?: 'radio';
  /**
   * When `withInputConfig` is provided, an `Input` component is rendered alongside the
   * radio using the passed props. By default, this input has a width of 120px unless you
   * override it via the `width` property below.
   */
  withInputConfig?: Pick<
    BaseInputProps,
    'aria-disabled' | 'disabled' | 'onChange' | 'placeholder' | 'value'
  > & {
    width?: number;
  };
}

export interface RadioSegmentProps extends RadioBaseProps {
  /**
   * The icon in radio prefix.
   */
  icon?: IconDefinition;
  /** 此模式下不適用，僅限 radio 類型。 */
  hint?: never;
  /**
   * The type of radio.
   * @default 'radio'
   */
  type: 'segment';
  /** 此模式下不適用，僅限 radio 類型。 */
  withInputConfig?: never;
}

export type RadioProps = RadioNormalProps | RadioSegmentProps;

/**
 * 單選按鈕元件，支援標準（radio）與區段（segment）兩種類型。
 *
 * 在 `RadioGroup` 內使用時，會自動繼承群組的 `name`、`size` 與 `type`；
 * 也可獨立使用，透過 `checked`／`defaultChecked` 進行受控或非受控操作。
 * `segment` 類型可搭配 `icon` 屬性顯示圖示，適合用於分頁切換情境。
 *
 * @example
 * ```tsx
 * import Radio from '@mezzanine-ui/react/Radio';
 *
 * // 基本用法（非受控）
 * <Radio value="male" inputProps={{ name: 'gender' }}>男性</Radio>
 *
 * // 受控用法
 * const [value, setValue] = useState('a');
 * <Radio
 *   checked={value === 'a'}
 *   value="a"
 *   inputProps={{ name: 'option' }}
 *   onChange={() => setValue('a')}
 * >
 *   選項 A
 * </Radio>
 *
 * // Segment 類型搭配圖示
 * import { ListIcon } from '@mezzanine-ui/icons';
 * <Radio type="segment" icon={ListIcon} value="list">列表</Radio>
 * ```
 *
 * @see {@link RadioGroup} 管理多個單選按鈕的群組元件
 * @see {@link useRadioControlValue} 單選按鈕受控值的自訂 Hook
 */
const Radio = forwardRef<HTMLDivElement, RadioProps>(
  function Radio(props, ref) {
    const radioGroup = useContext(RadioGroupContext);
    const {
      disabled: disabledFromGroup,
      name: nameFromGroup,
      size: sizeFromGroup,
      type: typeFromGroup,
    } = radioGroup || {};
    const {
      checked: checkedProp,
      className,
      children,
      defaultChecked,
      disabled = disabledFromGroup || false,
      error = false,
      icon,
      hint,
      inputProps,
      onChange: onChangeProp,
      size: sizeProp,
      type = typeFromGroup || 'radio',
      value,
      withInputConfig,
      ...rest
    } = props;
    const {
      id: inputId,
      name = nameFromGroup,
      ...restInputProps
    } = inputProps || {};
    const [checked, onChange] = useRadioControlValue({
      checked: checkedProp,
      defaultChecked,
      onChange: onChangeProp,
      radioGroup,
      value,
    });
    const size: InputCheckSize = sizeProp ?? sizeFromGroup ?? 'main';

    const radioInputRef = useRef<HTMLInputElement>(null);
    const textInputRef = useRef<HTMLInputElement>(null);

    const handleRadioChange: ChangeEventHandler<HTMLInputElement> = useCallback(
      (event) => {
        onChange(event);
        if (withInputConfig && !withInputConfig.disabled) {
          textInputRef.current?.focus();
        }
      },
      [onChange, withInputConfig],
    );

    return (
      <div ref={ref} className={cx(classes.wrapper, className)}>
        <InputCheck
          {...rest}
          control={
            <span
              className={cx(classes.host, classes.size(size), {
                [classes.segmented]: type === 'segment',
                [classes.checked]: checked,
                [classes.error]: error,
              })}
            >
              {type === 'segment' && (
                <span
                  className={cx(classes.segmentedContainer, {
                    [classes.segmentedContainerWithIconText]:
                      !!children && !!icon,
                  })}
                >
                  {icon && <Icon icon={icon} size={16} />}
                  {children}
                </span>
              )}
              <input
                {...restInputProps}
                aria-checked={checked}
                aria-disabled={disabled}
                checked={checked}
                disabled={disabled}
                id={inputId}
                onChange={handleRadioChange}
                name={name}
                ref={radioInputRef}
                type="radio"
                value={value}
              />
            </span>
          }
          disabled={disabled}
          error={error}
          hint={hint}
          htmlFor={inputId}
          segmentedStyle={type === 'segment'}
          size={size}
        >
          {type === 'radio' && children}
        </InputCheck>
        {type === 'radio' && withInputConfig && (
          <div style={{ width: withInputConfig.width ?? 120 }}>
            <Input
              {...withInputConfig}
              inputRef={textInputRef}
              inputProps={{
                onClick: () => {
                  radioInputRef.current?.click();
                },
              }}
              variant="base"
              placeholder={withInputConfig.placeholder ?? 'Placeholder'}
            />
          </div>
        )}
      </div>
    );
  },
);

export default Radio;
