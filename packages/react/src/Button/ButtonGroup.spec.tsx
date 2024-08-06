import { toCssVar } from '@mezzanine-ui/system/css';
import {
  ButtonGroupOrientation,
  ButtonGroupSpacing,
  ButtonSize,
} from '@mezzanine-ui/core/button';
import { cleanup, render, TestRenderer } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Button, { ButtonGroup } from '.';
import { ButtonProps } from './Button';
import ConfigProvider from '../Provider';

describe('<ButtonGroup />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <ButtonGroup ref={ref}>
        <Button />
      </ButtonGroup>,
    ),
  );

  it('shoulde just wrap buttons', () => {
    const { getHostHTMLElement } = render(
      <ButtonGroup>
        <Button />
        <Button />
        <Button />
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

  describe('prop:attached', () => {
    function testAttached(element: HTMLElement, attached: boolean) {
      expect(element.classList.contains('mzn-button-group--attached')).toBe(
        attached,
      );
    }

    it('should render attached=false by default', () => {
      const { getHostHTMLElement } = render(
        <ButtonGroup>
          <Button />
        </ButtonGroup>,
      );
      const element = getHostHTMLElement();

      testAttached(element, false);
    });

    [false, true].forEach((attached) => {
      it(`should add class if attached=${attached}`, () => {
        const { getHostHTMLElement } = render(
          <ButtonGroup attached={attached}>
            <Button />
          </ButtonGroup>,
        );
        const element = getHostHTMLElement();

        testAttached(element, attached);
      });
    });
  });

  describe('prop:fullWidth', () => {
    function testFullWidth(element: HTMLElement, fullWidth: boolean) {
      expect(element.classList.contains('mzn-button-group--full-width')).toBe(
        fullWidth,
      );
    }

    it('should render fullWidth=false by default', () => {
      const { getHostHTMLElement } = render(
        <ButtonGroup>
          <Button />
        </ButtonGroup>,
      );
      const element = getHostHTMLElement();

      testFullWidth(element, false);
    });

    [false, true].forEach((fullWidth) => {
      it(`should add class if fullWidth=${fullWidth}`, () => {
        const { getHostHTMLElement } = render(
          <ButtonGroup fullWidth={fullWidth}>
            <Button />
          </ButtonGroup>,
        );
        const element = getHostHTMLElement();

        testFullWidth(element, fullWidth);
      });
    });
  });

  describe('prop:orientation', () => {
    function testOrientation(
      element: HTMLElement,
      orientation: ButtonGroupOrientation,
    ) {
      expect(element.getAttribute('aria-orientation')).toBe(orientation);
      expect(
        element.classList.contains(`mzn-button-group--${orientation}`),
      ).toBeTruthy();
    }

    it('should render orientation="horizontal" by default', () => {
      const { getHostHTMLElement } = render(
        <ButtonGroup>
          <Button />
        </ButtonGroup>,
      );
      const element = getHostHTMLElement();

      testOrientation(element, 'horizontal');
    });

    const orientations: ButtonGroupOrientation[] = ['horizontal', 'vertical'];

    orientations.forEach((orientation) => {
      it(`should add 'aria-orientation' attribute and class if orientation=${orientation}`, () => {
        const { getHostHTMLElement } = render(
          <ButtonGroup orientation={orientation}>
            <Button />
          </ButtonGroup>,
        );
        const element = getHostHTMLElement();

        testOrientation(element, orientation);
      });
    });

    it('aria-orientation from props should not override', () => {
      const { getHostHTMLElement } = render(
        <ButtonGroup aria-orientation="vertical" orientation="horizontal">
          <Button />
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
          <Button />
        </ButtonGroup>,
      );
      const element = getHostHTMLElement();

      expect(element.getAttribute('role')).toBe('group');
    });
  });

  describe('prop: spacing', () => {
    it('should render spacing=4 by default(size=medium)', () => {
      const { getHostHTMLElement } = render(
        <ButtonGroup>
          <Button />
        </ButtonGroup>,
      );
      const element = getHostHTMLElement();

      expect(element.style.getPropertyValue('--mzn-button-group-spacing')).toBe(
        toCssVar('mzn-spacing-4'),
      );
    });

    const sizeSpacingMaps: [ButtonSize, ButtonGroupSpacing][] = [
      ['large', 4],
      ['medium', 4],
      ['small', 3],
    ];

    sizeSpacingMaps.forEach(([size, spacing]) => {
      it(`should set spacing=${spacing} if size=${size}`, () => {
        const { getHostHTMLElement } = render(
          <ButtonGroup size={size}>
            <Button />
          </ButtonGroup>,
        );
        const element = getHostHTMLElement();

        expect(
          element.style.getPropertyValue('--mzn-button-group-spacing'),
        ).toBe(toCssVar(`mzn-spacing-${spacing}`));
      });
    });

    it('should override spacing by passed spacing', () => {
      const spacing: ButtonGroupSpacing = 1;
      const { getHostHTMLElement } = render(
        <ButtonGroup size="small" spacing={spacing}>
          <Button />
        </ButtonGroup>,
      );
      const element = getHostHTMLElement();

      expect(element.style.getPropertyValue('--mzn-button-group-spacing')).toBe(
        toCssVar(`mzn-spacing-${spacing}`),
      );
    });
  });

  describe('props: color,danger,disabled,size,variant that can override props of buttons inside group', () => {
    function testOverrideProps(
      testInstance: TestRenderer.ReactTestInstance,
      {
        color,
        danger,
        disabled,
        size,
        variant,
      }: Required<
        Pick<ButtonProps, 'color' | 'danger' | 'disabled' | 'size' | 'variant'>
      >,
    ) {
      const buttonInstance = testInstance.findByType(Button);

      expect(buttonInstance.props.color).toBe(color);
      expect(buttonInstance.props.danger).toBe(danger);
      expect(buttonInstance.props.disabled).toBe(disabled);
      expect(buttonInstance.props.size).toBe(size);
      expect(buttonInstance.props.variant).toBe(variant);
    }

    it('all by default', () => {
      const testRenderer = TestRenderer.create(
        <ButtonGroup>
          <Button />
        </ButtonGroup>,
      );
      const testInstance = testRenderer.root;

      testOverrideProps(testInstance, {
        color: 'primary',
        danger: false,
        disabled: false,
        size: 'medium',
        variant: 'text',
      });
    });

    it('provided by group', () => {
      const testRenderer = TestRenderer.create(
        <ButtonGroup
          color="secondary"
          danger
          disabled
          size="small"
          variant="contained"
        >
          <Button />
        </ButtonGroup>,
      );
      const testInstance = testRenderer.root;

      testOverrideProps(testInstance, {
        color: 'secondary',
        danger: true,
        disabled: true,
        size: 'small',
        variant: 'contained',
      });
    });

    it('provided by context', () => {
      const testRenderer = TestRenderer.create(
        <ConfigProvider size="small">
          <ButtonGroup color="secondary" danger disabled variant="contained">
            <Button />
          </ButtonGroup>
        </ConfigProvider>,
      );
      const testInstance = testRenderer.root;

      testOverrideProps(testInstance, {
        color: 'secondary',
        danger: true,
        disabled: true,
        size: 'small',
        variant: 'contained',
      });
    });

    it('should not override if child explicitly provided props', () => {
      const testRenderer = TestRenderer.create(
        <ButtonGroup
          color="primary"
          danger
          disabled
          size="small"
          variant="contained"
        >
          <Button
            color="secondary"
            danger={false}
            disabled={false}
            size="large"
            variant="outlined"
          />
        </ButtonGroup>,
      );
      const testInstance = testRenderer.root;

      testOverrideProps(testInstance, {
        color: 'secondary',
        danger: false,
        disabled: false,
        size: 'large',
        variant: 'outlined',
      });
    });
  });
});
