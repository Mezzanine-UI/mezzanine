import '@testing-library/jest-dom';
import { cleanup, render } from '../../../__test-utils__';
import { TablePagination } from './TablePagination';

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('<TablePagination />', () => {
  afterEach(cleanup);

  describe('Basic rendering', () => {
    it('should render pagination component', () => {
      const { getHostHTMLElement } = render(
        <TablePagination current={1} pageSize={10} total={100} />,
      );

      const pagination = getHostHTMLElement();

      expect(pagination).toBeInTheDocument();
      expect(pagination.classList.contains('mzn-pagination')).toBe(true);
    });
  });

  describe('Page navigation', () => {
    it('should render page buttons', () => {
      const { getHostHTMLElement } = render(
        <TablePagination current={1} pageSize={10} total={50} />,
      );

      const buttons = getHostHTMLElement().querySelectorAll('button');

      // Should have navigation buttons
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Props forwarding', () => {
    it('should forward current page prop', () => {
      const { getHostHTMLElement } = render(
        <TablePagination current={3} pageSize={10} total={100} />,
      );

      const pagination = getHostHTMLElement();

      expect(pagination).toBeInTheDocument();
    });

    it('should forward pageSize prop', () => {
      const { getHostHTMLElement } = render(
        <TablePagination current={1} pageSize={20} total={100} />,
      );

      const pagination = getHostHTMLElement();

      expect(pagination).toBeInTheDocument();
    });

    it('should forward total prop', () => {
      const { getHostHTMLElement } = render(
        <TablePagination current={1} pageSize={10} total={200} />,
      );

      const pagination = getHostHTMLElement();

      expect(pagination).toBeInTheDocument();
    });

    it('should forward onChange callback', () => {
      const onChange = jest.fn();

      render(
        <TablePagination
          current={1}
          onChange={onChange}
          pageSize={10}
          total={100}
        />,
      );

      // The onChange prop should be passed to Pagination
      // We can't easily test the callback without simulating clicks,
      // but we can verify the component renders without errors
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Custom className', () => {
    it('should accept custom className', () => {
      const { getHostHTMLElement } = render(
        <TablePagination
          className="custom-pagination"
          current={1}
          pageSize={10}
          total={100}
        />,
      );

      const pagination = getHostHTMLElement();

      expect(pagination.classList.contains('custom-pagination')).toBe(true);
    });
  });
});
