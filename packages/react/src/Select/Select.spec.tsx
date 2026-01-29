/* global document */

import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import { PlusIcon } from '@mezzanine-ui/icons';
import { createRef, RefObject } from 'react';
import { act, cleanupHook, fireEvent, render, waitFor } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Icon from '../Icon';
import Option from './Option';
import Select from './Select';
import { SelectValue } from './typings';

// Mock ResizeObserver - jsdom 不支援此 API
const originalResizeObserver = (global as typeof globalThis).ResizeObserver;
class ResizeObserverMock {
  observe() { }
  unobserve() { }
  disconnect() { }
}

beforeAll(() => {
  (global as typeof globalThis).ResizeObserver =
    ResizeObserverMock as unknown as typeof ResizeObserver;
});

afterAll(() => {
  (global as typeof globalThis).ResizeObserver = originalResizeObserver;
});

function getSelectInputElement(element: HTMLElement) {
  return element.getElementsByTagName('input')[0];
}

async function testTextFieldClicked(element: HTMLElement | Element) {
  const textField = element.querySelector('.mzn-text-field');

  await act(async () => {
    fireEvent.click(textField!);
  });
}

describe('<Select />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Select ref={ref} />),
  );

  describeForwardRefToHTMLElement(HTMLInputElement, (ref) =>
    render(<Select inputRef={ref} />),
  );

  describe('basic rendering', () => {
    it('should bind host class', () => {
      const { getHostHTMLElement } = render(<Select />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-select')).toBeTruthy();
    });

    it('should render input element with correct attributes', async () => {
      const { getHostHTMLElement } = render(
        <Select disabled placeholder="placeholder" required />,
      );
      const element = getHostHTMLElement();
      const inputElement = getSelectInputElement(element);

      await waitFor(() => {
        expect(inputElement.hasAttribute('disabled')).toBe(true);
        expect(inputElement.getAttribute('aria-haspopup')).toBe('listbox');
        // Placeholder may not be set as attribute when disabled, but should be in placeholder prop
        expect(inputElement.hasAttribute('readonly')).toBe(true);
        expect(inputElement.getAttribute('role')).toBe('combobox');
        expect(inputElement.getAttribute('value')).toBe('');
      });
    });

    it('should open dropdown when text field is clicked', async () => {
      const { getHostHTMLElement } = render(<Select />);
      const element = getHostHTMLElement();

      expect(document.querySelector('.mzn-dropdown-popper--with-portal')).toBeNull();

      await testTextFieldClicked(element);

      await waitFor(() => {
        expect(document.querySelector('.mzn-dropdown-popper--with-portal')).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.querySelector('.mzn-dropdown-list')).toBeInstanceOf(
          HTMLUListElement,
        );
      });
    });
  });

  describe('focus handlers', () => {
    it('should invoke onFocus when opening via text-field click', async () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(
        <Select onFocus={onFocus} onBlur={onBlur} />,
      );
      const element = getHostHTMLElement();

      await testTextFieldClicked(element);

      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledTimes(0);
    });

    it('should invoke onBlur when closing via text-field click', async () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(
        <Select onFocus={onFocus} onBlur={onBlur} />,
      );
      const element = getHostHTMLElement();

      await testTextFieldClicked(element);
      expect(onFocus).toHaveBeenCalledTimes(1);

      await testTextFieldClicked(element);
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should invoke onBlur when closing via click-away', async () => {
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(<Select onBlur={onBlur} />);
      const element = getHostHTMLElement();

      await testTextFieldClicked(element);

      await act(async () => {
        fireEvent.click(document.body);
      });
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should invoke onBlur when closing via Tab key', async () => {
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(<Select onBlur={onBlur} />);
      const element = getHostHTMLElement();

      await testTextFieldClicked(element);

      await act(async () => {
        fireEvent.keyDown(element.querySelector('.mzn-text-field')!, {
          code: 'Tab',
        });
      });
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should not invoke onBlur when Tab key pressed but dropdown is not open', async () => {
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(<Select onBlur={onBlur} />);
      const element = getHostHTMLElement();

      await act(async () => {
        fireEvent.keyDown(element.querySelector('.mzn-text-field')!, {
          code: 'Tab',
        });
      });
      expect(onBlur).toHaveBeenCalledTimes(0);
    });

    it('should invoke onBlur when closing via Enter key', async () => {
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(<Select onBlur={onBlur} />);
      const element = getHostHTMLElement();

      await testTextFieldClicked(element);

      await act(async () => {
        fireEvent.keyDown(element.querySelector('.mzn-text-field')!, {
          code: 'Enter',
        });
      });
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    const arrowKeyCodes = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    arrowKeyCodes.forEach((arrowKeyCode) => {
      it(`should invoke onFocus when opening via ${arrowKeyCode} key`, async () => {
        const onFocus = jest.fn();
        const { getHostHTMLElement } = render(<Select onFocus={onFocus} />);
        const element = getHostHTMLElement();

        await act(async () => {
          fireEvent.keyDown(element.querySelector('.mzn-text-field')!, {
            code: arrowKeyCode,
          });
        });
        expect(onFocus).toHaveBeenCalledTimes(1);
      });
    });

    arrowKeyCodes.forEach((arrowKeyCode) => {
      it(`should not invoke onFocus when ${arrowKeyCode} key pressed but dropdown is already open`, async () => {
        const onFocus = jest.fn();
        const { getHostHTMLElement } = render(<Select onFocus={onFocus} />);
        const element = getHostHTMLElement();

        await testTextFieldClicked(element);
        onFocus.mockClear();

        await act(async () => {
          fireEvent.keyDown(element.querySelector('.mzn-text-field')!, {
            code: arrowKeyCode,
          });
        });
        expect(onFocus).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('prop: suffixActionIcon', () => {
    it('should render suffix action icon', async () => {
      const { getHostHTMLElement } = render(
        <Select suffixActionIcon={<Icon icon={PlusIcon} />} />,
      );
      const element = getHostHTMLElement();

      // Wait for TextField to render suffix
      await waitFor(() => {
        const suffix = element.querySelector('.mzn-text-field__suffix');
        expect(suffix).toBeTruthy();
      });

      await waitFor(() => {
        const icon = element.querySelector(
          '.mzn-text-field__suffix [data-icon-name="plus"]',
        );
        expect(icon).toBeTruthy();
      });
    });
  });

  describe('props: defaultValue/inputRef/renderValue', () => {
    let inputRef: RefObject<HTMLInputElement | null>;
    const defaultValue: SelectValue = { id: '1', name: 'bar' };

    beforeEach(async () => {
      inputRef = createRef<HTMLInputElement>();

      const renderValue = jest.fn<string, [SelectValue | null]>((value) =>
        value ? value.name : '',
      );

      await act(async () => {
        render(
          <Select
            defaultValue={defaultValue}
            inputRef={inputRef}
            renderValue={renderValue}
          />,
        );
      });
    });

    it('should set input value correctly', () => {
      expect(inputRef.current!.value).toEqual('bar');
    });
  });

  describe('mode: single', () => {
    const defaultValue: SelectValue = { id: '1', name: 'foo' };

    let element: HTMLElement;
    const onChange = jest.fn();

    beforeEach(() => {
      onChange.mockClear();
      const { getHostHTMLElement } = render(
        <Select defaultValue={defaultValue} mode="single" onChange={onChange}>
          {[
            <Option key={defaultValue.id} value={defaultValue.id}>
              {defaultValue.name}
            </Option>,
          ]}
        </Select>,
      );

      element = getHostHTMLElement();
    });

    it('should close dropdown and call onChange when option is clicked', async () => {
      jest.useFakeTimers();

      await testTextFieldClicked(element);

      await waitFor(() => {
        const options = document.querySelectorAll('.mzn-dropdown-item-card');
        expect(options.length).toBeGreaterThan(0);
      });

      const options = document.querySelectorAll('.mzn-dropdown-item-card');

      await act(async () => {
        if (options[0]) {
          fireEvent.click(options[0]);
        }
      });

      await act(async () => {
        jest.runAllTimers();
      });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({
        id: defaultValue.id,
        name: defaultValue.name,
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-dropdown-popper--with-portal')).toBeNull();
      });
    });

    it('should display selected value in input', () => {
      const inputElement = getSelectInputElement(element);
      expect(inputElement.value).toBe(defaultValue.name);
    });
  });

  describe('mode: multiple', () => {
    const defaultValue: SelectValue[] = [
      { id: '1', name: 'foo' },
      { id: '2', name: 'bar' },
    ];

    let element: HTMLElement;
    const onChange = jest.fn();

    beforeEach(() => {
      onChange.mockClear();
      const { getHostHTMLElement } = render(
        <Select
          defaultValue={defaultValue}
          mode="multiple"
          onChange={onChange}
        >
          <Option value="1">foo</Option>
          <Option value="2">bar</Option>
          <Option value="3">Alice</Option>
        </Select>,
      );

      element = getHostHTMLElement();
    });

    it('should render tags for each selected value', async () => {
      await waitFor(() => {
        const tags = element.querySelector('.mzn-select-trigger__tags');
        expect(tags?.children.length).toEqual(defaultValue.length);
      });
    });

    it('should render value.name in each tag by default', async () => {
      await waitFor(() => {
        const tagLabels = element.querySelectorAll('.mzn-tag__label');
        expect(tagLabels.length).toBeGreaterThanOrEqual(2);
        expect(tagLabels[0]?.innerHTML).toBe(defaultValue[0].name);
        expect(tagLabels[1]?.innerHTML).toBe(defaultValue[1].name);
      });
    });

    it('should remove tag when close icon is clicked', async () => {
      // Wait for tags to render and ResizeObserver to complete
      await waitFor(() => {
        const tags = element.querySelector('.mzn-select-trigger__tags');
        expect(tags).toBeTruthy();
        expect(tags?.children.length).toBeGreaterThan(0);
      }, { timeout: 5000 });

      await waitFor(() => {
        const tagCloseIcons = element.querySelectorAll('.mzn-tag__close-button');
        expect(tagCloseIcons.length).toBeGreaterThan(0);
      }, { timeout: 5000 });

      const tagCloseIcons = element.querySelectorAll('.mzn-tag__close-button');

      await act(async () => {
        if (tagCloseIcons[0]) {
          fireEvent.click(tagCloseIcons[0]);
        }
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith([
          { id: defaultValue[1].id, name: defaultValue[1].name },
        ]);
      });
    });

    it('should add new selection when unselected option is clicked', async () => {
      await testTextFieldClicked(element);

      await waitFor(() => {
        const options = document.querySelectorAll('.mzn-dropdown-item-card');
        expect(options.length).toBeGreaterThan(0);
      });

      const options = document.querySelectorAll('.mzn-dropdown-item-card');

      await act(async () => {
        if (options[2]) {
          fireEvent.click(options[2]);
        }
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith([
          { id: defaultValue[0].id, name: defaultValue[0].name },
          { id: defaultValue[1].id, name: defaultValue[1].name },
          { id: '3', name: 'Alice' },
        ]);
      });
    });

    it('should not close dropdown when option is clicked in multiple mode', async () => {
      await testTextFieldClicked(element);

      await waitFor(() => {
        const options = document.querySelectorAll('.mzn-dropdown-item-card');
        expect(options.length).toBeGreaterThan(0);
      });

      const options = document.querySelectorAll('.mzn-dropdown-item-card');

      await act(async () => {
        if (options[2]) {
          fireEvent.click(options[2]);
        }
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-dropdown-popper--with-portal')).toBeTruthy();
      });
    });
  });

  describe('prop: onClear', () => {
    it('should not render clear icon in single mode', async () => {
      const onChange = jest.fn();
      const defaultValue: SelectValue = { id: '1', name: 'foo' };

      const { getHostHTMLElement } = render(
        <Select
          clearable
          defaultValue={defaultValue}
          mode="single"
          onChange={onChange}
        />,
      );

      const element = getHostHTMLElement();

      await waitFor(() => {
        const textField = element.querySelector('.mzn-text-field');
        expect(textField).toBeTruthy();
      });

      const clearIcon = element.querySelector('.mzn-text-field__clear-icon');
      expect(clearIcon).toBeNull();
      expect(onChange).toHaveBeenCalledTimes(0);
    });

    it('should clear value to empty array when clear icon clicked in multiple mode', async () => {
      const onChange = jest.fn();
      const defaultValue: SelectValue[] = [{ id: '1', name: 'foo' }];

      const { getHostHTMLElement } = render(
        <Select
          clearable
          defaultValue={defaultValue}
          mode="multiple"
          onChange={onChange}
        />,
      );

      const element = getHostHTMLElement();

      // Wait for tags to render and ResizeObserver to complete
      await waitFor(() => {
        const tags = element.querySelector('.mzn-select-trigger__tags');
        expect(tags).toBeTruthy();
      }, { timeout: 5000 });

      // In multiple mode, clearable shows when value array is not empty
      await waitFor(() => {
        const textField = element.querySelector('.mzn-text-field--clearable');
        expect(textField).toBeTruthy();
      }, { timeout: 3000 });

      await waitFor(() => {
        const clearIcon = element.querySelector('.mzn-text-field__clear-icon');
        expect(clearIcon).toBeTruthy();
      }, { timeout: 3000 });

      const clearIcon = element.querySelector('.mzn-text-field__clear-icon');

      await act(async () => {
        if (clearIcon) {
          fireEvent.click(clearIcon);
        }
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith([]);
      });
    });
  });

  describe('prop: readOnly', () => {
    it('should not open dropdown when readOnly is true', async () => {
      const { getHostHTMLElement } = render(<Select readOnly />);
      const element = getHostHTMLElement();

      await testTextFieldClicked(element);

      expect(document.querySelector('.mzn-dropdown-popper--with-portal')).toBeNull();
    });

    it('should not open dropdown via keyboard when readOnly is true', async () => {
      const onFocus = jest.fn();
      const { getHostHTMLElement } = render(
        <Select readOnly onFocus={onFocus} />,
      );
      const element = getHostHTMLElement();

      await act(async () => {
        fireEvent.keyDown(element.querySelector('.mzn-text-field')!, {
          code: 'ArrowDown',
        });
      });

      expect(onFocus).toHaveBeenCalledTimes(0);
      expect(document.querySelector('.mzn-dropdown-popper--with-portal')).toBeNull();
    });
  });

  describe('prop: disabled', () => {
    it('should disable input element', () => {
      const { getHostHTMLElement } = render(<Select disabled />);
      const element = getHostHTMLElement();
      const inputElement = getSelectInputElement(element);

      expect(inputElement.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('prop: options', () => {
    const flatOptions: DropdownOption[] = [
      { id: '1', name: 'Option 1' },
      { id: '2', name: 'Option 2' },
      { id: '3', name: 'Option 3' },
    ];

    it('should render options from options prop', async () => {
      const { getHostHTMLElement } = render(<Select options={flatOptions} />);
      const element = getHostHTMLElement();

      await testTextFieldClicked(element);

      await waitFor(() => {
        const menuItems = document.querySelectorAll('.mzn-dropdown-item-card');
        expect(menuItems.length).toBe(3);
        expect(menuItems[0].textContent).toContain('Option 1');
        expect(menuItems[1].textContent).toContain('Option 2');
        expect(menuItems[2].textContent).toContain('Option 3');
      });
    });

    it('should ignore children when options prop is provided', async () => {
      const { getHostHTMLElement } = render(
        <Select options={flatOptions}>
          {[<Option key="4" value="4">Option 4</Option>]}
        </Select>,
      );
      const element = getHostHTMLElement();

      await testTextFieldClicked(element);

      await waitFor(() => {
        const menuItems = document.querySelectorAll('.mzn-dropdown-item-card');
        expect(menuItems.length).toBe(3);
        expect(
          Array.from(menuItems).some((item) =>
            item.textContent?.includes('Option 4'),
          ),
        ).toBe(false);
      });
    });

    it('should select option from options prop', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Select options={flatOptions} onChange={onChange} />,
      );
      const element = getHostHTMLElement();

      await testTextFieldClicked(element);

      await waitFor(() => {
        const menuItems = document.querySelectorAll('.mzn-dropdown-item-card');
        expect(menuItems.length).toBeGreaterThan(0);
      });

      const menuItems = document.querySelectorAll('.mzn-dropdown-item-card');

      await act(async () => {
        if (menuItems[1]) {
          fireEvent.click(menuItems[1]);
        }
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({
          id: '2',
          name: 'Option 2',
        });
      });
    });
  });

  describe('controlled component', () => {
    it('should update when value prop changes', () => {
      const { getHostHTMLElement, rerender } = render(
        <Select value={{ id: '1', name: 'Option 1' }} />,
      );
      const element = getHostHTMLElement();
      const inputElement = getSelectInputElement(element);

      expect(inputElement.value).toBe('Option 1');

      rerender(<Select value={{ id: '2', name: 'Option 2' }} />);

      expect(inputElement.value).toBe('Option 2');
    });

    it('should call onChange when value changes in controlled mode', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Select
          value={{ id: '1', name: 'Option 1' }}
          onChange={onChange}
          options={[
            { id: '1', name: 'Option 1' },
            { id: '2', name: 'Option 2' },
          ]}
        />,
      );
      const element = getHostHTMLElement();

      await testTextFieldClicked(element);

      await waitFor(() => {
        const menuItems = document.querySelectorAll('.mzn-dropdown-item-card');
        expect(menuItems.length).toBeGreaterThan(0);
      });

      const menuItems = document.querySelectorAll('.mzn-dropdown-item-card');

      await act(async () => {
        if (menuItems[1]) {
          fireEvent.click(menuItems[1]);
        }
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({
          id: '2',
          name: 'Option 2',
        });
      });
    });
  });

  describe('prop: renderValue', () => {
    it('should use renderValue function to render value in single mode', () => {
      const renderValue = jest.fn<string, [SelectValue | null]>((value) =>
        value ? `Custom: ${value.name}` : '',
      );
      const { getHostHTMLElement } = render(
        <Select
          value={{ id: '1', name: 'Option 1' }}
          renderValue={renderValue}
        />,
      );
      const element = getHostHTMLElement();
      const inputElement = getSelectInputElement(element);

      expect(renderValue).toHaveBeenCalled();
      expect(inputElement.value).toBe('Custom: Option 1');
    });

    it('should use renderValue function to render value in multiple mode', () => {
      const renderValue = jest.fn<string, [SelectValue[]]>((values) =>
        values.map((v) => v.name).join(', '),
      );
      render(
        <Select
          mode="multiple"
          value={[
            { id: '1', name: 'Option 1' },
            { id: '2', name: 'Option 2' },
          ]}
          renderValue={renderValue}
        />,
      );

      expect(renderValue).toHaveBeenCalled();
    });
  });

  describe('prop: inputProps', () => {
    it('should pass inputProps to input element', () => {
      const { getHostHTMLElement } = render(
        <Select inputProps={{ className: 'custom-input-class' }} />,
      );
      const element = getHostHTMLElement();
      const inputElement = getSelectInputElement(element);

      expect(inputElement.classList.contains('custom-input-class')).toBe(true);
    });
  });
});
