import { FC, useState } from 'react';
import Menu, { MenuItem } from '../Menu';
import { BreadcrumbItemProps } from './typings';
import Typography from '../Typography';
import Icon from '../Icon';
import { ChevronRightIcon } from '@mezzanine-ui/icons';
import { breadcrumbItemClasses as classes } from '@mezzanine-ui/core/breadcrumb';

export const BreadcrumbMenuItem: FC<BreadcrumbItemProps> = (props) => {
  const { name, id, options, expand: expandProp } = props;

  const [_expand, setExpand] = useState(false);
  const expand = expandProp ?? _expand;

  const TriggerComponent = (() => {
    if ('onClick' in props || 'options' in props) {
      return 'button';
    }

    if ('href' in props && typeof props.href === 'string') {
      return 'a';
    }

    return 'div';
  })();

  return (
    <MenuItem key={id || name} className={classes.menuItem}>
      <TriggerComponent
        className={classes.menuItemTrigger}
        onClick={() => setExpand(!expand)}
      >
        {/* text */}
        <Typography variant="label-primary">{name}</Typography>

        {'options' in props && options && (
          <Icon icon={ChevronRightIcon} size={16} />
        )}
      </TriggerComponent>

      {/* TODO: waiting Dropdown component */}
      {options && expand && (
        <Menu className={classes.menu}>
          {options
            .filter((v) => v.name)
            .map((option) => (
              <MenuItem key={option.id || option.name}>{option.name}</MenuItem>
            ))}
        </Menu>
      )}
    </MenuItem>
  );
};
