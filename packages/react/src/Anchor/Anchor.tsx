import { forwardRef } from 'react';
import { anchorClasses as classes } from '@mezzanine-ui/core/anchor';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Typography from '../Typography';

export interface AnchorProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onClick'> {
  /** The current active anchor ID */
  activeAnchorId?: string;
  /** Whether apply ellipsis or not
   * @default false
   */
  ellipsis?: boolean;
  /**
   * Anchor list.
   */
  list: {
    id: string;
    name: string;
  }[];
  /**
   * The maximum width for anchor container. This might be useful when you need to set `ellipsis: true`.
   */
  maxWidth?: number;
  /**
   * Trigger when user click on any anchor.
   */
  onClick?: (nextAnchorId: string) => void;
}

/**
 * The react component for `mezzanine` anchor.
 * This component should always be full width of its parent.
 */
const Anchor = forwardRef<HTMLDivElement, AnchorProps>(
  function Anchor(props, ref) {
    const {
      activeAnchorId,
      className,
      ellipsis = false,
      list,
      maxWidth,
      onClick,
      style,
      ...rest
    } = props;

    const resolvedStyle = {
      ...(style || {}),
      ...(maxWidth ? { maxWidth: `${maxWidth}px` } : {}),
    };

    return (
      <div
        ref={ref}
        className={cx(classes.host, className)}
        style={resolvedStyle}
        {...rest}
      >
        <div className={classes.bar} />
        {list.map((anchor) => (
          <button
            key={anchor.id}
            type="button"
            onClick={() => onClick?.(anchor.id)}
            className={cx(
              classes.anchor,
              activeAnchorId === anchor.id && classes.anchorActive,
            )}
          >
            <Typography variant="input3" color="inherit" ellipsis={ellipsis}>
              {anchor.name}
            </Typography>
          </button>
        ))}
      </div>
    );
  },
);

export default Anchor;
