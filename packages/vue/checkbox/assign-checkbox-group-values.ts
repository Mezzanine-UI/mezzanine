import type {
  CheckboxGroupChangeEvent,
  CheckboxGroupChangeEventTarget,
} from './checkbox-group.types';

/**
 * Writes the group's latest values onto the change event, the way React does,
 * so a consumer reads them from `event.target.values`.
 *
 * @example
 * ```ts
 * emit('change', assignCheckboxGroupValuesToEvent(event, values, name));
 * ```
 *
 * @see MznCheckboxGroup 送出這個事件的元件
 */
export function assignCheckboxGroupValuesToEvent(
  event: Event,
  values: string[],
  name: string,
): CheckboxGroupChangeEvent {
  const target = event.target as CheckboxGroupChangeEventTarget;

  target.values = values;

  if (name) {
    target.name = name;
  }

  return event as CheckboxGroupChangeEvent;
}
