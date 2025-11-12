import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import DismissButton from './DismissButton';

describe('<DismissButton />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLButtonElement, (ref) =>
    render(<DismissButton ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<DismissButton className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<DismissButton />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-dismiss-button')).toBeTruthy();
  });

  it('should apply default type and variant classes', () => {
    const { getHostHTMLElement } = render(<DismissButton />);
    const element = getHostHTMLElement();

    expect(
      element.classList.contains('mzn-dismiss-button--type-standard'),
    ).toBeTruthy();
    expect(
      element.classList.contains('mzn-dismiss-button--variant-base'),
    ).toBeTruthy();
  });

  it('should render close icon', () => {
    const { getHostHTMLElement } = render(<DismissButton />);
    const element = getHostHTMLElement();
    const iconElement = element.querySelector('.mzn-dismiss-button__icon');

    expect(iconElement).toBeTruthy();
    expect(iconElement?.getAttribute('data-icon-name')).toBe('close');
  });

  it('should have aria-label="Close"', () => {
    const { getHostHTMLElement } = render(<DismissButton />);
    const element = getHostHTMLElement();

    expect(element.getAttribute('aria-label')).toBe('Close');
  });

  it('should have type="button"', () => {
    const { getHostHTMLElement } = render(<DismissButton />);
    const element = getHostHTMLElement();

    expect(element.getAttribute('type')).toBe('button');
  });

  describe('prop: type', () => {
    it('should apply embedded type class when type="embedded"', () => {
      const { getHostHTMLElement } = render(<DismissButton type="embedded" />);
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-dismiss-button--type-embedded'),
      ).toBeTruthy();
    });

    it('should default variant to contrast when type="embedded" and variant is not provided', () => {
      const { getHostHTMLElement } = render(<DismissButton type="embedded" />);
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-dismiss-button--variant-contrast'),
      ).toBeTruthy();
    });
  });

  describe('prop: variant', () => {
    it('should apply inverse variant class when variant="inverse"', () => {
      const { getHostHTMLElement } = render(
        <DismissButton type="standard" variant="inverse" />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-dismiss-button--variant-inverse'),
      ).toBeTruthy();
    });

    it('should apply emphasis variant class when variant="emphasis"', () => {
      const { getHostHTMLElement } = render(
        <DismissButton type="embedded" variant="emphasis" />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-dismiss-button--variant-emphasis'),
      ).toBeTruthy();
    });
  });

  describe('prop: onClick', () => {
    it('should call onClick when button is clicked', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <DismissButton onClick={onClick} />,
      );
      const element = getHostHTMLElement();

      fireEvent.click(element);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick if not provided', () => {
      const { getHostHTMLElement } = render(<DismissButton />);
      const element = getHostHTMLElement();

      expect(() => fireEvent.click(element)).not.toThrow();
    });
  });
});
