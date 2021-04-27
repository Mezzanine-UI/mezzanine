import {
  cleanup,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import PageFooter from '.';

describe('<PageFooter />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLElement,
    (ref) => render(<PageFooter ref={ref} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<PageFooter className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<PageFooter />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-page-footer')).toBeTruthy();
  });

  describe('prop: children', () => {
    it('should render children wrapped by div', () => {
      const { getHostHTMLElement } = render(<PageFooter>children</PageFooter>);
      const element = getHostHTMLElement();
      const { firstElementChild: actionWrapperElement } = element;

      expect(actionWrapperElement!.textContent).toBe('children');
      expect(actionWrapperElement!.tagName.toLowerCase()).toBe('div');
    });
  });

  describe('prop: actionClassName', () => {
    it('should bind class to the div wrapped children', () => {
      const className = 'foo';

      const { getHostHTMLElement } = render(<PageFooter actionClassName={className} />);
      const element = getHostHTMLElement();
      const { firstElementChild: actionWrapperElement } = element;

      expect(actionWrapperElement!.classList.contains('foo')).toBeTruthy();
    });
  });
});
