/* eslint-disable @typescript-eslint/no-namespace */

import { CalendarMethodsMoment, DateType } from '@mezzanine-ui/core/calendar';
import moment from 'moment';
import { getUnitLabel } from '@mezzanine-ui/core/time-panel';
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
import TimePanel, { TimePanelColumn } from '.';
import { CalendarConfigProvider } from '../Calendar';
import { TimePanelProps } from './TimePanel';

describe('<TimePanel />', () => {
  Element.prototype.scrollTo = () => {};

  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <TimePanel ref={ref} />
      </CalendarConfigProvider>,
    ),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(
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
    it('should by default display hours, minutes and seconds column with default prefixes', () => {
      const { root } = TestRenderer.create(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimePanel />
        </CalendarConfigProvider>,
      );

      const columnInstances = root.findAllByType(TimePanelColumn);

      columnInstances.forEach((instance) => {
        expect(instance).not.toBe(null || undefined);
        expect(instance.children).not.toBe(null);
      });

      const shouldHaveHourPrefix = columnInstances.some((instance) => instance.props.prefix === 'Hrs');
      const shouldHaveMinutePrefix = columnInstances.some((instance) => instance.props.prefix === 'Min');
      const shouldHaveSecondPrefix = columnInstances.some((instance) => instance.props.prefix === 'Sec');

      expect(shouldHaveHourPrefix).toBe(true);
      expect(shouldHaveMinutePrefix).toBe(true);
      expect(shouldHaveSecondPrefix).toBe(true);
    });

    it('should hide hour column if hideHour=true', () => {
      const { queryByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimePanel hideHour />
        </CalendarConfigProvider>,
      );

      const hourColumnElement = queryByText('Hrs');

      expect(hourColumnElement).toBe(null);
    });

    it('should hide minute column if hideMinute=true', () => {
      const { queryByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimePanel hideMinute />
        </CalendarConfigProvider>,
      );

      const minuteColumnElement = queryByText('Min');

      expect(minuteColumnElement).toBe(null);
    });

    it('should hide second column if hideSecond=true', () => {
      const { queryByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimePanel hideSecond />
        </CalendarConfigProvider>,
      );

      const secondColumnElement = queryByText('Sec');

      expect(secondColumnElement).toBe(null);
    });
  });

  describe('prop: onChange', () => {
    it('columns should not have onPrev or onNext if onChange is not provided', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimePanel />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const controlElements = element.querySelectorAll('.mzn-time-panel-column__control-button');

      controlElements.forEach((controlElement) => {
        expect((controlElement as HTMLButtonElement).onclick).toBe(null);
      });
    });

    it('columns should have onPrev or onNext if onChange is provided', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <TimePanel onChange={onChange} />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const controlElements = element.querySelectorAll('.mzn-time-panel-column__control-button');

      controlElements.forEach((controlElement) => {
        fireEvent.click(controlElement);
        expect(onChange).toBeCalledTimes(1);
        onChange.mockClear();
      });
    });

    describe('column controls', () => {
      // eslint-disable-next-line max-len
      it('controls should fire onChange with `DateType` that indicates start of day as its argument if no value', () => {
        function isStartOfDay(val: string) {
          const valTimeString = moment(val).format('HH:mm:ss');

          return valTimeString === moment().startOf('day').format('HH:mm:ss');
        }

        const onChange = jest.fn(isStartOfDay);
        const { getHostHTMLElement } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <TimePanel onChange={onChange} />
          </CalendarConfigProvider>,
        );
        const element = getHostHTMLElement();
        const controlElements = element.querySelectorAll('.mzn-time-panel-column__control-button');

        controlElements.forEach((controlElement) => {
          fireEvent.click(controlElement);
          expect(onChange).toHaveReturnedWith(true);
          onChange.mockClear();
        });
      });

      describe('controls should loop through every unit', () => {
        function TestTimePanel({
          value,
          onChange,
        }: {
          value: DateType,
          onChange: TimePanelProps['onChange']
        }) {
          return (
            <CalendarConfigProvider methods={CalendarMethodsMoment}>
              <TimePanel value={value} onChange={onChange} />
            </CalendarConfigProvider>
          );
        }

        for (let i = 0; i < 24; i += 1) {
          it(`prev control at ${getUnitLabel(i, 2)}:00:00`, () => {
            const displayHour = moment().startOf('day').hour(i).format('YYYY-MM-DD HH:mm:ss');
            const prevHour = (i - 1 >= 0 ? i - 1 : 24 + i - 1) % 24;
            const expectHour = moment().startOf('day').hour(prevHour).format('YYYY-MM-DD HH:mm:ss');

            function isSameTime(val: string) {
              const valTimeString = moment(val).format('YYYY-MM-DD HH:mm:ss');

              return valTimeString === expectHour;
            }

            const onChange = jest.fn(isSameTime);
            const { getByText } = render(
              <TestTimePanel value={displayHour} onChange={onChange} />,
            );
            const hourColumnElement = getByText('Hrs').parentNode;
            const [
              prevButtonElement,
            ] = hourColumnElement?.querySelectorAll('.mzn-time-panel-column__control-button') || [];

            expect(prevButtonElement).toBeInstanceOf(HTMLButtonElement);
            fireEvent.click(prevButtonElement);
            expect(onChange).toHaveReturnedWith(true);
          });

          it(`next control at ${getUnitLabel(i, 2)}:00:00`, () => {
            const displayHour = moment().startOf('day').hour(i).format('YYYY-MM-DD HH:mm:ss');
            const nextHour = (i + 1 >= 0 ? i + 1 : 24 + i + 1) % 24;
            const expectHour = moment().startOf('day').hour(nextHour).format('YYYY-MM-DD HH:mm:ss');

            function isSameTime(val: string) {
              const valTimeString = moment(val).format('YYYY-MM-DD HH:mm:ss');

              return valTimeString === expectHour;
            }

            const onChange = jest.fn(isSameTime);
            const { getByText } = render(
              <TestTimePanel value={displayHour} onChange={onChange} />,
            );
            const hourColumnElement = getByText('Hrs').parentNode;
            const [, nextButtonElement] = hourColumnElement?.querySelectorAll(
              '.mzn-time-panel-column__control-button',
            ) || [];

            expect(nextButtonElement).toBeInstanceOf(HTMLButtonElement);
            fireEvent.click(nextButtonElement);
            expect(onChange).toHaveReturnedWith(true);
          });
        }
      });
    });

    describe('onChange with units', () => {
      it('should not have click handler if onChange is not passed', () => {
        const { getHostHTMLElement } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <TimePanel />
          </CalendarConfigProvider>,
        );
        const element = getHostHTMLElement().parentNode;
        const unitElements = element?.querySelectorAll(
          '.mzn-time-panel-column__button',
        );

        expect(unitElements).not.toBe(undefined);
        expect(unitElements?.length).not.toBe(0);

        unitElements?.forEach((unitElement) => {
          expect((unitElement as HTMLButtonElement).onclick).toBe(null);
        });
      });

      for (let i = 0; i < 24; i += 1) {
        const expectHour = moment().startOf('day').hour(i);

        it(`should get ${getUnitLabel(i, 2)}:00:00`, () => {
          function isSameTime(val: string) {
            const valTimeString = moment(val).format('HH:mm:ss');

            return valTimeString === expectHour.format('HH:mm:ss');
          }

          const onChange = jest.fn(isSameTime);
          const { getByText } = render(
            <CalendarConfigProvider methods={CalendarMethodsMoment}>
              <TimePanel onChange={onChange} />
            </CalendarConfigProvider>,
          );
          const hourColumnElement = getByText('Hrs').parentNode;
          const unitElements = hourColumnElement?.querySelectorAll('.mzn-time-panel-column__button');

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
