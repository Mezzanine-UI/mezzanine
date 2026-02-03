import { useContext } from 'react';
import { ModalSize, modalClasses as classes } from '@mezzanine-ui/core/modal';
import {
  cleanup,
  cleanupHook,
  fireEvent,
  render,
  renderHook,
} from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import { ModalControl, ModalControlContext } from './ModalControl';
import Modal, { ModalProps, ModalStatusType } from '.';
import { createWrapper } from '../../__test-utils__/render';

function getOverlayElement(container: HTMLElement = document.body) {
  return container?.querySelector('.mzn-backdrop');
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
    render(<Modal ref={ref} open modalType="standard" />),
  );

  it('should provide modal control', () => {
    const modalControl: ModalControl = {
      loading: true,
      modalStatusType: 'error',
    };
    const props: ModalProps = {
      ...modalControl,
      disablePortal: true,
      modalType: 'standard',
      open: true,
    };

    const { result } = renderHook(() => useContext(ModalControlContext), {
      wrapper: createWrapper(Modal, props),
    });

    expect(result.current).toEqual(modalControl);
  });

  it('should render children', () => {
    render(
      <Modal open modalType="standard">
        foo
      </Modal>,
    );

    const modalElement = getModalElement()!;

    expect(modalElement).toBeInstanceOf(Node);
    expect(modalElement.textContent).toBe('foo');
  });

  it('should bind host class and append className from prop to modal element', () => {
    const className = 'foo';

    render(
      <Modal className={className} open modalType="standard">
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
      render(<Modal open modalType="standard" />);

      testBindFullScreenClass(false);
    });

    [false, true].forEach((fullScreen) => {
      const message = fullScreen
        ? 'should bind full screen class'
        : 'should not bind full screen class';

      it(message, () => {
        render(<Modal open fullScreen={fullScreen} modalType="standard" />);

        testBindFullScreenClass(fullScreen);
      });
    });
  });

  describe('prop: severity', () => {
    function testBindSeverityClass(severity: ModalStatusType) {
      const modalElement = getModalElement()!;

      expect(
        modalElement.classList.contains(`mzn-modal--${severity}`),
      ).toBeTruthy();
    }

    it('should render severity="info" by default', () => {
      render(<Modal open modalType="standard" />);

      testBindSeverityClass('info');
    });

    const severities: ModalStatusType[] = ['info', 'success', 'warning'];

    severities.forEach((severity) => {
      it(`should bind ${severity} class`, () => {
        render(<Modal open modalStatusType={severity} modalType="standard" />);

        testBindSeverityClass(severity);
      });
    });
  });

  describe('prop: size', () => {
    const sizes: ModalSize[] = ['tight', 'narrow', 'regular', 'wide'];

    sizes.forEach((size) => {
      it(`should bind ${size} class if size="${size}"`, () => {
        render(<Modal open size={size} modalType="standard" />);

        const rootElement = document.body.querySelector('.mzn-backdrop')!;
        const modalElement = rootElement.querySelector('.mzn-modal')!;

        expect(modalElement.classList.contains(classes.size(size))).toBe(true);
      });
    });
  });

  describe('close icon', () => {
    it('should bind close icon class when showDismissButton=true', () => {
      render(<Modal open showDismissButton modalType="standard" />);

      const modalElement = getModalElement()!;
      const closeIconElement = modalElement.querySelector(
        `.${classes.closeIcon}`,
      );

      expect(
        modalElement.classList.contains('mzn-modal--close-icon'),
      ).toBeTruthy();
      expect(closeIconElement).toBeTruthy();
      expect(
        closeIconElement!.classList.contains('mzn-modal__close-icon'),
      ).toBeTruthy();

      const iconElement = closeIconElement!.querySelector('[data-icon-name]');
      expect(iconElement).toBeTruthy();
    });

    it('should fire onClose while close icon clicked', () => {
      const onClose = jest.fn();

      render(
        <Modal open onClose={onClose} showDismissButton modalType="standard" />,
      );

      const modalElement = getModalElement()!;
      const closeIconElement = modalElement.querySelector(
        `.${classes.closeIcon}`,
      );

      fireEvent.click(closeIconElement!);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should render dismiss button when showDismissButton=true', () => {
      render(<Modal showDismissButton open modalType="standard" />);

      const modalElement = getModalElement()!;
      const closeIcon = modalElement.querySelector(`.${classes.closeIcon}`);

      expect(
        modalElement.classList.contains('mzn-modal--close-icon'),
      ).toBeTruthy();
      expect(closeIcon).toBeTruthy();
    });

    it('should not render dismiss button by default', () => {
      render(<Modal open modalType="standard" />);

      const modalElement = getModalElement()!;
      const closeIcon = modalElement.querySelector(`.${classes.closeIcon}`);

      expect(
        modalElement.classList.contains('mzn-modal--close-icon'),
      ).toBeFalsy();
      expect(closeIcon).toBeNull();
    });
  });

  describe('prop: modalType', () => {
    it('should render standard layout by default', () => {
      render(
        <Modal open modalType="standard">
          Content
        </Modal>,
      );

      const modalElement = getModalElement()!;
      const bodyContainer = modalElement.querySelector(
        `.${classes.modalBodyContainer}`,
      );

      expect(bodyContainer).toBeTruthy();
      expect(bodyContainer?.textContent).toBe('Content');
    });

    it('should render extendedSplit layout', () => {
      render(
        <Modal
          open
          modalType="extendedSplit"
          extendedSplitLeftSideContent={<div>Left content</div>}
          extendedSplitRightSideContent={<div>Right content</div>}
        />,
      );

      const modalElement = getModalElement()!;
      const splitContainer = modalElement.querySelector(
        `.${classes.modalBodyContainerExtendedSplit}`,
      );
      const leftContent = modalElement.querySelector(
        `.${classes.modalBodyContainerExtendedSplitLeft}`,
      );
      const rightContent = modalElement.querySelector(
        `.${classes.modalBodyContainerExtendedSplitRight}`,
      );

      expect(splitContainer).toBeTruthy();
      expect(leftContent?.textContent).toContain('Left content');
      expect(rightContent?.textContent).toContain('Right content');
    });
  });

  describe('prop: showModalHeader', () => {
    it('should not render header by default', () => {
      render(<Modal open modalType="standard" />);

      const modalElement = getModalElement()!;
      const header = modalElement.querySelector(`.${classes.modalHeader}`);

      expect(header).toBeNull();
    });

    it('should render header when showModalHeader=true', () => {
      render(
        <Modal open modalType="standard" showModalHeader title="Test Title" />,
      );

      const modalElement = getModalElement()!;
      const header = modalElement.querySelector(`.${classes.modalHeader}`);

      expect(header).toBeTruthy();
      expect(header?.textContent).toContain('Test Title');
    });
  });

  describe('prop: showModalFooter', () => {
    it('should not render footer by default', () => {
      render(<Modal open modalType="standard" />);

      const modalElement = getModalElement()!;
      const footer = modalElement.querySelector(`.${classes.modalFooter}`);

      expect(footer).toBeNull();
    });

    it('should render footer when showModalFooter=true', () => {
      render(
        <Modal
          open
          modalType="standard"
          showModalFooter
          confirmText="Confirm"
        />,
      );

      const modalElement = getModalElement()!;
      const footer = modalElement.querySelector(`.${classes.modalFooter}`);

      expect(footer).toBeTruthy();
      expect(footer?.textContent).toContain('Confirm');
    });

    it('should render footer in extendedSplit layout inside left content', () => {
      render(
        <Modal
          open
          modalType="extendedSplit"
          showModalFooter
          confirmText="Confirm"
          extendedSplitLeftSideContent={<div>Left</div>}
          extendedSplitRightSideContent={<div>Right</div>}
        />,
      );

      const modalElement = getModalElement()!;
      const leftContent = modalElement.querySelector(
        `.${classes.modalBodyContainerExtendedSplitLeft}`,
      );
      const footer = leftContent?.querySelector(`.${classes.modalFooter}`);

      expect(footer).toBeTruthy();
    });
  });

  describe('prop: loading', () => {
    it('should pass loading state to modal control context', () => {
      const props: ModalProps = {
        loading: true,
        modalType: 'standard',
        open: true,
      };

      const { result } = renderHook(() => useContext(ModalControlContext), {
        wrapper: createWrapper(Modal, props),
      });

      expect(result.current.loading).toBe(true);
    });
  });

  describe('prop: disableCloseOnBackdropClick', () => {
    it('should be false by default', () => {
      const onClose = jest.fn();
      render(<Modal open onClose={onClose} modalType="standard" />);

      const backdrop = document.querySelector('.mzn-backdrop__backdrop');
      fireEvent.click(backdrop!);

      expect(onClose).toHaveBeenCalled();
    });

    it('should prevent close on backdrop click when true', () => {
      const onClose = jest.fn();
      render(
        <Modal
          open
          onClose={onClose}
          disableCloseOnBackdropClick
          modalType="standard"
        />,
      );

      const backdrop = document.querySelector('.mzn-backdrop__backdrop');
      fireEvent.click(backdrop!);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should close modal when clicking backdrop area', () => {
      const onClose = jest.fn();
      render(
        <Modal open onClose={onClose} modalType="standard">
          <div>Modal content</div>
        </Modal>,
      );

      const backdrop = document.querySelector('.mzn-backdrop__backdrop');
      fireEvent.click(backdrop!);

      expect(onClose).toHaveBeenCalled();
    });

    it('should not close modal when clicking modal content itself', () => {
      const onClose = jest.fn();
      render(
        <Modal open onClose={onClose} modalType="standard">
          <div data-testid="modal-content">Modal content</div>
        </Modal>,
      );

      const modalContent = document.querySelector(
        '[data-testid="modal-content"]',
      );
      fireEvent.click(modalContent!);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should prevent close when clicking backdrop if disableCloseOnBackdropClick is true', () => {
      const onClose = jest.fn();
      render(
        <Modal
          disableCloseOnBackdropClick
          onClose={onClose}
          open
          modalType="standard"
        >
          <div>Modal content</div>
        </Modal>,
      );

      const backdrop = document.querySelector('.mzn-backdrop__backdrop');
      fireEvent.click(backdrop!);

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('prop: onBackdropClick', () => {
    it('should call onBackdropClick when backdrop is clicked', () => {
      const onBackdropClick = jest.fn();
      render(
        <Modal open onBackdropClick={onBackdropClick} modalType="standard" />,
      );

      const backdrop = document.querySelector('.mzn-backdrop__backdrop');
      fireEvent.click(backdrop!);

      expect(onBackdropClick).toHaveBeenCalled();
    });

    it('should call onBackdropClick when backdrop is clicked', () => {
      const onBackdropClick = jest.fn();
      render(
        <Modal open onBackdropClick={onBackdropClick} modalType="standard">
          <div>Modal content</div>
        </Modal>,
      );

      const backdrop = document.querySelector('.mzn-backdrop__backdrop');
      fireEvent.click(backdrop!);

      expect(onBackdropClick).toHaveBeenCalled();
    });

    it('should not call onBackdropClick when modal content itself is clicked', () => {
      const onBackdropClick = jest.fn();
      render(
        <Modal open onBackdropClick={onBackdropClick} modalType="standard">
          <div data-testid="modal-content">Modal content</div>
        </Modal>,
      );

      const modalContent = document.querySelector(
        '[data-testid="modal-content"]',
      );
      fireEvent.click(modalContent!);

      expect(onBackdropClick).not.toHaveBeenCalled();
    });

    it('should call onBackdropClick even when disableCloseOnBackdropClick is true', () => {
      const onBackdropClick = jest.fn();
      const onClose = jest.fn();
      render(
        <Modal
          disableCloseOnBackdropClick
          onBackdropClick={onBackdropClick}
          onClose={onClose}
          open
          modalType="standard"
        >
          <div>Modal content</div>
        </Modal>,
      );

      const backdrop = document.querySelector('.mzn-backdrop__backdrop');
      fireEvent.click(backdrop!);

      expect(onBackdropClick).toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('prop: container', () => {
    it('should render modal in custom container', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      render(<Modal open container={container} modalType="standard" />);

      const modalInContainer = container.querySelector('.mzn-modal');
      expect(modalInContainer).toBeTruthy();

      document.body.removeChild(container);
    });
  });

  describe('prop: disablePortal', () => {
    it('should render in place when disablePortal=true', () => {
      const { container } = render(
        <Modal open disablePortal modalType="standard" />,
      );

      const modalInContainer = container.querySelector('.mzn-modal');
      expect(modalInContainer).toBeTruthy();
    });
  });
});
