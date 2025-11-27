import { timePanelClasses as classes } from '@mezzanine-ui/core/time-panel';
import { forwardRef } from 'react';
import Button from '../Button';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface TimePanelActionProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
  /**
   * Click handler for "This moment" button.
   */
  onClick?: VoidFunction;
}

/**
 * The react component for `mezzanine` time panel action.
 */
const TimePanelAction = forwardRef<HTMLDivElement, TimePanelActionProps>(
  function TimePanelAction(props, ref) {
    const { className, onClick, ...rest } = props;

    return (
      <div {...rest} ref={ref} className={cx(classes.action, className)}>
        <Button variant="base-ghost" size="minor" onClick={onClick}>
          This moment
        </Button>
      </div>
    );
  },
);

export default TimePanelAction;
