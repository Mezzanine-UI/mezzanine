import moment from 'moment';
import {
  CalendarMethodsMoment,
  CalendarMode,
  calendarYearModuler,
  getYearRange,
} from '@mezzanine-ui/core/calendar';
import {
  cleanup,
  fireEvent,
  render,
  TestRenderer,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Calendar, {
  CalendarConfigProvider,
  CalendarControls,
  CalendarDays,
  CalendarMonths,
  CalendarWeeks,
  CalendarYears,
} from '.';

const modes: CalendarMode[] = ['day', 'month', 'week', 'year'];
const calendars = {
  day: CalendarDays,
  month: CalendarMonths,
  week: CalendarWeeks,
  year: CalendarYears,
};

describe('<Calendar />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <Calendar ref={ref} referenceDate={moment().toISOString()} />
      </CalendarConfigProvider>,
    ),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <Calendar
          referenceDate={moment().toISOString()}
          className={className}
        />
      </CalendarConfigProvider>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <Calendar referenceDate={moment().toISOString()} />
      </CalendarConfigProvider>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-calendar')).toBeTruthy();
  });

  describe('prop: mode', () => {
    it('default to "day"', () => {
      const testInstance = TestRenderer.create(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} />
        </CalendarConfigProvider>,
      );

      const calendarInstance = testInstance.root.findByType(CalendarDays);

      expect(calendarInstance.type).toBe(CalendarDays);
    });

    modes.forEach((mode) => {
      const calendar = calendars[mode];

      it(`should render ${calendars[mode].name} when mode=${mode}`, () => {
        const testInstance = TestRenderer.create(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <Calendar
              referenceDate={moment().toISOString()}
              mode={mode}
            />
          </CalendarConfigProvider>,
        );

        const calendarInstance = testInstance.root.findByType(calendar);

        expect(calendarInstance.type).toBe(calendar);
      });
    });

    describe('props should be passed to corresponded calendar', () => {
      it('case: mode="day"', () => {
        const isDateDisabled = jest.fn();
        const isDateInRange = jest.fn();
        const onChange = jest.fn();
        const onDateHover = jest.fn();
        const referenceDate = moment().toISOString();
        const displayWeekDayLocale = 'zh-TW';
        const testInstance = TestRenderer.create(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <Calendar
              mode="day"
              referenceDate={referenceDate}
              isDateDisabled={isDateDisabled}
              isDateInRange={isDateInRange}
              onDateHover={onDateHover}
              displayWeekDayLocale={displayWeekDayLocale}
              onChange={onChange}
            />
          </CalendarConfigProvider>,
        );
        const calendarInstance = testInstance.root.findByType(CalendarDays);

        expect(calendarInstance.props.isDateDisabled).toBe(isDateDisabled);
        expect(calendarInstance.props.isDateInRange).toBe(isDateInRange);
        expect(calendarInstance.props.onClick).toBe(onChange);
        expect(calendarInstance.props.onDateHover).toBe(onDateHover);
        expect(calendarInstance.props.referenceDate).toBe(referenceDate);
        expect(calendarInstance.props.displayWeekDayLocale).toBe(displayWeekDayLocale);
      });

      it('case: mode="week"', () => {
        const isWeekDisabled = jest.fn();
        const isWeekInRange = jest.fn();
        const onChange = jest.fn();
        const onWeekHover = jest.fn();
        const referenceDate = moment().toISOString();
        const displayWeekDayLocale = 'zh-TW';
        const testInstance = TestRenderer.create(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <Calendar
              mode="week"
              referenceDate={referenceDate}
              isWeekDisabled={isWeekDisabled}
              isWeekInRange={isWeekInRange}
              onWeekHover={onWeekHover}
              displayWeekDayLocale={displayWeekDayLocale}
              onChange={onChange}
            />
          </CalendarConfigProvider>,
        );
        const calendarInstance = testInstance.root.findByType(CalendarWeeks);

        expect(calendarInstance.props.isWeekDisabled).toBe(isWeekDisabled);
        expect(calendarInstance.props.isWeekInRange).toBe(isWeekInRange);
        expect(calendarInstance.props.onClick).toBe(onChange);
        expect(calendarInstance.props.onWeekHover).toBe(onWeekHover);
        expect(calendarInstance.props.referenceDate).toBe(referenceDate);
        expect(calendarInstance.props.displayWeekDayLocale).toBe(displayWeekDayLocale);
      });

      it('case: mode="month"', () => {
        const isMonthDisabled = jest.fn();
        const isMonthInRange = jest.fn();
        const onChange = jest.fn();
        const onMonthHover = jest.fn();
        const referenceDate = moment().toISOString();
        const testInstance = TestRenderer.create(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <Calendar
              mode="month"
              referenceDate={referenceDate}
              isMonthDisabled={isMonthDisabled}
              isMonthInRange={isMonthInRange}
              onMonthHover={onMonthHover}
              onChange={onChange}
            />
          </CalendarConfigProvider>,
        );
        const calendarInstance = testInstance.root.findByType(CalendarMonths);

        expect(calendarInstance.props.isMonthDisabled).toBe(isMonthDisabled);
        expect(calendarInstance.props.isMonthInRange).toBe(isMonthInRange);
        expect(calendarInstance.props.onClick).toBe(onChange);
        expect(calendarInstance.props.onMonthHover).toBe(onMonthHover);
        expect(calendarInstance.props.referenceDate).toBe(referenceDate);
      });

      it('case: mode="year"', () => {
        const isYearDisabled = jest.fn();
        const isYearInRange = jest.fn();
        const onChange = jest.fn();
        const onYearHover = jest.fn();
        const referenceDate = moment().toISOString();
        const testInstance = TestRenderer.create(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <Calendar
              mode="year"
              referenceDate={referenceDate}
              isYearDisabled={isYearDisabled}
              isYearInRange={isYearInRange}
              onYearHover={onYearHover}
              onChange={onChange}
            />
          </CalendarConfigProvider>,
        );
        const calendarInstance = testInstance.root.findByType(CalendarYears);

        expect(calendarInstance.props.isYearDisabled).toBe(isYearDisabled);
        expect(calendarInstance.props.isYearInRange).toBe(isYearInRange);
        expect(calendarInstance.props.onClick).toBe(onChange);
        expect(calendarInstance.props.onYearHover).toBe(onYearHover);
        expect(calendarInstance.props.referenceDate).toBe(referenceDate);
      });
    });

    describe('should have relevant control buttons', () => {
      (['day', 'week'] as CalendarMode[]).forEach((mode) => {
        it(`should have month and year button if mode="${mode}", and receiving event handlers`, () => {
          const referenceDate = moment().toISOString();
          const displayMonthLocale = 'en-US';
          const displayMonthName = CalendarMethodsMoment.getMonthShortName(
            moment(referenceDate).month(), displayMonthLocale,
          );
          const onMonthControlClick = jest.fn();
          const onYearControlClick = jest.fn();
          const { getByText } = render(
            <CalendarConfigProvider methods={CalendarMethodsMoment}>
              <Calendar
                mode={mode}
                referenceDate={referenceDate}
                onMonthControlClick={onMonthControlClick}
                onYearControlClick={onYearControlClick}
              />
            </CalendarConfigProvider>,
          );

          const monthControlButton = getByText(displayMonthName);
          const yearControlButton = getByText(moment(referenceDate).year());

          expect(monthControlButton).toBeInstanceOf(HTMLButtonElement);
          expect(yearControlButton).toBeInstanceOf(HTMLButtonElement);

          fireEvent.click(monthControlButton);
          expect(onMonthControlClick).toBeCalledTimes(1);

          fireEvent.click(yearControlButton);
          expect(onYearControlClick).toBeCalledTimes(1);
        });
      });

      it('should have year button if mode="month", and receiving event handlers', () => {
        const referenceDate = moment().toISOString();
        const onYearControlClick = jest.fn();
        const { getByText } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <Calendar
              mode="month"
              referenceDate={referenceDate}
              onYearControlClick={onYearControlClick}
            />
          </CalendarConfigProvider>,
        );

        const yearControlButton = getByText(moment(referenceDate).year());

        expect(yearControlButton).toBeInstanceOf(HTMLButtonElement);

        fireEvent.click(yearControlButton);
        expect(onYearControlClick).toBeCalledTimes(1);
      });

      it('should have a disabled year range button if mode="year"', () => {
        const referenceDate = moment().toISOString();
        const [start, end] = getYearRange(moment(referenceDate).year(), calendarYearModuler);
        const displayYearRange = `${start} - ${end}`;
        const onYearControlClick = jest.fn();
        const { getByText } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <Calendar
              mode="year"
              referenceDate={referenceDate}
              onYearControlClick={onYearControlClick}
            />
          </CalendarConfigProvider>,
        );

        const yearControlButton = getByText(displayYearRange);

        expect(yearControlButton).toBeInstanceOf(HTMLButtonElement);
        expect(yearControlButton.getAttribute('aria-disabled')).toBe('true');
        expect((yearControlButton as HTMLButtonElement).disabled).toBe(true);
      });
    });
  });

  describe('prop: onNext', () => {
    it('CalendarControls should reveive undefined on onNext if prop not provided', () => {
      const testInstance = TestRenderer.create(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} />
        </CalendarConfigProvider>,
      );

      const controlsInstance = testInstance.root.findByType(CalendarControls);

      expect(controlsInstance.props.onNext).toBe(undefined);
    });

    it('CalendarControls should reveive onNext if prop provided', () => {
      const onNext = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} onNext={onNext} />
        </CalendarConfigProvider>,
      );
      const hostElement = getHostHTMLElement();
      const nextButtonElement = hostElement.querySelector('.mzn-calendar-controls__next');

      expect(nextButtonElement).toBeInstanceOf(HTMLButtonElement);

      fireEvent.click(nextButtonElement!);

      expect(onNext).toBeCalledTimes(1);
    });
  });

  describe('prop: onPrev', () => {
    it('CalendarControls should reveive undefined on onPrev if this prop not provided', () => {
      const testInstance = TestRenderer.create(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} />
        </CalendarConfigProvider>,
      );

      const controlsInstance = testInstance.root.findByType(CalendarControls);

      expect(controlsInstance.props.onPrev).toBe(undefined);
    });

    it('CalendarControls should reveive onPrev if prop provided', () => {
      const onPrev = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} onPrev={onPrev} />
        </CalendarConfigProvider>,
      );
      const hostElement = getHostHTMLElement();
      const prevButtonElement = hostElement.querySelector('.mzn-calendar-controls__prev');

      expect(prevButtonElement).toBeInstanceOf(HTMLButtonElement);

      fireEvent.click(prevButtonElement!);

      expect(onPrev).toBeCalledTimes(1);
    });
  });

  describe('prop: value', () => {
    it('should be casted to array and pass to calendars', () => {
      const value = moment().toISOString();

      modes.forEach((mode) => {
        const calendar = calendars[mode];
        const testInstance = TestRenderer.create(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <Calendar
              referenceDate={moment().toISOString()}
              mode={mode}
              value={value}
            />
          </CalendarConfigProvider>,
        );
        const calendarInstance = testInstance.root.findByType(calendar);
        const valueProp = calendarInstance.props.value;

        expect(valueProp).toBeInstanceOf(Array);
        expect((valueProp as any[]).includes(value));
      });
    });
  });
});
