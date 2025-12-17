import { forwardRef, useRef } from 'react';
import { SpinnerIcon } from '@mezzanine-ui/icons';
import { iconClasses as classes } from '@mezzanine-ui/core/spin';
import Icon, { IconProps } from '../Icon';
import Backdrop, { BackdropProps } from '../Backdrop';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { GeneralSize } from '@mezzanine-ui/system/size';

export interface SpinProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
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
   * Custom icon props
   */
  iconProps?: Omit<IconProps, 'icon' | 'spin'>;
  /**
   * Whether Spin is loading.
   * @default false
   */
  loading?: boolean;
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
    description,
    descriptionClassName,
    stretch = false,
    size = 'main',
    iconProps = {},
    loading = false,
    backdropProps = {},
  } = props;

  const {
    className: iconClassName,
    color: iconColor,
    size: iconSize,
    style: iconStyle,
    ...iconPropsRest
  } = iconProps;

  const isNestedPattern = typeof children !== 'undefined';
  const composedHostRef = useComposeRefs([ref, hostRef]);

  const spinElement = loading ? (
    <div
      ref={isNestedPattern ? null : ref}
      className={cx(classes.spin, classes.size(size), {
        [classes.stretch]: stretch,
      })}
    >
      <Icon
        {...iconPropsRest}
        className={cx(classes.icon, iconClassName)}
        color={iconColor}
        icon={SpinnerIcon}
        spin
        style={{
          ...(iconSize ? { fontSize: `${iconSize}px` } : {}),
          ...(iconStyle || {}),
        }}
      />
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
