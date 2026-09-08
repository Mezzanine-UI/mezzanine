import type { RadioType } from '@mezzanine-ui/core/radio';
import type { InputCheckGroupProps } from '../_internal/input-check-group.types';
import type { RadioProps } from './radio.types';

/**
 * An option of the group, rendered as one radio. React splits this into a
 * normal and a segment shape, which differ only in which of `icon` / `hint` is
 * `never`; flattened for the same reason `RadioProps` is.
 */
export interface RadioGroupOption
  extends Pick<
    RadioProps,
    'disabled' | 'error' | 'hint' | 'icon' | 'withInputConfig'
  > {
  id: string;
  name: number | string;
}

/**
 * The `radio` and `segment` variants React expresses as a union, flattened into
 * one interface — `options` accepts either shape here.
 */
export interface RadioGroupProps extends InputCheckGroupProps {
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
   * The options of radio group.
   * Will be ignored if the default slot is filled.
   */
  options?: RadioGroupOption[];
  /**
   * The type of radio group.
   * Control the type of radios in group if type not passed to radio.
   */
  type?: RadioType;
  /**
   * The value of radio group.
   */
  value?: string;
}
