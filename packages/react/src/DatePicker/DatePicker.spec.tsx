/* global document */
import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import {
  cleanup,
  cleanupHook,
  fireEvent,
  render,
  waitFor,
  act,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { CalendarConfigProvider } from '../Calendar';
import DatePicker, { DatePickerProps } from '.';

describe('<DatePicker />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DatePicker ref={ref} />
      </CalendarConfigProvider>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DatePicker className={className} />
      </CalendarConfigProvider>,
    ),
  );

  describe('calendar toggle', () => {
    it('should open calendar when input focused', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      expect(inputElement).toBeInstanceOf(HTMLInputElement);
      expect(document.querySelector('.mzn-calendar')).toBe(null);

      await waitFor(() => {
        fireEvent.focus(inputElement);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-calendar')).toBeInstanceOf(
          HTMLDivElement,
        );
      });
    });

    it('should not open calendar if readOnly', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePicker readOnly />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      expect(inputElement).toBeInstanceOf(HTMLInputElement);

      await waitFor(() => {
        fireEvent.click(inputElement);
      });

      expect(document.querySelector('.mzn-calendar')).toBe(null);
    });

    it('should toggle calendar when icon clicked', async () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const iconElement = element.querySelector('[data-icon-name="calendar"]');

      expect(iconElement).toBeInstanceOf(HTMLElement);

      await waitFor(() => {
        fireEvent.click(iconElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-calendar')).toBeInstanceOf(
          HTMLDivElement,
        );
      });

      await waitFor(() => {
        fireEvent.click(iconElement!);
      });

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-calendar')).toBe(null);
      });

      jest.useRealTimers();
    });

    it('should close calendar when escape key down', async () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-calendar')).toBeInstanceOf(
          HTMLDivElement,
        );
      });

      await waitFor(() => {
        fireEvent.keyDown(document, { key: 'Escape' });
      });

      act(() => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-calendar')).toBe(null);
      });

      jest.useRealTimers();
    });

    it('should close calendar when tab key down', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      act(() => {
        fireEvent.focus(inputElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-calendar')).toBeInstanceOf(
          HTMLDivElement,
        );
      });

      act(() => {
        inputElement.focus();
      });

      act(() => {
        fireEvent.keyDown(document, { key: 'Tab' });
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-calendar')).toBe(null);
      });
    });

    describe('prop: onCalendarToggle', () => {
      it('should get open state in its argument', async () => {
        const onCalendarToggle = jest.fn();
        const { getHostHTMLElement } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DatePicker onCalendarToggle={onCalendarToggle} />
          </CalendarConfigProvider>,
        );

        const element = getHostHTMLElement();
        const [inputElement] = element.getElementsByTagName('input');

        await waitFor(() => {
          fireEvent.focus(inputElement!);
        });

        await waitFor(() => {
          expect(onCalendarToggle).toHaveBeenCalledWith(true);
        });

        onCalendarToggle.mockClear();

        await waitFor(() => {
          fireEvent.keyDown(document, { key: 'Escape' });
        });

        await waitFor(() => {
          expect(onCalendarToggle).toHaveBeenCalledWith(false);
        });
      });

      it('should not be invoked if readOnly', async () => {
        const onCalendarToggle = jest.fn();
        const { getHostHTMLElement } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DatePicker
              referenceDate={moment().format('YYYY-MM-DD')}
              onCalendarToggle={onCalendarToggle}
              readOnly
            />
          </CalendarConfigProvider>,
        );

        const element = getHostHTMLElement();
        const [inputElement] = element.getElementsByTagName('input');

        await waitFor(() => {
          fireEvent.click(inputElement!);
        });

        expect(onCalendarToggle).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('calendar picking', () => {
    it('should update input value', async () => {
      const referenceDate = '2021-10-20';
      const { getHostHTMLElement, getByText: getByTextWithHostElement } =
        render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DatePicker referenceDate={referenceDate} />
          </CalendarConfigProvider>,
        );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-calendar')).toBeInstanceOf(
          HTMLDivElement,
        );
      });

      const cellElement = getByTextWithHostElement('15');

      await waitFor(() => {
        fireEvent.click(cellElement);
      });

      await waitFor(() => {
        expect(inputElement.value).toBe('2021-10-15');
      });
    });
  });

  describe('guard value string format', () => {
    it('should clear input values when blurred if it does not match the date format', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.change(inputElement!, { target: { value: 'foo' } });
      });

      await waitFor(() => {
        fireEvent.blur(inputElement!);
      });

      expect(inputElement.value).toBe('');
    });
  });

  describe('prop: onChange', () => {
    it('should be invoked when click away', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePicker onChange={onChange} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement!);
      });

      await waitFor(() => {
        fireEvent.click(document.body);
      });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should be invoked when calendar date is selected', async () => {
      const onChange = jest.fn();
      const referenceDate = '2021-10-20';
      const { getHostHTMLElement, getByText: getByTextWithHostElement } =
        render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DatePicker onChange={onChange} referenceDate={referenceDate} />
          </CalendarConfigProvider>,
        );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-calendar')).toBeInstanceOf(
          HTMLDivElement,
        );
      });

      const cellElement = getByTextWithHostElement('15');

      await waitFor(() => {
        fireEvent.click(cellElement);
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledTimes(1);
      });
    });

    it('should be invoked when calendar cell clicked', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement, getByText: getByTextWithHostElement } =
        render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DatePicker onChange={onChange} />
          </CalendarConfigProvider>,
        );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-calendar')).toBeInstanceOf(
          HTMLDivElement,
        );
      });

      const testCellElement = getByTextWithHostElement('15');

      await waitFor(() => {
        fireEvent.click(testCellElement!);
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledTimes(1);
      });
    });

    it('should be invoked when using tab to remove focus', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <>
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DatePicker onChange={onChange} />
          </CalendarConfigProvider>
          <input />
        </>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement!);
      });

      await waitFor(() => {
        fireEvent.change(inputElement!, { target: { value: '2021-10-20' } });
      });

      await waitFor(() => {
        inputElement.focus();
        fireEvent.keyDown(document, { key: 'Tab' });
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('prop: clearable', () => {
    it('should clear input value when clear button clicked', async () => {
      const referenceDate = '2021-10-20';
      const { getHostHTMLElement, getByText: getByTextWithHostElement } =
        render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DatePicker clearable referenceDate={referenceDate} />
          </CalendarConfigProvider>,
        );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      // Select a date first
      await waitFor(() => {
        fireEvent.focus(inputElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-calendar')).toBeInstanceOf(
          HTMLDivElement,
        );
      });

      const cellElement = getByTextWithHostElement('15');

      await waitFor(() => {
        fireEvent.click(cellElement);
      });

      await waitFor(() => {
        expect(inputElement.value).toBeTruthy();
      });

      // Now clear it
      await waitFor(() => {
        fireEvent.focus(inputElement!);

        const clearButton = element.querySelector('button[aria-label="Close"]');

        expect(clearButton).toBeInstanceOf(HTMLButtonElement);
        fireEvent.click(clearButton!);
      });

      await waitFor(() => {
        expect(inputElement.value).toBe('');
      });
    });

    it('should invoke onChange with undefined when clear button clicked', async () => {
      const onChange = jest.fn();
      const referenceDate = '2021-10-20';
      const { getHostHTMLElement, getByText: getByTextWithHostElement } =
        render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DatePicker
              onChange={onChange}
              clearable
              referenceDate={referenceDate}
            />
          </CalendarConfigProvider>,
        );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      // Select a date first
      await waitFor(() => {
        fireEvent.focus(inputElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-calendar')).toBeInstanceOf(
          HTMLDivElement,
        );
      });

      const cellElement = getByTextWithHostElement('15');

      await waitFor(() => {
        fireEvent.click(cellElement);
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledTimes(1);
      });

      onChange.mockClear();

      // Now clear it
      await waitFor(() => {
        fireEvent.focus(inputElement!);

        const clearButton = element.querySelector('button[aria-label="Close"]');

        fireEvent.click(clearButton!);
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(undefined);
      });
    });
  });

  describe('prop: inputProps', () => {
    it('should bind focus and blur events to input element', async () => {
      const onBlur = jest.fn();
      const onFocus = jest.fn();
      const inputProps: DatePickerProps['inputProps'] = {
        onBlur,
        onFocus,
      };

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePicker inputProps={inputProps} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement!);
      });

      expect(onFocus).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        fireEvent.blur(inputElement!);
      });

      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: referenceDate', () => {
    it('should use pass-in referenceDate as initial referenceDate', async () => {
      const referenceDate = '2021-10-20';

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePicker referenceDate={referenceDate} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement);
      });

      await waitFor(() => {
        const [calendarElement] =
          document.getElementsByClassName('mzn-calendar');
        const monthButton = calendarElement.querySelector(
          '.mzn-calendar-controls__main button',
        );
        const yearButton = calendarElement.querySelectorAll(
          '.mzn-calendar-controls__main button',
        )[1];

        expect(monthButton?.textContent).toBe('Oct');
        expect(yearButton?.textContent).toBe('2021');
      });
    });

    it('should use defaultValue as referenceDate if referenceDate prop is not provided', async () => {
      const defaultValue = '2021-10-20';

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePicker defaultValue={defaultValue} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement);
      });

      await waitFor(() => {
        const [calendarElement] =
          document.getElementsByClassName('mzn-calendar');
        const monthButton = calendarElement.querySelector(
          '.mzn-calendar-controls__main button',
        );
        const yearButton = calendarElement.querySelectorAll(
          '.mzn-calendar-controls__main button',
        )[1];

        expect(monthButton?.textContent).toBe('Oct');
        expect(yearButton?.textContent).toBe('2021');
      });
    });

    it('should by default set to today', async () => {
      const { getMonthShortName, getYear } = CalendarMethodsMoment;
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement);
      });

      await waitFor(() => {
        const [calendarElement] =
          document.getElementsByClassName('mzn-calendar');
        const monthButton = calendarElement.querySelector(
          '.mzn-calendar-controls__main button',
        );
        const yearButton = calendarElement.querySelectorAll(
          '.mzn-calendar-controls__main button',
        )[1];

        expect(monthButton?.textContent).toBe(
          getMonthShortName(moment().month(), 'en-us'),
        );
        expect(yearButton?.textContent).toBe(
          getYear(moment().format('YYYY-MM-DD')).toString(),
        );
      });
    });
  });
});
