/* global document */
import { createRef, FocusEvent, MouseEvent } from 'react';
import { PlusIcon } from '@mezzanine-ui/icons';
import {
  act,
  cleanupHook,
  cleanup,
  render,
  fireEvent,
} from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import { AutoComplete, SelectValue } from '.';

function getAddingContainer(container: HTMLElement | null = document.body) {
  return container!.querySelector('.mzn-select-autocomplete') as HTMLElement;
}

function getPopper() {
  return document.querySelector('.mzn-select-popper');
}

function getOptions() {
  return document.querySelectorAll('.mzn-menu-item');
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

  it('should close menu when onChange triggered on single mode', async () => {
    jest.useFakeTimers();

    const inputRef = createRef<HTMLInputElement>();

    render(
      <AutoComplete
        inputRef={inputRef}
        mode="single"
        options={defaultOptions}
      />,
    );

    await act(async () => {
      fireEvent.focus(inputRef.current!);
      fireEvent.change(inputRef.current!, { target: { value: 'foo' } });
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

  it('should not close menu when onChange triggered on multiple mode', async () => {
    jest.useFakeTimers();

    const inputRef = createRef<HTMLInputElement>();

    render(
      <AutoComplete
        inputRef={inputRef}
        mode="multiple"
        options={defaultOptions}
      />,
    );

    await act(async () => {
      fireEvent.focus(inputRef.current!);
      fireEvent.change(inputRef.current!, { target: { value: 'foo' } });
    });

    expect(getPopper()).toBeInstanceOf(HTMLDivElement);

    const options = getOptions();

    await act(async () => {
      fireEvent.click(options[0]);
    });

    await act(async () => {
      jest.runAllTimers();
    });

    expect(getPopper()).toBeInstanceOf(HTMLDivElement);
  });

  it('should close menu when clickaway', async () => {
    jest.useFakeTimers();

    const inputRef = createRef<HTMLInputElement>();

    render(<AutoComplete inputRef={inputRef} options={defaultOptions} />);

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

  it('open menu when click chevron down icon', async () => {
    const { getHostHTMLElement } = render(
      <AutoComplete options={defaultOptions} />,
    );

    const icon = getHostHTMLElement().querySelector(
      '.mzn-select-trigger__suffix-action-icon',
    );

    await act(async () => {
      fireEvent.click(icon!);
    });

    expect(getPopper()).toBeInstanceOf(HTMLDivElement);
  });

  describe('when clear action clicked', () => {
    (['single', 'multiple'] as ('single' | 'multiple')[]).forEach((mode) => {
      it(`should clear input text and trig onClear, onChange and onSearch on mode="${mode}"`, async () => {
        jest.useFakeTimers();

        const onClear = jest.fn<void, [MouseEvent<Element>]>(() => {});
        const inputRef = createRef<HTMLInputElement>();
        const onChange = jest.fn();
        const onSearch = jest.fn();

        render(
          <AutoComplete
            inputRef={inputRef}
            mode={mode}
            onClear={onClear}
            onChange={onChange}
            onSearch={onSearch}
            options={defaultOptions}
          />,
        );

        await act(async () => {
          fireEvent.change(inputRef.current!, { target: { value: 'foo' } });
        });

        const clearIcon = document.querySelector('.mzn-text-field__clear-icon');

        await act(async () => {
          fireEvent.click(clearIcon!);
        });

        const valueAfterClear = mode === 'single' ? null : [];

        expect(inputRef.current!.value).toBe('');
        expect(onClear).toBeCalledTimes(1);
        expect(onChange).toBeCalledWith(valueAfterClear);
        expect(onSearch).toBeCalledWith('');
      });
    });
  });

  it('should reduce value from options when blur', async () => {
    jest.useFakeTimers();

    const inputRef = createRef<HTMLInputElement>();

    render(
      <AutoComplete
        inputRef={inputRef}
        options={defaultOptions}
        value={defaultOptions[0]}
      />,
    );

    await act(async () => {
      fireEvent.focus(inputRef.current!);
    });

    expect(inputRef.current!.getAttribute('placeholder')).toBe('foo');

    await act(async () => {
      fireEvent.change(inputRef.current!, { target: { value: 'foobar' } });
    });

    await act(async () => {
      fireEvent.blur(inputRef.current!);
    });

    expect(inputRef.current!.value).toBe('foo');
  });

  it('should display options that matched user typings by default', async () => {
    jest.useFakeTimers();

    const inputRef = createRef<HTMLInputElement>();

    render(<AutoComplete inputRef={inputRef} options={defaultOptions} />);

    await act(async () => {
      fireEvent.focus(inputRef.current!);
      fireEvent.change(inputRef.current!, { target: { value: 'fo' } });
    });

    expect(getOptions().length).toBe(1);

    await act(async () => {
      fireEvent.change(inputRef.current!, { target: { value: 'foo123' } });
    });

    expect(getOptions().length).toBe(0);
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
    expect(onSearch).toBeCalledWith('foo');
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
      <AutoComplete
        inputRef={inputRef}
        options={defaultOptions}
        disabledOptionsFilter
      />,
    );

    await act(async () => {
      fireEvent.focus(inputRef.current!);
      fireEvent.change(inputRef.current!, { target: { value: 'foo' } });
    });

    const options = getOptions();

    expect(options.length).toBe(defaultOptions.length);
  });

  describe('prop: addable/onInsert/onChange', () => {
    const onInsert = jest.fn<SelectValue, [string]>((insert) => {
      const newOption = { id: insert, name: insert };

      return newOption;
    });

    const onChange = jest.fn();

    beforeEach(async () => {
      jest.useFakeTimers();

      const inputRef = createRef<HTMLInputElement>();

      render(
        <AutoComplete
          addable
          inputRef={inputRef}
          onInsert={onInsert}
          onChange={onChange}
          options={defaultOptions}
        />,
      );

      await act(async () => {
        fireEvent.focus(inputRef.current!);
        fireEvent.change(inputRef.current!, { target: { value: 'rytass' } });
      });
    });

    it('value of addable option is equals to user typing', async () => {
      const addableContainer = getAddingContainer();

      expect(
        addableContainer.getElementsByTagName('p')[0].childNodes[0].textContent,
      ).toBe('rytass');
    });

    it('should use PlusIcon as action button', () => {
      const addableContainer = getAddingContainer();
      const icon = addableContainer.querySelector(
        '.mzn-select-autocomplete__icon',
      );

      expect(icon?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
    });

    it('should invoke onInsert when click addable option', async () => {
      const addableContainer = getAddingContainer();

      await act(async () => {
        fireEvent.click(addableContainer);
      });

      expect(onInsert).toBeCalledTimes(1);
      expect(onChange).toBeCalledWith({
        id: 'rytass',
        name: 'rytass',
      });
    });
  });

  it('should not invoke onChange if onInsert is not given in addable mode', async () => {
    const onChange = jest.fn();

    const inputRef = createRef<HTMLInputElement>();

    render(
      <AutoComplete
        addable
        inputRef={inputRef}
        onChange={onChange}
        options={defaultOptions}
      />,
    );

    await act(async () => {
      fireEvent.focus(inputRef.current!);
      fireEvent.change(inputRef.current!, { target: { value: 'rytass' } });
    });

    const addableContainer = getAddingContainer();

    await act(async () => {
      fireEvent.click(addableContainer);
    });

    expect(onChange).toBeCalledTimes(0);
  });
});
