import type { VNodeChild } from 'vue';
import type { IconDefinition } from '@mezzanine-ui/icons';

export interface FormLabelProps {
  /**
   * The icon shown after the label; hovering it opens a tooltip.
   */
  informationIcon?: IconDefinition;
  /**
   * The tooltip text for `informationIcon`.
   */
  informationText?: string;
  /**
   * The label's text.
   */
  labelText: string;
  /**
   * Marker rendered after the label, typically "(optional)".
   */
  optionalMarker?: VNodeChild;
}
