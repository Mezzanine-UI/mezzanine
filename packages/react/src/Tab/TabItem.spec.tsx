import { tabClasses } from '@mezzanine-ui/core/tab';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import TabItem from './TabItem';

describe('<TabItem />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLButtonElement, (ref) =>
    render(<TabItem ref={ref}>tab</TabItem>),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<TabItem className={className}>tab</TabItem>),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<TabItem>tab</TabItem>);
    const element = getHostHTMLElement();

    expect(element.classList.contains(tabClasses.tabItem)).toBeTruthy();
  });

  it('should wrap children by button', () => {
    const { getHostHTMLElement } = render(<TabItem>tab</TabItem>);
    const element = getHostHTMLElement();

    expect(element.tagName.toLowerCase()).toBe('button');
    expect(element.textContent).toBe('tab');
  });

  describe('prop: active', () => {
    it('should render active=false by default', () => {
      const { getHostHTMLElement } = render(<TabItem>tab</TabItem>);
      const element = getHostHTMLElement();

      expect(element.classList.contains(tabClasses.tabItemActive)).toBeFalsy();
    });

    it('should be inactive if active=false', () => {
      const { getHostHTMLElement } = render(
        <TabItem active={false}>tab</TabItem>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains(tabClasses.tabItemActive)).toBe(false);
    });

    it('should be active if active=true', () => {
      const { getHostHTMLElement } = render(<TabItem active>tab</TabItem>);
      const element = getHostHTMLElement();

      expect(element.classList.contains(tabClasses.tabItemActive)).toBe(true);
    });
  });

  describe('prop: disabled', () => {
    it('should not have disabled attribute by default', () => {
      const { getHostHTMLElement } = render(<TabItem>tab</TabItem>);
      const element = getHostHTMLElement();

      expect(element.hasAttribute('disabled')).toBe(false);
      expect(element.getAttribute('aria-disabled')).toBe('false');
    });

    it('should have disabled and aria-disabled attributes when disabled=true', () => {
      const { getHostHTMLElement } = render(<TabItem disabled>tab</TabItem>);
      const element = getHostHTMLElement();

      expect(element.hasAttribute('disabled')).toBe(true);
      expect(element.getAttribute('aria-disabled')).toBe('true');
    });

    it('should not have disabled attribute when disabled=false', () => {
      const { getHostHTMLElement } = render(
        <TabItem disabled={false}>tab</TabItem>,
      );
      const element = getHostHTMLElement();

      expect(element.hasAttribute('disabled')).toBe(false);
      expect(element.getAttribute('aria-disabled')).toBe('false');
    });

    it('should override aria-disabled from props', () => {
      const { getHostHTMLElement } = render(
        <TabItem aria-disabled={false} disabled>
          tab
        </TabItem>,
      );
      const element = getHostHTMLElement();

      expect(element.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('prop: onClick', () => {
    it('should call onClick handler when clicked', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <TabItem onClick={onClick}>tab</TabItem>,
      );
      const element = getHostHTMLElement();

      element.click();

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <TabItem disabled onClick={onClick}>
          tab
        </TabItem>,
      );
      const element = getHostHTMLElement();

      element.click();

      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
