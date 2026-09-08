import type { SliderValue } from '@mezzanine-ui/core/slider';
import type { IconDefinition } from '@mezzanine-ui/icons';

/**
 * React 交叉出六種變體的 union（三種 addon 組合 × 單值／範圍值），攤平成單一
 * interface。
 *
 * addon 那一半是以 `never` 判別的：`withInput` 的變體禁止 `prefixIcon` /
 * `suffixIcon`，帶圖示的變體禁止 `withInput`；value 那一半則讓 `value` 與
 * `change` 的型別一起在數字和 `[number, number]` 之間切換。Vue 的
 * `defineProps` 解析這種 union 會得到無法使用的結果（與 Input、Tag、Select
 * 同樣的限制），因此每個變體的 prop 都以選用的形式列在這裡。
 *
 * prop 名稱、型別與執行期行為都沒有變；失去的只是編譯期保證 —— 例如
 * `withInput` 與 `prefixIcon` 不能同時給，以及範圍值必定配範圍版的 `change`。
 */
export interface SliderProps {
  /**
   * Whether the slider is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The maximum permitted value
   * @default 100
   */
  max?: number;
  /**
   * The minimum permitted value
   * @default 0
   */
  min?: number;
  /**
   * Set prefix icon. Only used together with `suffixIcon`.
   */
  prefixIcon?: IconDefinition;
  /**
   * The stepping interval.
   * @default 1
   */
  step?: number;
  /**
   * Set suffix icon. Only used together with `prefixIcon`.
   */
  suffixIcon?: IconDefinition;
  /**
   * The value of the slider. A number renders one handle, a `[number, number]`
   * tuple renders a range.
   */
  value: SliderValue;
  /**
   * Whether to show input box to allow user to input value.
   * Not used together with `prefixIcon` / `suffixIcon`.
   */
  withInput?: boolean;
  /**
   * Whether to show tick marks on the slider.
   * If a number is given, it represents the number of equally spaced segments between min and max to display tick marks (excluding min and max).
   * If a number array is given, the values represent the actual slider values at which to show the tick marks (not percentages).
   * @example
   * 3 // means show tick marks at values 25, 50, and 75 (for min=0, max=100)
   * [20, 50, 80] // means show tick marks at values 20, 50, and 80
   */
  withTick?: number | number[];
}
