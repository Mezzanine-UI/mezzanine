'use client';

import { forwardRef } from 'react';

import { CloseIcon } from '@mezzanine-ui/icons';

import {
  clearActionsClasses as classes,
  ClearActionsEmbeddedVariant,
  ClearActionsStandardVariant,
  ClearActionsType,
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

export type ClearActionsProps =
  | ClearActionsEmbeddedProps
  | ClearActionsStandardProps;

/**
 * Mezzanine clear actions button.
 */
const ClearActions = forwardRef<HTMLButtonElement, ClearActionsProps>(
  function ClearActions(props, ref) {
    const { className, onClick, type: typeProp, variant, ...rest } = props;

    const type: ClearActionsType = typeProp ?? 'standard';
    const resolvedVariant: ClearActionsVariant =
      variant ?? (type === 'standard' ? 'base' : 'contrast');

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
        <Icon className={classes.icon} icon={CloseIcon} />
      </button>
    );
  },
);

export default ClearActions;

