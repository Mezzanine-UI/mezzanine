import { useContext } from 'react';
import { cleanup, render, renderHook } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { createWrapper } from '../../__test-utils__/render';
import {
  CheckboxGroupContext,
  CheckboxGroupContextValue,
} from './CheckboxGroupContext';
import { CheckboxGroup, CheckboxGroupOption } from '.';

const renderMockCheckbox = jest.fn();

jest.mock('./Checkbox', () => {
  return function MockCheckbox(props: any) {
    renderMockCheckbox(props);
    return (
      <div {...props}>
        <input type="checkbox" checked={props.checked} />
      </div>
    );
  };
});

describe('<CheckboxGroup />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<CheckboxGroup ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<CheckboxGroup className={className} />),
  );

  it('should wrap children', () => {
    const { getHostHTMLElement } = render(
      <CheckboxGroup>
        <div data-test="foo" />
      </CheckboxGroup>,
    );
    const element = getHostHTMLElement();
    const { firstElementChild } = element;

    expect(firstElementChild!.getAttribute('data-test')).toBe('foo');
  });

  it('should provide CheckboxGroupContext', () => {
    let expectProps: CheckboxGroupContextValue = {
      disabled: true,
      name: 'foo',
      size: 'small',
      value: ['bar'],
    };
    const { result } = renderHook(() => useContext(CheckboxGroupContext), {
      wrapper: createWrapper(CheckboxGroup, expectProps),
    });

    /**
     * Ignore onChange since it will be transformed by CheckboxGroup
     */
    function testCheckboxGroupContextValue() {
      const { onChange, ...other } = result.current!;

      expect(other).toEqual(expectProps);
      expect(typeof onChange).toBe('function');
    }

    testCheckboxGroupContextValue();
  });

  describe('prop: options', () => {
    const options: CheckboxGroupOption[] = [
      {
        disabled: false,
        label: 'foo',
        value: 'foo',
      },
      {
        disabled: true,
        label: 'bar',
        value: 'bar',
      },
    ];

    beforeEach(() => {
      renderMockCheckbox.mockClear();
    });

    it('should render checkboxes via options', () => {
      render(<CheckboxGroup options={options} />);

      expect(renderMockCheckbox).toHaveBeenCalledTimes(options.length);

      options.forEach((opt) => {
        expect(renderMockCheckbox).toHaveBeenCalledWith(
          expect.objectContaining({
            children: opt.label,
            disabled: opt.disabled,
            value: opt.value,
          }),
        );
      });
    });

    it('should not render checkboxes via options if children passed', () => {
      const { getHostHTMLElement } = render(
        <CheckboxGroup options={options}>
          <div data-test="foo">foo</div>
        </CheckboxGroup>,
      );
      const element = getHostHTMLElement();
      const { firstElementChild, childElementCount } = element;

      expect(firstElementChild!.getAttribute('data-test')).toBe('foo');
      expect(firstElementChild!.textContent).toBe('foo');
      expect(childElementCount).toBe(1);
    });
  });
});
