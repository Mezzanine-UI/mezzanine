import { StoryFn, Meta } from '@storybook/react-webpack5';
import { DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import CalendarMethodsLuxon from '@mezzanine-ui/core/calendarMethodsLuxon';
import { useState } from 'react';
import { CalendarConfigProvider } from '../Calendar';
import TimePanel, { TimePanelProps } from './TimePanel';

export default {
  title: 'Internal/Time Panel',
} as Meta;

type PlaygroundArgs = Pick<
  TimePanelProps,
  'hourStep' | 'minuteStep' | 'secondStep'
>;

export const Playground: StoryFn<PlaygroundArgs> = ({
  hourStep,
  minuteStep,
  secondStep,
}) => {
  const [val, setVal] = useState<DateType>();
  const [val2, setVal2] = useState<DateType>();
  const [val3, setVal3] = useState<DateType>();

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'row',
        gap: '32px',
      }}
    >
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <div style={{ display: 'flex', flexFlow: 'column' }}>
          Default
          <TimePanel
            value={val}
            onChange={setVal}
            hourStep={hourStep}
            minuteStep={minuteStep}
            secondStep={secondStep}
          />
        </div>
      </CalendarConfigProvider>
      <CalendarConfigProvider methods={CalendarMethodsDayjs}>
        <div style={{ display: 'flex', flexFlow: 'column' }}>
          Hide Second
          <TimePanel
            value={val2}
            onChange={setVal2}
            hourStep={hourStep}
            minuteStep={minuteStep}
            secondStep={secondStep}
            hideSecond
          />
        </div>
      </CalendarConfigProvider>
      <CalendarConfigProvider methods={CalendarMethodsLuxon}>
        <div style={{ display: 'flex', flexFlow: 'column' }}>
          Custom Steps (1h, 5m, 10s)
          <TimePanel
            value={val3}
            onChange={setVal3}
            hourStep={1}
            minuteStep={5}
            secondStep={10}
          />
        </div>
      </CalendarConfigProvider>
    </div>
  );
};

Playground.args = {
  hourStep: 1,
  minuteStep: 1,
  secondStep: 1,
};
