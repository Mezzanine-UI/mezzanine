import { createRef, FocusEvent, MouseEvent } from 'react';
import { PlusIcon } from '@mezzanine-ui/icons';
import {
  act,
  cleanupHook,
  cleanup,
  render,
  fireEvent,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import { AutoComplete } from '.';

function getInputElement(element: HTMLElement) {
  return element.getElementsByTagName('input')[0];
}

function getAddingContainer(container: HTMLElement | null = document.body) {
  return container!.querySelector('.mzn-select-autocomplete') as HTMLElement;
}

function getPopper() {
  return document.querySelector('.mzn-select-popper');
}

function getOptions() {
  return document.querySelectorAll('.mzn-menu-item');
}

const defaultOptions = ['foo', 'bar', 'item1'];

describe('<AutoComplete />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<AutoComplete ref={ref} options={defaultOptions} />),
  );

  describeForwardRefToHTMLElement(
    HTMLInputElement,
    (ref) => render(<AutoComplete inputRef={ref} options={defaultOptions} />),
  );

  it('should close menu when onChange triggered', async () => {
    jest.useFakeTimers();

    const inputRef = createRef<HTMLInputElement>();

    render(
      <AutoComplete inputRef={inputRef} options={defaultOptions} />,
    );

    await act(async () => {
      fireEvent.focus(inputRef.current!);
      fireEvent.change(inputRef.current!, { target: { value: 'foobar' } });
    });

    expect(getPopper()).toBeInstanceOf(HTMLDivElement);

    const options = getOptions();

    await act(async () => {
      fireEvent.click(options[0]);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    expect(getPopper()).toBe(null);
  });

  it('should close menu when clickaway', async () => {
    jest.useFakeTimers();

    const inputRef = createRef<HTMLInputElement>();

    render(
      <AutoComplete inputRef={inputRef} options={defaultOptions} />,
    );

    await act(async () => {
      fireEvent.focus(inputRef.current!);
    });

    await act(async () => {
      fireEvent.blur(inputRef.current!);
    });

    await act(async () => {
      fireEvent.click(document);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    expect(getPopper()).toBe(null);
  });

  it('should render Empty when no options', async () => {
    jest.useFakeTimers();

    const inputRef = createRef<HTMLInputElement>();

    render(
      <AutoComplete inputRef={inputRef} options={[]} />,
    );

    await act(async () => {
      fireEvent.focus(inputRef.current!);
    });

    const empty = document.querySelector('.mzn-empty');

    expect(empty).toBeInstanceOf(HTMLDivElement);
  });

  it('should clear input text when clear action clicked', async () => {
    jest.useFakeTimers();

    const inputRef = createRef<HTMLInputElement>();

    render(
      <AutoComplete
        inputRef={inputRef}
        options={defaultOptions}
      />,
    );

    await act(async () => {
      fireEvent.change(inputRef.current!, { target: { value: 'foobar' } });
    });

    const clearIcon = document.querySelector('.mzn-text-field__clear-icon');

    await act(async () => {
      fireEvent.click(clearIcon!);
    });

    expect(inputRef.current!.value).toBe('');
  });

  it('props: onClear', async () => {
    jest.useFakeTimers();

    const onClear = jest.fn<void, [MouseEvent<Element>]>(() => {});
    const inputRef = createRef<HTMLInputElement>();

    render(
      <AutoComplete
        inputRef={inputRef}
        onClear={onClear}
        options={defaultOptions}
      />,
    );

    await act(async () => {
      fireEvent.change(inputRef.current!, { target: { value: 'foobar' } });
    });

    const clearIcon = document.querySelector('.mzn-text-field__clear-icon');

    await act(async () => {
      fireEvent.click(clearIcon!);
    });

    expect(inputRef.current!.value).toBe('');
    expect(onClear).toBeCalledTimes(1);
  });

  it('should keep user typings when blur', async () => {
    jest.useFakeTimers();

    const onChange = jest.fn<void, [string]>(() => {});
    const inputRef = createRef<HTMLInputElement>();

    render(
      <AutoComplete
        inputRef={inputRef}
        onChange={onChange}
        options={defaultOptions}
      />,
    );

    await act(async () => {
      fireEvent.focus(inputRef.current!);
      fireEvent.change(inputRef.current!, { target: { value: 'foobar' } });
    });

    await act(async () => {
      fireEvent.blur(inputRef.current!);
    });

    expect(inputRef.current!.value).toBe('foobar');
    expect(onChange).toBeCalledTimes(1);
  });

  it('should display options that matched user typings by default', async () => {
    jest.useFakeTimers();

    const inputRef = createRef<HTMLInputElement>();

    render(
      <AutoComplete
        inputRef={inputRef}
        options={defaultOptions}
      />,
    );

    await act(async () => {
      fireEvent.focus(inputRef.current!);
      fireEvent.change(inputRef.current!, { target: { value: 'fo' } });
    });

    expect(getOptions().length).toBe(2);

    await act(async () => {
      fireEvent.change(inputRef.current!, { target: { value: 'foo123' } });
    });

    expect(getOptions().length).toBe(1);
  });

  it('prop: onSearch, should triggered when input changed', async () => {
    jest.useFakeTimers();

    const onSearch = jest.fn<void, [string]>(() => {});
    const inputRef = createRef<HTMLInputElement>();

    render(
      <AutoComplete
        inputRef={inputRef}
        onSearch={onSearch}
        options={defaultOptions}
      />,
    );

    await act(async () => {
      fireEvent.focus(inputRef.current!);
      fireEvent.change(inputRef.current!, { target: { value: 'foo' } });
    });

    expect(onSearch).toBeCalledTimes(1);
  });

  it('prop: inputProps.onBlur, should triggered when input blur', async () => {
    jest.useFakeTimers();

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

    await act(async () => {
      fireEvent.blur(inputRef.current!);
    });

    expect(onBlur).toBeCalledTimes(1);
  });

  it('prop: inputProps.onFocus, should triggered when input focus', async () => {
    jest.useFakeTimers();

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

    await act(async () => {
      fireEvent.focus(inputRef.current!);
    });

    expect(onFocus).toBeCalledTimes(1);
  });

  it('prop: disabledOptionsFilter, should disabled options filtering', async () => {
    jest.useFakeTimers();

    const inputRef = createRef<HTMLInputElement>();

    render(
      <AutoComplete inputRef={inputRef} options={defaultOptions} />,
    );

    await act(async () => {
      fireEvent.focus(inputRef.current!);
    });

    const options = getOptions();

    expect(options.length).toBe(defaultOptions.length + 1);
  });

  describe('prop: addable', () => {
    let newOption: string;
    const onInsert = jest.fn<boolean, [string]>((insert) => {
      newOption = insert;

      return true;
    });

    beforeEach(async () => {
      newOption = '';

      jest.useFakeTimers();

      const inputRef = createRef<HTMLInputElement>();

      render(
        <AutoComplete
          addable
          inputRef={inputRef}
          onInsert={onInsert}
          options={defaultOptions}
        />,
      );

      await act(async () => {
        fireEvent.focus(inputRef.current!);
      });
    });

    it('should input text equals to user typing', async () => {
      const addableContainer = getAddingContainer();
      const input = getInputElement(addableContainer);

      await act(async () => {
        fireEvent.change(input, { target: { value: 'new option' } });
      });

      expect(getInputElement(getAddingContainer()).getAttribute('value')).toBe('new option');
    });

    it('should avoid click/focus events bubbling (avoid invoke click away)', async () => {
      const addableContainer = getAddingContainer();
      const input = getInputElement(addableContainer);

      await act(async () => {
        fireEvent.click(input);
        fireEvent.focus(input);
      });

      expect(getPopper()).toBeInstanceOf(HTMLDivElement);
    });

    it('should use PlusIcon as action button', () => {
      const addableContainer = getAddingContainer();
      const icon = addableContainer.querySelector('.mzn-select-autocomplete__icon');

      expect(icon?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
    });

    it('should not invoke insert action when no input', async () => {
      const addableContainer = getAddingContainer();
      const input = getInputElement(addableContainer);

      await act(async () => {
        fireEvent.change(input, { target: { value: '' } });
      });

      const icon = addableContainer.querySelector('.mzn-select-autocomplete__icon');

      await act(async () => {
        fireEvent.click(icon!);
      });

      expect(onInsert).toBeCalledTimes(0);
    });

    it('should invoke insert action when input has value and should clear input if success', async () => {
      const addableContainer = getAddingContainer();
      const input = getInputElement(addableContainer);

      await act(async () => {
        fireEvent.change(input, { target: { value: 'new option' } });
      });

      const icon = addableContainer.querySelector('.mzn-select-autocomplete__icon');

      await act(async () => {
        fireEvent.click(icon!);
      });

      expect(onInsert).toBeCalledTimes(1);
      expect(newOption).toBe('new option');
      expect(getInputElement(getAddingContainer()).getAttribute('value')).toBe('');
    });
  });

  describe('exception handlers', () => {
    it('addable true, but not giving onInsert, then should remain input text', async () => {
      jest.useFakeTimers();

      const inputRef = createRef<HTMLInputElement>();

      render(
        <AutoComplete
          addable
          inputRef={inputRef}
          onInsert={undefined}
          options={defaultOptions}
        />,
      );

      await act(async () => {
        fireEvent.focus(inputRef.current!);
      });

      const addableContainer = getAddingContainer();
      const input = getInputElement(addableContainer);

      await act(async () => {
        fireEvent.change(input, { target: { value: 'new option' } });
      });

      const icon = addableContainer.querySelector('.mzn-select-autocomplete__icon');

      await act(async () => {
        fireEvent.click(icon!);
      });

      expect(getInputElement(getAddingContainer()).getAttribute('value')).toBe('new option');
    });

    it('addable true, but onInsert return false, then should remain input text', async () => {
      jest.useFakeTimers();

      const inputRef = createRef<HTMLInputElement>();
      const onInsert = jest.fn<boolean, [string]>(() => false);

      render(
        <AutoComplete
          addable
          inputRef={inputRef}
          onInsert={onInsert}
          options={defaultOptions}
        />,
      );

      await act(async () => {
        fireEvent.focus(inputRef.current!);
      });

      const addableContainer = getAddingContainer();
      const input = getInputElement(addableContainer);

      await act(async () => {
        fireEvent.change(input, { target: { value: 'new option' } });
      });

      const icon = addableContainer.querySelector('.mzn-select-autocomplete__icon');

      await act(async () => {
        fireEvent.click(icon!);
      });

      expect(getInputElement(getAddingContainer()).getAttribute('value')).toBe('new option');
    });
  });
});
