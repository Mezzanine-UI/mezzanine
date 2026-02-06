'use client';

import { forwardRef } from 'react';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { cx } from '../utils/cx';
import { ComponentOverridableForwardRefComponentPropsFactory } from '../utils/jsx-types';
import Icon from '../Icon';
import { QuickActionCardComponent, QuickActionCardProps } from './typings';

export type QuickActionCardComponentProps<
  C extends QuickActionCardComponent = 'button',
> = ComponentOverridableForwardRefComponentPropsFactory<
  QuickActionCardComponent,
  C,
  QuickActionCardProps
>;

/**
 * QuickActionCard is a compact card component for quick actions.
 * It displays an icon with a title and optional subtitle.
 * Either icon or title must be provided.
 */
const QuickActionCard = forwardRef<
  HTMLButtonElement,
  QuickActionCardComponentProps
>(function QuickActionCard(props, ref) {
  const {
    className,
    component: Component = 'button',
    disabled = false,
    icon,
    mode = 'horizontal',
    readOnly = false,
    subtitle,
    title,
    ...rest
  } = props;

  return (
    <Component
      {...rest}
      ref={ref}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      className={cx(
        classes.quickAction,
        {
          [classes.quickActionDisabled]: disabled,
          [classes.quickActionReadOnly]: readOnly,
          [classes.quickActionVertical]: mode === 'vertical',
        },
        className,
      )}
    >
      {icon && (
        <Icon icon={icon} size={24} className={classes.quickActionIcon} />
      )}
      {title || subtitle ? (
        <div className={classes.quickActionContent}>
          {title && <span className={classes.quickActionTitle}>{title}</span>}
          {subtitle && (
            <span className={classes.quickActionSubtitle}>{subtitle}</span>
          )}
        </div>
      ) : null}
    </Component>
  );
});

QuickActionCard.displayName = 'QuickActionCard';

export default QuickActionCard;
