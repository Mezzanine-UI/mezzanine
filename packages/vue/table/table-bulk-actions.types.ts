import type {
  TableBulkActions,
  TableRowSelectionCheckbox,
} from '@mezzanine-ui/core/table';

export interface TableBulkActionsProps {
  /** Bulk actions configuration */
  bulkActions: TableBulkActions;
  /** Whether to use fixed positioning */
  isFixed?: boolean;
  /** Array of selected row keys */
  selectedRowKeys: TableRowSelectionCheckbox['selectedRowKeys'];
}
