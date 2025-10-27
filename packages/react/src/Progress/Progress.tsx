'use client';

import { forwardRef, useContext } from 'react';
import {
  progressClasses as classes,
  ProgressType,
  ProgressTypes,
  ProgressStatus,
  ProgressStatuses,
} from '@mezzanine-ui/core/progress';
import { Size } from '@mezzanine-ui/system/size';
import {
  CheckIcon,
  TimesIcon,
  CheckCircleFilledIcon,
  TimesCircleFilledIcon,
} from '@mezzanine-ui/icons';
import Typography, { TypographyProps, TypographyVariant } from '../Typography';
import Icon, { IconProps } from '../Icon';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { MezzanineConfig } from '../Provider/context';

export interface ProgressProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'div'>,
    'title' | 'children'
  > {
  /**
   * Customize circle.
   * circle radius = (size - strokeWidth) / 2
   * @default size=80,strokeWidth=8
   */
  circleProps?: { size: number; strokeWidth: number };
  /**
   * Icon props when status is 'error'.
   */
  errorIconProps?: Omit<IconProps, 'className'>;
  /**
   * The progress percent(0~100).
   * @default 0
   */
  percent?: number;
  /**
   * Percent text props when status is 'normal'.
   */
  percentProps?: Omit<TypographyProps, 'className' | 'children'>;
  /**
   * Force mark the progress status. automatically set if not defined.
   * (normal(0~99) or success(100) depending on percent)
   */
  status?: ProgressStatus;
  /**
   * The size of line type progress.
   * @default 'medium'
   */
  size?: Size;
  /**
   * Display the progress info(percent and icon) or not.
   * @default true
   */
  showInfo?: boolean;
  /**
   * Icon props when status is 'success'.
   */
  successIconProps?: Omit<IconProps, 'className'>;
  /**
   * The type of progress.
   * @default 'line'
   */
  type?: ProgressType;
}

/**
 * The react component for `mezzanine` progress.
 */
const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  function Progress(props, ref) {
    const { size: globalSize } = useContext(MezzanineConfig);
    const {
      circleProps,
      className,
      errorIconProps,
      percent = 0,
      percentProps,
      showInfo = true,
      size = globalSize,
      status = percent < 100
        ? ProgressStatuses.normal
        : ProgressStatuses.success,
      successIconProps,
      type = ProgressTypes.line,
      ...rest
    } = props;

    const percentLimited = Math.max(0, Math.min(100, percent));

    const defaultSuccessIcon =
      type === ProgressTypes.line ? CheckCircleFilledIcon : CheckIcon;
    const defaultErrorIcon =
      type === ProgressTypes.line ? TimesCircleFilledIcon : TimesIcon;

    const renderInfo = (variant: TypographyVariant) => (
      <div className={classes.info}>
        {status === ProgressStatuses.normal ? (
          /** percent text */ <Typography
            className={classes.infoPercent}
            variant={variant}
            {...percentProps}
          >
            {`${percentLimited}%`}
          </Typography>
        ) : (
          <>
            {status === ProgressStatuses.success && (
              <Icon
                className={classes.infoIcon}
                icon={defaultSuccessIcon}
                {...successIconProps}
              />
            )}
            {status === ProgressStatuses.error && (
              <Icon
                className={classes.infoIcon}
                icon={defaultErrorIcon}
                {...errorIconProps}
              />
            )}
          </>
        )}
      </div>
    );

    const renderLine = () => (
      <>
        <div className={classes.lineBg}>
          <div style={{ width: `${percentLimited}%` }} />
        </div>
        {showInfo && renderInfo('input3')}
      </>
    );

    const renderCircle = () => {
      const { size: circleSize = 80, strokeWidth = 8 } = circleProps || {};
      const radius = (circleSize - strokeWidth) / 2;
      const progressLength =
        percent > 0 ? percent * radius * Math.PI * 0.02 : 0.00001;
      const circleXY = circleSize / 2;

      return (
        <>
          <svg
            style={{ boxSizing: 'border-box' }}
            height={circleSize}
            width={circleSize}
          >
            <circle
              className={classes.circleBg}
              cx={circleXY}
              cy={circleXY}
              r={radius}
              strokeWidth={strokeWidth}
            />
            <circle
              className={classes.circleFiller}
              cx={circleXY}
              cy={circleXY}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={`${progressLength.toString()} 999`}
            />
          </svg>
          {showInfo && renderInfo('button3')}
        </>
      );
    };

    return (
      <div
        ref={ref}
        className={cx(
          classes.host,
          className,
          status === ProgressStatuses.success && classes.success,
          status === ProgressStatuses.error && classes.error,
          type === ProgressTypes.line && classes.lineVariant,
          type === ProgressTypes.circle && classes.circleVariant,
          classes.size(size),
        )}
        {...rest}
      >
        {type === ProgressTypes.line && renderLine()}
        {type === ProgressTypes.circle && renderCircle()}
      </div>
    );
  },
);

export default Progress;
