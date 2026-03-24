import { act, cleanup, render, fireEvent } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';

jest.mock('../Dropdown', () => {
  return function MockDropdown(props: any) {
    const { children, onSelect, options, open } = props;
    return (
      <div data-testid="mock-dropdown">
        <button
          data-testid="mock-trigger"
          onClick={() => props.onVisibilityChange?.(!open)}
          type="button"
        >
          {children}
        </button>
        {open && (
          <ul data-testid="mock-options">
            {options?.map((option: any) => (
              <li
                key={option.id}
                className="mzn-menu-item"
                data-testid={`option-${option.id}`}
                aria-selected={false}
                role="option"
              >
                <button onClick={() => onSelect?.(option)} type="button">
                  {option.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
});

import { PaginationPageSize } from '.';

describe('<PaginationPageSize />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<PaginationPageSize ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<PaginationPageSize className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<PaginationPageSize />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-pagination-page-size')).toBeTruthy();
  });

  describe('prop: onChange', () => {
    it('should trigger onChange', async () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <PaginationPageSize
          onChange={onChange}
          options={[10, 20]}
          value={10}
        />,
      );
      const element = getHostHTMLElement();
      const trigger = element.querySelector('[data-testid="mock-trigger"]');

      await act(async () => {
        fireEvent.click(trigger!);
      });

      const optionButtons = element.querySelectorAll('.mzn-menu-item button');

      await act(async () => {
        fireEvent.click(optionButtons[1]);
      });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(20);
    });
  });
});
