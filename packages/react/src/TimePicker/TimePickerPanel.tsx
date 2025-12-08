import { forwardRef } from 'react';
import { DateType } from '@mezzanine-ui/core/calendar';
import TimePanel, { TimePanelProps } from '../TimePanel';
import InputTriggerPopper, {
  InputTriggerPopperProps,
} from '../_internal/InputTriggerPopper';

export interface TimePickerPanelProps
  extends Pick<
      TimePanelProps,
      | 'className'
      | 'hideHour'
      | 'hideMinute'
      | 'hideSecond'
      | 'hourStep'
      | 'minuteStep'
      | 'secondStep'
      | 'style'
    >,
    Pick<InputTriggerPopperProps, 'anchor' | 'fadeProps' | 'open'> {
  /**
   * Change Handler. Receive `DateType` as props.
   */
  onChange?: (value?: DateType) => void;
  /**
   * Other props you may provide to `Popper` component
   */
  popperProps?: Omit<
    InputTriggerPopperProps,
    'anchor' | 'children' | 'fadeProps' | 'open'
  >;
  /**
   * Display value of the panel.
   */
  value?: DateType;
}

/**
 * The react component for `mezzanine` time picker panel.
 */
const TimePickerPanel = forwardRef<HTMLDivElement, TimePickerPanelProps>(
  function TimePickerPanel(props, ref) {
    const {
      anchor,
      className,
      fadeProps,
      hideHour,
      hideMinute,
      hideSecond,
      hourStep,
      minuteStep,
      onChange,
      open,
      popperProps,
      secondStep,
      style,
      value,
    } = props;

    return (
      <InputTriggerPopper
        {...popperProps}
        ref={ref}
        anchor={anchor}
        open={open}
        fadeProps={fadeProps}
      >
        <TimePanel
          className={className}
          hideHour={hideHour}
          hideMinute={hideMinute}
          hideSecond={hideSecond}
          hourStep={hourStep}
          minuteStep={minuteStep}
          onChange={onChange}
          secondStep={secondStep}
          style={style}
          value={value}
        />
      </InputTriggerPopper>
    );
  },
);

export default TimePickerPanel;
