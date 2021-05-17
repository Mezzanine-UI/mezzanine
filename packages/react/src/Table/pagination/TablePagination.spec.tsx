import { createRef } from 'react';
import {
  cleanupHook,
  render,
  fireEvent,
  act,
  TestRenderer,
} from '../../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../../__test-utils__/common';
import { TableContext, TableDataContext } from '../TableContext';
import TablePagination from './TablePagination';
import Pagination from '../../Pagination';

const defaultPaginationContext = {
  show: true,
  current: 1,
  onChange: () => {},
  total: 100,
  options: {
    boundaryCount: 1,
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

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(
      <TablePagination ref={ref} bodyRef={bodyRef} />,
    ),
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
              <TableDataContext.Provider
                value={defaultDataContext}
              >
                <TablePagination bodyRef={bodyRef} />
              </TableDataContext.Provider>
            </TableContext.Provider>,
          );

          element = getHostHTMLElement();
        });

        it('should apply changes when select on different page number', async () => {
          const buttonList = [...element.querySelectorAll('.mzn-pagination-item__button')];
          const page2Btn = buttonList.find((dom) => dom.innerHTML === '2');

          await act(async () => {
            fireEvent.click(page2Btn!);
          });

          expect(current).toBe(2);
        });

        it('should not apply changes when click on same page number', async () => {
          const buttonList = [...element.querySelectorAll('.mzn-pagination-item__button')];
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
              <TableDataContext.Provider
                value={defaultDataContext}
              >
                <TablePagination bodyRef={bodyRef} />
              </TableDataContext.Provider>
            </TableContext.Provider>,
          );

          element = getHostHTMLElement();
        });

        it('should apply changes when select on different page number', async () => {
          const buttonList = [...element.querySelectorAll('.mzn-pagination-item__button')];
          const page2Btn = buttonList.find((dom) => dom.innerHTML === '2');

          await act(async () => {
            fireEvent.click(page2Btn!);
          });

          expect(sortingReset).toBe(true);
        });

        it('should not apply changes when click on same page number', async () => {
          const buttonList = [...element.querySelectorAll('.mzn-pagination-item__button')];
          const page1Btn = buttonList.find((dom) => dom.innerHTML === '1');

          await act(async () => {
            fireEvent.click(page1Btn!);
          });

          expect(sortingReset).toBe(false);
        });
      });
    });

    describe('uncontrolled', () => {
      let element: HTMLDivElement;

      beforeEach(() => {
        const { getHostHTMLElement } = render(
          <TableContext.Provider
            value={{
              pagination: {
                show: defaultPaginationContext.show,
                total: defaultPaginationContext.total,
              },
            }}
          >
            <TableDataContext.Provider
              value={defaultDataContext}
            >
              <TablePagination bodyRef={bodyRef} />
            </TableDataContext.Provider>
          </TableContext.Provider>,
        );

        element = getHostHTMLElement();
      });

      it('should page clicked still worked', async () => {
        const buttonList = [...element.querySelectorAll('.mzn-pagination-item__button')];
        const page1Btn = buttonList.find((dom) => dom.innerHTML === '1');
        const page2Btn = buttonList.find((dom) => dom.innerHTML === '2');

        expect(page1Btn?.getAttribute('aria-current')).toBe('true');

        await act(async () => {
          fireEvent.click(page2Btn!);
        });

        expect(page2Btn?.getAttribute('aria-current')).toBe('true');
      });
    });

    describe('options mapping', () => {
      it('default options', () => {
        const testInstance = TestRenderer.create(
          <TableContext.Provider
            value={{
              pagination: {},
            }}
          >
            <TableDataContext.Provider
              value={defaultDataContext}
            >
              <TablePagination bodyRef={bodyRef} />
            </TableDataContext.Provider>
          </TableContext.Provider>,
        );

        const paginationInstance = testInstance.root.findByType(Pagination);

        expect(paginationInstance.props.boundaryCount).toBe(1);
        expect(paginationInstance.props.className).toBe(undefined);
        expect(paginationInstance.props.disabled).toBe(false);
        expect(paginationInstance.props.hideNextButton).toBe(false);
        expect(paginationInstance.props.hidePreviousButton).toBe(false);
        expect(paginationInstance.props.pageSize).toBe(dataLength);
        expect(paginationInstance.props.siblingCount).toBe(1);
        expect(paginationInstance.props.total).toBe(1);
      });

      it('given options', () => {
        const testInstance = TestRenderer.create(
          <TableContext.Provider
            value={{
              pagination: {
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
            <TableDataContext.Provider
              value={defaultDataContext}
            >
              <TablePagination bodyRef={bodyRef} />
            </TableDataContext.Provider>
          </TableContext.Provider>,
        );

        const paginationInstance = testInstance.root.findByType(Pagination);

        expect(paginationInstance.props.boundaryCount).toBe(2);
        expect(paginationInstance.props.className).toBe('foo');
        expect(paginationInstance.props.disabled).toBe(true);
        expect(paginationInstance.props.hideNextButton).toBe(true);
        expect(paginationInstance.props.hidePreviousButton).toBe(true);
        expect(paginationInstance.props.pageSize).toBe(2);
        expect(paginationInstance.props.siblingCount).toBe(2);
        expect(paginationInstance.props.total).toBe(100);
      });

      it('total should be (source.length / pageSize) when is not given', () => {
        const pageSize = 2;

        const testInstance = TestRenderer.create(
          <TableContext.Provider
            value={{
              pagination: {
                options: {
                  pageSize,
                },
              },
            }}
          >
            <TableDataContext.Provider
              value={defaultDataContext}
            >
              <TablePagination bodyRef={bodyRef} />
            </TableDataContext.Provider>
          </TableContext.Provider>,
        );

        const paginationInstance = testInstance.root.findByType(Pagination);

        expect(paginationInstance.props.total).toBe(dataLength / pageSize);
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
          <TableDataContext.Provider
            value={defaultDataContext}
          >
            <div ref={scrollBodyRef}>
              <TablePagination bodyRef={scrollBodyRef} />
            </div>
          </TableDataContext.Provider>
        </TableContext.Provider>,
      );

      const body = getHostHTMLElement();

      body.scrollTo = jest.fn();

      const buttonList = [...body.querySelectorAll('.mzn-pagination-item__button')];
      const page2Btn = buttonList.find((dom) => dom.innerHTML === '2');

      await act(async () => {
        fireEvent.click(page2Btn!);
      });

      expect(body.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });
});
