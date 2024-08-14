import { act, cleanup, render, fireEvent } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';

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
      const textField = element.querySelector('.mzn-text-field');

      await act(async () => {
        fireEvent.click(textField!);
      });

      const options = document.querySelectorAll('.mzn-menu-item');

      await act(async () => {
        fireEvent.click(options[1]);
      });

      expect(onChange).toBeCalledTimes(1);
      expect(onChange).toBeCalledWith(20);
    });
  });
});
