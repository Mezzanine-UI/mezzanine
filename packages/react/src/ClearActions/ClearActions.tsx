'use client';

import { forwardRef } from 'react';

import { CloseIcon, DangerousFilledIcon } from '@mezzanine-ui/icons';

import {
  clearActionsClasses as classes,
  ClearActionsEmbeddedVariant,
  ClearActionsStandardVariant,
  ClearActionsVariant,
} from '@mezzanine-ui/core/clear-actions';

import Icon from '../Icon';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

type ClearActionsCommonProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'button'>,
  'onClick' | 'type'
> & {
  /**
   * Called when user clicks or activates the button (via mouse or keyboard).
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

type ClearActionsStandardProps = ClearActionsCommonProps & {
  /**
   * Clear Actions Contextual type.
   * @default 'standard'
   */
  type?: 'standard';
  /**
   * Visual variant for standard type.
   */
  variant?: ClearActionsStandardVariant;
};

type ClearActionsEmbeddedProps = ClearActionsCommonProps & {
  /**
   * Clear Actions Contextual type.
   */
  type: 'embedded';
  /**
   * Visual variant for embedded type.
   */
  variant?: ClearActionsEmbeddedVariant;
};

type ClearActionsClearableProps = ClearActionsCommonProps & {
  /**
   * Clear Actions Contextual type.
   */
  type: 'clearable';
};

export type ClearActionsProps =
  | ClearActionsEmbeddedProps
  | ClearActionsStandardProps
  | ClearActionsClearableProps;

/**
 * Mezzanine clear actions button.
 */
const ClearActions = forwardRef<HTMLButtonElement, ClearActionsProps>(
  function ClearActions(props, ref) {
    const { className, onClick, type = 'standard', ...rest } = props;

    const variant =
      'variant' in props ? props.variant : undefined;
    const resolvedVariant: ClearActionsVariant =
      type === 'clearable'
        ? 'default'
        : variant ?? (type === 'standard' ? 'base' : 'contrast');

    return (
      <button
        {...rest}
        ref={ref}
        aria-label="Close"
        className={cx(
          classes.host,
          classes.type(type),
          classes.variant(resolvedVariant),
          className,
        )}
        onClick={onClick}
        type="button"
      >
        {
          type === 'clearable'
            ? <Icon className={classes.icon} icon={DangerousFilledIcon} />
            : <Icon className={classes.icon} icon={CloseIcon} />
        }
      </button>
    );
  },
);

export default ClearActions;

