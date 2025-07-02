import { useState } from 'react';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { FormField } from '../Form';
import Checkbox, { CheckboxGroup } from '.';

describe('<Checkbox />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLLabelElement, (ref) =>
    render(<Checkbox ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Checkbox className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Checkbox />);
    const element = getHostHTMLElement();
    const { firstElementChild } = element.firstElementChild!;

    expect(firstElementChild!.classList.contains('mzn-checkbox')).toBeTruthy();
  });

  it('input of checkbox should be set to type="checkbox"', () => {
    const { getHostHTMLElement } = render(<Checkbox />);
    const element = getHostHTMLElement();
    const [inputElement] = element.getElementsByTagName('input');

    expect(inputElement.getAttribute('type')).toBe('checkbox');
  });

  describe('prop: checked', () => {
    [false, true].forEach((checked) => {
      it('should', () => {
        const { getHostHTMLElement } = render(<Checkbox checked={checked} />);
        const element = getHostHTMLElement();
        const { firstElementChild } = element.firstElementChild!;
        const [input] = element.getElementsByTagName('input');

        expect(
          firstElementChild!.classList.contains('mzn-checkbox--checked'),
        ).toBe(checked);
        expect(input.getAttribute('aria-checked')).toBe(`${checked}`);
        expect(input.checked).toBe(checked);
      });
    });
  });

  describe('prop: disabled', () => {
    function testDisabled(input: HTMLInputElement, disabled: boolean) {
      expect(input.disabled).toBe(disabled);
      expect(input.hasAttribute('disabled')).toBe(disabled);
      expect(input.getAttribute('aria-disabled')).toBe(`${disabled}`);
    }

    it('should render disabled=false by default', () => {
      const { getHostHTMLElement } = render(<Checkbox />);
      const element = getHostHTMLElement();
      const [input] = element.getElementsByTagName('input');

      testDisabled(input, false);
    });

    [false, true].forEach((disabled) => {
      const message = disabled
        ? 'should have disabled attribute and set aria-disabled to true'
        : 'should not have disabled and set aria-disabled to false';

      it(message, () => {
        const { getHostHTMLElement } = render(<Checkbox disabled={disabled} />);
        const element = getHostHTMLElement();
        const [input] = element.getElementsByTagName('input');

        testDisabled(input, disabled);
      });
    });

    it('should use disabled from checkbox group if disabled not passed', () => {
      const { getHostHTMLElement } = render(
        <CheckboxGroup disabled>
          <Checkbox />
          <Checkbox disabled={false} />
        </CheckboxGroup>,
      );
      const element = getHostHTMLElement();
      const [input1, input2] = element.getElementsByTagName('input');

      testDisabled(input1, true);
      testDisabled(input2, false);
    });

    it('should use disabled from form control if disabled not passed', () => {
      const { getHostHTMLElement } = render(
        <FormField disabled>
          <Checkbox />
          <Checkbox disabled={false} />
        </FormField>,
      );
      const element = getHostHTMLElement();
      const [input1, input2] = element.getElementsByTagName('input');

      testDisabled(input1, true);
      testDisabled(input2, false);
    });
  });

  describe('prop: indeterminate', () => {
    function testIndeterminateAriaChecked(
      element: HTMLElement,
      ariaChecked: string,
    ) {
      const [inputElement] = element.getElementsByTagName('input');

      expect(inputElement.getAttribute('aria-checked')).toBe(ariaChecked);
    }

    function testIndeterminateClass(
      element: HTMLElement,
      indeterminate: boolean,
    ) {
      const { firstElementChild } = element.firstElementChild!;

      expect(
        firstElementChild!.classList.contains('mzn-checkbox--indeterminate'),
      ).toBe(indeterminate);
    }

    it('should not be indeterminate by default', () => {
      const { getHostHTMLElement } = render(<Checkbox />);
      const element = getHostHTMLElement();

      testIndeterminateAriaChecked(element, `${false}`);
      testIndeterminateClass(element, false);
    });

    it('should not be indeterminate if indeterminate=false', () => {
      const { getHostHTMLElement } = render(<Checkbox indeterminate={false} />);
      const element = getHostHTMLElement();

      testIndeterminateAriaChecked(element, `${false}`);
      testIndeterminateClass(element, false);
    });

    it('should be indeterminate if indeterminate=true', () => {
      const { getHostHTMLElement } = render(<Checkbox indeterminate />);
      const element = getHostHTMLElement();

      testIndeterminateAriaChecked(element, 'mixed');
      testIndeterminateClass(element, true);
    });

    it('should not be indeterminate if checked', () => {
      const { getHostHTMLElement } = render(
        <Checkbox defaultChecked indeterminate />,
      );
      const element = getHostHTMLElement();

      testIndeterminateAriaChecked(element, `${true}`);
      testIndeterminateClass(element, false);
    });
  });

  describe('prop: inputProps', () => {
    it('should pass inputProps.id to InputCheck.htmlFor', () => {
      const testId = 'foo';

      const { getHostHTMLElement } = render(
        <Checkbox inputProps={{ id: testId }} />,
      );
      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      expect(element.getAttribute('for')).toBe(testId);
      expect(inputElement.getAttribute('id')).toBe(testId);
    });

    it('should inputProps.name be bound to input', () => {
      const { getHostHTMLElement } = render(
        <Checkbox inputProps={{ name: 'foo' }} />,
      );
      const element = getHostHTMLElement();
      const [input] = element.getElementsByTagName('input');

      expect(input.name).toBe('foo');
    });

    it('should use name from checkbox group if inputProps.name not passed', () => {
      const { getHostHTMLElement } = render(
        <CheckboxGroup name="foo">
          <Checkbox />
          <Checkbox inputProps={{ name: 'bar' }} />
        </CheckboxGroup>,
      );
      const element = getHostHTMLElement();
      const [input1, input2] = element.getElementsByTagName('input');

      expect(input1.name).toBe('foo');
      expect(input2.name).toBe('bar');
    });
  });

  describe('prop: value', () => {
    it('should be bound to input', () => {
      const { getHostHTMLElement } = render(<Checkbox value="foo" />);
      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      expect(inputElement.value).toBe('foo');
    });
  });

  describe('control', () => {
    it('uncontrolled', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Checkbox onChange={(event) => onChange(event.target.checked)} />,
      );
      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      expect(inputElement.checked).toBeFalsy();

      fireEvent.click(inputElement);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(true);
      expect(inputElement.checked).toBeTruthy();
    });

    it('controlled', () => {
      const TestingComponent = () => {
        const [checked, setChecked] = useState(false);

        return (
          <Checkbox
            checked={checked}
            defaultChecked
            onChange={(event) => setChecked(event.target.checked)}
          />
        );
      };

      const { getHostHTMLElement } = render(<TestingComponent />);
      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      expect(inputElement.checked).toBeFalsy();

      fireEvent.click(inputElement);
      expect(inputElement.checked).toBeTruthy();
    });
  });
});
