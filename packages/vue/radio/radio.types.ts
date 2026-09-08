import type { InputCheckSize } from '@mezzanine-ui/core/_internal/input-check';
import type { RadioSize, RadioType } from '@mezzanine-ui/core/radio';
import type { IconDefinition } from '@mezzanine-ui/icons';
import type { InputHTMLAttributes } from 'vue';
import type { InputCheckProps } from '../_internal/input-check.types';
import type { BaseInputProps } from '../input/input.types';

/**
 * The `radio` and `segment` variants React expresses as a union, flattened into
 * one interface — the same reason Tag's and Select's props are flat: Vue's
 * `defineProps` cannot resolve a union discriminated on a literal. What is lost
 * is the compile-time guarantee that, say, `hint` cannot reach a segment.
 */
export interface RadioProps extends Omit<InputCheckProps, 'control'> {
  /**
   * Whether the radio is checked.
   */
  checked?: boolean;
  /**
   * Whether the radio is checked by default.
   * @default false
   */
  defaultChecked?: boolean;
  /** 顯示在 radio 標籤下方的輔助說明文字。僅限 radio 類型。 */
  hint?: string;
  /**
   * The icon in radio prefix. Only available on the segment type.
   */
  icon?: IconDefinition;
  /**
   * Since at Mezzanine we use a host element to wrap our input, most derived props will be passed to the host element.
   *  If you need direct control to the input element, use this prop to provide to it.
   *
   * Noticed that if you pass an id within this prop,
   *  the rendered label element will have `htmlFor` sync with passed in id.
   */
  inputProps?: Omit<
    InputHTMLAttributes,
    | 'checked'
    | 'defaultValue'
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
   * The size of radio.
   * @default 'main'
   */
  size?: InputCheckSize | RadioSize;
  /**
   * The type of radio.
   * @default 'radio'
   */
  type?: RadioType;
  /**
   * The value of input in radio.
   */
  value?: string;
  /**
   * When `withInputConfig` is provided, an `Input` component is rendered alongside the
   * radio using the passed props. By default, this input has a width of 120px unless you
   * override it via the `width` property below.
   *
   * Only available on the radio type.
   */
  withInputConfig?: Pick<
    BaseInputProps,
    'disabled' | 'placeholder' | 'value'
  > & {
    /** Change handler for the paired input, spelled the way `v-bind` hands one to a component. */
    onChange?: (event: Event) => void;
    width?: number;
  };
}
