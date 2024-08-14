import { cleanup, fireEvent, render, RenderResult } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Tag, { TagSize } from '.';
import ConfigProvider from '../Provider';

describe('<Tag />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLSpanElement, (ref) =>
    render(<Tag ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Tag className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Tag>Hello</Tag>);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-tag')).toBeTruthy();
  });

  it('should render the text and wrap it by button label rendered by span', () => {
    const { getHostHTMLElement, getByText } = render(<Tag>Hello</Tag>);
    const element = getHostHTMLElement();
    const labelElement = getByText('Hello');

    expect(element.textContent).toBe('Hello');
    expect(labelElement.textContent).toBe('Hello');
    expect(labelElement.tagName.toLowerCase()).toBe('span');
    expect(labelElement.classList.contains('mzn-tag__label')).toBeTruthy();
  });

  describe('prop: closable', () => {
    function testClosable(result: RenderResult, closable: boolean) {
      const element = result.getHostHTMLElement();
      const { lastElementChild } = element;

      if (closable) {
        expect(lastElementChild!.tagName.toLowerCase()).toBe('i');
        expect(
          lastElementChild!.classList.contains('mzn-tag__close-icon'),
        ).toBeTruthy();
      } else {
        expect(lastElementChild!.tagName.toLowerCase()).toBe('span');
        expect(
          lastElementChild!.classList.contains('mzn-tag__label'),
        ).toBeTruthy();
      }
    }

    it('should render closable=false by default', () => {
      const result = render(<Tag />);

      testClosable(result, false);
    });

    it('should add close icon if closable=true, or not', () => {
      [false, true].forEach((closable) => {
        const result = render(<Tag closable={closable} />);

        testClosable(result, closable);
      });
    });
  });

  describe('prop: disabled', () => {
    it('should render disabled=false by default', () => {
      const { getHostHTMLElement } = render(<Tag />);
      const element = getHostHTMLElement();

      expect(element.getAttribute('aria-disabled')).toBe(`${false}`);
    });

    it('should has aria-disabled attributes', () => {
      [false, true].forEach((disabled) => {
        const { getHostHTMLElement } = render(<Tag disabled={disabled} />);
        const element = getHostHTMLElement();

        expect(element.getAttribute('aria-disabled')).toBe(`${disabled}`);
      });
    });

    it('aria-disabled from props should not override', () => {
      const { getHostHTMLElement } = render(
        <Tag aria-disabled={false} disabled />,
      );
      const element = getHostHTMLElement();

      expect(element.getAttribute('aria-disabled')).toBeTruthy();
    });
  });

  describe('prop: onClose', () => {
    it('should be fired after close icon clicked', () => {
      const onClose = jest.fn();
      const { getHostHTMLElement } = render(<Tag closable onClose={onClose} />);
      const element = getHostHTMLElement();
      const { lastElementChild: closeIconElement } = element;

      fireEvent.click(closeIconElement!);

      expect(onClose).toBeCalledTimes(1);
    });

    it('should be fired if disabled=true', () => {
      const onClose = jest.fn();
      const { getHostHTMLElement } = render(
        <Tag closable disabled onClose={onClose} />,
      );
      const element = getHostHTMLElement();
      const { lastElementChild: closeIconElement } = element;

      fireEvent.click(closeIconElement!);

      expect(onClose).not.toBeCalled();
    });
  });

  describe('prop: size', () => {
    it('should render size="medium" by default', () => {
      const { getHostHTMLElement } = render(<Tag />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-tag--medium')).toBeTruthy();
    });

    it('should accept ConfigProvider context size changes', () => {
      const { getHostHTMLElement } = render(
        <ConfigProvider size="large">
          <Tag />
        </ConfigProvider>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-tag--large')).toBeTruthy();
    });

    const sizes: TagSize[] = ['small', 'medium', 'large'];

    sizes.forEach((size) => {
      it(`should add class if size="${size}"`, () => {
        const { getHostHTMLElement } = render(<Tag size={size} />);
        const element = getHostHTMLElement();

        expect(element.classList.contains(`mzn-tag--${size}`)).toBeTruthy();
      });
    });
  });
});
