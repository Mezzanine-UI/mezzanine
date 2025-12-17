import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Button, { ButtonProps } from '../Button';

export interface CalendarFooterActionsProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onClick'> {
  actions: {
    secondaryButtonProps: ButtonProps;
    primaryButtonProps: ButtonProps;
  };
}

/**
 * The react component for `mezzanine` calendar footer actions.
 */
function CalendarFooterActions(props: CalendarFooterActionsProps) {
  const { actions, className, ...restElementProps } = props;

  return (
    <div {...restElementProps} className={cx(classes.footerActions, className)}>
      <Button
        variant="base-tertiary"
        size="minor"
        {...actions.secondaryButtonProps}
      />
      <Button
        variant="base-primary"
        size="minor"
        {...actions.primaryButtonProps}
      />
    </div>
  );
}

export default CalendarFooterActions;
