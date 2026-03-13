import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import moment from 'moment';
import { getUnitLabel } from '@mezzanine-ui/core/time-panel';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import TimePanel from '.';
import { CalendarConfigProvider } from '../Calendar';

describe('<TimePanel />', () => {
  Element.prototype.scrollTo = () => {};

  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <TimePanel ref={ref} />
      </CalendarConfigProvider>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <TimePanel className={className} />
      </CalendarConfigProvider>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <TimePanel />
      </CalendarConfigProvider>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-time-panel')).toBeTruthy();
  });

  describe('display columns', () => {
    it('should by default display hours, minutes and seconds columns', () => {
      const { container } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimePanel />
        </CalendarConfigProvider>,
      );

      const columns = container.querySelectorAll('.mzn-time-panel-column');

      expect(columns.length).toBe(3);
    });

    it('should hide hour column if hideHour=true', () => {
      const { container } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimePanel hideHour />
        </CalendarConfigProvider>,
      );

      const columns = container.querySelectorAll('.mzn-time-panel-column');

      expect(columns.length).toBe(2);
    });

    it('should hide minute column if hideMinute=true', () => {
      const { container } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimePanel hideMinute />
        </CalendarConfigProvider>,
      );

      const columns = container.querySelectorAll('.mzn-time-panel-column');

      expect(columns.length).toBe(2);
    });

    it('should hide second column if hideSecond=true', () => {
      const { container } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimePanel hideSecond />
        </CalendarConfigProvider>,
      );

      const columns = container.querySelectorAll('.mzn-time-panel-column');

      expect(columns.length).toBe(2);
    });
  });

  describe('prop: onChange', () => {
    describe('onChange with units', () => {
      for (let i = 0; i < 24; i += 1) {
        const expectHour = moment().startOf('day').hour(i);

        it(`should get ${getUnitLabel(i, 2)}:00:00`, () => {
          function isSameTime(val: string) {
            const valTimeString = moment(val).format('HH:mm:ss');

            return valTimeString === expectHour.format('HH:mm:ss');
          }

          const onChange = jest.fn(isSameTime);
          const { container } = render(
            <CalendarConfigProvider methods={CalendarMethodsMoment}>
              <TimePanel onChange={onChange} />
            </CalendarConfigProvider>,
          );
          const hourColumnElement = container.querySelectorAll(
            '.mzn-time-panel-column',
          )[0];
          const unitElements = hourColumnElement?.querySelectorAll(
            '.mzn-time-panel-column__button',
          );

          expect(unitElements).not.toBe(undefined);
          expect(unitElements?.length).not.toBe(0);

          unitElements?.forEach((unitElement) => {
            if (unitElement.textContent === getUnitLabel(i, 2)) {
              fireEvent.click(unitElement);
              expect(onChange).toHaveReturnedWith(true);
            }
          });
        });
      }
    });
  });
});
