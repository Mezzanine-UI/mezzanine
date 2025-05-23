import { useState } from 'react';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { CheckAll, CheckboxGroup, CheckboxGroupOption } from '.';

describe('<CheckAll />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<CheckAll ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<CheckAll className={className} />),
  );

  it('should bind all class', () => {
    const { getHostHTMLElement } = render(<CheckAll />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-checkbox__all')).toBeTruthy();
  });

  describe('check all checkbox', () => {
    it('should be wrapped by <div />', () => {
      const { getHostHTMLElement } = render(<CheckAll />);
      const element = getHostHTMLElement();
      const { firstElementChild: checkAllCheckboxElement } =
        element.firstElementChild!;

      expect(
        checkAllCheckboxElement!.classList.contains('mzn-input-check'),
      ).toBeTruthy();
      expect(
        checkAllCheckboxElement!.querySelector('.mzn-checkbox'),
      ).toBeInstanceOf(HTMLElement);
    });
  });

  describe('control', () => {
    function testCheckAllCheckbox(
      element: HTMLInputElement,
      checked: boolean | 'mixed',
    ) {
      expect(element.getAttribute('aria-checked')).toBe(`${checked}`);
    }

    it('all options not disabled', () => {
      const options: CheckboxGroupOption[] = [
        {
          label: 'foo',
          value: 'foo',
        },
        {
          label: 'bar',
          value: 'bar',
        },
      ];
      const TestingComponent = () => {
        const [value, setValue] = useState(['bar']);

        return (
          <CheckAll>
            <CheckboxGroup
              onChange={setValue}
              options={options}
              value={value}
            />
          </CheckAll>
        );
      };

      const { getHostHTMLElement } = render(<TestingComponent />);
      const element = getHostHTMLElement();
      const [checkAllCheckboxElement, fooCheckboxElement, barCheckboxElement] =
        element.getElementsByTagName('input');

      /**
       * test clicking on checkboxes from options.
       */
      testCheckAllCheckbox(checkAllCheckboxElement, 'mixed');

      fireEvent.click(barCheckboxElement);
      testCheckAllCheckbox(checkAllCheckboxElement, false);

      fireEvent.click(barCheckboxElement);
      testCheckAllCheckbox(checkAllCheckboxElement, 'mixed');

      fireEvent.click(fooCheckboxElement);
      testCheckAllCheckbox(checkAllCheckboxElement, true);

      fireEvent.click(fooCheckboxElement);
      testCheckAllCheckbox(checkAllCheckboxElement, 'mixed');

      /**
       * test clicking on checkbox controlling whether to check all.
       */
      // indeterminate -> checked
      fireEvent.click(checkAllCheckboxElement);
      testCheckAllCheckbox(checkAllCheckboxElement, true);
      expect(fooCheckboxElement.checked).toBeTruthy();
      expect(barCheckboxElement.checked).toBeTruthy();

      // checked -> not checked
      fireEvent.click(checkAllCheckboxElement);
      testCheckAllCheckbox(checkAllCheckboxElement, false);
      expect(fooCheckboxElement.checked).toBeFalsy();
      expect(barCheckboxElement.checked).toBeFalsy();

      // not checked -> checked
      fireEvent.click(checkAllCheckboxElement);
      testCheckAllCheckbox(checkAllCheckboxElement, true);
      expect(fooCheckboxElement.checked).toBeTruthy();
      expect(barCheckboxElement.checked).toBeTruthy();
    });

    it('some options disabled', () => {
      const options: CheckboxGroupOption[] = [
        {
          label: 'foo',
          value: 'foo',
        },
        {
          label: 'bar',
          value: 'bar',
        },
        {
          disabled: true,
          label: 'zoo',
          value: 'zoo',
        },
      ];
      const TestingComponent = () => {
        const [value, setValue] = useState(['bar']);

        return (
          <CheckAll>
            <CheckboxGroup
              onChange={setValue}
              options={options}
              value={value}
            />
          </CheckAll>
        );
      };

      const { getHostHTMLElement } = render(<TestingComponent />);
      const element = getHostHTMLElement();
      const [
        checkAllCheckboxElement,
        fooCheckboxElement,
        barCheckboxElement,
        zooCheckboxElement,
      ] = element.getElementsByTagName('input');

      expect(zooCheckboxElement).toBeInstanceOf(HTMLInputElement);
      expect(zooCheckboxElement.disabled).toBeTruthy();

      /**
       * test clicking on checkboxes from options.
       */
      testCheckAllCheckbox(checkAllCheckboxElement, 'mixed');

      fireEvent.click(barCheckboxElement);
      testCheckAllCheckbox(checkAllCheckboxElement, false);

      fireEvent.click(barCheckboxElement);
      testCheckAllCheckbox(checkAllCheckboxElement, 'mixed');

      fireEvent.click(fooCheckboxElement);
      testCheckAllCheckbox(checkAllCheckboxElement, true);

      fireEvent.click(fooCheckboxElement);
      testCheckAllCheckbox(checkAllCheckboxElement, 'mixed');

      /**
       * test clicking on checkbox controlling whether to check all.
       */
      // indeterminate -> checked
      fireEvent.click(checkAllCheckboxElement);
      testCheckAllCheckbox(checkAllCheckboxElement, true);
      expect(fooCheckboxElement.checked).toBeTruthy();
      expect(barCheckboxElement.checked).toBeTruthy();

      // checked -> not checked
      fireEvent.click(checkAllCheckboxElement);
      testCheckAllCheckbox(checkAllCheckboxElement, false);
      expect(fooCheckboxElement.checked).toBeFalsy();
      expect(barCheckboxElement.checked).toBeFalsy();

      // not checked -> checked
      fireEvent.click(checkAllCheckboxElement);
      testCheckAllCheckbox(checkAllCheckboxElement, true);
      expect(fooCheckboxElement.checked).toBeTruthy();
      expect(barCheckboxElement.checked).toBeTruthy();
    });
  });
});
