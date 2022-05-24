import {
  forwardRef,
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
  MouseEvent,
} from 'react';
import {
  tableClasses as classes,
  TableRowAction,
} from '@mezzanine-ui/core/table';
import { MoreVerticalIcon } from '@mezzanine-ui/icons';
import { TableContext, TableDataContext, RowSelectionContext } from '../TableContext';
import { NativeElementPropsWithoutKeyAndRef } from '../../utils/jsx-types';
import { cx } from '../../utils/cx';
import { SELECTED_ALL_KEY } from './useTableRowSelection';
import Checkbox from '../../Checkbox';
import Icon from '../../Icon';
import Dropdown from '../../Dropdown';
import Menu, { MenuItem } from '../../Menu';

export interface TableRowSelectionProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * row key to control checkbox
   */
  rowKey: string;
  /**
   * show dropdown icon or not
   * @default false
   */
  showDropdownIcon?: boolean;
  /**
   * function to get check status
   */
  setChecked?(c: boolean): void;
}

const TableRowSelection = forwardRef<HTMLDivElement, TableRowSelectionProps>(
  function TableRowSelection(props, ref) {
    const {
      rowKey,
      setChecked,
      showDropdownIcon,
      ...rest
    } = props;

    const {
      rowSelection,
      expanding,
    } = useContext(TableContext) || {};

    const {
      dataSource = [],
    } = useContext(TableDataContext) || {};

    /** checkbox methods/state */
    const onSelected = useCallback(() => {
      rowSelection?.onChange(rowKey);
    }, [rowSelection, rowKey]);

    const checkboxStatus = useMemo(() => {
      const selectedRowKeys = rowSelection?.selectedRowKeys ?? [];

      if (!selectedRowKeys.length) return 'none';
      if (selectedRowKeys.length === dataSource.length) return 'all';

      return 'indeterminate';
    }, [rowSelection?.selectedRowKeys, dataSource.length]);

    const selfChecked = useMemo(() => (
      (rowSelection?.selectedRowKeys ?? []).some((key) => key === rowKey)
    ), [rowSelection?.selectedRowKeys, rowKey]);

    /** checkbox props */
    const isHeaderCheckbox = rowKey === SELECTED_ALL_KEY;
    const checked = isHeaderCheckbox ? checkboxStatus === 'all' : selfChecked;
    const indeterminate = isHeaderCheckbox ? checkboxStatus === 'indeterminate' : false;
    const name = isHeaderCheckbox ? '選擇全部' : '選擇';

    /** parent callbacks */
    useEffect(() => {
      setChecked?.(checked);
    }, [checked, setChecked]);

    /** If expandable icon existed, it will affect row selection styling (only when dropdown icon is hidden) */
    const hiddenIconWithExpandableStyle = useMemo(() => {
      if (!expanding || showDropdownIcon) return {};

      return {
        host: {
          paddingRight: 0,
        },
        icon: {
          width: 0,
        },
      };
    }, [showDropdownIcon, expanding]);

    /** menu */
    const [open, toggleOpen] = useState<boolean>(false);
    const isMenuAllowOpen = checked || indeterminate;
    const onIconClicked = useCallback((evt: MouseEvent<HTMLElement>) => {
      evt.stopPropagation();

      if (isMenuAllowOpen) toggleOpen((prev) => !prev);
    }, [isMenuAllowOpen]);

    const onMenuItemClicked = (evt: MouseEvent, action: TableRowAction) => {
      evt.stopPropagation();

      action.onClick?.((rowSelection as RowSelectionContext).selectedRowKeys);

      toggleOpen(false);
    };

    const actionMenu = (
      <Menu size="medium">
        {(rowSelection?.actions ?? []).map(((action) => (
          <MenuItem
            key={action.key}
            className={action.className}
            onClick={(evt) => onMenuItemClicked(evt, action)}
          >
            {action.text}
          </MenuItem>
        )))}
      </Menu>
    );

    return (
      <div
        ref={ref}
        {...rest}
        className={classes.selections}
        style={hiddenIconWithExpandableStyle.host}
      >
        <Checkbox
          checked={checked}
          disabled={false}
          indeterminate={indeterminate}
          inputProps={{
            name,
          }}
          onChange={onSelected}
          size="medium"
        />
        <div
          className={classes.icon}
          style={hiddenIconWithExpandableStyle.icon}
        >
          {showDropdownIcon ? (
            <Dropdown
              menu={actionMenu}
              onClose={() => toggleOpen(false)}
              popperProps={{
                open,
                options: {
                  placement: 'bottom-start',
                },
              }}
            >
              {(dropdownRef) => (
                <Icon
                  ref={dropdownRef}
                  className={cx(
                    classes.icon,
                    {
                      [classes.iconClickable]: isMenuAllowOpen,
                    },
                  )}
                  color={isMenuAllowOpen ? 'primary' : 'disabled'}
                  icon={MoreVerticalIcon}
                  onClick={onIconClicked}
                />
              )}
            </Dropdown>
          ) : null}
        </div>
      </div>
    );
  },
);

export default TableRowSelection;
