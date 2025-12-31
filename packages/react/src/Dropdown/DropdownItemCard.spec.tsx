import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DropdownItemCard from './DropdownItemCard';
import { CaretRightIcon } from '@mezzanine-ui/icons';

describe('DropdownItemCard', () => {
  const defaultProps = {
    label: 'Test Option',
    mode: 'single' as const,
  };

  describe('rendering', () => {
    it('should render label', () => {
      render(<DropdownItemCard {...defaultProps} />);
      expect(screen.getByText('Test Option')).toBeInTheDocument();
    });

    it('should render with aria-label', () => {
      render(<DropdownItemCard {...defaultProps} name="Accessible Name" />);
      const option = screen.getByRole('option');
      expect(option).toHaveAttribute('aria-label', 'Accessible Name');
    });

    it('should render subtitle when provided', () => {
      render(<DropdownItemCard {...defaultProps} subTitle="Subtitle text" />);
      expect(screen.getByText('Subtitle text')).toBeInTheDocument();
    });

    it('should render prepend icon', () => {
      const { container } = render(
        <DropdownItemCard {...defaultProps} prependIcon={CaretRightIcon} />
      );
      const icon = container.querySelector('.mzn-icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render append icon', () => {
      const { container } = render(
        <DropdownItemCard {...defaultProps} appendIcon={CaretRightIcon} />
      );
      const icon = container.querySelector('.mzn-icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render append content', () => {
      render(<DropdownItemCard {...defaultProps} appendContent="Extra" />);
      expect(screen.getByText('Extra')).toBeInTheDocument();
    });
  });

  describe('active state', () => {
    it('should apply active class when active', () => {
      const { container } = render(
        <DropdownItemCard {...defaultProps} active={true} />
      );
      const card = container.querySelector('.mzn-dropdown-item-card--active');
      expect(card).toBeInTheDocument();
    });

    it('should set aria-selected when active', () => {
      render(<DropdownItemCard {...defaultProps} active={true} />);
      const option = screen.getByRole('option');
      expect(option).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('disabled state', () => {
    it('should apply disabled class when disabled', () => {
      const { container } = render(
        <DropdownItemCard {...defaultProps} disabled={true} />
      );
      const card = container.querySelector('.mzn-dropdown-item-card--disabled');
      expect(card).toBeInTheDocument();
    });

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <DropdownItemCard {...defaultProps} disabled={true} onClick={onClick} />
      );
      const option = screen.getByRole('option');
      await user.click(option);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('multiple mode', () => {
    it('should render checkbox when mode is multiple and checkSite is prepend', () => {
      render(
        <DropdownItemCard
          {...defaultProps}
          mode="multiple"
          checkSite="prepend"
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('should render checked icon when mode is multiple and checkSite is append and checked', () => {
      const { container } = render(
        <DropdownItemCard
          {...defaultProps}
          mode="multiple"
          checkSite="append"
          checked={true}
        />
      );
      const icon = container.querySelector('.mzn-icon');
      expect(icon).toBeInTheDocument();
    });

    it('should toggle checked state when clicked in multiple mode', async () => {
      const user = userEvent.setup();
      const onCheckedChange = jest.fn();
      render(
        <DropdownItemCard
          {...defaultProps}
          mode="multiple"
          checkSite="prepend"
          onCheckedChange={onCheckedChange}
        />
      );
      const option = screen.getByRole('option');
      await user.click(option);
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });
  });

  describe('single mode', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(<DropdownItemCard {...defaultProps} onClick={onClick} />);
      const option = screen.getByRole('option');
      await user.click(option);
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('controlled vs uncontrolled', () => {
    it('should use controlled checked state', () => {
      render(
        <DropdownItemCard
          {...defaultProps}
          mode="multiple"
          checkSite="prepend"
          checked={true}
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should use uncontrolled checked state with defaultChecked', () => {
      render(
        <DropdownItemCard
          {...defaultProps}
          mode="multiple"
          checkSite="prepend"
          defaultChecked={true}
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
  });

  describe('validation', () => {
    it('should apply danger color when validate is danger', () => {
      const { container } = render(
        <DropdownItemCard {...defaultProps} validate="danger" />
      );
      const typography = container.querySelector('.mzn-dropdown-item-card-title');
      expect(typography).toBeInTheDocument();
    });
  });

  describe('level', () => {
    it('should apply level class', () => {
      const { container } = render(
        <DropdownItemCard {...defaultProps} level={1} />
      );
      const card = container.querySelector('.mzn-dropdown-item-card--level-1');
      expect(card).toBeInTheDocument();
    });
  });

  describe('highlight text', () => {
    it('should highlight matching text in label', () => {
      const { container } = render(
        <DropdownItemCard {...defaultProps} label="Hello World" followText="Hello" />
      );
      const highlighted = container.querySelector('.mzn-dropdown-item-card-highlighted-text');
      expect(highlighted).toBeInTheDocument();
      expect(highlighted?.textContent).toBe('Hello');
    });

    it('should highlight matching text in subtitle', () => {
      const { container } = render(
        <DropdownItemCard
          {...defaultProps}
          subTitle="Hello World"
          followText="Hello"
        />
      );
      const highlighted = container.querySelector('.mzn-dropdown-item-card-highlighted-text');
      expect(highlighted).toBeInTheDocument();
    });
  });

  describe('underline', () => {
    it('should render underline when showUnderline is true', () => {
      const { container } = render(
        <DropdownItemCard {...defaultProps} showUnderline={true} />
      );
      const underline = container.querySelector('.mzn-dropdown-item-card-underline');
      expect(underline).toBeInTheDocument();
    });

    it('should not render underline when showUnderline is false', () => {
      const { container } = render(
        <DropdownItemCard {...defaultProps} showUnderline={false} />
      );
      const underline = container.querySelector('.mzn-dropdown-item-card-underline');
      expect(underline).not.toBeInTheDocument();
    });
  });

  describe('keyboard events', () => {
    it('should call onClick on Enter key', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(<DropdownItemCard {...defaultProps} onClick={onClick} />);
      const option = screen.getByRole('option');
      option.focus();
      await user.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalled();
    });

    it('should call onClick on Space key', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(<DropdownItemCard {...defaultProps} onClick={onClick} />);
      const option = screen.getByRole('option');
      option.focus();
      await user.keyboard(' ');
      expect(onClick).toHaveBeenCalled();
    });

    it('should not call onClick on keyboard when disabled', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <DropdownItemCard {...defaultProps} disabled={true} onClick={onClick} />
      );
      const option = screen.getByRole('option');
      option.focus();
      await user.keyboard('{Enter}');
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('mouse events', () => {
    it('should call onMouseEnter when mouse enters', async () => {
      const user = userEvent.setup();
      const onMouseEnter = jest.fn();
      render(<DropdownItemCard {...defaultProps} onMouseEnter={onMouseEnter} />);
      const option = screen.getByRole('option');
      await user.hover(option);
      expect(onMouseEnter).toHaveBeenCalled();
    });
  });
});

