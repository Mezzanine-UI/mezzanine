import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen } from '../../../__test-utils__';
import TableBulkActions from './TableBulkActions';
import { TableDataContext } from '../TableContext';
import type { TableBulkActions as TableBulkActionsConfig } from '@mezzanine-ui/core/table';

interface TestDataType {
  key: string;
  name: string;
}

const testDataSource: TestDataType[] = [
  { key: '1', name: 'John' },
  { key: '2', name: 'Jane' },
  { key: '3', name: 'Bob' },
];

const defaultDataContextValue = {
  columns: [],
  dataSource: testDataSource,
  getRowKey: (record: TestDataType) => record.key,
};

const defaultBulkActions: TableBulkActionsConfig = {
  destructiveAction: undefined,
  mainActions: [{ label: 'Edit', onClick: jest.fn() }],
  overflowAction: undefined,
};

const renderWithContext = (
  bulkActions: TableBulkActionsConfig = defaultBulkActions,
  selectedRowKeys: string[] = ['1'],
  dataContextValue: any = defaultDataContextValue,
) => {
  const onClearSelection = jest.fn();

  return {
    onClearSelection,
    ...render(
      <TableDataContext.Provider value={dataContextValue as any}>
        <TableBulkActions
          bulkActions={bulkActions}
          onClearSelection={onClearSelection}
          selectedRowKeys={selectedRowKeys}
        />
      </TableDataContext.Provider>,
    ),
  };
};

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('<TableBulkActions />', () => {
  afterEach(cleanup);

  describe('Basic rendering', () => {
    it('should render bulk actions when items are selected', () => {
      const { getHostHTMLElement } = renderWithContext();
      const bulkActions = getHostHTMLElement();

      expect(bulkActions).toBeInTheDocument();
      expect(bulkActions.classList.contains('mzn-table__bulk-actions')).toBe(
        true,
      );
    });

    it('should not render when no items are selected', () => {
      const { container } = renderWithContext(defaultBulkActions, []);

      // Component returns null when no items are selected
      expect(container.querySelector('.mzn-table__bulk-actions')).toBeNull();
    });
  });

  describe('Selection summary', () => {
    it('should display selection count', () => {
      renderWithContext(defaultBulkActions, ['1']);

      expect(screen.getByText('1 item selected')).toBeInTheDocument();
    });

    it('should display plural form for multiple items', () => {
      renderWithContext(defaultBulkActions, ['1', '2', '3']);

      expect(screen.getByText('3 items selected')).toBeInTheDocument();
    });

    it('should use custom renderSelectionSummary when provided', () => {
      const customBulkActions: TableBulkActionsConfig = {
        ...defaultBulkActions,
        renderSelectionSummary: (count) => `Custom: ${count} selected`,
      };

      renderWithContext(customBulkActions, ['1', '2']);

      expect(screen.getByText('Custom: 2 selected')).toBeInTheDocument();
    });
  });

  describe('Clear selection', () => {
    it('should call onClearSelection when close button is clicked', () => {
      const { onClearSelection } = renderWithContext();

      const summaryButton = screen
        .getByText('1 item selected')
        .closest('button');

      fireEvent.click(summaryButton!);

      expect(onClearSelection).toHaveBeenCalled();
    });
  });

  describe('Main actions', () => {
    it('should render main action buttons', () => {
      const bulkActionsWithMultipleActions: TableBulkActionsConfig = {
        ...defaultBulkActions,
        mainActions: [
          { label: 'Edit', onClick: jest.fn() },
          { label: 'Copy', onClick: jest.fn() },
        ],
      };

      renderWithContext(bulkActionsWithMultipleActions);

      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });

    it('should call onClick when main action is clicked', () => {
      const onClick = jest.fn();
      const bulkActionsWithCallback: TableBulkActionsConfig = {
        ...defaultBulkActions,
        mainActions: [{ label: 'Edit', onClick }],
      };

      renderWithContext(bulkActionsWithCallback, ['1', '2']);

      fireEvent.click(screen.getByText('Edit'));

      expect(onClick).toHaveBeenCalledWith(
        ['1', '2'],
        expect.arrayContaining([
          expect.objectContaining({ key: '1' }),
          expect.objectContaining({ key: '2' }),
        ]),
      );
    });
  });

  describe('Destructive action', () => {
    it('should render destructive action when provided', () => {
      const bulkActionsWithDestructive: TableBulkActionsConfig = {
        ...defaultBulkActions,
        destructiveAction: { label: 'Delete', onClick: jest.fn() },
      };

      renderWithContext(bulkActionsWithDestructive);

      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('should call onClick when destructive action is clicked', () => {
      const onClick = jest.fn();
      const bulkActionsWithDestructive: TableBulkActionsConfig = {
        ...defaultBulkActions,
        destructiveAction: { label: 'Delete', onClick },
      };

      renderWithContext(bulkActionsWithDestructive, ['1']);

      fireEvent.click(screen.getByText('Delete'));

      expect(onClick).toHaveBeenCalledWith(
        ['1'],
        expect.arrayContaining([expect.objectContaining({ key: '1' })]),
      );
    });

    it('should render separator before destructive action', () => {
      const bulkActionsWithDestructive: TableBulkActionsConfig = {
        ...defaultBulkActions,
        destructiveAction: { label: 'Delete', onClick: jest.fn() },
      };

      const { getHostHTMLElement } = renderWithContext(
        bulkActionsWithDestructive,
      );
      const separator = getHostHTMLElement().querySelector(
        '.mzn-table__bulk-actions__separator',
      );

      expect(separator).toBeInTheDocument();
    });
  });

  describe('Fixed positioning', () => {
    it('should apply fixed class when isFixed is true', () => {
      const { getHostHTMLElement } = render(
        <TableDataContext.Provider value={defaultDataContextValue as any}>
          <TableBulkActions
            bulkActions={defaultBulkActions}
            isFixed
            onClearSelection={jest.fn()}
            selectedRowKeys={['1']}
          />
        </TableDataContext.Provider>,
      );

      const bulkActions = getHostHTMLElement();

      expect(
        bulkActions.classList.contains('mzn-table__bulk-actions--fixed'),
      ).toBe(true);
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { getHostHTMLElement } = render(
        <TableDataContext.Provider value={defaultDataContextValue as any}>
          <TableBulkActions
            bulkActions={defaultBulkActions}
            className="custom-bulk-actions"
            onClearSelection={jest.fn()}
            selectedRowKeys={['1']}
          />
        </TableDataContext.Provider>,
      );

      const bulkActions = getHostHTMLElement();

      expect(bulkActions.classList.contains('custom-bulk-actions')).toBe(true);
    });
  });
});
