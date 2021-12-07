import {
  cleanup,
  render,
  fireEvent,
  TestRenderer,
} from '../../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../../__test-utils__/common';
import Overlay from '../../Overlay';
import SlideFadeOverlay from '.';

function getOverlayElement(container: HTMLElement = document.body) {
  return container?.querySelector('.mzn-overlay');
}

function getBackdropElement(container: HTMLElement = document.body) {
  return getOverlayElement(container)?.querySelector('.mzn-overlay__backdrop');
}

window.scrollTo = jest.fn();

describe('<SlideFadeOverlay />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<SlideFadeOverlay ref={ref} open><div /></SlideFadeOverlay>),
  );

  it('should bind host class', () => {
    render(<SlideFadeOverlay open><div /></SlideFadeOverlay>);

    const element = document.querySelector('.mzn-overlay-with-slide-fade');

    expect(element).toBeInstanceOf(HTMLDivElement);
  });

  it('should render children', () => {
    render(<SlideFadeOverlay open><div className="foo">bar</div></SlideFadeOverlay>);

    const element = document.querySelector('.foo');

    expect(element?.textContent).toBe('bar');
  });

  describe('prop: open', () => {
    it('should not render container if open=false', () => {
      render(<SlideFadeOverlay open={false}><div /></SlideFadeOverlay>);

      const overlayElement = getOverlayElement();

      expect(overlayElement).toBe(null);
    });
  });

  describe('overlay', () => {
    const propsShouldPassed = [
      'className',
      'container',
      'disableCloseOnBackdropClick',
      'disablePortal',
      'hideBackdrop',
      'invisibleBackdrop',
      'onBackdropClick',
      'onClose',
      'open',
    ];

    it(`should pass ${propsShouldPassed.join(',')} to overlay`, () => {
      const container = () => document.createElement('div');
      const onBackdropClick = () => {};

      const onClose = () => {};

      const testInstance = TestRenderer.create(
        <SlideFadeOverlay
          className="foo"
          container={container}
          disableCloseOnBackdropClick
          disablePortal
          hideBackdrop
          invisibleBackdrop
          onBackdropClick={onBackdropClick}
          onClose={onClose}
          open
        >
          <div />
        </SlideFadeOverlay>,
      );
      const overlayInstance = testInstance.root.findByType(Overlay);

      expect(overlayInstance.props.className).toContain('foo');
      expect(overlayInstance.props.container).toBe(container);
      expect(overlayInstance.props.disableCloseOnBackdropClick).toBe(true);
      expect(overlayInstance.props.disablePortal).toBe(true);
      expect(overlayInstance.props.hideBackdrop).toBe(true);
      expect(overlayInstance.props.invisibleBackdrop).toBe(true);
      expect(overlayInstance.props.onBackdropClick).toBe(onBackdropClick);
      expect(overlayInstance.props.onClose).toBe(onClose);
      expect(overlayInstance.props.open).toBe(true);
    });
  });

  describe('backdrop', () => {
    it('should fire onBackdropClick while backdrop clicked', () => {
      const onBackdropClick = jest.fn();

      render(
        <SlideFadeOverlay onBackdropClick={onBackdropClick} open>
          <div />
        </SlideFadeOverlay>,
      );

      const backdropElement = getBackdropElement()!;

      fireEvent.click(backdropElement);

      expect(onBackdropClick).toBeCalledTimes(1);
    });

    it('should fire onClose while backdrop clicked', () => {
      const onClose = jest.fn();

      render(
        <SlideFadeOverlay onClose={onClose} open>
          <div />
        </SlideFadeOverlay>,
      );

      const backdropElement = getBackdropElement()!;

      fireEvent.click(backdropElement);

      expect(onClose).toBeCalledTimes(1);
    });

    it('should not fire onClose while backdrop clicked if disableCloseOnBackdropClick=true', () => {
      const onClose = jest.fn();

      render(
        <SlideFadeOverlay
          disableCloseOnBackdropClick
          onClose={onClose}
          open
        >
          <div />
        </SlideFadeOverlay>,
      );

      const backdropElement = getBackdropElement()!;

      fireEvent.click(backdropElement);

      expect(onClose).not.toBeCalled();
    });
  });

  describe('escape key down', () => {
    it('should fire onClose while escape key pressed', () => {
      const onClose = jest.fn();

      render(
        <SlideFadeOverlay onClose={onClose} open>
          <div />
        </SlideFadeOverlay>,
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toBeCalledTimes(1);
    });

    it('should not fire onClose while escape key pressed if disableCloseOnEscapeKeyDown=true', () => {
      const onClose = jest.fn();

      render(
        <SlideFadeOverlay
          disableCloseOnEscapeKeyDown
          onClose={onClose}
          open
        >
          <div />
        </SlideFadeOverlay>,
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).not.toBeCalled();
    });

    it('should close only the top modal while escape key pressed', () => {
      const onClose = jest.fn();

      render(
        <>
          <SlideFadeOverlay
            open
            onClose={onClose}
          >
            <div />
          </SlideFadeOverlay>
          <SlideFadeOverlay
            open
            onClose={onClose}
          >
            <div />
          </SlideFadeOverlay>
          <SlideFadeOverlay
            open
            onClose={onClose}
          >
            <div />
          </SlideFadeOverlay>
        </>,
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toBeCalledTimes(1);
    });
  });
});
