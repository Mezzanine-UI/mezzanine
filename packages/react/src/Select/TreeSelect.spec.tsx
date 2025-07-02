/* global document */
import { PlusIcon } from '@mezzanine-ui/icons';
import {
  act,
  cleanupHook,
  render,
  fireEvent,
  cleanup,
  getByText as getByTextWithContainer,
  waitFor,
} from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Icon from '../Icon';
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

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<TreeSelect ref={ref} options={options} />),
  );

  describeForwardRefToHTMLElement(HTMLInputElement, (ref) =>
    render(<TreeSelect inputRef={ref} options={options} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<TreeSelect options={options} />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-tree-select')).toBeTruthy();
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

  it('popper should be dynamically positioned when value changes', async () => {
    const value: SelectValue[] = [
      { id: '1-1-1', name: 'label 1-1-1' },
      { id: '1-1-2', name: 'label 1-1-2' },
    ];
    const { getHostHTMLElement } = render(
      <TreeSelect options={options} value={value} />,
    );

    const element = getHostHTMLElement();
    const textFieldElement = element.querySelector('.mzn-text-field')!;

    act(() => {
      fireEvent.click(textFieldElement);
    });

    // Something about popper is causing error, even though tests fulfilled. Below line makes the error goes away
    // ref: https://github.com/floating-ui/react-popper/issues/368
    await waitFor(() => {});

    const menuElement = document.querySelector('.mzn-menu');

    expect(menuElement).toBeInstanceOf(HTMLElement);
  });

  describe('panel width calculation', () => {
    it('should be width from style of "menuProps" styles if available', async () => {
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

      act(() => {
        fireEvent.click(textFieldElement!);
      });

      await waitFor(() => {});

      const menuElement = document.querySelector('.mzn-menu');

      expect((menuElement as HTMLElement).style.width).toBe('100px');
    });

    it('else if prop "depth" is provided, should calculate base on depth', async () => {
      const { getHostHTMLElement } = render(
        <TreeSelect options={options} depth={3} />,
      );

      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field');

      act(() => {
        fireEvent.click(textFieldElement!);
      });

      await waitFor(() => {});

      const menuElement = document.querySelector('.mzn-menu');

      expect((menuElement as HTMLElement).style.width).toBeTruthy();
    });

    it('else should calculate by options structure', async () => {
      const { getHostHTMLElement } = render(<TreeSelect options={options} />);

      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field');

      act(() => {
        fireEvent.click(textFieldElement!);
      });

      await waitFor(() => {});

      const menuElement = document.querySelector('.mzn-menu');

      expect((menuElement as HTMLElement).style.width).toBeTruthy();
    });
  });

  describe('open control', () => {
    it('should toggle panel when text-field clicked', async () => {
      const { getHostHTMLElement } = render(<TreeSelect options={options} />);
      const element = getHostHTMLElement();

      expect(document.querySelector('.mzn-select-popper')).toBeNull();

      const textFieldElement = element.querySelector('.mzn-text-field');

      act(() => {
        fireEvent.click(textFieldElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.querySelector('.mzn-menu')).toBeInstanceOf(
          HTMLUListElement,
        );
      });

      act(() => {
        fireEvent.click(textFieldElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBe(null);
        expect(document.querySelector('.mzn-menu')).toBe(null);
      });
    });

    it('should not close panel when panel clicked', async () => {
      const { getHostHTMLElement } = render(<TreeSelect options={options} />);
      const element = getHostHTMLElement();

      expect(document.querySelector('.mzn-select-popper')).toBeNull();

      const textFieldElement = element.querySelector('.mzn-text-field');

      act(() => {
        fireEvent.click(textFieldElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.querySelector('.mzn-menu')).toBeInstanceOf(
          HTMLUListElement,
        );
      });

      act(() => {
        fireEvent.click(document.querySelector('.mzn-menu')!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.querySelector('.mzn-menu')).toBeInstanceOf(
          HTMLUListElement,
        );
      });
    });

    it('should close panel when opened and clicked away', async () => {
      const { getHostHTMLElement } = render(<TreeSelect options={options} />);
      const element = getHostHTMLElement();

      expect(document.querySelector('.mzn-select-popper')).toBeNull();

      const textFieldElement = element.querySelector('.mzn-text-field');

      act(() => {
        fireEvent.click(textFieldElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.querySelector('.mzn-menu')).toBeInstanceOf(
          HTMLUListElement,
        );
      });

      act(() => {
        fireEvent.click(document.body);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBe(null);
        expect(document.querySelector('.mzn-menu')).toBe(null);
      });
    });

    it('should close panel when opened and text-field enter key pressed', async () => {
      const { getHostHTMLElement } = render(<TreeSelect options={options} />);
      const element = getHostHTMLElement();

      expect(document.querySelector('.mzn-select-popper')).toBeNull();

      const textFieldElement = element.querySelector('.mzn-text-field');

      act(() => {
        fireEvent.click(textFieldElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.querySelector('.mzn-menu')).toBeInstanceOf(
          HTMLUListElement,
        );
      });

      act(() => {
        fireEvent.keyDown(textFieldElement!, { code: 'Enter' });
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBe(null);
        expect(document.querySelector('.mzn-menu')).toBe(null);
      });
    });

    it('should close panel when opened and text-field tab key pressed', async () => {
      const { getHostHTMLElement } = render(<TreeSelect options={options} />);
      const element = getHostHTMLElement();

      expect(document.querySelector('.mzn-select-popper')).toBeNull();

      const textFieldElement = element.querySelector('.mzn-text-field')!;

      act(() => {
        fireEvent.keyDown(textFieldElement, { code: 'Tab' });
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBe(null);
        expect(document.querySelector('.mzn-menu')).toBe(null);
      });

      act(() => {
        fireEvent.click(textFieldElement);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.querySelector('.mzn-menu')).toBeInstanceOf(
          HTMLUListElement,
        );
      });

      act(() => {
        fireEvent.keyDown(textFieldElement, { code: 'Tab' });
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBe(null);
        expect(document.querySelector('.mzn-menu')).toBe(null);
      });
    });

    it('should not close panel when opened and text-field other keys pressed', async () => {
      const { getHostHTMLElement } = render(<TreeSelect options={options} />);
      const element = getHostHTMLElement();

      expect(document.querySelector('.mzn-select-popper')).toBeNull();

      const textFieldElement = element.querySelector('.mzn-text-field');

      act(() => {
        fireEvent.click(textFieldElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.querySelector('.mzn-menu')).toBeInstanceOf(
          HTMLUListElement,
        );
      });

      act(() => {
        fireEvent.keyDown(textFieldElement!, { code: 'A' });
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.querySelector('.mzn-menu')).toBeInstanceOf(
          HTMLUListElement,
        );
      });
    });

    it('should open panel when text-field arrow keys pressed', async () => {
      const { getHostHTMLElement } = render(<TreeSelect options={options} />);
      const element = getHostHTMLElement();

      expect(document.querySelector('.mzn-select-popper')).toBeNull();

      const textFieldElement = element.querySelector('.mzn-text-field');

      act(() => {
        fireEvent.keyDown(textFieldElement!, { code: 'ArrowUp' });
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.querySelector('.mzn-menu')).toBeInstanceOf(
          HTMLUListElement,
        );
      });

      act(() => {
        fireEvent.click(textFieldElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBe(null);
        expect(document.querySelector('.mzn-menu')).toBe(null);
      });

      act(() => {
        fireEvent.keyDown(textFieldElement!, { code: 'ArrowDown' });
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.querySelector('.mzn-menu')).toBeInstanceOf(
          HTMLUListElement,
        );
      });

      act(() => {
        fireEvent.click(textFieldElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBe(null);
        expect(document.querySelector('.mzn-menu')).toBe(null);
      });

      act(() => {
        fireEvent.keyDown(textFieldElement!, { code: 'ArrowLeft' });
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.querySelector('.mzn-menu')).toBeInstanceOf(
          HTMLUListElement,
        );
      });

      act(() => {
        fireEvent.click(textFieldElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBe(null);
        expect(document.querySelector('.mzn-menu')).toBe(null);
      });

      act(() => {
        fireEvent.keyDown(textFieldElement!, { code: 'ArrowRight' });
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.querySelector('.mzn-menu')).toBeInstanceOf(
          HTMLUListElement,
        );
      });

      act(() => {
        fireEvent.click(textFieldElement!);
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBe(null);
        expect(document.querySelector('.mzn-menu')).toBe(null);
      });
    });

    it('should not close panel when text-field arrow keys pressed and is opened', async () => {
      const { getHostHTMLElement } = render(<TreeSelect options={options} />);
      const element = getHostHTMLElement();

      expect(document.querySelector('.mzn-select-popper')).toBeNull();

      const textFieldElement = element.querySelector('.mzn-text-field')!;

      act(() => {
        fireEvent.click(textFieldElement);
      });

      act(() => {
        fireEvent.keyDown(textFieldElement, { code: 'ArrowUp' });
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.querySelector('.mzn-menu')).toBeInstanceOf(
          HTMLUListElement,
        );
      });

      act(() => {
        fireEvent.keyDown(textFieldElement!, { code: 'ArrowDown' });
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.querySelector('.mzn-menu')).toBeInstanceOf(
          HTMLUListElement,
        );
      });

      act(() => {
        fireEvent.keyDown(textFieldElement!, { code: 'ArrowLeft' });
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.querySelector('.mzn-menu')).toBeInstanceOf(
          HTMLUListElement,
        );
      });

      act(() => {
        fireEvent.keyDown(textFieldElement!, { code: 'ArrowRight' });
      });

      await waitFor(() => {
        expect(document.querySelector('.mzn-select-popper')).toBeInstanceOf(
          HTMLDivElement,
        );
        expect(document.querySelector('.mzn-menu')).toBeInstanceOf(
          HTMLUListElement,
        );
      });
    });
  });

  describe('focus handlers', () => {
    it('should invoke onFocus or onBlur when toggling via text-field click', async () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(
        <TreeSelect options={options} onFocus={onFocus} onBlur={onBlur} />,
      );
      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field')!;

      act(() => {
        fireEvent.click(textFieldElement);
      });

      await waitFor(() => {});

      expect(onFocus).toBeCalledTimes(1);
      expect(onBlur).toBeCalledTimes(0);

      act(() => {
        fireEvent.click(textFieldElement);
      });

      await waitFor(() => {});

      expect(onFocus).toBeCalledTimes(1);
      expect(onBlur).toBeCalledTimes(1);
    });

    it('should invoke onBlur when closing via click-away from text-field', async () => {
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(
        <TreeSelect options={options} onBlur={onBlur} />,
      );
      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field')!;

      act(() => {
        fireEvent.click(textFieldElement);
      });

      act(() => {
        fireEvent.click(document.body);
      });

      await waitFor(() => {});

      expect(onBlur).toBeCalledTimes(1);
    });

    it('should invoke onBlur when closing via click-away from text-field', async () => {
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(
        <TreeSelect options={options} onBlur={onBlur} />,
      );
      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field')!;

      act(() => {
        fireEvent.click(textFieldElement);
      });

      act(() => {
        fireEvent.click(document.body);
      });

      await waitFor(() => {});

      expect(onBlur).toBeCalledTimes(1);
    });

    it('should invoke onBlur when closing via text-field tab key down', async () => {
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(
        <TreeSelect options={options} onBlur={onBlur} />,
      );
      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field')!;

      act(() => {
        fireEvent.click(textFieldElement);
      });

      act(() => {
        fireEvent.keyDown(textFieldElement, { code: 'Tab' });
      });

      await waitFor(() => {});

      expect(onBlur).toBeCalledTimes(1);
    });

    it('should not invoke onBlur when text-field tab key down but is not open', () => {
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(
        <TreeSelect options={options} onBlur={onBlur} />,
      );
      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field')!;

      fireEvent.keyDown(textFieldElement, { code: 'Tab' });
      expect(onBlur).toBeCalledTimes(0);
    });

    it('should invoke onBlur when closing via text-field enter key down', async () => {
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(
        <TreeSelect options={options} onBlur={onBlur} />,
      );
      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field')!;

      act(() => {
        fireEvent.click(textFieldElement);
      });

      act(() => {
        fireEvent.keyDown(textFieldElement, { code: 'Enter' });
      });

      await waitFor(() => {});

      expect(onBlur).toBeCalledTimes(1);
    });

    const arrowKeyCodes = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    arrowKeyCodes.forEach((arrowKeyCode) => {
      it(`should invoke onFocus when opening via text-field ${arrowKeyCode} key down`, async () => {
        const onFocus = jest.fn();
        const { getHostHTMLElement } = render(
          <TreeSelect options={options} onFocus={onFocus} />,
        );
        const element = getHostHTMLElement();
        const textFieldElement = element.querySelector('.mzn-text-field')!;

        act(() => {
          fireEvent.keyDown(textFieldElement, { code: arrowKeyCode });
        });

        await waitFor(() => {});

        expect(onFocus).toBeCalledTimes(1);
      });
    });

    arrowKeyCodes.forEach((arrowKeyCode) => {
      it(`should not invoke onFocus when text-field ${arrowKeyCode} key down but is opened`, async () => {
        const onFocus = jest.fn();
        const { getHostHTMLElement } = render(
          <TreeSelect options={options} onFocus={onFocus} />,
        );
        const element = getHostHTMLElement();
        const textFieldElement = element.querySelector('.mzn-text-field')!;

        act(() => {
          fireEvent.click(textFieldElement);
        });

        onFocus.mockClear();

        act(() => {
          fireEvent.keyDown(element.querySelector('.mzn-text-field')!, {
            code: arrowKeyCode,
          });
        });

        await waitFor(() => {});

        expect(onFocus).toBeCalledTimes(0);
      });
    });

    it('should not invoke onFocus or onBlur when other keys down', async () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(
        <TreeSelect options={options} onFocus={onFocus} />,
      );
      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field')!;

      act(() => {
        fireEvent.keyDown(textFieldElement, { code: '0' });
      });

      await waitFor(() => {});

      expect(onFocus).toBeCalledTimes(0);

      act(() => {
        fireEvent.click(textFieldElement);
      });

      act(() => {
        fireEvent.keyDown(textFieldElement, { code: '0' });
      });

      await waitFor(() => {});

      expect(onBlur).toBeCalledTimes(0);
    });
  });

  describe('select method', () => {
    it('should onChange get resolved selection', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <TreeSelect options={options} onChange={onChange} mode="multiple" />,
      );

      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field')!;

      act(() => {
        fireEvent.click(textFieldElement);
      });

      await waitFor(() => {});

      const testLabelElement = document.querySelector('.mzn-input-check')!;

      act(() => {
        fireEvent.click(testLabelElement);
      });

      expect(onChange).toBeCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: '1-1-1' }),
          expect.objectContaining({ id: '1-1-2' }),
        ]),
      );
    });
  });

  describe('expand functionality', () => {
    it('should have options expanded when caret icon clicked', async () => {
      const { getHostHTMLElement } = render(<TreeSelect options={options} />);

      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field')!;

      act(() => {
        fireEvent.click(textFieldElement);
      });

      await waitFor(() => {});

      const menuElement = document.querySelector(
        '.mzn-menu',
      )! as HTMLUListElement;
      const caretIconElement = menuElement.querySelector(
        '.mzn-tree-node__caret',
      )!;

      act(() => {
        fireEvent.click(caretIconElement);
      });

      await waitFor(() => {});

      expect(getByTextWithContainer(menuElement, 'label 1-1')).toBeInstanceOf(
        HTMLElement,
      );
    });
  });

  describe('prop: clearable', () => {
    it('should clear value if clear icon clicked when clearable=true', async () => {
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

      act(() => {
        fireEvent.mouseOver(element);
      });

      const clearIcon = element.querySelector('.mzn-text-field__clear-icon')!;

      act(() => {
        fireEvent.click(clearIcon);
      });

      await waitFor(() => {});

      expect(onChange).toBeCalledWith(
        expect.not.arrayContaining([expect.anything()]),
      );
    });
  });

  describe('prop: defaultExpandAll', () => {
    it('should expand all options if defaultExpandAll=true', async () => {
      const { getHostHTMLElement } = render(
        <TreeSelect options={options} defaultExpandAll />,
      );

      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field')!;

      act(() => {
        fireEvent.click(textFieldElement);
      });

      await waitFor(() => {});

      const menuElement = document.querySelector(
        '.mzn-menu',
      )! as HTMLUListElement;

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
      <TreeSelect
        options={options}
        suffixActionIcon={<Icon icon={PlusIcon} />}
      />,
    );
    const element = getHostHTMLElement();

    const actionIcon = element.querySelector('.mzn-text-field__action-icon');

    expect(actionIcon?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
  });
});
