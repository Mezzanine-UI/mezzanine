import { TableColumn } from '@mezzanine-ui/core/table';
import Dropdown from '../../Dropdown';
import Icon from '../../Icon';
import { DotVerticalIcon } from '@mezzanine-ui/icons';
import { useState } from 'react';
import { tableClasses as classes } from '@mezzanine-ui/core/table';

interface TableColumnTitleMenuProps {
  column: TableColumn;
}

function TableColumnTitleMenu(props: TableColumnTitleMenuProps) {
  const { column } = props;

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  if (!column.titleMenu) return null;

  const { maxHeight, onSelect, options, placement } = column.titleMenu;

  return (
    <Dropdown
      open={isMenuOpen}
      maxHeight={maxHeight}
      onSelect={(opt) => {
        onSelect?.(opt);
        setIsMenuOpen(false);
      }}
      onVisibilityChange={(open) => setIsMenuOpen(open)}
      options={options}
      placement={placement}
      zIndex="var(--mzn-table-title-menu-z-index)"
    >
      <Icon
        className={classes.headerCellIcon}
        icon={DotVerticalIcon}
        size={16}
        onClick={() => setIsMenuOpen((prev) => !prev)}
      />
    </Dropdown>
  );
}

export default TableColumnTitleMenu;
