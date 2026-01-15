import { modalClasses } from '@mezzanine-ui/core/modal';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { ModalFooter } from '.';

describe('<ModalFooter />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<ModalFooter ref={ref} modalFooterConfirmText="Confirm" />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<ModalFooter className={className} modalFooterConfirmText="Confirm" />),
  );

  describe('basic rendering', () => {
    it('should bind footer class and render children', () => {
      const { getHostHTMLElement } = render(
        <ModalFooter modalFooterConfirmText="Confirm">foo</ModalFooter>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-modal__footer')).toBeTruthy();
      expect(element.textContent).toContain('foo');
    });

    it('should render confirm button by default', () => {
      const { getHostHTMLElement } = render(
        <ModalFooter modalFooterConfirmText="Confirm" />,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll(
        `.${modalClasses.modalFooterActionsButton}`,
      );
      const confirmButton = buttons[buttons.length - 1];

      expect(confirmButton).toBeTruthy();
      expect(confirmButton?.textContent).toBe('Confirm');
    });
  });

  describe('prop: modalFooterActionsButtonLayout', () => {
    it('should render fixed layout by default', () => {
      const { getHostHTMLElement } = render(
        <ModalFooter modalFooterConfirmText="Confirm" />,
      );
      const element = getHostHTMLElement();
      const buttonContainer = element.querySelector(
        `.${modalClasses.modalFooterActionsButtonContainer}`,
      );

      expect(
        buttonContainer?.classList.contains(
          `${modalClasses.modalFooterActionsButtonContainer}--fill-layout`,
        ),
      ).toBe(false);
    });

    it('should render fill layout when modalFooterActionsButtonLayout="fill"', () => {
      const { getHostHTMLElement } = render(
        <ModalFooter
          modalFooterActionsButtonLayout="fill"
          modalFooterConfirmText="Confirm"
        />,
      );
      const element = getHostHTMLElement();
      const buttonContainer = element.querySelector(
        `.${modalClasses.modalFooterActionsButtonContainer}`,
      );

      expect(
        buttonContainer?.classList.contains(
          `${modalClasses.modalFooterActionsButtonContainer}--fill-layout`,
        ),
      ).toBe(true);
    });
  });

  describe('prop: modalFooterShowCancelButton', () => {
    it('should show cancel button by default', () => {
      const { getHostHTMLElement } = render(
        <ModalFooter modalFooterConfirmText="Confirm" modalFooterCancelText="Cancel" />,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll(
        `.${modalClasses.modalFooterActionsButton}`,
      );

      expect(buttons.length).toBe(2);
    });

    it('should hide cancel button when modalFooterShowCancelButton=false', () => {
      const { getHostHTMLElement } = render(
        <ModalFooter
          modalFooterConfirmText="Confirm"
          modalFooterCancelText="Cancel"
          modalFooterShowCancelButton={false}
        />,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll(
        `.${modalClasses.modalFooterActionsButton}`,
      );

      expect(buttons.length).toBe(1);
      expect(buttons[0].textContent).toBe('Confirm');
    });
  });

  describe('prop: modalFooterLoading', () => {
    it('should disable cancel button when modalFooterLoading=true', () => {
      const { getHostHTMLElement } = render(
        <ModalFooter
          modalFooterConfirmText="Confirm"
          modalFooterCancelText="Cancel"
          modalFooterLoading
        />,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll(
        `.${modalClasses.modalFooterActionsButton}`,
      ) as NodeListOf<HTMLButtonElement>;

      expect(buttons[0].disabled).toBe(true);
    });
  });

  describe('prop: modalFooterOnConfirm and modalFooterOnCancel', () => {
    it('should call modalFooterOnConfirm when confirm button clicked', () => {
      const onConfirm = jest.fn();
      const { getHostHTMLElement } = render(
        <ModalFooter
          modalFooterConfirmText="Confirm"
          modalFooterOnConfirm={onConfirm}
          modalFooterShowCancelButton={false}
        />,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll(
        `.${modalClasses.modalFooterActionsButton}`,
      );
      const confirmButton = buttons[0];

      fireEvent.click(confirmButton);

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call modalFooterOnCancel when cancel button clicked', () => {
      const onCancel = jest.fn();
      const { getHostHTMLElement } = render(
        <ModalFooter
          modalFooterConfirmText="Confirm"
          modalFooterCancelText="Cancel"
          modalFooterOnCancel={onCancel}
        />,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll(
        `.${modalClasses.modalFooterActionsButton}`,
      );
      const cancelButton = buttons[0];

      fireEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: modalFooterAuxiliaryContentType', () => {
    describe('annotation', () => {
      it('should render annotation text', () => {
        const { getHostHTMLElement } = render(
          <ModalFooter
            modalFooterAuxiliaryContentType="annotation"
            modalFooterAnnotation="This is a note"
            modalFooterConfirmText="Confirm"
          />,
        );
        const element = getHostHTMLElement();
        const auxiliaryContainer = element.querySelector(
          `.${modalClasses.modalFooterAuxiliaryContentContainer}`,
        );

        expect(auxiliaryContainer?.textContent).toBe('This is a note');
      });
    });

    describe('button', () => {
      it('should render auxiliary button', () => {
        const onClick = jest.fn();
        const { getHostHTMLElement } = render(
          <ModalFooter
            modalFooterAuxiliaryContentType="button"
            modalFooterAuxiliaryContentButtonText="Extra Action"
            modalFooterAuxiliaryContentOnClick={onClick}
            modalFooterConfirmText="Confirm"
          />,
        );
        const element = getHostHTMLElement();
        const auxiliaryContainer = element.querySelector(
          `.${modalClasses.modalFooterAuxiliaryContentContainer}`,
        );
        const button = auxiliaryContainer?.querySelector('button');

        expect(button?.textContent).toBe('Extra Action');

        fireEvent.click(button!);
        expect(onClick).toHaveBeenCalledTimes(1);
      });
    });

    describe('checkbox', () => {
      it('should render checkbox with label', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <ModalFooter
            modalFooterAuxiliaryContentType="checkbox"
            modalFooterAuxiliaryContentLabel="Accept terms"
            modalFooterAuxiliaryContentChecked={false}
            modalFooterAuxiliaryContentOnChange={onChange}
            modalFooterConfirmText="Confirm"
          />,
        );
        const element = getHostHTMLElement();
        const checkbox = element.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(checkbox).toBeTruthy();
        expect(checkbox.checked).toBe(false);

        fireEvent.click(checkbox);
        expect(onChange).toHaveBeenCalledWith(true);
      });
    });

    describe('toggle', () => {
      it('should render toggle with label', () => {
        const onChange = jest.fn();
        const { getHostHTMLElement } = render(
          <ModalFooter
            modalFooterAuxiliaryContentType="toggle"
            modalFooterAuxiliaryContentLabel="Enable feature"
            modalFooterAuxiliaryContentChecked={true}
            modalFooterAuxiliaryContentOnChange={onChange}
            modalFooterConfirmText="Confirm"
          />,
        );
        const element = getHostHTMLElement();
        const toggle = element.querySelector('input[type="checkbox"]') as HTMLInputElement;

        expect(toggle).toBeTruthy();
        expect(toggle.checked).toBe(true);
      });
    });

    describe('password', () => {
      it('should render password mode with checkbox and button', () => {
        const onCheckboxChange = jest.fn();
        const onButtonClick = jest.fn();
        const { getHostHTMLElement } = render(
          <ModalFooter
            modalFooterAuxiliaryContentType="password"
            modalFooterPasswordChecked={false}
            modalFooterPasswordCheckedLabel="Remember me"
            modalFooterPasswordCheckedOnChange={onCheckboxChange}
            modalFooterPasswordButtonText="Forgot password?"
            modalFooterPasswordOnClick={onButtonClick}
            modalFooterConfirmText="Login"
          />,
        );
        const element = getHostHTMLElement();
        const passwordContainer = element.querySelector(
          `.${modalClasses.modalFooterPasswordContainer}`,
        );

        expect(passwordContainer).toBeTruthy();
        expect(passwordContainer?.textContent).toContain('Remember me');
        expect(passwordContainer?.textContent).toContain('Forgot password?');

        const checkbox = passwordContainer?.querySelector('input[type="checkbox"]') as HTMLInputElement;
        fireEvent.click(checkbox);
        expect(onCheckboxChange).toHaveBeenCalledWith(true);

        const button = passwordContainer?.querySelector('button') as HTMLButtonElement;
        fireEvent.click(button);
        expect(onButtonClick).toHaveBeenCalledTimes(1);
      });

      it('should add password mode class', () => {
        const { getHostHTMLElement } = render(
          <ModalFooter
            modalFooterAuxiliaryContentType="password"
            modalFooterPasswordCheckedLabel="Remember me"
            modalFooterPasswordButtonText="Forgot password?"
            modalFooterConfirmText="Login"
          />,
        );
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`${modalClasses.modalFooter}--password-mode`),
        ).toBe(true);
      });
    });
  });

  describe('prop: modalFooterConfirmButtonProps and modalFooterCancelButtonProps', () => {
    it('should pass additional props to confirm button', () => {
      const { getHostHTMLElement } = render(
        <ModalFooter
          modalFooterConfirmText="Confirm"
          modalFooterConfirmButtonProps={{ disabled: true }}
          modalFooterShowCancelButton={false}
        />,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll(
        `.${modalClasses.modalFooterActionsButton}`,
      );
      const confirmButton = buttons[0] as HTMLButtonElement;

      expect(confirmButton.disabled).toBe(true);
    });

    it('should pass additional props to cancel button', () => {
      const { getHostHTMLElement } = render(
        <ModalFooter
          modalFooterConfirmText="Confirm"
          modalFooterCancelText="Cancel"
          modalFooterCancelButtonProps={{ 'aria-label': 'close dialog' } as any}
        />,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll(
        `.${modalClasses.modalFooterActionsButton}`,
      );
      const cancelButton = buttons[0] as HTMLButtonElement;

      expect(cancelButton.getAttribute('aria-label')).toBe('close dialog');
    });
  });
});
