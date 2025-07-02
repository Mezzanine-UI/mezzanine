import { cleanup, render, fireEvent } from '../../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../../__test-utils__/common';
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

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <SlideFadeOverlay ref={ref} open>
        <div />
      </SlideFadeOverlay>,
    ),
  );

  it('should bind host class', () => {
    render(
      <SlideFadeOverlay open>
        <div />
      </SlideFadeOverlay>,
    );

    const element = document.querySelector('.mzn-overlay-with-slide-fade');

    expect(element).toBeInstanceOf(HTMLDivElement);
  });

  it('should render children', () => {
    render(
      <SlideFadeOverlay open>
        <div className="foo">bar</div>
      </SlideFadeOverlay>,
    );

    const element = document.querySelector('.foo');

    expect(element?.textContent).toBe('bar');
  });

  describe('prop: open', () => {
    it('should not render container if open=false', () => {
      render(
        <SlideFadeOverlay open={false}>
          <div />
        </SlideFadeOverlay>,
      );

      const overlayElement = getOverlayElement();

      expect(overlayElement).toBe(null);
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

      expect(onBackdropClick).toHaveBeenCalledTimes(1);
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

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not fire onClose while backdrop clicked if disableCloseOnBackdropClick=true', () => {
      const onClose = jest.fn();

      render(
        <SlideFadeOverlay disableCloseOnBackdropClick onClose={onClose} open>
          <div />
        </SlideFadeOverlay>,
      );

      const backdropElement = getBackdropElement()!;

      fireEvent.click(backdropElement);

      expect(onClose).not.toHaveBeenCalled();
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

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not fire onClose while escape key pressed if disableCloseOnEscapeKeyDown=true', () => {
      const onClose = jest.fn();

      render(
        <SlideFadeOverlay disableCloseOnEscapeKeyDown onClose={onClose} open>
          <div />
        </SlideFadeOverlay>,
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should close only the top modal while escape key pressed', () => {
      const onClose = jest.fn();

      render(
        <>
          <SlideFadeOverlay open onClose={onClose}>
            <div />
          </SlideFadeOverlay>
          <SlideFadeOverlay open onClose={onClose}>
            <div />
          </SlideFadeOverlay>
          <SlideFadeOverlay open onClose={onClose}>
            <div />
          </SlideFadeOverlay>
        </>,
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
