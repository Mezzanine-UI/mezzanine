import {
  ChangeEventHandler,
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
} from 'react';
import {
  switchClasses as classes,
  SwitchSize,
  SwitchSpinnerIcon,
} from '@mezzanine-ui/core/switch';
import { cx } from '../utils/cx';
import Icon from '../Icon';
import { useSwitchControl } from './useSwitchControl';

export interface SwitchProps
  extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, 'ref' | 'onChange'> {
  /**
   * If true, switch will be opened.
   */
  checked?: boolean;
  /**
   * If true, switch will be opened initially.
   */
  defaultChecked?: boolean;
  /**
   * If true, replace the border and background color.
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, replace the original icon.
   * Replace iconEnd if only iconEnd provided, or iconStart.
   * @default false
   */
  loading?: boolean;
  /**
   * Invoked by input change event.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * The size of switch.
   * @default 'medium'
   */
  size?: SwitchSize;
}

/**
 * The react component for `mezzanine` switch.
 */
const Switch = forwardRef<HTMLSpanElement, SwitchProps>(function Switch(props, ref) {
  const {
    checked: checkedProp,
    className,
    defaultChecked,
    disabled: disabledProp = false,
    loading = false,
    onChange: onChangeProp,
    size = 'medium',
    ...rest
  } = props;
  const disabled = disabledProp || loading;
  const { checked, onChange } = useSwitchControl({
    checked: checkedProp,
    defaultChecked,
    onChange: onChangeProp,
  });

  return (
    <span
      ref={ref}
      {...rest}
      className={cx(
        classes.host,
        {
          [classes.checked]: checked,
          [classes.disabled]: disabled,
          [classes.large]: size === 'large',
        },
        className,
      )}
    >
      <span className={classes.control}>
        {loading && <Icon icon={SwitchSpinnerIcon} spin />}
      </span>
      <input
        aria-checked={checked}
        aria-disabled={disabled}
        checked={checked}
        className={classes.input}
        disabled={disabled}
        onChange={onChange}
        type="checkbox"
      />
    </span>
  );
});

export default Switch;
