import moment from 'moment';
import 'moment/locale/en-gb';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { calendarClasses } from '@mezzanine-ui/core/calendar';
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

/**
 * Issue #460 — the "a range covering a disabled unit is not painted as a
 * range" rule is evaluated for the whole range, including off-screen dates.
 */
describe('<RangeCalendar /> range highlight suppression', () => {
  afterEach(cleanup);

  const inRangeSelector = `.${calendarClasses.buttonInRange}`;

  const renderRangeCalendar = ({
    disabledDay,
    value,
  }: {
    disabledDay?: string;
    value: string[];
  }) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <RangeCalendar
          isDateDisabled={
            disabledDay
              ? (target) => moment(target).format('YYYY-MM-DD') === disabledDay
              : undefined
          }
          isDateInRange={(target) =>
            moment(target).isBetween(value[0], value[1], 'day', '[]')
          }
          mode="day"
          referenceDate="2026-08-01"
          value={value}
        />
      </CalendarConfigProvider>,
    );

  it('should paint the range when no date is disabled', () => {
    const { getHostHTMLElement } = renderRangeCalendar({
      value: ['2026-08-05', '2026-09-25'],
    });

    expect(
      getHostHTMLElement().querySelectorAll(inRangeSelector).length,
    ).toBeGreaterThan(0);
  });

  it('should suppress the range when a disabled date sits inside the visible window', () => {
    const { getHostHTMLElement } = renderRangeCalendar({
      disabledDay: '2026-08-20',
      value: ['2026-08-05', '2026-09-25'],
    });

    expect(getHostHTMLElement().querySelectorAll(inRangeSelector).length).toBe(
      0,
    );
  });

  it('should suppress the range when the disabled date is outside the visible window', () => {
    // The calendars show Aug/Sep 2026, so 2027-03-15 is never rendered — but
    // the rule still applies, because handleRangeSelection would reject this
    // same range on click. Painting it would invite a click that fails.
    const { getHostHTMLElement } = renderRangeCalendar({
      disabledDay: '2027-03-15',
      value: ['2026-08-05', '2027-06-30'],
    });

    expect(getHostHTMLElement().querySelectorAll(inRangeSelector).length).toBe(
      0,
    );
  });

  it('should suppress a range whose disabled dates cannot be fully checked', () => {
    const { getHostHTMLElement } = renderRangeCalendar({
      disabledDay: '2040-01-01',
      value: ['2026-08-05', '4026-08-01'],
    });

    expect(getHostHTMLElement().querySelectorAll(inRangeSelector)).toHaveLength(
      0,
    );
  });

  it('should leave the range alone when only one end is selected', () => {
    const { getHostHTMLElement } = renderRangeCalendar({
      disabledDay: '2026-08-20',
      value: ['2026-08-05'],
    });

    expect(
      getHostHTMLElement().querySelectorAll(inRangeSelector).length,
    ).toBeGreaterThan(0);
  });
});

describe('<RangeCalendar /> range validation', () => {
  afterEach(cleanup);

  it('should use the displayed week start when checking disabled weeks', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <CalendarConfigProvider locale="en-US" methods={CalendarMethodsMoment}>
        <RangeCalendar
          displayWeekDayLocale="en-GB"
          isWeekDisabled={(date) =>
            moment(date).format('YYYY-MM-DD') === '2026-09-14'
          }
          mode="week"
          onChange={onChange}
          referenceDate="2026-09-01"
          value={['2026-09-07']}
        />
      </CalendarConfigProvider>,
    );

    expect(
      getByRole('button', { name: /14 to .*20.*Not available/ }).hasAttribute(
        'disabled',
      ),
    ).toBe(true);
    fireEvent.click(getByRole('button', { name: /21 to .*27/ }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0][1]).toBeUndefined();
  });

  it.each([true, false])(
    'should only complete a long range without a predicate: %s',
    (withPredicate) => {
      const onChange = jest.fn();
      const { getByRole } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <RangeCalendar
            isDateDisabled={
              withPredicate
                ? (date) => moment(date).format('YYYY-MM-DD') === '2015-01-01'
                : undefined
            }
            onChange={onChange}
            referenceDate="2020-09-01"
            value={['2000-01-01']}
          />
        </CalendarConfigProvider>,
      );

      fireEvent.click(getByRole('button', { name: /September 11, 2020/ }));

      expect(onChange).toHaveBeenCalledTimes(1);
      if (withPredicate) {
        expect(onChange.mock.calls[0][0][1]).toBeUndefined();
      } else {
        expect(moment(onChange.mock.calls[0][0][1]).format('YYYY-MM-DD')).toBe(
          '2020-09-11',
        );
      }
    },
  );
});
