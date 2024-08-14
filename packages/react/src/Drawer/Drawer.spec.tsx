import {
  cleanup,
  cleanupHook,
  render,
  TestRenderer,
} from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import { SlideFade, SlideFadeDirection } from '../Transition';
import Drawer, { DrawerPlacement } from '.';

function getOverlayElement(container: HTMLElement = document.body) {
  return container?.querySelector('.mzn-overlay');
}

function getDrawerElement(container: HTMLElement = document.body) {
  return getOverlayElement(container)?.querySelector('.mzn-drawer');
}

window.scrollTo = jest.fn();

describe('<Drawer />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Drawer ref={ref} open />),
  );

  it('should bind host class and append className from prop to drawer element', () => {
    const className = 'foo';

    render(
      <Drawer className={className} open>
        foo
      </Drawer>,
    );

    const drawerElement = getDrawerElement()!;

    expect(drawerElement.classList.contains(className)).toBeTruthy();
  });

  describe('prop: open', () => {
    it('should render children if open=true', () => {
      render(<Drawer open>foo</Drawer>);

      const drawerElement = getDrawerElement()!;

      expect(drawerElement).toBeInstanceOf(Node);
      expect(drawerElement.textContent).toBe('foo');
    });
  });

  describe('prop: placement', () => {
    const placements: DrawerPlacement[] = ['top', 'right', 'bottom', 'left'];

    placements.forEach((placement) => {
      const props = {
        placement,
        open: true,
      };

      it(`should bind ${placement} class if placement="${placement}"`, () => {
        render(<Drawer {...props} />);

        const drawerElement = getDrawerElement()!;

        expect(
          drawerElement.classList.contains(`mzn-drawer--${placement}`),
        ).toBeTruthy();
      });

      const slideFadeDirection: { [index: string]: SlideFadeDirection } = {
        top: 'down',
        left: 'right',
        right: 'left',
        bottom: 'up',
      };

      it(`should bind correct direction to SlideFade component direction="${slideFadeDirection[placement]}"`, () => {
        const testRender = TestRenderer.create(
          <Drawer placement={placement} open disablePortal />,
        );
        const slideFadeInstance = testRender.root.findByType(SlideFade);

        expect(slideFadeInstance.props.direction).toBe(
          slideFadeDirection[placement],
        );
      });
    });
  });
});
