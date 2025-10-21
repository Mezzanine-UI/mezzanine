/* global document */
import moment from 'moment';
import { act } from 'react';
import { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import { CalendarConfigProvider } from '../Calendar';
import { DateRangePickerCalendar } from '.';

describe('<DateRangePickerCalendar />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateRangePickerCalendar ref={ref} referenceDate="2022-01-02" open />
      </CalendarConfigProvider>,
    ),
  );

  describe('switching calendar', () => {
    it('should right calendar has an overlay to block interacting when left calendar month control clicked', () => {
      const referenceDate = '2021-12-01';
      const onChange = jest.fn();
      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePickerCalendar
            open
            referenceDate={referenceDate}
            onChange={onChange}
          />
        </CalendarConfigProvider>,
      );
      const leftCalendarMonthControlButtonElement = getByText('Dec');

      fireEvent.click(leftCalendarMonthControlButtonElement);

      const [, rightCalendar] = document.querySelectorAll('.mzn-calendar');

      expect(
        rightCalendar.classList.contains(
          'mzn-date-range-picker-calendar--inactive',
        ),
      );
    });

    it('should left calendar has an overlay to block interacting when right calendar month control clicked', () => {
      const referenceDate = '2021-12-01';
      const onChange = jest.fn();
      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePickerCalendar
            open
            referenceDate={referenceDate}
            onChange={onChange}
          />
        </CalendarConfigProvider>,
      );
      const rightCalendarMonthControlButtonElement = getByText('Jan');

      fireEvent.click(rightCalendarMonthControlButtonElement);

      const [leftCalendar] = document.querySelectorAll('.mzn-calendar');

      expect(
        leftCalendar.classList.contains(
          'mzn-date-range-picker-calendar--inactive',
        ),
      );
    });

    it('should right calendar has an overlay to block interacting when left calendar year control clicked', () => {
      const referenceDate = '2021-12-01';
      const onChange = jest.fn();
      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePickerCalendar
            open
            referenceDate={referenceDate}
            onChange={onChange}
          />
        </CalendarConfigProvider>,
      );
      const leftCalendarMonthControlButtonElement = getByText('2021');

      fireEvent.click(leftCalendarMonthControlButtonElement);

      const [, rightCalendar] = document.querySelectorAll('.mzn-calendar');

      expect(
        rightCalendar.classList.contains(
          'mzn-date-range-picker-calendar--inactive',
        ),
      );
    });

    it('should left calendar has an overlay to block interacting when right calendar year control clicked', () => {
      const referenceDate = '2021-12-01';
      const onChange = jest.fn();
      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePickerCalendar
            open
            referenceDate={referenceDate}
            onChange={onChange}
          />
        </CalendarConfigProvider>,
      );

      const rightCalendarMonthControlButtonElement = getByText('2022');

      fireEvent.click(rightCalendarMonthControlButtonElement);

      const [leftCalendar] = document.querySelectorAll('.mzn-calendar');

      expect(
        leftCalendar.classList.contains(
          'mzn-date-range-picker-calendar--inactive',
        ),
      );
    });
  });

  describe('should update referenceDate when switching calendars', () => {
    it('case: switching months', () => {
      const referenceDate = '2021-10-20';
      const { getAllByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePickerCalendar referenceDate={referenceDate} open />
        </CalendarConfigProvider>,
      );

      const [monthControlElement] = getAllByText('Oct');

      fireEvent.click(monthControlElement);

      const [testMonthElement] = getAllByText('Nov');

      fireEvent.click(testMonthElement);

      expect(getAllByText('Nov')[0]).toBeInstanceOf(HTMLButtonElement);
      expect(
        getAllByText('Nov')[0].parentElement?.classList.contains(
          'mzn-calendar-controls',
        ),
      );
    });

    it('case: switching years', () => {
      const referenceDate = '2021-10-20';
      const { getAllByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePickerCalendar referenceDate={referenceDate} open />
        </CalendarConfigProvider>,
      );

      const [yearControlElement] = getAllByText('2021');

      fireEvent.click(yearControlElement);

      const [testYearElement] = getAllByText('2022');

      fireEvent.click(testYearElement);

      expect(getAllByText('2022')[0]).toBeInstanceOf(HTMLButtonElement);
      expect(
        getAllByText('2022')[0].parentElement?.classList.contains(
          'mzn-calendar-controls',
        ),
      );
    });
  });

  describe('prop: onChange', () => {
    describe('should not invoke onChange when switching months', () => {
      const modes: CalendarMode[] = ['day', 'week'];

      modes.forEach((mode) => {
        it(`case: mode="${mode}"`, () => {
          const referenceDate = '2021-12-01';
          const onChange = jest.fn();
          const { getAllByText } = render(
            <CalendarConfigProvider methods={CalendarMethodsMoment}>
              <DateRangePickerCalendar
                open
                referenceDate={referenceDate}
                onChange={onChange}
                mode={mode}
              />
            </CalendarConfigProvider>,
          );
          const [firstMonthControlButtonElement] = getAllByText('Dec');

          act(() => {
            fireEvent.click(firstMonthControlButtonElement);
          });

          const [novButtonElement] = getAllByText('Nov');

          expect(novButtonElement).toBeInstanceOf(HTMLButtonElement);

          act(() => {
            fireEvent.click(novButtonElement!);
          });

          expect(onChange).not.toHaveBeenCalled();

          // second calendar
          const [secondMonthControlButtonElement] = getAllByText('Dec');

          act(() => {
            fireEvent.click(secondMonthControlButtonElement);
          });

          const [marButtonElement] = getAllByText('Mar');

          expect(marButtonElement).toBeInstanceOf(HTMLButtonElement);

          act(() => {
            fireEvent.click(marButtonElement!);
          });

          expect(onChange).not.toHaveBeenCalled();
        });
      });
    });

    describe('should not invoke onChange when switching years', () => {
      const modes: CalendarMode[] = ['day', 'week', 'month'];

      modes.forEach((mode) => {
        it(`case: mode="${mode}"`, () => {
          const referenceDate = '2021-12-01';
          const onChange = jest.fn();
          const { getAllByText } = render(
            <CalendarConfigProvider methods={CalendarMethodsMoment}>
              <DateRangePickerCalendar
                open
                referenceDate={referenceDate}
                onChange={onChange}
                mode={mode}
              />
            </CalendarConfigProvider>,
          );
          const [yearControlButtonElement] = getAllByText('2021');

          act(() => {
            fireEvent.click(yearControlButtonElement);
          });

          const [testButtonElement] = getAllByText('2020');

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
          const referenceDate = '2021-12-15';
          const onChange = jest.fn();

          render(
            <CalendarConfigProvider methods={CalendarMethodsMoment}>
              <DateRangePickerCalendar
                open
                referenceDate={referenceDate}
                onChange={onChange}
                mode={mode}
              />
            </CalendarConfigProvider>,
          );

          const firstCalendarElement = document.querySelector('.mzn-calendar');
          const firstButtonElements = firstCalendarElement!.querySelectorAll(
            '.mzn-calendar-button',
          );
          const firstTestButtonElement =
            firstButtonElements?.[firstButtonElements.length - 1];

          expect(firstTestButtonElement).toBeInstanceOf(HTMLButtonElement);

          act(() => {
            fireEvent.click(firstTestButtonElement!);
          });

          expect(onChange).toHaveBeenCalledTimes(1);
          onChange.mockClear();

          const [, secondCalendarElement] =
            document.querySelectorAll('.mzn-calendar');
          const secondButtonElements = secondCalendarElement!.querySelectorAll(
            '.mzn-calendar-button',
          );
          const secondTestButtonElement =
            secondButtonElements?.[secondButtonElements.length - 1];

          expect(secondTestButtonElement).toBeInstanceOf(HTMLButtonElement);

          act(() => {
            fireEvent.click(secondTestButtonElement!);
          });

          expect(onChange).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('prop: mode', () => {
    describe('mode="day"', () => {
      it('should onChange argument meet the granularity of day', () => {
        const referenceDate = '2021-12-15';
        const targetDate = moment('2021-12-15');

        function isSameDate(val: DateType) {
          return targetDate.isSame(val, 'date');
        }

        const onChange = jest.fn(isSameDate);

        const { getAllByText } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DateRangePickerCalendar
              open
              referenceDate={referenceDate}
              onChange={onChange}
              mode="day"
            />
          </CalendarConfigProvider>,
        );

        const [testButtonElement] = getAllByText('15');

        expect(testButtonElement).toBeInstanceOf(HTMLButtonElement);

        act(() => {
          fireEvent.click(testButtonElement!);
        });

        expect(onChange).toHaveReturnedWith(true);
      });
    });

    describe('mode="week"', () => {
      it('should onChange argument meet the granularity of week', () => {
        const referenceDate = '2021-12-15';
        const targetDate = moment('2021-12-15');

        function isSameWeek(val: DateType) {
          return targetDate.isSame(val, 'week');
        }

        const onChange = jest.fn(isSameWeek);

        const { getAllByText } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DateRangePickerCalendar
              open
              referenceDate={referenceDate}
              onChange={onChange}
              mode="week"
            />
          </CalendarConfigProvider>,
        );

        const testButtonElement = getAllByText('15')[0].parentNode?.parentNode;

        expect(testButtonElement).toBeInstanceOf(HTMLButtonElement);

        act(() => {
          fireEvent.click(testButtonElement!);
        });

        expect(onChange).toHaveReturnedWith(true);
      });
    });

    describe('mode="month"', () => {
      it('should onChange argument meet the granularity of month', () => {
        const referenceDate = '2021-12-15';
        const targetDate = moment('2021-11-15');

        function isSameMonth(val: DateType) {
          return targetDate.isSame(val, 'month');
        }

        const onChange = jest.fn(isSameMonth);

        const { getAllByText } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DateRangePickerCalendar
              open
              referenceDate={referenceDate}
              onChange={onChange}
              mode="month"
            />
          </CalendarConfigProvider>,
        );

        const [testButtonElement] = getAllByText('Nov');

        expect(testButtonElement).toBeInstanceOf(HTMLButtonElement);

        act(() => {
          fireEvent.click(testButtonElement!);
        });

        expect(onChange).toHaveReturnedWith(true);
      });
    });

    describe('mode="month"', () => {
      it('should onChange argument meet the granularity of year', () => {
        const referenceDate = '2021-12-15';
        const targetDate = moment('2020-12-15');

        function isSameYear(val: DateType) {
          return targetDate.isSame(val, 'year');
        }

        const onChange = jest.fn(isSameYear);

        const { getAllByText } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DateRangePickerCalendar
              open
              referenceDate={referenceDate}
              onChange={onChange}
              mode="year"
            />
          </CalendarConfigProvider>,
        );

        const [testButtonElement] = getAllByText('2020');

        expect(testButtonElement).toBeInstanceOf(HTMLButtonElement);

        act(() => {
          fireEvent.click(testButtonElement!);
        });

        expect(onChange).toHaveReturnedWith(true);
      });
    });
  });
});
