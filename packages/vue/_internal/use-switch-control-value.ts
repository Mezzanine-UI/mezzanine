import { computed, ref, watch } from 'vue';
import type { ComputedRef } from 'vue';

export interface UseSwitchControlValueOptions {
  /**
   * Reads the controlled `checked` prop. `undefined` means uncontrolled.
   */
  checked: () => boolean | undefined;
  /**
   * Reads the initial value used while uncontrolled.
   */
  defaultChecked: () => boolean | undefined;
  /**
   * Called after the value actually moved, with the original DOM event.
   */
  onChange: (event: Event) => void;
}

export interface SwitchControlValue {
  /**
   * The value to render: the controlled prop when there is one, else the
   * internally tracked value.
   */
  checked: ComputedRef<boolean>;
  /**
   * Bind to the native `change` event of the underlying checkbox.
   */
  onChange: (event: Event) => void;
}

/**
 * Controlled/uncontrolled boolean state for checkbox-backed switches.
 *
 * Ported from React's `useSwitchControlValue` + `useControlValueState`, which
 * keep one state seeded from `defaultChecked` and re-sync it whenever the
 * `checked` prop disagrees. The Vue equivalent of "re-sync during render" is a
 * computed that prefers the prop, plus a watcher so the internal value is
 * still up to date if the component later goes uncontrolled.
 */
export function useSwitchControlValue(
  options: UseSwitchControlValueOptions,
): SwitchControlValue {
  const internal = ref(options.checked() ?? options.defaultChecked() ?? false);

  watch(options.checked, (value) => {
    if (value !== undefined) internal.value = value;
  });

  const checked = computed((): boolean => options.checked() ?? internal.value);

  function onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const next = input.checked;

    if (next !== checked.value) {
      internal.value = next;
      options.onChange(event);
    }

    /**
     * React re-renders from state after every change, so a controlled input
     * whose value did not move is put straight back. Vue patches from reactive
     * state, and state that did not change produces no patch — the checkbox
     * would keep the value the user just clicked and drift away from the prop.
     */
    if (input.checked !== checked.value) input.checked = checked.value;
  }

  return { checked, onChange };
}
