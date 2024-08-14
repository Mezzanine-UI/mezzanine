import {
  forwardRef,
  MouseEvent,
  useContext,
  Key,
  ReactNode,
  useCallback,
} from 'react';
import { navigationItemClasses as classes } from '@mezzanine-ui/core/navigation';
import { IconDefinition } from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { NavigationContext } from './NavigationContext';
import Icon from '../Icon';

export interface NavigationItemProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'li'>, 'onClick'> {
  /**
   * Whether the item is active.
   */
  active?: boolean;
  /**
   * Item display content.
   */
  children?: ReactNode;
  /**
   * Unique ID of the item.
   */
  key?: Key | null;
  /**
   * @ignore
   */
  eventKey?: Key | null;
  /**
   * Icon of the item.
   */
  icon?: IconDefinition;
  /**
   * Called when item is clicked.
   */
  onClick?: (key?: Key | string | null) => void;
}

const NavigationItem = forwardRef<HTMLLIElement, NavigationItemProps>(
  (props, ref) => {
    const { active, children, className, eventKey, icon, onClick, ...rest } =
      props;

    const { orientation } = useContext(NavigationContext);

    const handleClick = useCallback(
      (event: MouseEvent<HTMLLIElement>) => {
        if (orientation === 'vertical') {
          event.stopPropagation();
        }

        if (onClick) {
          onClick(eventKey);
        }
      },
      [eventKey, onClick, orientation],
    );

    return (
      <li
        {...rest}
        ref={ref}
        className={cx(classes.host, active && classes.active, className)}
        role="menuitem"
        onClick={handleClick}
        onKeyDown={() => {}}
      >
        {icon && <Icon className={classes.icon} icon={icon} />}
        {children}
      </li>
    );
  },
);

export default NavigationItem;
