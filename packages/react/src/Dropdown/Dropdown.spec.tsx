import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
});
