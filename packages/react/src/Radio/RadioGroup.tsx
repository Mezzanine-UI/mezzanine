import { RadioSize } from '@mezzanine-ui/core/radio';
import { ChangeEventHandler, forwardRef, ReactNode, useMemo } from 'react';
import InputCheckGroup, {
  InputCheckGroupProps,
} from '../_internal/InputCheck/InputCheckGroup';
import { useInputControlValue } from '../Form/useInputControlValue';
import { RadioGroupContext, RadioGroupContextValue } from './RadioGroupContext';
import Radio, { RadioProps } from './Radio';

export interface RadioGroupOption
  extends Pick<
    RadioProps,
    'disabled' | 'error' | 'hint' | 'value' | 'withInputConfig'
  > {
  label: string | number;
}

export interface RadioGroupProps
  extends Omit<InputCheckGroupProps, 'onChange'> {
  /**
   * The radios in radio group.
   */
  children?: ReactNode;
  /**
   * The default value of radio group.
   */
  defaultValue?: string;
  /**
   * Whether the radio group is disabled.
   * Control the disabled of radios in group if disabled not passed to radio.
   */
  disabled?: boolean;
  /**
   * The name of radio group.
   * Control the name of radios in group if name not passed to radio.
   */
  name?: string;
  /**
   * The onChange of radio group.
   * Will be passed to each radios but composing both instead of overriding.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * The options of radio group.
   * Will be ignored if children passed.
   */
  options?: RadioGroupOption[];
  /**
   * The size of radio group.
   * Control the size of radios in group if size not passed to radio.
   */
  size?: RadioSize;
  /**
   * The value of radio group.
   */
  value?: string;
}

/**
 * The react component for `mezzanine` radio group.
 */
const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(props, ref) {
    const {
      children: childrenProp,
      defaultValue,
      disabled,
      name,
      options = [],
      onChange: onChangeProp,
      size,
      value: valueProp,
      ...rest
    } = props;
    const [value, onChange] = useInputControlValue({
      defaultValue,
      onChange: onChangeProp,
      value: valueProp,
    });
    const context: RadioGroupContextValue = useMemo(
      () => ({
        disabled,
        name,
        onChange,
        size,
        value,
      }),
      [disabled, name, onChange, size, value],
    );

    const children =
      childrenProp ||
      options.map((option) => (
        <Radio
          key={option.value}
          disabled={option.disabled}
          error={option.error}
          hint={option.hint}
          value={option.value}
          withInputConfig={option.withInputConfig}
        >
          {option.label}
        </Radio>
      ));

    return (
      <RadioGroupContext.Provider value={context}>
        <InputCheckGroup {...rest} ref={ref} role="radiogroup">
          {children}
        </InputCheckGroup>
      </RadioGroupContext.Provider>
    );
  },
);

export default RadioGroup;
