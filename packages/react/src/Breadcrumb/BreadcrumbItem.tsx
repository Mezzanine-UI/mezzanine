import type { MouseEvent, TouchEvent } from 'react';
import { forwardRef, useState } from 'react';
import { ChevronDownIcon, DotHorizontalIcon } from '@mezzanine-ui/icons';
import { breadcrumbItemClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import { cx } from '../utils/cx';
import Icon from '../Icon';
import Menu, { MenuItem } from '../Menu';
import { Rotate } from '../Transition';
import Typography from '../Typography';
import type { BreadcrumbItemProps } from './typings';

const BreadcrumbItem = forwardRef<HTMLElement, BreadcrumbItemProps>(
  function BreadcrumbItem(props, ref) {
    const {
      className,
      component,
      current,
      expand: expandProp,
      label,
      onClick,
      onTouchEnd,
      options,
      ...rest
    } = props;

    const [_expand, setExpand] = useState(false);
    const expand = expandProp ?? _expand;

    const Component = (() => {
      if (component) return component;

      if ('onClick' in props || 'options' in props) {
        return 'button';
      }

      if (!current && 'href' in props && typeof props.href === 'string') {
        return 'a';
      }

      return 'div';
    })();

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      setExpand(!expand);

      onClick?.(e);
    };

    const handleTouchEnd = (e: TouchEvent<HTMLButtonElement>) => {
      setExpand(!expand);

      onTouchEnd?.(e);
    };

    return (
      <Component
        {...rest}
        aria-expanded={options ? expand : undefined}
        aria-haspopup={options ? 'true' : undefined}
        className={cx(
          classes.host,
          expand && classes.expanded,
          current && classes.current,
          className,
        )}
        onClick={Component === 'button' ? handleClick : undefined}
        onTouchEnd={Component === 'button' ? handleTouchEnd : undefined}
        ref={ref}
      >
        {/* text */}
        {label && (
          <Typography variant={current ? 'caption-highlight' : 'caption'}>
            {label}
          </Typography>
        )}

        {'options' in props &&
          (label ? (
            /* normal dropdown icon item */
            <Rotate in={expand}>
              <Icon className={classes.icon} icon={ChevronDownIcon} size={14} />
            </Rotate>
          ) : (
            /* overflow dropdown icon item */
            <Icon className={classes.icon} icon={DotHorizontalIcon} size={14} />
          ))}

        {/* TODO: waiting Dropdown component */}
        {options && expand && (
          <Menu className={classes.menu}>
            {options
              .filter((v) => v.label)
              .map((option) => (
                <MenuItem key={option.id || option.label}>
                  {option.label}
                </MenuItem>
              ))}
          </Menu>
        )}
      </Component>
    );
  },
);

export default BreadcrumbItem;
