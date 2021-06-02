import { PlusIcon } from '@mezzanine-ui/icons';
import {
  act,
  cleanupHook,
  render,
  TestRenderer,
  fireEvent,
  cleanup,
  getByText as getByTextWithContainer,
  waitFor,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import Icon from '../Icon';
import TextField from '../TextField';
import { TreeSelect, SelectValue, TreeSelectOption } from '.';

const options: TreeSelectOption[] = [
  {
    id: '1',
    name: 'label 1',
    siblings: [
      {
        id: '1-1',
        name: 'label 1-1',
        siblings: [
          {
            id: '1-1-1',
            name: 'label 1-1-1',
          },
          {
            id: '1-1-2',
            name: 'label 1-1-2',
          },
        ],
      },
      {
        id: '1-2',
        name: 'label 1-2',
      },
    ],
  },
  {
    id: '2',
    name: 'label 2',
  },
];

describe('<TreeSelect />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<TreeSelect ref={ref} options={options} />),
  );

  describeForwardRefToHTMLElement(
    HTMLInputElement,
    (ref) => render(<TreeSelect inputRef={ref} options={options} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<TreeSelect options={options} />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-tree-select')).toBeTruthy();
  });

  it('props should pass to TextField', () => {
    const prefix = <Icon icon={PlusIcon} />;
    const testRenderer = TestRenderer.create(
      <TreeSelect
        options={options}
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
      <TreeSelect
        options={options}
        disabled
        placeholder="placeholder"
        required
      />,
    );
    const element = getHostHTMLElement();
    const inputElement = element.getElementsByTagName('input')[0];

    expect(inputElement.getAttribute('aria-disabled')).toBe('true');
    expect(inputElement.getAttribute('aria-readonly')).toBe('true');
    expect(inputElement.getAttribute('aria-haspopup')).toBe('listbox');
    expect(inputElement.hasAttribute('disabled')).toBe(true);
    expect(inputElement.getAttribute('placeholder')).toBe('placeholder');
    expect(inputElement.hasAttribute('readonly')).toBe(true);
    expect(inputElement.getAttribute('role')).toBe('combobox');
    expect(inputElement.getAttribute('value')).toBe('');
  });

  it('multiple selection can be deleted', () => {
    const onChange = jest.fn();
    const value: SelectValue[] = [
      { id: '1-1-1', name: 'label 1-1-1' },
      { id: '1-1-2', name: 'label 1-1-2' },
    ];
    const { getHostHTMLElement } = render(
      <TreeSelect
        options={options}
        mode="multiple"
        value={value}
        onChange={onChange}
      />,
    );
    const element = getHostHTMLElement();
    const closeIcon = element.querySelector('.mzn-tag__close-icon');

    fireEvent.click(closeIcon!);

    expect(onChange).toBeCalledWith(expect.not.arrayContaining([value[0]]));
  });

  it('popper should be dynamically positioned when value changes', () => {
    jest.useFakeTimers();

    const value: SelectValue[] = [
      { id: '1-1-1', name: 'label 1-1-1' },
      { id: '1-1-2', name: 'label 1-1-2' },
    ];
    const { getHostHTMLElement, rerender } = render(
      <TreeSelect options={options} value={value} />,
    );

    const element = getHostHTMLElement();
    const textFieldElement = element.querySelector('.mzn-text-field')!;

    fireEvent.click(textFieldElement);

    act(() => {
      jest.runAllTimers();
    });

    // Something about popper is causing error, even though tests fulfilled. Below line makes the error goes away
    waitFor(() => {});

    rerender(
      <TreeSelect
        options={options}
        value={[
          ...value,
          { id: '1-2', name: 'label 1-2' },
          { id: '2', name: 'label 2' },
        ]}
      />,
    );

    const menuElement = document.querySelector('.mzn-menu');

    expect(menuElement).toBeInstanceOf(HTMLElement);
  });

  describe('panel width calculation', () => {
    it('should be width from style of "menuProps" styles if available', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <TreeSelect
          options={options}
          menuProps={{
            style: {
              width: '100px',
            },
          }}
        />,
      );

      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field');

      fireEvent.click(textFieldElement!);

      act(() => {
        jest.runAllTimers();
      });

      const menuElement = document.querySelector('.mzn-menu');

      expect((menuElement as HTMLElement).style.width).toBe('100px');
    });

    it('else if prop "depth" is provided, should calculate base on depth', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <TreeSelect
          options={options}
          depth={3}
        />,
      );

      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field');

      fireEvent.click(textFieldElement!);

      act(() => {
        jest.runAllTimers();
      });

      const menuElement = document.querySelector('.mzn-menu');

      expect((menuElement as HTMLElement).style.width).toBeTruthy();
    });

    it('else should calculate by options structure', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(<TreeSelect options={options} />);

      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field');

      fireEvent.click(textFieldElement!);

      act(() => {
        jest.runAllTimers();
      });

      const menuElement = document.querySelector('.mzn-menu');

      expect((menuElement as HTMLElement).style.width).toBeTruthy();
    });
  });

  describe('open control', () => {
    it('should toggle panel when text-field clicked', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <TreeSelect options={options} />,
      );
      const element = getHostHTMLElement();

      expect(document.querySelector('.mzn-select-popper')).toBeNull();

      const textFieldElement = element.querySelector('.mzn-text-field');

      act(() => {
        fireEvent.click(textFieldElement!);
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(HTMLDivElement);
      expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);

      fireEvent.click(textFieldElement!);

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBe(null);
      expect(document.querySelector('.mzn-menu')).toBe(null);
    });

    it('should not close panel when panel clicked', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <TreeSelect options={options} />,
      );
      const element = getHostHTMLElement();

      expect(document.querySelector('.mzn-select-popper')).toBeNull();

      const textFieldElement = element.querySelector('.mzn-text-field');

      fireEvent.click(textFieldElement!);

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(HTMLDivElement);
      expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);

      fireEvent.click(document.querySelector('.mzn-menu')!);

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(HTMLDivElement);
      expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);
    });

    it('should close panel when opened and clicked away', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <TreeSelect options={options} />,
      );
      const element = getHostHTMLElement();

      expect(document.querySelector('.mzn-select-popper')).toBeNull();

      const textFieldElement = element.querySelector('.mzn-text-field');

      fireEvent.click(textFieldElement!);

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(HTMLDivElement);
      expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);

      fireEvent.click(document.body);

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBe(null);
      expect(document.querySelector('.mzn-menu')).toBe(null);
    });

    it('should close panel when opened and text-field enter key pressed', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <TreeSelect options={options} />,
      );
      const element = getHostHTMLElement();

      expect(document.querySelector('.mzn-select-popper')).toBeNull();

      const textFieldElement = element.querySelector('.mzn-text-field');

      fireEvent.click(textFieldElement!);

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(HTMLDivElement);
      expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);

      fireEvent.keyDown(textFieldElement!, { code: 'Enter' });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBe(null);
      expect(document.querySelector('.mzn-menu')).toBe(null);
    });

    it('should close panel when opened and text-field tab key pressed', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <TreeSelect options={options} />,
      );
      const element = getHostHTMLElement();

      expect(document.querySelector('.mzn-select-popper')).toBeNull();

      const textFieldElement = element.querySelector('.mzn-text-field')!;

      fireEvent.keyDown(textFieldElement, { code: 'Tab' });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBe(null);
      expect(document.querySelector('.mzn-menu')).toBe(null);

      fireEvent.click(textFieldElement);

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(HTMLDivElement);
      expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);

      fireEvent.keyDown(textFieldElement, { code: 'Tab' });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBe(null);
      expect(document.querySelector('.mzn-menu')).toBe(null);
    });

    it('should not close panel when opened and text-field other keys pressed', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <TreeSelect options={options} />,
      );
      const element = getHostHTMLElement();

      expect(document.querySelector('.mzn-select-popper')).toBeNull();

      const textFieldElement = element.querySelector('.mzn-text-field');

      fireEvent.click(textFieldElement!);

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(HTMLDivElement);
      expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);

      fireEvent.keyDown(textFieldElement!, { code: 'A' });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(HTMLDivElement);
      expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);
    });

    it('should open panel when text-field arrow keys pressed', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <TreeSelect options={options} />,
      );
      const element = getHostHTMLElement();

      expect(document.querySelector('.mzn-select-popper')).toBeNull();

      const textFieldElement = element.querySelector('.mzn-text-field');

      fireEvent.keyDown(textFieldElement!, { code: 'ArrowUp' });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(HTMLDivElement);
      expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);

      fireEvent.click(textFieldElement!);

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBe(null);
      expect(document.querySelector('.mzn-menu')).toBe(null);

      fireEvent.keyDown(textFieldElement!, { code: 'ArrowDown' });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(HTMLDivElement);
      expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);

      fireEvent.click(textFieldElement!);

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBe(null);
      expect(document.querySelector('.mzn-menu')).toBe(null);

      fireEvent.keyDown(textFieldElement!, { code: 'ArrowLeft' });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(HTMLDivElement);
      expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);

      fireEvent.click(textFieldElement!);

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBe(null);
      expect(document.querySelector('.mzn-menu')).toBe(null);

      fireEvent.keyDown(textFieldElement!, { code: 'ArrowRight' });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(HTMLDivElement);
      expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);

      fireEvent.click(textFieldElement!);

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBe(null);
      expect(document.querySelector('.mzn-menu')).toBe(null);
    });

    it('should not close panel when text-field arrow keys pressed and is opened', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <TreeSelect options={options} />,
      );
      const element = getHostHTMLElement();

      expect(document.querySelector('.mzn-select-popper')).toBeNull();

      const textFieldElement = element.querySelector('.mzn-text-field')!;

      fireEvent.click(textFieldElement);

      act(() => {
        jest.runAllTimers();
      });

      fireEvent.keyDown(textFieldElement, { code: 'ArrowUp' });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(HTMLDivElement);
      expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);

      fireEvent.keyDown(textFieldElement!, { code: 'ArrowDown' });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(HTMLDivElement);
      expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);

      fireEvent.keyDown(textFieldElement!, { code: 'ArrowLeft' });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(HTMLDivElement);
      expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);

      fireEvent.keyDown(textFieldElement!, { code: 'ArrowRight' });

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(HTMLDivElement);
      expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);
    });
  });

  describe('select method', () => {
    it('should onChange get resolved selection', () => {
      jest.useFakeTimers();

      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <TreeSelect options={options} onChange={onChange} mode="multiple" />,
      );

      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field')!;

      fireEvent.click(textFieldElement);

      act(() => {
        jest.runAllTimers();
      });

      const testLabelElement = document.querySelector('.mzn-input-check')!;

      fireEvent.click(testLabelElement);

      expect(onChange).toBeCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: '1-1-1' }),
          expect.objectContaining({ id: '1-1-2' }),
        ]),
      );
    });
  });

  describe('expand functionality', () => {
    it('should have options expanded when caret icon clicked', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <TreeSelect options={options} />,
      );

      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field')!;

      fireEvent.click(textFieldElement);

      act(() => {
        jest.runAllTimers();
      });

      const menuElement = document.querySelector('.mzn-menu')! as HTMLUListElement;
      const caretIconElement = menuElement.querySelector('.mzn-tree-node__caret')!;

      fireEvent.click(caretIconElement);

      act(() => {
        jest.runAllTimers();
      });

      expect(getByTextWithContainer(menuElement, 'label 1-1')).toBeInstanceOf(HTMLElement);
    });
  });

  describe('prop: clearable', () => {
    it('should clear value if clear icon clicked when clearable=true', () => {
      const onChange = jest.fn();
      const value: SelectValue[] = [
        { id: '1-1-1', name: 'label 1-1-1' },
        { id: '1-1-2', name: 'label 1-1-2' },
      ];
      const { getHostHTMLElement } = render(
        <TreeSelect
          options={options}
          clearable
          onChange={onChange}
          value={value}
        />,
      );
      const element = getHostHTMLElement();

      fireEvent.mouseOver(element);

      const clearIcon = element.querySelector('.mzn-text-field__clear-icon')!;

      fireEvent.click(clearIcon);

      expect(onChange).toBeCalledWith(expect.not.arrayContaining([expect.anything()]));
    });
  });

  describe('prop: defaultExpandAll', () => {
    it('should expand all options if defaultExpandAll=true', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <TreeSelect options={options} defaultExpandAll />,
      );

      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field')!;

      fireEvent.click(textFieldElement);

      act(() => {
        jest.runAllTimers();
      });

      const menuElement = document.querySelector('.mzn-menu')! as HTMLUListElement;

      function expectOptionsElement(currentOptions: TreeSelectOption[]) {
        currentOptions.forEach((option) => {
          expect(getByTextWithContainer(menuElement, option.name));

          if (option.siblings) {
            expectOptionsElement(option.siblings);
          }
        });
      }

      expectOptionsElement(options);
    });
  });

  describe('prop: suffixActionIcon', () => {
    const { getHostHTMLElement } = render(
      <TreeSelect options={options} suffixActionIcon={<Icon icon={PlusIcon} />} />,
    );
    const element = getHostHTMLElement();

    const actionIcon = element.querySelector('.mzn-text-field__action-icon');

    expect(actionIcon?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
  });
});
