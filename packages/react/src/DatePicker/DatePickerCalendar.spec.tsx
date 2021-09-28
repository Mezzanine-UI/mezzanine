import { createRef } from 'react';
import moment from 'moment';
import {
  CalendarMethodsMoment,
  CalendarMode,
  calendarYearModuler,
  DateType,
  getYearRange,
} from '@mezzanine-ui/core/calendar';
import { act } from 'react-dom/test-utils';
import {
  cleanup,
  fireEvent,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import { CalendarConfigProvider } from '../Calendar';
import {
  DatePickerCalendar,
} from '.';

describe('<DatePickerCalendar />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DatePickerCalendar ref={ref} referenceDate={moment()} open />
      </CalendarConfigProvider>,
    ),
  );

  describe('should update referenceDate when switching calendars', () => {
    it('case: switching months', () => {
      const referenceDate = moment('2021-10-20');
      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePickerCalendar referenceDate={referenceDate} open />
        </CalendarConfigProvider>,
      );

      const monthControlElement = getByText('Oct');

      fireEvent.click(monthControlElement);

      const testMonthElement = getByText('Nov');

      fireEvent.click(testMonthElement);

      expect(getByText('Nov')).toBeInstanceOf(HTMLButtonElement);
      expect(getByText('Nov').parentElement?.classList.contains('mzn-calendar-controls'));
    });

    it('case: switching years', () => {
      const referenceDate = moment('2021-10-20');
      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePickerCalendar referenceDate={referenceDate} open />
        </CalendarConfigProvider>,
      );

      const yearControlElement = getByText('2021');

      fireEvent.click(yearControlElement);

      const testYearElement = getByText('2022');

      fireEvent.click(testYearElement);

      expect(getByText('2022')).toBeInstanceOf(HTMLButtonElement);
      expect(getByText('2022').parentElement?.classList.contains('mzn-calendar-controls'));
    });
  });

  describe('prop: calendarRef', () => {
    it('should bind to calendar element', () => {
      const ref = createRef<HTMLInputElement>();

      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePickerCalendar calendarRef={ref} referenceDate={moment()} open />
        </CalendarConfigProvider>,
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('prop: onChange', () => {
    describe('should not invoke onChange when switching months', () => {
      const modes: CalendarMode[] = ['day', 'week'];

      modes.forEach((mode) => {
        it(`case: mode="${mode}"`, () => {
          const referenceDate = moment('2021-12-01');
          const onChange = jest.fn();
          const { getByText } = render(
            <CalendarConfigProvider methods={CalendarMethodsMoment}>
              <DatePickerCalendar
                open
                referenceDate={referenceDate}
                onChange={onChange}
                mode={mode}
              />
            </CalendarConfigProvider>,
          );
          const monthControlButtonElement = getByText('Dec');

          act(() => {
            fireEvent.click(monthControlButtonElement);
          });

          const janButtonElement = getByText('Nov');

          expect(janButtonElement).toBeInstanceOf(HTMLButtonElement);

          act(() => {
            fireEvent.click(janButtonElement!);
          });

          expect(onChange).not.toHaveBeenCalled();
        });
      });
    });

    describe('should not invoke onChange when switching years', () => {
      const modes: CalendarMode[] = ['day', 'week', 'month'];

      modes.forEach((mode) => {
        it(`case: mode="${mode}"`, () => {
          const referenceDate = moment('2021-12-01');
          const onChange = jest.fn();
          const { getByText } = render(
            <CalendarConfigProvider methods={CalendarMethodsMoment}>
              <DatePickerCalendar
                open
                referenceDate={referenceDate}
                onChange={onChange}
                mode={mode}
              />
            </CalendarConfigProvider>,
          );
          const yearControlButtonElement = getByText('2021');

          act(() => {
            fireEvent.click(yearControlButtonElement);
          });

          const testButtonElement = getByText('2020');

          expect(testButtonElement).toBeInstanceOf(HTMLButtonElement);

          act(() => {
            fireEvent.click(testButtonElement!);
          });

          expect(onChange).not.toHaveBeenCalled();
        });
      });
    });

    describe('should invoke onChange when not swithing years or months', () => {
      const modes: CalendarMode[] = ['day', 'month', 'week', 'year'];

      modes.forEach((mode) => {
        it(`case: mode="${mode}"`, () => {
          const referenceDate = moment('2021-12-15');
          const onChange = jest.fn();

          render(
            <CalendarConfigProvider methods={CalendarMethodsMoment}>
              <DatePickerCalendar
                open
                referenceDate={referenceDate}
                onChange={onChange}
                mode={mode}
              />
            </CalendarConfigProvider>,
          );

          const buttonElements = document.querySelectorAll('.mzn-calendar-button');
          const testButtonElement = buttonElements?.[buttonElements.length - 1];

          expect(testButtonElement).toBeInstanceOf(HTMLButtonElement);

          act(() => {
            fireEvent.click(testButtonElement!);
          });

          expect(onChange).toBeCalledTimes(1);
        });
      });
    });
  });

  describe('prop: mode', () => {
    describe('should update referenceDate when cell clicked', () => {
      it('case: mode="day"', () => {
        const referenceDate = moment('2021-10-20');
        const { getByText } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DatePickerCalendar
              open
              referenceDate={referenceDate}
              mode="day"
            />
          </CalendarConfigProvider>,
        );

        const nextControlButton = document.querySelector('.mzn-calendar-controls__next');

        fireEvent.click(nextControlButton!);

        const testCellElement = getByText('15');

        fireEvent.click(testCellElement);

        const monthControlButton = getByText('Nov');

        expect(monthControlButton).toBeInstanceOf(HTMLButtonElement);
        expect(monthControlButton.classList.contains('mzn-calendar-controls__button')).toBe(true);
      });

      it('case: mode="week"', () => {
        const referenceDate = moment('2021-10-20');
        const { getByText } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DatePickerCalendar
              open
              referenceDate={referenceDate}
              mode="week"
            />
          </CalendarConfigProvider>,
        );

        const nextControlButton = document.querySelector('.mzn-calendar-controls__next');

        fireEvent.click(nextControlButton!);

        const testCellElement = getByText('15');

        fireEvent.click(testCellElement);

        const monthControlButton = getByText('Nov');

        expect(monthControlButton).toBeInstanceOf(HTMLButtonElement);
        expect(monthControlButton.classList.contains('mzn-calendar-controls__button')).toBe(true);
      });

      it('case: mode="month"', () => {
        const referenceDate = moment('2021-10-20');
        const { getByText } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DatePickerCalendar
              open
              referenceDate={referenceDate}
              mode="month"
            />
          </CalendarConfigProvider>,
        );

        const nextControlButton = document.querySelector('.mzn-calendar-controls__next');

        fireEvent.click(nextControlButton!);

        const testCellElement = getByText('Jan');

        fireEvent.click(testCellElement);

        const yearControlButton = getByText('2022');

        expect(yearControlButton).toBeInstanceOf(HTMLButtonElement);
        expect(yearControlButton.classList.contains('mzn-calendar-controls__button')).toBe(true);
      });

      it('case: mode="year"', () => {
        const referenceDate = moment('2021-10-20');
        const { getByText } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DatePickerCalendar
              open
              referenceDate={referenceDate}
              mode="year"
            />
          </CalendarConfigProvider>,
        );

        const nextControlButton = document.querySelector('.mzn-calendar-controls__next');

        fireEvent.click(nextControlButton!);

        const testCellElement = getByText('2033');

        fireEvent.click(testCellElement);

        const [start, end] = getYearRange(2033, calendarYearModuler);
        const displayYearRange = `${start} - ${end}`;

        const yearControlButton = getByText(displayYearRange);

        expect(yearControlButton).toBeInstanceOf(HTMLButtonElement);
        expect(yearControlButton.classList.contains('mzn-calendar-controls__button')).toBe(true);
      });
    });

    describe('mode="day"', () => {
      it('should onChange argument meet the granularity of day', () => {
        const referenceDate = moment('2021-12-15');
        const targetDate = moment('2021-12-15');

        function isSameDate(val: DateType) {
          return targetDate.isSame(val, 'date');
        }

        const onChange = jest.fn(isSameDate);

        const { getByText } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DatePickerCalendar
              open
              referenceDate={referenceDate}
              onChange={onChange}
              mode="day"
            />
          </CalendarConfigProvider>,
        );

        const testButtonElement = getByText('15');

        expect(testButtonElement).toBeInstanceOf(HTMLButtonElement);

        act(() => {
          fireEvent.click(testButtonElement!);
        });

        expect(onChange).toHaveReturnedWith(true);
      });
    });

    describe('mode="week"', () => {
      it('should onChange argument meet the granularity of week', () => {
        const referenceDate = moment('2021-12-15');
        const targetDate = moment('2021-12-15');

        function isSameWeek(val: DateType) {
          return targetDate.isSame(val, 'week');
        }

        const onChange = jest.fn(isSameWeek);

        const { getByText } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DatePickerCalendar
              open
              referenceDate={referenceDate}
              onChange={onChange}
              mode="week"
            />
          </CalendarConfigProvider>,
        );

        const testButtonElement = getByText('15').parentNode?.parentNode;

        expect(testButtonElement).toBeInstanceOf(HTMLButtonElement);

        act(() => {
          fireEvent.click(testButtonElement!);
        });

        expect(onChange).toHaveReturnedWith(true);
      });
    });

    describe('mode="month"', () => {
      it('should onChange argument meet the granularity of month', () => {
        const referenceDate = moment('2021-12-15');
        const targetDate = moment('2021-11-15');

        function isSameMonth(val: DateType) {
          return targetDate.isSame(val, 'month');
        }

        const onChange = jest.fn(isSameMonth);

        const { getByText } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DatePickerCalendar
              open
              referenceDate={referenceDate}
              onChange={onChange}
              mode="month"
            />
          </CalendarConfigProvider>,
        );

        const testButtonElement = getByText('Nov');

        expect(testButtonElement).toBeInstanceOf(HTMLButtonElement);

        act(() => {
          fireEvent.click(testButtonElement!);
        });

        expect(onChange).toHaveReturnedWith(true);
      });
    });

    describe('mode="month"', () => {
      it('should onChange argument meet the granularity of year', () => {
        const referenceDate = moment('2021-12-15');
        const targetDate = moment('2020-12-15');

        function isSameYear(val: DateType) {
          return targetDate.isSame(val, 'year');
        }

        const onChange = jest.fn(isSameYear);

        const { getByText } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DatePickerCalendar
              open
              referenceDate={referenceDate}
              onChange={onChange}
              mode="year"
            />
          </CalendarConfigProvider>,
        );

        const testButtonElement = getByText('2020');

        expect(testButtonElement).toBeInstanceOf(HTMLButtonElement);

        act(() => {
          fireEvent.click(testButtonElement!);
        });

        expect(onChange).toHaveReturnedWith(true);
      });
    });
  });
});
