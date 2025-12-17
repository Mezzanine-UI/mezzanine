import { forwardRef } from 'react';
import { tabClasses as classes } from '@mezzanine-ui/core/tab';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { IconDefinition } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import Badge from '../Badge';

export interface TabItemProps
  extends NativeElementPropsWithoutKeyAndRef<'button'> {
  /**
   * Whether the tab is active.
   * Controlled by tabs.
   */
  active?: boolean;
  /**
   * The badge count to display on the tab.
   */
  badgeCount?: number;
  /**
   * Whether the tab is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The icon to display on the tab.
   */
  icon?: IconDefinition;
}

/**
 * The react component for `mezzanine` tab.
 */
const TabItem = forwardRef<HTMLButtonElement, TabItemProps>(
  function Tab(props, ref) {
    const {
      active,
      badgeCount,
      children,
      className,
      disabled = false,
      icon,
      ...rest
    } = props;

    return (
      <button
        {...rest}
        aria-disabled={disabled}
        className={cx(
          classes.tabItem,
          {
            [classes.tabItemActive]: active,
          },
          className,
        )}
        disabled={disabled}
        ref={ref}
        type="button"
      >
        {icon && <Icon className={classes.tabItemIcon} icon={icon} size={16} />}
        {children}
        {badgeCount && (
          <Badge
            className={classes.tabItemBadge}
            count={badgeCount}
            variant={active ? 'count-brand' : 'count-inactive'}
          />
        )}
      </button>
    );
  },
);

export default TabItem;
