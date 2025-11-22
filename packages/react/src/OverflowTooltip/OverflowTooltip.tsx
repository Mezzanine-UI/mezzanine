import { forwardRef } from 'react';
import { overflowTooltipClasses as classes } from '@mezzanine-ui/core/overflow-tooltip';
import Popper, { PopperProps } from '../Popper';
import Tag, { TagProps } from '../Tag';
import { cx } from '../utils/cx';
import { getCSSVariableValue } from '../utils/get-css-variable-value';
import { flip, offset, Placement, shift } from '@floating-ui/react-dom';
import { spacingPrefix } from '@mezzanine-ui/system/spacing';

export type OverflowTooltipProps = {
  /** Popper anchor that tells the tooltip which trigger element or DOM node to follow. */
  anchor: PopperProps['anchor'];
  /** Optional root className for integrating custom styles. */
  className?: string;
  /** Fired when a tag's dismiss icon is clicked, returning the removed tag's index for syncing state. */
  onTagDismiss: (tagIndex: number) => void;
  /** Controls whether the tooltip is rendered; true mounts the Popper and computes placement. */
  open: boolean;
  /**
   * Popper placement, allowing consumers to change the tooltip direction.
   * @default top-start
   */
  placement?: Placement;
  /** List of tag labels to render; each entry becomes a dismissable tag. */
  tags: string[];
  /**
   * Size of tags.
   * @default main
   */
  tagSize?: TagProps['size'];
};

/**
 * The react component for `mezzanine` overflow-tooltip.
 */
const OverflowTooltip = forwardRef<HTMLDivElement, OverflowTooltipProps>(
  function OverflowTooltip(props, ref) {
    const {
      anchor,
      className,
      onTagDismiss,
      open,
      placement = 'top-start',
      tags,
      tagSize,
    } = props;

    const offsetValue =
      Number(
        getCSSVariableValue(`--${spacingPrefix}-gap-base`).replace('rem', ''),
      ) * 16;
    const arrowHeight =
      Number(
        getCSSVariableValue(`--${spacingPrefix}-size-element-tight`).replace(
          'rem',
          '',
        ),
      ) * 16;

    const middleware = [offset({ mainAxis: offsetValue + arrowHeight })];
    const flipMiddleware = flip({
      crossAxis: 'alignment',
      fallbackAxisSideDirection: 'end',
    });
    const shiftMiddleware = shift();

    if (placement.includes('-')) {
      middleware.push(flipMiddleware, shiftMiddleware);
    } else {
      middleware.push(shiftMiddleware, flipMiddleware);
    }

    return (
      <Popper
        ref={ref}
        anchor={anchor}
        open={open}
        arrow={{ enabled: true, className: classes.arrow }}
        className={cx(classes.host, className)}
        options={{ placement, middleware }}
      >
        <div className={classes.content}>
          {tags.map((tag, index) => (
            <Tag
              key={index}
              type="dismissable"
              label={tag}
              onClose={() => onTagDismiss(index)}
              size={tagSize}
            />
          ))}
        </div>
      </Popper>
    );
  },
);

export default OverflowTooltip;
