import { CheckboxMode } from '@mezzanine-ui/core/checkbox';
import { createRef, useContext } from 'react';
import { cleanup, fireEvent, render, renderHook } from '../../__test-utils__';
import {
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { createWrapper } from '../../__test-utils__/render';
import Checkbox from './Checkbox';
import CheckboxGroup from './CheckboxGroup';
import { CheckboxGroupContext, CheckboxGroupContextValue } from './CheckboxGroupContext';

describe('<Checkbox />', () => {
  afterEach(cleanup);

  describe('ref', () => {
    it('should forward ref to label element', () => {
      const ref = createRef<HTMLLabelElement>();

      render(<Checkbox ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });
  });

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Checkbox className={className} />),
  );

  it('should render the label text', () => {
    const { getHostHTMLElement } = render(<Checkbox label="Hello" name="test" />);
    const element = getHostHTMLElement();

    expect(element.textContent).toContain('Hello');
  });

  it('should render the description text', () => {
    const { getHostHTMLElement } = render(
      <Checkbox label="Hello" name="test" description="Description text" />,
    );
    const element = getHostHTMLElement();

    expect(element.textContent).toContain('Description text');
  });

  describe('prop: mode', () => {
    it('should render mode="main" by default', () => {
      const { getHostHTMLElement } = render(<Checkbox />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-checkbox--main')).toBeTruthy();
    });

    const modes: CheckboxMode[] = ['main', 'sub', 'chip'];

    modes.forEach((mode) => {
      it(`should add class if mode="${mode}"`, () => {
        const { getHostHTMLElement } = render(<Checkbox mode={mode} />);
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-checkbox--${mode}`),
        ).toBeTruthy();
      });
    });

    it('should not render description when mode="chip"', () => {
      const { getHostHTMLElement } = render(
        <Checkbox mode="chip" label="Chip" name="test" description="Description" />,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).not.toContain('Description');
    });
  });

  describe('prop: checked', () => {
    it('should add checked class when checked=true', () => {
      const { getHostHTMLElement } = render(<Checkbox checked />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-checkbox--checked')).toBeTruthy();
    });

    it('should not add checked class when checked=false', () => {
      const { getHostHTMLElement } = render(<Checkbox checked={false} />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-checkbox--checked')).toBeFalsy();
    });

    it('should set aria-checked attribute correctly', () => {
      const { getHostHTMLElement } = render(<Checkbox checked />);
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.getAttribute('aria-checked')).toBe('true');
    });
  });

  describe('prop: indeterminate', () => {
    it('should add indeterminate class when indeterminate=true', () => {
      const { getHostHTMLElement } = render(<Checkbox indeterminate />);
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-checkbox--indeterminate'),
      ).toBeTruthy();
    });

    it('should set aria-checked="mixed" when indeterminate=true', () => {
      const { getHostHTMLElement } = render(<Checkbox indeterminate />);
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.getAttribute('aria-checked')).toBe('mixed');
    });

    it('should set input.indeterminate property', () => {
      const { getHostHTMLElement } = render(<Checkbox indeterminate />);
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.indeterminate).toBe(true);
    });
  });

  describe('prop: disabled', () => {
    it('should has disabled class and aria-disabled attribute', () => {
      [false, true].forEach((disabled) => {
        const { getHostHTMLElement } = render(<Checkbox disabled={disabled} />);
        const element = getHostHTMLElement();
        const input = element.querySelector('input') as HTMLInputElement;

        expect(element.classList.contains('mzn-checkbox--disabled')).toBe(
          disabled,
        );
        expect(input?.hasAttribute('disabled')).toBe(disabled);
        expect(input?.getAttribute('aria-disabled')).toBe(`${disabled}`);
      });
    });
  });

  describe('prop: value', () => {
    it('should set value attribute on input', () => {
      const { getHostHTMLElement } = render(<Checkbox value="test-value" />);
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.value).toBe('test-value');
    });
  });

  describe('prop: name', () => {
    it('should set name attribute on input', () => {
      const { getHostHTMLElement } = render(<Checkbox name="test-name" />);
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.name).toBe('test-name');
    });
  });

  describe('prop: onChange', () => {
    it('should be fired on change event', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(<Checkbox onChange={onChange} />);
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      fireEvent.click(input);

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should not be fired if disabled=true', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Checkbox disabled onChange={onChange} />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      fireEvent.change(input, { target: { checked: true } });

      // onChange may still be called, but the input should be disabled
      expect(input.disabled).toBe(true);
    });
  });

  describe('uncontrolled', () => {
    it('should work with defaultChecked', () => {
      const { getHostHTMLElement } = render(<Checkbox defaultChecked />);
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.checked).toBe(true);
      expect(element.classList.contains('mzn-checkbox--checked')).toBeTruthy();
    });

    it('should update when clicked', () => {
      const { getHostHTMLElement } = render(<Checkbox defaultChecked={false} />);
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.checked).toBe(false);

      fireEvent.click(input);

      expect(input.checked).toBe(true);
    });
  });

  describe('controlled', () => {
    it('should respect checked prop', () => {
      const { getHostHTMLElement, rerender } = render(
        <Checkbox checked={false} />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.checked).toBe(false);

      rerender(<Checkbox checked={true} />);

      expect(input.checked).toBe(true);
    });
  });

  describe('CheckboxGroup integration', () => {
    it('should get disabled from CheckboxGroup context', () => {
      const contextValue: CheckboxGroupContextValue = {
        disabled: true,
        name: 'group-name',
        value: [],
        onChange: jest.fn(),
      };

      const { getHostHTMLElement } = render(
        <CheckboxGroupContext.Provider value={contextValue}>
          <Checkbox value="option1" />
        </CheckboxGroupContext.Provider>,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.disabled).toBe(true);
      expect(element.classList.contains('mzn-checkbox--disabled')).toBeTruthy();
    });

    it('should get name from CheckboxGroup context', () => {
      const contextValue: CheckboxGroupContextValue = {
        disabled: false,
        name: 'group-name',
        value: [],
        onChange: jest.fn(),
      };

      const { getHostHTMLElement } = render(
        <CheckboxGroupContext.Provider value={contextValue}>
          <Checkbox value="option1" />
        </CheckboxGroupContext.Provider>,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.name).toBe('group-name');
    });

    it('should be checked when value is in CheckboxGroup value', () => {
      const contextValue: CheckboxGroupContextValue = {
        disabled: false,
        name: 'group-name',
        value: ['option1', 'option2'],
        onChange: jest.fn(),
      };

      const { getHostHTMLElement } = render(
        <CheckboxGroupContext.Provider value={contextValue}>
          <Checkbox value="option1" />
        </CheckboxGroupContext.Provider>,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.checked).toBe(true);
      expect(element.classList.contains('mzn-checkbox--checked')).toBeTruthy();
    });

    it('should call CheckboxGroup onChange when changed', () => {
      const onChange = jest.fn();
      const contextValue: CheckboxGroupContextValue = {
        disabled: false,
        name: 'group-name',
        value: [],
        onChange,
      };

      const { getHostHTMLElement } = render(
        <CheckboxGroupContext.Provider value={contextValue}>
          <Checkbox value="option1" />
        </CheckboxGroupContext.Provider>,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      fireEvent.click(input);

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should provide CheckboxGroupContext', () => {
      const expectProps: CheckboxGroupContextValue = {
        disabled: true,
        name: 'foo',
        value: ['bar'],
        onChange: jest.fn(),
      };

      const { result } = renderHook(() => useContext(CheckboxGroupContext), {
        wrapper: createWrapper(CheckboxGroup, expectProps),
      });

      function testCheckboxGroupContextValue() {
        const { onChange, ...other } = result.current!;

        expect(other).toEqual({
          disabled: expectProps.disabled,
          name: expectProps.name,
          value: expectProps.value,
        });
        expect(typeof onChange).toBe('function');
      }

      testCheckboxGroupContextValue();
    });
  });

  describe('chip mode specific behavior', () => {
    it('should render icon when checked in chip mode', () => {
      const { getHostHTMLElement } = render(
        <Checkbox mode="chip" checked label="Chip" name="test" />,
      );
      const element = getHostHTMLElement();
      const icon = element.querySelector('.mzn-icon');

      expect(icon).toBeTruthy();
    });

    it('should not render icon when unchecked in chip mode', () => {
      const { getHostHTMLElement } = render(
        <Checkbox mode="chip" checked={false} label="Chip" name="test" />,
      );
      const element = getHostHTMLElement();
      const icon = element.querySelector('.mzn-icon');

      expect(icon).toBeFalsy();
    });

    it('should not render indeterminate line in chip mode', () => {
      const { getHostHTMLElement } = render(
        <Checkbox mode="chip" indeterminate label="Chip" name="test" />,
      );
      const element = getHostHTMLElement();
      const indeterminateLine = element.querySelector(
        '.mzn-checkbox__indeterminate-line',
      );

      expect(indeterminateLine).toBeFalsy();
    });
  });
});
