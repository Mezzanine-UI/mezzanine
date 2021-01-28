import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  ReactNode,
} from 'react';
import {
  emptyClasses as classes,
} from '@mezzanine-ui/core/empty';
import { FolderOpenIcon } from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import Icon from '../Icon';
import Typography from '../Typography';

export interface EmptyProps extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'title'> {
  /**
   * if true, the empty component will be 100% height of it's parent
   */
  fullHeight?: boolean;
  /**
   * Override default icon.
   */
  image?: ReactNode;
  /**
   * Optionally given a title. If not required, simply use react children to display description.
   */
  title?: ReactNode;
}

const Empty = forwardRef<HTMLDivElement, EmptyProps>(function Empty(props, ref) {
  const defaultIcon = (
    <Icon
      className={classes.icon}
      icon={FolderOpenIcon}
      color="disabled"
    />
  );

  const {
    children,
    className,
    fullHeight,
    image = defaultIcon,
    title,
    ...rest
  } = props;

  return (
    <div
      ref={ref}
      className={cx(
        classes.host,
        {
          [classes.fullHeight]: fullHeight,
        },
        className,
      )}
      {...rest}
    >
      {image}
      {title && (
        <Typography
          component="p"
          variant="h3"
          className={classes.title}
          color="text-secondary"
        >
          {title}
        </Typography>
      )}
      <Typography
        component="p"
        variant="body1"
        color="text-secondary"
      >
        {children}
      </Typography>
    </div>
  );
});

export default Empty;
