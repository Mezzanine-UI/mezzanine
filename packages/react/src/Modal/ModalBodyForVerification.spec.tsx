import { modalClasses } from '@mezzanine-ui/core/modal';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { ModalBodyForVerification } from '.';

describe('<ModalBodyForVerification />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<ModalBodyForVerification ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<ModalBodyForVerification className={className} />),
  );

  describe('basic rendering', () => {
    it('should bind body verification class', () => {
      const { getHostHTMLElement } = render(<ModalBodyForVerification />);
      const element = getHostHTMLElement();

      expect(element.classList.contains(modalClasses.modalBodyVerification)).toBeTruthy();
    });

    it('should render 4 inputs by default', () => {
      const { getHostHTMLElement } = render(<ModalBodyForVerification />);
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll(`.${modalClasses.modalBodyVerificationInput}`);

      expect(inputs.length).toBe(4);
    });

    it('should render custom number of inputs based on length prop', () => {
      const { getHostHTMLElement } = render(<ModalBodyForVerification length={6} />);
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll(`.${modalClasses.modalBodyVerificationInput}`);

      expect(inputs.length).toBe(6);
    });
  });

  describe('prop: disabled', () => {
    it('should disable all inputs when disabled=true', () => {
      const { getHostHTMLElement } = render(<ModalBodyForVerification disabled />);
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll(`.${modalClasses.modalBodyVerificationInput}`);

      inputs.forEach((input) => {
        expect((input as HTMLInputElement).disabled).toBe(true);
      });
    });

    it('should not call onChange when disabled', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <ModalBodyForVerification disabled onChange={onChange} />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector(`.${modalClasses.modalBodyVerificationInput}`) as HTMLInputElement;

      fireEvent.change(input, { target: { value: '1' } });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('prop: readOnly', () => {
    it('should set readonly attribute when readOnly=true', () => {
      const { getHostHTMLElement } = render(<ModalBodyForVerification readOnly />);
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll(`.${modalClasses.modalBodyVerificationInput}`);

      inputs.forEach((input) => {
        expect((input as HTMLInputElement).readOnly).toBe(true);
      });
    });

    it('should not call onChange when readOnly', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <ModalBodyForVerification readOnly onChange={onChange} />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector(`.${modalClasses.modalBodyVerificationInput}`) as HTMLInputElement;

      fireEvent.change(input, { target: { value: '1' } });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('prop: error', () => {
    it('should add error class when error=true', () => {
      const { getHostHTMLElement } = render(<ModalBodyForVerification error />);
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll(`.${modalClasses.modalBodyVerificationInput}`);

      inputs.forEach((input) => {
        expect(input.classList.contains(modalClasses.modalBodyVerificationInputError)).toBe(true);
      });
    });

    it('should not add error class when error=false', () => {
      const { getHostHTMLElement } = render(<ModalBodyForVerification error={false} />);
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll(`.${modalClasses.modalBodyVerificationInput}`);

      inputs.forEach((input) => {
        expect(input.classList.contains(modalClasses.modalBodyVerificationInputError)).toBe(false);
      });
    });
  });

  describe('prop: value', () => {
    it('should display initial value in inputs', () => {
      const { getHostHTMLElement } = render(<ModalBodyForVerification value="1234" />);
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll(`.${modalClasses.modalBodyVerificationInput}`) as NodeListOf<HTMLInputElement>;

      expect(inputs[0].value).toBe('1');
      expect(inputs[1].value).toBe('2');
      expect(inputs[2].value).toBe('3');
      expect(inputs[3].value).toBe('4');
    });

    it('should handle partial value', () => {
      const { getHostHTMLElement } = render(<ModalBodyForVerification value="12" />);
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll(`.${modalClasses.modalBodyVerificationInput}`) as NodeListOf<HTMLInputElement>;

      expect(inputs[0].value).toBe('1');
      expect(inputs[1].value).toBe('2');
      expect(inputs[2].value).toBe('');
      expect(inputs[3].value).toBe('');
    });
  });

  describe('prop: onChange', () => {
    it('should call onChange when input value changes', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(<ModalBodyForVerification onChange={onChange} />);
      const element = getHostHTMLElement();
      const input = element.querySelector(`.${modalClasses.modalBodyVerificationInput}`) as HTMLInputElement;

      fireEvent.change(input, { target: { value: '1' } });

      expect(onChange).toHaveBeenCalledWith('1');
    });

    it('should call onChange with full value after all inputs filled', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(<ModalBodyForVerification onChange={onChange} />);
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll(`.${modalClasses.modalBodyVerificationInput}`) as NodeListOf<HTMLInputElement>;

      fireEvent.change(inputs[0], { target: { value: '1' } });
      fireEvent.change(inputs[1], { target: { value: '2' } });
      fireEvent.change(inputs[2], { target: { value: '3' } });
      fireEvent.change(inputs[3], { target: { value: '4' } });

      expect(onChange).toHaveBeenLastCalledWith('1234');
    });
  });

  describe('prop: onComplete', () => {
    it('should call onComplete when all inputs are filled', () => {
      const onComplete = jest.fn();
      const { getHostHTMLElement } = render(<ModalBodyForVerification onComplete={onComplete} />);
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll(`.${modalClasses.modalBodyVerificationInput}`) as NodeListOf<HTMLInputElement>;

      fireEvent.change(inputs[0], { target: { value: '1' } });
      fireEvent.change(inputs[1], { target: { value: '2' } });
      fireEvent.change(inputs[2], { target: { value: '3' } });

      expect(onComplete).not.toHaveBeenCalled();

      fireEvent.change(inputs[3], { target: { value: '4' } });

      expect(onComplete).toHaveBeenCalledWith('1234');
    });

    it('should call onComplete with pasted full value', () => {
      const onComplete = jest.fn();
      const { getHostHTMLElement } = render(<ModalBodyForVerification onComplete={onComplete} />);
      const element = getHostHTMLElement();
      const input = element.querySelector(`.${modalClasses.modalBodyVerificationInput}`) as HTMLInputElement;

      fireEvent.paste(input, {
        clipboardData: {
          getData: () => '1234',
        },
      });

      expect(onComplete).toHaveBeenCalledWith('1234');
    });
  });

  describe('prop: onResend', () => {
    it('should not render resend section when onResend is not provided', () => {
      const { getHostHTMLElement } = render(<ModalBodyForVerification />);
      const element = getHostHTMLElement();
      const resendElement = element.querySelector(`.${modalClasses.modalBodyVerificationResend}`);

      expect(resendElement).toBeNull();
    });

    it('should render resend section when onResend is provided', () => {
      const onResend = jest.fn();
      const { getHostHTMLElement } = render(<ModalBodyForVerification onResend={onResend} />);
      const element = getHostHTMLElement();
      const resendElement = element.querySelector(`.${modalClasses.modalBodyVerificationResend}`);

      expect(resendElement).not.toBeNull();
    });

    it('should call onResend when resend link is clicked', () => {
      const onResend = jest.fn();
      const { getHostHTMLElement } = render(<ModalBodyForVerification onResend={onResend} />);
      const element = getHostHTMLElement();
      const resendLink = element.querySelector(`.${modalClasses.modalBodyVerificationResendLink}`) as HTMLElement;

      fireEvent.click(resendLink);

      expect(onResend).toHaveBeenCalled();
    });

    it('should render custom resend texts', () => {
      const onResend = jest.fn();
      const { getHostHTMLElement } = render(
        <ModalBodyForVerification
          onResend={onResend}
          resendPrompt="Custom prompt"
          resendText="Custom link"
        />,
      );
      const element = getHostHTMLElement();
      const resendElement = element.querySelector(`.${modalClasses.modalBodyVerificationResend}`) as HTMLElement;

      expect(resendElement.textContent).toContain('Custom prompt');
      expect(resendElement.textContent).toContain('Custom link');
    });
  });

  describe('keyboard interactions', () => {
    it('should move focus to next input after entering a value', () => {
      const { getHostHTMLElement } = render(<ModalBodyForVerification />);
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll(`.${modalClasses.modalBodyVerificationInput}`) as NodeListOf<HTMLInputElement>;

      inputs[0].focus();
      fireEvent.change(inputs[0], { target: { value: '1' } });

      expect(document.activeElement).toBe(inputs[1]);
    });

    it('should handle backspace to clear current input', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(<ModalBodyForVerification value="1234" onChange={onChange} />);
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll(`.${modalClasses.modalBodyVerificationInput}`) as NodeListOf<HTMLInputElement>;

      inputs[1].focus();
      fireEvent.keyDown(inputs[1], { key: 'Backspace' });

      expect(onChange).toHaveBeenCalledWith('134');
    });

    it('should move focus to previous input on backspace when current is empty', () => {
      const { getHostHTMLElement } = render(<ModalBodyForVerification value="1" />);
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll(`.${modalClasses.modalBodyVerificationInput}`) as NodeListOf<HTMLInputElement>;

      inputs[1].focus();
      fireEvent.keyDown(inputs[1], { key: 'Backspace' });

      expect(document.activeElement).toBe(inputs[0]);
    });

    it('should handle arrow left to move focus', () => {
      const { getHostHTMLElement } = render(<ModalBodyForVerification />);
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll(`.${modalClasses.modalBodyVerificationInput}`) as NodeListOf<HTMLInputElement>;

      inputs[1].focus();
      fireEvent.keyDown(inputs[1], { key: 'ArrowLeft' });

      expect(document.activeElement).toBe(inputs[0]);
    });

    it('should handle arrow right to move focus', () => {
      const { getHostHTMLElement } = render(<ModalBodyForVerification />);
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll(`.${modalClasses.modalBodyVerificationInput}`) as NodeListOf<HTMLInputElement>;

      inputs[0].focus();
      fireEvent.keyDown(inputs[0], { key: 'ArrowRight' });

      expect(document.activeElement).toBe(inputs[1]);
    });
  });

  describe('paste functionality', () => {
    it('should handle pasting full code', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(<ModalBodyForVerification onChange={onChange} />);
      const element = getHostHTMLElement();
      const input = element.querySelector(`.${modalClasses.modalBodyVerificationInput}`) as HTMLInputElement;

      fireEvent.paste(input, {
        clipboardData: {
          getData: () => '1234',
        },
      });

      expect(onChange).toHaveBeenCalledWith('1234');
    });

    it('should handle pasting partial code', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(<ModalBodyForVerification onChange={onChange} />);
      const element = getHostHTMLElement();
      const input = element.querySelector(`.${modalClasses.modalBodyVerificationInput}`) as HTMLInputElement;

      fireEvent.paste(input, {
        clipboardData: {
          getData: () => '12',
        },
      });

      expect(onChange).toHaveBeenCalledWith('12');
    });

    it('should truncate pasted code exceeding length', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(<ModalBodyForVerification onChange={onChange} />);
      const element = getHostHTMLElement();
      const input = element.querySelector(`.${modalClasses.modalBodyVerificationInput}`) as HTMLInputElement;

      fireEvent.paste(input, {
        clipboardData: {
          getData: () => '123456',
        },
      });

      expect(onChange).toHaveBeenCalledWith('1234');
    });

    it('should not handle paste when disabled', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <ModalBodyForVerification disabled onChange={onChange} />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector(`.${modalClasses.modalBodyVerificationInput}`) as HTMLInputElement;

      fireEvent.paste(input, {
        clipboardData: {
          getData: () => '1234',
        },
      });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should not handle paste when readOnly', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <ModalBodyForVerification readOnly onChange={onChange} />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector(`.${modalClasses.modalBodyVerificationInput}`) as HTMLInputElement;

      fireEvent.paste(input, {
        clipboardData: {
          getData: () => '1234',
        },
      });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('input restrictions', () => {
    it('should only accept last character when multiple characters entered', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(<ModalBodyForVerification onChange={onChange} />);
      const element = getHostHTMLElement();
      const input = element.querySelector(`.${modalClasses.modalBodyVerificationInput}`) as HTMLInputElement;

      fireEvent.change(input, { target: { value: '123' } });

      expect(onChange).toHaveBeenCalledWith('3');
    });
  });
});
