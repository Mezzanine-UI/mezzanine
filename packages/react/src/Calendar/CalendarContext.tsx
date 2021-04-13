import { createContext, ReactNode, useContext } from 'react';
import { CalendarMethods, DateType } from '@mezzanine-ui/core/calendar';

export interface CalendarConfigs extends CalendarMethods<DateType> {
  displayMonthLocale: string;
  displayWeekDayLocale: string;
  valueLocale: string;
  format: string;
}

export type CalendarConfigProviderProps = {
  children?: ReactNode;
  methods: CalendarMethods<DateType>;
  displayMonthLocale?: string;
  displayWeekDayLocale?: string;
  valueLocale?: string;
  format?: string;
};

export const CalendarContext = createContext<CalendarConfigs | undefined>(undefined);

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
    methods,
    displayMonthLocale = 'en-us',
    displayWeekDayLocale = 'en-us',
    valueLocale = 'en-us',
    format = 'YYYY-MM-DD',
  } = props;

  return (
    <CalendarContext.Provider value={{
      ...methods,
      displayMonthLocale,
      displayWeekDayLocale,
      valueLocale,
      format,
    }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export default CalendarConfigProvider;
