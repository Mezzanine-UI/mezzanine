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
import { maxRangeScanSteps } from '../Calendar/useRangeScan';
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

    it('should redirect focus into calendar when tab key down on inputTo element', async () => {
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
        fireEvent.keyDown(inputToElement, { key: 'Tab' });
      });

      await waitFor(() => {
        expect(getRangeCalendar()).toBeInstanceOf(HTMLDivElement);
        expect(getRangeCalendar()?.contains(document.activeElement)).toBe(true);
      });
    });

    it('should close calendar when shift+tab key down on inputTo element', async () => {
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
        fireEvent.keyDown(inputToElement, { key: 'Tab', shiftKey: true });
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

  describe('prop: confirmMode', () => {
    // Helper function to get the RangeCalendar popup
    const getRangeCalendar = () =>
      document.querySelector('[aria-label^="Range calendar"]');

    it('should auto-close after range selection in immediate mode (default)', async () => {
      const onChange = jest.fn();
      const referenceDate = '2021-10-15';
      const { getHostHTMLElement, getAllByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker onChange={onChange} referenceDate={referenceDate} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement] = element.getElementsByTagName('input');

      await act(async () => {
        fireEvent.focus(inputFromElement);
      });

      await waitFor(() => {
        expect(getRangeCalendar()).toBeInstanceOf(HTMLDivElement);
      });

      // Click on day 10
      const [day10] = getAllByText('10');
      expect(day10).toBeInstanceOf(HTMLButtonElement);

      await act(async () => {
        fireEvent.click(day10);
      });

      // Calendar should still be open (only one date selected)
      expect(getRangeCalendar()).toBeInstanceOf(HTMLDivElement);

      // Click on day 20
      const [day20] = getAllByText('20');
      expect(day20).toBeInstanceOf(HTMLButtonElement);

      await act(async () => {
        fireEvent.click(day20);
      });

      // Calendar should auto-close after both dates selected
      await waitFor(() => {
        expect(getRangeCalendar()).toBe(null);
      });

      expect(onChange).toHaveBeenCalled();
    });

    it('should show Confirm/Cancel buttons in manual mode', async () => {
      const onChange = jest.fn();
      const referenceDate = '2021-10-15';
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker
            confirmMode="manual"
            onChange={onChange}
            referenceDate={referenceDate}
          />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement] = element.getElementsByTagName('input');

      await act(async () => {
        fireEvent.focus(inputFromElement);
      });

      await waitFor(() => {
        expect(getRangeCalendar()).toBeInstanceOf(HTMLDivElement);
      });

      // Check for Confirm button
      const confirmButton = document.querySelector(
        '.mzn-calendar-footer-actions .mzn-button--base-primary',
      );
      expect(confirmButton).toBeInstanceOf(HTMLButtonElement);
      expect(confirmButton?.textContent).toBe('Confirm');
      expect((confirmButton as HTMLButtonElement)?.disabled).toBe(true);

      // Check for Cancel button
      const cancelButton = document.querySelector(
        '.mzn-calendar-footer-actions .mzn-button--base-tertiary',
      );
      expect(cancelButton).toBeInstanceOf(HTMLButtonElement);
      expect(cancelButton?.textContent).toBe('Cancel');
    });

    it('should not trigger onChange until Confirm is clicked in manual mode', async () => {
      const onChange = jest.fn();
      const referenceDate = '2021-10-15';
      const { getHostHTMLElement, getAllByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker
            confirmMode="manual"
            onChange={onChange}
            referenceDate={referenceDate}
          />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement] = element.getElementsByTagName('input');

      await act(async () => {
        fireEvent.focus(inputFromElement);
      });

      await waitFor(() => {
        expect(getRangeCalendar()).toBeInstanceOf(HTMLDivElement);
      });

      // Select two dates
      const [day10] = getAllByText('10');
      await act(async () => {
        fireEvent.click(day10);
      });

      const [day20] = getAllByText('20');
      await act(async () => {
        fireEvent.click(day20);
      });

      // Calendar should NOT auto-close in manual mode
      expect(getRangeCalendar()).toBeInstanceOf(HTMLDivElement);

      // onChange should NOT have been called yet
      expect(onChange).not.toHaveBeenCalled();

      // Confirm button should now be enabled
      const confirmButton = document.querySelector(
        '.mzn-calendar-footer-actions .mzn-button--base-primary',
      );
      expect((confirmButton as HTMLButtonElement)?.disabled).toBe(false);

      // Click Confirm
      await act(async () => {
        fireEvent.click(confirmButton!);
      });

      // Now onChange should be called
      expect(onChange).toHaveBeenCalled();

      // Calendar should close
      await waitFor(() => {
        expect(getRangeCalendar()).toBe(null);
      });
    });

    it('should not auto-close when actions prop is provided', async () => {
      const onChange = jest.fn();
      const referenceDate = '2021-10-15';
      const { getHostHTMLElement, getAllByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker
            actions={{
              primaryButtonProps: {
                children: 'Apply',
                onClick: jest.fn(),
              },
              secondaryButtonProps: {
                children: 'Reset',
                onClick: jest.fn(),
              },
            }}
            onChange={onChange}
            referenceDate={referenceDate}
          />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [inputFromElement] = element.getElementsByTagName('input');

      await act(async () => {
        fireEvent.focus(inputFromElement);
      });

      await waitFor(() => {
        expect(getRangeCalendar()).toBeInstanceOf(HTMLDivElement);
      });

      // Select two dates
      const [day10] = getAllByText('10');
      await act(async () => {
        fireEvent.click(day10);
      });

      const [day20] = getAllByText('20');
      await act(async () => {
        fireEvent.click(day20);
      });

      // Calendar should NOT auto-close when actions prop is provided
      expect(getRangeCalendar()).toBeInstanceOf(HTMLDivElement);

      // Custom actions should be rendered
      const applyButton = document.querySelector(
        '.mzn-calendar-footer-actions .mzn-button--base-primary',
      );
      expect(applyButton?.textContent).toBe('Apply');
    });
  });
});

