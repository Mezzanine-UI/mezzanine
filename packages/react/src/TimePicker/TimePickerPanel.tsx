import { forwardRef } from 'react';
import { DateType } from '@mezzanine-ui/core/calendar';
import { PickerPopper, PickerPopperProps } from '../Picker';
import TimePanel, { TimePanelProps } from '../TimePanel';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface TimePickerPanelProps
  extends
  Omit<TimePanelProps,
  | Exclude<keyof NativeElementPropsWithoutKeyAndRef<'div'>, | 'className' | 'style' | 'id' >
  | 'withoutAction'
  | 'onChange'
  | 'value'
  >,
  Omit<PickerPopperProps,
  | 'children'
  > {
  /**
   * Change Handler. Receive `DateType` as props.
   */
  onChange?: (value?: DateType) => void;
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
      confirmText,
      fadeProps,
      hideHour,
      hideMinute,
      hideSecond,
      hourPrefix,
      hourStep,
      minutePrefix,
      minuteStep,
      onChange,
      onConfirm,
      open,
      popperProps,
      secondPrefix,
      secondStep,
      value,
      ...restHostProps
    } = props;

    return (
      <PickerPopper
        ref={ref}
        anchor={anchor}
        open={open}
        fadeProps={fadeProps}
        popperProps={popperProps}
      >
        <TimePanel
          {...restHostProps}
          hideHour={hideHour}
          hourStep={hourStep}
          hideMinute={hideMinute}
          minuteStep={minuteStep}
          hideSecond={hideSecond}
          secondStep={secondStep}
          hourPrefix={hourPrefix}
          minutePrefix={minutePrefix}
          secondPrefix={secondPrefix}
          onChange={onChange}
          value={value}
          onConfirm={onConfirm}
          confirmText={confirmText}
        />
      </PickerPopper>
    );
  },
);

export default TimePickerPanel;
