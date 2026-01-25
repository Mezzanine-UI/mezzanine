import { forwardRef, useState } from 'react';
import { breadcrumbOverflowMenuItemClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import { ChevronRightIcon } from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import Dropdown from '../Dropdown';
import Icon from '../Icon';
import Typography from '../Typography';
import type { BreadcrumbDropdownProps } from './typings';

const BreadcrumbOverflowMenuDropdown = forwardRef<
  HTMLSpanElement,
  BreadcrumbDropdownProps
>(function BreadcrumbOverflowMenuDropdown(props, ref) {
  const { className, name, onClick, open: openProp, options, ...rest } = props;

  const [_open, setOpen] = useState(false);
  const open = openProp ?? _open;

  const handleClick = () => {
    setOpen(!open);
    onClick?.();
  };

  return (
    <span
      className={cx(classes.host, open && classes.expanded, className)}
      ref={ref}
    >
      <Dropdown
        onClose={() => handleClick()}
        onOpen={() => handleClick()}
        options={options}
        placement="right-start"
        {...rest}
      >
        <button className={cx(classes.trigger)} onClick={onClick} type="button">
          <Typography variant={'label-primary'}>{name}</Typography>
          <Icon className={classes.icon} icon={ChevronRightIcon} size={16} />
        </button>
      </Dropdown>
    </span>
  );
});

export default BreadcrumbOverflowMenuDropdown;
