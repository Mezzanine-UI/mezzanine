import type {
  ResultStateSize,
  ResultStateType,
} from '@mezzanine-ui/core/result-state';
import { resultStateClasses as classes } from '@mezzanine-ui/core/result-state';
import { forwardRef, useMemo } from 'react';
import {
  CheckedFilledIcon,
  DangerousFilledIcon,
  ErrorFilledIcon,
  InfoFilledIcon,
  QuestionFilledIcon,
  WarningFilledIcon,
} from '@mezzanine-ui/icons';
import type { IconDefinition } from '@mezzanine-ui/icons';
import Button from '../Button';
import type { ButtonProps } from '../Button';
import Icon from '../Icon';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface ResultStateProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Action buttons configuration for primary and secondary actions.
   * Renders buttons in the order: secondary (left), primary (right).
   */
  actions?: {
    primaryButtonProps?: ButtonProps;
    secondaryButtonProps?: ButtonProps;
  };
  /**
   * Optional description text displayed below the title.
   * Provides additional context or details about the result state.
   */
  description?: string;
  /**
   * The size variant of the result state.
   * Controls typography, spacing, and overall dimensions.
   * @default 'main'
   */
  size?: ResultStateSize;
  /**
   * The title text for the result state.
   * This is the main heading that describes the state.
   */
  title: string;
  /**
   * The type of result state, which determines the icon and color theme.
   * @default 'information'
   */
  type?: ResultStateType;
}

const iconMap: Record<ResultStateType, IconDefinition> = {
  information: InfoFilledIcon,
  success: CheckedFilledIcon,
  help: QuestionFilledIcon,
  warning: WarningFilledIcon,
  error: ErrorFilledIcon,
  failure: DangerousFilledIcon,
};

const ResultState = forwardRef<HTMLDivElement, ResultStateProps>(
  function ResultState(props, ref) {
    const {
      actions,
      className,
      description,
      size = 'main',
      title,
      type = 'information',
      ...rest
    } = props;

    const icon = useMemo(() => iconMap[type], [type]);

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(
          classes.host,
          classes.type(type),
          classes.size(size),
          className,
        )}
      >
        <div className={classes.container}>
          <Icon className={classes.icon} icon={icon} />
          <h3 className={classes.title}>{title}</h3>
          {description && <p className={classes.description}>{description}</p>}
          {actions && (
            <div className={classes.actions}>
              {actions.secondaryButtonProps && (
                <Button
                  size="main"
                  variant="base-secondary"
                  {...actions.secondaryButtonProps}
                />
              )}
              {actions.primaryButtonProps && (
                <Button
                  size="main"
                  variant="base-primary"
                  {...actions.primaryButtonProps}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default ResultState;
