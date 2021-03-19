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
import { CheckboxGroupContext, CheckboxGroupContextValue } from './CheckboxGroupContext';
import Checkbox, { CheckboxGroup, CheckboxGroupOption } from '.';

describe('<CheckboxGroup />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<CheckboxGroup ref={ref} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<CheckboxGroup className={className} />),
  );

  it('should wrap children', () => {
    const { getHostHTMLElement } = render(<CheckboxGroup><div data-test="foo" /></CheckboxGroup>);
    const element = getHostHTMLElement();
    const { firstElementChild } = element;

    expect(firstElementChild!.getAttribute('data-test')).toBe('foo');
  });

  it('should provide CheckboxGroupContext', () => {
    let expectProps: CheckboxGroupContextValue = {
      disabled: true,
      name: 'foo',
      size: 'small',
      value: ['bar'],
    };
    const { result, rerender } = renderHook(() => useContext(CheckboxGroupContext), {
      wrapper: CheckboxGroup as any,
      initialProps: expectProps,
    });

    /**
     * Ignore onChange since it will be transformed by CheckboxGroup
     */
    function testCheckboxGroupContextValue() {
      const {
        onChange,
        ...other
      } = result.current!;

      expect(other).toEqual(expectProps);
      expect(typeof onChange).toBe('function');
    }

    testCheckboxGroupContextValue();

    expectProps = {
      disabled: false,
      name: 'bar',
      size: 'large',
      value: ['zoo'],
    };
    rerender(expectProps);
    testCheckboxGroupContextValue();
  });

  describe('prop: options', () => {
    const options: CheckboxGroupOption[] = [
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

    it('should render checkboxes via options', () => {
      const testInstance = TestRenderer.create(
        <CheckboxGroup options={options} />,
      );
      const checkboxes = testInstance.root.findAllByType(Checkbox);

      checkboxes.forEach((checkbox, index) => {
        const option = options[index];

        expect(checkbox.props.children).toBe(option.label);
        expect(checkbox.props.disabled).toBe(option.disabled);
        expect(checkbox.props.value).toBe(option.value);
      });
    });

    it('should not render checkboxes via options if children passed', () => {
      const { getHostHTMLElement } = render(
        <CheckboxGroup options={options}>
          <div data-test="foo">foo</div>
        </CheckboxGroup>,
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
        <CheckboxGroup defaultValue={['bar']} onChange={onChange}>
          <Checkbox value="foo">foo</Checkbox>
          <Checkbox value="bar">bar</Checkbox>
        </CheckboxGroup>,
      );
      const element = getHostHTMLElement();
      const [fooCheckboxElement, barCheckboxElement] = element.getElementsByTagName('input');

      expect(fooCheckboxElement.checked).toBeFalsy();
      expect(barCheckboxElement.checked).toBeTruthy();

      fireEvent.click(barCheckboxElement);
      expect(onChange).toBeCalledTimes(1);
      expect(onChange.mock.calls[0][0]).toEqual([]);
      expect(fooCheckboxElement.checked).toBeFalsy();
      expect(barCheckboxElement.checked).toBeFalsy();

      fireEvent.click(barCheckboxElement);
      expect(onChange).toBeCalledTimes(2);
      expect(onChange.mock.calls[1][0]).toEqual(['bar']);
      expect(fooCheckboxElement.checked).toBeFalsy();
      expect(barCheckboxElement.checked).toBeTruthy();

      fireEvent.click(fooCheckboxElement);
      expect(onChange).toBeCalledTimes(3);
      expect(onChange.mock.calls[2][0]).toEqual(['bar', 'foo']);
      expect(fooCheckboxElement.checked).toBeTruthy();
      expect(barCheckboxElement.checked).toBeTruthy();
    });

    it('controlled', () => {
      const TestingComponent = () => {
        const [value, setValue] = useState(['bar']);

        return (
          <CheckboxGroup
            defaultValue={['foo']}
            onChange={setValue}
            value={value}
          >
            <Checkbox value="foo">foo</Checkbox>
            <Checkbox value="bar">bar</Checkbox>
          </CheckboxGroup>
        );
      };

      const { getHostHTMLElement } = render(<TestingComponent />);
      const element = getHostHTMLElement();
      const [fooCheckboxElement, barCheckboxElement] = element.getElementsByTagName('input');

      expect(fooCheckboxElement.checked).toBeFalsy();
      expect(barCheckboxElement.checked).toBeTruthy();

      fireEvent.click(barCheckboxElement);
      expect(fooCheckboxElement.checked).toBeFalsy();
      expect(barCheckboxElement.checked).toBeFalsy();

      fireEvent.click(barCheckboxElement);
      expect(fooCheckboxElement.checked).toBeFalsy();
      expect(barCheckboxElement.checked).toBeTruthy();

      fireEvent.click(fooCheckboxElement);
      expect(fooCheckboxElement.checked).toBeTruthy();
      expect(barCheckboxElement.checked).toBeTruthy();
    });
  });
});
