/* global document */
import { PlusIcon, TimesIcon } from '@mezzanine-ui/icons';
import { createRef, RefObject } from 'react';
import { act, cleanupHook, render, fireEvent } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Icon from '../Icon';
import Select, { Option, SelectValue } from '.';

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

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Select />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-select')).toBeTruthy();
  });

  it('props should directly pass to native input element', () => {
    const { getHostHTMLElement } = render(
      <Select disabled placeholder="placeholder" required />,
    );
    const element = getHostHTMLElement();
    const inputElement = getSelectInputElement(element);

    expect(inputElement.getAttribute('aria-disabled')).toBe('true');
    expect(inputElement.getAttribute('aria-readonly')).toBe('true');
    expect(inputElement.getAttribute('aria-haspopup')).toBe('listbox');
    expect(inputElement.hasAttribute('disabled')).toBe(true);
    expect(inputElement.getAttribute('placeholder')).toBe('placeholder');
    expect(inputElement.hasAttribute('readonly')).toBe(true);
    expect(inputElement.getAttribute('role')).toBe('combobox');
    expect(inputElement.getAttribute('value')).toBe('');
  });

  it('should TextField be clickable and open popper & menu after clicked', async () => {
    const { getHostHTMLElement } = render(<Select />);
    const element = getHostHTMLElement();

    expect(document.querySelector('.mzn-select-popper')).toBeNull();

    await testTextFieldClicked(element);

    expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(
      HTMLDivElement,
    );
    expect(document.querySelector('.mzn-menu')).toBeInstanceOf(
      HTMLUListElement,
    );
  });

  describe('focus handlers', () => {
    it('should invoke onFocus or onBlur when toggling via text-field click', async () => {
      jest.useFakeTimers();

      const onFocus = jest.fn();
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(
        <Select onFocus={onFocus} onBlur={onBlur} />,
      );
      const element = getHostHTMLElement();

      await testTextFieldClicked(element);

      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledTimes(0);

      await testTextFieldClicked(element);

      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should invoke onBlur when closing via click-away from text-field', async () => {
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(<Select onBlur={onBlur} />);
      const element = getHostHTMLElement();

      await testTextFieldClicked(element);

      await act(async () => {
        fireEvent.click(document.body);
      });
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should invoke onBlur when closing via click-away from text-field', async () => {
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(<Select onBlur={onBlur} />);
      const element = getHostHTMLElement();

      await testTextFieldClicked(element);

      await act(async () => {
        fireEvent.click(document.body);
      });
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should invoke onBlur when closing via text-field tab key down', async () => {
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

    it('should not invoke onBlur when text-field tab key down but is not open', async () => {
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

    it('should invoke onBlur when closing via text-field enter key down', async () => {
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
      it(`should invoke onFocus when opening via text-field ${arrowKeyCode} key down`, async () => {
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
      it(`should not invoke onFocus when text-field ${arrowKeyCode} key down but is opened`, async () => {
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

    it('should not invoke onFocus or onBlur when other keys down', async () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(
        <Select onBlur={onBlur} onFocus={onFocus} />,
      );
      const element = getHostHTMLElement();

      await act(async () => {
        fireEvent.keyDown(element.querySelector('.mzn-text-field')!, {
          code: '0',
        });
      });

      expect(onFocus).toHaveBeenCalledTimes(0);

      await testTextFieldClicked(element);

      await act(async () => {
        fireEvent.keyDown(element.querySelector('.mzn-text-field')!, {
          code: '0',
        });
      });

      expect(onBlur).toHaveBeenCalledTimes(0);
    });
  });

  describe('prop: suffixActionIcon', () => {
    const { getHostHTMLElement } = render(
      <Select suffixActionIcon={<Icon icon={PlusIcon} />} />,
    );
    const element = getHostHTMLElement();

    const actionIcon = element.querySelector('.mzn-text-field__action-icon');

    expect(actionIcon?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
  });

  describe('props: defaultValue/inputRef/renderValue', () => {
    let inputRef: RefObject<HTMLInputElement | null>;
    const defaultValue: SelectValue = { id: '1', name: 'bar' };

    beforeEach(async () => {
      inputRef = createRef<HTMLInputElement>();

      const renderValue = jest.fn<string, [SelectValue]>((value) => value.name);

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

    it('should select input changeable', () => {
      expect(inputRef.current!.value).toEqual('bar');
    });
  });

  describe('props: mode and onChange', () => {
    describe('mode: single', () => {
      const defaultValue: SelectValue = { id: '1', name: 'foo' };

      let element: HTMLElement;

      const onChange = jest.fn();

      beforeEach(() => {
        const { getHostHTMLElement } = render(
          <Select defaultValue={defaultValue} mode="single" onChange={onChange}>
            <Option value={defaultValue.id}>{defaultValue.name}</Option>
          </Select>,
        );

        element = getHostHTMLElement();
      });

      it('should close popper when option clicked', async () => {
        jest.useFakeTimers();

        await testTextFieldClicked(element);

        const options = document.querySelectorAll('.mzn-menu-item');

        await act(async () => {
          fireEvent.click(options[0]);
        });

        await act(async () => {
          jest.runAllTimers();
        });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith({
          id: defaultValue.id,
          name: defaultValue.name,
        });
        expect(document.querySelector('.mzn-select-popper')).toBeNull();
        expect(
          options[0].classList.contains('mzn-menu-item--active'),
        ).toBeTruthy();
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

      it('should tags children length equal to its value length', () => {
        const tags = element.querySelector('.mzn-select-trigger__tags');

        expect(tags?.children.length).toEqual(defaultValue.length);
      });

      it('should render value.name in each tag by default', () => {
        const tagLabels = element.querySelectorAll('.mzn-tag__label');

        expect(tagLabels[0]?.innerHTML).toBe(defaultValue[0].name);
        expect(tagLabels[1]?.innerHTML).toBe(defaultValue[1].name);
      });

      it('should tag been deleted when its close icon clicked', async () => {
        const tagCloseIcons = element.querySelectorAll('.mzn-tag__close-icon');

        await act(async () => {
          fireEvent.click(tagCloseIcons[0]);
        });

        const tagLabels = element.querySelectorAll('.mzn-tag__label');

        expect(onChange).toHaveBeenCalledWith([
          { id: defaultValue[1].id, name: defaultValue[1].name },
        ]);
        expect(tagLabels[0]?.innerHTML).toBe(defaultValue[1].name);
      });

      it('should push new selection into state when unselected option clicked', async () => {
        await testTextFieldClicked(element);

        const options = document.querySelectorAll('.mzn-menu-item');

        await act(async () => {
          fireEvent.click(options[2]);
        });

        const tagLabels = element.querySelectorAll('.mzn-tag__label');

        expect(onChange).toHaveBeenCalledWith([
          { id: defaultValue[0].id, name: defaultValue[0].name },
          { id: defaultValue[1].id, name: defaultValue[1].name },
          { id: '3', name: 'Alice' },
        ]);
        expect(tagLabels[2]?.innerHTML).toBe('Alice');
        expect(
          options[0].classList.contains('mzn-menu-item--active'),
        ).toBeTruthy();
        expect(
          options[1].classList.contains('mzn-menu-item--active'),
        ).toBeTruthy();
        expect(
          options[2].classList.contains('mzn-menu-item--active'),
        ).toBeTruthy();
      });
    });
  });

  describe('prop: onClear', () => {
    it('when clear icon clicked, value should be undefined', async () => {
      let defaultValue: SelectValue | undefined = { id: '1', name: 'foo' };

      const onClear = jest.fn<any, any>(() => {
        defaultValue = undefined;
      });

      const { getHostHTMLElement } = render(
        <Select
          clearable
          defaultValue={defaultValue}
          mode="single"
          onClear={onClear}
        />,
      );

      const element = getHostHTMLElement();

      await act(async () => {
        fireEvent.focus(element);
      });

      const clearIcon = element.querySelector('.mzn-text-field__clear-icon');

      expect(clearIcon?.getAttribute('data-icon-name')).toBe(TimesIcon.name);

      await act(async () => {
        fireEvent.click(clearIcon!);
      });

      expect(defaultValue).toEqual(undefined);
    });

    it('when clear icon clicked, value should be be an empty array', async () => {
      let defaultValue: SelectValue[] = [{ id: '1', name: 'foo' }];

      const onClear = jest.fn<any, any>(() => {
        defaultValue = [];
      });

      const { getHostHTMLElement } = render(
        <Select
          clearable
          defaultValue={defaultValue}
          mode="multiple"
          onClear={onClear}
        />,
      );

      const element = getHostHTMLElement();

      await act(async () => {
        fireEvent.focus(element);
      });

      const clearIcon = element.querySelector('.mzn-text-field__clear-icon');

      expect(clearIcon?.getAttribute('data-icon-name')).toBe(TimesIcon.name);

      await act(async () => {
        fireEvent.click(clearIcon!);
      });

      expect(defaultValue.length).toEqual(0);
    });
  });
});
