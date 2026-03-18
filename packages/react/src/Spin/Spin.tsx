import { CSSProperties, forwardRef, useRef } from 'react';
import { iconClasses as classes } from '@mezzanine-ui/core/spin';
import Backdrop, { BackdropProps } from '../Backdrop';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { GeneralSize } from '@mezzanine-ui/system/size';

export interface SpinProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
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
   * Whether Spin is loading.
   * @default false
   */
  loading?: boolean;
  /**
   * Custom color for the spinner track (the non-animated ring background).
   * Sets the `--mzn-spin--track-color` CSS variable on the ring element.
   * Accepts any valid CSS color value.
   * @default transparent
   */
  trackColor?: string;
  /**
   * Custom backdrop props (only display when nested children)
   */
  backdropProps?: Omit<BackdropProps, 'container' | 'open'>;
}

const Spin = forwardRef<HTMLDivElement, SpinProps>(function Spin(props, ref) {
  const hostRef = useRef<HTMLDivElement>(null);
  const {
    children,
    className,
    color,
    description,
    descriptionClassName,
    stretch = false,
    size = 'main',
    loading = false,
    trackColor,
    backdropProps = {},
  } = props;

  const isNestedPattern = typeof children !== 'undefined';
  const composedHostRef = useComposeRefs([ref, hostRef]);

  const ringVars = {
    ...(color && { '--mzn-spin--color': color }),
    ...(trackColor && { '--mzn-spin--track-color': trackColor }),
  } as CSSProperties;

  const spinElement = loading ? (
    <div
      ref={isNestedPattern ? null : ref}
      className={cx(classes.spin, classes.size(size), {
        [classes.stretch]: stretch,
      })}
    >
      <span className={classes.spinnerRing} style={ringVars}>
        <span className={classes.spinnerTail} />
      </span>
      {description ? (
        <span className={cx(classes.description, descriptionClassName)}>
          {description}
        </span>
      ) : null}
    </div>
  ) : null;

  if (isNestedPattern) {
    return (
      <div
        ref={composedHostRef}
        className={cx(
          classes.host,
          {
            [classes.stretch]: stretch,
          },
          className,
        )}
      >
        <Backdrop
          {...backdropProps}
          container={hostRef}
          open={loading}
          style={{ pointerEvents: 'none' }}
          variant="light"
        >
          {spinElement}
        </Backdrop>
        {children}
      </div>
    );
  }

  return spinElement;
});

export default Spin;
