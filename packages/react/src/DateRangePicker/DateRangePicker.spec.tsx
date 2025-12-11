/* global document */
import moment from 'moment';
import { DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import {
  act,
  cleanup,
  cleanupHook,
  fireEvent,
  render,
  waitFor,
  getByText,
} from '../../__test-utils__';
import { CalendarConfigProvider } from '../Calendar';
import DateRangePicker from '.';

describe('<DateRangePicker />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  it('should forward ref to host element', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateRangePicker ref={ref} />
      </CalendarConfigProvider>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('should append className to host element', () => {
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateRangePicker className="foo" />
      </CalendarConfigProvider>,
    );

    const element = getHostHTMLElement();

    expect(element.classList.contains('foo')).toBe(true);
  });

  describe('calendar toggle', () => {
    // Helper function to get the RangeCalendar popup
    const getRangeCalendar = () =>
      document.querySelector('[aria-label^="Range calendar"]');

    it('should open calendar when inputs focused', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement, inputToElement] =
        element.getElementsByTagName('input');

      expect(inputFromElement).toBeInstanceOf(HTMLInputElement);
      expect(inputToElement).toBeInstanceOf(HTMLInputElement);

      expect(getRangeCalendar()).toBe(null);

      await act(async () => {
        fireEvent.focus(inputFromElement);
      });

      await waitFor(() => {
        expect(getRangeCalendar()).toBeInstanceOf(HTMLDivElement);
      });

      await act(async () => {
        fireEvent.click(document.body);
      });

      await waitFor(() => {
        expect(getRangeCalendar()).toBe(null);
      });

      await act(async () => {
        fireEvent.focus(inputToElement);
      });

      await waitFor(() => {
        expect(getRangeCalendar()).toBeInstanceOf(HTMLDivElement);
      });
    });

    it('should not open calendar if readOnly', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker readOnly />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement, inputToElement] =
        element.getElementsByTagName('input');

      expect(inputFromElement).toBeInstanceOf(HTMLInputElement);

      await act(async () => {
        fireEvent.click(inputFromElement);
      });

      expect(getRangeCalendar()).toBe(null);

      await act(async () => {
        fireEvent.click(inputToElement);
      });

      expect(getRangeCalendar()).toBe(null);
    });

    it('should close calendar when click away', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement] = element.getElementsByTagName('input');

      await act(async () => {
        fireEvent.focus(inputFromElement!);
      });

      await waitFor(() => {
        expect(getRangeCalendar()).toBeInstanceOf(HTMLDivElement);
      });

      await act(async () => {
        fireEvent.click(document);
      });

      await waitFor(() => {
        expect(getRangeCalendar()).toBe(null);
      });
    });

    it('should close calendar when escape key down', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement] = element.getElementsByTagName('input');

      await act(async () => {
        fireEvent.focus(inputFromElement!);
      });

      await waitFor(() => {
        expect(getRangeCalendar()).toBeInstanceOf(HTMLDivElement);
      });

      await act(async () => {
        fireEvent.keyDown(document, { key: 'Escape' });
      });

      await waitFor(() => {
        expect(getRangeCalendar()).toBe(null);
      });
    });

    it('should close calendar when tab key down on inputTo element', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [, inputToElement] = element.getElementsByTagName('input');

      await act(async () => {
        fireEvent.focus(inputToElement!);
      });

      await waitFor(() => {
        expect(getRangeCalendar()).toBeInstanceOf(HTMLDivElement);
      });

      await act(async () => {
        inputToElement.focus();
      });

      await act(async () => {
        fireEvent.keyDown(document, { key: 'Tab' });
      });

      await waitFor(() => {
        expect(getRangeCalendar()).toBe(null);
      });
    });

    describe('prop: onCalendarToggle', () => {
      it('should get open state in its arguement', async () => {
        const onCalendarToggle = jest.fn();
        const { getHostHTMLElement } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DateRangePicker onCalendarToggle={onCalendarToggle} />
          </CalendarConfigProvider>,
        );

        const element = getHostHTMLElement();
        const [inputFromElement] = element.getElementsByTagName('input');

        await act(async () => {
          fireEvent.focus(inputFromElement!);
        });

        expect(onCalendarToggle).toHaveBeenCalledWith(true);
        onCalendarToggle.mockClear();

        await act(async () => {
          fireEvent.keyDown(document, { key: 'Escape' });
        });

        expect(onCalendarToggle).toHaveBeenCalledWith(false);
      });

      it('should not be invoked if readOnly', async () => {
        const onCalendarToggle = jest.fn();
        const { getHostHTMLElement } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DateRangePicker
              onCalendarToggle={onCalendarToggle}
              readOnly
              referenceDate="2022-01-02"
            />
          </CalendarConfigProvider>,
        );

        const element = getHostHTMLElement();
        const [inputElement] = element.getElementsByTagName('input');

        await act(async () => {
          fireEvent.click(inputElement!);
        });

        expect(onCalendarToggle).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('calendar picking', () => {
    it('should update input value by clicking on calendar cells', async () => {
      const referenceDate = '2021-10-20';
      const { getHostHTMLElement, getAllByText: getAllByTextWithHostElement } =
        render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DateRangePicker referenceDate={referenceDate} />
          </CalendarConfigProvider>,
        );

      const element = getHostHTMLElement();
      const [inputFromElement, inputToElement] =
        element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputFromElement);
      });

      const [firstCellElement] = getAllByTextWithHostElement('15');
      const [, secondCellElement] = getAllByTextWithHostElement('17');

      await waitFor(() => {
        fireEvent.click(firstCellElement);
      });

      await waitFor(() => {
        fireEvent.click(secondCellElement);
      });

      expect(inputFromElement.value).toBe('2021-10-15');
      expect(inputToElement.value).toBe('2021-11-17');
    });

    it('should select both from and to if re-opening the calendar', async () => {
      const referenceDate = '2021-10-20';
      const { getHostHTMLElement, getAllByText: getAllByTextWithHostElement } =
        render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DateRangePicker referenceDate={referenceDate} />
          </CalendarConfigProvider>,
        );

      const element = getHostHTMLElement();
      const [inputFromElement, inputToElement] =
        element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputFromElement);
      });

      const [firstCellElement] = getAllByTextWithHostElement('15');
      const [, secondCellElement] = getAllByTextWithHostElement('17');

      await waitFor(() => {
        fireEvent.click(firstCellElement);
      });

      await waitFor(() => {
        fireEvent.click(secondCellElement);
      });

      expect(inputFromElement.value).toBe('2021-10-15');
      expect(inputToElement.value).toBe('2021-11-17');

      // open again
      await waitFor(() => {
        fireEvent.focus(inputFromElement);
      });

      const [anotherFirstCellElement] = getAllByTextWithHostElement('14');
      const [, anotherSecondCellElement] = getAllByTextWithHostElement('16');

      await waitFor(() => {
        fireEvent.click(anotherFirstCellElement);
      });

      await waitFor(() => {
        fireEvent.click(anotherSecondCellElement);
      });

      expect(inputFromElement.value).toBe('2021-10-14');
      expect(inputToElement.value).toBe('2021-11-16');
    });
  });

  describe('prop: clearable', () => {
    it('should clear values when clear icon clicked', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker
            clearable
            onChange={onChange}
            value={['2021-10-20', '2021-10-21']}
          />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const clearButton = element.querySelector('.mzn-clear-actions');

      expect(clearButton).toBeInstanceOf(HTMLElement);

      await act(async () => {
        fireEvent.click(clearButton!);
      });

      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });

  describe('prop: disabled', () => {
    it('should have disabled class when disabled', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker disabled />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-text-field--disabled')).toBe(true);
    });
  });

  describe('prop: error', () => {
    it('should have error class when error', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker error />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-text-field--error')).toBe(true);
    });
  });

  describe('prop: onChange', () => {
    it('should be invoked when range selection is complete', async () => {
      const onChange = jest.fn();
      const referenceDate = '2021-10-01';
      const { getHostHTMLElement, getAllByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker onChange={onChange} referenceDate={referenceDate} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement] = element.getElementsByTagName('input');

      act(() => {
        fireEvent.focus(inputFromElement);
      });

      const firstCellElement = getAllByText('15')[0];
      const secondCellElement = getAllByText('20')[1];

      act(() => {
        fireEvent.click(firstCellElement);
      });

      act(() => {
        fireEvent.click(secondCellElement);
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });

      const calledValue = onChange.mock.calls[0][0];

      expect(Array.isArray(calledValue)).toBe(true);
      expect(calledValue.length).toBe(2);
    });
  });

  describe('prop: value', () => {
    it('should display controlled value', () => {
      const value: [DateType, DateType] = ['2021-10-20', '2021-10-25'];
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker value={value} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement, inputToElement] =
        element.getElementsByTagName('input');

      expect(inputFromElement.value).toBe('2021-10-20');
      expect(inputToElement.value).toBe('2021-10-25');
    });
  });

  describe('prop: referenceDate', () => {
    it('should use pass-in referenceDate as initial referenceDate', async () => {
      const referenceDate = '2021-10-20';

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker referenceDate={referenceDate} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement);
      });

      // Get internal calendars (with mzn-calendar--no-shadow class)
      const internalCalendars = document.querySelectorAll(
        '.mzn-calendar--no-shadow',
      );

      expect(internalCalendars.length).toBe(2);

      const [leftCalendarElement, rightCalendarElement] =
        Array.from(internalCalendars);

      expect(
        getByText(leftCalendarElement as HTMLElement, 'Oct'),
      ).toBeInstanceOf(HTMLButtonElement);
      expect(
        getByText(leftCalendarElement as HTMLElement, '2021'),
      ).toBeInstanceOf(HTMLButtonElement);

      expect(
        getByText(rightCalendarElement as HTMLElement, 'Nov'),
      ).toBeInstanceOf(HTMLButtonElement);
      expect(
        getByText(rightCalendarElement as HTMLElement, '2021'),
      ).toBeInstanceOf(HTMLButtonElement);
    });

    it('should use defaultValue as referenceDate if referenceDate prop is not provided', async () => {
      const defaultValue: [DateType, DateType] = ['2021-10-20', '2021-11-20'];

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker defaultValue={defaultValue} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement);
      });

      // Get internal calendars (with mzn-calendar--no-shadow class)
      const internalCalendars = document.querySelectorAll(
        '.mzn-calendar--no-shadow',
      );

      expect(internalCalendars.length).toBe(2);

      const [leftCalendarElement, rightCalendarElement] =
        Array.from(internalCalendars);

      expect(
        getByText(leftCalendarElement as HTMLElement, 'Oct'),
      ).toBeInstanceOf(HTMLButtonElement);
      expect(
        getByText(leftCalendarElement as HTMLElement, '2021'),
      ).toBeInstanceOf(HTMLButtonElement);

      expect(
        getByText(rightCalendarElement as HTMLElement, 'Nov'),
      ).toBeInstanceOf(HTMLButtonElement);
      expect(
        getByText(rightCalendarElement as HTMLElement, '2021'),
      ).toBeInstanceOf(HTMLButtonElement);
    });

    it('should by default set to today', async () => {
      const { getMonthShortName, getYear } = CalendarMethodsMoment;
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement);
      });

      // Get internal calendars (with mzn-calendar--no-shadow class)
      const internalCalendars = document.querySelectorAll(
        '.mzn-calendar--no-shadow',
      );

      expect(internalCalendars.length).toBe(2);

      const [leftCalendarElement, rightCalendarElement] =
        Array.from(internalCalendars);

      expect(
        getByText(
          leftCalendarElement as HTMLElement,
          getMonthShortName(moment().month(), 'en-US'),
        ),
      ).toBeInstanceOf(HTMLButtonElement);
      expect(
        getByText(
          leftCalendarElement as HTMLElement,
          getYear(moment().toISOString()),
        ),
      ).toBeInstanceOf(HTMLButtonElement);

      expect(
        getByText(
          rightCalendarElement as HTMLElement,
          getMonthShortName(moment().add(1, 'month').month(), 'en-US'),
        ),
      ).toBeInstanceOf(HTMLButtonElement);
      expect(
        getByText(
          rightCalendarElement as HTMLElement,
          getYear(moment().add(1, 'month').toISOString()),
        ),
      ).toBeInstanceOf(HTMLButtonElement);
    });
  });
});
