import { forwardRef, ReactNode, CSSProperties } from 'react';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Typography, { TypographyProps } from '../Typography';

export interface CardProps extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'title' | 'children'> {
  /**
   * Inline style to apply to the card.
   */
  style?: CSSProperties;
  /**
   * Card cover.
  */
  cover?: ReactNode;
  /**
   * Card title, hiding if the text is empty.
   */
  title?: ReactNode;
  /**
   * Card title props
   * @default 'variant: h3'
   */
  titleProps?: Omit<TypographyProps, 'children'>;
  /**
   * Subtitle under the title
   */
  subtitle?: ReactNode;
  /**
   * Subtitle props
   */
  subtitleProps?: Omit<TypographyProps, 'children'>;
  /**
   * Description under the subtitle
   */
  description?: string;
  /**
   * Description props
   */
  descriptionProps?: Omit<TypographyProps, 'children'>;
  /**
   * Card footer
   */
  actions?: ReactNode;
}

/**
 * The react component for `mezzanine` card.
 */
const Card = forwardRef<HTMLDivElement, CardProps>(function Card(props, ref) {
  const {
    className,
    cover,
    title,
    titleProps,
    subtitle,
    subtitleProps,
    description,
    descriptionProps,
    actions,
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
