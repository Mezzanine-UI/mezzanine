'use client';

import { ChangeEventHandler, forwardRef, useContext } from 'react';
import {
  toggleClasses as classes,
  ToggleSize,
} from '@mezzanine-ui/core/toggle';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useSwitchControlValue } from '../Form/useSwitchControlValue';
import { FormControlContext } from '../Form';
import Typography from '../Typography';

export interface ToggleProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onChange'> {
  /**
   * Whether the toggle is checked.
   */
  checked?: boolean;
  /**
   * Whether the toggle is checked by default.
   * Only used for uncontrolled.
   */
  defaultChecked?: boolean;
  /**
   * Whether the toggle is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Since at Mezzanine we use a host element to wrap our input, most derived props will be passed to the host element.
   * If you need direct control to the input element, use this prop to provide to it.
   */
  inputProps?: Omit<
    NativeElementPropsWithoutKeyAndRef<'input'>,
    | 'checked'
    | 'defaultChecked'
    | 'disabled'
    | 'onChange'
    | 'placeholder'
    | 'type'
    | 'value'
    | `aria-${'disabled' | 'checked'}`
  >;
  /**
   * The label text displayed beside the toggle.
   */
  label?: string;
  /**
   * Invoked by input change event.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * The size of toggle.
   * @default 'main'
   */
  size?: ToggleSize;
  /**
   * Supporting text displayed below the label.
   */
  supportingText?: string;
}

/**
 * 切換開關元件，用於表示開／關二元狀態。
 *
 * 支援受控（`checked` + `onChange`）與非受控（`defaultChecked`）兩種用法；
 * `label` 顯示於開關右側，`supportingText` 顯示於 label 下方作為輔助說明。
 * `disabled` 可透過 `FormControlContext` 自動繼承，無需手動傳入。
 *
 * @example
 * ```tsx
 * import Toggle from '@mezzanine-ui/react/Toggle';
 *
 * // 受控用法
 * <Toggle
 *   checked={enabled}
 *   onChange={(e) => setEnabled(e.target.checked)}
 *   label="啟用通知"
 * />
 *
 * // 非受控用法（預設開啟）
 * <Toggle defaultChecked label="自動儲存" />
 *
 * // 帶輔助說明文字
 * <Toggle
 *   checked={darkMode}
 *   onChange={(e) => setDarkMode(e.target.checked)}
 *   label="深色模式"
 *   supportingText="切換介面主題配色"
 * />
 *
 * // 停用狀態
 * <Toggle disabled label="此功能暫不開放" />
 * ```
 *
 * @see {@link useSwitchControlValue} 管理 Toggle 受控／非受控值狀態的 hook
 * @see {@link Checkbox} 多選框元件，適用於多選場景
 */
const Toggle = forwardRef<HTMLDivElement, ToggleProps>(
  function Toggle(props, ref) {
    const { disabled: disabledFromFormControl } =
      useContext(FormControlContext) || {};
    const {
      checked: checkedProp,
      className,
      defaultChecked,
      disabled = disabledFromFormControl,
      inputProps,
      label,
      onChange: onChangeProp,
      size = 'main',
      supportingText,
      ...rest
    } = props;
    const [checked, onChange] = useSwitchControlValue({
      checked: checkedProp,
      defaultChecked,
      onChange: onChangeProp,
    });

    return (
      <div
        ref={ref}
        {...rest}
        className={cx(
          classes.host,
          {
            [classes.checked]: checked,
            [classes.disabled]: disabled,
            [classes.main]: size === 'main',
            [classes.sub]: size === 'sub',
          },
          className,
        )}
      >
        <div className={classes.inputContainer}>
          <span className={classes.knob} />
          <input
            {...inputProps}
            aria-checked={checked}
            aria-disabled={disabled}
            checked={checked}
            className={classes.input}
            disabled={disabled}
            onChange={onChange}
            type="checkbox"
          />
        </div>
        {label && (
          <div className={classes.textContainer}>
            <Typography color="text-neutral-solid" variant="label-primary">
              {label}
            </Typography>
            {supportingText && (
              <Typography color="text-neutral" variant="caption">
                {supportingText}
              </Typography>
            )}
          </div>
        )}
      </div>
    );
  },
);

export default Toggle;
