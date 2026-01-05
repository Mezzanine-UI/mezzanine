import {
  tableClasses as classes,
  TableRowSelectionCheckbox,
  type TableBulkActions as TableBulkActionsConfig,
} from '@mezzanine-ui/core/table';
import { CloseIcon } from '@mezzanine-ui/icons';
import Button from '../../Button';
import Dropdown from '../../Dropdown';
import { cx } from '../../utils/cx';
import { useTableContext } from '../TableContext';

export interface TableBulkActionsProps {
  /** Bulk actions configuration */
  bulkActions: TableBulkActionsConfig;
  /** Custom class name */
  className?: string;
  /** Callback to clear all selections */
  onClearSelection: VoidFunction;
  /** Array of selected row keys */
  selectedRowKeys: TableRowSelectionCheckbox['selectedRowKeys'];
}

function TableBulkActions(props: TableBulkActionsProps) {
  const { bulkActions, className, onClearSelection, selectedRowKeys } = props;

  const { pagination } = useTableContext();

  const {
    destructiveAction,
    mainActions,
    overflowAction,
    renderSelectionSummary,
  } = bulkActions;

  if (!selectedRowKeys.length) {
    return null;
  }

  const label = renderSelectionSummary
    ? renderSelectionSummary(selectedRowKeys.length)
    : `${selectedRowKeys.length} item${selectedRowKeys.length > 1 ? 's' : ''} selected`;

  return (
    <div
      className={cx(
        classes.bulkActions,
        {
          [classes.bulkActionsWithPagination]: !!pagination,
        },
        className,
      )}
    >
      <div className={classes.bulkActionsSelectionSummary}>
        <Button
          icon={{
            position: 'trailing',
            src: CloseIcon,
          }}
          onClick={onClearSelection}
          size="sub"
          type="button"
          variant="inverse"
        >
          {label}
        </Button>
      </div>
      <div className={classes.bulkActionsActionArea}>
        {/* Main Actions */}
        {mainActions.map((action, index) => (
          <Button
            icon={
              action.icon
                ? {
                    position: 'leading',
                    src: action.icon,
                  }
                : undefined
            }
            key={`main-action-${index}`}
            onClick={() => action.onClick(selectedRowKeys)}
            size="sub"
            type="button"
            variant="inverse-ghost"
          >
            {action.label}
          </Button>
        ))}

        {/* Destructive Action */}
        {destructiveAction && (
          <>
            <div className={classes.bulkActionsSeparator} />
            <Button
              icon={
                destructiveAction.icon
                  ? {
                      position: 'leading',
                      src: destructiveAction.icon,
                    }
                  : undefined
              }
              onClick={() => destructiveAction.onClick(selectedRowKeys)}
              size="sub"
              type="button"
              variant="destructive-ghost"
            >
              {destructiveAction.label}
            </Button>
          </>
        )}

        {/* Overflow Action */}
        {overflowAction && (
          <>
            <div className={classes.bulkActionsSeparator} />
            <Dropdown
              maxHeight={overflowAction.maxHeight}
              onSelect={(option) =>
                overflowAction.onSelect(option, selectedRowKeys)
              }
              options={overflowAction.options}
              placement={overflowAction.placement ?? 'top'}
            >
              <Button
                size="sub"
                type="button"
                variant="inverse-ghost"
                icon={
                  overflowAction.icon
                    ? {
                        position: 'leading',
                        src: overflowAction.icon,
                      }
                    : undefined
                }
              >
                {overflowAction.label}
              </Button>
            </Dropdown>
          </>
        )}
      </div>
    </div>
  );
}

export default TableBulkActions;
