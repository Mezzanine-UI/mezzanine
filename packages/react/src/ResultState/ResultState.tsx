import type {
  ResultStateSize,
  ResultStateType,
} from '@mezzanine-ui/core/result-state';
import { resultStateClasses as classes } from '@mezzanine-ui/core/result-state';
import {
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  useMemo,
} from 'react';
import {
  CheckedFilledIcon,
  DangerousFilledIcon,
  ErrorFilledIcon,
  InfoFilledIcon,
  QuestionFilledIcon,
  WarningFilledIcon,
} from '@mezzanine-ui/icons';
import type { IconDefinition } from '@mezzanine-ui/icons';
import Button, { ButtonGroup } from '../Button';
import type { ButtonGroupChild, ButtonProps } from '../Button';
import Icon from '../Icon';
import { cx } from '../utils/cx';
import { flattenChildren } from '../utils/flatten-children';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

/**
 * Single button configuration - only secondary button is allowed
 */
type SingleButtonAction = {
  secondaryButton: ButtonProps;
  primaryButton?: never;
};

/**
 * Two buttons configuration - both secondary and primary buttons
 */
type TwoButtonsAction = {
  secondaryButton: ButtonProps;
  primaryButton: ButtonProps;
};

/**
 * Actions can be either single button or two buttons
 */
export type ResultStateActions = SingleButtonAction | TwoButtonsAction;

export interface ResultStateProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Action buttons configuration.
   * - Single button: Only `secondaryButton` (ButtonProps)
   * - Two buttons: Both `secondaryButton` and `primaryButton`
   */
  actions?: ResultStateActions;
  /**
   * Child button elements for actions. <br />
   * Can be a single Button element or an array of one or two Button elements. <br />
   * When using children, the first Button is treated as secondary and the second as primary. <br />
   * If only one Button is provided, it is treated as secondary. <br />
   * If actions provided, children will be ignored. <br />
   */
  children?:
    | ReactElement<ButtonProps>
    | [ReactElement<ButtonProps>]
    | [ReactElement<ButtonProps>, ReactElement<ButtonProps>];
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

const renderButtonOrElement = (
  button: ButtonProps | ButtonGroupChild | undefined,
  size: ButtonProps['size'],
  variant: 'base-primary' | 'base-secondary',
) => {
  if (!button) return null;

  if (isValidElement(button)) {
    return cloneElement(button, { size, variant });
  }

  return <Button {...button} size={size} variant={variant} />;
};

const ResultState = forwardRef<HTMLDivElement, ResultStateProps>(
  function ResultState(props, ref) {
    const {
      actions,
      className,
      children,
      description,
      size = 'main',
      title,
      type = 'information',
      ...rest
    } = props;

    const icon = useMemo(() => iconMap[type], [type]);

    const flatChildren = flattenChildren(children);
    const fragmentButtons: ButtonGroupChild =
      actions &&
      ('secondaryButton' in actions ? (
        <>
          {renderButtonOrElement(
            actions.secondaryButton,
            size,
            'base-secondary',
          )}
          {renderButtonOrElement(actions.primaryButton, size, 'base-primary')}
        </>
      ) : (
        renderButtonOrElement(actions, size, 'base-secondary')
      ));

    const renderChildren =
      !fragmentButtons &&
      flatChildren.length > 0 &&
      flatChildren.map((child, index) => {
        if (!isValidElement(child)) {
          return null;
        } else if (child.type === Button) {
          switch (index) {
            case 0:
              return renderButtonOrElement(
                child as ReactElement<ButtonProps>,
                size,
                'base-secondary',
              );
            case 1:
              return renderButtonOrElement(
                child as ReactElement<ButtonProps>,
                size,
                'base-primary',
              );
            default:
              console.warn(
                'Only up to two Button components are allowed as children of ResultState.',
              );
              return null;
          }
        }

        console.warn(
          'Only Button components are allowed as children of ResultState.',
        );

        return null;
      });

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
          {actions || children ? (
            <ButtonGroup className={classes.actions}>
              {fragmentButtons || renderChildren}
            </ButtonGroup>
          ) : null}
        </div>
      </div>
    );
  },
);

export default ResultState;
