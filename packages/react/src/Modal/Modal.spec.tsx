import { useContext } from 'react';
import { ModalSize, modalClasses as classes } from '@mezzanine-ui/core/modal';
import { TimesIcon } from '@mezzanine-ui/icons';
import {
  cleanup,
  cleanupHook,
  fireEvent,
  render,
  renderHook,
} from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import { ModalControl, ModalControlContext } from './ModalControl';
import Modal, { ModalProps, ModalSeverity } from '.';
import { createWrapper } from '../../__test-utils__/render';

function getOverlayElement(container: HTMLElement = document.body) {
  return container?.querySelector('.mzn-overlay');
}

function getModalElement(container: HTMLElement = document.body) {
  return getOverlayElement(container)?.querySelector('.mzn-modal');
}

window.scrollTo = jest.fn();

describe('<Modal />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Modal ref={ref} open />),
  );

  it('should provide modal control', () => {
    const modalControl: ModalControl = {
      loading: true,
      severity: 'error',
    };
    const props: ModalProps = {
      ...modalControl,
      disablePortal: true,
      open: true,
    };

    const { result } = renderHook(() => useContext(ModalControlContext), {
      wrapper: createWrapper(Modal, props),
    });

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
      <Modal className={className} open>
        foo
      </Modal>,
    );

    const modalElement = getModalElement()!;

    expect(modalElement.classList.contains(className)).toBeTruthy();
  });

  describe('prop: fullScreen', () => {
    function testBindFullScreenClass(fullScreen: boolean) {
      const modalElement = getModalElement()!;

      expect(modalElement.classList.contains('mzn-modal--full-screen')).toBe(
        fullScreen,
      );
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

  describe('prop: severity', () => {
    function testBindSeverityClass(severity: ModalSeverity) {
      const modalElement = getModalElement()!;

      expect(
        modalElement.classList.contains(`mzn-modal--${severity}`),
      ).toBeTruthy();
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
    const sizes: ModalSize[] = ['small', 'medium', 'large', 'extraLarge'];

    sizes.forEach((size) => {
      it(`should bind ${size} class if size="${size}"`, () => {
        render(<Modal open size={size} />);

        const rootElement = document.body.querySelector('.mzn-overlay')!;
        const modalElement = rootElement.querySelector('.mzn-modal')!;

        expect(modalElement.classList.contains(classes.size(size))).toBe(true);
      });
    });
  });

  describe('close icon', () => {
    it('should bind close icon class', () => {
      render(<Modal open />);

      const modalElement = getModalElement()!;
      const { lastElementChild: closeIconElement } = modalElement;

      expect(
        modalElement.classList.contains('mzn-modal--close-icon'),
      ).toBeTruthy();
      expect(closeIconElement!.getAttribute('data-icon-name')).toBe(
        TimesIcon.name,
      );
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

      expect(
        modalElement.classList.contains('mzn-modal--close-icon'),
      ).toBeFalsy();
      expect(closeIconElement).toBe(null);
    });
  });
});
