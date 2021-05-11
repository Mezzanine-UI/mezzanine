import {
  timePanelClasses as classes,
} from '@mezzanine-ui/core/time-panel';
import { forwardRef, ReactNode } from 'react';
import Button from '../Button';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface TimePanelActionProps extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'>{
  /**
   * Display name of the confirm button.
   * @default 'OK'
   */
  confirmText?: ReactNode;
  /**
   * Click handler for the confirm button.
   */
  onConfirm?: VoidFunction;
}

/**
 * The react component for `mezzanine` time panel action.
 */
const TimePanelAction = forwardRef<HTMLDivElement, TimePanelActionProps>(
  function TimePanelAction(props, ref) {
    const {
      className,
      confirmText = 'OK',
      onConfirm,
      ...rest
    } = props;

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(
          classes.action,
          className,
        )}
      >
        <Button variant="contained" size="small" onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    );
  },
);

export default TimePanelAction;
