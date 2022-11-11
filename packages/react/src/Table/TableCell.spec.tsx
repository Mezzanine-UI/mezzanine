import {
  act,
  cleanupHook,
  fireEvent,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import TableCell from './TableCell';

describe('<TableCell />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<TableCell ref={ref} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<TableCell />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-table__cell')).toBeTruthy();
  });

  it('should bypass all props to native div element', () => {
    const { getHostHTMLElement } = render(
      <TableCell
        id="foo"
        aria-disabled="true"
      />,
    );
    const element = getHostHTMLElement();

    expect(element.getAttribute('id')).toBe('foo');
    expect(element.getAttribute('aria-disabled')).toBe('true');
    expect(element.getAttribute('role')).toBe('gridcell');
  });

  describe('ellipsis: true', () => {
    let ellipsisElement: HTMLElement;

    const originalScrollWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollWidth') || { configurable: true, value: 0 };
    const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth') || { configurable: true, value: 0 };

    beforeEach(() => {
      const { getHostHTMLElement } = render(
        <TableCell ellipsis tooltipTitle="Foo Details">
          Foo
        </TableCell>,
      );
      const host = getHostHTMLElement();

      ellipsisElement = (host.querySelector('.mzn-table__cell__ellipsis') as HTMLElement);
    });

    afterAll(() => {
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', originalScrollWidth);
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
    });

    it('should tooltip hidden when content is not overflow', async () => {
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', { configurable: true, value: 50 });
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 100 });

      await act(async () => {
        fireEvent.mouseEnter(ellipsisElement);
      });

      const tooltip = document.querySelector('.mzn-tooltip');

      expect(tooltip).toBe(null);
    });

    it('should tooltip shown when content is overflow and mouse entering', async () => {
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', { configurable: true, value: 100 });
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 50 });

      await act(async () => {
        fireEvent.mouseEnter(ellipsisElement);
      });

      const tooltip = document.querySelector('.mzn-tooltip');

      expect(tooltip?.innerHTML).toBe('Foo Details');
    });
  });

  describe('ellipsis: false', () => {
    it('should render children directly', () => {
      const { getHostHTMLElement } = render(
        <TableCell ellipsis={false}>
          foo
        </TableCell>,
      );

      const element = getHostHTMLElement();

      expect(element.innerHTML).toBe('foo');
    });

    it('when forceShownTooltipWhenHovered=true, should not apply ellipsis', () => {
      const { getHostHTMLElement } = render(
        <TableCell ellipsis={false} forceShownTooltipWhenHovered>
          foo
        </TableCell>,
      );

      const element = getHostHTMLElement();

      expect(element.querySelector('.mzn-table__cell__ellipsis')).toBe(null);
    });
  });
});
