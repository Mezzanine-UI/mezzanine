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
import DateTimePicker, { DateTimePickerProps } from '.';

describe('<DateTimePickerPanel />', () => {
  Element.prototype.scrollTo = () => {};

  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateTimePicker ref={ref} open referenceDate="2022-01-02" />
      </CalendarConfigProvider>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateTimePicker referenceDate="2022-01-02" className={className} />
      </CalendarConfigProvider>,
    ),
  );

  describe('panel toggle', () => {
    it('should open panel when input focused', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      expect(inputElement).toBeInstanceOf(HTMLInputElement);
      expect(document.querySelector('.mzn-time-panel')).toBe(null);

      waitFor(() => {
        fireEvent.focus(inputElement);
      });

      expect(document.querySelector('.mzn-time-panel')).toBeInstanceOf(
        HTMLDivElement,
      );
    });

    it('should not open panel if readOnly', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker readOnly />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      expect(inputElement).toBeInstanceOf(HTMLInputElement);

      waitFor(() => {
        fireEvent.click(inputElement);
      });

      expect(document.querySelector('.mzn-time-panel')).toBe(null);
    });

    it('should toggle panel when icon clicked', async () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const iconElement = element.querySelector('[data-icon-name="clock"]');

      expect(iconElement).toBeInstanceOf(HTMLElement);

      await waitFor(() => {
        fireEvent.click(iconElement!);
      });

      expect(document.querySelector('.mzn-time-panel')).toBeInstanceOf(
        HTMLDivElement,
      );

      await waitFor(() => {
        fireEvent.click(iconElement!);
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-time-panel')).toBe(null);
    });

    it('should close panel when enter key down', async () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement!);
      });

      expect(document.querySelector('.mzn-time-panel')).toBeInstanceOf(
        HTMLDivElement,
      );

      await waitFor(() => {
        fireEvent.keyDown(inputElement, { key: 'Enter' });
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
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement!);
      });

      expect(document.querySelector('.mzn-time-panel')).toBeInstanceOf(
        HTMLDivElement,
      );

      await waitFor(() => {
        fireEvent.keyDown(document, { key: 'Escape' });
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-time-panel')).toBe(null);
    });

    describe('prop: onPanelToggle', () => {
      it('should get open state in its arguement', async () => {
        const onPanelToggle = jest.fn();
        const { getHostHTMLElement } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DateTimePicker onPanelToggle={onPanelToggle} />
          </CalendarConfigProvider>,
        );

        const element = getHostHTMLElement();
        const [inputElement] = element.getElementsByTagName('input');

        await waitFor(() => {
          fireEvent.focus(inputElement!);
        });

        expect(onPanelToggle).toHaveBeenCalledWith(true);
        onPanelToggle.mockClear();

        await waitFor(() => {
          fireEvent.keyDown(document, { key: 'Escape' });
        });

        expect(onPanelToggle).toHaveBeenCalledWith(false);
      });

      it('should not be invoked if readOnly', () => {
        const onPanelToggle = jest.fn();
        const { getHostHTMLElement } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DateTimePicker onPanelToggle={onPanelToggle} readOnly />
          </CalendarConfigProvider>,
        );

        const element = getHostHTMLElement();
        const [inputElement] = element.getElementsByTagName('input');

        waitFor(() => {
          fireEvent.click(inputElement!);
        });

        expect(onPanelToggle).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('panel picking', () => {
    it('should update input value', async () => {
      const referenceDate = '2021-10-20';
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker referenceDate={referenceDate} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement);
      });

      const [calendarElement] = document.getElementsByClassName('mzn-calendar');
      const cellElemet = getByText(calendarElement as HTMLElement, '15');

      await waitFor(() => {
        fireEvent.click(cellElemet);
      });

      expect(inputElement.value).toBe('2021-10-15 00:00:00');
    });
  });

  describe('guard value string format', () => {
    it('should clear input values when blured if it does not match the date format', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker />
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

  describe('prop: clearable', () => {
    it('should by default clear input value', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker clearable />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.change(inputElement!, {
          target: { value: '2021-10-20 00:00:00' },
        });
      });

      await waitFor(() => {
        inputElement.focus();

        const clearIconElement = element.querySelector(
          '[data-icon-name="times"]',
        );

        fireEvent.click(clearIconElement!);
      });

      expect(inputElement.value).toBe('');
    });

    it('should clear values when clear icon clicked', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker onChange={onChange} clearable />
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
        fireEvent.keyDown(inputElement!, { key: 'Enter' });
      });

      onChange.mockClear();

      await waitFor(() => {
        fireEvent.mouseOver(element!);
      });

      await waitFor(() => {
        const clearIconElement = element.querySelector(
          '[data-icon-name="times"]',
        );

        fireEvent.click(clearIconElement!);
      });

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: onChange', () => {
    it('should be invoked when confirm button clicked', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement, getByText: getByTextWithHostElement } =
        render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <DateTimePicker onChange={onChange} />
          </CalendarConfigProvider>,
        );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement!);
      });

      const confirmButtonElement = getByTextWithHostElement('OK');

      await waitFor(() => {
        fireEvent.click(confirmButtonElement);
      });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should be invoked when enter key down', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker onChange={onChange} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement!);
      });

      await waitFor(() => {
        fireEvent.keyDown(inputElement!, { key: 'Enter' });
      });

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: inputProps', () => {
    it('should bind focus, blur, keydown events to input element', async () => {
      const onKeyDown = jest.fn();
      const onBlur = jest.fn();
      const onFocus = jest.fn();
      const inputProps: DateTimePickerProps['inputProps'] = {
        onKeyDown,
        onBlur,
        onFocus,
      };

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker inputProps={inputProps} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement!);
      });

      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(onFocus).toHaveBeenCalledWith(
        expect.objectContaining({
          target: inputElement,
        }),
      );

      await waitFor(() => {
        fireEvent.keyDown(inputElement!);
      });

      expect(onKeyDown).toHaveBeenCalledTimes(1);
      expect(onKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({
          target: inputElement,
        }),
      );

      await waitFor(() => {
        fireEvent.blur(inputElement!);
      });

      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledWith(
        expect.objectContaining({
          target: inputElement,
        }),
      );
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
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement);
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
      const defaultValue = '2021-10-20';

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker defaultValue={defaultValue} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement);
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
      const [inputElement] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(inputElement);
      });

      const [calendarElementt] =
        document.getElementsByClassName('mzn-calendar');

      expect(
        getByText(
          calendarElementt as HTMLElement,
          getMonthShortName(moment().month(), 'en-US'),
        ),
      ).toBeInstanceOf(HTMLButtonElement);
      expect(
        getByText(
          calendarElementt as HTMLElement,
          getYear(moment().toISOString()),
        ),
      ).toBeInstanceOf(HTMLButtonElement);
    });

    it('should update referenceDate after value changed', async () => {
      const referenceDate = '2021-10-20';
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimePicker referenceDate={referenceDate} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      act(() => {
        fireEvent.focus(inputElement);
      });

      act(() => {
        fireEvent.change(inputElement, {
          target: { value: '2031-11-20 12:00:00' },
        });
      });

      await waitFor(() => {
        const [calendarElement] =
          document.getElementsByClassName('mzn-calendar');

        expect(getByText(calendarElement as HTMLElement, 'Nov')).toBeInstanceOf(
          HTMLButtonElement,
        );
        expect(
          getByText(calendarElement as HTMLElement, '2031'),
        ).toBeInstanceOf(HTMLButtonElement);
      });
    });
  });
});
