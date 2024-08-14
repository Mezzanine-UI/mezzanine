import { cleanup, cleanupHook, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import AppBar from './AppBar';
import AppBarBrand from './AppBarBrand';
import AppBarMain from './AppBarMain';
import AppBarSupport from './AppBarSupport';

describe('<AppBar />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(HTMLElement, (ref) =>
    render(<AppBar ref={ref} />),
  );

  describe('prop: children', () => {
    it('should render correct components orders', async () => {
      const supportChildren = 'support';
      const mainChildren = 'main';
      const brandChildren = 'brand';

      const { getHostHTMLElement } = await render(
        <AppBar>
          <AppBarSupport>{supportChildren}</AppBarSupport>
          <AppBarMain>{mainChildren}</AppBarMain>
          <AppBarBrand>{brandChildren}</AppBarBrand>
        </AppBar>,
      );
      const element = getHostHTMLElement();
      const [firstElement, secondElement, thirdElement] = element.childNodes;

      expect(element.childElementCount).toBe(3);
      expect(firstElement.textContent).toBe(brandChildren);
      expect(secondElement.textContent).toBe(mainChildren);
      expect(thirdElement.textContent).toBe(supportChildren);
    });
  });
});
