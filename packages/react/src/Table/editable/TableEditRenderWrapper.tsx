import { useContext } from 'react';
import {
  TableColumnBase,
  TableDataSource,
  TableRecord,
} from '@mezzanine-ui/core/table';
import { TableComponentContext } from '../TableContext';
import { NativeElementPropsWithoutKeyAndRef } from '../../utils/jsx-types';

export interface EditableBodyCellProps
  extends NativeElementPropsWithoutKeyAndRef<'div'>,
    TableColumnBase<TableRecord<unknown>> {
  rowData: TableDataSource;
}

function TableEditRenderWrapper({
  children,
  dataIndex,
  editable,
  rowData,
  setCellProps,
  ...rest
}: EditableBodyCellProps) {
  const { bodyCell: BodyCell } = useContext(TableComponentContext) || {};

  const customProps = setCellProps?.(rowData) ?? {};

  if (typeof BodyCell === 'function') {
    return (
      <BodyCell
        {...customProps}
        {...rest}
        dataIndex={dataIndex}
        editable={editable}
        rowData={rowData}
      >
        {children}
      </BodyCell>
    );
  }

  return <>{children}</>;
}

export default TableEditRenderWrapper;
