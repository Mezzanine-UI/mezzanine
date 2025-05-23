import { useState } from 'react';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import Checkbox, { CheckboxGroup } from '.';

describe('<CheckboxGroup />', () => {
  afterEach(cleanup);

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
      const [fooCheckboxElement, barCheckboxElement] =
        element.getElementsByTagName('input');

      expect(fooCheckboxElement.checked).toBeFalsy();
      expect(barCheckboxElement.checked).toBeTruthy();

      fireEvent.click(barCheckboxElement);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0]).toEqual([]);
      expect(fooCheckboxElement.checked).toBeFalsy();
      expect(barCheckboxElement.checked).toBeFalsy();

      fireEvent.click(barCheckboxElement);
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange.mock.calls[1][0]).toEqual(['bar']);
      expect(fooCheckboxElement.checked).toBeFalsy();
      expect(barCheckboxElement.checked).toBeTruthy();

      fireEvent.click(fooCheckboxElement);
      expect(onChange).toHaveBeenCalledTimes(3);
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
      const [fooCheckboxElement, barCheckboxElement] =
        element.getElementsByTagName('input');

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
