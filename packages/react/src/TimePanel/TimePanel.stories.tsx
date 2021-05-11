import { Story, Meta } from '@storybook/react';
import { CalendarMethodsMoment, DateType } from '@mezzanine-ui/core/calendar';
import { getUnits, TimePanelUnit } from '@mezzanine-ui/core/time-panel';
import { useState } from 'react';
import { CalendarConfigProvider } from '../Calendar';
import TimePanel, { TimePanelProps } from './TimePanel';
import TimePanelAction from './TimePanelAction';
import TimePanelColumn from './TimePanelColumn';

export default {
  title: 'Utility/Time Panel',
} as Meta;

type PlaygroundArgs = Pick<TimePanelProps,
| 'hourStep'
| 'minuteStep'
| 'secondStep'
| 'hideHour'
| 'hideMinute'
| 'hideSecond'>;

export const Playground: Story<PlaygroundArgs> = ({
  hourStep,
  minuteStep,
  secondStep,
  hideHour,
  hideMinute,
  hideSecond,
}) => {
  const [val, setVal] = useState<DateType>();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <TimePanel
        value={val}
        onChange={setVal}
        hourStep={hourStep}
        minuteStep={minuteStep}
        secondStep={secondStep}
        hideHour={hideHour}
        hideMinute={hideMinute}
        hideSecond={hideSecond}
      />
    </CalendarConfigProvider>
  );
};

Playground.args = {
  hourStep: 1,
  minuteStep: 1,
  secondStep: 1,
  hideHour: false,
  hideMinute: false,
  hideSecond: false,
};

export const Column = () => {
  const units = getUnits(0, 23, 1);
  const [activeValue, setActiveValue] = useState<TimePanelUnit['value']>();

  const onNext = () => {
    if (!activeValue) {
      setActiveValue(units[0].value);
    }

    const currentActiveIndex = units.findIndex(({ value }) => value === activeValue);
    const nextActiveIndex = (currentActiveIndex + 1) % units.length;

    setActiveValue(units[nextActiveIndex].value);
  };

  const onPrev = () => {
    if (!activeValue) {
      setActiveValue(units[0].value);
    }

    const currentActiveIndex = units.findIndex(({ value }) => value === activeValue);
    const nextActiveIndex = (currentActiveIndex - 1) % units.length;

    setActiveValue(units[nextActiveIndex].value);
  };

  return (
    <div style={{ width: '48px' }}>
      <TimePanelColumn
        units={units}
        activeUnit={activeValue}
        onChange={(v) => { setActiveValue(v.value); }}
        onNext={onNext}
        onPrev={onPrev}
      />
    </div>
  );
};

export const Action = () => (
  <div style={{ width: '276px' }}>
    <TimePanelAction />
  </div>
);
