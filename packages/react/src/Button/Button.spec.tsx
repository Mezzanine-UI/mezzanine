import { PlusIcon, SpinnerIcon } from '@mezzanine-ui/icons';
import { ButtonSize, ButtonVariant } from '@mezzanine-ui/core/button';
import {
  cleanup,
  fireEvent,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Icon from '../Icon';
import Button, { ButtonColor, ButtonComponent } from '.';
import ConfigProvider from '../Provider';

describe('<Button />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLButtonElement,
    (ref) => render(<Button ref={ref} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<Button className={className} />),
  );

  it('should render the text and wrap it by button label rendered by span', () => {
    const { getHostHTMLElement, getByText } = render(<Button>Hello</Button>);
    const element = getHostHTMLElement();
    const labelElement = getByText('Hello');

    expect(element.textContent).toBe('Hello');
    expect(labelElement.textContent).toBe('Hello');
    expect(labelElement.tagName.toLowerCase()).toBe('span');
    expect(labelElement.classList.contains('mzn-button__label')).toBeTruthy();
  });

  it('should not render the button label if no children', () => {
    const { getHostHTMLElement } = render(<Button />);
    const element = getHostHTMLElement();

    expect(element.firstElementChild).toBe(null);
  });

  describe('prop: color', () => {
    it('should render color="primary" by default', () => {
      const { getHostHTMLElement } = render(<Button />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-button--primary')).toBeTruthy();
    });

    const colors: ButtonColor[] = [
      'primary',
      'secondary',
    ];

    colors.forEach((color) => {
      it(`should add class if color="${color}"`, () => {
        const { getHostHTMLElement } = render(<Button color={color} />);
        const element = getHostHTMLElement();

        expect(element.classList.contains(`mzn-button--${color}`)).toBeTruthy();
      });
    });
  });

  describe('prop: component', () => {
    it('should render by button tag as default', () => {
      const { getHostHTMLElement } = render(<Button />);
      const element = getHostHTMLElement();

      expect(element.tagName.toLowerCase()).toBe('button');
    });

    const components: ButtonComponent[] = [
      'button',
      'a',
    ];

    components.forEach((component) => {
      it(`should render by overriding component="${component}"`, () => {
        const { getHostHTMLElement } = render(<Button component={component} />);
        const element = getHostHTMLElement();

        expect(element.tagName.toLowerCase()).toBe(component);
      });
    });
  });

  describe('prop:danger', () => {
    it('should add class if danger=true', () => {
      const { getHostHTMLElement } = render(<Button danger />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-button--danger')).toBeTruthy();
    });
  });

  describe('prop: disabled', () => {
    it('should has disabled and aria-disabled attributes', () => {
      [false, true].forEach((disabled) => {
        const { getHostHTMLElement } = render(<Button disabled={disabled} />);
        const element = getHostHTMLElement();

        expect(element.classList.contains('mzn-button--disabled')).toBe(disabled);
        expect(element.hasAttribute('disabled')).toBe(disabled);
        expect(element.getAttribute('aria-disabled')).toBe(`${disabled}`);
      });
    });

    it('aria-disabled from props should not override', () => {
      const { getHostHTMLElement } = render(
        <Button
          aria-disabled={false}
          disabled
        />,
      );
      const element = getHostHTMLElement();

      expect(element.getAttribute('aria-disabled')).toBeTruthy();
    });
  });

  describe('prop: loading', () => {
    [false, true].forEach((loading) => {
      const message = loading
        ? 'should add class if loading=true'
        : 'should not add class if loading=false';

      it(message, () => {
        const { getHostHTMLElement } = render(<Button loading={loading} />);
        const element = getHostHTMLElement();

        expect(element.classList.contains('mzn-button--loading')).toBe(loading);
      });
    });

    it('should replace prefix w/ loading icon if no icon provided', () => {
      const { getHostHTMLElement } = render(<Button loading>Hello</Button>);
      const element = getHostHTMLElement();
      const { firstElementChild: loadingIconElement } = element;

      expect(loadingIconElement?.getAttribute('data-icon-name')).toBe(SpinnerIcon.name);
    });

    it('should replace prefix w/ loading icon if only prefix provided', () => {
      const { getHostHTMLElement } = render(
        <Button loading prefix={<Icon icon={PlusIcon} />}>
          Hello
        </Button>,
      );
      const element = getHostHTMLElement();
      const { firstElementChild: loadingIconElement } = element;

      expect(loadingIconElement?.getAttribute('data-icon-name')).toBe(SpinnerIcon.name);
    });

    it('should replace suffix w/ loading icon if only suffix provided', () => {
      const { getHostHTMLElement } = render(
        <Button loading suffix={<Icon icon={PlusIcon} />}>
          Hello
        </Button>,
      );
      const element = getHostHTMLElement();
      const { lastElementChild: loadingIconElement } = element;

      expect(loadingIconElement?.getAttribute('data-icon-name')).toBe(SpinnerIcon.name);
    });

    it('should replace prefix w/ loading icon if both prefix and suffix provided', () => {
      const { getHostHTMLElement } = render(
        <Button
          loading
          prefix={<Icon icon={PlusIcon} />}
          suffix={<Icon icon={PlusIcon} />}
        >
          Hello
        </Button>,
      );
      const element = getHostHTMLElement();
      const {
        firstElementChild: loadingIconElement,
        lastElementChild: suffixElement,
      } = element;

      expect(loadingIconElement?.getAttribute('data-icon-name')).toBe(SpinnerIcon.name);
      expect(suffixElement?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
    });
  });

  describe('prop:onClick', () => {
    it('should be fired on click event', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(<Button onClick={onClick} />);
      const element = getHostHTMLElement();

      fireEvent.click(element);

      expect(onClick).toBeCalledTimes(1);
    });

    it('should not be fired if disabled=true', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(<Button disabled onClick={onClick} />);
      const element = getHostHTMLElement();

      fireEvent.click(element);

      expect(onClick).not.toBeCalled();
    });

    it('should not be fired if loading=true', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(<Button loading onClick={onClick} />);
      const element = getHostHTMLElement();

      fireEvent.click(element);

      expect(onClick).not.toBeCalled();
    });
  });

  describe('prop: prefix', () => {
    it('should render icon before button label', () => {
      const { getHostHTMLElement } = render(
        <Button prefix={<Icon icon={PlusIcon} />}>
          Hello
        </Button>,
      );
      const element = getHostHTMLElement();
      const {
        firstElementChild: prefixElement,
        lastElementChild: labelElement,
        childElementCount,
      } = element;

      expect(childElementCount).toBe(2);
      expect(prefixElement?.tagName.toLowerCase()).toBe('i');
      expect(prefixElement?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
      expect(labelElement?.textContent).toBe('Hello');
      expect(labelElement?.tagName.toLowerCase()).toBe('span');
    });
  });

  describe('prop: size', () => {
    it('should render size="medium" by default', () => {
      const { getHostHTMLElement } = render(<Button />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-button--medium')).toBeTruthy();
    });

    it('should accept ConfigProvider context size changes', () => {
      const { getHostHTMLElement } = render(
        <ConfigProvider size="large">
          <Button />
        </ConfigProvider>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-button--large')).toBeTruthy();
    });

    const sizes: ButtonSize[] = [
      'small',
      'medium',
      'large',
    ];

    sizes.forEach((size) => {
      it(`should add class if size="${size}"`, () => {
        const { getHostHTMLElement } = render(<Button size={size} />);
        const element = getHostHTMLElement();

        expect(element.classList.contains(`mzn-button--${size}`)).toBeTruthy();
      });
    });
  });

  describe('prop: suffix', () => {
    it('should render icon after button label', () => {
      const { getHostHTMLElement } = render(
        <Button suffix={<Icon icon={PlusIcon} />}>
          Hello
        </Button>,
      );
      const element = getHostHTMLElement();
      const {
        firstElementChild: labelElement,
        lastElementChild: suffixdElement,
        childElementCount,
      } = element;

      expect(childElementCount).toBe(2);
      expect(labelElement?.textContent).toBe('Hello');
      expect(labelElement?.tagName.toLowerCase()).toBe('span');
      expect(suffixdElement?.tagName.toLowerCase()).toBe('i');
      expect(suffixdElement?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
    });
  });

  describe('prop: variant', () => {
    it('should render variant="text" by default. The text button doesn\'t have specific class', () => {
      const { getHostHTMLElement } = render(<Button />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-button')).toBeTruthy();
    });

    const variants: ButtonVariant[] = [
      'text',
      'outlined',
      'contained',
    ];

    variants.forEach((variant) => {
      it(`should add class as need if variant="${variant}"`, () => {
        const { getHostHTMLElement } = render(<Button variant={variant} />);
        const element = getHostHTMLElement();

        expect(element.classList.contains(`mzn-button--${variant}`)).toBe(variant !== 'text');
      });
    });
  });
});
