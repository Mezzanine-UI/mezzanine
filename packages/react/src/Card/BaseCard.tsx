'use client';

import { forwardRef, MouseEvent } from 'react';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import { ComponentOverridableForwardRefComponentPropsFactory } from '../utils/jsx-types';
import Button from '../Button';
import Dropdown from '../Dropdown';
import Toggle from '../Toggle';
import {
  BaseCardComponent,
  BaseCardProps,
  BaseCardActionProps,
  BaseCardOverflowProps,
  BaseCardToggleProps,
} from './typings';

export type BaseCardComponentProps<C extends BaseCardComponent = 'div'> =
  ComponentOverridableForwardRefComponentPropsFactory<
    BaseCardComponent,
    C,
    BaseCardProps
  >;

/**
 * BaseCard is a versatile card component that can be used as a div, link, or custom component.
 * It supports four types: default, action, overflow, and toggle, each with different header actions.
 */
const BaseCard = forwardRef<HTMLDivElement, BaseCardComponentProps>(
  function BaseCard(props, ref) {
    const {
      children,
      className,
      component: Component = 'div',
      disabled = false,
      readOnly = false,
      title,
      description,
      type = 'default',
      ...rest
    } = props;

    const hasHeaderContent = Boolean(title || description);

    const renderHeaderAction = () => {
      if (type === 'default') {
        return null;
      }

      if (type === 'action') {
        const {
          actionName,
          actionVariant = 'base-text-link',
          onActionClick,
        } = props as BaseCardActionProps;

        return (
          <div className={classes.baseHeaderAction}>
            <Button
              disabled={disabled}
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                onActionClick?.(event);
              }}
              size="sub"
              variant={actionVariant}
              type="button"
            >
              {actionName}
            </Button>
          </div>
        );
      }

      if (type === 'overflow') {
        const { options, onOptionSelect } = props as BaseCardOverflowProps;

        return (
          <div className={classes.baseHeaderAction}>
            <Dropdown
              disabled={disabled}
              mode="single"
              onSelect={onOptionSelect}
              options={options}
              globalPortal={false}
            >
              <Button
                disabled={disabled}
                icon={DotHorizontalIcon}
                iconType="icon-only"
                size="sub"
                variant="base-text-link"
                type="button"
              />
            </Dropdown>
          </div>
        );
      }

      if (type === 'toggle') {
        const {
          checked,
          defaultChecked,
          onToggleChange,
          toggleSize,
          toggleLabel,
          toggleSupportingText,
        } = props as BaseCardToggleProps;

        return (
          <div className={classes.baseHeaderAction}>
            <Toggle
              checked={checked}
              defaultChecked={defaultChecked}
              disabled={disabled}
              label={toggleLabel}
              onChange={onToggleChange}
              size={toggleSize}
              supportingText={toggleSupportingText}
            />
          </div>
        );
      }

      return null;
    };

    // Filter out type-specific props before spreading to component
    const {
      actionName: _actionName,
      actionVariant: _actionVariant,
      onActionClick: _onActionClick,
      options: _options,
      onOptionSelect: _onOptionSelect,
      checked: _checked,
      defaultChecked: _defaultChecked,
      onToggleChange: _onToggleChange,
      toggleSize: _toggleSize,
      toggleLabel: _toggleLabel,
      toggleSupportingText: _toggleSupportingText,
      type: _type,
      ...componentProps
    } = rest as Record<string, unknown>;

    return (
      <Component
        {...componentProps}
        ref={ref}
        aria-disabled={disabled || undefined}
        aria-readonly={readOnly || undefined}
        className={cx(
          classes.base,
          {
            [classes.baseDisabled]: disabled,
            [classes.baseReadOnly]: readOnly,
          },
          className,
        )}
      >
        {hasHeaderContent && (
          <div className={classes.baseHeader}>
            <div className={classes.baseHeaderContentWrapper}>
              {title && (
                <span className={classes.baseHeaderTitle}>{title}</span>
              )}
              {description && (
                <span className={classes.baseHeaderDescription}>
                  {description}
                </span>
              )}
            </div>
            {renderHeaderAction()}
          </div>
        )}
        <div className={classes.baseContent}>{children}</div>
      </Component>
    );
  },
);

BaseCard.displayName = 'BaseCard';

export default BaseCard;
