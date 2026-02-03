import { PlusIcon } from '@mezzanine-ui/icons';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import FloatingButton from '.';

describe('<FloatingButton />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<FloatingButton ref={ref}>Button</FloatingButton>),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<FloatingButton className={className}>Button</FloatingButton>),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <FloatingButton>Button</FloatingButton>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-floating-button')).toBeTruthy();
  });

  it('should render the text content', () => {
    const { getHostHTMLElement } = render(
      <FloatingButton>Hello</FloatingButton>,
    );
    const element = getHostHTMLElement();
    const button = element.querySelector('.mzn-floating-button__button');

    expect(button?.textContent).toBe('Hello');
  });

  it('should render button inside host element', () => {
    const { getHostHTMLElement } = render(
      <FloatingButton>Button</FloatingButton>,
    );
    const element = getHostHTMLElement();
    const button = element.querySelector('.mzn-floating-button__button');

    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(button?.classList.contains('mzn-button')).toBeTruthy();
  });

  describe('prop: icon', () => {
    it('should render icon when provided', () => {
      const { getHostHTMLElement } = render(
        <FloatingButton icon={PlusIcon} iconType="leading">
          Button
        </FloatingButton>,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector('[data-icon-name="plus"]');

      expect(iconElement).toBeInstanceOf(Element);
    });

    it('should render as icon-only button when iconType is icon-only', () => {
      const { getHostHTMLElement } = render(
        <FloatingButton icon={PlusIcon} iconType="icon-only">
          Button
        </FloatingButton>,
      );
      const element = getHostHTMLElement();
      const button = element.querySelector('.mzn-floating-button__button');

      expect(button?.textContent).toBe('');
    });
  });

  describe('prop: open', () => {
    it('should not add hidden class when open=false and autoHideWhenOpen=false', () => {
      const { getHostHTMLElement } = render(
        <FloatingButton open={false}>Button</FloatingButton>,
      );
      const element = getHostHTMLElement();
      const button = element.querySelector('.mzn-floating-button__button');

      expect(
        button?.classList.contains('mzn-floating-button__button--hidden'),
      ).toBeFalsy();
    });

    it('should not add hidden class when open=true and autoHideWhenOpen=false', () => {
      const { getHostHTMLElement } = render(
        <FloatingButton open>Button</FloatingButton>,
      );
      const element = getHostHTMLElement();
      const button = element.querySelector('.mzn-floating-button__button');

      expect(
        button?.classList.contains('mzn-floating-button__button--hidden'),
      ).toBeFalsy();
    });
  });

  describe('prop: autoHideWhenOpen', () => {
    it('should not add hidden class when autoHideWhenOpen=true and open=false', () => {
      const { getHostHTMLElement } = render(
        <FloatingButton autoHideWhenOpen open={false}>
          Button
        </FloatingButton>,
      );
      const element = getHostHTMLElement();
      const button = element.querySelector('.mzn-floating-button__button');

      expect(
        button?.classList.contains('mzn-floating-button__button--hidden'),
      ).toBeFalsy();
    });

    it('should add hidden class when autoHideWhenOpen=true and open=true', () => {
      const { getHostHTMLElement } = render(
        <FloatingButton autoHideWhenOpen open>
          Button
        </FloatingButton>,
      );
      const element = getHostHTMLElement();
      const button = element.querySelector('.mzn-floating-button__button');

      expect(
        button?.classList.contains('mzn-floating-button__button--hidden'),
      ).toBeTruthy();
    });
  });

  describe('prop: onClick', () => {
    it('should trigger onClick when button is clicked', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <FloatingButton onClick={onClick}>Button</FloatingButton>,
      );
      const element = getHostHTMLElement();
      const button = element.querySelector(
        '.mzn-floating-button__button',
      ) as HTMLButtonElement;

      fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: disabled', () => {
    it('should disable button when disabled=true', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <FloatingButton disabled onClick={onClick}>
          Button
        </FloatingButton>,
      );
      const element = getHostHTMLElement();
      const button = element.querySelector(
        '.mzn-floating-button__button',
      ) as HTMLButtonElement;

      expect(button.hasAttribute('disabled')).toBeTruthy();

      fireEvent.click(button);

      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
