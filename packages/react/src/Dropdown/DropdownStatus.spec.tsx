import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DropdownStatus from './DropdownStatus';

describe('DropdownStatus', () => {
  describe('loading status', () => {
    it('should render loading status with default text', () => {
      render(<DropdownStatus status="loading" />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render loading status with custom text', () => {
      render(<DropdownStatus status="loading" loadingText="載入中..." />);
      expect(screen.getByText('載入中...')).toBeInTheDocument();
    });

    it('should render spinner icon for loading status', () => {
      const { container } = render(<DropdownStatus status="loading" />);
      const icon = container.querySelector('.mzn-icon');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('empty status', () => {
    it('should render empty status with default text', () => {
      render(<DropdownStatus status="empty" />);
      expect(screen.getByText('No matching options.')).toBeInTheDocument();
    });

    it('should render empty status with custom text', () => {
      render(<DropdownStatus status="empty" emptyText="沒有符合的選項" />);
      expect(screen.getByText('沒有符合的選項')).toBeInTheDocument();
    });

    it('should render default empty icon (FolderOpenIcon)', () => {
      const { container } = render(<DropdownStatus status="empty" />);
      const icon = container.querySelector('.mzn-icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render custom empty icon', () => {
      const { container } = render(
        <DropdownStatus 
          status="empty" 
          emptyIcon={require('@mezzanine-ui/icons').CloseIcon}
        />
      );
      const icon = container.querySelector('.mzn-icon');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('CSS classes', () => {
    it('should apply correct CSS classes', () => {
      const { container } = render(<DropdownStatus status="loading" />);
      const statusDiv = container.querySelector('.mzn-dropdown-status');
      const statusText = container.querySelector('.mzn-dropdown-status-text');
      
      expect(statusDiv).toBeInTheDocument();
      expect(statusText).toBeInTheDocument();
    });
  });
});

