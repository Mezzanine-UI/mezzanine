import { PlusIcon, SearchIcon, SpinnerIcon } from '@mezzanine-ui/icons';
import { ButtonSize, ButtonVariant } from '@mezzanine-ui/core/button';
import { act, cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Button from './Button';

jest.useFakeTimers();

describe('<Button />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLButtonElement, (ref) =>
    render(<Button ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Button className={className} />),
  );

  it('should render the text content', () => {
    const { getHostHTMLElement } = render(<Button>Hello</Button>);
    const element = getHostHTMLElement();

    expect(element.textContent).toBe('Hello');
  });

  it('should not render children if icon-only mode', () => {
    const { getHostHTMLElement } = render(
      <Button icon={PlusIcon} iconType="icon-only" />,
    );
    const element = getHostHTMLElement();

    expect(element.textContent).toBe('');
  });

  describe('prop: variant', () => {
    it('should render variant="base-primary" by default', () => {
      const { getHostHTMLElement } = render(<Button />);
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-button--base-primary'),
      ).toBeTruthy();
    });

    const variants: ButtonVariant[] = [
      'base-primary',
      'base-secondary',
      'base-tertiary',
      'base-ghost',
      'base-dashed',
      'base-text-link',
      'destructive-primary',
      'destructive-secondary',
      'destructive-ghost',
      'destructive-text-link',
      'inverse',
    ];

    variants.forEach((variant) => {
      it(`should add class if variant="${variant}"`, () => {
        const { getHostHTMLElement } = render(<Button variant={variant} />);
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-button--${variant}`),
        ).toBeTruthy();
      });
    });
  });

  describe('prop: size', () => {
    it('should render size="main" by default', () => {
      const { getHostHTMLElement } = render(<Button />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-button--main')).toBeTruthy();
    });

    const sizes: ButtonSize[] = ['main', 'sub', 'minor'];

    sizes.forEach((size) => {
      it(`should add class if size="${size}"`, () => {
        const { getHostHTMLElement } = render(<Button size={size} />);
        const element = getHostHTMLElement();

        expect(element.classList.contains(`mzn-button--${size}`)).toBeTruthy();
      });
    });
  });

  describe('prop: component', () => {
    it('should render by button tag as default', () => {
      const { getHostHTMLElement } = render(<Button />);
      const element = getHostHTMLElement();

      expect(element.tagName.toLowerCase()).toBe('button');
    });

    it('should render as anchor tag when component="a"', () => {
      const { getHostHTMLElement } = render(<Button component="a" />);
      const element = getHostHTMLElement();

      expect(element.tagName.toLowerCase()).toBe('a');
    });

    it('should render custom component', () => {
      const CustomComponent = (props: any) => <div {...props} data-custom />;
      const { getHostHTMLElement } = render(
        <Button component={CustomComponent} />,
      );
      const element = getHostHTMLElement();

      expect(element.tagName.toLowerCase()).toBe('div');
      expect(element.hasAttribute('data-custom')).toBeTruthy();
    });
  });

  describe('prop: disabled', () => {
    it('should has disabled and aria-disabled attributes', () => {
      [false, true].forEach((disabled) => {
        const { getHostHTMLElement } = render(<Button disabled={disabled} />);
        const element = getHostHTMLElement();

        expect(element.classList.contains('mzn-button--disabled')).toBe(
          disabled,
        );
        expect(element.hasAttribute('disabled')).toBe(disabled);
        expect(element.getAttribute('aria-disabled')).toBe(`${disabled}`);
      });
    });

    it('aria-disabled from props should not override', () => {
      const { getHostHTMLElement } = render(
        <Button aria-disabled={false} disabled />,
      );
      const element = getHostHTMLElement();

      expect(element.getAttribute('aria-disabled')).toBe('true');
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

    it('should render loading spinner when loading=true', () => {
      const { getHostHTMLElement } = render(<Button loading>Hello</Button>);
      const element = getHostHTMLElement();
      const iconElement = element.querySelector('i');

      expect(iconElement?.getAttribute('data-icon-name')).toBe(
        SpinnerIcon.name,
      );
    });

    it('should replace icon with loading spinner', () => {
      const { getHostHTMLElement } = render(
        <Button icon={PlusIcon} iconType="leading" loading>
          Hello
        </Button>,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector('i');

      expect(iconElement?.getAttribute('data-icon-name')).toBe(
        SpinnerIcon.name,
      );
    });
  });

  describe('prop: icon', () => {
    describe('iconType: leading', () => {
      it('should render icon before text', () => {
        const { getHostHTMLElement } = render(
          <Button icon={PlusIcon} iconType="leading">
            Hello
          </Button>,
        );
        const element = getHostHTMLElement();

        expect(
          element.classList.contains('mzn-button--icon-leading'),
        ).toBeTruthy();
        expect(element.firstElementChild?.tagName.toLowerCase()).toBe('i');
        expect(element.firstElementChild?.getAttribute('data-icon-name')).toBe(
          PlusIcon.name,
        );
        expect(element.textContent).toBe('Hello');
      });
    });

    describe('iconType: trailing', () => {
      it('should render icon after text', () => {
        const { getHostHTMLElement } = render(
          <Button icon={SearchIcon} iconType="trailing">
            Hello
          </Button>,
        );
        const element = getHostHTMLElement();

        expect(
          element.classList.contains('mzn-button--icon-trailing'),
        ).toBeTruthy();
        expect(element.lastElementChild?.tagName.toLowerCase()).toBe('i');
        expect(element.lastElementChild?.getAttribute('data-icon-name')).toBe(
          SearchIcon.name,
        );
        expect(element.textContent).toBe('Hello');
      });
    });

    describe('iconOnly', () => {
      it('should render only icon without text', () => {
        const { getHostHTMLElement } = render(
          <Button icon={PlusIcon} iconType="icon-only" />,
        );
        const element = getHostHTMLElement();

        expect(
          element.classList.contains('mzn-button--icon-only'),
        ).toBeTruthy();
        expect(element.textContent).toBe('');
        expect(element.querySelector('i')?.getAttribute('data-icon-name')).toBe(
          PlusIcon.name,
        );
      });

      it('should not render children text when iconType is icon-only', () => {
        const { getHostHTMLElement } = render(
          <Button icon={PlusIcon} iconType="icon-only">
            Hidden Text
          </Button>,
        );
        const element = getHostHTMLElement();

        expect(element.textContent).toBe('');
      });
    });
  });

  describe('prop: tooltip (icon-only mode)', () => {
    it('should show tooltip on hover when iconType is icon-only and children provided', async () => {
      const { getHostHTMLElement } = render(
        <Button icon={PlusIcon} iconType="icon-only">
          Add new item
        </Button>,
      );
      const element = getHostHTMLElement();

      await act(async () => {
        fireEvent.mouseEnter(element);
      });

      const tooltip = document.querySelector('[data-popper-placement]');

      expect(tooltip).not.toBeNull();
      expect(tooltip?.textContent).toBe('Add new item');
    });

    it('should not show tooltip when disabledTooltip is true', async () => {
      const { getHostHTMLElement } = render(
        <Button disabledTooltip icon={PlusIcon} iconType="icon-only">
          Add new item
        </Button>,
      );
      const element = getHostHTMLElement();

      await act(async () => {
        fireEvent.mouseEnter(element);
      });

      const tooltip = document.querySelector('[data-popper-placement]');

      expect(tooltip).toBeNull();
    });

    it('should not show tooltip when no children provided', async () => {
      const { getHostHTMLElement } = render(
        <Button icon={PlusIcon} iconType="icon-only" />,
      );
      const element = getHostHTMLElement();

      await act(async () => {
        fireEvent.mouseEnter(element);
      });

      const tooltip = document.querySelector('[data-popper-placement]');

      expect(tooltip).toBeNull();
    });

    it('should use tooltipPosition for placement', async () => {
      const { getHostHTMLElement } = render(
        <Button icon={PlusIcon} iconType="icon-only" tooltipPosition="top">
          Add new item
        </Button>,
      );
      const element = getHostHTMLElement();

      await act(async () => {
        fireEvent.mouseEnter(element);
      });

      const tooltip = document.querySelector('[data-popper-placement]');

      expect(tooltip).not.toBeNull();
      expect(tooltip?.getAttribute('data-popper-placement')).toBe('top');
    });

    it('should not show tooltip for non icon-only buttons', async () => {
      const { getHostHTMLElement } = render(
        <Button icon={PlusIcon} iconType="leading">
          Add new item
        </Button>,
      );
      const element = getHostHTMLElement();

      await act(async () => {
        fireEvent.mouseEnter(element);
      });

      const tooltip = document.querySelector('[data-popper-placement]');

      expect(tooltip).toBeNull();
    });
  });

  describe('prop: onClick', () => {
    it('should be fired on click event', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(<Button onClick={onClick} />);
      const element = getHostHTMLElement();

      fireEvent.click(element);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not be fired if disabled=true', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <Button disabled onClick={onClick} />,
      );
      const element = getHostHTMLElement();

      fireEvent.click(element);

      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not be fired if loading=true', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <Button loading onClick={onClick} />,
      );
      const element = getHostHTMLElement();

      fireEvent.click(element);

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('combinations', () => {
    it('should work with variant + size', () => {
      const { getHostHTMLElement } = render(
        <Button variant="destructive-primary" size="minor">
          Delete
        </Button>,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-button--destructive-primary'),
      ).toBeTruthy();
      expect(element.classList.contains('mzn-button--minor')).toBeTruthy();
    });

    it('should work with variant + icon', () => {
      const { getHostHTMLElement } = render(
        <Button icon={PlusIcon} iconType="leading" variant="base-secondary">
          Add
        </Button>,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-button--base-secondary'),
      ).toBeTruthy();
      expect(
        element.classList.contains('mzn-button--icon-leading'),
      ).toBeTruthy();
    });

    it('should work with all states', () => {
      const { getHostHTMLElement } = render(
        <Button
          disabled
          icon={SearchIcon}
          iconType="trailing"
          size="sub"
          variant="destructive-primary"
        >
          Complex
        </Button>,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-button--destructive-primary'),
      ).toBeTruthy();
      expect(element.classList.contains('mzn-button--sub')).toBeTruthy();
      expect(element.classList.contains('mzn-button--disabled')).toBeTruthy();
      expect(
        element.classList.contains('mzn-button--icon-trailing'),
      ).toBeTruthy();
    });
  });
});