/**
 * Issue #460 — the picker used to walk the whole selected range one day at a
 * time, six times per render, whether or not a disabled-date predicate was
 * supplied. These lock in that its work no longer scales with the range.
 */
describe('<DateRangePicker /> wide range rendering', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  const getRangeCalendar = () =>
    document.querySelector('[aria-label^="Range calendar"]');

  // 2006-09-01 .. 2026-08-31 is 7,304 days.
  const wideRange: [DateType, DateType] = ['2006-09-01', '2026-08-31'];

  it('should paint a two-decade range without consulting any predicate', async () => {
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateRangePicker value={wideRange} />
      </CalendarConfigProvider>,
    );

    const [inputFromElement] =
      getHostHTMLElement().getElementsByTagName('input');

    await act(async () => {
      fireEvent.focus(inputFromElement);
    });

    await waitFor(() => {
      expect(getRangeCalendar()).toBeInstanceOf(HTMLDivElement);
    });

    expect(
      document.querySelectorAll('.mzn-calendar-button--inRange').length,
    ).toBeGreaterThan(0);
  });

  it('should keep the disabled-date scan bounded on a two-decade range', async () => {
    const isDateDisabled = jest.fn((_target: DateType) => false);

    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateRangePicker isDateDisabled={isDateDisabled} value={wideRange} />
      </CalendarConfigProvider>,
    );

    const [inputFromElement] =
      getHostHTMLElement().getElementsByTagName('input');

    await act(async () => {
      fireEvent.focus(inputFromElement);
    });

    await waitFor(() => {
      expect(getRangeCalendar()).toBeInstanceOf(HTMLDivElement);
    });

    /**
     * The capped scan plus the cells of two 6x7 grids. The slack covers the
     * popper mounting the calendar twice as it opens, which runs the scan
     * once per mount. What matters is that the total is a constant: the old
     * code ran the full 7,304-day walk six times per render — 43,824 calls
     * each — and grew with the range from there.
     */
    expect(isDateDisabled.mock.calls.length).toBeLessThan(
      maxRangeScanSteps * 3,
    );
  });

  it('should stay bounded even when the year is mistyped', async () => {
    const isDateDisabled = jest.fn((_target: DateType) => false);

    // 2026-08-31 .. 4026-08-01 is 730,455 days, reachable by typing.
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateRangePicker
          isDateDisabled={isDateDisabled}
          value={['2026-08-31', '4026-08-01']}
        />
      </CalendarConfigProvider>,
    );

    const [inputFromElement] =
      getHostHTMLElement().getElementsByTagName('input');

    await act(async () => {
      fireEvent.focus(inputFromElement);
    });

    await waitFor(() => {
      expect(getRangeCalendar()).toBeInstanceOf(HTMLDivElement);
    });

    expect(isDateDisabled.mock.calls.length).toBeLessThan(
      maxRangeScanSteps * 3,
    );
  });
});

