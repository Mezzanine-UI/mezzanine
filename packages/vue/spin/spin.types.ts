import type { GeneralSize } from '@mezzanine-ui/system/size';
import type { BackdropProps } from '../backdrop/backdrop.types';

export interface SpinProps {
  /**
   * Custom backdrop props (only display when nested children)
   */
  backdropProps?: Omit<BackdropProps, 'container' | 'open'>;
  /**
   * Custom color for the spinner arc animation.
   * Sets the `--mzn-spin--color` CSS variable on the ring element.
   * Accepts any valid CSS color value.
   * @default palette icon brand color
   */
  color?: string;
  /**
   * Customize description content
   */
  description?: string;
  /**
   * Customize description content className
   */
  descriptionClassName?: string;
  /**
   * Whether Spin is loading.
   * @default false
   */
  loading?: boolean;
  /**
   * Component Size
   * @default 'main'
   */
  size?: GeneralSize;
  /**
   * When set stretch=true, host container will stretch to width & height 100%
   * @default false
   */
  stretch?: boolean;
  /**
   * Custom color for the spinner track (the non-animated ring background).
   * Sets the `--mzn-spin--track-color` CSS variable on the ring element.
   * Accepts any valid CSS color value.
   * @default transparent
   */
  trackColor?: string;
}
