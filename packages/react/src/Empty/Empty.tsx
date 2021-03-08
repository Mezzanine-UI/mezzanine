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
  const {
    children,
    className,
    fullHeight,
    image = <Icon className={classes.icon} icon={FolderOpenIcon} />,
    title,
    ...rest
  } = props;

  return (
    <div
      ref={ref}
      {...rest}
      className={cx(
        classes.host,
        {
          [classes.fullHeight]: fullHeight,
        },
        className,
      )}
    >
      {image}
      {title && <div className={classes.title}>{title}</div>}
      {children && <div className={classes.description}>{children}</div>}
    </div>
  );
});

export default Empty;
