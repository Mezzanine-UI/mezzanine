import { CheckboxSize, CheckboxColor } from '@mezzanine-ui/core/checkbox';
import {
  cleanup,
  fireEvent,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Checkbox from '.';

describe('<Checkbox />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLLabelElement,
    (ref) => render(<Checkbox ref={ref} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<Checkbox className={className} />),
  );
});

describe('prop: size', () => {
  it('should render size="medium" by default', () => {
    const { getHostHTMLElement } = render(<Checkbox />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-checkbox--medium')).toBeTruthy();
  });

  const sizes: CheckboxSize[] = [
    'small',
    'medium',
  ];

  sizes.forEach((size) => {
    it(`should add class if size="${size}"`, () => {
      const { getHostHTMLElement } = render(<Checkbox size={size} />);
      const element = getHostHTMLElement();

      expect(element.classList.contains(`mzn-checkbox--${size}`)).toBeTruthy();
    });
  });
});

describe('prop: color', () => {
  it('should render color="border" by default', () => {
    const { getHostHTMLElement } = render(<Checkbox />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-checkbox--border')).toBeTruthy();
  });

  const colors: CheckboxColor[] = [
    'error',
    'primary',
  ];

  colors.forEach((color) => {
    it(`should add class if color="${color}"`, () => {
      const { getHostHTMLElement } = render(<Checkbox color={color} />);
      const element = getHostHTMLElement();

      expect(element.classList.contains(`mzn-checkbox--${color}`)).toBeTruthy();
    });
  });
});

describe('prop: checked', () => {
  it('should has checked and aria-checked attributes and allows to checked partially', () => {
    [true, false].forEach((checked) => {
      const { getHostHTMLElement } = render(<Checkbox checked={checked} />);
      const element = getHostHTMLElement();

      expect(element.hasAttribute('checked')).toBe(checked);
      expect(element.getAttribute('aria-checked')).toBe(`${checked}`);
    });
  });
});

describe('prop: defaultChecked', () => {
  it('should remove checked and aria-checked attributes', () => {
    [false, true].forEach((checked) => {
      const { getHostHTMLElement } = render(<Checkbox checked={checked} />);
      const element = getHostHTMLElement();

      expect(element.removeAttribute('checked')).not.toBe(checked);
      expect(element.removeAttribute('aria-checked')).not.toBe(`${checked}`);
    });
  });
});

describe('prop: disabled', () => {
  it('should has disabled and aria-disabled attributes', () => {
    [false, true].forEach((disabled) => {
      const { getHostHTMLElement } = render(<Checkbox disabled={disabled} />);
      const element = getHostHTMLElement();

      expect(element.hasAttribute('disabled')).toBe(disabled);
      expect(element.getAttribute('aria-disabled')).toBe(`${disabled}`);
    });
  });
});

describe('prop: onChange', () => {
  it('should call onChange prop', () => {
    const onChange = jest.fn();
    const { getHostHTMLElement } = render(<Checkbox onChange={onChange} />);
    const element = getHostHTMLElement();

    fireEvent.change(element);

    expect(onChange).toBeCalledTimes(1);
  });

  it('should not be fired if disabled=true', () => {
    const onChange = jest.fn();
    const { getHostHTMLElement } = render(<Checkbox disabled onChange={onChange} />);
    const element = getHostHTMLElement();

    fireEvent.change(element);

    expect(onChange).not.toBeCalled();
  });
});
