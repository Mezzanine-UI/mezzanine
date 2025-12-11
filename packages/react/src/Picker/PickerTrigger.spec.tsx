import { createRef } from 'react';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { CalendarConfigProvider } from '../Calendar';
import { PickerTrigger } from '.';

describe('<PickerTrigger />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <PickerTrigger ref={ref} format="YYYY-MM-DD" />
      </CalendarConfigProvider>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <PickerTrigger className={className} format="YYYY-MM-DD" />
      </CalendarConfigProvider>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <PickerTrigger format="YYYY-MM-DD" />
      </CalendarConfigProvider>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-picker')).toBeTruthy();
  });

  describe('prop: inputRef', () => {
    it('should bind to input element', () => {
      const ref = createRef<HTMLInputElement>();

      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <PickerTrigger inputRef={ref} format="YYYY-MM-DD" />
        </CalendarConfigProvider>,
      );

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('prop disabled, placeholder, readOnly, required should directly pass to native input element', () => {
    const placeholder = 'placeholder';

    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <PickerTrigger
          disabled
          placeholder={placeholder}
          readOnly
          required
          format="YYYY-MM-DD"
        />
      </CalendarConfigProvider>,
    );
    const element = getHostHTMLElement();
    const inputElement = element.getElementsByTagName('input')[0];

    expect(inputElement.getAttribute('aria-disabled')).toBe('true');
    expect(inputElement.getAttribute('aria-multiline')).toBe('false');
    expect(inputElement.getAttribute('aria-readonly')).toBe('true');
    expect(inputElement.hasAttribute('disabled')).toBe(true);
    expect(inputElement.getAttribute('placeholder')).toBe(placeholder);
    expect(inputElement.hasAttribute('readonly')).toBe(true);
  });
});
