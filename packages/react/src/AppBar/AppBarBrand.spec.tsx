import { cleanup, cleanupHook, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import AppBarBrand from './AppBarBrand';

describe('<AppBarBrand />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<AppBarBrand ref={ref} />),
  );

  describe('prop: children', () => {
    it('should render children', () => {
      const children = 'foo';
      const { getHostHTMLElement } = render(
        <AppBarBrand>{children}</AppBarBrand>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toBe(children);
    });
  });
});
