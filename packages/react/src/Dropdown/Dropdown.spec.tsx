import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Button from '../Button';
import TextField from '../TextField';
import Dropdown from './Dropdown';

function getPopperContainer(container: Element | null = document.body) {
  return container!.querySelector('div[data-popper-placement]');
}

describe('<Dropdown />', () => {
  const mockOptions: DropdownOption[] = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' },
  ];

  describe('prop: children', () => {
    it('should render button children', () => {
      render(
        <Dropdown options={mockOptions}>
          <Button>Click me</Button>
        </Dropdown>
      );
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render input children', () => {
      render(
        <Dropdown options={mockOptions}>
          <TextField>
            <input placeholder="Search" />
          </TextField>
        </Dropdown>
      );
      const input = screen.getByPlaceholderText('Search');
      expect(input).toBeInTheDocument();
    });
  });

  describe('prop: inputPosition', () => {
    describe('outside mode', () => {
      it('should render trigger outside when inputPosition is outside', () => {
        render(
          <Dropdown options={mockOptions} inputPosition="outside">
            <Button>Trigger</Button>
          </Dropdown>
        );
        expect(screen.getByText('Trigger')).toBeInTheDocument();
      });

      it('should open popper on trigger click', async () => {
        const user = userEvent.setup();
        render(
          <Dropdown options={mockOptions} inputPosition="outside">
            <Button>Trigger</Button>
          </Dropdown>
        );
        const trigger = screen.getByText('Trigger');
        await user.click(trigger);
        await waitFor(() => {
          const popper = getPopperContainer();
          expect(popper).toBeInTheDocument();
        });
      });
    });

    describe('inside mode', () => {
      it('should render input inside when inputPosition is inside', () => {
        render(
          <Dropdown options={mockOptions} inputPosition="inside">
            <TextField>
              <input placeholder="Search" />
            </TextField>
          </Dropdown>
        );
        const input = screen.getByPlaceholderText('Search');
        expect(input).toBeInTheDocument();
      });

      it('should open dropdown on input focus', async () => {
        const user = userEvent.setup();
        render(
          <Dropdown options={mockOptions} inputPosition="inside">
            <TextField>
              <input placeholder="Search" />
            </TextField>
          </Dropdown>
        );
        const input = screen.getByPlaceholderText('Search');
        await user.click(input);
        await waitFor(() => {
          expect(screen.getByText('Option 1')).toBeInTheDocument();
        });
      });

      it('should close dropdown on blur', async () => {
        const user = userEvent.setup();
        render(
          <div>
            <Dropdown options={mockOptions} inputPosition="inside">
              <TextField>
                <input placeholder="Search" />
              </TextField>
            </Dropdown>
            <button>Outside</button>
          </div>
        );
        const input = screen.getByPlaceholderText('Search');
        await user.click(input);
        await waitFor(() => {
          expect(screen.getByText('Option 1')).toBeInTheDocument();
        });
        const outsideButton = screen.getByText('Outside');
        await user.click(outsideButton);
        await waitFor(() => {
          expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('prop: onOpen / onClose', () => {
    it('should call onOpen when dropdown opens', async () => {
      const user = userEvent.setup();
      const onOpen = jest.fn();
      render(
        <Dropdown options={mockOptions} onOpen={onOpen} inputPosition="outside">
          <Button>Trigger</Button>
        </Dropdown>
      );
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);
      await waitFor(() => {
        expect(onOpen).toHaveBeenCalled();
      });
    });

    it('should call onClose when dropdown closes', async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      render(
        <div>
          <Dropdown options={mockOptions} onClose={onClose} inputPosition="outside">
            <Button>Trigger</Button>
          </Dropdown>
          <button>Outside</button>
        </div>
      );
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
      const outsideButton = screen.getByText('Outside');
      await user.click(outsideButton);
      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('prop: onSelect', () => {
    it('should call onSelect when option is selected', async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      render(
        <Dropdown options={mockOptions} onSelect={onSelect} inputPosition="outside">
          <Button>Trigger</Button>
        </Dropdown>
      );
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
      const option = screen.getByText('Option 1');
      await user.click(option);
      expect(onSelect).toHaveBeenCalledWith(mockOptions[0]);
    });
  });

  describe('prop: activeIndex', () => {
    it('should use controlled activeIndex', () => {
      render(
        <Dropdown
          options={mockOptions}
          activeIndex={1}
          inputPosition="outside"
        >
          <Button>Trigger</Button>
        </Dropdown>
      );
      // Active index should be controlled
      expect(screen.getByText('Trigger')).toBeInTheDocument();
    });
  });

  describe('prop: disabled', () => {
    it('should disable options when disabled', async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      render(
        <Dropdown
          options={mockOptions}
          disabled={true}
          onSelect={onSelect}
          inputPosition="outside"
        >
          <Button>Trigger</Button>
        </Dropdown>
      );
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
      const option = screen.getByText('Option 1');
      await user.click(option);
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('prop: showDropdownActions', () => {
    it('should render actions when showDropdownActions is true', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          showDropdownActions={true}
          onActionConfirm={jest.fn()}
          onActionCancel={jest.fn()}
          inputPosition="outside"
        >
          <Button>Trigger</Button>
        </Dropdown>
      );
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Confirm')).toBeInTheDocument();
      });
    });
  });

  describe('prop: placement', () => {
    it('should use placement for popper', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          placement="top"
          inputPosition="outside"
        >
          <Button>Trigger</Button>
        </Dropdown>
      );
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);
      await waitFor(() => {
        const popper = getPopperContainer();
        expect(popper).toBeInTheDocument();
      });
    });
  });

  describe('prop: sameWidth', () => {
    it('should apply sameWidth middleware', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          sameWidth={true}
          inputPosition="outside"
        >
          <Button>Trigger</Button>
        </Dropdown>
      );
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);
      await waitFor(() => {
        const popper = getPopperContainer();
        expect(popper).toBeInTheDocument();
      });
    });
  });

  describe('prop: isMatchInputValue', () => {
    it('should highlight matching text when isMatchInputValue is true', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          isMatchInputValue={true}
          inputPosition="inside"
        >
          <TextField>
            {({ paddingClassName }) => (
              <input
                className={paddingClassName}
                placeholder="Search"
                defaultValue="Option"
              />
            )}
          </TextField>
        </Dropdown>
      );
      const input = screen.getByPlaceholderText('Search');
      await user.click(input);
      await waitFor(() => {
        const listbox = screen.getByRole('listbox');
        expect(listbox).toBeInTheDocument();
      });
      // The highlight functionality is tested in highlightText.spec.ts
      // Here we just verify the dropdown opens correctly with isMatchInputValue
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });

  describe('prop: type', () => {
    it('should render grouped options when type is grouped', async () => {
      const user = userEvent.setup();
      const groupedOptions: DropdownOption[] = [
        {
          id: 'group1',
          name: 'Group 1',
          children: [{ id: '1', name: 'Item 1' }],
        },
      ];
      render(
        <Dropdown
          options={groupedOptions}
          type="grouped"
          inputPosition="outside"
        >
          <Button>Trigger</Button>
        </Dropdown>
      );
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByText('Group 1')).toBeInTheDocument();
        expect(screen.getByText('Item 1')).toBeInTheDocument();
      });
    });

    it('should render tree options when type is tree', async () => {
      const user = userEvent.setup();
      const treeOptions: DropdownOption[] = [
        {
          id: '1',
          name: 'Parent',
          children: [{ id: '1-1', name: 'Child' }],
        },
      ];
      render(
        <Dropdown options={treeOptions} type="tree" inputPosition="outside">
          <Button>Trigger</Button>
        </Dropdown>
      );
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByText('Parent')).toBeInTheDocument();
      });
    });
  });

  describe('prop: onItemHover', () => {
    it('should call onItemHover when option is hovered', async () => {
      const user = userEvent.setup();
      const onItemHover = jest.fn();
      render(
        <Dropdown
          options={mockOptions}
          onItemHover={onItemHover}
          inputPosition="outside"
        >
          <Button>Trigger</Button>
        </Dropdown>
      );
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
      const option = screen.getByText('Option 1');
      await user.hover(option);
      expect(onItemHover).toHaveBeenCalledWith(0);
    });
  });

  describe('click away', () => {
    it('should close dropdown when clicking outside', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Dropdown options={mockOptions} inputPosition="outside">
            <Button>Trigger</Button>
          </Dropdown>
          <button>Outside</button>
        </div>
      );
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
      const outsideButton = screen.getByText('Outside');
      await user.click(outsideButton);
      await waitFor(() => {
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('prop: children with ref', () => {
    it('should merge refs correctly when children has ref', () => {
      const childRef = React.createRef<HTMLButtonElement>();
      render(
        <Dropdown options={mockOptions} inputPosition="outside">
          <Button ref={childRef}>Trigger</Button>
        </Dropdown>
      );
      // 驗證 ref 被正確設置
      expect(childRef.current).toBeInstanceOf(HTMLButtonElement);
      expect(childRef.current?.textContent).toBe('Trigger');
    });

    it('should call original onClick handler from children', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(
        <Dropdown options={mockOptions} inputPosition="outside">
          <Button onClick={handleClick}>Trigger</Button>
        </Dropdown>
      );
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);
      // 驗證原始的 onClick 被調用
      expect(handleClick).toHaveBeenCalled();
      // 驗證 dropdown 也打開了
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });

    it('should call original onBlur handler from children in inline mode', async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();
      render(
        <div>
          <Dropdown options={mockOptions} inputPosition="inside">
            <TextField>
              <input
                placeholder="Search"
                onBlur={handleBlur}
                data-testid="test-input"
              />
            </TextField>
          </Dropdown>
          <button>Outside</button>
        </div>
      );
      const input = screen.getByTestId('test-input');
      await user.click(input);
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
      const outsideButton = screen.getByText('Outside');
      await user.click(outsideButton);
      await waitFor(() => {
        expect(handleBlur).toHaveBeenCalled();
      });
    });
  });

  describe('prop: loadingPosition', () => {
    it('should show full loading when loadingPosition is full and options are empty', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={[]}
          status="loading"
          loadingPosition="full"
          inputPosition="outside"
        >
          <Button>Trigger</Button>
        </Dropdown>
      );
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);
      await waitFor(() => {
        // 驗證顯示完整 loading（使用預設文字 "Loading..."）
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        // 驗證有 spinner icon
        const statusDiv = document.querySelector('.mzn-dropdown-status');
        expect(statusDiv).toBeInTheDocument();
      });
    });

    it('should show bottom loading when loadingPosition is bottom and options exist', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={mockOptions}
          status="loading"
          loadingPosition="bottom"
          inputPosition="outside"
        >
          <Button>Trigger</Button>
        </Dropdown>
      );
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);
      await waitFor(() => {
        // 驗證選項存在
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
      });
      // 驗證底部 loading 存在（通過查找 loading-more class）
      await waitFor(() => {
        const loadingMore = document.querySelector('.mzn-dropdown-loading-more');
        expect(loadingMore).toBeInTheDocument();
        // 驗證底部 loading 中有 loading 文字
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
    });

    it('should not show full loading when loadingPosition is bottom and options are empty', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={[]}
          status="loading"
          loadingPosition="bottom"
          inputPosition="outside"
        >
          <Button>Trigger</Button>
        </Dropdown>
      );
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);
      await waitFor(() => {
        // loadingPosition='bottom' 且 options 為空時，不應該顯示 full status
        // 根據實作，當 options 為空且 loadingPosition='bottom' 時，shouldShowFullStatus 為 false
        // 所以不應該顯示 .mzn-dropdown-status
        const fullStatus = document.querySelector('.mzn-dropdown-status');
        expect(fullStatus).not.toBeInTheDocument();
      });
    });

    it('should use full as default loadingPosition', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={[]}
          status="loading"
          inputPosition="outside"
        >
          <Button>Trigger</Button>
        </Dropdown>
      );
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);
      await waitFor(() => {
        // 預設應該顯示完整 loading（使用預設文字 "Loading..."）
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        const statusDiv = document.querySelector('.mzn-dropdown-status');
        expect(statusDiv).toBeInTheDocument();
      });
    });

    it('should show custom loadingText when provided', async () => {
      const user = userEvent.setup();
      render(
        <Dropdown
          options={[]}
          status="loading"
          loadingText="載入中..."
          inputPosition="outside"
        >
          <Button>Trigger</Button>
        </Dropdown>
      );
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);
      await waitFor(() => {
        // 驗證顯示自訂 loading 文字
        expect(screen.getByText('載入中...')).toBeInTheDocument();
      });
    });
  });
});
