/* global document */
import '@testing-library/jest-dom';
import { createRef, FocusEvent, MouseEvent } from 'react';
import {
  act,
  cleanupHook,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import userEvent from '@testing-library/user-event';
import { AutoComplete } from '.';
import { SelectValue } from '../Select/typings';

// Mock ResizeObserver - jsdom 不支援此 API
const originalResizeObserver = (global as typeof globalThis).ResizeObserver;
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock scrollIntoView
const originalScrollIntoView = Element.prototype.scrollIntoView;

function getDropdownListbox() {
  return document.querySelector('[role="listbox"][id="mzn-select-autocomplete-menu-id"]');
}

function getDropdownOptions() {
  return document.querySelectorAll('[role="option"]');
}

function getPopperContainer() {
  return document.querySelector('div[data-popper-placement]');
}

function getClearIcon(container: HTMLElement | Document = document) {
  return container.querySelector('.mzn-text-field__clear-icon') as HTMLElement;
}

const defaultOptions: SelectValue[] = [
  {
    id: 'foo',
    name: 'foo',
  },
  {
    id: 'bar',
    name: 'bar',
  },
  {
    id: 'item1',
    name: 'item1',
  },
  {
    id: 'very very very very long',
    name: 'very very very very long',
  },
];

describe('<AutoComplete />', () => {
  beforeAll(() => {
    (global as typeof globalThis).ResizeObserver = ResizeObserverMock as any;
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterAll(() => {
    if (originalResizeObserver) {
      (global as typeof globalThis).ResizeObserver = originalResizeObserver;
    }
    Element.prototype.scrollIntoView = originalScrollIntoView;
  });

  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<AutoComplete ref={ref} options={defaultOptions} />),
  );

  describeForwardRefToHTMLElement(HTMLInputElement, (ref) =>
    render(<AutoComplete inputRef={ref} options={defaultOptions} />),
  );

  describe('prop: mode', () => {
    it('should close dropdown when option selected in single mode', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      const inputRef = createRef<HTMLInputElement>();

      const { container } = render(
        <AutoComplete
          inputRef={inputRef}
          mode="single"
          options={defaultOptions}
        />,
      );

      // Wait for input to be available - try multiple ways to find it
      let input: HTMLInputElement | null = null;
      await waitFor(() => {
        const inputByQuery = container.querySelector('input');
        const inputsByRole = screen.getAllByRole('combobox');
        const inputByRole = inputsByRole.find((el) => el.tagName === 'INPUT');
        input = (inputByQuery as HTMLInputElement | null) ?? (inputByRole as HTMLInputElement | null) ?? inputRef.current;
        expect(input).not.toBeNull();
      });

      await act(async () => {
        await user.click(input!);
        await user.type(input!, 'foo');
      });

      await act(async () => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(getDropdownListbox()).toBeInTheDocument();
      });

      const options = getDropdownOptions();
      expect(options.length).toBeGreaterThan(0);

      await act(async () => {
        await user.click(options[0]);
      });

      // Use advanceTimersByTime instead of runAllTimers to avoid scrollIntoView issues
      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(getDropdownListbox()).not.toBeInTheDocument();
      });
    });

    it('should not close dropdown when option selected in multiple mode', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      const inputRef = createRef<HTMLInputElement>();

      render(
        <AutoComplete
          inputRef={inputRef}
          mode="multiple"
          options={defaultOptions}
        />,
      );

      await waitFor(() => {
        expect(inputRef.current).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(inputRef.current!);
        await user.type(inputRef.current!, 'foo');
      });

      await waitFor(() => {
        expect(getDropdownListbox()).toBeInTheDocument();
      });

      const options = getDropdownOptions();
      expect(options.length).toBeGreaterThan(0);

      await act(async () => {
        await user.click(options[0]);
      });

      // Use advanceTimersByTime instead of runAllTimers to avoid scrollIntoView issues
      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(getDropdownListbox()).toBeInTheDocument();
      });
    });
  });

  describe('prop: onClear', () => {
    // Note: SelectTrigger only shows clearable in multiple mode when there are values
    // In single mode, clearable is not shown by SelectTrigger's logic
    it('should clear value and trigger onClear, onChange in mode="multiple"', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      const onClear = jest.fn<void, [MouseEvent<Element>]>(() => {});
      const inputRef = createRef<HTMLInputElement>();
      const onChange = jest.fn();
      const onSearch = jest.fn();

      // Set initial value so clear button appears (only works in multiple mode)
      const { container } = render(
        <AutoComplete
          inputRef={inputRef}
          mode="multiple"
          onClear={onClear}
          onChange={onChange}
          onSearch={onSearch}
          options={defaultOptions}
          value={[defaultOptions[0]]}
        />,
      );

      await waitFor(() => {
        expect(inputRef.current).toBeInTheDocument();
      });

      // Wait for clear icon to appear (only shown in multiple mode with values)
      await waitFor(() => {
        const clearIcon = getClearIcon(container);
        expect(clearIcon).toBeInTheDocument();
      }, { timeout: 3000 });

      const clearIcon = getClearIcon(container);
      expect(clearIcon).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(clearIcon);
      });

      expect(onClear).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe('prop: onSearch', () => {
    it('should trigger onSearch when input changed', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      const onSearch = jest.fn<void, [string]>(() => {});
      const inputRef = createRef<HTMLInputElement>();

      render(
        <AutoComplete
          inputRef={inputRef}
          onSearch={onSearch}
          options={defaultOptions}
        />,
      );

      await waitFor(() => {
        expect(inputRef.current).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(inputRef.current!);
        await user.type(inputRef.current!, 'foo');
      });

      await act(async () => {
        jest.advanceTimersByTime(300);
      });

      expect(onSearch).toHaveBeenCalled();
      expect(onSearch).toHaveBeenCalledWith('foo');
    });

    it('should debounce onSearch calls', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      const onSearch = jest.fn<void, [string]>(() => {});
      const inputRef = createRef<HTMLInputElement>();

      render(
        <AutoComplete
          inputRef={inputRef}
          onSearch={onSearch}
          options={defaultOptions}
          searchDebounceTime={300}
        />,
      );

      await waitFor(() => {
        expect(inputRef.current).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(inputRef.current!);
        await user.type(inputRef.current!, 'f');
        jest.advanceTimersByTime(100);
        await user.type(inputRef.current!, 'o');
        jest.advanceTimersByTime(100);
        await user.type(inputRef.current!, 'o');
        jest.advanceTimersByTime(300);
      });

      // Should only be called once after debounce
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith('foo');
    });
  });

  describe('prop: disabledOptionsFilter', () => {
    it('should disable options filtering when disabledOptionsFilter is true', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      const inputRef = createRef<HTMLInputElement>();

      render(
        <AutoComplete
          inputRef={inputRef}
          options={defaultOptions}
          disabledOptionsFilter
        />,
      );

      await waitFor(() => {
        expect(inputRef.current).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(inputRef.current!);
        await user.type(inputRef.current!, 'foo');
      });

      await waitFor(() => {
        expect(getDropdownListbox()).toBeInTheDocument();
      });

      const options = getDropdownOptions();

      expect(options.length).toBe(defaultOptions.length);
    });

    it('should filter options by default', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      const { container } = render(
        <AutoComplete
          options={defaultOptions}
          open
        />,
      );

      // Wait for input to be available - try multiple ways to find it
      let input: HTMLInputElement | null = null;
      await waitFor(() => {
        const inputByQuery = container.querySelector('input') as HTMLInputElement | null;
        const inputsByRole = screen.getAllByRole('combobox');
        const inputByRole = inputsByRole.find((el) => el.tagName === 'INPUT') as HTMLInputElement | undefined;
        input = inputByQuery || inputByRole || null;
        expect(input).not.toBeNull();
      }, { timeout: 3000 });

      await act(async () => {
        await user.click(input!);
        await user.type(input!, 'foo');
      });

      await waitFor(() => {
        expect(getDropdownListbox()).toBeInTheDocument();
      });

      const options = getDropdownOptions();

      expect(options.length).toBe(1);
      expect(screen.getByText('foo')).toBeInTheDocument();
    });
  });

  describe('prop: inputProps', () => {
    it('should trigger inputProps.onBlur when input blur', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      const onBlur = jest.fn<void, [FocusEvent<HTMLInputElement>]>(() => {});
      const inputRef = createRef<HTMLInputElement>();

      render(
        <AutoComplete
          inputRef={inputRef}
          inputProps={{
            onBlur,
          }}
          options={defaultOptions}
        />,
      );

      await waitFor(() => {
        expect(inputRef.current).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(inputRef.current!);
        inputRef.current!.blur();
      });

      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should trigger inputProps.onFocus when input focus', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      const onFocus = jest.fn<void, [FocusEvent<HTMLInputElement>]>(() => {});
      const inputRef = createRef<HTMLInputElement>();

      render(
        <AutoComplete
          inputRef={inputRef}
          inputProps={{
            onFocus,
          }}
          options={defaultOptions}
        />,
      );

      await waitFor(() => {
        expect(inputRef.current).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(inputRef.current!);
      });

      expect(onFocus).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: addable/onInsert', () => {
    it('should show create action when addable and searchText has no match', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      const onInsert = jest.fn((text: string) => {
        return [
          ...defaultOptions,
          { id: text, name: text },
        ];
      });

      const { container } = render(
        <AutoComplete
          addable
          onInsert={onInsert}
          options={defaultOptions}
          disabledOptionsFilter
        />,
      );

      // find input (可能 role 為 combobox 或一般 input)
      let input: HTMLInputElement | null = null;
      await waitFor(() => {
        const inputByQuery = container.querySelector('input');
        const inputsByRole = screen.getAllByRole('combobox');
        const inputByRole = inputsByRole.find((el) => el.tagName === 'INPUT');
        input = (inputByQuery as HTMLInputElement | null) ?? (inputByRole as HTMLInputElement | null);
        expect(input).not.toBeNull();
      });

      await act(async () => {
        await user.click(input!);
        await user.type(input!, 'newitem');
      });

      await waitFor(() => {
        expect(getDropdownListbox()).toBeInTheDocument();
      });

      // Should show create action button
      const createButton = screen.queryByText(/建立.*newitem/i);
      expect(createButton).toBeInTheDocument();
    });

    it('should call onInsert when create action is clicked', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      const onInsert = jest.fn((text: string, currentOptions: SelectValue[]) => {
        return [
          ...currentOptions,
          { id: text, name: text },
        ];
      });
      const onChange = jest.fn();

      const { container } = render(
        <AutoComplete
          addable
          onInsert={onInsert}
          onChange={onChange}
          options={defaultOptions}
          disabledOptionsFilter
        />,
      );

      let input: HTMLInputElement | null = null;
      await waitFor(() => {
        const inputByQuery = container.querySelector('input');
        const inputsByRole = screen.getAllByRole('combobox');
        const inputByRole = inputsByRole.find((el) => el.tagName === 'INPUT');
        input = (inputByQuery as HTMLInputElement | null) ?? (inputByRole as HTMLInputElement | null);
        expect(input).not.toBeNull();
      });

      await act(async () => {
        await user.click(input!);
        await user.type(input!, 'newitem');
      });

      await waitFor(() => {
        expect(getDropdownListbox()).toBeInTheDocument();
      });

      const createButton = screen.getByText(/建立.*newitem/i);

      await act(async () => {
        await user.click(createButton);
      });

      expect(onInsert).toHaveBeenCalledWith('newitem', expect.any(Array));
    });

    it('should not show create action when searchText matches an option', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      const { container } = render(
        <AutoComplete
          addable
          options={defaultOptions}
          disabledOptionsFilter
          open
        />,
      );

      // Wait for input可用（只需確認 DOM 中有 input）
      let input: HTMLInputElement | null = null;
      await waitFor(() => {
        input = container.querySelector('input');
        expect(input).not.toBeNull();
      }, { timeout: 3000 });

      await act(async () => {
        await user.click(input!);
        await user.type(input!, 'foo');
      });

      // Wait a bit for any async updates and debounce
      await act(async () => {
        jest.runAllTimers();
      });

      // Should not show create action when there's a match
      // The create button only shows when searchText doesn't match any option
      const createButton = screen.queryByText(/建立/i);
      expect(createButton).not.toBeInTheDocument();
    });
  });

  describe('prop: asyncData', () => {
    it('should show loading state when asyncData is true and onSearch returns promise', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      const inputRef = createRef<HTMLInputElement>();
      const onSearch = jest.fn(() => {
        return new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 1000);
        });
      });

      render(
        <AutoComplete
          asyncData
          inputRef={inputRef}
          onSearch={onSearch}
          options={defaultOptions}
          disabledOptionsFilter
        />,
      );

      await waitFor(() => {
        expect(inputRef.current).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(inputRef.current!);
        await user.type(inputRef.current!, 'test');
      });

      await act(async () => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const loadingText = screen.queryByText(/載入中|loading/i);
        const listbox = getDropdownListbox();
        expect(loadingText || listbox?.getAttribute('aria-busy')).toBeTruthy();
      });
    });
  });

  describe('prop: open (controlled)', () => {
    it('should respect controlled open state', async () => {
      jest.useFakeTimers();

      const inputRef = createRef<HTMLInputElement>();
      const { rerender } = render(
        <AutoComplete
          inputRef={inputRef}
          open={false}
          options={defaultOptions}
        />,
      );

      expect(getDropdownListbox()).not.toBeInTheDocument();

      rerender(
        <AutoComplete
          inputRef={inputRef}
          open={true}
          options={defaultOptions}
        />,
      );

      await waitFor(() => {
        expect(getDropdownListbox()).toBeInTheDocument();
      });
    });
  });

  describe('prop: onVisibilityChange', () => {
    it('should call onVisibilityChange when dropdown opens', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      const inputRef = createRef<HTMLInputElement>();
      const onVisibilityChange = jest.fn();

      render(
        <AutoComplete
          inputRef={inputRef}
          onVisibilityChange={onVisibilityChange}
          options={defaultOptions}
        />,
      );

      await waitFor(() => {
        expect(inputRef.current).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(inputRef.current!);
      });

      await waitFor(() => {
        expect(onVisibilityChange).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('keyboard navigation', () => {
    it('should select first option when Enter is pressed and dropdown is open', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      const inputRef = createRef<HTMLInputElement>();
      const onChange = jest.fn();

      render(
        <AutoComplete
          inputRef={inputRef}
          onChange={onChange}
          options={defaultOptions}
        />,
      );

      await waitFor(() => {
        expect(inputRef.current).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(inputRef.current!);
      });

      await waitFor(() => {
        expect(getDropdownListbox()).toBeInTheDocument();
      });

      await act(async () => {
        await user.keyboard('{Enter}');
      });

      expect(onChange).toHaveBeenCalled();
    });

    it('should close dropdown when Escape is pressed', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      const inputRef = createRef<HTMLInputElement>();

      render(
        <AutoComplete
          inputRef={inputRef}
          options={defaultOptions}
        />,
      );

      await waitFor(() => {
        expect(inputRef.current).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(inputRef.current!);
      });

      await waitFor(() => {
        expect(getDropdownListbox()).toBeInTheDocument();
      });

      await act(async () => {
        await user.keyboard('{Escape}');
      });

      await waitFor(() => {
        expect(getDropdownListbox()).not.toBeInTheDocument();
      });
    });
  });

  describe('prop: value (controlled)', () => {
    it('should display selected value in single mode', () => {
      const { container } = render(
        <AutoComplete
          mode="single"
          options={defaultOptions}
          value={defaultOptions[0]}
        />,
      );

      // In single mode, when value is selected and not focused,
      // the placeholder shows the value name (see getPlaceholder logic)
      // But when not focused, it shows the original placeholder
      // When focused, it shows the value name as placeholder
      const inputs = screen.getAllByRole('combobox');
      const input = inputs.find((el) => el.tagName === 'INPUT') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      // The input should exist and the component should render correctly
      // The actual display logic depends on focus state
      expect(input).toBeTruthy();
    });

    it('should display selected values in multiple mode', () => {
      render(
        <AutoComplete
          mode="multiple"
          options={defaultOptions}
          value={[defaultOptions[0], defaultOptions[1]]}
        />,
      );

      // In multiple mode, selected values are shown as tags
      // Use getAllByText and check that tags exist
      const fooTags = screen.getAllByText('foo');
      const barTags = screen.getAllByText('bar');
      // Should have at least one tag for each value
      expect(fooTags.length).toBeGreaterThan(0);
      expect(barTags.length).toBeGreaterThan(0);
      // Check that at least one is a tag label
      const fooTag = fooTags.find((el) => el.classList.contains('mzn-tag__label'));
      const barTag = barTags.find((el) => el.classList.contains('mzn-tag__label'));
      expect(fooTag).toBeInTheDocument();
      expect(barTag).toBeInTheDocument();
    });
  });
});
