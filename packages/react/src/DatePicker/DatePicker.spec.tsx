import moment from 'moment';
import { CalendarMethodsMoment } from '@mezzanine-ui/core/calendar';
import {
  cleanup,
  cleanupHook,
  fireEvent,
  render,
  waitFor,
  act,
  getByText,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement, describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { CalendarConfigProvider } from '../Calendar';
import DatePicker, { DatePickerProps } from '.';

describe('<DatePicker />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DatePicker ref={ref} />
      </CalendarConfigProvider>,
    ),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DatePicker className={className} />
      </CalendarConfigProvider>,
    ),
  );

  describe('calendar toggle', () => {
    it('should open calendar when input focused', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      expect(inputElement).toBeInstanceOf(HTMLInputElement);
      expect(document.querySelector('.mzn-calendar')).toBe(null);

      waitFor(() => {
        fireEvent.focus(inputElement);
      });

      expect(document.querySelector('.mzn-calendar')).toBeInstanceOf(HTMLDivElement);
    });

    it('should not open calendar if readOnly', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePicker readOnly />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      expect(inputElement).toBeInstanceOf(HTMLInputElement);

      waitFor(() => {
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

      expect(document.querySelector('.mzn-calendar')).toBeInstanceOf(HTMLDivElement);

      await waitFor(() => {
        fireEvent.click(iconElement!);
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-calendar')).toBe(null);
    });

    it('should close calendar when enter key down', async () => {
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

      expect(document.querySelector('.mzn-calendar')).toBeInstanceOf(HTMLDivElement);

      await waitFor(() => {
        fireEvent.keyDown(inputElement, { key: 'Enter' });
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-calendar')).toBe(null);
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

      expect(document.querySelector('.mzn-calendar')).toBeInstanceOf(HTMLDivElement);

      await waitFor(() => {
        fireEvent.keyDown(document, { key: 'Escape' });
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-calendar')).toBe(null);
    });

    it('should close calendar when tab key down', async () => {
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

      expect(document.querySelector('.mzn-calendar')).toBeInstanceOf(HTMLDivElement);

      await waitFor(() => {
        inputElement.focus();
        fireEvent.keyDown(document, { key: 'Tab' });
      });

      await waitFor(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-calendar')).toBe(null);
    });

    describe('prop: onCalendarToggle', () => {
      it('should get open state in its arguement', async () => {
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

        expect(onCalendarToggle).toBeCalledWith(true);
        onCalendarToggle.mockClear();

        await waitFor(() => {
          fireEvent.keyDown(document, { key: 'Escape' });
        });

        expect(onCalendarToggle).toBeCalledWith(false);
      });

      it('should not be invoked if readOnly', () => {
        const onCalendarToggle = jest.fn();
        const { getHostHTMLElement } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DatePicker referenceDate={moment()} onCalendarToggle={onCalendarToggle} readOnly />
          </CalendarConfigProvider>,
        );

        const element = getHostHTMLElement();
        const [inputElement] = element.getElementsByTagName('input');

        waitFor(() => {
          fireEvent.click(inputElement!);
        });

        expect(onCalendarToggle).toBeCalledTimes(0);
      });
    });
  });

  describe('calendar picking', () => {
    it('should update input value', async () => {
      const referenceDate = moment('2021-10-20');
      const {
        getHostHTMLElement,
        getByText: getByTextWithHostElement,
      } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePicker referenceDate={referenceDate} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement);
      });

      const cellElemet = getByTextWithHostElement('15');

      await waitFor(() => {
        fireEvent.click(cellElemet);
      });

      expect(inputElement.value).toBe('2021-10-15');
    });
  });

  describe('guard value string format', () => {
    it('should clear input values when blured if it does not match the date format', async () => {
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

      expect(onChange).toBeCalledTimes(1);
    });

    it('should be invoked when enter key down', async () => {
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
        fireEvent.change(inputElement, { target: { value: '2021-10-20' } });
      });

      await waitFor(() => {
        fireEvent.keyDown(inputElement, { key: 'Enter' });
      });

      expect(onChange).toBeCalledTimes(1);
    });

    it('should be invoked when calendar cell clicked', async () => {
      const onChange = jest.fn();
      const {
        getHostHTMLElement,
        getByText: getByTextWithHostElement,
      } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePicker onChange={onChange} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement!);
      });

      const testCellElement = getByTextWithHostElement('15');

      await waitFor(() => {
        fireEvent.click(testCellElement!);
      });

      expect(onChange).toBeCalledTimes(1);
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

      expect(onChange).toBeCalledTimes(1);
    });
  });

  describe('prop: clearable', () => {
    it('should by default clear input value', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePicker clearable />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.change(inputElement!, { target: { value: '2021-10-20' } });
      });

      await waitFor(() => {
        inputElement.focus();

        const clearIconElement = element.querySelector('[data-icon-name="times"]');

        fireEvent.click(clearIconElement!);
      });

      expect(inputElement.value).toBe('');
    });

    it('should clear values when clear icon clicked', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DatePicker onChange={onChange} clearable />
        </CalendarConfigProvider>,
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
        fireEvent.mouseOver(element!);
      });

      await waitFor(() => {
        const clearIconElement = element.querySelector('[data-icon-name="times"]');

        fireEvent.click(clearIconElement!);
      });

      expect(onChange).toBeCalledTimes(1);
    });
  });

  describe('prop: inputProps', () => {
    it('should bind focus, blur, keydown events to input element', async () => {
      const onKeyDown = jest.fn();
      const onBlur = jest.fn();
      const onFocus = jest.fn();
      const inputProps: DatePickerProps['inputProps'] = {
        onKeyDown,
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

      expect(onFocus).toBeCalledTimes(1);
      expect(onFocus).toBeCalledWith(expect.objectContaining({
        target: inputElement,
      }));

      await waitFor(() => {
        fireEvent.keyDown(inputElement!);
      });

      expect(onKeyDown).toBeCalledTimes(1);
      expect(onKeyDown).toBeCalledWith(expect.objectContaining({
        target: inputElement,
      }));

      await waitFor(() => {
        fireEvent.blur(inputElement!);
      });

      expect(onBlur).toBeCalledTimes(1);
      expect(onBlur).toBeCalledWith(expect.objectContaining({
        target: inputElement,
      }));
    });
  });

  describe('prop: referenceDate', () => {
    it('should use pass-in referenceDate as initial referenceDate', async () => {
      const referenceDate = moment('2021-10-20');

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

      const [calendarElement] = document.getElementsByClassName('mzn-calendar');

      expect(getByText(calendarElement as HTMLElement, 'Oct')).toBeInstanceOf(HTMLButtonElement);
      expect(getByText(calendarElement as HTMLElement, '2021')).toBeInstanceOf(HTMLButtonElement);
    });

    it('should use defaultValue as referenceDate if referenceDate prop is not provided', async () => {
      const defaultValue = moment('2021-10-20');

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

      const [calendarElement] = document.getElementsByClassName('mzn-calendar');

      expect(getByText(calendarElement as HTMLElement, 'Oct')).toBeInstanceOf(HTMLButtonElement);
      expect(getByText(calendarElement as HTMLElement, '2021')).toBeInstanceOf(HTMLButtonElement);
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

      const [calendarElementt] = document.getElementsByClassName('mzn-calendar');

      expect(
        getByText(calendarElementt as HTMLElement, getMonthShortName(moment().month(), 'en-US')),
      ).toBeInstanceOf(HTMLButtonElement);
      expect(
        getByText(calendarElementt as HTMLElement, getYear(moment())),
      ).toBeInstanceOf(HTMLButtonElement);
    });
  });
});
