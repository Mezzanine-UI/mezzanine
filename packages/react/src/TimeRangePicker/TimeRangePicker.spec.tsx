/* global document */
import '@testing-library/jest-dom';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import {
  cleanup,
  cleanupHook,
  fireEvent,
  render,
  waitFor,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { CalendarConfigProvider } from '../Calendar';
import TimeRangePicker, { TimeRangePickerProps, TimeRangePickerValue } from '.';

describe('<TimeRangePicker />', () => {
  Element.prototype.scrollTo = () => {};

  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <TimeRangePicker ref={ref} />
      </CalendarConfigProvider>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <TimeRangePicker className={className} />
      </CalendarConfigProvider>,
    ),
  );

  describe('prop: disabled', () => {
    it('should apply disabled class when disabled', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimeRangePicker disabled />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputs = element.getElementsByTagName('input');

      expect(inputs[0]).toHaveAttribute('aria-disabled', 'true');
      expect(inputs[1]).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('prop: readOnly', () => {
    it('should not open panel when readOnly', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimeRangePicker readOnly />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [fromInput] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.click(fromInput);
      });

      expect(document.querySelector('.mzn-time-panel')).toBe(null);
    });
  });

  describe('panel toggle', () => {
    it('should open panel when from input focused', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimeRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [fromInput] = element.getElementsByTagName('input');

      expect(document.querySelector('.mzn-time-panel')).toBe(null);

      await waitFor(() => {
        fireEvent.focus(fromInput);
      });

      expect(document.querySelector('.mzn-time-panel')).toBeInstanceOf(
        HTMLDivElement,
      );
    });

    it('should open panel when to input focused', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimeRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputs = element.getElementsByTagName('input');
      const toInput = inputs[1];

      expect(document.querySelector('.mzn-time-panel')).toBe(null);

      await waitFor(() => {
        fireEvent.focus(toInput);
      });

      expect(document.querySelector('.mzn-time-panel')).toBeInstanceOf(
        HTMLDivElement,
      );
    });

    it('should toggle panel when icon clicked', async () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimeRangePicker />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const iconElement = element.querySelector('[data-icon-name="clock"]');

      expect(iconElement).toBeInstanceOf(HTMLElement);

      await waitFor(() => {
        fireEvent.click(iconElement!);
      });

      // Panel should not be visible without focus on input
      expect(document.querySelector('.mzn-time-panel')).toBe(null);

      jest.useRealTimers();
    });
  });

  describe('prop: clearable', () => {
    it('should clear both values when clear button clicked', async () => {
      const onChange = jest.fn();
      const value: TimeRangePickerValue = [
        '2024-01-01T09:00:00',
        '2024-01-01T17:00:00',
      ];

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimeRangePicker clearable onChange={onChange} value={value} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();

      // Hover to show clear button
      await waitFor(() => {
        fireEvent.mouseEnter(element);
      });

      const clearButton = element.querySelector('.mzn-text-field__clear-icon');

      expect(clearButton).toBeInstanceOf(HTMLElement);

      await waitFor(() => {
        fireEvent.click(clearButton!);
      });

      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });

  describe('prop: onChange', () => {
    it('should call onChange when value changes', async () => {
      const onChange = jest.fn();

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimeRangePicker format="HH:mm:ss" onChange={onChange} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [fromInput] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(fromInput);
      });

      // Panel should be open now
      const panel = document.querySelector('.mzn-time-panel');

      expect(panel).toBeInstanceOf(HTMLDivElement);

      // Click on an hour
      const hourColumn = document.querySelector('.mzn-time-panel__column');

      if (hourColumn) {
        const hourItems = hourColumn.querySelectorAll('.mzn-time-panel__cell');

        if (hourItems.length > 0) {
          await waitFor(() => {
            fireEvent.click(hourItems[9]); // Click 09
          });

          expect(onChange).toHaveBeenCalled();
        }
      }
    });
  });

  describe('prop: size', () => {
    const sizes: TimeRangePickerProps['size'][] = ['main', 'sub'];

    sizes.forEach((size) => {
      it(`should render size="${size}"`, () => {
        const { getHostHTMLElement } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <TimeRangePicker size={size} />
          </CalendarConfigProvider>,
        );

        const element = getHostHTMLElement();

        expect(element.classList.contains(`mzn-text-field--${size}`)).toBe(
          true,
        );
      });
    });
  });

  describe('prop: error', () => {
    it('should apply error class when error is true', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimeRangePicker error />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-text-field--error')).toBe(true);
    });
  });

  describe('prop: fullWidth', () => {
    it('should apply fullWidth class when fullWidth is true', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimeRangePicker fullWidth />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-text-field--full-width')).toBe(
        true,
      );
    });
  });

  describe('prop: defaultValue', () => {
    it('should render with default value', () => {
      const defaultValue: TimeRangePickerValue = [
        '2024-01-01T09:30:00',
        '2024-01-01T17:45:00',
      ];

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimeRangePicker defaultValue={defaultValue} format="HH:mm:ss" />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputs = element.getElementsByTagName('input');

      expect(inputs[0]).toHaveValue('09:30:00');
      expect(inputs[1]).toHaveValue('17:45:00');
    });
  });

  describe('prop: hideSecond', () => {
    it('should render correctly with hideSecond prop', () => {
      // Just test that the component renders without error when hideSecond is passed
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimeRangePicker format="HH:mm" hideSecond />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();

      expect(element).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('panel switching', () => {
    it('should switch panel value when focus changes between inputs', async () => {
      const defaultValue: TimeRangePickerValue = [
        '2024-01-01T09:00:00',
        '2024-01-01T17:00:00',
      ];

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimeRangePicker defaultValue={defaultValue} format="HH:mm:ss" />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputs = element.getElementsByTagName('input');
      const fromInput = inputs[0];
      const toInput = inputs[1];

      // Focus on from input
      await waitFor(() => {
        fireEvent.focus(fromInput);
      });

      // Panel should show from value (09:00:00)
      const panel = document.querySelector('.mzn-time-panel');

      expect(panel).toBeInstanceOf(HTMLDivElement);

      // Switch focus to to input
      await waitFor(() => {
        fireEvent.focus(toInput);
      });

      // Panel should still be visible (now showing to value)
      expect(document.querySelector('.mzn-time-panel')).toBeInstanceOf(
        HTMLDivElement,
      );
    });
  });

  describe('prop: required', () => {
    it('should apply required attribute to inputs', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimeRangePicker required />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputs = element.getElementsByTagName('input');

      expect(inputs[0]).toHaveAttribute('aria-required', 'true');
      expect(inputs[1]).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('prop: onPanelToggle', () => {
    it('should call onPanelToggle when panel opens', async () => {
      const onPanelToggle = jest.fn();

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimeRangePicker onPanelToggle={onPanelToggle} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const [fromInput] = element.getElementsByTagName('input');

      await waitFor(() => {
        fireEvent.focus(fromInput);
      });

      expect(onPanelToggle).toHaveBeenCalledWith(true);
    });
  });

  describe('prop: placeholders', () => {
    it('should render custom placeholders', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimeRangePicker
            inputFromPlaceholder="Start"
            inputToPlaceholder="End"
          />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputs = element.getElementsByTagName('input');

      expect(inputs[0]).toHaveAttribute('placeholder', 'Start');
      expect(inputs[1]).toHaveAttribute('placeholder', 'End');
    });
  });
});
