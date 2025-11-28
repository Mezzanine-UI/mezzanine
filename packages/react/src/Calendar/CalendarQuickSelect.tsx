import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';
import { CheckedIcon } from '@mezzanine-ui/icons';

export interface CalendarQuickSelectProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onClick'> {
  /**
   * The id of active quick select button.
   */
  activeId?: string;
  /**
   * The options for quick select buttons.
   */
  options: {
    id: string;
    name: string;
    disabled?: boolean;
    onClick: VoidFunction;
  }[];
}

/**
 * The react component for `mezzanine` calendar quick select.
 */
function CalendarQuickSelect(props: CalendarQuickSelectProps) {
  const { className, activeId, options, ...restElementProps } = props;

  return (
    <div {...restElementProps} className={cx(classes.quickSelect, className)}>
      {options.map(({ id, name, disabled, onClick }) => (
        <button
          key={id}
          type="button"
          disabled={disabled}
          aria-disabled={disabled}
          className={cx(
            classes.quickSelectButton,
            id === activeId && classes.quickSelectButtonActive,
          )}
          onClick={onClick}
        >
          <span>{name}</span>
          {id === activeId && <Icon icon={CheckedIcon} size={16} />}
        </button>
      ))}
    </div>
  );
}

export default CalendarQuickSelect;
