import { useContext, useState } from 'react';
import { cleanup, fireEvent, render, renderHook } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { RadioGroupContext, RadioGroupContextValue } from './RadioGroupContext';
import Radio, { RadioGroup } from '.';
import { createWrapper } from '../../__test-utils__/render';

describe('<RadioGroup />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<RadioGroup ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<RadioGroup className={className} />),
  );

  it('should bind role="radiogroup" and not overridable', () => {
    const { getHostHTMLElement } = render(<RadioGroup role="menu" />);
    const element = getHostHTMLElement();

    expect(element.getAttribute('role')).toBe('radiogroup');
  });

  it('should wrap children', () => {
    const { getHostHTMLElement } = render(
      <RadioGroup>
        <div data-test="foo" />
      </RadioGroup>,
    );
    const element = getHostHTMLElement();
    const { firstElementChild } = element;

    expect(firstElementChild!.getAttribute('data-test')).toBe('foo');
  });

  it('should provide RadioGroupContext', () => {
    let expectProps: RadioGroupContextValue = {
      disabled: true,
      name: 'foo',
      size: 'main',
      value: 'bar',
    };
    const { result } = renderHook(() => useContext(RadioGroupContext), {
      wrapper: createWrapper(RadioGroup, expectProps),
    });

    /**
     * Ignore onChange since it will be transformed by RadioGroup
     */
    function testRadioGroupContextValue() {
      const { onChange, ...other } = result.current!;

      expect(other).toEqual(expectProps);
      expect(typeof onChange).toBe('function');
    }

    testRadioGroupContextValue();
  });

  describe('control', () => {
    it('uncontrolled', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <RadioGroup
          defaultValue="bar"
          onChange={(event) => onChange(event.target.value)}
        >
          <Radio value="foo">foo</Radio>
          <Radio value="bar">bar</Radio>
        </RadioGroup>,
      );
      const element = getHostHTMLElement();
      const [fooRadioElement, barRadioElement] =
        element.getElementsByTagName('input');

      expect(fooRadioElement.checked).toBeFalsy();
      expect(barRadioElement.checked).toBeTruthy();

      fireEvent.click(barRadioElement);
      expect(onChange).not.toHaveBeenCalled();

      fireEvent.click(fooRadioElement);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('foo');
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
      const [fooRadioElement, barRadioElement] =
        element.getElementsByTagName('input');

      expect(fooRadioElement.checked).toBeFalsy();
      expect(barRadioElement.checked).toBeTruthy();

      fireEvent.click(fooRadioElement);
      expect(fooRadioElement.checked).toBeTruthy();
      expect(barRadioElement.checked).toBeFalsy();
    });
  });
});
