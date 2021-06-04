import { forwardRef } from 'react';
import { DateType } from '@mezzanine-ui/core/calendar';
import TimePanel, { TimePanelProps } from '../TimePanel';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import InputTriggerPopper, { InputTriggerPopperProps } from '../_internal/InputTriggerPopper';

export interface TimePickerPanelProps
  extends
  Omit<TimePanelProps,
  | Exclude<keyof NativeElementPropsWithoutKeyAndRef<'div'>, | 'className' | 'style' | 'id' >
  | 'withoutAction'
  | 'onChange'
  | 'value'
  >,
  Pick<InputTriggerPopperProps,
  | 'anchor'
  | 'fadeProps'
  | 'open'
  > {
  /**
   * Change Handler. Receive `DateType` as props.
   */
  onChange?: (value?: DateType) => void;
  /**
   * Other props you may provide to `Popper` component
   */
  popperProps?: Omit<InputTriggerPopperProps,
  | 'anchor'
  | 'children'
  | 'fadeProps'
  | 'open'
  >
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
      <InputTriggerPopper
        {...popperProps}
        ref={ref}
        anchor={anchor}
        open={open}
        fadeProps={fadeProps}
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
      </InputTriggerPopper>
    );
  },
);

export default TimePickerPanel;
