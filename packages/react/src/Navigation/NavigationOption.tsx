'use client';

import { forwardRef, ReactElement, useRef, useState } from 'react';
import { navigationSubMenuClasses as classes } from '@mezzanine-ui/core/navigation';
import { ChevronUpIcon, ChevronDownIcon } from '@mezzanine-ui/icons';
import { size } from '@floating-ui/react-dom';
import { useClickAway } from '../hooks/useClickAway';
import { cx } from '../utils/cx';
import { useComposeRefs } from '../hooks/useComposeRefs';
import Icon from '../Icon';
import { Collapse } from '../Transition';
import NavigationItem, { NavigationItemProps } from './NavigationItem';

export type NavigationSubMenuChild = ReactElement<NavigationItemProps>;

export type NavigationSubMenuChildren =
  | NavigationSubMenuChild
  | NavigationSubMenuChild[];
export interface NavigationOptionProps
  extends Omit<NavigationItemProps, 'onClick' | 'eventKey' | 'key'> {
  /**
   * Strict children with `NavigationItem`.
   * @default []
   */
  children?: NavigationSubMenuChildren;
  /**
   * Set display title for sub-menu item.
   */
  title?: string;
  /**
   * Open menu as default
   * @default false
   */
  defaultOpen?: boolean;
}

// Middleware to make the submenu have the same width as the reference element
const sameWidthMiddleware = size({
  apply({ rects, elements }) {
    Object.assign(elements.floating.style, {
      width: `${rects.reference.width}px`,
    });
  },
});

const NavigationOption = forwardRef<HTMLLIElement, NavigationOptionProps>(
  (props, ref) => {
    const {
      active,
      className,
      children = [],
      defaultOpen = false,
      icon,
      title,
      ...rest
    } = props;

    const [open, setOpen] = useState<boolean>(defaultOpen);
    const nodeRef = useRef<HTMLLIElement>(null);
    const composedNodeRef = useComposeRefs([ref, nodeRef]);

    const GroupToggleIcon = open ? ChevronUpIcon : ChevronDownIcon;

    useClickAway(
      () => {
        if (!open) {
          return;
        }

        return () => {
          setOpen(!open);
        };
      },
      nodeRef,
      [open],
    );

    const WrapChildren = <ul className={classes.group}>{children}</ul>;

    return (
      <NavigationItem
        {...rest}
        ref={composedNodeRef}
        className={cx(
          classes.host,
          active && classes.active,
          open && classes.open,
          className,
        )}
        onClick={() => setOpen(!open)}
      >
        <div className={classes.title}>
          {icon && <Icon className={classes.icon} icon={icon} />}
          {title}
          {children && (
            <Icon className={classes.toggleIcon} icon={GroupToggleIcon} />
          )}
        </div>
        {children && (
          <Collapse
            style={{
              width: '100%',
            }}
            in={!!open}
          >
            {WrapChildren}
          </Collapse>
        )}
      </NavigationItem>
    );
  },
);

export default NavigationOption;
