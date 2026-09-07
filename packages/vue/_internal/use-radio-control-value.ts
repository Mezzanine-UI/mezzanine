import type { ComputedRef } from 'vue';
import { useSwitchControlValue } from './use-switch-control-value';

export interface RadioGroupControlContextValue {
  onChange?: (event: Event) => void;
  value?: string;
}

export interface UseRadioControlValueOptions {
  /** Reads the controlled checked state. `undefined` means uncontrolled. */
  checked: () => boolean | undefined;
  /** Whether the radio starts checked while uncontrolled. */
  defaultChecked?: () => boolean | undefined;
  onChange?: (event: Event) => void;
  /** The group this radio belongs to, when it is inside one. */
  radioGroup: () => RadioGroupControlContextValue | undefined;
  /** This radio's own value, compared against the group's. */
  value: () => string | undefined;
}

export interface RadioControlValue {
  checked: ComputedRef<boolean>;
  onChange: (event: Event) => void;
}

/**
 * 管理 Radio 選取狀態的受控 composable。
 *
 * 獨立使用時依 `checked` / `defaultChecked`；在 MznRadioGroup 內則以群組的 `value`
 * 與自己的 `value` 比對決定是否選中，change 會同時通知自己與群組。
 *
 * @example
 * ```ts
 * const { checked, onChange } = useRadioControlValue({
 *   checked: () => props.checked,
 *   radioGroup: () => group?.value,
 *   value: () => props.value,
 * });
 * ```
 *
 * @see MznRadio 使用這個 composable 的元件
 * @see MznRadioGroup 提供群組情境的元件
 */
export function useRadioControlValue(
  options: UseRadioControlValueOptions,
): RadioControlValue {
  const {
    checked: checkedProp,
    defaultChecked,
    onChange: onChangeProp,
    radioGroup,
    value,
  } = options;

  return useSwitchControlValue({
    /**
     * To ensure radio inside radio group, not read `checked` here
     */
    checked: () => {
      const group = radioGroup();

      return group ? group.value === value() : checkedProp();
    },
    defaultChecked: () => defaultChecked?.(),
    onChange: (event) => {
      onChangeProp?.(event);
      radioGroup()?.onChange?.(event);
    },
  });
}
