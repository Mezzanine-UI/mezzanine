import { cleanup, render, fireEvent, act } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';

import Pagination from '.';
import PaginationJumper from './PaginationJumper';

const renderMockPaginationJumper = jest.fn();

jest.mock('./PaginationJumper', () => {
  return function MockPaginationJumper(props: any) {
    renderMockPaginationJumper(props);
    return <div>{props.children}</div>;
  };
});

describe('<Pagination />', () => {
  beforeEach(() => {
    renderMockPaginationJumper.mockClear();
  });

  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLElement, (ref) =>
    render(<Pagination ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Pagination className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Pagination />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-pagination')).toBeTruthy();
  });

  it('should pass props to Jumper: disabled,onChange,pageSize,total', () => {
    const handleChange = jest.fn();
    const hintText = 'Go To';
    const buttonText = 'Go';
    const inputPlaceholder = 'Page';

    render(
      <PaginationJumper
        disabled
        onChange={handleChange}
        pageSize={10}
        total={1}
        hintText={hintText}
        buttonText={buttonText}
        inputPlaceholder={inputPlaceholder}
      />,
    );

    expect(renderMockPaginationJumper).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
        onChange: handleChange,
        pageSize: 10,
        total: 1,
        hintText,
        buttonText,
        inputPlaceholder,
      }),
    );
  });

  it('fires onChange when a different page is clicked', () => {
    const onChange = jest.fn();
    const { getAllByRole } = render(
      <Pagination current={1} onChange={onChange} total={20} />,
    );

    const [, , page2] = getAllByRole('button');

    act(() => {
      fireEvent.click(page2);
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('renders correct amount of buttons', () => {
    const { getAllByRole, getAllByText } = render(
      <Pagination
        current={50}
        total={100}
        pageSize={1}
        siblingCount={2}
        boundaryCount={2}
      />,
    );

    const buttons = getAllByRole('button');
    const ellipsis = getAllByText('...');

    //  [previous, 1, 2, ..., 48, 49, 50, 51, 52, ..., 99, 100, next]
    expect(buttons[0].firstElementChild?.tagName).toBe('I');
    expect(buttons[1].textContent).toBe('1');
    expect(buttons[2].textContent).toBe('2');
    expect(buttons[3].textContent).toBe('48');
    expect(buttons[4].textContent).toBe('49');
    expect(buttons[5].textContent).toBe('50');
    expect(buttons[6].textContent).toBe('51');
    expect(buttons[7].textContent).toBe('52');
    expect(buttons[8].textContent).toBe('99');
    expect(buttons[9].textContent).toBe('100');
    expect(buttons[10].firstElementChild?.tagName).toBe('I');

    expect(ellipsis.length).toBe(2);
  });

  it('trigger correct event of buttons', () => {
    const onChange = jest.fn();
    const { getAllByRole } = render(
      <Pagination
        current={50}
        total={100}
        pageSize={1}
        siblingCount={2}
        boundaryCount={2}
        onChange={onChange}
      />,
    );

    //  [previous, 1, 2, ..., 48, 49, 50, 51, 52, ..., 99, 100, next]
    const buttons = getAllByRole('button');

    const previousButton = buttons[0];
    const pageButton = buttons[5];
    const nextButton = buttons[10];

    fireEvent.click(pageButton);
    expect(onChange.mock.calls[0][0]).toBe(50);

    fireEvent.click(previousButton);
    expect(onChange.mock.calls[1][0]).toBe(49);

    fireEvent.click(nextButton);
    expect(onChange.mock.calls[2][0]).toBe(51);
  });
  describe('prop: showJumper', () => {
    beforeEach(() => {
      renderMockPaginationJumper.mockClear();
    });

    it('should show jumper if showJumper={true}', () => {
      const { container } = render(<Pagination showJumper />);

      expect(container.querySelector('.mzn-pagination__jumper')).toBeInstanceOf(
        HTMLLIElement,
      );
    });

    it('should not show jumper if showJumper={false}', () => {
      render(<Pagination showJumper />);

      expect(renderMockPaginationJumper).toHaveBeenCalledTimes(1);
    });
  });
});
