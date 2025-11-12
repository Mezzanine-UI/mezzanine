'use client';

import { forwardRef } from 'react';

import { CloseIcon } from '@mezzanine-ui/icons';

import {
  dismissButtonClasses as classes,
  DismissButtonEmbeddedVariant,
  DismissButtonStandardVariant,
  DismissButtonType,
  DismissButtonVariant,
} from '@mezzanine-ui/core/dismiss-button';

import Icon from '../Icon';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

type DismissButtonCommonProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'button'>,
  'onClick' | 'type'
> & {
  /**
   * Called when user clicks or activates the button (via mouse or keyboard).
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

type DismissButtonStandardProps = DismissButtonCommonProps & {
  /**
   * Dismiss Button Contextual type.
   */
  type?: 'standard';
  /**
   * Visual variant for standard type.
   */
  variant?: DismissButtonStandardVariant;
};

type DismissButtonEmbeddedProps = DismissButtonCommonProps & {
  /**
   * Dismiss Button Contextual type.
   */
  type: 'embedded';
  /**
   * Visual variant for embedded type.
   */
  variant?: DismissButtonEmbeddedVariant;
};

export type DismissButtonProps =
  | DismissButtonEmbeddedProps
  | DismissButtonStandardProps;

/**
 * Mezzanine dismiss/close button.
 */
const DismissButton = forwardRef<HTMLButtonElement, DismissButtonProps>(
  function DismissButton(props, ref) {
    const { className, onClick, type: typeProp, variant, ...rest } = props;

    const type: DismissButtonType = typeProp ?? 'standard';
    const resolvedVariant: DismissButtonVariant =
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

export default DismissButton;
