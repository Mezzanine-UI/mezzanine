/* global document */
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import {
  cleanup,
  render,
  act,
  fireEvent,
  getByText,
} from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import { CalendarConfigProvider } from '../Calendar';
import { DateTimePickerPanel } from '.';

describe('<DateTimePickerPanel />', () => {
  Element.prototype.scrollTo = () => {};

  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateTimePickerPanel ref={ref} open referenceDate="2022-01-02" />
      </CalendarConfigProvider>,
    ),
  );

  it('should update referenceDate when cells clicked', () => {
    const referenceDate = '2021-10-20';
    const { getByText: getByTextWithHost } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateTimePickerPanel referenceDate={referenceDate} open />
      </CalendarConfigProvider>,
    );

    const nextControlElement = document.querySelector(
      '.mzn-calendar-controls__next',
    );

    fireEvent.click(nextControlElement!);

    const calendarElement = document.querySelector('.mzn-calendar');
    const testDateElement = getByText(calendarElement as HTMLElement, '15');

    fireEvent.click(testDateElement);

    expect(getByTextWithHost('Nov')).toBeInstanceOf(HTMLButtonElement);
    expect(
      getByTextWithHost('Nov').parentElement?.classList.contains(
        'mzn-calendar-controls',
      ),
    );
  });

  it('should update referenceDate when units clicked', () => {
    const referenceDate = '2021-10-20';

    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateTimePickerPanel referenceDate={referenceDate} open />
      </CalendarConfigProvider>,
    );

    const timePanelElement = document.querySelector('.mzn-time-panel');
    const columnElement = timePanelElement!.querySelector(
      '.mzn-time-panel-column',
    );
    const testTimeElement = getByText(columnElement as HTMLElement, '00');

    fireEvent.click(testTimeElement);

    expect((testTimeElement as HTMLButtonElement).onclick).toBeInstanceOf(
      Function,
    );
  });

  describe('should update referenceDate when switching calendars', () => {
    it('case: switching months', () => {
      const referenceDate = '2021-10-20';
      const { getByText: getByTextWithHost } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePickerPanel referenceDate={referenceDate} open />
        </CalendarConfigProvider>,
      );

      const monthControlElement = getByTextWithHost('Oct');

      fireEvent.click(monthControlElement);

      const testMonthElement = getByTextWithHost('Nov');

      fireEvent.click(testMonthElement);

      expect(getByTextWithHost('Nov')).toBeInstanceOf(HTMLButtonElement);
      expect(
        getByTextWithHost('Nov').parentElement?.classList.contains(
          'mzn-calendar-controls',
        ),
      );
    });

    it('case: switching years', () => {
      const referenceDate = '2021-10-20';
      const { getByText: getByTextWithHost } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePickerPanel referenceDate={referenceDate} open />
        </CalendarConfigProvider>,
      );

      const yearControlElement = getByTextWithHost('2021');

      fireEvent.click(yearControlElement);

      const testYearElement = getByTextWithHost('2022');

      fireEvent.click(testYearElement);

      expect(getByTextWithHost('2022')).toBeInstanceOf(HTMLButtonElement);
      expect(
        getByTextWithHost('2022').parentElement?.classList.contains(
          'mzn-calendar-controls',
        ),
      );
    });
  });

  describe('prop: onChange', () => {
    it('should not invoke onChange when switching months', () => {
      const referenceDate = '2021-12-01';
      const onChange = jest.fn();
      const { getByText: getByTextWithHost } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePickerPanel
            open
            referenceDate={referenceDate}
            onChange={onChange}
          />
        </CalendarConfigProvider>,
      );
      const monthControlButtonElement = getByTextWithHost('Dec');

      act(() => {
        fireEvent.click(monthControlButtonElement);
      });

      const janButtonElement = getByTextWithHost('Nov');

      expect(janButtonElement).toBeInstanceOf(HTMLButtonElement);

      act(() => {
        fireEvent.click(janButtonElement!);
      });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should not invoke onChange when switching years', () => {
      const referenceDate = '2021-12-01';
      const onChange = jest.fn();
      const { getByText: getByTextWithHost } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePickerPanel
            open
            referenceDate={referenceDate}
            onChange={onChange}
          />
        </CalendarConfigProvider>,
      );
      const yearControlButtonElement = getByTextWithHost('2021');

      act(() => {
        fireEvent.click(yearControlButtonElement);
      });

      const testButtonElement = getByTextWithHost('2020');

      expect(testButtonElement).toBeInstanceOf(HTMLButtonElement);

      act(() => {
        fireEvent.click(testButtonElement!);
      });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should invoke onChange when not swithing years or months on both calendar and time panel', () => {
      const referenceDate = '2021-12-15';
      const onChange = jest.fn();

      const { getAllByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePickerPanel
            open
            referenceDate={referenceDate}
            onChange={onChange}
          />
        </CalendarConfigProvider>,
      );

      const buttonElements = document.querySelectorAll('.mzn-calendar-button');
      const testCalendarButtonElement =
        buttonElements?.[buttonElements.length - 1];
      const [testTimeButtonElement] = getAllByText('00');

      expect(testCalendarButtonElement).toBeInstanceOf(HTMLButtonElement);

      act(() => {
        fireEvent.click(testCalendarButtonElement!);
      });

      expect(onChange).toBeCalledTimes(1);
      onChange.mockClear();

      act(() => {
        fireEvent.click(testTimeButtonElement!);
      });

      expect(onChange).toBeCalledTimes(1);
    });
  });
});
