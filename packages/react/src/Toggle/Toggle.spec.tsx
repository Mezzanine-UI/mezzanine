import { useState } from 'react';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Switch from '.';
import { FormField } from '../Form';

function testChecked(
  element: HTMLElement,
  inputElement: HTMLInputElement,
  checked: boolean,
) {
  expect(element.classList.contains('mzn-switch--checked')).toBe(checked);
  expect(inputElement.getAttribute('aria-checked')).toBe(`${checked}`);
}

function testInputDisabled(input: HTMLInputElement, disabled: boolean) {
  expect(input.disabled).toBe(disabled);
  expect(input.hasAttribute('disabled')).toBe(disabled);
  expect(input.getAttribute('aria-disabled')).toBe(`${disabled}`);
}

describe('<Switch />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLSpanElement, (ref) =>
    render(<Switch ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Switch className={className} />),
  );

  describe('prop: checked', () => {
    [false, true].forEach((checked) => {
      const message = checked
        ? 'should be checked if checked=true'
        : 'should be unchecked if checked=false';

      it(message, () => {
        const { getHostHTMLElement } = render(<Switch checked={checked} />);
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
          <Switch checked={checked} defaultChecked={!checked} />,
        );
        const element = getHostHTMLElement();
        const [inputElement] = element.getElementsByTagName('input');

        testChecked(element, inputElement, checked);
      });
    });
  });

  describe('prop: defaultChecked', () => {
    it('should be checked by default ', () => {
      const { getHostHTMLElement } = render(<Switch defaultChecked />);
      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      testChecked(element, inputElement, true);
    });
  });

  describe('prop: disabled', () => {
    it('should bind disabled class and has disabled and aria-disabled attributes', () => {
      [false, true].forEach((disabled) => {
        const { getHostHTMLElement } = render(<Switch disabled={disabled} />);
        const element = getHostHTMLElement();
        const [inputElement] = element.getElementsByTagName('input');

        expect(element.classList.contains('mzn-switch--disabled')).toBe(
          disabled,
        );
        testInputDisabled(inputElement, disabled);
      });
    });

    it('should use disabled from form control if disabled not passed', () => {
      const { getHostHTMLElement } = render(
        <FormField disabled>
          <Switch />
          <Switch disabled={false} />
        </FormField>,
      );
      const element = getHostHTMLElement();
      const [input1, input2] = element.getElementsByTagName('input');

      testInputDisabled(input1, true);
      testInputDisabled(input2, false);
    });
  });

  describe('prop: loading', () => {
    [false, true].forEach((loading) => {
      const message = loading
        ? 'should add spinner if loading=true'
        : 'should not add spinner if loading=false';

      it(message, () => {
        const { getHostHTMLElement } = render(<Switch loading={loading} />);
        const element = getHostHTMLElement();
        const spinnerElement = element.getElementsByTagName('i')[0];

        expect(!!spinnerElement).toBe(loading);
      });
    });

    it('should be disabled if loading=true', () => {
      const { getHostHTMLElement } = render(<Switch loading />);
      const element = getHostHTMLElement();
      const inputElement = element.getElementsByTagName('input')[0];

      expect(element.classList.contains('mzn-switch--disabled')).toBeTruthy();
      testInputDisabled(inputElement, true);
    });
  });

  describe('prop: onChange', () => {
    it('should trigger the onChange event', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(<Switch onChange={onChange} />);
      const element = getHostHTMLElement();
      const inputElement = element.getElementsByTagName('input')[0];

      fireEvent.click(inputElement);

      expect(onChange).toHaveBeenCalled();
    });

    /**
     * @see {@link https://github.com/testing-library/dom-testing-library/issues/92}
     */
    // it('should not be triggered if disabled=true', () => {
    //   const onChange = jest.fn();
    //   const { getHostHTMLElement } = render(<Switch disabled onChange={onChange} />);
    //   const element = getHostHTMLElement();
    //   const inputElement = element.getElementsByTagName('input')[0];

    //   fireEvent.click(inputElement);

    //   expect(onChange).not.toHaveBeenCalled();
    // });

    // it('should not be triggered if loading=true', () => {
    //   const onChange = jest.fn();
    //   const { getHostHTMLElement } = render(<Switch loading onChange={onChange} />);
    //   const element = getHostHTMLElement();
    //   const inputElement = element.getElementsByTagName('input')[0];

    //   fireEvent.click(inputElement);

    //   expect(onChange).not.toHaveBeenCalled();
    // });
  });

  describe('prop: size', () => {
    it('should render size="medium" by default', () => {
      const { getHostHTMLElement } = render(<Switch />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-switch--large')).toBeFalsy();
    });

    it('should add class if size="large"', () => {
      const { getHostHTMLElement } = render(<Switch size="large" />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-switch--large')).toBeTruthy();
    });
  });

  describe('control', () => {
    it('uncontrolled', () => {
      const { getHostHTMLElement } = render(<Switch />);
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
          <Switch
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
          <Switch
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

      /**
       * Since defaultChecked is true.
       */
      testChecked(element, inputElement, true);

      /**
       * Change to controlled and sync the switch.
       */
      rerender(<TestingContainer controlled />);
      testChecked(element, inputElement, false);

      /**
       * Still not checked after changed back to uncontrolled.
       */
      rerender(<TestingContainer controlled={false} />);
      testChecked(element, inputElement, false);
    });
  });
});