/**
 * Regression: hovering a cell between the two clicks used to leak the hover
 * preview into the value that RangeCalendar reads back to decide how far the
 * selection has got, so the second click was treated as "start over" and the
 * first date was thrown away.
 */
describe('<DateRangePicker /> range selection with hover preview', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  const getRangeCalendar = () =>
    document.querySelector('[aria-label^="Range calendar"]');

  const getDayButton = (label: string) =>
    Array.from(
      document.querySelectorAll<HTMLButtonElement>('.mzn-calendar-button'),
    ).find((button) => button.textContent === label);

  const openCalendar = async (element: HTMLElement) => {
    const [inputFromElement] = element.getElementsByTagName('input');

    await act(async () => {
      fireEvent.focus(inputFromElement);
    });

    await waitFor(() => {
      expect(getRangeCalendar()).toBeInstanceOf(HTMLDivElement);
    });
  };

  it('should complete the range even when the second date was hovered first', async () => {
    const onChange = jest.fn();
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateRangePicker
          onChange={onChange}
          referenceDate={moment('2026-09-01').toISOString()}
        />
      </CalendarConfigProvider>,
    );

    await openCalendar(getHostHTMLElement());

    await act(async () => {
      fireEvent.click(getDayButton('1')!);
    });

    // The pointer travels over the target cell before it is clicked.
    await act(async () => {
      fireEvent.mouseOver(getDayButton('11')!);
      fireEvent.mouseEnter(getDayButton('11')!);
    });

    await act(async () => {
      fireEvent.click(getDayButton('11')!);
    });

    expect(onChange).toHaveBeenCalled();

    const [start, end] = onChange.mock.calls[onChange.mock.calls.length - 1][0];

    expect(moment(start).format('YYYY-MM-DD')).toBe('2026-09-01');
    expect(moment(end).format('YYYY-MM-DD')).toBe('2026-09-11');
  });

  it.each([
    { disabledDay: '2026-09-05', monthSwitches: 0, targetDay: '2026-09-11' },
    { disabledDay: '2026-10-05', monthSwitches: 2, targetDay: '2026-11-18' },
  ])(
    'should suppress and reject a preview crossing $disabledDay',
    async ({ disabledDay, monthSwitches, targetDay }) => {
      const onChange = jest.fn();
      const { getByRole, getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateRangePicker
            isDateDisabled={(date) =>
              moment(date).format('YYYY-MM-DD') === disabledDay
            }
            onChange={onChange}
            referenceDate="2026-09-01"
          />
        </CalendarConfigProvider>,
      );
      await openCalendar(getHostHTMLElement());
      await act(async () => {
        fireEvent.click(
          getByRole('button', { name: 'Tuesday, September 1, 2026' }),
        );
      });
      for (let index = 0; index < monthSwitches; index += 1) {
        await act(async () => {
          fireEvent.click(getByRole('button', { name: 'Go to next month' }));
        });
      }
      const targetLabel = moment(targetDay)
        .locale('en')
        .format('dddd, MMMM D, YYYY');
      await act(async () => {
        fireEvent.mouseOver(getByRole('button', { name: targetLabel }));
      });
      expect(
        document.querySelectorAll('.mzn-calendar-button--inRange'),
      ).toHaveLength(0);
      await act(async () => {
        fireEvent.click(getByRole('button', { name: targetLabel }));
      });
      expect(onChange).not.toHaveBeenCalled();
      const [startInput, endInput] =
        getHostHTMLElement().getElementsByTagName('input');
      expect(startInput.value).toBe(targetDay);
      expect(endInput.value).toBe('');

      const nextDay = moment(targetDay).add(1, 'day');
      const nextLabel = nextDay.locale('en').format('dddd, MMMM D, YYYY');
      await act(async () =>
        fireEvent.mouseOver(getByRole('button', { name: nextLabel })),
      );
      await act(async () =>
        fireEvent.click(getByRole('button', { name: nextLabel })),
      );
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(
        onChange.mock.calls[0][0].map((date: DateType) =>
          moment(date).format('YYYY-MM-DD'),
        ),
      ).toEqual([targetDay, nextDay.format('YYYY-MM-DD')]);
    },
  );
});
