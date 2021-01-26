import {
  cleanup,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import TextField from '.';

describe('<TextField />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<TextField ref={ref} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<TextField className={className} />),
  );

  describe('prop: multiple', () => {
    it('should add multiple style', () => {
      const { getHostHTMLElement } = render(<TextField multiple />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-text-field--multiple')).toBeTruthy();
    });
  });
});
