import { forwardRef, useState } from 'react';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import { breadcrumbItemClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import { cx } from '../utils/cx';
import Icon from '../Icon';
import { Rotate } from '../Transition';
import Typography from '../Typography';
import type { BreadcrumbDropdownProps } from './typings';
import Dropdown from '../Dropdown';

const BreadcrumbDropdown = forwardRef<HTMLSpanElement, BreadcrumbDropdownProps>(
  function BreadcrumbDropdown(props, ref) {
    const {
      className,
      current,
      name,
      onClick,
      open: openProp,
      options,
      ...rest
    } = props;

    const [_open, setOpen] = useState(false);
    const open = openProp ?? _open;

    const handleClick = () => {
      setOpen(!open);
      onClick?.();
    };

    return (
      <span className={cx(classes.host, className)} ref={ref}>
        <Dropdown
          onOpen={() => handleClick()}
          onClose={() => handleClick()}
          options={options}
          placement="bottom-start"
          {...rest}
        >
          <button
            className={cx(
              classes.trigger,
              open && classes.expanded,
              current && classes.current,
            )}
            onClick={onClick}
            type="button"
          >
            {name && (
              <Typography variant={current ? 'caption-highlight' : 'caption'}>
                {name}
              </Typography>
            )}

            <Rotate in={open}>
              <Icon className={classes.icon} icon={ChevronDownIcon} size={14} />
            </Rotate>
          </button>
        </Dropdown>
      </span>
    );
  },
);

export default BreadcrumbDropdown;
