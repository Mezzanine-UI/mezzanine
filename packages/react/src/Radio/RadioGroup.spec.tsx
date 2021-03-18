import { useContext, useState } from 'react';
import {
  cleanup,
  fireEvent,
  render,
  renderHook,
  TestRenderer,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { RadioGroupContext, RadioGroupContextValue } from './RadioGroupContext';
import Radio, { RadioGroup, RadioGroupOption } from '.';

describe('<RadioGroup />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<RadioGroup ref={ref} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<RadioGroup className={className} />),
  );

  it('should bind role="radiogroup" and not overridable', () => {
    const { getHostHTMLElement } = render(<RadioGroup role="menu" />);
    const element = getHostHTMLElement();

    expect(element.getAttribute('role')).toBe('radiogroup');
  });

  it('should wrap children', () => {
    const { getHostHTMLElement } = render(<RadioGroup><div data-test="foo" /></RadioGroup>);
    const element = getHostHTMLElement();
    const { firstElementChild } = element;

    expect(firstElementChild!.getAttribute('data-test')).toBe('foo');
  });

  it('should provide RadioGroupContext', () => {
    let expectProps: RadioGroupContextValue = {
      disabled: true,
      name: 'foo',
      size: 'small',
      value: 'bar',
    };
    const { result, rerender } = renderHook(() => useContext(RadioGroupContext), {
      wrapper: RadioGroup,
      initialProps: expectProps,
    });

    /**
     * Ignore onChange since it will be transformed by RadioGroup
     */
    function testRadioGroupContextValue() {
      const {
        onChange,
        ...other
      } = result.current!;

      expect(other).toEqual(expectProps);
      expect(typeof onChange).toBe('function');
    }

    testRadioGroupContextValue();

    expectProps = {
      disabled: false,
      name: 'bar',
      size: 'large',
      value: 'zoo',
    };
    rerender(expectProps);
    testRadioGroupContextValue();
  });

  describe('prop: options', () => {
    const options: RadioGroupOption[] = [
      {
        label: 'foo',
        value: 'foo',
      },
      {
        disabled: true,
        label: 'bar',
        value: 'bar',
      },
    ];

    it('should render radios via options', () => {
      const testInstance = TestRenderer.create(
        <RadioGroup options={options} />,
      );
      const radios = testInstance.root.findAllByType(Radio);

      radios.forEach((radio, index) => {
        const option = options[index];

        expect(radio.props.children).toBe(option.label);
        expect(radio.props.disabled).toBe(option.disabled);
        expect(radio.props.value).toBe(option.value);
      });
    });

    it('should not render radios via options if children passed', () => {
      const { getHostHTMLElement } = render(
        <RadioGroup options={options}>
          <div data-test="foo">foo</div>
        </RadioGroup>,
      );
      const element = getHostHTMLElement();
      const { firstElementChild, childElementCount } = element;

      expect(firstElementChild!.getAttribute('data-test')).toBe('foo');
      expect(firstElementChild!.textContent).toBe('foo');
      expect(childElementCount).toBe(1);
    });
  });

  describe('control', () => {
    it('uncontrolled', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <RadioGroup defaultValue="bar" onChange={(event) => onChange(event.target.value)}>
          <Radio value="foo">foo</Radio>
          <Radio value="bar">bar</Radio>
        </RadioGroup>,
      );
      const element = getHostHTMLElement();
      const [fooRadioElement, barRadioElement] = element.getElementsByTagName('input');

      expect(fooRadioElement.checked).toBeFalsy();
      expect(barRadioElement.checked).toBeTruthy();

      fireEvent.click(barRadioElement);
      expect(onChange).not.toBeCalled();

      fireEvent.click(fooRadioElement);
      expect(onChange).toBeCalledTimes(1);
      expect(onChange).toBeCalledWith('foo');
      expect(fooRadioElement.checked).toBeTruthy();
      expect(barRadioElement.checked).toBeFalsy();
    });

    it('controlled', () => {
      const TestingComponent = () => {
        const [value, setValue] = useState('bar');

        return (
          <RadioGroup
            defaultValue="foo"
            onChange={(event) => setValue(event.target.value)}
            value={value}
          >
            <Radio value="foo">foo</Radio>
            <Radio value="bar">bar</Radio>
          </RadioGroup>
        );
      };

      const { getHostHTMLElement } = render(<TestingComponent />);
      const element = getHostHTMLElement();
      const [fooRadioElement, barRadioElement] = element.getElementsByTagName('input');

      expect(fooRadioElement.checked).toBeFalsy();
      expect(barRadioElement.checked).toBeTruthy();

      fireEvent.click(fooRadioElement);
      expect(fooRadioElement.checked).toBeTruthy();
      expect(barRadioElement.checked).toBeFalsy();
    });
  });
});
