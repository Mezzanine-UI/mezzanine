import { cleanup, render } from '../../__test-utils__';
import { RadioGroup, RadioGroupOption } from '.';

// Mock Radio Component
const mockRadioRender = jest.fn();

jest.mock('./Radio', () => {
  return function MockRadio(props: any) {
    mockRadioRender(props);
    return <div>{props.children}</div>;
  };
});

describe('<RadioGroup /> - props', () => {
  beforeEach(() => {
    mockRadioRender.mockClear();
  });

  afterEach(cleanup);

  describe('prop: options', () => {
    const options: RadioGroupOption[] = [
      {
        label: 'foo',
        value: 'foo',
      },
      {
        disabled: true,
        label: 'bar',
        value: 'bar',
      },
    ];

    it('should render radios via options', () => {
      render(<RadioGroup options={options} />);

      expect(mockRadioRender).toHaveBeenCalledTimes(options.length);
      expect(mockRadioRender).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          children: 'foo',
          disabled: undefined,
          value: 'foo',
        }),
      );
      expect(mockRadioRender).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          children: 'bar',
          disabled: true,
          value: 'bar',
        }),
      );
    });

    it('should not render radios via options if children passed', () => {
      const { getHostHTMLElement } = render(
        <RadioGroup options={options}>
          <div data-test="foo">foo</div>
        </RadioGroup>,
      );
      const element = getHostHTMLElement();
      const { firstElementChild, childElementCount } = element;

      expect(firstElementChild!.getAttribute('data-test')).toBe('foo');
      expect(firstElementChild!.textContent).toBe('foo');
      expect(childElementCount).toBe(1);
    });
  });
});
