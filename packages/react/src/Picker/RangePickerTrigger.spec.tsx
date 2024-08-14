import { createRef } from 'react';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { RangePickerTrigger } from '.';

describe('<RangePickerTrigger />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<RangePickerTrigger ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<RangePickerTrigger className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<RangePickerTrigger />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-picker')).toBeTruthy();
  });

  describe('prop: inputFromRef', () => {
    it('should bind to input element', () => {
      const ref = createRef<HTMLInputElement>();

      render(<RangePickerTrigger inputFromRef={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('prop: inputToRef', () => {
    it('should bind to input element', () => {
      const ref = createRef<HTMLInputElement>();

      render(<RangePickerTrigger inputToRef={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('prop disabled, placeholder, readOnly, required should directly pass to native input element', () => {
    const inputFromPlaceholder = 'inputFromPlaceholder';
    const inputToPlaceholder = 'inputToPlaceholder';

    const { getHostHTMLElement } = render(
      <RangePickerTrigger
        disabled
        inputFromPlaceholder={inputFromPlaceholder}
        inputToPlaceholder={inputToPlaceholder}
        readOnly
        required
      />,
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
