import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen } from '../../../__test-utils__';
import TableColumnTitleMenu from './TableColumnTitleMenu';

const defaultColumn: any = {
  key: 'name',
  dataIndex: 'name',
  title: 'Name',
} as any;

const columnWithMenu: any = {
  key: 'name',
  dataIndex: 'name',
  title: 'Name',
  titleMenu: {
    options: [
      { id: 'option1', name: 'Option 1' },
      { id: 'option2', name: 'Option 2' },
    ],
    onSelect: jest.fn(),
  },
} as any;

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('<TableColumnTitleMenu />', () => {
  afterEach(cleanup);

  describe('Basic rendering', () => {
    it('should not render when column has no titleMenu', () => {
      const { container } = render(
        <TableColumnTitleMenu column={defaultColumn as any} />,
      );

      // Component returns null when column has no titleMenu
      expect(
        container.querySelector('.mzn-table__header__cell-icon'),
      ).toBeNull();
    });

    it('should render menu icon when column has titleMenu', () => {
      const { container } = render(
        <TableColumnTitleMenu column={columnWithMenu as any} />,
      );

      const icon = container.querySelector('.mzn-table__header__cell-icon');

      expect(icon).toBeInTheDocument();
    });
  });

  describe('Menu interaction', () => {
    it('should open menu when icon is clicked', () => {
      render(<TableColumnTitleMenu column={columnWithMenu as any} />);

      const icon = document.querySelector('.mzn-table__header__cell-icon');

      fireEvent.click(icon!);

      // Menu should be open and options should be visible
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should call onSelect when option is selected', async () => {
      const onSelect = jest.fn();
      const columnWithCallback: any = {
        ...columnWithMenu,
        titleMenu: {
          ...columnWithMenu.titleMenu!,
          onSelect,
        },
      };

      render(<TableColumnTitleMenu column={columnWithCallback as any} />);

      const icon = document.querySelector('.mzn-table__header__cell-icon');

      fireEvent.click(icon!);

      const option = screen.getByText('Option 1');

      fireEvent.click(option);

      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'option1', name: 'Option 1' }),
      );
    });
  });

  describe('Menu configuration', () => {
    it('should pass maxHeight to dropdown', () => {
      const columnWithMaxHeight: any = {
        ...columnWithMenu,
        titleMenu: {
          ...columnWithMenu.titleMenu!,
          maxHeight: 200,
        },
      };

      const { getHostHTMLElement } = render(
        <TableColumnTitleMenu column={columnWithMaxHeight as any} />,
      );

      expect(getHostHTMLElement()).toBeInTheDocument();
    });

    it('should pass placement to dropdown', () => {
      const columnWithPlacement: any = {
        ...columnWithMenu,
        titleMenu: {
          ...columnWithMenu.titleMenu!,
          placement: 'bottom-start',
        },
      };

      const { getHostHTMLElement } = render(
        <TableColumnTitleMenu column={columnWithPlacement as any} />,
      );

      expect(getHostHTMLElement()).toBeInTheDocument();
    });
  });
});
