import { forwardRef, useState } from 'react';
import { breadcrumbItemClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import { cx } from '../utils/cx';
import { BreadcrumbItemProps } from './typings';
import Typography from '../Typography';
import Icon from '../Icon';
import { ChevronDownIcon, DotHorizontalIcon } from '@mezzanine-ui/icons';
import { Rotate } from '../Transition';
import Menu, { MenuItem } from '../Menu';

const BreadcrumbItem = forwardRef<HTMLElement, BreadcrumbItemProps>(
  function BreadcrumbItem(props, ref) {
    const { component, label, className, options, current, ...rest } = props;

    const [expand, setExpand] = useState(false);

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

    const handleClick = () => {
      setExpand(!expand);
    };

    return (
      <Component
        className={cx(
          classes.host,
          expand && classes.expanded,
          current && classes.current,
          className,
        )}
        onClick={Component === 'button' ? handleClick : undefined}
        onTouchEnd={Component === 'button' ? handleClick : undefined}
        ref={ref}
        {...rest}
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
              <Icon className={classes.icon} size={14} icon={ChevronDownIcon} />
            </Rotate>
          ) : (
            /* overflow dropdown icon item */
            <Icon className={classes.icon} size={14} icon={DotHorizontalIcon} />
          ))}

        {/* TODO: waiting Dropdown component */}
        {options && expand && (
          <Menu className={classes.menu}>
            {options.map((option) => (
              <MenuItem key={option.label}>{option.label}</MenuItem>
            ))}
          </Menu>
        )}
      </Component>
    );
  },
);

export default BreadcrumbItem;
