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
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { CalendarConfigProvider } from '../Calendar';
import DateRangePicker, { DateRangePickerProps } from '.';

describe('<DateRangePicker />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateRangePicker ref={ref} />
      </CalendarConfigProvider>,
    ),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateRangePicker className={className} />
      </CalendarConfigProvider>,
    ),
  );

  describe('calendar toggle', () => {
    it('should open calendar when inputs focused', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement, inputToElement] = element.getElementsByTagName('input');

      expect(inputFromElement).toBeInstanceOf(HTMLInputElement);
      expect(inputToElement).toBeInstanceOf(HTMLInputElement);

      expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBe(null);

      act(() => {
        fireEvent.focus(inputFromElement);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBeInstanceOf(HTMLDivElement);
      });

      act(() => {
        fireEvent.click(document.body);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBe(null);
      });

      act(() => {
        fireEvent.focus(inputToElement);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBeInstanceOf(HTMLDivElement);
      });
    });

    it('should not open calendar if readOnly', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker readOnly />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement, inputToElement] = element.getElementsByTagName('input');

      expect(inputFromElement).toBeInstanceOf(HTMLInputElement);

      await waitFor(() => {
        fireEvent.click(inputFromElement);
      });

      expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBe(null);

      await waitFor(() => {
        fireEvent.click(inputToElement);
      });

      expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBe(null);
    });

    it('should toggle calendar when icon clicked', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const iconElement = element.querySelector('[data-icon-name="calendar"]');

      expect(iconElement).toBeInstanceOf(HTMLElement);

      act(() => {
        fireEvent.click(iconElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBeInstanceOf(HTMLDivElement);
      });

      act(() => {
        fireEvent.click(iconElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBe(null);
      });
    });

    it('should close calendar when inputTo enter key down and has valid value', async () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement, inputToElement] = element.getElementsByTagName('input');

      act(() => {
        fireEvent.focus(inputFromElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBeInstanceOf(HTMLDivElement);
      });

      act(() => {
        fireEvent.change(inputFromElement, { target: { value: '2021-10-20' } });
      });
      act(() => {
        fireEvent.change(inputToElement, { target: { value: '2021-10-21' } });
      });
      act(() => {
        fireEvent.keyDown(inputToElement, { key: 'Enter' });
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBe(null);
      });
    });

    it('should close calendar when inputFrom enter key down and has valid value', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement, inputToElement] = element.getElementsByTagName('input');

      act(() => {
        fireEvent.focus(inputToElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBeInstanceOf(HTMLDivElement);
      });

      act(() => {
        fireEvent.change(inputToElement, { target: { value: '2021-10-21' } });
      });
      act(() => {
        fireEvent.change(inputFromElement, { target: { value: '2021-10-20' } });
      });
      act(() => {
        fireEvent.keyDown(inputFromElement, { key: 'Enter' });
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBe(null);
      });
    });

    it('should close calendar when click away', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement] = element.getElementsByTagName('input');

      act(() => {
        fireEvent.focus(inputFromElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBeInstanceOf(HTMLDivElement);
      });

      act(() => {
        fireEvent.click(document);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBe(null);
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

      act(() => {
        fireEvent.focus(inputFromElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBeInstanceOf(HTMLDivElement);
      });

      act(() => {
        fireEvent.keyDown(document, { key: 'Escape' });
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBe(null);
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

      act(() => {
        fireEvent.focus(inputToElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBeInstanceOf(HTMLDivElement);
      });

      act(() => {
        inputToElement.focus();
      });

      act(() => {
        fireEvent.keyDown(document, { key: 'Tab' });
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBe(null);
      });
    });

    it('should close calendar on a case when inputTo has value and calendar clicked to have valid value', async () => {
      const referenceDate = '2021-10-01';
      const { getHostHTMLElement, getAllByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker referenceDate={referenceDate} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [, inputToElement] = element.getElementsByTagName('input');

      act(() => {
        fireEvent.focus(inputToElement!);
      });

      act(() => {
        fireEvent.change(inputToElement!, { target: { value: '2021-10-21' } });
      });

      const testCalendarCellElement = getAllByText('20')[0];

      act(() => {
        fireEvent.click(testCalendarCellElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBe(null);
      });
    });

    // eslint-disable-next-line max-len
    it('should close calendar on a case when inputFrom has value and calendar clicked to have valid value', async () => {
      const referenceDate = '2021-10-01';
      const { getHostHTMLElement, getAllByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker referenceDate={referenceDate} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement] = element.getElementsByTagName('input');

      act(() => {
        fireEvent.focus(inputFromElement!);
      });

      act(() => {
        fireEvent.change(inputFromElement!, { target: { value: '2021-10-20' } });
      });

      const testCalendarCellElement = getAllByText('21')[0];

      act(() => {
        fireEvent.click(testCalendarCellElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-date-range-picker-calendar-group')).toBe(null);
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

        await waitFor(() => {
          fireEvent.focus(inputFromElement!);
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
            <DateRangePicker referenceDate="2022-01-02" onCalendarToggle={onCalendarToggle} readOnly />
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
      const referenceDate = '2021-10-20';
      const {
        getHostHTMLElement,
        getAllByText: getAllByTextWithHostElement,
      } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker referenceDate={referenceDate} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement, inputToElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputFromElement);
      });

      const [firstCellElemet] = getAllByTextWithHostElement('15');
      const [, secondCellElement] = getAllByTextWithHostElement('17');

      await waitFor(() => {
        fireEvent.click(firstCellElemet);
      });

      await waitFor(() => {
        fireEvent.click(secondCellElement);
      });

      expect(inputFromElement.value).toBe('2021-10-15');
      expect(inputToElement.value).toBe('2021-11-17');
    });

    it('should select both from and to if re-opening the calendar', async () => {
      const referenceDate = '2021-10-20';
      const {
        getHostHTMLElement,
        getAllByText: getAllByTextWithHostElement,
      } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker referenceDate={referenceDate} />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const [inputFromElement, inputToElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputFromElement);
      });

      const [firstCellElemet] = getAllByTextWithHostElement('15');
      const [, secondCellElement] = getAllByTextWithHostElement('17');

      await waitFor(() => {
        fireEvent.click(firstCellElemet);
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

      const [anotherfirstCellElemet] = getAllByTextWithHostElement('14');
      const [, anothersecondCellElement] = getAllByTextWithHostElement('16');

      await waitFor(() => {
        fireEvent.click(anotherfirstCellElemet);
      });

      await waitFor(() => {
        fireEvent.click(anothersecondCellElement);
      });

      expect(inputFromElement.value).toBe('2021-10-14');
      expect(inputToElement.value).toBe('2021-11-16');
    });
  });

  describe('guard order', () => {
    it('should clear inputTo if inputFrom has a value that is later than inputTo', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement, inputToElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.change(inputToElement!, { target: { value: '2020-10-20' } });
      });

      await waitFor(() => {
        fireEvent.change(inputFromElement!, { target: { value: '2020-10-21' } });
      });

      expect(inputToElement.value).toBe('');
    });

    it('should clear inputFrom if inputTo has a value that is prior to inputFrom', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement, inputToElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.change(inputFromElement!, { target: { value: '2020-10-21' } });
      });

      await waitFor(() => {
        fireEvent.change(inputToElement!, { target: { value: '2020-10-20' } });
      });

      expect(inputFromElement.value).toBe('');
    });
  });

  describe('guard value string format', () => {
    it('should clear input values when blured if it does not match the date format', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement, inputToElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.change(inputFromElement!, { target: { value: 'foo' } });
      });

      await waitFor(() => {
        fireEvent.blur(inputFromElement!);
      });

      expect(inputFromElement.value).toBe('');

      await waitFor(() => {
        fireEvent.change(inputToElement!, { target: { value: 'foo' } });
      });

      await waitFor(() => {
        fireEvent.blur(inputToElement!);
      });

      expect(inputToElement.value).toBe('');
    });

    it('should clear input values when escape key down if it does not match the date format', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement, inputToElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.change(inputFromElement!, { target: { value: 'foo' } });
      });

      await waitFor(() => {
        fireEvent.keyDown(inputFromElement!, { key: 'Escape' });
      });

      expect(inputFromElement.value).toBe('');

      await waitFor(() => {
        fireEvent.change(inputToElement!, { target: { value: 'foo' } });
      });

      await waitFor(() => {
        fireEvent.keyDown(inputToElement!, { key: 'Escape' });
      });

      expect(inputToElement.value).toBe('');
    });
  });

  describe('prop: clearable', () => {
    it('should clear values when clear icon clicked', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker onChange={onChange} clearable />
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
    it('should bind focus, blur, keydown events to inputFrom element', async () => {
      const onKeyDown = jest.fn();
      const onBlur = jest.fn();
      const onFocus = jest.fn();
      const inputFromProps: DateRangePickerProps['inputFromProps'] = {
        onKeyDown,
        onBlur,
        onFocus,
      };

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker inputFromProps={inputFromProps} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputFromElement!);
      });

      expect(onFocus).toBeCalledTimes(1);
      expect(onFocus).toBeCalledWith(expect.objectContaining({
        target: inputFromElement,
      }));

      await waitFor(() => {
        fireEvent.keyDown(inputFromElement!);
      });

      expect(onKeyDown).toBeCalledTimes(1);
      expect(onKeyDown).toBeCalledWith(expect.objectContaining({
        target: inputFromElement,
      }));

      await waitFor(() => {
        fireEvent.blur(inputFromElement!);
      });

      expect(onBlur).toBeCalledTimes(1);
      expect(onBlur).toBeCalledWith(expect.objectContaining({
        target: inputFromElement,
      }));
    });

    it('should bind focus, blur, keydown events to inputTo element', async () => {
      const onKeyDown = jest.fn();
      const onBlur = jest.fn();
      const onFocus = jest.fn();
      const inputToProps: DateRangePickerProps['inputToProps'] = {
        onKeyDown,
        onBlur,
        onFocus,
      };

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker inputToProps={inputToProps} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [, inputToElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputToElement!);
      });

      expect(onFocus).toBeCalledTimes(1);
      expect(onFocus).toBeCalledWith(expect.objectContaining({
        target: inputToElement,
      }));

      await waitFor(() => {
        fireEvent.keyDown(inputToElement!);
      });

      expect(onKeyDown).toBeCalledTimes(1);
      expect(onKeyDown).toBeCalledWith(expect.objectContaining({
        target: inputToElement,
      }));

      await waitFor(() => {
        fireEvent.blur(inputToElement!);
      });

      expect(onBlur).toBeCalledTimes(1);
      expect(onBlur).toBeCalledWith(expect.objectContaining({
        target: inputToElement,
      }));
    });
  });

  describe('prop: onChange', () => {
    it('should be invoked when click away and has valid value', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker onChange={onChange} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement, inputToElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputFromElement!);
      });

      await waitFor(() => {
        fireEvent.change(inputFromElement!, { target: { value: '2021-10-20' } });
      });

      await waitFor(() => {
        fireEvent.change(inputToElement!, { target: { value: '2021-10-21' } });
      });

      await waitFor(() => {
        fireEvent.click(document.body);
      });

      expect(onChange).toBeCalledTimes(1);
    });

    it('should be invoked when range selected via calendar', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement, getAllByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker onChange={onChange} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement!);
      });

      const testCellFromElement = getAllByText('15')[0];
      const testCellToElement = getAllByText('17')[1];

      await waitFor(() => {
        fireEvent.click(testCellFromElement!);
      });

      await waitFor(() => {
        fireEvent.click(testCellToElement!);
      });

      expect(onChange).toBeCalledTimes(1);
    });

    it('should be invoked when using tab to remove focus and has valid value', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <>
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DateRangePicker onChange={onChange} />
          </CalendarConfigProvider>
          <input />
        </>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement, inputToElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputToElement!);
      });

      await waitFor(() => {
        fireEvent.change(inputFromElement!, { target: { value: '2021-10-20' } });
      });

      await waitFor(() => {
        fireEvent.change(inputToElement!, { target: { value: '2021-10-21' } });
      });

      await waitFor(() => {
        inputToElement.focus();
        fireEvent.keyDown(document, { key: 'Tab' });
      });

      expect(onChange).toBeCalledTimes(1);
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

      const [leftCalendarElement, rightCalendarElement] = document.getElementsByClassName('mzn-calendar');

      expect(getByText(leftCalendarElement as HTMLElement, 'Oct')).toBeInstanceOf(HTMLButtonElement);
      expect(getByText(leftCalendarElement as HTMLElement, '2021')).toBeInstanceOf(HTMLButtonElement);

      expect(getByText(rightCalendarElement as HTMLElement, 'Nov')).toBeInstanceOf(HTMLButtonElement);
      expect(getByText(rightCalendarElement as HTMLElement, '2021')).toBeInstanceOf(HTMLButtonElement);
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

      const [leftCalendarElement, rightCalendarElement] = document.getElementsByClassName('mzn-calendar');

      expect(getByText(leftCalendarElement as HTMLElement, 'Oct')).toBeInstanceOf(HTMLButtonElement);
      expect(getByText(leftCalendarElement as HTMLElement, '2021')).toBeInstanceOf(HTMLButtonElement);

      expect(getByText(rightCalendarElement as HTMLElement, 'Nov')).toBeInstanceOf(HTMLButtonElement);
      expect(getByText(rightCalendarElement as HTMLElement, '2021')).toBeInstanceOf(HTMLButtonElement);
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

      const [leftCalendarElement, rightCalendarElement] = document.getElementsByClassName('mzn-calendar');

      expect(
        getByText(leftCalendarElement as HTMLElement, getMonthShortName(moment().month(), 'en-US')),
      ).toBeInstanceOf(HTMLButtonElement);
      expect(
        getByText(leftCalendarElement as HTMLElement, getYear(moment().toISOString())),
      ).toBeInstanceOf(HTMLButtonElement);

      expect(
        getByText(rightCalendarElement as HTMLElement, getMonthShortName(moment().add(1, 'month').month(), 'en-US')),
      ).toBeInstanceOf(HTMLButtonElement);
      expect(
        getByText(rightCalendarElement as HTMLElement, getYear(moment().add(1, 'month').toISOString())),
      ).toBeInstanceOf(HTMLButtonElement);
    });
  });
});
