import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Button from '../Button';

export interface CalendarFooterControlProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onClick'> {
  /**
   * The name of children content.
   */
  children?: string;
  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The onClick handler for button
   */
  onClick?: VoidFunction;
}

/**
 * The react component for `mezzanine` calendar footer control.
 */
function CalendarFooterControl(props: CalendarFooterControlProps) {
  const { children, className, disabled, onClick, ...restElementProps } = props;

  return (
    <div {...restElementProps} className={cx(classes.footerControl, className)}>
      <Button
        disabled={disabled}
        onClick={onClick}
        size="minor"
        variant="base-ghost"
      >
        {children}
      </Button>
    </div>
  );
}

export default CalendarFooterControl;
