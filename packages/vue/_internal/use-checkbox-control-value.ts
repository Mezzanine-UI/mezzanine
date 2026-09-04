import type { ComputedRef } from 'vue';
import {
  useSwitchControlValue,
  type UseSwitchControlValueOptions,
} from './use-switch-control-value';

export interface CheckboxGroupControlContextValue {
  /** Called with the checkbox's own change event. */
  onChange?: (event: Event) => void;
  /** The values the group currently holds. */
  value?: string[];
}

export interface UseCheckboxControlValueOptions
  extends UseSwitchControlValueOptions {
  /** The surrounding group's state, when the checkbox is inside one. */
  checkboxGroup?: () => CheckboxGroupControlContextValue | undefined;
  /** This checkbox's own value, matched against the group's. */
  value?: () => string | undefined;
}

export interface CheckboxControlValue {
  /** Whether the checkbox is checked. */
  checked: ComputedRef<boolean>;
  /** Bind to the native `change` event. */
  onChange: (event: Event) => void;
}

/**
 * 管理核取方塊勾選狀態的受控 composable。
 *
 * 獨立使用時與 useSwitchControlValue 相同；放在群組裡時勾選狀態改由群組的
 * `value` 陣列是否包含自己的 `value` 決定，change 也會同時通知群組。
 *
 * @example
 * ```ts
 * const { checked, onChange } = useCheckboxControlValue({
 *   checked: () => props.checked,
 *   defaultChecked: () => props.defaultChecked,
 *   onChange: (event) => emit('change', event),
 *   checkboxGroup: () => group?.value,
 *   value: () => props.value,
 * });
 * ```
 *
 * @see MznCheckbox 搭配的元件
 */
export function useCheckboxControlValue(
  options: UseCheckboxControlValueOptions,
): CheckboxControlValue {
  const { checkboxGroup, checked, defaultChecked, onChange, value } = options;

  return useSwitchControlValue({
    /**
     * To ensure checkbox inside checkbox group, not use destructure here
     */
    checked: () => {
      const group = checkboxGroup?.();

      if (!group) return checked();

      const own = value?.();

      return group.value && own != null ? group.value.includes(own) : false;
    },
    defaultChecked,
    onChange: (event) => {
      onChange(event);

      checkboxGroup?.()?.onChange?.(event);
    },
  });
}
