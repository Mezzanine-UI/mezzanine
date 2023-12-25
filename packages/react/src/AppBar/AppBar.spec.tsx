import {
  cleanup,
  cleanupHook,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import AppBar from './AppBar';
import AppBarBrand from './AppBarBrand';
import AppBarMain from './AppBarMain';
import AppBarSupport from './AppBarSupport';

describe('<AppBar />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(
    HTMLElement,
    (ref) => render(<AppBar ref={ref} />),
  );

  describe('prop: children', () => {
    it('should render correctly when only one child', async () => {
      const brandChildren = 'brand';

      const { getHostHTMLElement } = await render(
        <AppBar>
          <AppBarBrand>
            {brandChildren}
          </AppBarBrand>
        </AppBar>,
      );
      const element = getHostHTMLElement();
      const [firstElement] = element.childNodes;

      expect(element.childElementCount).toBe(1);
      expect(firstElement.textContent).toBe(brandChildren);
    });

    it('should ignore custom tag ordering and remain app bar relative components order', async () => {
      const brandChildren = 'brand';
      const supportChildren = 'support';
      const mainChildren = 'main';

      const { getHostHTMLElement } = await render(
        <AppBar>
          <div>
            {mainChildren}
          </div>
          <AppBarSupport>
            {supportChildren}
          </AppBarSupport>
          <AppBarBrand>
            {brandChildren}
          </AppBarBrand>
        </AppBar>,
      );
      const element = getHostHTMLElement();
      const [firstElement, secondElement, thirdElement] = element.childNodes;

      expect(element.childElementCount).toBe(3);
      expect(firstElement.textContent).toBe(mainChildren);
      expect(secondElement.textContent).toBe(brandChildren);
      expect(thirdElement.textContent).toBe(supportChildren);
    });

    it('should render correct components orders', async () => {
      const supportChildren = 'support';
      const mainChildren = 'main';
      const brandChildren = 'brand';

      const { getHostHTMLElement } = await render(
        <AppBar>
          <AppBarSupport>
            {supportChildren}
          </AppBarSupport>
          <AppBarMain>
            {mainChildren}
          </AppBarMain>
          <AppBarBrand>
            {brandChildren}
          </AppBarBrand>
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
