import type { MouseEvent } from 'react';
import { forwardRef, useState } from 'react';
import { ChevronDownIcon, DotHorizontalIcon } from '@mezzanine-ui/icons';
import { breadcrumbItemClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import { cx } from '../utils/cx';
import Icon from '../Icon';
import Menu from '../Menu';
import { Rotate } from '../Transition';
import Typography from '../Typography';
import type { BreadcrumbItemProps } from './typings';
import { BreadcrumbMenuItem } from './BreadcrumbMenuItem';

const BreadcrumbItem = forwardRef<HTMLDivElement, BreadcrumbItemProps>(
  function BreadcrumbItem(props, ref) {
    const {
      className,
      component,
      current,
      expand: expandProp,
      name,
      onClick,
      options,
      ...rest
    } = props;

    const [_expand, setExpand] = useState(false);
    const expand = expandProp ?? _expand;

    const TriggerComponent = (() => {
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

    return (
      <span
        {...rest}
        aria-expanded={options ? expand : undefined}
        aria-haspopup={options ? 'true' : undefined}
        className={cx(classes.host, className)}
        ref={ref}
      >
        <TriggerComponent
          className={cx(
            classes.trigger,
            expand && classes.expanded,
            current && classes.current,
          )}
          onClick={TriggerComponent === 'button' ? handleClick : undefined}
        >
          {/* text */}
          {name && (
            <Typography variant={current ? 'caption-highlight' : 'caption'}>
              {name}
            </Typography>
          )}

          {'options' in props &&
            (name ? (
              /* normal dropdown icon item */
              <Rotate in={expand}>
                <Icon
                  className={classes.icon}
                  icon={ChevronDownIcon}
                  size={14}
                />
              </Rotate>
            ) : (
              /* overflow dropdown icon item */
              <Icon
                className={classes.icon}
                icon={DotHorizontalIcon}
                size={14}
              />
            ))}
        </TriggerComponent>

        {/* TODO: waiting Dropdown component */}
        {options && expand && (
          <Menu className={classes.menu}>
            {options
              .filter((v) => v.name)
              .map((option) => (
                <BreadcrumbMenuItem
                  key={option.id || option.name}
                  {...option}
                />
                // <MenuItem key={option.id || option.name}>
                //   {option.name}
                // </MenuItem>
              ))}
          </Menu>
        )}
      </span>
    );
  },
);

export default BreadcrumbItem;
