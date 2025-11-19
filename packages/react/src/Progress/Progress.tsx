'use client';

import {
  progressClasses as classes,
  ProgressStatus,
  ProgressStatuses,
  ProgressType,
  ProgressTypes,
} from '@mezzanine-ui/core/progress';
import {
  CheckedFilledIcon,
  DangerousFilledIcon,
  IconDefinition,
} from '@mezzanine-ui/icons';

import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../Icon';
import Typography, { TypographyProps } from '../Typography';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
export interface ProgressProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'div'>,
    'title' | 'children'
  > {
  /**
   * Custom icons for different statuses.
   * If not provided, defaults to CheckedFilledIcon for success and DangerousFilledIcon for error.
   */
  icons?: {
    /**
     * Custom icon when status is 'error'.
     * If not provided, defaults to DangerousFilledIcon.
     */
    error?: IconDefinition;
    /**
     * Custom icon when status is 'success'.
     * If not provided, defaults to CheckedFilledIcon.
     */
    success?: IconDefinition;
  };
  /**
   * The progress percent(0~100).
   * @default 0
   */
  percent?: number;
  /**
   * Percent text props when status is 'enabled'.
   */
  percentProps?: Omit<TypographyProps, 'className' | 'children'>;
  /**
   * Force mark the progress status. automatically set if not defined.
   * (enabled(0~99) or success(100) depending on percent)
   */
  status?: ProgressStatus;
  /**
   * The tick of progress.
   * @default 0
   */
  tick?: number;
  /**
   * The type of progress display.
   * @default 'progress'
   */
  type?: ProgressType;
}

/**
 * The react component for `mezzanine` progress.
 */
const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  function Progress(props, ref) {
    const {
      className,
      icons,
      percent = 0,
      percentProps,
      status = percent < 100
        ? ProgressStatuses.enabled
        : ProgressStatuses.success,
      tick,
      type = 'progress',
    } = props;

    const percentLimited = Math.max(0, Math.min(100, percent));

    const icon = useMemo(() => {
      if (status === ProgressStatuses.success) {
        return icons?.success ?? CheckedFilledIcon;
      }
      return icons?.error ?? DangerousFilledIcon;
    }, [status, icons]);

    const isSuccessStatus = useMemo(() => status === ProgressStatuses.success && type === ProgressTypes.icon, [status, type]);
    const isErrorStatus = useMemo(() => status === ProgressStatuses.error && type === ProgressTypes.icon, [status, type]);
    const isActiveTick = useMemo(() => tick !== undefined && tick > 0 && tick < 100, [tick]);

    const tickPosition = useMemo(() => {
      if (!isActiveTick || tick === undefined) return undefined;
      return Math.max(0, Math.min(100, tick));
    }, [isActiveTick, tick]);

    const lineRef = useRef<HTMLDivElement>(null);
    const [tickLeft, setTickLeft] = useState<string | undefined>(undefined);

    useEffect(() => {
      if (!isActiveTick || tickPosition === undefined || !lineRef.current) {
        setTickLeft(undefined);
        return;
      }

      const lineElement = lineRef.current;
      const containerElement = lineElement.parentElement;

      if (!containerElement) {
        setTickLeft(undefined);
        return;
      }

      const updateTickPosition = () => {
        const lineRect = lineElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();

        // 計算 line 相對於容器的位置和寬度
        const lineLeft = lineRect.left - containerRect.left;
        const lineWidth = lineRect.width;

        // 計算 tick 在 line 中的位置（百分比轉換為像素）
        const tickOffsetInLine = (tickPosition / 100) * lineWidth;

        // 計算 tick 相對於容器的絕對位置
        const tickAbsoluteLeft = lineLeft + tickOffsetInLine;

        // 轉換為百分比（相對於容器）
        const containerWidth = containerRect.width;
        const tickPercent = (tickAbsoluteLeft / containerWidth) * 100;

        setTickLeft(`${tickPercent}%`);
      };

      // 初始計算
      updateTickPosition();

      // 使用 ResizeObserver 監聽 line 元素尺寸變化
      const resizeObserver = new ResizeObserver(() => {
        updateTickPosition();
      });

      resizeObserver.observe(lineElement);
      resizeObserver.observe(containerElement);

      // 監聽窗口大小變化
      window.addEventListener('resize', updateTickPosition);

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', updateTickPosition);
      };
    }, [isActiveTick, tickPosition, type, percentLimited]);

    return (
      <div
        ref={ref}
        className={
          cx(
            classes.host,
            classes.type(type),
            status === ProgressStatuses.success && classes.success,
            status === ProgressStatuses.error && classes.error,
            className,
          )
        }
      >
        <div ref={lineRef} className={classes.lineVariant}>
          <i className={classes.lineBg} style={{ width: `${percentLimited}%` }} />
        </div>
        {
          type === ProgressTypes.percent && (
            <Typography variant="input" {...percentProps} className={classes.infoPercent}>
              {`${percentLimited}%`}
            </Typography>
          )
        }
        {
          (isSuccessStatus || isErrorStatus) && (
            <Icon
              className={classes.infoIcon}
              icon={icon}
            />
          )
        }
        {
          isActiveTick && tickLeft !== undefined && (
            <div
              className={classes.tick}
              style={
                {
                  '--tick-position': tickLeft,
                } as React.CSSProperties
              }
            />
          )
        }
      </div>
    );
  },
);

export default Progress;
