/* global document */

import { createRef } from 'react';
import {
  act,
  cleanupHook,
  fireEvent,
  render,
  waitFor,
} from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Cascader from '.';
import { CascaderOption } from './typings';

const originalResizeObserver = (global as typeof globalThis).ResizeObserver;

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  (global as typeof globalThis).ResizeObserver =
    ResizeObserverMock as unknown as typeof ResizeObserver;
});

afterAll(() => {
  (global as typeof globalThis).ResizeObserver = originalResizeObserver;
});

const options: CascaderOption[] = [
  {
    id: 'a',
    name: 'Option A',
    children: [
      { id: 'a1', name: 'Option A1' },
      { id: 'a2', name: 'Option A2', disabled: true },
    ],
  },
  {
    id: 'b',
    name: 'Option B',
    children: [{ id: 'b1', name: 'Option B1' }],
  },
  {
    id: 'c',
    name: 'Option C',
  },
];

async function clickTrigger(element: HTMLElement) {
  await act(async () => {
    fireEvent.click(element.querySelector('.mzn-text-field')!);
  });
}

describe('<Cascader />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Cascader ref={ref} options={options} />),
  );

  describe('prop: className', () => {
    it('should append className to SelectTrigger', () => {
      const { getHostHTMLElement } = render(
        <Cascader className="custom-class" options={options} />,
      );
      const trigger = getHostHTMLElement().querySelector('.mzn-select-trigger');

      expect(trigger?.classList.contains('custom-class')).toBe(true);
    });
  });

  describe('basic rendering', () => {
    it('should bind host class', () => {
      const { getHostHTMLElement } = render(<Cascader options={options} />);

      expect(getHostHTMLElement().classList.contains('mzn-cascader')).toBe(
        true,
      );
    });

    it('should apply fullWidth class when fullWidth is true', () => {
      const { getHostHTMLElement } = render(
        <Cascader fullWidth options={options} />,
      );

      expect(
        getHostHTMLElement().classList.contains('mzn-cascader--full-width'),
      ).toBe(true);
    });

    it('should not apply fullWidth class by default', () => {
      const { getHostHTMLElement } = render(<Cascader options={options} />);

      expect(
        getHostHTMLElement().classList.contains('mzn-cascader--full-width'),
      ).toBe(false);
    });

    it('should render input with placeholder', () => {
      const { getHostHTMLElement } = render(
        <Cascader options={options} placeholder="Select region" />,
      );
      const input = getHostHTMLElement().querySelector('input')!;

      expect(input.placeholder).toBe('Select region');
    });

    it('should display selected value as joined path', async () => {
      const value: CascaderOption[] = [
        { id: 'a', name: 'Option A' },
        { id: 'a1', name: 'Option A1' },
      ];
      const { getHostHTMLElement } = render(
        <Cascader options={options} value={value} />,
      );
      const input = getHostHTMLElement().querySelector('input')!;

      await waitFor(() => {
        expect(input.value).toBe('Option A / Option A1');
      });
    });
  });

  describe('open / close', () => {
    it('should show panels when trigger is clicked', async () => {
      const { getHostHTMLElement } = render(<Cascader options={options} />);
      const element = getHostHTMLElement();

      expect(
        document.querySelector('.mzn-cascader-dropdown-panels'),
      ).toBeNull();

      await clickTrigger(element);

      await waitFor(() => {
        expect(
          document.querySelector('.mzn-cascader-dropdown-panels'),
        ).toBeInstanceOf(HTMLDivElement);
      });
    });

    it('should close panels when trigger is clicked again', async () => {
      const { getHostHTMLElement } = render(<Cascader options={options} />);
      const element = getHostHTMLElement();

      await clickTrigger(element);

      await waitFor(() => {
        expect(
          document.querySelector('.mzn-cascader-dropdown-panels'),
        ).toBeInstanceOf(HTMLDivElement);
      });

      await clickTrigger(element);

      await waitFor(() => {
        expect(
          document.querySelector('.mzn-cascader-dropdown-panels'),
        ).toBeNull();
      });
    });

    it('should close panels when clicking outside', async () => {
      const { getHostHTMLElement } = render(<Cascader options={options} />);
      const element = getHostHTMLElement();

      await clickTrigger(element);

      await waitFor(() => {
        expect(
          document.querySelector('.mzn-cascader-dropdown-panels'),
        ).toBeInstanceOf(HTMLDivElement);
      });

      await act(async () => {
        fireEvent.click(document.body);
      });

      await waitFor(() => {
        expect(
          document.querySelector('.mzn-cascader-dropdown-panels'),
        ).toBeNull();
      });
    });
  });

  describe('prop: onFocus / onBlur', () => {
    it('should invoke onFocus when opening', async () => {
      const onFocus = jest.fn();
      const { getHostHTMLElement } = render(
        <Cascader options={options} onFocus={onFocus} />,
      );

      await clickTrigger(getHostHTMLElement());

      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('should invoke onBlur when closing via trigger click', async () => {
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(
        <Cascader options={options} onBlur={onBlur} />,
      );
      const element = getHostHTMLElement();

      await clickTrigger(element);
      await clickTrigger(element);

      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should invoke onBlur when closing via click outside', async () => {
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(
        <Cascader options={options} onBlur={onBlur} />,
      );

      await clickTrigger(getHostHTMLElement());

      await act(async () => {
        fireEvent.click(document.body);
      });

      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('option selection', () => {
    it('should show child panel when non-leaf option is clicked', async () => {
      const { getHostHTMLElement } = render(<Cascader options={options} />);
      const element = getHostHTMLElement();

      await clickTrigger(element);

      await waitFor(() => {
        expect(document.querySelectorAll('.mzn-cascader-panel').length).toBe(1);
      });

      await act(async () => {
        const items = document.querySelectorAll('.mzn-cascader-item');

        fireEvent.click(items[0]); // Option A (has children)
      });

      await waitFor(() => {
        expect(document.querySelectorAll('.mzn-cascader-panel').length).toBe(2);
      });
    });

    it('should close and call onChange when leaf option is selected', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Cascader options={options} onChange={onChange} />,
      );
      const element = getHostHTMLElement();

      await clickTrigger(element);

      await act(async () => {
        const items = document.querySelectorAll('.mzn-cascader-item');

        fireEvent.click(items[0]); // Option A
      });

      await act(async () => {
        const panels = document.querySelectorAll('.mzn-cascader-panel');
        const leafItems = panels[1].querySelectorAll('li');

        fireEvent.click(leafItems[0]); // Option A1
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith([
          expect.objectContaining({ id: 'a' }),
          expect.objectContaining({ id: 'a1' }),
        ]);
        expect(
          document.querySelector('.mzn-cascader-dropdown-panels'),
        ).toBeNull();
      });
    });

    it('should select top-level leaf option directly', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Cascader options={options} onChange={onChange} />,
      );

      await clickTrigger(getHostHTMLElement());

      await act(async () => {
        const items = document.querySelectorAll('.mzn-cascader-item');

        fireEvent.click(items[2]); // Option C (top-level leaf)
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith([
          expect.objectContaining({ id: 'c' }),
        ]);
      });
    });

    it('should not call onChange when clicking a disabled option', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Cascader options={options} onChange={onChange} />,
      );

      await clickTrigger(getHostHTMLElement());

      await act(async () => {
        const items = document.querySelectorAll('.mzn-cascader-item');

        fireEvent.click(items[0]); // Option A
      });

      await act(async () => {
        const panels = document.querySelectorAll('.mzn-cascader-panel');
        const leafItems = panels[1].querySelectorAll('li');

        fireEvent.click(leafItems[1]); // Option A2 (disabled)
      });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('prop: disabled', () => {
    it('should not open dropdown when disabled', async () => {
      const onFocus = jest.fn();
      const { getHostHTMLElement } = render(
        <Cascader disabled options={options} onFocus={onFocus} />,
      );

      await clickTrigger(getHostHTMLElement());

      expect(onFocus).not.toHaveBeenCalled();
      expect(
        document.querySelector('.mzn-cascader-dropdown-panels'),
      ).toBeNull();
    });
  });

  describe('prop: readOnly', () => {
    it('should not open dropdown when readOnly', async () => {
      const onFocus = jest.fn();
      const { getHostHTMLElement } = render(
        <Cascader readOnly options={options} onFocus={onFocus} />,
      );

      await clickTrigger(getHostHTMLElement());

      expect(onFocus).not.toHaveBeenCalled();
      expect(
        document.querySelector('.mzn-cascader-dropdown-panels'),
      ).toBeNull();
    });
  });

  describe('prop: error', () => {
    it('should apply error style to TextField', () => {
      const { getHostHTMLElement } = render(
        <Cascader error options={options} />,
      );
      const textField = getHostHTMLElement().querySelector('.mzn-text-field');

      expect(textField?.classList.contains('mzn-text-field--error')).toBe(true);
    });
  });

  describe('controlled / uncontrolled', () => {
    it('should display controlled value', async () => {
      const value: CascaderOption[] = [
        { id: 'a', name: 'Option A' },
        { id: 'a1', name: 'Option A1' },
      ];
      const { getHostHTMLElement } = render(
        <Cascader options={options} value={value} />,
      );
      const input = getHostHTMLElement().querySelector('input')!;

      await waitFor(() => {
        expect(input.value).toBe('Option A / Option A1');
      });
    });

    it('should display defaultValue in uncontrolled mode', async () => {
      const defaultValue: CascaderOption[] = [
        { id: 'a', name: 'Option A' },
        { id: 'a1', name: 'Option A1' },
      ];
      const { getHostHTMLElement } = render(
        <Cascader options={options} defaultValue={defaultValue} />,
      );
      const input = getHostHTMLElement().querySelector('input')!;

      await waitFor(() => {
        expect(input.value).toBe('Option A / Option A1');
      });
    });
  });

  describe('keyboard interaction', () => {
    it('should close dropdown and call onBlur on Escape key', async () => {
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(
        <Cascader options={options} onBlur={onBlur} />,
      );

      await clickTrigger(getHostHTMLElement());

      await waitFor(() => {
        expect(
          document.querySelector('.mzn-cascader-dropdown-panels'),
        ).toBeInstanceOf(HTMLDivElement);
      });

      await act(async () => {
        fireEvent.keyDown(document, { key: 'Escape' });
      });

      await waitFor(() => {
        expect(
          document.querySelector('.mzn-cascader-dropdown-panels'),
        ).toBeNull();
        expect(onBlur).toHaveBeenCalledTimes(1);
      });
    });

    it('should move keyboard focus to first option on ArrowDown', async () => {
      const { getHostHTMLElement } = render(<Cascader options={options} />);

      await clickTrigger(getHostHTMLElement());

      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowDown' });
      });

      await waitFor(() => {
        const items = document.querySelectorAll('.mzn-cascader-item');

        expect(items[0].classList.contains('mzn-cascader-item--focused')).toBe(
          true,
        );
      });
    });

    it('should move keyboard focus to last option on ArrowUp from start', async () => {
      const { getHostHTMLElement } = render(<Cascader options={options} />);

      await clickTrigger(getHostHTMLElement());

      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowUp' });
      });

      await waitFor(() => {
        const items = document.querySelectorAll('.mzn-cascader-item');

        expect(
          items[items.length - 1].classList.contains(
            'mzn-cascader-item--focused',
          ),
        ).toBe(true);
      });
    });

    it('should expand child panel on ArrowRight for non-leaf option', async () => {
      const { getHostHTMLElement } = render(<Cascader options={options} />);

      await clickTrigger(getHostHTMLElement());

      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowDown' }); // focus Option A
      });

      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowRight' }); // expand
      });

      await waitFor(() => {
        expect(document.querySelectorAll('.mzn-cascader-panel').length).toBe(2);
      });
    });

    it('should expand child panel on Enter for non-leaf option', async () => {
      const { getHostHTMLElement } = render(<Cascader options={options} />);

      await clickTrigger(getHostHTMLElement());

      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowDown' }); // focus Option A
      });

      await act(async () => {
        fireEvent.keyDown(document, { key: 'Enter' }); // expand
      });

      await waitFor(() => {
        expect(document.querySelectorAll('.mzn-cascader-panel').length).toBe(2);
      });
    });

    it('should select leaf option and close on Enter', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Cascader options={options} onChange={onChange} />,
      );

      await clickTrigger(getHostHTMLElement());

      // Option C is at index 2 (leaf)
      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowDown' });
      });
      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowDown' });
      });
      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowDown' });
      });

      await act(async () => {
        fireEvent.keyDown(document, { key: 'Enter' });
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith([
          expect.objectContaining({ id: 'c' }),
        ]);
        expect(
          document.querySelector('.mzn-cascader-dropdown-panels'),
        ).toBeNull();
      });
    });

    it('should go back one panel on ArrowLeft and restore parent focus', async () => {
      const { getHostHTMLElement } = render(<Cascader options={options} />);

      await clickTrigger(getHostHTMLElement());

      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowDown' }); // focus Option A (index 0)
      });

      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowRight' }); // expand A
      });

      await waitFor(() => {
        expect(document.querySelectorAll('.mzn-cascader-panel').length).toBe(2);
      });

      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowLeft' }); // go back
      });

      await waitFor(() => {
        expect(document.querySelectorAll('.mzn-cascader-panel').length).toBe(1);
        // focus should be restored to Option A (index 0)
        const items = document.querySelectorAll('.mzn-cascader-item');

        expect(items[0].classList.contains('mzn-cascader-item--focused')).toBe(
          true,
        );
      });
    });

    it('should not navigate to disabled options with ArrowDown', async () => {
      const { getHostHTMLElement } = render(<Cascader options={options} />);

      await clickTrigger(getHostHTMLElement());

      // expand Option A → children: [A1, A2(disabled)]
      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowDown' });
      });

      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowRight' });
      });

      await waitFor(() => {
        expect(document.querySelectorAll('.mzn-cascader-panel').length).toBe(2);
      });

      // focus A1 (first non-disabled in children)
      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowDown' });
      });

      // ArrowDown again — A2 is disabled, should stay on A1
      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowDown' });
      });

      await waitFor(() => {
        const panels = document.querySelectorAll('.mzn-cascader-panel');
        const childItems = panels[1].querySelectorAll('li');

        expect(
          childItems[0].classList.contains('mzn-cascader-item--focused'),
        ).toBe(true);
        expect(
          childItems[1].classList.contains('mzn-cascader-item--focused'),
        ).toBe(false);
      });
    });

    it('should not handle keyboard events when dropdown is closed', async () => {
      const { getHostHTMLElement } = render(<Cascader options={options} />);

      getHostHTMLElement(); // ensure render

      await act(async () => {
        fireEvent.keyDown(document, { key: 'ArrowDown' });
      });

      expect(
        document.querySelector('.mzn-cascader-dropdown-panels'),
      ).toBeNull();
    });
  });

  describe('prop: clearable', () => {
    it('should render clear button when clearable and value is set', () => {
      const value: CascaderOption[] = [
        { id: 'a', name: 'Option A' },
        { id: 'a1', name: 'Option A1' },
      ];
      const { getHostHTMLElement } = render(
        <Cascader clearable options={options} value={value} />,
      );
      const clearButton = getHostHTMLElement().querySelector(
        'button[aria-label="Close"]',
      );

      expect(clearButton).toBeInstanceOf(HTMLButtonElement);
    });

    it('should not render clear button when clearable but no value', () => {
      const { getHostHTMLElement } = render(
        <Cascader clearable options={options} />,
      );
      const clearButton = getHostHTMLElement().querySelector(
        'button[aria-label="Close"]',
      );

      expect(clearButton).toBeNull();
    });

    it('should call onChange with empty array when clear button is clicked', async () => {
      const onChange = jest.fn();
      const value: CascaderOption[] = [
        { id: 'a', name: 'Option A' },
        { id: 'a1', name: 'Option A1' },
      ];
      const { getHostHTMLElement } = render(
        <Cascader
          clearable
          options={options}
          value={value}
          onChange={onChange}
        />,
      );

      await act(async () => {
        const clearButton = getHostHTMLElement().querySelector(
          'button[aria-label="Close"]',
        )!;

        fireEvent.click(clearButton);
      });

      expect(onChange).toHaveBeenCalledWith([]);
    });

    it('should not render clear button when clearable and disabled', () => {
      const value: CascaderOption[] = [
        { id: 'a', name: 'Option A' },
        { id: 'a1', name: 'Option A1' },
      ];
      const { getHostHTMLElement } = render(
        <Cascader clearable disabled options={options} value={value} />,
      );
      const clearButton = getHostHTMLElement().querySelector(
        'button[aria-label="Close"]',
      );

      expect(clearButton).toBeNull();
    });

    it('should not render clear button when clearable and readOnly', () => {
      const value: CascaderOption[] = [
        { id: 'a', name: 'Option A' },
        { id: 'a1', name: 'Option A1' },
      ];
      const { getHostHTMLElement } = render(
        <Cascader clearable readOnly options={options} value={value} />,
      );
      const clearButton = getHostHTMLElement().querySelector(
        'button[aria-label="Close"]',
      );

      expect(clearButton).toBeNull();
    });
  });
});
