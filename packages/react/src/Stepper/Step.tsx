import { forwardRef } from 'react';
import { stepClasses as classes } from '@mezzanine-ui/core/stepper';
import { CheckIcon } from '@mezzanine-ui/icons';
import Icon, { IconProps } from '../Icon';
import Typography, { TypographyProps } from '../Typography';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface StepProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'title'> {
  /**
   * Mark the step as active. automatically set by `activeStep` of `Stepper`.
   */
  active?: boolean;
  /**
   * Mark the step as completed. automatically set by `activeStep` of `Stepper`.
   */
  completed?: boolean;
  /**
   * Step icon props. effective only when the step is completed.
   * @default 'icon: CheckIcon'
   */
  completedIconProps?: IconProps;
  /**
   * Mark the step as disabled. automatically set by `activeStep` of `Stepper`.
   */
  disabled?: boolean;
  /**
   * Step index. automatically set by the parent <Stepper />.
   */
  index?: number;
  /**
   * The step label on the right side of the icon, visible if value is not empty.
   */
  title?: string;
  /**
   * title typography props.
   * @default 'variant: button2'
   */
  titleProps?: Omit<TypographyProps, 'children'>;
}

/**
 * The react component for `mezzanine` step.
 */
const Step = forwardRef<HTMLDivElement, StepProps>(function Step(props, ref) {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    active,
    children,
    className,
    completed,
    completedIconProps,
    disabled,
    index = -1,
    title,
    titleProps,
    ...rest
  } = props;

  /** icon and step number */
  const iconRender = (
    <Typography className={classes.iconBackground} variant="button3">
      {completed ? (
        <Icon
          className={classes.completedIcon}
          icon={CheckIcon}
          {...completedIconProps}
        />
      ) : (
        index + 1
      )}
    </Typography>
  );

  return (
    <div
      className={cx(classes.host, disabled && classes.disabled, className)}
      ref={ref}
      {...rest}
    >
      {iconRender}
      {
        /** title (optional) */
        title && (
          <Typography
            className={classes.title}
            variant="button2"
            {...titleProps}
          >
            {title}
          </Typography>
        )
      }
      {children}
    </div>
  );
});

export default Step;
