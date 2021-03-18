import { useState } from 'react';
import {
  cleanup,
  fireEvent,
  render,
  TestRenderer,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import InputCheck from '../_internal/InputCheck';
import { FormField } from '../Form';
import Radio, { RadioGroup } from '.';

describe('<Radio />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLLabelElement,
    (ref) => render(<Radio ref={ref} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<Radio className={className} />),
  );

  it('should pass children,disabled,error,htmlFor,size to InputCheck', () => {
    const testInstance = TestRenderer.create(
      <Radio
        disabled
        error
        htmlFor="bar"
        size="large"
      >
        foo
      </Radio>,
    );
    const inputCheckInstance = testInstance.root.findByType(InputCheck);

    expect(inputCheckInstance.props.children).toBe('foo');
    expect(inputCheckInstance.props.disabled).toBe(true);
    expect(inputCheckInstance.props.error).toBe(true);
    expect(inputCheckInstance.props.htmlFor).toBe('bar');
    expect(inputCheckInstance.props.size).toBe('large');
  });

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

        expect(firstElementChild!.classList.contains('mzn-radio--checked')).toBe(checked);
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

  describe('prop: error', () => {
    it('should use severity from form control if error not passed', () => {
      const testInstance = TestRenderer.create(
        <FormField severity="error">
          <Radio />
          <Radio error={false} />
        </FormField>,
      );
      const [inputCheck1, inputCheck2] = testInstance.root.findAllByType(InputCheck);

      expect(inputCheck1.props.error).toBe(true);
      expect(inputCheck2.props.error).toBe(false);
    });
  });

  describe('prop: htmlFor', () => {
    it('should be passed to both htmlFor of label and id of input', () => {
      const { getHostHTMLElement } = render(<Radio htmlFor="foo" />);
      const element = getHostHTMLElement();
      const [inputElement] = element.getElementsByTagName('input');

      expect(element.getAttribute('for')).toBe('foo');
      expect(inputElement.getAttribute('id')).toBe('foo');
    });
  });

  describe('prop: name', () => {
    it('should be bound to input', () => {
      const { getHostHTMLElement } = render(
        <Radio name="foo" />,
      );
      const element = getHostHTMLElement();
      const [input] = element.getElementsByTagName('input');

      expect(input.name).toBe('foo');
    });

    it('should use name from radio group if name not passed', () => {
      const { getHostHTMLElement } = render(
        <RadioGroup name="foo">
          <Radio />
          <Radio name="bar" />
        </RadioGroup>,
      );
      const element = getHostHTMLElement();
      const [input1, input2] = element.getElementsByTagName('input');

      expect(input1.name).toBe('foo');
      expect(input2.name).toBe('bar');
    });
  });

  describe('prop: size', () => {
    it('should use size from group if size not passed', () => {
      const testInstance = TestRenderer.create(
        <RadioGroup size="large">
          <Radio />
          <Radio size="small" />
        </RadioGroup>,
      );
      const [inputCheck1, inputCheck2] = testInstance.root.findAllByType(InputCheck);

      expect(inputCheck1.props.size).toBe('large');
      expect(inputCheck2.props.size).toBe('small');
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
