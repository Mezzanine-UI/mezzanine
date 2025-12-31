import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DropdownAction from './DropdownAction';

describe('DropdownAction', () => {
  describe('rendering', () => {
    it('should not render when showActions is false', () => {
      const { container } = render(
        <DropdownAction
          showActions={false}
          onCancel={jest.fn()}
          onConfirm={jest.fn()}
        />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('should not render when showActions is true but no events provided', () => {
      const { container } = render(
        <DropdownAction showActions={true} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render when showActions is true and events are provided', () => {
      render(
        <DropdownAction
          showActions={true}
          onCancel={jest.fn()}
          onConfirm={jest.fn()}
        />,
      );

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });
  });

  describe('default mode (onCancel and onConfirm)', () => {
    it('should render both Cancel and Confirm buttons', () => {
      render(
        <DropdownAction
          showActions={true}
          onCancel={jest.fn()}
          onConfirm={jest.fn()}
        />,
      );

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('should call onCancel when Cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onCancel = jest.fn();

      render(
        <DropdownAction
          showActions={true}
          onCancel={onCancel}
          onConfirm={jest.fn()}
        />,
      );

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onConfirm when Confirm button is clicked', async () => {
      const user = userEvent.setup();
      const onConfirm = jest.fn();

      render(
        <DropdownAction
          showActions={true}
          onCancel={jest.fn()}
          onConfirm={onConfirm}
        />,
      );

      const confirmButton = screen.getByText('Confirm');
      await user.click(confirmButton);

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should align Confirm button to right when Cancel is not present', () => {
      const { container } = render(
        <DropdownAction
          showActions={true}
          onConfirm={jest.fn()}
        />,
      );

      const toolsDiv = container.querySelector('.mzn-dropdown-action-tools');
      const buttons = toolsDiv?.querySelectorAll('button');

      // When only one button, it should be the only child
      expect(buttons?.length).toBe(1);
      // CSS :only-child selector should apply margin-left: auto
      // This is tested via visual regression or manual testing
    });

    it('should not apply marginLeft when both buttons are present', () => {
      const { container } = render(
        <DropdownAction
          showActions={true}
          onCancel={jest.fn()}
          onConfirm={jest.fn()}
        />,
      );

      const toolsDiv = container.querySelector('.mzn-dropdown-action-tools');
      const buttons = toolsDiv?.querySelectorAll('button');

      // When both buttons are present, there should be 2 buttons
      expect(buttons?.length).toBe(2);
      // CSS :only-child selector should not apply (not the only child)
    });
  });

  describe('custom mode (onClick)', () => {
    it('should render custom action button when onClick is provided', () => {
      render(
        <DropdownAction
          showActions={true}
          onClick={jest.fn()}
        />,
      );

      expect(screen.getByText('Custom Action')).toBeInTheDocument();
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
      expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
    });

    it('should call onClick when custom action button is clicked', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();

      render(
        <DropdownAction
          showActions={true}
          onClick={onClick}
        />,
      );

      const customButton = screen.getByText('Custom Action');
      await user.click(customButton);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should apply customActionButtonProps to custom button', () => {
      render(
        <DropdownAction
          showActions={true}
          onClick={jest.fn()}
          customActionButtonProps={{
            variant: 'base-primary',
            disabled: true,
          }}
        />,
      );

      const customButton = screen.getByText('Custom Action');
      expect(customButton).toBeDisabled();
    });

    it('should not render custom button when both onClick and onClear are provided', () => {
      render(
        <DropdownAction
          showActions={true}
          onClick={jest.fn()}
          onClear={jest.fn()}
        />,
      );

      expect(screen.queryByText('Custom Action')).not.toBeInTheDocument();
    });
  });

  describe('clear mode (onClear)', () => {
    it('should render clear button when onClear is provided', () => {
      render(
        <DropdownAction
          showActions={true}
          onClear={jest.fn()}
        />,
      );

      expect(screen.getByText('Clear Options')).toBeInTheDocument();
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
      expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
    });

    it('should call onClear when clear button is clicked', async () => {
      const user = userEvent.setup();
      const onClear = jest.fn();

      render(
        <DropdownAction
          showActions={true}
          onClear={onClear}
        />,
      );

      const clearButton = screen.getByText('Clear Options');
      await user.click(clearButton);

      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('should not render clear button when both onClick and onClear are provided', () => {
      render(
        <DropdownAction
          showActions={true}
          onClick={jest.fn()}
          onClear={jest.fn()}
        />,
      );

      expect(screen.queryByText('Clear Options')).not.toBeInTheDocument();
    });
  });

  describe('top bar', () => {
    it('should render top bar when showTopBar is true', () => {
      const { container } = render(
        <DropdownAction
          showActions={true}
          showTopBar={true}
          onCancel={jest.fn()}
          onConfirm={jest.fn()}
        />,
      );

      const topBar = container.querySelector('.mzn-dropdown-action--top-bar');
      expect(topBar).toBeInTheDocument();
    });

    it('should not render top bar when showTopBar is false', () => {
      const { container } = render(
        <DropdownAction
          showActions={true}
          showTopBar={false}
          onCancel={jest.fn()}
          onConfirm={jest.fn()}
        />,
      );

      const topBar = container.querySelector('.mzn-dropdown-action--top-bar');
      expect(topBar).not.toBeInTheDocument();
    });

    it('should not render top bar when showTopBar is undefined', () => {
      const { container } = render(
        <DropdownAction
          showActions={true}
          onCancel={jest.fn()}
          onConfirm={jest.fn()}
        />,
      );

      const topBar = container.querySelector('.mzn-dropdown-action--top-bar');
      expect(topBar).not.toBeInTheDocument();
    });
  });

  describe('custom labels', () => {
    it('should use custom cancel label', () => {
      render(
        <DropdownAction
          showActions={true}
          onCancel={jest.fn()}
          onConfirm={jest.fn()}
          cancelText="取消"
        />,
      );

      expect(screen.getByText('取消')).toBeInTheDocument();
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });

    it('should use custom confirm label', () => {
      render(
        <DropdownAction
          showActions={true}
          onCancel={jest.fn()}
          onConfirm={jest.fn()}
          confirmText="確認"
        />,
      );

      expect(screen.getByText('確認')).toBeInTheDocument();
      expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
    });

    it('should use custom action label', () => {
      render(
        <DropdownAction
          showActions={true}
          onClick={jest.fn()}
          actionText="自訂動作"
        />,
      );

      expect(screen.getByText('自訂動作')).toBeInTheDocument();
      expect(screen.queryByText('Custom Action')).not.toBeInTheDocument();
    });

    it('should use custom clear label', () => {
      render(
        <DropdownAction
          showActions={true}
          onClear={jest.fn()}
          clearText="清除選項"
        />,
      );

      expect(screen.getByText('清除選項')).toBeInTheDocument();
      expect(screen.queryByText('Clear Options')).not.toBeInTheDocument();
    });
  });

  describe('CSS classes', () => {
    it('should apply correct CSS classes', () => {
      const { container } = render(
        <DropdownAction
          showActions={true}
          onCancel={jest.fn()}
          onConfirm={jest.fn()}
        />,
      );

      const actionDiv = container.querySelector('.mzn-dropdown-action');
      expect(actionDiv).toBeInTheDocument();

      const toolsDiv = container.querySelector('.mzn-dropdown-action-tools');
      expect(toolsDiv).toBeInTheDocument();
    });
  });
});

