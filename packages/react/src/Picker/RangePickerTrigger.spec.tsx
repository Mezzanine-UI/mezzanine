import { createRef } from 'react';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { CalendarConfigProvider } from '../Calendar';
import { RangePickerTrigger } from '.';

describe('<RangePickerTrigger />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <RangePickerTrigger ref={ref} format="YYYY-MM-DD" />
      </CalendarConfigProvider>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <RangePickerTrigger className={className} format="YYYY-MM-DD" />
      </CalendarConfigProvider>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <RangePickerTrigger format="YYYY-MM-DD" />
      </CalendarConfigProvider>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-picker')).toBeTruthy();
  });

  describe('prop: inputFromRef', () => {
    it('should bind to input element', () => {
      const ref = createRef<HTMLInputElement>();

      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <RangePickerTrigger inputFromRef={ref} format="YYYY-MM-DD" />
        </CalendarConfigProvider>,
      );

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('prop: inputToRef', () => {
    it('should bind to input element', () => {
      const ref = createRef<HTMLInputElement>();

      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <RangePickerTrigger inputToRef={ref} format="YYYY-MM-DD" />
        </CalendarConfigProvider>,
      );

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('prop disabled, placeholder, readOnly, required should directly pass to native input element', () => {
    const inputFromPlaceholder = 'inputFromPlaceholder';
    const inputToPlaceholder = 'inputToPlaceholder';

    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <RangePickerTrigger
          disabled
          format="YYYY-MM-DD"
          inputFromPlaceholder={inputFromPlaceholder}
          inputToPlaceholder={inputToPlaceholder}
          readOnly
          required
        />
      </CalendarConfigProvider>,
    );
    const element = getHostHTMLElement();
    const [inputFromElement, inputToElement] =
      element.getElementsByTagName('input');

    expect(inputFromElement.getAttribute('aria-disabled')).toBe('true');
    expect(inputFromElement.getAttribute('aria-multiline')).toBe('false');
    expect(inputFromElement.getAttribute('aria-readonly')).toBe('true');
    expect(inputFromElement.hasAttribute('disabled')).toBe(true);
    expect(inputFromElement.getAttribute('placeholder')).toBe(
      inputFromPlaceholder,
    );
    expect(inputFromElement.hasAttribute('readonly')).toBe(true);

    expect(inputToElement.getAttribute('aria-disabled')).toBe('true');
    expect(inputToElement.getAttribute('aria-multiline')).toBe('false');
    expect(inputToElement.getAttribute('aria-readonly')).toBe('true');
    expect(inputToElement.hasAttribute('disabled')).toBe(true);
    expect(inputToElement.getAttribute('placeholder')).toBe(inputToPlaceholder);
    expect(inputToElement.hasAttribute('readonly')).toBe(true);
  });
});
