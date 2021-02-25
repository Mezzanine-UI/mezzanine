import {
  cleanup,
  render,
  TestRenderer,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import ConfirmActions from '../ConfirmActions';
import Modal, { ModalActions } from '.';

describe('<ModalActions />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<ModalActions ref={ref} />),
  );

  it('should bind actions class to confirm actions', () => {
    const testInstance = TestRenderer.create(<ModalActions />);
    const confirmActionsInstance = testInstance.root.findByType(ConfirmActions);

    expect(confirmActionsInstance.props.className).toContain('mzn-modal__actions');
  });

  describe('modal control', () => {
    it('should pass danger and loading of modal to confirm actions', () => {
      /**
       * TestRenderer not support React.createPortal
       */
      const testInstance = TestRenderer.create(
        <Modal danger disablePortal loading open>
          <ModalActions />
        </Modal>,
      );
      const confirmActionsInstance = testInstance.root.findByType(ConfirmActions);

      expect(confirmActionsInstance.props.danger).toBeTruthy();
      expect(confirmActionsInstance.props.loading).toBeTruthy();
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
