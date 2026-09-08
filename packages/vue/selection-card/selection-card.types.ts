import type { CSSProperties } from 'vue';
import type {
  SelectionCardDirection,
  SelectionCardImageObjectFit,
  SelectionCardType,
} from '@mezzanine-ui/core/selection-card';
import type { IconDefinition } from '@mezzanine-ui/icons';

export interface SelectionCardProps {
  /**
   * Whether the selection is checked.
   */
  checked?: boolean;
  /**
   * The custom icon of selection.
   */
  customIcon?: IconDefinition;
  /**
   * Whether the selection is checked by default.
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The direction of selection.
   * @default 'horizontal'
   */
  direction?: SelectionCardDirection;
  /**
   * If true, selection will be disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * The id of the input element.
   */
  id?: string;
  /**
   * The image of selection. Supports image URL.
   */
  image?: string;
  /**
   * The object fit of selection image.
   * @default 'cover'
   */
  imageObjectFit?: SelectionCardImageObjectFit;
  /**
   * The name of selection.
   *
   * @important When using inside a RadioGroup/CheckboxGroup, this prop is recommended.
   */
  name?: string;
  /**
   * Whether the selection is readonly.
   * @default false
   */
  readonly?: boolean;
  /**
   * The type of selection.
   * @default 'radio'
   */
  selector: SelectionCardType;
  /**
   * The accessible description of selection.
   */
  supportingText?: string;
  /**
   * The max width of the supporting text element.
   * @example '144px' // 12 Chinese characters at 12px
   * @example '216px' // 36 English letters at 12px
   */
  supportingTextMaxWidth?: CSSProperties['maxWidth'];
  /**
   * The accessible text of selection.
   */
  text: string;
  /**
   * The max width of the text element.
   * @example '112px' // 8 Chinese characters at 14px
   * @example '168px' // 24 English letters at 14px
   */
  textMaxWidth?: CSSProperties['maxWidth'];
  /**
   * The value of selection.
   *
   * @important This prop is required when the selection is inside a
   * RadioGroup/CheckboxGroup.
   */
  value?: string;
}
