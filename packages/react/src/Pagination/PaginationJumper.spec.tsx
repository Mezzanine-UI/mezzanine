import {
  cleanup,
  render,
  TestRenderer,
  fireEvent,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Button from '../Button';
import Typography from '../Typography';
import Input from '../Input';

import { PaginationJumper } from '.';

describe('<PaginationJumper />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<PaginationJumper ref={ref} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<PaginationJumper className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<PaginationJumper />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-pagination-jumper')).toBeTruthy();
  });

  describe('prop: onChange', () => {
    it('should trigger onChange', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(<PaginationJumper onChange={onChange} total={10} />);
      const element = getHostHTMLElement();
      const button = element.querySelector('button');
      const input = element.querySelector('input');

      fireEvent.change(input!, {
        target: {
          value: '2',
        },
      });

      fireEvent.click(button!);

      expect(onChange).toBeCalled();
    });
    it('should not trigger onChange when input over range', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(<PaginationJumper onChange={onChange} total={10} />);
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

      expect(onChange).not.toBeCalled();
    });

    it('should not trigger onChange when input string', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(<PaginationJumper onChange={onChange} total={10} />);
      const element = getHostHTMLElement();
      const button = element.querySelector('button');
      const input = element.querySelector('input');

      fireEvent.change(input!, {
        target: {
          value: 'Hello World',
        },
      });

      fireEvent.click(button!);

      expect(onChange).not.toBeCalled();
    });

    it('should trigger onChange when trigger input keyDown event: Enter', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(<PaginationJumper onChange={onChange} total={100} />);
      const element = getHostHTMLElement();
      const input = element.querySelector('input');

      fireEvent.change(
        input!,
        {
          target: {
            value: '2',
          },
        },
      );

      fireEvent.keyDown(
        input!,
        {
          key: 'Enter',
        },
      );

      expect(onChange).toBeCalled();
    });
  });

  describe('prop: buttonText,hintText,inputPlaceholder', () => {
    const hintText = 'Go To';
    const buttonText = 'Go';
    const inputPlaceholder = 'Page';

    const testRenderer = TestRenderer.create(
      <PaginationJumper
        hintText={hintText}
        buttonText={buttonText}
        inputPlaceholder={inputPlaceholder}
      />,
    );
    const testInstance = testRenderer.root;
    const typographyInstance = testInstance.findByType(Typography);
    const buttonInstance = testInstance.findByType(Button);
    const inputInstance = testInstance.findByType(Input);

    it('hintText should displayed in front of `input`', () => {
      expect(typographyInstance.props.children).toBe(hintText);
    });

    it('buttonText should displayed in the `button` content', () => {
      expect(buttonInstance.props.children).toBe(buttonText);
    });

    it('inputPlaceholder displayed in the `input` before the user enters a value', () => {
      expect(inputInstance.props.placeholder).toBe(inputPlaceholder);
    });
  });

  describe('prop: disabled', () => {
    it('should pass disabled props to children', () => {
      const testRenderer = TestRenderer.create(
        <PaginationJumper
          disabled
        />,
      );
      const testInstance = testRenderer.root;
      const typographyInstance = testInstance.findByType(Typography);
      const buttonInstance = testInstance.findByType(Button);
      const inputInstance = testInstance.findByType(Input);

      expect(typographyInstance.props.color).toBe('text-disabled');
      expect(inputInstance.props.disabled).toBe(true);
      expect(buttonInstance.props.disabled).toBe(true);
    });
  });
});
