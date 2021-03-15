import { useContext } from 'react';
import {
  ModalSize,
  modalClasses as classes,
} from '@mezzanine-ui/core/modal';
import { TimesIcon } from '@mezzanine-ui/icons';
import {
  cleanup,
  cleanupHook,
  fireEvent,
  render,
  renderHook,
  TestRenderer,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import Overlay from '../Overlay';
import { ModalControl, ModalControlContext } from './ModalControl';
import Modal, { ModalProps, ModalSeverity } from '.';

function getOverlayElement(container: HTMLElement = document.body) {
  return container?.querySelector('.mzn-overlay');
}

function getBackdropElement(container: HTMLElement = document.body) {
  return getOverlayElement(container)?.querySelector('.mzn-overlay__backdrop');
}

function getModalElement(container: HTMLElement = document.body) {
  return getOverlayElement(container)?.querySelector('.mzn-modal');
}

describe('<Modal />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<Modal ref={ref} open />),
  );

  it('should provide modal control', () => {
    let modalControl: ModalControl = {
      loading: true,
      severity: 'error',
    };
    let props: ModalProps = {
      ...modalControl,
      disablePortal: true,
      open: true,
    };
    const { result, rerender } = renderHook(() => useContext(ModalControlContext), {
      wrapper: Modal as any,
      initialProps: props,
    });

    expect(result.current).toEqual(modalControl);

    modalControl = {
      loading: false,
      severity: 'success',
    };
    props = { ...props, ...modalControl };
    rerender(props);
    expect(result.current).toEqual(modalControl);
  });

  it('should render children', () => {
    render(<Modal open>foo</Modal>);

    const modalElement = getModalElement()!;

    expect(modalElement).toBeInstanceOf(Node);
    expect(modalElement.textContent).toBe('foo');
  });

  it('should bind host class and append className from prop to modal element', () => {
    const className = 'foo';

    render(
      <Modal
        className={className}
        open
      >
        foo
      </Modal>,
    );

    const modalElement = getModalElement()!;

    expect(modalElement.classList.contains(className)).toBeTruthy();
  });

  describe('prop: fullScreen', () => {
    function testBindFullScreenClass(fullScreen: boolean) {
      const modalElement = getModalElement()!;

      expect(modalElement.classList.contains('mzn-modal--full-screen')).toBe(fullScreen);
    }

    it('should render fullScreen=false by default', () => {
      render(<Modal open />);

      testBindFullScreenClass(false);
    });

    [false, true].forEach((fullScreen) => {
      const message = fullScreen
        ? 'should bind full screen class'
        : 'should not bind full screen class';

      it(message, () => {
        render(<Modal open fullScreen={fullScreen} />);

        testBindFullScreenClass(fullScreen);
      });
    });
  });

  describe('prop: open', () => {
    it('should not render modal if open=false', () => {
      render(<Modal open={false} />);

      const overlayElement = getOverlayElement();

      expect(overlayElement).toBe(null);
    });
  });

  describe('prop: severity', () => {
    function testBindSeverityClass(severity: ModalSeverity) {
      const modalElement = getModalElement()!;

      expect(modalElement.classList.contains(`mzn-modal--${severity}`)).toBeTruthy();
    }

    it('should render severity="info" by default', () => {
      render(<Modal open />);

      testBindSeverityClass('info');
    });

    const severities: ModalSeverity[] = ['info', 'success', 'warning'];

    severities.forEach((severity) => {
      it(`should bind ${severity} class`, () => {
        render(<Modal open severity={severity} />);

        testBindSeverityClass(severity);
      });
    });
  });

  describe('prop: size', () => {
    const sizes: ModalSize[] = [
      'small',
      'medium',
      'large',
      'extraLarge',
    ];

    sizes.forEach((size) => {
      it(`should bind ${size} class if size="${size}"`, () => {
        render(<Modal open size={size} />);

        const rootElement = document.body.querySelector('.mzn-overlay')!;
        const modalElement = rootElement.querySelector('.mzn-modal')!;

        expect(modalElement.classList.contains(classes.size(size))).toBe(true);
      });
    });
  });

  describe('overlay', () => {
    const propsShouldPassed = [
      'container',
      'disableCloseOnBackdropClick',
      'disablePortal',
      'hideBackdrop',
      'onBackdropClick',
      'onClose',
      'open',
    ];

    it(`should pass ${propsShouldPassed.join(',')} to overlay`, () => {
      const container = () => document.createElement('div');
      const onBackdropClick = () => {};

      const onClose = () => {};

      const testInstance = TestRenderer.create(
        <Modal
          container={container}
          disablePortal
          disableCloseOnBackdropClick
          hideBackdrop
          onBackdropClick={onBackdropClick}
          onClose={onClose}
          open
        />,
      );
      const overlayInstance = testInstance.root.findByType(Overlay);

      expect(overlayInstance.props.container).toBe(container);
      expect(overlayInstance.props.disablePortal).toBe(true);
      expect(overlayInstance.props.disableCloseOnBackdropClick).toBe(true);
      expect(overlayInstance.props.hideBackdrop).toBe(true);
      expect(overlayInstance.props.onBackdropClick).toBe(onBackdropClick);
      expect(overlayInstance.props.onClose).toBe(onClose);
      expect(overlayInstance.props.open).toBe(true);
    });
  });

  describe('backdrop', () => {
    it('should fire onBackdropClick while backdrop clicked', () => {
      const onBackdropClick = jest.fn();

      render(<Modal onBackdropClick={onBackdropClick} open />);

      const backdropElement = getBackdropElement()!;

      fireEvent.click(backdropElement);

      expect(onBackdropClick).toBeCalledTimes(1);
    });

    it('should fire onClose while backdrop clicked', () => {
      const onClose = jest.fn();

      render(<Modal onClose={onClose} open />);

      const backdropElement = getBackdropElement()!;

      fireEvent.click(backdropElement);

      expect(onClose).toBeCalledTimes(1);
    });

    it('should not fire onClose while backdrop clicked if disableCloseOnBackdropClick=true', () => {
      const onClose = jest.fn();

      render(<Modal disableCloseOnBackdropClick onClose={onClose} open />);

      const backdropElement = getBackdropElement()!;

      fireEvent.click(backdropElement);

      expect(onClose).not.toBeCalled();
    });
  });

  describe('close icon', () => {
    it('should bind close icon class', () => {
      render(<Modal open />);

      const modalElement = getModalElement()!;
      const { lastElementChild: closeIconElement } = modalElement;

      expect(modalElement.classList.contains('mzn-modal--close-icon')).toBeTruthy();
      expect(closeIconElement!.getAttribute('data-icon-name')).toBe(TimesIcon.name);
      expect(closeIconElement!.classList.contains('mzn-modal__close-icon'));
    });

    it('should fire onClose while close icon clicked', () => {
      const onClose = jest.fn();

      render(<Modal open onClose={onClose} />);

      const modalElement = getModalElement()!;
      const { lastElementChild: closeIconElement } = modalElement;

      fireEvent.click(closeIconElement!);

      expect(onClose).toBeCalledTimes(1);
    });

    it('should not render close icon and not bind close icon class if hideCloseIcon=true', () => {
      render(<Modal hideCloseIcon open />);

      const modalElement = getModalElement()!;
      const { lastElementChild: closeIconElement } = modalElement;

      expect(modalElement.classList.contains('mzn-modal--close-icon')).toBeFalsy();
      expect(closeIconElement).toBe(null);
    });
  });

  describe('escape key down', () => {
    it('should fire onClose while escape key pressed', () => {
      const onClose = jest.fn();

      render(<Modal onClose={onClose} open />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toBeCalledTimes(1);
    });

    it('should not fire onClose while escape key pressed if disableCloseOnEscapeKeyDown=true', () => {
      const onClose = jest.fn();

      render(<Modal disableCloseOnEscapeKeyDown onClose={onClose} open />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).not.toBeCalled();
    });

    it('should close only the top modal while escape key pressed', () => {
      const onClose = jest.fn();

      render(
        <>
          <Modal
            open
            onClose={onClose}
          />
          <Modal
            open
            onClose={onClose}
          />
          <Modal
            open
            onClose={onClose}
          />
        </>,
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toBeCalledTimes(1);
    });
  });
});
