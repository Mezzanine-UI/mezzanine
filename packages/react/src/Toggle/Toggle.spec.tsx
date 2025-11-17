import { useState } from 'react';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Toggle from '.';
import { FormField } from '../Form';

function testChecked(
  element: HTMLElement,
  inputElement: HTMLInputElement,
  checked: boolean,
) {
  expect(element.classList.contains('mzn-toggle--checked')).toBe(checked);
  expect(inputElement.getAttribute('aria-checked')).toBe(`${checked}`);
}

function testInputDisabled(input: HTMLInputElement, disabled: boolean) {
  expect(input.disabled).toBe(disabled);
  expect(input.hasAttribute('disabled')).toBe(disabled);
  expect(input.getAttribute('aria-disabled')).toBe(`${disabled}`);
}

describe('<Toggle />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Toggle ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Toggle className={className} />),
  );

  describe('prop: checked', () => {
    [false, true].forEach((checked) => {
      const message = checked
        ? 'should be checked if checked=true'
        : 'should be unchecked if checked=false';

      it(message, () => {
        const { getHostHTMLElement } = render(<Toggle checked={checked} />);
        const element = getHostHTMLElement();
        const [inputElement] = element.getElementsByTagName('input');

        testChecked(element, inputElement, checked);
      });
    });

    [false, true].forEach((checked) => {
      const message = checked
        ? 'should override defaultChecked=false if checked=true'
        : 'should override defaultChecked=true if checked=false';

      it(message, () => {
        const { getHostHTMLElement } = render(
          <Toggle checked={checked} defaultChecked={!checked} />,
        );
        const element = getHostHTMLElement();
        const [inputElement] = element.getElementsByTagName('input');

        testChecked(element, inputElement, checked);
      });
    });
  });

  describe('prop: defaultChecked', () => {
    it('should be checked by default ', () => {
      const { getHostHTMLElement } = render(<Toggle defaultChecked />);
      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      testChecked(element, inputElement, true);
    });
  });

  describe('prop: disabled', () => {
    it('should bind disabled class and has disabled and aria-disabled attributes', () => {
      [false, true].forEach((disabled) => {
        const { getHostHTMLElement } = render(<Toggle disabled={disabled} />);
        const element = getHostHTMLElement();
        const [inputElement] = element.getElementsByTagName('input');

        expect(element.classList.contains('mzn-toggle--disabled')).toBe(
          disabled,
        );
        testInputDisabled(inputElement, disabled);
      });
    });

    it('should use disabled from form control if disabled not passed', () => {
      const { getHostHTMLElement } = render(
        <FormField disabled>
          <Toggle />
          <Toggle disabled={false} />
        </FormField>,
      );
      const element = getHostHTMLElement();
      const [input1, input2] = element.getElementsByTagName('input');

      testInputDisabled(input1, true);
      testInputDisabled(input2, false);
    });
  });

  describe('prop: onChange', () => {
    it('should trigger the onChange event', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(<Toggle onChange={onChange} />);
      const element = getHostHTMLElement();
      const inputElement = element.getElementsByTagName('input')[0];

      fireEvent.click(inputElement);

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('prop: size', () => {
    it('should render size="main" by default', () => {
      const { getHostHTMLElement } = render(<Toggle />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-toggle--main')).toBeTruthy();
      expect(element.classList.contains('mzn-toggle--sub')).toBeFalsy();
    });

    it('should add class if size="sub"', () => {
      const { getHostHTMLElement } = render(<Toggle size="sub" />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-toggle--sub')).toBeTruthy();
      expect(element.classList.contains('mzn-toggle--main')).toBeFalsy();
    });
  });

  describe('prop: label', () => {
    it('should render label if provided', () => {
      const { getHostHTMLElement } = render(<Toggle label="Test Label" />);
      const element = getHostHTMLElement();
      const textContainer = element.querySelector(
        '.mzn-toggle__text-container',
      );

      expect(textContainer).toBeTruthy();
      expect(textContainer?.textContent).toContain('Test Label');
    });

    it('should not render text container if no label provided', () => {
      const { getHostHTMLElement } = render(<Toggle />);
      const element = getHostHTMLElement();
      const textContainer = element.querySelector(
        '.mzn-toggle__text-container',
      );

      expect(textContainer).toBeNull();
    });
  });

  describe('prop: supportingText', () => {
    it('should render supporting text when label is provided', () => {
      const { getHostHTMLElement } = render(
        <Toggle label="Test Label" supportingText="Supporting text" />,
      );
      const element = getHostHTMLElement();
      const textContainer = element.querySelector(
        '.mzn-toggle__text-container',
      );

      expect(textContainer).toBeTruthy();
      expect(textContainer?.textContent).toContain('Test Label');
      expect(textContainer?.textContent).toContain('Supporting text');
    });

    it('should not render supporting text if no label provided', () => {
      const { getHostHTMLElement } = render(
        <Toggle supportingText="Supporting text" />,
      );
      const element = getHostHTMLElement();
      const textContainer = element.querySelector(
        '.mzn-toggle__text-container',
      );

      expect(textContainer).toBeNull();
    });
  });

  describe('control', () => {
    it('uncontrolled', () => {
      const { getHostHTMLElement } = render(<Toggle />);
      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      fireEvent.click(inputElement);

      testChecked(element, inputElement, true);

      fireEvent.click(inputElement);

      testChecked(element, inputElement, false);
    });

    it('controlled', () => {
      function TestingContainer() {
        const [checked, setChecked] = useState(false);

        return (
          <Toggle
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
          />
        );
      }

      const { getHostHTMLElement } = render(<TestingContainer />);
      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      fireEvent.click(inputElement);

      testChecked(element, inputElement, true);

      fireEvent.click(inputElement);

      testChecked(element, inputElement, false);
    });

    it('sync between uncontrolled and controlled', () => {
      function TestingContainer({ controlled }: { controlled: boolean }) {
        const [checked, setChecked] = useState(false);

        return (
          <Toggle
            checked={controlled ? checked : undefined}
            defaultChecked
            onChange={(event) => setChecked(event.target.checked)}
          />
        );
      }

      const { getHostHTMLElement, rerender } = render(
        <TestingContainer controlled={false} />,
      );
      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      testChecked(element, inputElement, true);

      rerender(<TestingContainer controlled />);
      testChecked(element, inputElement, false);

      rerender(<TestingContainer controlled={false} />);
      testChecked(element, inputElement, false);
    });
  });
});
