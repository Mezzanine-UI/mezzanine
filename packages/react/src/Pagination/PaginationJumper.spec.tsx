import { cleanup, render, fireEvent } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';

import { PaginationJumper } from '.';

describe('<PaginationJumper />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<PaginationJumper ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<PaginationJumper className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<PaginationJumper />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-pagination-jumper')).toBeTruthy();
  });

  describe('prop: onChange', () => {
    it('should trigger onChange', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <PaginationJumper onChange={onChange} total={10} />,
      );
      const element = getHostHTMLElement();
      const button = element.querySelector('button');
      const input = element.querySelector('input');

      fireEvent.change(input!, {
        target: {
          value: '2',
        },
      });

      fireEvent.click(button!);

      expect(onChange).toHaveBeenCalled();
    });
    it('should not trigger onChange when input over range', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <PaginationJumper onChange={onChange} total={10} />,
      );
      const element = getHostHTMLElement();
      const button = element.querySelector('button');
      const input = element.querySelector('input');

      fireEvent.change(input!, {
        target: {
          value: '555',
        },
      });

      fireEvent.click(button!);

      fireEvent.change(input!, {
        target: {
          value: '-10',
        },
      });

      fireEvent.click(button!);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should not trigger onChange when input string', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <PaginationJumper onChange={onChange} total={10} />,
      );
      const element = getHostHTMLElement();
      const button = element.querySelector('button');
      const input = element.querySelector('input');

      fireEvent.change(input!, {
        target: {
          value: 'Hello World',
        },
      });

      fireEvent.click(button!);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should trigger onChange when trigger input keyDown event: Enter', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <PaginationJumper onChange={onChange} total={100} />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input');

      fireEvent.change(input!, {
        target: {
          value: '2',
        },
      });

      fireEvent.keyDown(input!, {
        key: 'Enter',
      });

      expect(onChange).toHaveBeenCalled();
    });
  });
});
