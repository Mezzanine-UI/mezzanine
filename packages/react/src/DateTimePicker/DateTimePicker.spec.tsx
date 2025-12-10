/* global document */
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import moment from 'moment';
import {
  cleanup,
  render,
  act,
  fireEvent,
  waitFor,
  getByText,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { CalendarConfigProvider } from '../Calendar';
import DateTimePicker from '.';

describe('<DateTimePicker />', () => {
  Element.prototype.scrollTo = () => {};

  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateTimePicker ref={ref} referenceDate="2022-01-02" />
      </CalendarConfigProvider>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateTimePicker className={className} referenceDate="2022-01-02" />
      </CalendarConfigProvider>,
    ),
  );

  describe('panel toggle', () => {
    it('should open calendar panel when left (date) input focused', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');
      const dateInput = inputElements[0];

      expect(dateInput).toBeInstanceOf(HTMLInputElement);
      expect(document.querySelector('.mzn-calendar')).toBe(null);

      await waitFor(() => {
        fireEvent.focus(dateInput);
      });

      expect(document.querySelector('.mzn-calendar')).toBeInstanceOf(
        HTMLDivElement,
      );
    });

    it('should open time panel when right (time) input focused', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');
      const timeInput = inputElements[1];

      expect(timeInput).toBeInstanceOf(HTMLInputElement);
      expect(document.querySelector('.mzn-time-panel')).toBe(null);

      await waitFor(() => {
        fireEvent.focus(timeInput);
      });

      expect(document.querySelector('.mzn-time-panel')).toBeInstanceOf(
        HTMLDivElement,
      );
    });

    it('should not open panel if readOnly', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker readOnly />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');
      const dateInput = inputElements[0];
      const timeInput = inputElements[1];

      await waitFor(() => {
        fireEvent.click(dateInput);
      });

      expect(document.querySelector('.mzn-calendar')).toBe(null);

      await waitFor(() => {
        fireEvent.click(timeInput);
      });

      expect(document.querySelector('.mzn-time-panel')).toBe(null);
    });

    it('should toggle calendar panel when calendar icon clicked', async () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const calendarIcon = element.querySelector('[data-icon-name="calendar"]');

      expect(calendarIcon).toBeInstanceOf(HTMLElement);

      await waitFor(() => {
        fireEvent.click(calendarIcon!);
      });

      expect(document.querySelector('.mzn-calendar')).toBeInstanceOf(
        HTMLDivElement,
      );

      await waitFor(() => {
        fireEvent.click(calendarIcon!);
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-calendar')).toBe(null);
    });

    it('should toggle time panel when clock icon clicked', async () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const clockIcon = element.querySelector('[data-icon-name="clock"]');

      expect(clockIcon).toBeInstanceOf(HTMLElement);

      await waitFor(() => {
        fireEvent.click(clockIcon!);
      });

      expect(document.querySelector('.mzn-time-panel')).toBeInstanceOf(
        HTMLDivElement,
      );

      await waitFor(() => {
        fireEvent.click(clockIcon!);
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-time-panel')).toBe(null);
    });

    it('should close panel when escape key down', async () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');
      const dateInput = inputElements[0];

      await waitFor(() => {
        fireEvent.focus(dateInput);
      });

      expect(document.querySelector('.mzn-calendar')).toBeInstanceOf(
        HTMLDivElement,
      );

      await waitFor(() => {
        fireEvent.keyDown(document, { key: 'Escape' });
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-calendar')).toBe(null);
    });

    describe('prop: onPanelToggle', () => {
      it('should get open state and focused input in its argument', async () => {
        const onPanelToggle = jest.fn();
        const { getHostHTMLElement } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DateTimePicker onPanelToggle={onPanelToggle} />
          </CalendarConfigProvider>,
        );

        const element = getHostHTMLElement();
        const inputElements = element.getElementsByTagName('input');
        const dateInput = inputElements[0];

        await waitFor(() => {
          fireEvent.focus(dateInput);
        });

        expect(onPanelToggle).toHaveBeenCalledWith(true, 'left');
        onPanelToggle.mockClear();

        await waitFor(() => {
          fireEvent.keyDown(document, { key: 'Escape' });
        });

        expect(onPanelToggle).toHaveBeenCalledWith(false, null);
      });

      it('should not be invoked if readOnly', async () => {
        const onPanelToggle = jest.fn();
        const { getHostHTMLElement } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DateTimePicker onPanelToggle={onPanelToggle} readOnly />
          </CalendarConfigProvider>,
        );

        const element = getHostHTMLElement();
        const inputElements = element.getElementsByTagName('input');
        const dateInput = inputElements[0];

        await waitFor(() => {
          fireEvent.click(dateInput);
        });

        expect(onPanelToggle).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('panel picking', () => {
    it('should update date input value when calendar date clicked', async () => {
      jest.useFakeTimers();
      const referenceDate = '2021-10-20';
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker referenceDate={referenceDate} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');
      const dateInput = inputElements[0];

      await waitFor(() => {
        fireEvent.focus(dateInput);
      });

      const [calendarElement] = document.getElementsByClassName('mzn-calendar');
      const cellElement = getByText(calendarElement as HTMLElement, '15');

      await waitFor(() => {
        fireEvent.click(cellElement);
      });

      act(() => {
        jest.runAllTimers();
      });

      // After clicking calendar date, the date input should show the selected date
      expect(dateInput.value).toBe('2021-10-15');

      // And time panel should be opened (focus moved to time input)
      expect(document.querySelector('.mzn-time-panel')).toBeInstanceOf(
        HTMLDivElement,
      );
    });
  });

  describe('prop: clearable', () => {
    it('should clear input values when clear icon clicked', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker
            clearable
            onChange={onChange}
            value="2021-10-20T12:00:00"
          />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();

      await waitFor(() => {
        fireEvent.mouseOver(element);
      });

      await waitFor(() => {
        const clearIconElement = element.querySelector(
          'button[aria-label="Close"]',
        );

        fireEvent.click(clearIconElement!);
      });

      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });

  describe('prop: onChange', () => {
    it('should be invoked when date is selected from calendar and time has value', async () => {
      jest.useFakeTimers();
      const onChange = jest.fn();
      const referenceDate = '2021-10-20';
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker
            onChange={onChange}
            referenceDate={referenceDate}
            value="2021-10-01T09:00:00"
          />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');
      const dateInput = inputElements[0];

      await waitFor(() => {
        fireEvent.focus(dateInput);
      });

      const [calendarElement] = document.getElementsByClassName('mzn-calendar');
      const cellElement = getByText(calendarElement as HTMLElement, '15');

      await waitFor(() => {
        fireEvent.click(cellElement);
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('prop: referenceDate', () => {
    it('should use pass-in referenceDate as initial referenceDate', async () => {
      const referenceDate = '2021-10-20';

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker referenceDate={referenceDate} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');
      const dateInput = inputElements[0];

      await waitFor(() => {
        fireEvent.focus(dateInput);
      });

      const [calendarElement] = document.getElementsByClassName('mzn-calendar');

      expect(getByText(calendarElement as HTMLElement, 'Oct')).toBeInstanceOf(
        HTMLButtonElement,
      );
      expect(getByText(calendarElement as HTMLElement, '2021')).toBeInstanceOf(
        HTMLButtonElement,
      );
    });

    it('should use defaultValue as referenceDate if referenceDate prop is not provided', async () => {
      const defaultValue = '2021-10-20T12:00:00';

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker defaultValue={defaultValue} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');
      const dateInput = inputElements[0];

      await waitFor(() => {
        fireEvent.focus(dateInput);
      });

      const [calendarElement] = document.getElementsByClassName('mzn-calendar');

      expect(getByText(calendarElement as HTMLElement, 'Oct')).toBeInstanceOf(
        HTMLButtonElement,
      );
      expect(getByText(calendarElement as HTMLElement, '2021')).toBeInstanceOf(
        HTMLButtonElement,
      );
    });

    it('should by default set to today', async () => {
      const { getMonthShortName, getYear } = CalendarMethodsMoment;
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');
      const dateInput = inputElements[0];

      await waitFor(() => {
        fireEvent.focus(dateInput);
      });

      const [calendarElement] = document.getElementsByClassName('mzn-calendar');

      expect(
        getByText(
          calendarElement as HTMLElement,
          getMonthShortName(moment().month(), 'en-US'),
        ),
      ).toBeInstanceOf(HTMLButtonElement);
      expect(
        getByText(
          calendarElement as HTMLElement,
          getYear(moment().toISOString()),
        ),
      ).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('dual input layout', () => {
    it('should render two input fields for date and time', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');

      expect(inputElements).toHaveLength(2);
    });

    it('should render separator between inputs', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const separator = element.querySelector('.mzn-picker__separator');

      expect(separator).toBeInstanceOf(HTMLDivElement);
    });

    it('should render both calendar and clock icons', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const calendarIcon = element.querySelector('[data-icon-name="calendar"]');
      const clockIcon = element.querySelector('[data-icon-name="clock"]');

      expect(calendarIcon).toBeInstanceOf(HTMLElement);
      expect(clockIcon).toBeInstanceOf(HTMLElement);
    });
  });
});
