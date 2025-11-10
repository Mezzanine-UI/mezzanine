import { forwardRef } from 'react';
import { stepClasses as classes } from '@mezzanine-ui/core/stepper';
import {
  CheckedOutlineIcon,
  DangerousFilledIcon,
  Item0Icon,
  Item1Icon,
  Item2Icon,
  Item3Icon,
  Item4Icon,
  Item5Icon,
  Item6Icon,
  Item7Icon,
  Item8Icon,
  Item9Icon,
} from '@mezzanine-ui/icons';
import Icon from '../Icon';
import Typography from '../Typography';
import { cx } from '../utils/cx';
import { StepProps } from './typings';

const indicatorNumberIconList = [
  Item0Icon,
  Item1Icon,
  Item2Icon,
  Item3Icon,
  Item4Icon,
  Item5Icon,
  Item6Icon,
  Item7Icon,
  Item8Icon,
  Item9Icon,
];

/** icon and indicatorNumber */
const NumberStatusIndicator = ({
  status,
  error,
  indicatorNumber,
}: {
  status: StepProps['status'];
  error?: boolean;
  indicatorNumber: number;
}) => {
  switch (true) {
    case status === 'succeeded':
      return (
        <Icon className={classes.statusIndicator} icon={CheckedOutlineIcon} />
      );
    case status !== 'processing' && error:
      return (
        <Icon className={classes.statusIndicator} icon={DangerousFilledIcon} />
      );
    default:
      return (
        <Icon
          className={classes.statusIndicator}
          icon={indicatorNumberIconList[indicatorNumber % 10]}
        />
      );
  }
};

const DotStatusIndicator = () => {
  return (
    <span className={cx(classes.statusIndicator, classes.statusIndicatorDot)} />
  );
};

/**
 * The react component for `mezzanine` step.
 */
const Step = forwardRef<HTMLDivElement, StepProps>(function Step(props, ref) {
  const {
    className,
    description,
    index = 0,
    orientation,
    status = 'pending',
    title,
    type = 'number',
    error,
    disabled,
    ...rest
  } = props;

  return (
    <div
      className={cx(
        classes.host,
        {
          // status
          [classes.processing]: status === 'processing',
          [classes.pending]: status === 'pending',
          [classes.succeeded]: status === 'succeeded',
          [classes.error]: status !== 'processing' && error,
          [classes.disabled]: status !== 'processing' && disabled,
          // orientation
          [classes.horizontal]: orientation === 'horizontal',
          [classes.vertical]: orientation === 'vertical',
          // type
          [classes.dot]: type === 'dot',
          [classes.number]: type === 'number',
          // interactive
          [classes.interactive]: rest.onClick && !disabled,
        },
        className,
      )}
      ref={ref}
      {...rest}
    >
      {type === 'number' && (
        <NumberStatusIndicator
          status={status}
          indicatorNumber={index + 1}
          error={error}
        />
      )}
      {type === 'dot' && <DotStatusIndicator />}
      <div className={classes.textContainer}>
        {/* title (required) */}
        <Typography className={classes.title} variant="label-primary-highlight">
          {title}
          <span className={classes.titleConnectLine} />
        </Typography>
        {/* description (optional) */}
        {description && (
          <Typography className={classes.description} variant="caption">
            {description}
          </Typography>
        )}
      </div>
    </div>
  );
});

export default Step;
