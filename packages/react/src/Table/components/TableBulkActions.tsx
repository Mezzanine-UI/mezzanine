import { cx } from '../../utils/cx';
import { tableClasses as classes } from '@mezzanine-ui/core/table';
import Button from '../../Button';
import { CloseIcon, DotHorizontalIcon, TrashIcon } from '@mezzanine-ui/icons';

interface TableBulkActionsProps {
  className?: string;
}

function TableBulkActions(props: TableBulkActionsProps) {
  const { className } = props;

  return (
    <div className={cx(classes.bulkActions, className)}>
      <div className={classes.bulkActionsSelectionSummary}>
        <Button
          size="sub"
          type="button"
          variant="inverse"
          icon={{
            position: 'trailing',
            src: CloseIcon,
          }}
          onClick={() => {}}
        >
          1 Item selected
        </Button>
      </div>
      <div className={classes.bulkActionsActionArea}>
        <Button
          size="sub"
          type="button"
          variant="inverse-ghost"
          icon={{
            position: 'leading',
            src: CloseIcon,
          }}
        >
          Action 1
        </Button>
        <Button
          size="sub"
          type="button"
          variant="inverse-ghost"
          icon={{
            position: 'leading',
            src: CloseIcon,
          }}
        >
          Action 2
        </Button>
        <Button
          size="sub"
          type="button"
          variant="inverse-ghost"
          icon={{
            position: 'leading',
            src: CloseIcon,
          }}
        >
          Action 3
        </Button>
        <div className={classes.bulkActionsSeparator} />
        <Button
          size="sub"
          type="button"
          variant="destructive-ghost"
          icon={{
            position: 'leading',
            src: TrashIcon,
          }}
        >
          Delete
        </Button>
        <div className={classes.bulkActionsSeparator} />
        <Button
          size="sub"
          type="button"
          variant="inverse-ghost"
          icon={{
            position: 'leading',
            src: DotHorizontalIcon,
          }}
        >
          More
        </Button>
      </div>
    </div>
  );
}

export default TableBulkActions;
