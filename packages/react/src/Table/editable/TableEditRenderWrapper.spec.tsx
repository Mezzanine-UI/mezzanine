import { FC, ReactElement } from 'react';
import {
  cleanupHook,
  render,
} from '../../../__test-utils__';
import { TableComponentContext } from '../TableContext';
import TableEditRenderWrapper, { EditableBodyCellProps } from './TableEditRenderWrapper';

const defaultDataIndex = 'foo-index';
const childContent = 'foo';
const defaultRowData = {
  key: 'foo',
};

describe('<TableEditRenderWrapper />', () => {
  afterEach(cleanupHook);

  let host: HTMLElement;
  let receivedRowData: EditableBodyCellProps['rowData'];

  const setCellProps = jest.fn<Record<string, unknown>, [EditableBodyCellProps['rowData']]>((data) => {
    receivedRowData = data;

    return data;
  });

  beforeEach(() => {
    const EditableCell: FC<EditableBodyCellProps> = ({
      children,
      dataIndex,
    }) => (
      <div>
        {dataIndex}
        {children}
      </div>
    ) as ReactElement;

    const { getHostHTMLElement } = render(
      <TableComponentContext.Provider
        value={{
          bodyCell: EditableCell,
        }}
      >
        <TableEditRenderWrapper
          dataIndex={defaultDataIndex}
          rowData={defaultRowData}
          setCellProps={setCellProps}
        >
          {childContent}
        </TableEditRenderWrapper>
      </TableComponentContext.Provider>,
    );

    host = getHostHTMLElement();
  });

  it('should render custom cell when bodyCell given', () => {
    expect(host?.textContent).toBe(`${defaultDataIndex}${childContent}`);
  });

  it('should setCellProps been called', () => {
    expect(receivedRowData?.key).toBe(defaultRowData.key);
  });
});
