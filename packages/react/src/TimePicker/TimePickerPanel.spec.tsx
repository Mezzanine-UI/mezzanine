import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { cleanup, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import { CalendarConfigProvider } from '../Calendar';
import { TimePickerPanel } from '.';

describe('<TimePickerPanel />', () => {
  Element.prototype.scrollTo = () => {};

  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <TimePickerPanel ref={ref} open />
      </CalendarConfigProvider>,
    ),
  );
});
