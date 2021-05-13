import { forwardRef, ReactNode, CSSProperties } from 'react';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Typography, { TypographyProps } from '../Typography';

export interface CardProps extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'title' | 'children'> {
  /**
   * Card footer
   */
  actions?: ReactNode;
  /**
   * Card cover.
  */
  cover?: ReactNode;
  /**
   * Description under the subtitle. visible if value is not empty.
   */
  description?: string;
  /**
   * Description props
   */
  descriptionProps?: Omit<TypographyProps, 'children'>;
  /**
   * Card title, visible if value is not empty.
   */
  title?: ReactNode;
  /**
   * Card title props
   * @default 'variant: h3'
   */
  titleProps?: Omit<TypographyProps, 'children'>;
  /**
   * Inline style to apply to the card.
   */
  style?: CSSProperties;
  /**
   * Subtitle under the title. visible if value is not empty.
   */
  subtitle?: ReactNode;
  /**
   * Subtitle props
   */
  subtitleProps?: Omit<TypographyProps, 'children'>;
}

/**
 * The react component for `mezzanine` card.
 */
const Card = forwardRef<HTMLDivElement, CardProps>(function Card(props, ref) {
  const {
    actions,
    className,
    cover,
    description,
    descriptionProps,
    title,
    titleProps,
    subtitle,
    subtitleProps,
    ...rest
  } = props;

  const {
    variant = 'h3',
  } = titleProps || {};

  const titleTypography = (
    title ? (
      <Typography
        variant={variant}
        {...titleProps}
      >
        {title}
      </Typography>
    ) : null
  );

  const subtitleTypography = (
    subtitle ? (
      <Typography {...subtitleProps}>
        {subtitle}
      </Typography>
    ) : null
  );

  const header = (
    titleTypography || subtitleTypography ? (
      <div className={classes.header}>
        {titleTypography}
        {subtitleTypography}
      </div>
    ) : null
  );

  const descriptionTypography = (
    description ? (
      <Typography {...descriptionProps}>
        {description}
      </Typography>
    ) : null
  );

  return (
    <div
      ref={ref}
      className={cx(
        classes.host,
        className,
      )}
      {...rest}
    >
      {cover}
      <div className={classes.meta}>
        <div className={classes.content}>
          {header}
          {descriptionTypography}
        </div>
        {actions}
      </div>
    </div>
  );
});

export default Card;
