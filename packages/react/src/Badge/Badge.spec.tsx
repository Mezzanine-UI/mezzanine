import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Badge from '.';

describe('<Badge />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLSpanElement, (ref) =>
    render(<Badge variant="dot-success" ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Badge variant="dot-success" className={className} />),
  );

  it('should bind content class', () => {
    const { getHostHTMLElement } = render(
      <Badge variant="dot-success">No Data</Badge>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-badge')).toBeTruthy();
  });

  it('should append variant class', () => {
    const variant = 'count-alert';
    const { getHostHTMLElement } = render(<Badge variant={variant}>foo</Badge>);
    const element = getHostHTMLElement();

    expect(element.classList.contains(`mzn-badge--${variant}`)).toBeTruthy();
  });

  describe('prop: children', () => {
    it('should render children by a span', () => {
      const { getHostHTMLElement } = render(
        <Badge variant="dot-success">foo</Badge>,
      );
      const element = getHostHTMLElement();

      expect(element.tagName.toLowerCase()).toBe('span');
    });

    it('should keep children when overflowCount is not provided', () => {
      const count = 120;
      const { getHostHTMLElement } = render(
        <Badge variant="count-alert">{count}</Badge>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toBe(`${count}`);
    });

    it('should not shown if count is 0', () => {
      const count = 0;
      const { getHostHTMLElement } = render(
        <Badge variant="count-alert">{count}</Badge>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-badge--hide')).toBeTruthy();
    });

    it('should render overflowCount with a "+" sign if count > overflowCount', () => {
      const count = 999;
      const overflowCount = 99;
      const { getHostHTMLElement } = render(
        <Badge variant="count-alert" overflowCount={overflowCount}>
          {count}
        </Badge>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toBe(`${overflowCount}+`);
    });

    it('should handle numeric string when overflowCount is provided', () => {
      const overflowCount = 99;
      const count = '120';
      const { getHostHTMLElement } = render(
        <Badge overflowCount={overflowCount} variant="count-alert">
          {count}
        </Badge>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toBe(`${overflowCount}+`);
    });

    it('should render count if count <= overflowCount', () => {
      const count = 5;
      const overflowCount = 99;
      const { getHostHTMLElement } = render(
        <Badge variant="count-alert" overflowCount={overflowCount}>
          {count}
        </Badge>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toBe(`${count}`);
    });

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

    it('should bypass overflow logic when children is non-numeric', () => {
      const content = 'N/A';
      const { getHostHTMLElement } = render(
        <Badge variant="count-alert">{content}</Badge>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toBe(content);
      expect(element.classList.contains('mzn-badge--hide')).toBeFalsy();
    });

    it('should not hide dot variant when children is 0', () => {
      const { getHostHTMLElement } = render(
        <Badge variant="dot-success">0</Badge>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-badge--hide')).toBeFalsy();
    });
  });

  it('should forward rest props to host element', () => {
    const { getHostHTMLElement } = render(
      <Badge aria-label="badge" data-testid="badge" variant="dot-success">
        foo
      </Badge>,
    );
    const element = getHostHTMLElement();

    expect(element.getAttribute('aria-label')).toBe('badge');
    expect(element.dataset.testid).toBe('badge');
  });
});
