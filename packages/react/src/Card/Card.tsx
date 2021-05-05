import { forwardRef, MouseEventHandler } from 'react';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface CardProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Click handler.
   */
  media?: React.ReactNode;
  style?: React.CSSProperties;
  title: string;
  subhead: string;
  text: string;
  footer?: React.ReactNode;
  onClick?: MouseEventHandler;
}

/**
 * The react component for `mezzanine` card.
 */

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(props, ref) {
  const {
    className,
    children,
    media,
    title = 'Card title',
    subhead = 'subhead',
    text = 'text',
    footer,
    onClick,
    ...rest
  } = props;

  return (
    <div
      ref={ref}
      className={cx(
        classes.host,
        className,
      )}
      {...rest}
    >
      <div className={classes.media}>
        {media}
      </div>

      <div>{children}</div>

      <div className={classes.cardSpace}>
        <div className={classes.header}>
          <div
            className={classes.title}
          >
            {title}
          </div>
          <div
            className={classes.subhead}
          >
            {subhead}
          </div>
        </div>

        <div
          className={classes.content}
        >
          {text}
        </div>

        <div className={classes.footer}>
          {footer}
        </div>
      </div>
    </div>

  );
});

export default Card;
