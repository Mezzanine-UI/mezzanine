import { createRef } from 'react';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { PickerTrigger } from '.';

describe('<PickerTrigger />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<PickerTrigger ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<PickerTrigger className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<PickerTrigger />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-picker')).toBeTruthy();
  });

  describe('prop: inputRef', () => {
    it('should bind to input element', () => {
      const ref = createRef<HTMLInputElement>();

      render(<PickerTrigger inputRef={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('prop disabled, placeholder, readOnly, required should directly pass to native input element', () => {
    const placeholder = 'placeholder';

    const { getHostHTMLElement } = render(
      <PickerTrigger disabled placeholder={placeholder} readOnly required />,
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
