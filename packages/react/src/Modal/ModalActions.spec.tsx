import { cleanup, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Modal, { ModalActions, ModalSeverity } from '.';

const mockRenderConfirmActions = jest.fn();

jest.mock('../ConfirmActions', () => {
  return function MockRenderConfirmActions(props: any) {
    mockRenderConfirmActions(props);
    return <div data-testid="mock-modal-actions">Mock Actions</div>;
  };
});

describe('<ModalActions />', () => {
  beforeEach(() => {
    mockRenderConfirmActions.mockClear();
  });

  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<ModalActions ref={ref} />),
  );

  it('should bind actions class to confirm actions', () => {
    render(<ModalActions />);

    expect(mockRenderConfirmActions).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'mzn-modal__actions',
      }),
    );
  });

  describe('modal control', () => {
    beforeEach(() => {
      mockRenderConfirmActions.mockClear();
    });

    it('should pass loading of modal to confirm actions', () => {
      render(
        <Modal disablePortal loading open>
          <ModalActions />
        </Modal>,
      );
      expect(mockRenderConfirmActions).toHaveBeenCalledWith(
        expect.objectContaining({
          loading: true,
        }),
      );
    });

    it('should not pass danger to confirm actions if severity!=="error"', () => {
      const severities: ModalSeverity[] = ['info', 'success', 'warning'];

      severities.forEach((severity) => {
        render(
          <Modal disablePortal loading open severity={severity}>
            <ModalActions />
          </Modal>,
        );

        expect(mockRenderConfirmActions).toHaveBeenCalledWith(
          expect.objectContaining({
            danger: false,
          }),
        );

        mockRenderConfirmActions.mockClear();
      });
    });

    it('should pass danger to confirm actions if severity="error"', () => {
      render(
        <Modal disablePortal loading open severity="error">
          <ModalActions />
        </Modal>,
      );

      expect(mockRenderConfirmActions).toHaveBeenCalledWith(
        expect.objectContaining({
          danger: true,
        }),
      );
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
