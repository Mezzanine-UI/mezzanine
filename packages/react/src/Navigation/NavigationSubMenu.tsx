'use client';

import { forwardRef, ReactElement, useContext, useRef, useState } from 'react';
import { navigationSubMenuClasses as classes } from '@mezzanine-ui/core/navigation';
import { ChevronUpIcon, ChevronDownIcon } from '@mezzanine-ui/icons';
import { useClickAway } from '../hooks/useClickAway';
import { cx } from '../utils/cx';
import { useComposeRefs } from '../hooks/useComposeRefs';
import Popper, { PopperOptions } from '../Popper';
import Icon from '../Icon';
import { Collapse } from '../Transition';
import NavigationItem, { NavigationItemProps } from './NavigationItem';
import { NavigationContext } from './NavigationContext';

export type NavigationSubMenuChild = ReactElement<NavigationItemProps>;

export type NavigationSubMenuChildren =
  | NavigationSubMenuChild
  | NavigationSubMenuChild[];
export interface NavigationSubMenuProps
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
/* istanbul ignore next */
const popperOptions: PopperOptions<any> = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 0],
      },
    },
    {
      name: 'sameWidth',
      enabled: true,
      phase: 'beforeWrite',
      requires: ['computeStyles'],
      fn: ({ state }) => {
        const reassignState = state;

        reassignState.styles.popper.width = `${state.rects.reference.width}px`;
      },
      effect: ({ state }) => {
        const reassignState = state;

        reassignState.elements.popper.style.width = `${
          state.elements.reference.getBoundingClientRect().width
        }px`;
      },
    },
  ],
};

const NavigationSubMenu = forwardRef<HTMLLIElement, NavigationSubMenuProps>(
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
    const { orientation } = useContext(NavigationContext);

    const GroupToggleIcon = open ? ChevronUpIcon : ChevronDownIcon;

    useClickAway(
      () => {
        if (!open || orientation === 'vertical') {
          return;
        }

        return () => {
          setOpen(!open);
        };
      },
      nodeRef,
      [open, orientation],
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
          icon && orientation === 'vertical' && classes.indent,
          className,
        )}
        onClick={() => setOpen(!open)}
      >
        <div className={classes.title}>
          {icon && <Icon className={classes.icon} icon={icon} />}
          {title}
          <Icon className={classes.toggleIcon} icon={GroupToggleIcon} />
        </div>
        {orientation === 'horizontal' && (
          <Popper
            anchor={nodeRef}
            disablePortal
            open={!!open}
            options={popperOptions}
          >
            {WrapChildren}
          </Popper>
        )}
        {orientation === 'vertical' && (
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

export default NavigationSubMenu;
