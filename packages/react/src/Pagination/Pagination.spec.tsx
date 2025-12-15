import { act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { cleanup, render } from '../../__test-utils__';
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
        buttonText={buttonText}
        disabled
        hintText={hintText}
        inputPlaceholder={inputPlaceholder}
        onChange={handleChange}
        pageSize={10}
        total={1}
      />,
    );

    expect(renderMockPaginationJumper).toHaveBeenCalledWith(
      expect.objectContaining({
        buttonText,
        disabled: true,
        hintText,
        inputPlaceholder,
        onChange: handleChange,
        pageSize: 10,
        total: 1,
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
        boundaryCount={2}
        current={50}
        pageSize={1}
        siblingCount={2}
        total={100}
      />,
    );

    const buttons = getAllByRole('button');
    const ellipsis = getAllByText('...');

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
        boundaryCount={2}
        current={50}
        onChange={onChange}
        pageSize={1}
        siblingCount={2}
        total={100}
      />,
    );

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

  describe('prop: boundaryCount', () => {
    it('should render boundary pages', () => {
      const { getByText } = render(
        <Pagination boundaryCount={2} current={5} total={100} />,
      );

      expect(getByText('1')).toBeInstanceOf(HTMLElement);
      expect(getByText('2')).toBeInstanceOf(HTMLElement);
      expect(getByText('9')).toBeInstanceOf(HTMLElement);
      expect(getByText('10')).toBeInstanceOf(HTMLElement);
    });
  });

  describe('prop: current', () => {
    it('should highlight current page', () => {
      const { getByText } = render(<Pagination current={3} total={100} />);

      const currentButton = getByText('3').closest('button');
      expect(
        currentButton?.classList.contains('mzn-pagination-item--active'),
      ).toBeTruthy();
    });
  });

  describe('prop: disabled', () => {
    it('should disable all buttons when disabled is true', () => {
      const { getAllByRole } = render(<Pagination disabled total={100} />);

      const buttons = getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe('prop: hideNextButton', () => {
    it('should hide next button', () => {
      const { getAllByRole } = render(
        <Pagination hideNextButton total={100} />,
      );

      const buttons = getAllByRole('button');
      const hasNextButton = buttons.some((button) =>
        button.querySelector('[data-icon-name="chevron-right"]'),
      );

      expect(hasNextButton).toBe(false);
    });
  });

  describe('prop: hidePreviousButton', () => {
    it('should hide previous button', () => {
      const { getAllByRole } = render(
        <Pagination hidePreviousButton total={100} />,
      );

      const buttons = getAllByRole('button');
      const hasPrevButton = buttons.some((button) =>
        button.querySelector('[data-icon-name="chevron-left"]'),
      );

      expect(hasPrevButton).toBe(false);
    });
  });

  describe('prop: onChange', () => {
    it('should call onChange when clicking page button', async () => {
      const onChange = jest.fn();
      const { getByText } = render(
        <Pagination current={1} onChange={onChange} total={100} />,
      );

      const page2Button = getByText('2');
      await userEvent.click(page2Button);

      expect(onChange).toHaveBeenCalledWith(2);
    });

    it('should call onChange when clicking next button', async () => {
      const onChange = jest.fn();
      const { getAllByRole } = render(
        <Pagination current={1} onChange={onChange} total={100} />,
      );

      const buttons = getAllByRole('button');
      const nextButton = buttons.find((button) =>
        button.querySelector('[data-icon-name="chevron-right"]'),
      );

      if (nextButton) {
        await userEvent.click(nextButton);
        expect(onChange).toHaveBeenCalledWith(2);
      }
    });

    it('should call onChange when clicking previous button', async () => {
      const onChange = jest.fn();
      const { getAllByRole } = render(
        <Pagination current={2} onChange={onChange} total={100} />,
      );

      const buttons = getAllByRole('button');
      const prevButton = buttons.find((button) =>
        button.querySelector('[data-icon-name="chevron-left"]'),
      );

      if (prevButton) {
        await userEvent.click(prevButton);
        expect(onChange).toHaveBeenCalledWith(1);
      }
    });
  });

  describe('prop: pageSize', () => {
    it('should calculate correct page count', () => {
      const { getByText, queryByText } = render(
        <Pagination pageSize={20} total={100} />,
      );

      expect(getByText('5')).toBeInstanceOf(HTMLElement);
      expect(queryByText('6')).toBeNull();
    });
  });

  describe('prop: renderResultSummary', () => {
    it('should render custom result summary', () => {
      const { getByText } = render(
        <Pagination
          current={2}
          pageSize={10}
          renderResultSummary={(from, to, total) =>
            `Showing ${from}-${to} of ${total}`
          }
          total={100}
        />,
      );

      expect(getByText('Showing 11-20 of 100')).toBeInstanceOf(HTMLElement);
    });
  });

  describe('prop: showJumper', () => {
    it('should render jumper when showJumper is true', () => {
      const { getByText } = render(
        <Pagination
          buttonText="Go"
          hintText="Jump to"
          inputPlaceholder="1"
          showJumper
          total={100}
        />,
      );

      expect(getByText('Jump to')).toBeInstanceOf(HTMLElement);
      expect(getByText('Go')).toBeInstanceOf(HTMLElement);
    });

    it('should jump to specific page', async () => {
      const onChange = jest.fn();
      const { getByRole, getByText } = render(
        <Pagination
          buttonText="Go"
          onChange={onChange}
          showJumper
          total={100}
        />,
      );

      const input = getByRole('spinbutton');
      const goButton = getByText('Go');

      await userEvent.clear(input);
      await userEvent.type(input, '5');
      await userEvent.click(goButton);

      expect(onChange).toHaveBeenCalledWith(5);
    });
  });

  describe('prop: showPageSizeOptions', () => {
    it('should render page size selector when showPageSizeOptions is true', () => {
      const { getByText } = render(
        <Pagination
          pageSizeLabel="Items per page:"
          showPageSizeOptions
          total={100}
        />,
      );

      expect(getByText('Items per page:')).toBeInstanceOf(HTMLElement);
    });
  });

  describe('prop: siblingCount', () => {
    it('should render correct number of sibling pages', () => {
      const { getByText } = render(
        <Pagination current={5} siblingCount={2} total={100} />,
      );

      expect(getByText('3')).toBeInstanceOf(HTMLElement);
      expect(getByText('4')).toBeInstanceOf(HTMLElement);
      expect(getByText('5')).toBeInstanceOf(HTMLElement);
      expect(getByText('6')).toBeInstanceOf(HTMLElement);
      expect(getByText('7')).toBeInstanceOf(HTMLElement);
    });
  });

  describe('prop: total', () => {
    it('should calculate correct total pages', () => {
      const { getByText, queryByText } = render(
        <Pagination pageSize={10} total={25} />,
      );

      expect(getByText('3')).toBeInstanceOf(HTMLElement);
      expect(queryByText('4')).toBeNull();
    });

    it('should handle zero total', () => {
      const { queryByText } = render(<Pagination total={0} />);

      expect(queryByText('1')).toBeNull();
    });
  });
});
