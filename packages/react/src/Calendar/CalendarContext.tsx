import { createContext, ReactNode, useContext, useMemo } from 'react';
import { CalendarMethods } from '@mezzanine-ui/core/calendar';

export interface CalendarConfigs extends CalendarMethods {
  defaultDateFormat: string;
  defaultTimeFormat: string;
  displayMonthLocale: string;
  displayWeekDayLocale: string;
  valueLocale: string;
}

export type CalendarConfigProviderProps = {
  children?: ReactNode;
  defaultDateFormat?: string;
  defaultTimeFormat?: string;
  displayMonthLocale?: string;
  displayWeekDayLocale?: string;
  methods: CalendarMethods;
  valueLocale?: string;
};

export const CalendarContext = createContext<CalendarConfigs | undefined>(
  undefined,
);

export function useCalendarContext() {
  const configs = useContext(CalendarContext);

  if (!configs) {
    throw new Error(
      'Cannot find values in your context. ' +
        'Make sure you use `CalendarConfigProvider` in your app ' +
        'and pass in one of the following as methods: `CalendarMethodsMoment`.',
    );
  }

  return configs;
}

function CalendarConfigProvider(props: CalendarConfigProviderProps) {
  const {
    children,
    defaultDateFormat = 'YYYY-MM-DD',
    defaultTimeFormat = 'HH:mm:ss',
    displayMonthLocale = 'en-us',
    displayWeekDayLocale = 'en-us',
    methods,
    valueLocale = 'en-us',
  } = props;

  const context = useMemo(
    () => ({
      ...methods,
      defaultDateFormat,
      defaultTimeFormat,
      displayMonthLocale,
      displayWeekDayLocale,
      valueLocale,
    }),
    [
      methods,
      defaultDateFormat,
      defaultTimeFormat,
      displayMonthLocale,
      displayWeekDayLocale,
      valueLocale,
    ],
  );

  return (
    <CalendarContext.Provider value={context}>
      {children}
    </CalendarContext.Provider>
  );
}

export default CalendarConfigProvider;
