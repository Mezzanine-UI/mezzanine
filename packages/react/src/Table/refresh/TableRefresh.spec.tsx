import { MouseEvent } from 'react';
import {
  act,
  cleanupHook,
  fireEvent,
  render,
} from '../../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../../__test-utils__/common';
import TableRefresh, { TableRefreshProps } from './TableRefresh';
import { TableContext } from '../TableContext';

describe('<TableRefresh />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<TableRefresh ref={ref} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<TableRefresh />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-table__refresh')).toBeTruthy();
  });

  describe('integrate with TableContext', () => {
    it('should setLoading set `loading` to true when button clicked', async () => {
      let loading = false;

      const setLoading = jest.fn<void, [boolean]>((value) => {
        loading = value;
      });

      const { getHostHTMLElement } = render(
        <TableContext.Provider
          value={{
            setLoading,
          }}
        >
          <TableRefresh />
        </TableContext.Provider>,
      );
      const element = getHostHTMLElement();
      const buttonEle = element.getElementsByClassName('mzn-button');

      await act(async () => {
        fireEvent.click(buttonEle[0]);
      });

      expect(loading).toBe(true);
    });
  });

  describe('use it along', () => {
    it('should `onClick` prop been called when given', async () => {
      let loading = false;

      const setLoading: TableRefreshProps['onClick'] = jest.fn<void, [MouseEvent]>(() => {
        loading = true;
      });

      const { getHostHTMLElement } = render(
        <TableRefresh onClick={setLoading} />,
      );
      const element = getHostHTMLElement();
      const buttonEle = element.getElementsByClassName('mzn-button');

      await act(async () => {
        fireEvent.click(buttonEle[0]);
      });

      expect(loading).toBe(true);
    });
  });
});
