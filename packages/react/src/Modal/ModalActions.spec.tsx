import { cleanup, render, TestRenderer } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import ConfirmActions from '../ConfirmActions';
import Modal, { ModalActions, ModalSeverity } from '.';

describe('<ModalActions />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<ModalActions ref={ref} />),
  );

  it('should bind actions class to confirm actions', () => {
    const testInstance = TestRenderer.create(<ModalActions />);
    const confirmActionsInstance = testInstance.root.findByType(ConfirmActions);

    expect(confirmActionsInstance.props.className).toContain(
      'mzn-modal__actions',
    );
  });

  describe('modal control', () => {
    it('should passloading of modal to confirm actions', () => {
      /**
       * TestRenderer not support React.createPortal
       */
      const testInstance = TestRenderer.create(
        <Modal disablePortal loading open>
          <ModalActions />
        </Modal>,
      );
      const confirmActionsInstance =
        testInstance.root.findByType(ConfirmActions);

      expect(confirmActionsInstance.props.loading).toBeTruthy();
    });

    it('should not pass danger to confirm actions if severity!=="error"', () => {
      const severities: ModalSeverity[] = ['info', 'success', 'warning'];

      severities.forEach((severity) => {
        const testInstance = TestRenderer.create(
          <Modal disablePortal loading open severity={severity}>
            <ModalActions />
          </Modal>,
        );
        const confirmActionsInstance =
          testInstance.root.findByType(ConfirmActions);

        expect(confirmActionsInstance.props.danger).toBeFalsy();
      });
    });

    it('should pass danger to confirm actions if severity="error"', () => {
      const testInstance = TestRenderer.create(
        <Modal disablePortal loading open severity="error">
          <ModalActions />
        </Modal>,
      );
      const confirmActionsInstance =
        testInstance.root.findByType(ConfirmActions);

      expect(confirmActionsInstance.props.danger).toBeTruthy();
    });
  });

  describe('prop: children', () => {
    it('should render children before confirm actions', () => {
      const { getHostHTMLElement } = render(
        <ModalActions>
          <span data-children>foo</span>
        </ModalActions>,
      );
      const element = getHostHTMLElement();
      const { firstElementChild } = element;

      expect(firstElementChild!.textContent).toBe('foo');
    });
  });
});
