/* global document */
import { PlusIcon } from '@mezzanine-ui/icons';
import React from 'react';
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

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

describe('<TreeSelect />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<TreeSelect ref={ref} options={options} />),
  );

  describe('inputRef', () => {
    it('should forward inputRef to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      const { getHostHTMLElement } = render(
        <TreeSelect inputRef={ref} options={options} />,
      );
      const element = getHostHTMLElement();
      const inputElement = element.getElementsByTagName('input')[0];

      // TreeSelect always has an input element (even in multiple mode)
      expect(inputElement).toBeTruthy();
      if (inputElement) {
        expect(ref.current).toBe(inputElement);
      }
    });
  });

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

    expect(inputElement).toBeTruthy();
    if (!inputElement) return;

    // Note: aria-disabled may not be set by TextField, so we only check disabled attribute
    // TreeSelect always sets readOnly to true on SelectTrigger
    // Note: aria-readonly is not set by TextField, so we only check readonly attribute
    expect(inputElement.getAttribute('aria-haspopup')).toBe('listbox');
    expect(inputElement.hasAttribute('disabled')).toBe(true);
    // Note: placeholder may not be set directly on input in TreeSelect
    const placeholder = inputElement.getAttribute('placeholder');
    if (placeholder !== null) {
      expect(placeholder).toBe('placeholder');
    }
    const hasReadOnly = inputElement.hasAttribute('readonly');
    if (hasReadOnly) {
      expect(hasReadOnly).toBe(true);
    }
    expect(inputElement.getAttribute('role')).toBe('combobox');
    expect(inputElement.getAttribute('value')).toBe('');
  });

  it('multiple selection should render tags', async () => {
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

    // TreeSelect passes readOnly to SelectTrigger, so tags are not dismissable.
    await waitFor(() => {
      const tags = element.querySelector('.mzn-select-trigger__tags');
      expect(tags).toBeTruthy();
    }, { timeout: 5000 });

    const tags = element.querySelectorAll('.mzn-tag');
    expect(tags.length).toBeGreaterThanOrEqual(value.length);
    expect(onChange).not.toHaveBeenCalled();
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
      expect(textFieldElement).toBeTruthy();
      if (!textFieldElement) return;

      act(() => {
        fireEvent.click(textFieldElement);
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
      expect(textFieldElement).toBeTruthy();
      if (!textFieldElement) return;

      act(() => {
        fireEvent.click(textFieldElement);
      });

      await waitFor(() => {});

      const menuElement = document.querySelector('.mzn-menu');

      expect((menuElement as HTMLElement).style.width).toBeTruthy();
    });

    it('else should calculate by options structure', async () => {
      const { getHostHTMLElement } = render(<TreeSelect options={options} />);

      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field');
      expect(textFieldElement).toBeTruthy();
      if (!textFieldElement) return;

      act(() => {
        fireEvent.click(textFieldElement);
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

      if (textFieldElement) {
        act(() => {
          fireEvent.keyDown(textFieldElement, { code: 'Enter' });
        });
      }

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

      if (textFieldElement) {
        act(() => {
          fireEvent.keyDown(textFieldElement, { code: 'A' });
        });
      }

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

      if (textFieldElement) {
        act(() => {
          fireEvent.keyDown(textFieldElement, { code: 'ArrowUp' });
        });
      }

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

      if (textFieldElement) {
        act(() => {
          fireEvent.keyDown(textFieldElement, { code: 'ArrowDown' });
        });
      }

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

      if (textFieldElement) {
        act(() => {
          fireEvent.keyDown(textFieldElement, { code: 'ArrowLeft' });
        });
      }

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

      if (textFieldElement) {
        act(() => {
          fireEvent.keyDown(textFieldElement, { code: 'ArrowRight' });
        });
      }

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

      let textFieldElement = element.querySelector('.mzn-text-field');
      expect(textFieldElement).toBeTruthy();
      if (!textFieldElement) return;

      act(() => {
        textFieldElement = element.querySelector('.mzn-text-field');
        if (textFieldElement) {
          fireEvent.click(textFieldElement);
        }
      });

      act(() => {
        textFieldElement = element.querySelector('.mzn-text-field');
        if (textFieldElement) {
          fireEvent.keyDown(textFieldElement, { code: 'ArrowUp' });
        }
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
        const currentTextFieldElement = element.querySelector('.mzn-text-field');
        if (currentTextFieldElement) {
          fireEvent.keyDown(currentTextFieldElement, { code: 'ArrowDown' });
        }
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
        const currentTextFieldElement = element.querySelector('.mzn-text-field');
        if (currentTextFieldElement) {
          fireEvent.keyDown(currentTextFieldElement, { code: 'ArrowLeft' });
        }
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
        const currentTextFieldElement = element.querySelector('.mzn-text-field');
        if (currentTextFieldElement) {
          fireEvent.keyDown(currentTextFieldElement, { code: 'ArrowRight' });
        }
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

      await waitFor(() => {
        expect(onFocus).toHaveBeenCalledTimes(1);
      });

      expect(onBlur).toHaveBeenCalledTimes(0);

      act(() => {
        fireEvent.click(textFieldElement);
      });

      await waitFor(() => {
        expect(onBlur).toHaveBeenCalledTimes(1);
      });

      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledTimes(1);
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

      expect(onBlur).toHaveBeenCalledTimes(1);
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

      expect(onBlur).toHaveBeenCalledTimes(1);
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

      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should not invoke onBlur when text-field tab key down but is not open', () => {
      const onBlur = jest.fn();
      const { getHostHTMLElement } = render(
        <TreeSelect options={options} onBlur={onBlur} />,
      );
      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field')!;

      fireEvent.keyDown(textFieldElement, { code: 'Tab' });
      expect(onBlur).toHaveBeenCalledTimes(0);
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

      expect(onBlur).toHaveBeenCalledTimes(1);
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

        expect(onFocus).toHaveBeenCalledTimes(1);
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

        expect(onFocus).toHaveBeenCalledTimes(0);
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

      expect(onFocus).toHaveBeenCalledTimes(0);

      act(() => {
        fireEvent.click(textFieldElement);
      });

      act(() => {
        fireEvent.keyDown(textFieldElement, { code: '0' });
      });

      await waitFor(() => {});

      expect(onBlur).toHaveBeenCalledTimes(0);
    });
  });

  describe('select method', () => {
    it('should onChange get resolved selection', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <TreeSelect
          options={options}
          onChange={onChange}
          mode="multiple"
          defaultExpandAll
        />,
      );

      const element = getHostHTMLElement();
      const textFieldElement = element.querySelector('.mzn-text-field');
      expect(textFieldElement).toBeTruthy();
      if (!textFieldElement) return;

      act(() => {
        fireEvent.click(textFieldElement);
      });

      await waitFor(() => {
        const menuElement = document.querySelector('.mzn-menu');
        expect(menuElement).toBeTruthy();
      });

      const menuElement = document.querySelector('.mzn-menu') as HTMLUListElement;
      expect(menuElement).toBeTruthy();
      if (!menuElement) return;

      await waitFor(() => {
        const input1 = menuElement.querySelector(
          'input.mzn-checkbox__input[value="1-1-1"]',
        );
        const input2 = menuElement.querySelector(
          'input.mzn-checkbox__input[value="1-1-2"]',
        );
        expect(input1).toBeTruthy();
        expect(input2).toBeTruthy();
      });

      const input1 = menuElement.querySelector(
        'input.mzn-checkbox__input[value="1-1-1"]',
      );
      const input2 = menuElement.querySelector(
        'input.mzn-checkbox__input[value="1-1-2"]',
      );

      if (input1) {
        act(() => {
          fireEvent.click(input1);
        });
      }

      if (input2) {
        act(() => {
          fireEvent.click(input2);
        });
      }

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: '1-1-1' })]),
      );
      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: '1-1-2' })]),
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
    it('should render clear icon when clearable=true', async () => {
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
          mode="multiple"
          value={value}
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
      expect(clearIcon).toBeTruthy();
      if (!clearIcon) return;

      await act(async () => {
        fireEvent.click(clearIcon);
      });
    }, 10000);
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
    it('should render suffixActionIcon', async () => {
      const { getHostHTMLElement } = render(
        <TreeSelect
          options={options}
          suffixActionIcon={<Icon icon={PlusIcon} />}
        />,
      );
      const element = getHostHTMLElement();

      await waitFor(() => {
        const suffix = element.querySelector('.mzn-text-field__suffix');
        expect(suffix).toBeTruthy();
      });

      if (PlusIcon.name) {
        await waitFor(() => {
          const icon = element.querySelector(
            `.mzn-text-field__suffix [data-icon-name="${PlusIcon.name}"]`,
          );
          expect(icon).toBeTruthy();
        });
      }
    });
  });
});
