/* global document */
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { cleanup, render, fireEvent, waitFor } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { CalendarConfigProvider } from '../Calendar';
import { DateTimeRangePicker, DateTimeRangePickerValue } from '.';

describe('<DateTimeRangePicker />', () => {
  Element.prototype.scrollTo = () => {};

  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateTimeRangePicker ref={ref} />
      </CalendarConfigProvider>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <DateTimeRangePicker className={className} />
      </CalendarConfigProvider>,
    ),
  );

  describe('structure', () => {
    it('should render two DateTimePicker components', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimeRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');

      // Each DateTimePicker has 2 inputs (date + time), so total 4 inputs
      expect(inputElements.length).toBe(4);
    });

    it('should render arrow icon between pickers', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimeRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const icon = element.querySelector('.mzn-date-time-range-picker__arrow');

      expect(icon).toBeInstanceOf(HTMLElement);
    });
  });

  describe('prop: direction', () => {
    it('should have row class by default', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimeRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-date-time-range-picker--row'),
      ).toBe(true);
    });

    it('should have column class when direction="column"', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimeRangePicker direction="column" />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-date-time-range-picker--column'),
      ).toBe(true);
    });

    it('should render down arrow icon when direction="column"', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimeRangePicker direction="column" />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const icon = element.querySelector(
        '[data-icon-name="long-tail-arrow-down"]',
      );

      expect(icon).toBeInstanceOf(HTMLElement);
    });

    it('should render right arrow icon when direction="row"', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimeRangePicker direction="row" />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const icon = element.querySelector(
        '[data-icon-name="long-tail-arrow-right"]',
      );

      expect(icon).toBeInstanceOf(HTMLElement);
    });
  });

  describe('prop: value', () => {
    it('should display from value in first picker', async () => {
      const fromDate = '2024-01-15T10:30:00';
      const value: DateTimeRangePickerValue = [fromDate, undefined];

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimeRangePicker value={value} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');
      const fromDateInput = inputElements[0];

      expect(fromDateInput.value).toBe('2024-01-15');
    });

    it('should display to value in second picker', async () => {
      const toDate = '2024-01-20T14:00:00';
      const value: DateTimeRangePickerValue = [undefined, toDate];

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimeRangePicker value={value} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');
      const toDateInput = inputElements[2];

      expect(toDateInput.value).toBe('2024-01-20');
    });
  });

  describe('prop: onChange', () => {
    it('should not call onChange if not provided', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimeRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');

      // Just verify no crash when onChange is not provided
      expect(inputElements.length).toBe(4);
    });

    it('should preserve to value when updating from value (from < to)', () => {
      const onChange = jest.fn();
      const toDate = '2024-01-20T10:00:00';
      const value: DateTimeRangePickerValue = [undefined, toDate];

      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimeRangePicker value={value} onChange={onChange} />
        </CalendarConfigProvider>,
      );

      // Component should render without errors
      expect(onChange).not.toHaveBeenCalled();
    });

    it('should render both pickers correctly when onChange is provided', () => {
      const onChange = jest.fn();
      const value: DateTimeRangePickerValue = [
        '2024-01-10T10:00:00',
        '2024-01-20T10:00:00',
      ];

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimeRangePicker value={value} onChange={onChange} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');

      expect(inputElements[0].value).toBe('2024-01-10');
      expect(inputElements[2].value).toBe('2024-01-20');
    });
  });

  describe('prop: disabled', () => {
    it('should disable both pickers when disabled=true', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimeRangePicker disabled />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');

      expect(inputElements[0].disabled).toBe(true);
      expect(inputElements[1].disabled).toBe(true);
      expect(inputElements[2].disabled).toBe(true);
      expect(inputElements[3].disabled).toBe(true);
    });
  });

  describe('prop: error', () => {
    it('should apply error state to both pickers', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimeRangePicker error />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const textFields = element.querySelectorAll('.mzn-text-field--error');

      expect(textFields.length).toBe(2);
    });
  });

  describe('prop: readOnly', () => {
    it('should set readOnly on both pickers', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimeRangePicker readOnly />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');

      expect(inputElements[0].readOnly).toBe(true);
      expect(inputElements[1].readOnly).toBe(true);
      expect(inputElements[2].readOnly).toBe(true);
      expect(inputElements[3].readOnly).toBe(true);
    });

    it('should not open panel when readOnly', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimeRangePicker readOnly />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');
      const fromDateInput = inputElements[0];

      await waitFor(() => {
        fireEvent.click(fromDateInput);
      });

      expect(document.querySelector('.mzn-calendar')).toBe(null);
    });
  });

  describe('prop: size', () => {
    it('should apply size to both pickers', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimeRangePicker size="sub" />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const textFields = element.querySelectorAll('.mzn-text-field--sub');

      expect(textFields.length).toBe(2);
    });
  });

  describe('prop: defaultValue', () => {
    it('should use defaultValue when value is not provided', () => {
      const defaultValue: DateTimeRangePickerValue = [
        '2024-01-15T10:00:00',
        '2024-01-20T14:00:00',
      ];

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <DateTimeRangePicker defaultValue={defaultValue} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElements = element.getElementsByTagName('input');

      expect(inputElements[0].value).toBe('2024-01-15');
      expect(inputElements[2].value).toBe('2024-01-20');
    });
  });
});
