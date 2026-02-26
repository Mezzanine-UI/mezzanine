/* global document */
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import {
  act,
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
import MultipleDatePicker from '.';

const originalResizeObserver = (global as typeof globalThis).ResizeObserver;

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  (global as typeof globalThis).ResizeObserver =
    ResizeObserverMock as unknown as typeof ResizeObserver;
});

afterAll(() => {
  (global as typeof globalThis).ResizeObserver = originalResizeObserver;
});

describe('<MultipleDatePicker />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <MultipleDatePicker onChange={() => {}} ref={ref} value={[]} />
      </CalendarConfigProvider>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <MultipleDatePicker
          className={className}
          onChange={() => {}}
          value={[]}
        />
      </CalendarConfigProvider>,
    ),
  );

  describe('calendar toggle', () => {
    it('should toggle calendar when icon clicked', async () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <MultipleDatePicker onChange={() => {}} value={[]} />
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
  });

  describe('prop: value', () => {
    it('should display tags for selected dates', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <MultipleDatePicker
            onChange={() => {}}
            value={['2025-01-01', '2025-01-15']}
          />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const tags = element.querySelectorAll('.mzn-tag');

      expect(tags.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('prop: clearable', () => {
    it('should show clear button when clearable and has value', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <MultipleDatePicker
            clearable
            onChange={() => {}}
            value={['2025-01-01']}
          />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const clearButton = element.querySelector('.mzn-text-field__clear-icon');

      expect(clearButton).toBeInstanceOf(HTMLElement);
    });

    it('should not show clear button when no value', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <MultipleDatePicker clearable onChange={() => {}} value={[]} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const clearButton = element.querySelector('.mzn-text-field__clear-icon');

      expect(clearButton).toBe(null);
    });

    it('should make clear button interactive on hover when clearable and has value', async () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <MultipleDatePicker clearable onChange={() => {}} value={['2025-01-01']} />
        </CalendarConfigProvider>,
      );

      // getHostHTMLElement() returns the TextField root div (mzn-text-field) itself
      const element = getHostHTMLElement();

      await act(async () => {
        fireEvent.mouseEnter(element);
      });

      await waitFor(() => {
        const clearButton = element.querySelector('.mzn-text-field__clear-icon') as HTMLElement;
        expect(clearButton.style.pointerEvents).toBe('auto');
      });
    });
  });

  describe('prop: placeholder', () => {
    it('should display placeholder when no value', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <MultipleDatePicker
            onChange={() => {}}
            placeholder="Select dates"
            value={[]}
          />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      const inputElement = element.querySelector('input');

      expect(inputElement?.getAttribute('placeholder')).toBe('Select dates');
    });
  });

  describe('prop: disabled', () => {
    it('should apply disabled styles', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <MultipleDatePicker disabled onChange={() => {}} value={[]} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();

      // The host element IS the trigger, check directly
      expect(
        element.classList.contains(
          'mzn-multiple-date-picker-trigger--disabled',
        ),
      ).toBe(true);
    });
  });

  describe('prop: readOnly', () => {
    it('should apply readonly styles', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <MultipleDatePicker onChange={() => {}} readOnly value={[]} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();

      // The host element IS the trigger, check directly
      expect(
        element.classList.contains(
          'mzn-multiple-date-picker-trigger--readonly',
        ),
      ).toBe(true);
    });
  });

  describe('prop: error', () => {
    it('should apply error styles', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <MultipleDatePicker error onChange={() => {}} value={[]} />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();

      // Error class is on the host element (which is the TextField)
      expect(element.classList.contains('mzn-text-field--error')).toBe(true);
    });
  });

  describe('tag removal', () => {
    it('should have close button on tags when not disabled or readonly', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <MultipleDatePicker
            onChange={() => {}}
            value={['2025-01-01', '2025-01-15']}
          />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      // Query only visible close buttons (exclude fake tags which are hidden)
      const tagGroup = element.querySelector('.mzn-tag__group');
      const closeButtons = tagGroup?.querySelectorAll('.mzn-tag__close-button');

      expect(closeButtons?.length).toBeGreaterThan(0);
    });

    it('should not have close button on tags when readonly', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <MultipleDatePicker
            onChange={() => {}}
            readOnly
            value={['2025-01-01', '2025-01-15']}
          />
        </CalendarConfigProvider>,
      );

      const element = getHostHTMLElement();
      // Query only visible close buttons (exclude fake tags which are hidden)
      const tagGroup = element.querySelector('.mzn-tag__group');
      const closeButtons = tagGroup?.querySelectorAll('.mzn-tag__close-button');

      expect(closeButtons?.length).toBe(0);
    });
  });
});
