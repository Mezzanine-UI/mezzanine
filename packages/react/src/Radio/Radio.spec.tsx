import { useState } from 'react';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { FormField } from '../Form';
import Radio, { RadioGroup } from '.';

describe('<Radio />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLLabelElement, (ref) =>
    render(<Radio ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Radio className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Radio />);
    const element = getHostHTMLElement();
    const { firstElementChild } = element.firstElementChild!;

    expect(firstElementChild!.classList.contains('mzn-radio')).toBeTruthy();
  });

  it('input of radio should be set to type="radio"', () => {
    const { getHostHTMLElement } = render(<Radio />);
    const element = getHostHTMLElement();
    const [inputElement] = element.getElementsByTagName('input');

    expect(inputElement.getAttribute('type')).toBe('radio');
  });

  describe('prop: checked', () => {
    [false, true].forEach((checked) => {
      it('should', () => {
        const { getHostHTMLElement } = render(<Radio checked={checked} />);
        const element = getHostHTMLElement();
        const { firstElementChild } = element.firstElementChild!;
        const [input] = element.getElementsByTagName('input');

        expect(
          firstElementChild!.classList.contains('mzn-radio--checked'),
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
      const { getHostHTMLElement } = render(<Radio />);
      const element = getHostHTMLElement();
      const [input] = element.getElementsByTagName('input');

      testDisabled(input, false);
    });

    [false, true].forEach((disabled) => {
      const message = disabled
        ? 'should have disabled attribute and set aria-disabled to true'
        : 'should not have disabled and set aria-disabled to false';

      it(message, () => {
        const { getHostHTMLElement } = render(<Radio disabled={disabled} />);
        const element = getHostHTMLElement();
        const [input] = element.getElementsByTagName('input');

        testDisabled(input, disabled);
      });
    });

    it('should use disabled from radio group if disabled not passed', () => {
      const { getHostHTMLElement } = render(
        <RadioGroup disabled>
          <Radio />
          <Radio disabled={false} />
        </RadioGroup>,
      );
      const element = getHostHTMLElement();
      const [input1, input2] = element.getElementsByTagName('input');

      testDisabled(input1, true);
      testDisabled(input2, false);
    });

    it('should use disabled from form control if disabled not passed', () => {
      const { getHostHTMLElement } = render(
        <FormField disabled>
          <Radio />
          <Radio disabled={false} />
        </FormField>,
      );
      const element = getHostHTMLElement();
      const [input1, input2] = element.getElementsByTagName('input');

      testDisabled(input1, true);
      testDisabled(input2, false);
    });
  });

  describe('prop: inputProps', () => {
    it('should pass inputProps.id to InputCheck.htmlFor', () => {
      const testId = 'foo';

      const { getHostHTMLElement } = render(
        <Radio inputProps={{ id: testId }} />,
      );
      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      expect(element.getAttribute('for')).toBe(testId);
      expect(inputElement.getAttribute('id')).toBe(testId);
    });

    it('should inputProps.name be bound to input', () => {
      const { getHostHTMLElement } = render(
        <Radio inputProps={{ name: 'foo' }} />,
      );
      const element = getHostHTMLElement();
      const [input] = element.getElementsByTagName('input');

      expect(input.name).toBe('foo');
    });

    it('should use name from Radio group if inputProps.name not passed', () => {
      const { getHostHTMLElement } = render(
        <RadioGroup name="foo">
          <Radio />
          <Radio inputProps={{ name: 'bar' }} />
        </RadioGroup>,
      );
      const element = getHostHTMLElement();
      const [input1, input2] = element.getElementsByTagName('input');

      expect(input1.name).toBe('foo');
      expect(input2.name).toBe('bar');
    });
  });

  describe('prop: value', () => {
    it('should be bound to input', () => {
      const { getHostHTMLElement } = render(<Radio value="foo" />);
      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      expect(inputElement.value).toBe('foo');
    });
  });

  describe('control', () => {
    it('uncontrolled', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Radio onChange={(event) => onChange(event.target.checked)} />,
      );
      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      expect(inputElement.checked).toBeFalsy();

      fireEvent.click(inputElement);
      expect(onChange).toBeCalledTimes(1);
      expect(onChange).toBeCalledWith(true);
      expect(inputElement.checked).toBeTruthy();
    });

    it('controlled', () => {
      const TestingComponent = () => {
        const [checked, setChecked] = useState(false);

        return (
          <Radio
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
