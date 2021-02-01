import {
  cleanup,
  render,
} from '../../__test-utils__';
import {
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Badge from '.';

describe('<Badge />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<Badge className={className} />),
  );

  it('should bind content class', () => {
    const { getHostHTMLElement } = render(<Badge>No Data</Badge>);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-badge')).toBeTruthy();
  });

  describe('prop: children', () => {
    it('should render children by a span', () => {
      const { getHostHTMLElement } = render(<Badge>foo</Badge>);
      const element = getHostHTMLElement();

      expect(element.tagName.toLowerCase()).toBe('span');
    });

    it('should not shown if count is 0', () => {
      const count = 0;
      const { getHostHTMLElement } = render(<Badge>{count}</Badge>);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-badge--hide')).toBeTruthy();
    });

    it('should render overflowCount with a "+" sign if count > overflowCount', () => {
      const count = 999;
      const overflowCount = 99;
      const { getHostHTMLElement } = render(<Badge overflowCount={overflowCount}>{count}</Badge>);
      const element = getHostHTMLElement();

      expect(element.textContent).toBe(`${overflowCount}+`);
    });

    it('should render count if count <= overflowCount', () => {
      const count = 5;
      const overflowCount = 99;
      const { getHostHTMLElement } = render(<Badge overflowCount={overflowCount}>{count}</Badge>);
      const element = getHostHTMLElement();

      expect(element.textContent).toBe(`${count}`);
    });

    it('should just wrap children', () => {
      const { getHostHTMLElement } = render(<Badge><div className="foo">foo</div></Badge>);
      const element = getHostHTMLElement();
      const fooElement = element.querySelector('.foo');

      expect(fooElement?.textContent).toBe('foo');
    });
  });

  describe('prop: dot', () => {
    it('should render dot=false by default', () => {
      const { getHostHTMLElement } = render(<Badge />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-badge--dot')).toBeFalsy();
    });

    it('should append dot class if dot=false', () => {
      const { getHostHTMLElement } = render(<Badge dot={false} />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-badge--dot')).toBeFalsy();
    });

    it('should append dot class and render no children if dot=true', () => {
      const { getHostHTMLElement } = render(<Badge dot>0</Badge>);
      const element = getHostHTMLElement();
      const {
        firstElementChild,
        childElementCount,
      } = element;

      expect(firstElementChild).toBe(null);
      expect(childElementCount).toBe(0);
    });
  });
});
