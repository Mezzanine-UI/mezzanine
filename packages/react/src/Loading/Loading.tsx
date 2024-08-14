import { forwardRef, useRef } from 'react';
import { SpinnerIcon } from '@mezzanine-ui/icons';
import { iconClasses as classes } from '@mezzanine-ui/core/loading';
import Icon, { IconProps } from '../Icon';
import Overlay, { OverlayProps } from '../Overlay';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface LoadingProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
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
   * Whether Loading is loading.
   * @default false
   */
  loading?: boolean;
  /**
   * Custom overlay props (only display when nested children)
   */
  overlayProps?: Omit<OverlayProps, 'container' | 'open'>;
  /**
   * Customize description content
   */
  tip?: string;
  /**
   * Customize description content className
   */
  tipClassName?: string;
}

const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  function Loading(props, ref) {
    const hostRef = useRef<HTMLDivElement>(null);
    const {
      children,
      className,
      stretch = false,
      iconProps = {},
      loading = false,
      overlayProps = {},
      tip,
      tipClassName,
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
        className={cx(classes.spin, {
          [classes.stretch]: stretch,
        })}
      >
        <Icon
          {...iconPropsRest}
          className={cx(classes.icon, iconClassName)}
          color={iconColor || 'primary'}
          icon={SpinnerIcon}
          spin
          style={{
            ...(iconSize ? { fontSize: `${iconSize}px` } : {}),
            ...(iconStyle || {}),
          }}
        />
        {tip ? (
          <span className={cx(classes.tip, tipClassName)}>{tip}</span>
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
          <Overlay
            {...overlayProps}
            container={hostRef}
            onSurface
            open={loading}
          >
            {spinElement}
          </Overlay>
          {children}
        </div>
      );
    }

    return spinElement;
  },
);

export default Loading;
