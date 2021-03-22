import {
  forwardRef,
  ReactElement,
  useContext,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  navigationSubMenuClasses as classes,
} from '@mezzanine-ui/core/navigation';
import {
  ChevronUpIcon,
  ChevronDownIcon,
} from '@mezzanine-ui/icons';
import { useClickAway } from '../hooks/useClickAway';
import { cx } from '../utils/cx';
import { useComposeRefs } from '../hooks/useComposeRefs';
import Popper, { PopperOptions } from '../Popper';
import Icon from '../Icon';
import { Collapse } from '../Transition';
import NavigationItem, { NavigationItemProps } from './NavigationItem';
import { NavigationContext } from './NavigationContext';

export type NavigationSubMenuChild =
ReactElement<NavigationItemProps>;

export type NavigationSubMenuChildren = NavigationSubMenuChild[];
export interface NavigationSubMenuProps extends
  Omit<NavigationItemProps, 'key' | 'eventKey' | 'onClick'> {
  /**
   * Strict children with `NavigationItem`.
   * @default []
   */
  children?: NavigationSubMenuChildren;
  /**
   * Set display title for sub-menu item.
   */
  title?: string;
}

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

const NavigationSubMenu = forwardRef<HTMLLIElement, NavigationSubMenuProps>((props, ref) => {
  const {
    className,
    children = [],
    title,
    active,
    icon,
    ...rest
  } = props;

  const [open, setOpen] = useState<HTMLLIElement | null | boolean>(null);
  const nodeRef = useRef<HTMLLIElement>(null);
  const composedNodeRef = useComposeRefs([ref, nodeRef]);
  const {
    orientation,
  } = useContext(NavigationContext);

  const GroupCollapseIcon = open ? ChevronUpIcon : ChevronDownIcon;

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
    [
      open,
      orientation,
    ],
  );

  const clickHandler = useCallback(() => {
    if (orientation === 'vertical') {
      setOpen(!open);
    } else {
      const { current: node } = nodeRef;

      setOpen(open === node ? null : node);
    }
  },
  [open, orientation]);

  const ActionChildren = useMemo(() => {
    const WrapChildren = (
      <ul
        className={classes.group}
      >
        {children}
      </ul>
    );

    if (orientation === 'horizontal') {
      return (
        <Popper
          anchor={open as HTMLLIElement}
          disablePortal
          open={!!open}
          options={popperOptions}
        >
          {WrapChildren}
        </Popper>
      );
    }

    if (orientation === 'vertical') {
      return (
        <Collapse
          style={{
            width: '100%',
          }}
          in={!!open}
        >
          {WrapChildren}
        </Collapse>
      );
    }
  }, [children, open, orientation]);

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
      onClick={clickHandler}
    >
      <div
        className={classes.title}
      >
        {icon && (
          <Icon
            className={classes.icon}
            icon={icon}
          />
        )}
        {title}
        <Icon
          className={classes.collapseIcon}
          icon={GroupCollapseIcon}
        />
      </div>
      {ActionChildren}
    </NavigationItem>
  );
});

export default NavigationSubMenu;
