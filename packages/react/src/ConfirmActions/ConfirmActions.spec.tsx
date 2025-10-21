import { cleanup, fireEvent, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Button, { ButtonProps } from '../Button/Button';
import ConfirmActions from '.';

const renderMockButton = jest.fn();

jest.mock('../Button/Button', () => {
  return function MockButton(props: any) {
    renderMockButton(props);
    return <button {...props} />;
  };
});

describe('<ConfirmActions />', () => {
  beforeEach(() => {
    renderMockButton.mockClear();
  });

  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<ConfirmActions ref={ref} />),
  );

  describe('cancel button', () => {
    it('should render variant="outlined" by default', () => {
      render(<ConfirmActions />);

      expect(renderMockButton).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'outlined',
        }),
      );
    });

    describe('prop: cancelButtonProps', () => {
      beforeEach(() => {
        renderMockButton.mockClear();
      });

      it('should be passed to the cancel button', () => {
        const cancelButtonProps: ButtonProps = {
          disabled: true,
          loading: true,
          variant: 'contained',
        };

        render(<ConfirmActions cancelButtonProps={cancelButtonProps} />);

        expect(renderMockButton).toHaveBeenCalledWith(
          expect.objectContaining(cancelButtonProps),
        );
      });

      it('should consider loading as disabled of cancel button if disabled of cancelButtonProps not passed', () => {
        render(<ConfirmActions loading />);

        expect(renderMockButton).toHaveBeenCalledWith(
          expect.objectContaining({
            disabled: true,
          }),
        );
      });
    });

    describe('prop: cancelText', () => {
      it('should render the text of the cancel button', () => {
        const { getHostHTMLElement } = render(
          <ConfirmActions cancelText="foo" />,
        );
        const element = getHostHTMLElement();
        const [cancelButtonElement] = element.getElementsByTagName('button');

        expect(cancelButtonElement.textContent).toBe('foo');
      });
    });

    describe('prop: hideCancelButton', () => {
      it('should not render cancel button', () => {
        const onCancel = jest.fn();
        const { getHostHTMLElement } = render(
          <ConfirmActions hideCancelButton onCancel={onCancel} />,
        );
        const element = getHostHTMLElement();
        const [confirmButtonElement] = element.getElementsByTagName('button');

        fireEvent.click(confirmButtonElement);

        expect(element.childElementCount).toBe(1);
        expect(onCancel).not.toHaveBeenCalled();
      });
    });

    describe('prop: onCancel', () => {
      it('should be fired while cancel button clicked', () => {
        const onCancel = jest.fn();
        const { getHostHTMLElement } = render(
          <ConfirmActions onCancel={onCancel} />,
        );
        const element = getHostHTMLElement();
        const [cancelButtonElement] = element.getElementsByTagName('button');

        fireEvent.click(cancelButtonElement);

        expect(onCancel).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('confirm button', () => {
    it('should render variant="contained" by default', () => {
      render(<ConfirmActions />);

      expect(renderMockButton).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'contained',
        }),
      );
    });

    describe('prop: confirmButtonProps', () => {
      it('should be passed to the confirm button', () => {
        const confirmButtonProps: ButtonProps = {
          disabled: true,
          variant: 'outlined',
        };
        render(<ConfirmActions confirmButtonProps={confirmButtonProps} />);

        expect(renderMockButton).toHaveBeenCalledWith(
          expect.objectContaining(confirmButtonProps),
        );
      });

      it('should pass loading prop to confirm button', () => {
        render(
          <ConfirmActions confirmButtonProps={{ loading: false }} loading />,
        );

        expect(renderMockButton).toHaveBeenCalledWith(
          expect.objectContaining({
            loading: true,
          }),
        );
      });
    });

    describe('prop: confirmText', () => {
      it('should render the text of the confirm button', () => {
        const { getHostHTMLElement } = render(
          <ConfirmActions confirmText="foo" />,
        );
        const element = getHostHTMLElement();
        const { lastElementChild: confirmButtonElement } = element;

        expect(confirmButtonElement!.textContent).toBe('foo');
      });
    });

    describe('prop: hideConfirmButton', () => {
      it('should not render cancel button', () => {
        const onConfirm = jest.fn();
        const { getHostHTMLElement } = render(
          <ConfirmActions hideConfirmButton onConfirm={onConfirm} />,
        );
        const element = getHostHTMLElement();
        const { firstElementChild: cancelButtonElement, childElementCount } =
          element;

        fireEvent.click(cancelButtonElement!);

        expect(childElementCount).toBe(1);
        expect(onConfirm).not.toHaveBeenCalled();
      });
    });

    describe('prop: onConfirm', () => {
      it('should be fired while confirm button clicked', () => {
        const onConfirm = jest.fn();
        const { getHostHTMLElement } = render(
          <ConfirmActions onConfirm={onConfirm} />,
        );
        const element = getHostHTMLElement();
        const { lastElementChild: confirmButtonElement } = element;

        fireEvent.click(confirmButtonElement!);

        expect(onConfirm).toHaveBeenCalledTimes(1);
      });
    });
  });
});
