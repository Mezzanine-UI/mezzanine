import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DropdownItem from './DropdownItem';

describe('DropdownItem', () => {
  const mockOptions: DropdownOption[] = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' },
  ];

  const defaultProps = {
    activeIndex: null,
    listboxId: 'test-listbox',
    options: mockOptions,
    mode: 'single' as const,
  };

  describe('rendering', () => {
    it('should render options', () => {
      render(<DropdownItem {...defaultProps} />);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should render with correct listbox id', () => {
      render(<DropdownItem {...defaultProps} />);
      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('id', 'test-listbox');
    });

    it('should render header content when provided', () => {
      render(
        <DropdownItem
          {...defaultProps}
          headerContent={<div data-testid="header">Header</div>}
        />
      );
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });
  });

  describe('active index', () => {
    it('should render active option with correct id when activeIndex is set', () => {
      render(<DropdownItem {...defaultProps} activeIndex={1} />);
      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
      // aria-activedescendant should be on the combobox (in Dropdown.tsx), not on the listbox
      // Verify that the active option has the correct id
      const activeOption = screen.getByRole('option', { name: 'Option 2' });
      expect(activeOption).toHaveAttribute('id', 'test-listbox-option-1');
      expect(activeOption).toHaveAttribute('aria-selected', 'true');
    });

    it('should apply active class to active option', () => {
      const { container } = render(
        <DropdownItem {...defaultProps} activeIndex={0} />
      );
      const activeOption = container.querySelector(
        '#test-listbox-option-0'
      );
      expect(activeOption).toHaveClass('mzn-dropdown-item-card--active');
    });
  });

  describe('selection', () => {
    it('should call onSelect when option is clicked', async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      render(<DropdownItem {...defaultProps} onSelect={onSelect} />);
      const option = screen.getByText('Option 1');
      await user.click(option);
      expect(onSelect).toHaveBeenCalledWith(mockOptions[0]);
    });

    it('should not call onSelect when disabled', async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      render(
        <DropdownItem {...defaultProps} disabled={true} onSelect={onSelect} />
      );
      const option = screen.getByText('Option 1');
      await user.click(option);
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('hover', () => {
    it('should call onHover when option is hovered', async () => {
      const user = userEvent.setup();
      const onHover = jest.fn();
      render(<DropdownItem {...defaultProps} onHover={onHover} />);
      const option = screen.getByText('Option 1');
      await user.hover(option);
      expect(onHover).toHaveBeenCalledWith(0);
    });
  });

  describe('multiple mode', () => {
    it('should render checkboxes in multiple mode with checkSite prefix', () => {
      const optionsWithCheckbox: DropdownOption[] = [
        { id: '1', name: 'Option 1', checkSite: 'prefix' },
        { id: '2', name: 'Option 2', checkSite: 'prefix' },
      ];
      render(
        <DropdownItem
          {...defaultProps}
          mode="multiple"
          options={optionsWithCheckbox}
          value={['1']}
        />
      );
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('should mark selected options as checked', () => {
      const optionsWithCheckbox: DropdownOption[] = [
        { id: '1', name: 'Option 1', checkSite: 'prefix' },
        { id: '2', name: 'Option 2', checkSite: 'prefix' },
      ];
      render(
        <DropdownItem
          {...defaultProps}
          mode="multiple"
          options={optionsWithCheckbox}
          value={['1', '2']}
        />
      );
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).toBeChecked();
    });
  });

  describe('single mode', () => {
    it('should mark selected option', () => {
      render(
        <DropdownItem
          {...defaultProps}
          mode="single"
          value="1"
        />
      );
      const option = screen.getByText('Option 1').closest('li');
      expect(option).toBeInTheDocument();
    });
  });

  describe('grouped type', () => {
    const groupedOptions: DropdownOption[] = [
      {
        id: 'group1',
        name: 'Group 1',
        children: [
          { id: '1', name: 'Item 1' },
          { id: '2', name: 'Item 2' },
        ],
      },
    ];

    it('should render grouped options', () => {
      render(
        <DropdownItem
          {...defaultProps}
          type="grouped"
          options={groupedOptions}
        />
      );
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  describe('tree type', () => {
    const treeOptions: DropdownOption[] = [
      {
        id: '1',
        name: 'Parent',
        showCheckbox: true,
        children: [
          {
            id: '1-1',
            name: 'Child',
            showCheckbox: true,
            children: [{ id: '1-1-1', name: 'Grandchild' }],
          },
        ],
      },
    ];

    it('should render tree options', () => {
      render(
        <DropdownItem
          {...defaultProps}
          type="tree"
          options={treeOptions}
        />
      );
      expect(screen.getByText('Parent')).toBeInTheDocument();
    });

    it('should expand/collapse tree nodes on click', async () => {
      const user = userEvent.setup();
      render(
        <DropdownItem
          {...defaultProps}
          type="tree"
          options={treeOptions}
        />
      );
      const parent = screen.getByText('Parent');
      await user.click(parent);
      // After clicking, child should be visible
      expect(screen.getByText('Child')).toBeInTheDocument();
    });

    it('should not select parent when clicking non-checkbox area', async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      render(
        <DropdownItem
          {...defaultProps}
          mode="multiple"
          onSelect={onSelect}
          type="tree"
          options={treeOptions}
        />
      );
      await user.click(screen.getByText('Parent'));
      expect(onSelect).not.toHaveBeenCalled();
      expect(screen.getByText('Child')).toBeInTheDocument();
    });

    it('should select parent when clicking parent checkbox', async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      render(
        <DropdownItem
          {...defaultProps}
          mode="multiple"
          onSelect={onSelect}
          type="tree"
          options={treeOptions}
        />
      );
      const [parentCheckbox] = screen.getAllByRole('checkbox');
      await user.click(parentCheckbox);
      expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
    });

    it('should keep parent expanded when clicking parent checkbox', async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      render(
        <DropdownItem
          {...defaultProps}
          mode="multiple"
          onSelect={onSelect}
          type="tree"
          options={treeOptions}
        />
      );
      await user.click(screen.getByText('Parent'));
      expect(screen.getByText('Child')).toBeInTheDocument();

      const [parentCheckbox] = screen.getAllByRole('checkbox');
      await user.click(parentCheckbox);

      expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
      expect(screen.getByText('Child')).toBeInTheDocument();
    });

    it('should allow parent row click to select when toggleCheckedOnClick is true', async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      render(
        <DropdownItem
          {...defaultProps}
          mode="multiple"
          onSelect={onSelect}
          toggleCheckedOnClick={true}
          type="tree"
          options={treeOptions}
        />
      );
      await user.click(screen.getByText('Parent'));
      expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
    });
  });

  describe('maxHeight', () => {
    it('should apply maxHeight style when provided', () => {
      const { container } = render(
        <DropdownItem {...defaultProps} maxHeight={200} />
      );
      const listbox = container.querySelector('.mzn-dropdown-list');
      expect(listbox).toHaveStyle({ maxHeight: '200px' });
    });

    it('should create scrollable wrapper when maxHeight is set', () => {
      const { container } = render(
        <DropdownItem {...defaultProps} maxHeight={200} />
      );
      const wrapper = container.querySelector('.mzn-dropdown-list-wrapper');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('action config', () => {
    it('should render actions when actionConfig is provided', () => {
      render(
        <DropdownItem
          {...defaultProps}
          actionConfig={{
            showActions: true,
            onCancel: jest.fn(),
            onConfirm: jest.fn(),
          }}
        />
      );
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });
  });

  describe('followText', () => {
    it('should highlight matching text in options', () => {
      const { container } = render(
        <DropdownItem {...defaultProps} followText="Option" />
      );
      const highlighted = container.querySelector(
        '.mzn-dropdown-item-card-highlighted-text'
      );
      expect(highlighted).toBeInTheDocument();
    });
  });

  describe('truncateArrayDepth', () => {
    it('should truncate options exceeding max depth', () => {
      const deepOptions: DropdownOption[] = [
        {
          id: '1',
          name: 'Level 1',
          children: [
            {
              id: '1-1',
              name: 'Level 2',
              children: [
                {
                  id: '1-1-1',
                  name: 'Level 3',
                  children: [
                    {
                      id: '1-1-1-1',
                      name: 'Level 4',
                      children: [{ id: '1-1-1-1-1', name: 'Level 5' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      render(
        <DropdownItem
          {...defaultProps}
          type="tree"
          options={deepOptions}
        />
      );
      // Should truncate to max 3 levels
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

