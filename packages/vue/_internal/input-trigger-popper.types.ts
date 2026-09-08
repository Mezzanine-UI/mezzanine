import type { FadeProps } from '../transition/fade.types';
import type { PopperProps } from '../popper/popper.types';

export interface InputTriggerPopperProps extends PopperProps {
  /**
   * Other fade props you may provide to `MznFade`.
   */
  fadeProps?: Omit<FadeProps, 'in'>;
  /**
   * Whether to set the same width as its reference.
   */
  sameWidth?: boolean;
}
