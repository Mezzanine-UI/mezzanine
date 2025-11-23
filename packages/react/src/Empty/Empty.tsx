import { forwardRef, ReactNode } from 'react';
import { emptyClasses as classes } from '@mezzanine-ui/core/empty';
import {
  BoxIcon,
  FolderOpenIcon,
  IconDefinition,
  NotificationIcon,
  SystemIcon,
} from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import Button, { ButtonGroup } from '../Button';
import Icon from '../Icon';
import { EmptyMainInitialDataIcon } from './icons/EmptyMainInitialDataIcon';
import { EmptyMainResultIcon } from './icons/EmptyMainResultIcon';
import { EmptyMainSystemIcon } from './icons/EmptyMainSystemIcon';
import { EmptyProps } from '.';

const iconMap: Record<
  Exclude<EmptyProps['type'], undefined>,
  IconDefinition | null
> = {
  custom: null,
  'initial-data': BoxIcon,
  notification: NotificationIcon,
  result: FolderOpenIcon,
  system: SystemIcon,
};

const mainIconMap: Record<Exclude<EmptyProps['type'], undefined>, ReactNode> = {
  custom: null,
  'initial-data': <EmptyMainInitialDataIcon className={classes.icon} />,
  notification: null,
  result: <EmptyMainResultIcon className={classes.icon} />,
  system: <EmptyMainSystemIcon className={classes.icon} />,
};

const Empty = forwardRef<HTMLDivElement, EmptyProps>(
  function Empty(props, ref) {
    const {
      actions,
      className,
      description,
      pictogram,
      size = 'main',
      title,
      type = 'initial-data',
      ...rest
    } = props;

    const icon: ReactNode =
      (size === 'main'
        ? mainIconMap[type]
        : iconMap[type] && (
            <Icon className={classes.icon} icon={iconMap[type]} />
          )) || null;

    return (
      <div
        {...rest}
        className={cx(classes.host, classes.size(size), className)}
        ref={ref}
      >
        <div className={classes.container}>
          {pictogram ? <div className={classes.icon}>{pictogram}</div> : icon}

          <p className={classes.title}>{title}</p>
          {description && <p className={classes.description}>{description}</p>}
          {actions && (
            <ButtonGroup className={classes.actions}>
              {actions.secondaryButtonProps && (
                <Button
                  size="main"
                  variant="base-secondary"
                  {...actions.secondaryButtonProps}
                />
              )}
              {actions.primaryButtonProps && (
                <Button
                  size="main"
                  variant="base-primary"
                  {...actions.primaryButtonProps}
                />
              )}
            </ButtonGroup>
          )}
        </div>
      </div>
    );
  },
);

export default Empty;
