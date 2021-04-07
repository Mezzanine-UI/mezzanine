import {
  cleanup,
  cleanupHook,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import AppBarSupport from './AppBarSupport';

describe('<AppBarSupport />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<AppBarSupport ref={ref} />),
  );

  describe('prop: children', () => {
    it('should render children', () => {
      const children = 'foo';
      const { getHostHTMLElement } = render(<AppBarSupport>{children}</AppBarSupport>);
      const element = getHostHTMLElement();

      expect(element.textContent).toBe(children);
    });
  });
});
