import {
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react';
import { emptyClasses as classes } from '@mezzanine-ui/core/empty';
import {
  BoxIcon,
  FolderOpenIcon,
  IconDefinition,
  NotificationIcon,
  SystemIcon,
} from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import Button, { ButtonGroup, ButtonGroupChild, ButtonProps } from '../Button';
import Icon from '../Icon';
import { EmptyMainInitialDataIcon } from './icons/EmptyMainInitialDataIcon';
import { EmptyMainResultIcon } from './icons/EmptyMainResultIcon';
import { EmptyMainSystemIcon } from './icons/EmptyMainSystemIcon';
import { EmptyProps } from '.';
import { flattenChildren } from '../utils/flatten-children';

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

const renderButtonOrElement = (
  button: ButtonProps | ButtonGroupChild | undefined,
  size: ButtonProps['size'],
  variant: 'base-primary' | 'base-secondary',
) => {
  if (!button) return null;

  if (isValidElement(button)) {
    return cloneElement(button, { size, variant });
  }

  return <Button {...button} size={size} variant={variant} />;
};

const Empty = forwardRef<HTMLDivElement, EmptyProps>(
  function Empty(props, ref) {
    const {
      actions,
      children,
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

    const flatChildren = flattenChildren(children);
    const fragmentButtons: ButtonGroupChild =
      actions &&
      ('secondaryButton' in actions ? (
        <>
          {renderButtonOrElement(
            actions.secondaryButton,
            size,
            'base-secondary',
          )}
          {renderButtonOrElement(actions.primaryButton, size, 'base-primary')}
        </>
      ) : (
        renderButtonOrElement(actions, size, 'base-secondary')
      ));

    const renderChildren =
      !fragmentButtons &&
      flatChildren.length > 0 &&
      flatChildren.map((child, index) => {
        if (!isValidElement(child)) {
          return null;
        } else if (child.type === Button) {
          switch (index) {
            case 0:
              return renderButtonOrElement(
                child as ReactElement<ButtonProps>,
                size,
                'base-secondary',
              );
            case 1:
              return renderButtonOrElement(
                child as ReactElement<ButtonProps>,
                size,
                'base-primary',
              );
            default:
              console.warn(
                'Only up to two Button components are allowed as children of Empty.',
              );
              return null;
          }
        }

        console.warn(
          'Only Button components are allowed as children of Empty.',
        );

        return null;
      });

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
          {(actions || children) && size !== 'minor' && (
            <ButtonGroup className={classes.actions}>
              {fragmentButtons || renderChildren}
            </ButtonGroup>
          )}
        </div>
      </div>
    );
  },
);

export default Empty;
