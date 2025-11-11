import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Badge from '.';

const queryBadgeHostElement = (container: Element): HTMLElement => {
  const host = container.querySelector('.mzn-badge');

  if (!host) {
    throw new Error('Badge host element not found');
  }

  return host as HTMLElement;
};

describe('<Badge />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLSpanElement, (ref) =>
    render(<Badge variant="count-alert" count={1} ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) => {
    const result = render(
      <Badge variant="count-alert" className={className} count={1} />,
    );

    return {
      ...result,
      getHostHTMLElement: <E extends Element = HTMLElement>() =>
        queryBadgeHostElement(result.getHostHTMLElement()) as unknown as E,
    };
  });

  it('should bind content class', () => {
    const { getHostHTMLElement } = render(
      <Badge variant="count-alert" count={1} />,
    );
    const element = queryBadgeHostElement(getHostHTMLElement());

    expect(element.classList.contains('mzn-badge')).toBeTruthy();
  });

  it('should append variant class', () => {
    const variant = 'count-alert';
    const { getHostHTMLElement } = render(
      <Badge variant={variant} count={1} />,
    );
    const element = queryBadgeHostElement(getHostHTMLElement());

    expect(element.classList.contains(`mzn-badge--${variant}`)).toBeTruthy();
  });

  describe('prop: count', () => {
    it('should render badge host as span', () => {
      const { getHostHTMLElement } = render(
        <Badge variant="count-alert" count={9} />,
      );
      const element = queryBadgeHostElement(getHostHTMLElement());

      expect(element.tagName.toLowerCase()).toBe('span');
    });

    it('should render count when overflowCount is not provided', () => {
      const count = 120;
      const { getHostHTMLElement } = render(
        <Badge count={count} variant="count-alert" />,
      );
      const element = queryBadgeHostElement(getHostHTMLElement());

      expect(element.textContent).toBe(`${count}`);
    });

    it('should not shown if count is 0', () => {
      const { getHostHTMLElement } = render(
        <Badge count={0} variant="count-alert" />,
      );
      const element = queryBadgeHostElement(getHostHTMLElement());

      expect(element.classList.contains('mzn-badge--hide')).toBeTruthy();
    });

    it('should render overflowCount with a "+" sign if count > overflowCount', () => {
      const count = 999;
      const overflowCount = 99;
      const { getHostHTMLElement } = render(
        <Badge
          count={count}
          overflowCount={overflowCount}
          variant="count-alert"
        />,
      );
      const element = queryBadgeHostElement(getHostHTMLElement());

      expect(element.textContent).toBe(`${overflowCount}+`);
    });

    it('should render count if count <= overflowCount', () => {
      const count = 5;
      const overflowCount = 99;
      const { getHostHTMLElement } = render(
        <Badge
          count={count}
          overflowCount={overflowCount}
          variant="count-alert"
        />,
      );
      const element = queryBadgeHostElement(getHostHTMLElement());

      expect(element.textContent).toBe(`${count}`);
    });
  });

  describe('prop: children', () => {
    it('should just wrap children', () => {
      const { getHostHTMLElement } = render(
        <Badge variant="dot-success">
          <div className="foo">foo</div>
        </Badge>,
      );
      const element = getHostHTMLElement();
      const fooElement = element.querySelector('.foo');

      expect(fooElement?.textContent).toBe('foo');
    });

    it('should not hide dot variant when children is 0', () => {
      const { getHostHTMLElement } = render(
        <Badge variant="dot-success">0</Badge>,
      );
      const element = queryBadgeHostElement(getHostHTMLElement());

      expect(element.classList.contains('mzn-badge--hide')).toBeFalsy();
    });
  });

  describe('prop: text', () => {
    it('should render text content for dot variant with text prop', () => {
      const text = 'States';
      const { getHostHTMLElement } = render(
        <Badge text={text} variant="dot-success" />,
      );
      const element = queryBadgeHostElement(getHostHTMLElement());

      expect(element.textContent).toBe(text);
    });
  });

  it('should forward rest props to host element', () => {
    const { getHostHTMLElement } = render(
      <Badge
        aria-label="badge"
        count={10}
        data-testid="badge"
        variant="count-alert"
      />,
    );
    const element = queryBadgeHostElement(getHostHTMLElement());

    expect(element.getAttribute('aria-label')).toBe('badge');
    expect(element.dataset.testid).toBe('badge');
  });
});
