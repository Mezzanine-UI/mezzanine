import {
  cleanup,
  cleanupHook,
  render,
  fireEvent,
  TestRenderer,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import Overlay from '../Overlay';
import { SlideFade, SlideFadeDirection } from '../Transition';
import Drawer, { DrawerPlacement } from '.';

function getOverlayElement(container: HTMLElement = document.body) {
  return container?.querySelector('.mzn-overlay');
}

function getBackdropElement(container: HTMLElement = document.body) {
  return getOverlayElement(container)?.querySelector('.mzn-overlay__backdrop');
}

function getDrawerElement(container: HTMLElement = document.body) {
  return getOverlayElement(container)?.querySelector('.mzn-drawer');
}

describe('<Drawer />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<Drawer ref={ref} open />),
  );

  it('should bind host class and append className from prop to drawer element', () => {
    const className = 'foo';

    render(
      <Drawer
        className={className}
        open
      >
        foo
      </Drawer>,
    );

    const drawerElement = getDrawerElement()!;

    expect(drawerElement.classList.contains(className)).toBeTruthy();
  });

  describe('escape key down', () => {
    it('should fire onClose while escape key pressed', () => {
      const onClose = jest.fn();

      render(<Drawer onClose={onClose} open />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toBeCalledTimes(1);
    });
  });

  describe('backdrop', () => {
    it('should fire onBackdropClick while backdrop clicked', () => {
      const onBackdropClick = jest.fn();

      render(<Drawer onBackdropClick={onBackdropClick} open />);

      const backdropElement = getBackdropElement()!;

      fireEvent.click(backdropElement);

      expect(onBackdropClick).toBeCalledTimes(1);
    });

    it('should fire onClose while backdrop clicked', () => {
      const onClose = jest.fn();

      render(<Drawer onClose={onClose} open />);

      const backdropElement = getBackdropElement()!;

      fireEvent.click(backdropElement);

      expect(onClose).toBeCalledTimes(1);
    });

    it('should not fire onClose while backdrop clicked if disableCloseOnBackdropClick=true', () => {
      const onClose = jest.fn();

      render(<Drawer disableCloseOnBackdropClick onClose={onClose} open />);

      const backdropElement = getDrawerElement()!;

      fireEvent.click(backdropElement);

      expect(onClose).not.toBeCalled();
    });
  });

  describe('overlay', () => {
    const props: {[index: string]: HTMLDivElement | boolean | VoidFunction} = {
      container: document.createElement('div'),
      disableCloseOnBackdropClick: true,
      disablePortal: true,
      hideBackdrop: true,
      onBackdropClick: () => {},
      onClose: () => {},
      open: true,
    };

    it(`should pass ${Object.keys(props).join(',')} to overlay`, () => {
      const testInstance = TestRenderer.create(
        <Drawer
          {...props}
        />,
      );

      const overlayInstance = testInstance.root.findByType(Overlay);

      Object.keys(props).forEach((prop) => {
        expect(overlayInstance.props[prop]).toBe(props[prop]);
      });
    });
  });

  describe('prop: open', () => {
    it('should render children if open=true', () => {
      render(<Drawer open>foo</Drawer>);

      const drawerElement = getDrawerElement()!;

      expect(drawerElement).toBeInstanceOf(Node);
      expect(drawerElement.textContent).toBe('foo');
    });

    it('should not render drawer content if open=false', () => {
      render(<Drawer open={false} />);

      const overlayElement = getOverlayElement();

      expect(overlayElement).toBe(null);
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

        expect(drawerElement.classList.contains(`mzn-drawer--${placement}`)).toBeTruthy();
      });

      const slideFadeDirection: {[index: string]: SlideFadeDirection} = {
        top: 'down',
        left: 'right',
        right: 'left',
        bottom: 'up',
      };

      it(`should bind correct direction to SlideFade component direction="${slideFadeDirection[placement]}"`, () => {
        const testRender = TestRenderer.create(<Drawer placement={placement} open disablePortal />);
        const slideFadeInstance = testRender.root.findByType(SlideFade);

        expect(slideFadeInstance.props.direction).toBe(slideFadeDirection[placement]);
      });
    });
  });
});
