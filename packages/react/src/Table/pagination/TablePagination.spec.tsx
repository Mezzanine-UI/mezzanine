import { createRef } from 'react';
import { cleanupHook, render, fireEvent, act } from '../../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../../__test-utils__/common';
import { TableContext, TableDataContext } from '../TableContext';
import TablePagination from './TablePagination';
import Pagination from '../../Pagination';

const mockPaginationRender = jest.fn();
const OriginalPagination = jest.requireActual('../../Pagination').default;

jest.mock('../../Pagination', () => {
  return function MockPagination(props: any) {
    mockPaginationRender(props);
    const React = require('react');
    return React.createElement(OriginalPagination, props);
  };
});

const defaultPaginationContext = {
  current: 1,
  onChange: () => {},
  total: 100,
  options: {
    boundaryCount: 1,
    disabled: false,
    hideNextButton: false,
    hidePreviousButton: false,
    pageSize: 1,
    siblingCount: 1,
  },
};
const dataLength = 10;
const defaultDataContext = {
  columns: [],
  dataSource: Array.from(Array(dataLength)).map((_, idx) => ({
    key: `source-${idx + 1}`,
  })),
};

describe('<TablePagination />', () => {
  const bodyRef = createRef<HTMLDivElement>();

  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<TablePagination ref={ref} bodyRef={bodyRef} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <TablePagination bodyRef={bodyRef} />,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-table__pagination')).toBeTruthy();
  });

  describe('feature enabled', () => {
    describe('controlled', () => {
      describe('use along', () => {
        let element: HTMLDivElement;
        let current: number;

        const onChange = jest.fn<void, [number]>((page) => {
          current = page;
        });

        beforeEach(() => {
          current = 1;

          const { getHostHTMLElement } = render(
            <TableContext.Provider
              value={{
                pagination: {
                  ...defaultPaginationContext,
                  current,
                  onChange,
                },
              }}
            >
              <TableDataContext.Provider value={defaultDataContext}>
                <TablePagination bodyRef={bodyRef} />
              </TableDataContext.Provider>
            </TableContext.Provider>,
          );

          element = getHostHTMLElement();
        });

        it('should apply changes when select on different page number', async () => {
          const buttonList = [
            ...element.querySelectorAll('.mzn-pagination-item__button'),
          ];
          const page2Btn = buttonList.find((dom) => dom.innerHTML === '2');

          await act(async () => {
            fireEvent.click(page2Btn!);
          });

          expect(current).toBe(2);
        });

        it('should not apply changes when click on same page number', async () => {
          const buttonList = [
            ...element.querySelectorAll('.mzn-pagination-item__button'),
          ];
          const page1Btn = buttonList.find((dom) => dom.innerHTML === '1');

          await act(async () => {
            fireEvent.click(page1Btn!);
          });

          expect(current).toBe(1);
        });
      });

      describe('integrate with sorting', () => {
        let element: HTMLDivElement;
        let current: number;
        let sortingReset: boolean;

        const onChange = jest.fn<void, [number]>((page) => {
          current = page;
        });

        const onResetAll = jest.fn<void, []>(() => {
          sortingReset = true;
        });

        beforeEach(() => {
          current = 1;
          sortingReset = false;

          const { getHostHTMLElement } = render(
            <TableContext.Provider
              value={{
                pagination: {
                  ...defaultPaginationContext,
                  current,
                  onChange,
                },
                sorting: {
                  sortedOn: '',
                  sortedType: '',
                  onSort: () => {},
                  onResetAll,
                },
              }}
            >
              <TableDataContext.Provider value={defaultDataContext}>
                <TablePagination bodyRef={bodyRef} />
              </TableDataContext.Provider>
            </TableContext.Provider>,
          );

          element = getHostHTMLElement();
        });

        it('should apply changes when select on different page number', async () => {
          const buttonList = [
            ...element.querySelectorAll('.mzn-pagination-item__button'),
          ];
          const page2Btn = buttonList.find((dom) => dom.innerHTML === '2');

          await act(async () => {
            fireEvent.click(page2Btn!);
          });

          expect(sortingReset).toBe(true);
        });

        it('should not apply changes when click on same page number', async () => {
          const buttonList = [
            ...element.querySelectorAll('.mzn-pagination-item__button'),
          ];
          const page1Btn = buttonList.find((dom) => dom.innerHTML === '1');

          await act(async () => {
            fireEvent.click(page1Btn!);
          });

          expect(sortingReset).toBe(false);
        });
      });
    });

    describe('options mapping', () => {
      it('given options', () => {
        mockPaginationRender.mockClear();
        render(
          <TableContext.Provider
            value={{
              pagination: {
                current: defaultPaginationContext.current,
                onChange: defaultPaginationContext.onChange,
                total: 100,
                options: {
                  boundaryCount: 2,
                  className: 'foo',
                  disabled: true,
                  hideNextButton: true,
                  hidePreviousButton: true,
                  pageSize: 2,
                  siblingCount: 2,
                },
              },
            }}
          >
            <TableDataContext.Provider value={defaultDataContext}>
              <TablePagination bodyRef={bodyRef} />
            </TableDataContext.Provider>
          </TableContext.Provider>,
        );

        const calls = mockPaginationRender.mock.calls;
        const lastCallProps = calls[calls.length - 1][0];

        expect(lastCallProps.boundaryCount).toBe(2);
        expect(lastCallProps.className).toBe('foo');
        expect(lastCallProps.disabled).toBe(true);
        expect(lastCallProps.hideNextButton).toBe(true);
        expect(lastCallProps.hidePreviousButton).toBe(true);
        expect(lastCallProps.pageSize).toBe(2);
        expect(lastCallProps.siblingCount).toBe(2);
        expect(lastCallProps.total).toBe(100);
      });
    });

    it('should scroll to the top when page changed', async () => {
      const scrollBodyRef = createRef<HTMLDivElement>();

      const { getHostHTMLElement } = render(
        <TableContext.Provider
          value={{
            pagination: defaultPaginationContext,
          }}
        >
          <TableDataContext.Provider value={defaultDataContext}>
            <div ref={scrollBodyRef}>
              <TablePagination bodyRef={scrollBodyRef} />
            </div>
          </TableDataContext.Provider>
        </TableContext.Provider>,
      );

      const body = getHostHTMLElement();

      body.scrollTo = jest.fn();

      const buttonList = [
        ...body.querySelectorAll('.mzn-pagination-item__button'),
      ];
      const page2Btn = buttonList.find((dom) => dom.innerHTML === '2');

      await act(async () => {
        fireEvent.click(page2Btn!);
      });

      expect(body.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });
});
