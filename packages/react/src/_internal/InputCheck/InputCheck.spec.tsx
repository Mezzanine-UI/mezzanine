import { cleanup, render } from '../../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../../__test-utils__/common';
import InputCheck, { InputCheckSize } from '.';

describe('<InputCheck />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLLabelElement, (ref) =>
    render(<InputCheck ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<InputCheck className={className} />),
  );

  it('should rendered by <label /> and bind host class', () => {
    const { getHostHTMLElement } = render(<InputCheck />);
    const element = getHostHTMLElement();

    expect(element.tagName.toLowerCase()).toBe('label');
    expect(element.classList.contains('mzn-input-check')).toBeTruthy();
  });

  it('should wrap control by <span />', () => {
    const { getHostHTMLElement } = render(
      <InputCheck control={<div data-test="foo" />} />,
    );
    const element = getHostHTMLElement();
    const { firstElementChild } = element;

    expect(
      firstElementChild!.classList.contains('mzn-input-check__control'),
    ).toBeTruthy();
    expect(
      firstElementChild!.firstElementChild!.getAttribute('data-test'),
    ).toBe('foo');
  });

  describe('prop: children', () => {
    it('should not render label span if children not passed', () => {
      const { getHostHTMLElement } = render(<InputCheck />);
      const element = getHostHTMLElement();
      const { lastElementChild, childElementCount } = element;

      expect(
        element.classList.contains('mzn-input-check--with-label'),
      ).toBeFalsy();
      expect(
        lastElementChild!.classList.contains('mzn-input-check__label'),
      ).toBeFalsy();
      expect(childElementCount).toBe(1);
    });

    it('should wrap children by label span if children passed', () => {
      const { getHostHTMLElement } = render(<InputCheck>foo</InputCheck>);
      const element = getHostHTMLElement();
      const { lastElementChild: labelElement, childElementCount } = element;

      expect(
        element.classList.contains('mzn-input-check--with-label'),
      ).toBeTruthy();
      expect(
        labelElement!.classList.contains('mzn-input-check__label'),
      ).toBeTruthy();
      expect(childElementCount).toBe(2);
    });
  });

  describe('prop: disabled', () => {
    [false, true].forEach((disabled) => {
      const message = disabled
        ? 'should bind disabled class if disabled=true'
        : 'should not bind disabled class if disabled=false';

      it(message, () => {
        const { getHostHTMLElement } = render(
          <InputCheck disabled={disabled} />,
        );
        const element = getHostHTMLElement();

        expect(element.classList.contains('mzn-input-check--disabled')).toBe(
          disabled,
        );
      });
    });
  });

  describe('prop: error', () => {
    [false, true].forEach((error) => {
      const message = error
        ? 'should bind error class if error=true'
        : 'should not bind error class if error=false';

      it(message, () => {
        const { getHostHTMLElement } = render(<InputCheck error={error} />);
        const element = getHostHTMLElement();

        expect(element.classList.contains('mzn-input-check--error')).toBe(
          error,
        );
      });
    });
  });

  describe('prop: size', () => {
    it('should render size="medium" by default', () => {
      const { getHostHTMLElement } = render(<InputCheck />);
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-input-check--medium'),
      ).toBeTruthy();
    });

    const sizes: InputCheckSize[] = ['small', 'medium', 'large'];

    sizes.forEach((size) => {
      it(`should add class if size="${size}"`, () => {
        const { getHostHTMLElement } = render(<InputCheck size={size} />);
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-input-check--${size}`),
        ).toBeTruthy();
      });
    });
  });
});
