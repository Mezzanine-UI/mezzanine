import {
  ButtonGroupOrientation,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
import { cleanup, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Button, { ButtonGroup } from '.';

describe('<ButtonGroup />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <ButtonGroup ref={ref}>
        <button>Button 1</button>
      </ButtonGroup>,
    ),
  );

  it('should wrap buttons', () => {
    const { getHostHTMLElement } = render(
      <ButtonGroup>
        <button>Button 1</button>
        <button>Button 2</button>
        <button>Button 3</button>
      </ButtonGroup>,
    );
    const element = getHostHTMLElement();
    const { childElementCount, children } = element;

    for (let i = 0; i < children.length; i += 1) {
      const child = children[i];

      expect(child.tagName.toLowerCase()).toBe('button');
    }

    expect(childElementCount).toBe(3);
  });

  describe('prop: variant', () => {
    it('should render variant="base-primary" by default', () => {
      const { getHostHTMLElement } = render(
        <ButtonGroup>
          <button>Button</button>
        </ButtonGroup>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-button-group')).toBeTruthy();
    });

    const variants: ButtonVariant[] = [
      'base-primary',
      'base-secondary',
      'destructive-primary',
      'inverse',
    ];

    variants.forEach((variant) => {
      it(`should pass variant="${variant}" to children`, () => {
        const TestButton = jest.fn(() => <button>Test</button>);

        render(
          <ButtonGroup variant={variant}>
            <TestButton />
          </ButtonGroup>,
        );

        expect(TestButton).toHaveBeenCalledWith(
          expect.objectContaining({ variant }),
          undefined,
        );
      });
    });
  });

  describe('prop: size', () => {
    it('should render size="main" by default', () => {
      const { getHostHTMLElement } = render(
        <ButtonGroup>
          <button>Button</button>
        </ButtonGroup>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-button-group')).toBeTruthy();
    });

    const sizes: ButtonSize[] = ['main', 'sub', 'minor'];

    sizes.forEach((size) => {
      it(`should pass size="${size}" to children`, () => {
        const TestButton = jest.fn(() => <button>Test</button>);

        render(
          <ButtonGroup size={size}>
            <TestButton />
          </ButtonGroup>,
        );

        expect(TestButton).toHaveBeenCalledWith(
          expect.objectContaining({ size }),
          undefined,
        );
      });
    });
  });

  describe('prop: disabled', () => {
    it('should render disabled=false by default', () => {
      const TestButton = jest.fn(() => <button>Test</button>);

      render(
        <ButtonGroup>
          <TestButton />
        </ButtonGroup>,
      );

      expect(TestButton).toHaveBeenCalledWith(
        expect.objectContaining({ disabled: false }),
        undefined,
      );
    });

    [false, true].forEach((disabled) => {
      it(`should pass disabled=${disabled} to children`, () => {
        const TestButton = jest.fn(() => <button>Test</button>);

        render(
          <ButtonGroup disabled={disabled}>
            <TestButton />
          </ButtonGroup>,
        );

        expect(TestButton).toHaveBeenCalledWith(
          expect.objectContaining({ disabled }),
          undefined,
        );
      });
    });

    it('should not override child disabled prop if explicitly provided', () => {
      const TestButton = jest.fn(() => <button>Test</button>);

      render(
        <ButtonGroup disabled={true}>
          <TestButton disabled={false} />
        </ButtonGroup>,
      );

      expect(TestButton).toHaveBeenCalledWith(
        expect.objectContaining({ disabled: false }),
        undefined,
      );
    });
  });

  describe('prop: fullWidth', () => {
    function testFullWidth(element: HTMLElement, fullWidth: boolean) {
      expect(element.classList.contains('mzn-button-group--full-width')).toBe(
        fullWidth,
      );
    }

    it('should render fullWidth=false by default', () => {
      const { getHostHTMLElement } = render(
        <ButtonGroup>
          <button>Button</button>
        </ButtonGroup>,
      );
      const element = getHostHTMLElement();

      testFullWidth(element, false);
    });

    [false, true].forEach((fullWidth) => {
      it(`should add class if fullWidth=${fullWidth}`, () => {
        const { getHostHTMLElement } = render(
          <ButtonGroup fullWidth={fullWidth}>
            <button>Button</button>
          </ButtonGroup>,
        );
        const element = getHostHTMLElement();

        testFullWidth(element, fullWidth);
      });
    });
  });

  describe('prop: orientation', () => {
    const orientations: ButtonGroupOrientation[] = ['horizontal', 'vertical'];

    it('should render orientation="horizontal" class by default', () => {
      const { getHostHTMLElement } = render(
        <ButtonGroup>
          <button>Button</button>
        </ButtonGroup>,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-button-group--horizontal'),
      ).toBeTruthy();
    });

    it('should not emit aria-orientation on role="group" (#502)', () => {
      const { getHostHTMLElement } = render(
        <ButtonGroup aria-orientation="vertical" orientation="vertical">
          <button>Button</button>
        </ButtonGroup>,
      );
      const element = getHostHTMLElement();

      expect(element.getAttribute('role')).toBe('group');
      expect(element.hasAttribute('aria-orientation')).toBe(false);
      expect(
        element.classList.contains('mzn-button-group--vertical'),
      ).toBeTruthy();
    });

    orientations.forEach((orientation) => {
      it(`should add 'aria-orientation' if role supports it and orientation=${orientation}`, () => {
        const { getHostHTMLElement } = render(
          <ButtonGroup orientation={orientation} role="toolbar">
            <button>Button</button>
          </ButtonGroup>,
        );
        const element = getHostHTMLElement();

        expect(element.getAttribute('aria-orientation')).toBe(orientation);
        expect(
          element.classList.contains(`mzn-button-group--${orientation}`),
        ).toBeTruthy();
      });
    });

    it('aria-orientation from props should not override', () => {
      const { getHostHTMLElement } = render(
        <ButtonGroup
          aria-orientation="vertical"
          orientation="horizontal"
          role="toolbar"
        >
          <button>Button</button>
        </ButtonGroup>,
      );
      const element = getHostHTMLElement();

      expect(element.getAttribute('aria-orientation')).toBe('horizontal');
    });
  });

  describe('prop: role', () => {
    it('should render role="group" by default', () => {
      const { getHostHTMLElement } = render(
        <ButtonGroup>
          <button>Button</button>
        </ButtonGroup>,
      );
      const element = getHostHTMLElement();

      expect(element.getAttribute('role')).toBe('group');
    });
  });

  describe('children prop inheritance', () => {
    it('should pass variant, size, disabled to children when not provided', () => {
      const TestButton = jest.fn(() => <button>Test</button>);

      render(
        <ButtonGroup variant="destructive-primary" size="minor" disabled>
          <TestButton />
        </ButtonGroup>,
      );

      expect(TestButton).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive-primary',
          size: 'minor',
          disabled: true,
        }),
        undefined,
      );
    });

    it('should not override child props if explicitly provided', () => {
      const TestButton = jest.fn(() => <button>Test</button>);

      render(
        <ButtonGroup variant="base-primary" size="main" disabled={true}>
          <TestButton
            variant="destructive-primary"
            size="minor"
            disabled={false}
          />
        </ButtonGroup>,
      );

      expect(TestButton).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive-primary',
          size: 'minor',
          disabled: false,
        }),
        undefined,
      );
    });

    it('should handle null and undefined children', () => {
      const { getHostHTMLElement } = render(
        <ButtonGroup>
          <button>Button 1</button>
          {null}
          {undefined}
          <button>Button 2</button>
        </ButtonGroup>,
      );
      const element = getHostHTMLElement();

      expect(element.childElementCount).toBe(2);
    });
  });

  describe('combinations', () => {
    it('should work with all props together', () => {
      const { getHostHTMLElement } = render(
        <ButtonGroup
          variant="inverse"
          size="sub"
          disabled
          fullWidth
          orientation="vertical"
        >
          <button>Button 1</button>
          <button>Button 2</button>
        </ButtonGroup>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-button-group')).toBeTruthy();
      expect(
        element.classList.contains('mzn-button-group--full-width'),
      ).toBeTruthy();
      expect(
        element.classList.contains('mzn-button-group--vertical'),
      ).toBeTruthy();
      expect(element.hasAttribute('aria-orientation')).toBe(false);
      expect(element.getAttribute('role')).toBe('group');
    });
  });

  describe('fragment children', () => {
    it('should pass group props through fragments to inner buttons', () => {
      const { getByText } = render(
        <ButtonGroup disabled size="sub" variant="base-secondary">
          <>
            <Button>Button 1</Button>
            <Button>Button 2</Button>
          </>
        </ButtonGroup>,
      );

      ['Button 1', 'Button 2'].forEach((text) => {
        const button = getByText(text).closest('button');

        expect(button?.disabled).toBe(true);
        expect(button?.classList.contains('mzn-button--sub')).toBeTruthy();
        expect(
          button?.classList.contains('mzn-button--base-secondary'),
        ).toBeTruthy();
      });
    });

    it('should not warn about invalid fragment props on re-render', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const renderGroup = (label: string) => (
        <ButtonGroup disabled>
          <>
            <Button>{label}</Button>
            <Button>Button 2</Button>
          </>
        </ButtonGroup>
      );

      const { rerender } = render(renderGroup('Button 1'));

      rerender(renderGroup('Button 1 updated'));

      expect(consoleError).not.toHaveBeenCalledWith(
        expect.stringContaining('React.Fragment'),
        expect.anything(),
      );

      consoleError.mockRestore();
    });
  });
});
