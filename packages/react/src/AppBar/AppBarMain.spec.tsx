import { cleanup, cleanupHook, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import AppBarMain from './AppBarMain';

describe('<AppBarMain />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<AppBarMain ref={ref} />),
  );

  describe('prop: children', () => {
    it('should render children', () => {
      const children = 'foo';
      const { getHostHTMLElement } = render(
        <AppBarMain>{children}</AppBarMain>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toBe(children);
    });
  });
});
