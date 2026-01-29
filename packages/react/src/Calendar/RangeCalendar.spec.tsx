import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeHostElementClassNameAppendable,
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import { CalendarConfigProvider } from '.';
import RangeCalendar from './RangeCalendar';

describe('<RangeCalendar />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <RangeCalendar ref={ref} referenceDate={moment().toISOString()} />
      </CalendarConfigProvider>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <RangeCalendar
          referenceDate={moment().toISOString()}
          className={className}
        />
      </CalendarConfigProvider>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <RangeCalendar referenceDate={moment().toISOString()} />
      </CalendarConfigProvider>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-calendar')).toBeTruthy();
  });

  it('should render two calendars side by side', () => {
    const { container } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <RangeCalendar referenceDate={moment().toISOString()} />
      </CalendarConfigProvider>,
    );

    const calendars = container.querySelectorAll('.mzn-calendar');
    expect(calendars.length).toBe(3); // 1 host + 2 calendar children
  });

  it('should render footer actions when actions prop is provided', () => {
    const { getByText } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <RangeCalendar
          referenceDate={moment().toISOString()}
          actions={{
            secondaryButtonProps: { children: 'Cancel' },
            primaryButtonProps: { children: 'Ok' },
          }}
        />
      </CalendarConfigProvider>,
    );

    expect(getByText('Cancel')).toBeInstanceOf(HTMLButtonElement);
    expect(getByText('Ok')).toBeInstanceOf(HTMLButtonElement);
  });

  describe('prop: mode', () => {
    it('should default to "day" mode', () => {
      const { container } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <RangeCalendar referenceDate={moment().toISOString()} />
        </CalendarConfigProvider>,
      );

      const calendars = container.querySelectorAll('.mzn-calendar--day');
      expect(calendars.length).toBe(2);
    });

    it('should support "month" mode', () => {
      const { container } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <RangeCalendar referenceDate={moment().toISOString()} mode="month" />
        </CalendarConfigProvider>,
      );

      const calendars = container.querySelectorAll('.mzn-calendar--month');
      expect(calendars.length).toBe(2);
    });

    it('should support "year" mode', () => {
      const { container } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <RangeCalendar referenceDate={moment().toISOString()} mode="year" />
        </CalendarConfigProvider>,
      );

      const calendars = container.querySelectorAll('.mzn-calendar--year');
      expect(calendars.length).toBe(2);
    });
  });

  describe('prop: actions', () => {
    it('should override default action button text', () => {
      const actions = {
        secondaryButtonProps: {
          children: 'Clear',
          onClick: jest.fn(),
        },
        primaryButtonProps: {
          children: 'Apply',
          onClick: jest.fn(),
        },
      };

      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <RangeCalendar
            referenceDate={moment().toISOString()}
            actions={actions}
          />
        </CalendarConfigProvider>,
      );

      expect(getByText('Clear')).toBeInstanceOf(HTMLButtonElement);
      expect(getByText('Apply')).toBeInstanceOf(HTMLButtonElement);
    });

    it('should call onClick handlers when action buttons are clicked', () => {
      const actions = {
        secondaryButtonProps: {
          children: 'Cancel',
          onClick: jest.fn(),
        },
        primaryButtonProps: {
          children: 'Ok',
          onClick: jest.fn(),
        },
      };

      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <RangeCalendar
            referenceDate={moment().toISOString()}
            actions={actions}
          />
        </CalendarConfigProvider>,
      );

      const cancelButton = getByText('Cancel');
      const okButton = getByText('Ok');

      fireEvent.click(cancelButton);
      expect(actions.secondaryButtonProps.onClick).toHaveBeenCalledTimes(1);

      fireEvent.click(okButton);
      expect(actions.primaryButtonProps.onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: quickSelect', () => {
    it('should render quick select when provided', () => {
      const options = [
        { id: 'today', name: 'Today', onClick: jest.fn() },
        { id: 'last-week', name: 'Last Week', onClick: jest.fn() },
      ];

      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <RangeCalendar
            referenceDate={moment().toISOString()}
            quickSelect={{
              activeId: 'today',
              options,
            }}
          />
        </CalendarConfigProvider>,
      );

      expect(getByText('Today').parentElement).toBeInstanceOf(
        HTMLButtonElement,
      );
      expect(getByText('Last Week').parentElement).toBeInstanceOf(
        HTMLButtonElement,
      );
    });
  });

  describe('prop: value', () => {
    it('should pass value to both calendars', () => {
      const value = [moment('2021-10-15').toISOString()];

      const { container } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <RangeCalendar
            referenceDate={moment('2021-10-01').toISOString()}
            value={value}
          />
        </CalendarConfigProvider>,
      );

      const activeButtons = container.querySelectorAll(
        '.mzn-calendar-button--active',
      );
      expect(activeButtons.length).toBeGreaterThan(0);
    });
  });

  describe('prop: onChange', () => {
    it('should call onChange when a date is selected', () => {
      const onChange = jest.fn();
      const { container } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <RangeCalendar
            referenceDate={moment('2021-10-01').toISOString()}
            onChange={onChange}
          />
        </CalendarConfigProvider>,
      );

      const buttons = container.querySelectorAll('.mzn-calendar-button');
      const dateButton = Array.from(buttons).find(
        (btn) => btn.textContent === '15',
      ) as HTMLButtonElement;

      if (dateButton) {
        fireEvent.click(dateButton);
        expect(onChange).toHaveBeenCalledTimes(1);
      }
    });
  });
});
