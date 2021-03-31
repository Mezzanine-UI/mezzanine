import { PlusIcon, SearchIcon, TimesIcon } from '@mezzanine-ui/icons';
import { createRef, RefObject } from 'react';
import {
  act,
  cleanupHook,
  render,
  TestRenderer,
  fireEvent,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import Icon from '../Icon';
import TextField from '../TextField';
import Select, { Option } from '.';
import { SelectValue } from './SelectControlContext';

function getSelectInputElement(element: HTMLElement) {
  return element.getElementsByTagName('input')[0];
}

function getHostContainer(container: HTMLElement | null = document.body) {
  return container!.querySelector('.mzn-select');
}

async function testTextFieldClicked(element: HTMLElement | Element) {
  const textField = element.querySelector('.mzn-text-field');

  await act(async () => {
    fireEvent.click(textField!);
  });
}

describe('<Select />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<Select ref={ref} />),
  );

  describeForwardRefToHTMLElement(
    HTMLInputElement,
    (ref) => render(<Select inputRef={ref} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Select />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-select')).toBeTruthy();
  });

  it('props should pass to TextField', () => {
    const prefix = <Icon icon={PlusIcon} />;
    const testRenderer = TestRenderer.create(
      <Select
        clearable
        disabled
        error
        fullWidth
        prefix={prefix}
        size="large"
      />,
    );
    const testInstance = testRenderer.root;
    const textFieldInstance = testInstance.findByType(TextField);

    expect(textFieldInstance.props.clearable).toBe(true);
    expect(textFieldInstance.props.disabled).toBe(true);
    expect(textFieldInstance.props.error).toBe(true);
    expect(textFieldInstance.props.fullWidth).toBe(true);
    expect(textFieldInstance.props.prefix).toStrictEqual(prefix);
    expect(textFieldInstance.props.size).toBe('large');
  });

  it('props should directly pass to native input element', () => {
    const { getHostHTMLElement } = render(
      <Select
        disabled
        placeholder="placeholder"
        required
      />,
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
    const { getHostHTMLElement } = render(
      <Select />,
    );
    const element = getHostHTMLElement();

    expect(document.querySelector('.mzn-select__popper')).toBeNull();

    await testTextFieldClicked(element);

    expect(document.querySelector('.mzn-select__popper')).toBeInstanceOf(HTMLDivElement);
    expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);
  });

  describe('prop: suffixActionIcon', () => {
    const { getHostHTMLElement } = render(
      <Select suffixActionIcon={<Icon icon={PlusIcon} />} />,
    );
    const element = getHostHTMLElement();

    const actionIcon = element.querySelector('.mzn-text-field__action-icon');

    expect(actionIcon?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
  });

  describe('props: defaultValue/inputRef/onSearch/renderValue', () => {
    let valueGetFromOnSearch: string;
    let inputRef: RefObject<HTMLInputElement>;
    const defaultValue: SelectValue[] = [{
      id: '1',
      name: 'bar',
    }];

    beforeEach(async () => {
      inputRef = createRef<HTMLInputElement>();

      const onSearch = jest.fn<void, [string]>((value) => {
        valueGetFromOnSearch = value;
      });

      const renderValue = jest.fn<string, [SelectValue[]]>((value) => (
        value.map((v) => v.name).join('')
      ));

      await act(async () => {
        render(
          <Select
            defaultValue={defaultValue}
            inputRef={inputRef}
            onSearch={onSearch}
            renderValue={renderValue}
          />,
        );
      });

      await act(async () => {
        fireEvent.focus(inputRef.current!);
      });

      fireEvent.change(inputRef.current!, { target: { value: 'foo' } });
    });

    it('should display searchIcon when is searchable and modal is open', () => {
      const hostContainer = getHostContainer();

      testTextFieldClicked(hostContainer!);

      const actionIcon = hostContainer?.querySelector('.mzn-text-field__action-icon');

      expect(actionIcon?.getAttribute('data-icon-name')).toBe(SearchIcon.name);
    });

    it('should select input changeable', () => {
      expect(inputRef.current!.value).toEqual('foo');
      expect(valueGetFromOnSearch).toEqual('foo');
    });

    it('should render current selection in placeholder when search input is empty', () => {
      fireEvent.change(inputRef.current!, { target: { value: '' } });

      expect(inputRef.current!.placeholder).toEqual(defaultValue[0].name);
    });

    it('should search text been cleared when input onBlur triggered', async () => {
      await act(async () => {
        fireEvent.blur(inputRef.current!);
      });

      expect(valueGetFromOnSearch).toEqual('');
    });
  });

  describe('props: mode', () => {
    describe('mode: single', () => {
      const defaultValue: SelectValue[] = [{
        id: '1',
        name: 'foo',
      }];

      let element: HTMLElement;

      beforeEach(() => {
        const { getHostHTMLElement } = render(
          <Select
            defaultValue={defaultValue}
            mode="single"
          >
            <Option value={defaultValue[0].id}>
              {defaultValue[0].name}
            </Option>
          </Select>,
        );

        element = getHostHTMLElement();
      });

      it('should close popper when option clicked', async () => {
        await testTextFieldClicked(element);

        const options = document.querySelectorAll('.mzn-menu-item');

        await act(async () => {
          fireEvent.click(options[0]);
        });

        expect(document.querySelector('.mzn-select__popper')).toBeNull();
      });
    });

    describe('mode: multiple', () => {
      const defaultValue: SelectValue[] = [{
        id: '1',
        name: 'foo',
      }, {
        id: '2',
        name: 'bar',
      }];

      let element: HTMLElement;

      beforeEach(() => {
        const { getHostHTMLElement } = render(
          <Select
            defaultValue={defaultValue}
            mode="multiple"
          >
            <Option value="1">foo</Option>
            <Option value="2">bar</Option>
            <Option value="3">Alice</Option>
          </Select>,
        );

        element = getHostHTMLElement();
      });

      it('should tags children length equal to its value length', () => {
        const tags = element.querySelector('.mzn-select__text-field__tags');

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

        expect(tagLabels[0]?.innerHTML).toBe(defaultValue[1].name);
      });

      it('should push new selection into state when unselected option clicked', async () => {
        await testTextFieldClicked(element);

        const options = document.querySelectorAll('.mzn-menu-item');

        await act(async () => {
          fireEvent.click(options[2]);
        });

        const tagLabels = element.querySelectorAll('.mzn-tag__label');

        expect(tagLabels[2]?.innerHTML).toBe('Alice');
      });
    });
  });

  describe('prop: onClear', () => {
    it('when clear icon clicked, value should be an empty array', async () => {
      let defaultValue: SelectValue[] = [{
        id: '1',
        name: 'foo',
      }];

      const onClear = jest.fn<any, any>(() => {
        defaultValue = [];
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

      expect(defaultValue.length).toEqual(0);
    });
  });
});
