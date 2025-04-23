import { toCssVar } from '@mezzanine-ui/system/css';
import {
  ButtonGroupOrientation,
  ButtonGroupSpacing,
  ButtonSize,
} from '@mezzanine-ui/core/button';
import { cleanup, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Button, { ButtonGroup } from '.';
import MockButton from './Button';
import ConfigProvider from '../Provider';

// Mock Button Component
const mockButtonRender = jest.fn();

jest.mock('./Button', () => {
  return function MockButton(props: any) {
    mockButtonRender(props);
    return <button>{props.children}</button>;
  };
});

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

  describe('ButtonGroup passes props to child Button (Composite Tests)', () => {
    beforeEach(() => {
      mockButtonRender.mockClear();
    });

    it('passes default props', () => {
      render(
        <ButtonGroup>
          <MockButton />
        </ButtonGroup>,
      );

      // 驗證 Button 被呼叫過一次
      expect(mockButtonRender).toHaveBeenCalledTimes(1);

      // 驗證傳遞的 props 正確（根據 ButtonGroup 的預設邏輯）
      expect(mockButtonRender).toHaveBeenCalledWith(
        expect.objectContaining({
          color: 'primary',
          danger: false,
          disabled: false,
          size: 'medium',
          variant: 'text',
        }),
      );
    });

    it('overrides props via ButtonGroup', () => {
      render(
        <ButtonGroup
          color="secondary"
          danger
          disabled
          size="large"
          variant="outlined"
        >
          <MockButton />
        </ButtonGroup>,
      );

      expect(mockButtonRender).toHaveBeenCalledTimes(1);
      expect(mockButtonRender).toHaveBeenCalledWith(
        expect.objectContaining({
          color: 'secondary',
          danger: true,
          disabled: true,
          size: 'large',
          variant: 'outlined',
        }),
      );
    });

    it('provided by context', () => {
      render(
        <ConfigProvider size="small">
          <ButtonGroup color="secondary" danger disabled variant="contained">
            <MockButton />
          </ButtonGroup>
        </ConfigProvider>,
      );

      expect(mockButtonRender).toHaveBeenCalledWith(
        expect.objectContaining({
          color: 'secondary',
          danger: true,
          disabled: true,
          size: 'small',
          variant: 'contained',
        }),
      );
    });

    it('should not override if child explicitly provided props', () => {
      render(
        <ButtonGroup
          color="primary"
          danger
          disabled
          size="small"
          variant="contained"
        >
          <MockButton
            color="secondary"
            danger={false}
            disabled={false}
            size="large"
            variant="outlined"
          />
        </ButtonGroup>,
      );

      expect(mockButtonRender).toHaveBeenCalledWith(
        expect.objectContaining({
          color: 'secondary',
          danger: false,
          disabled: false,
          size: 'large',
          variant: 'outlined',
        }),
      );
    });
  });
});
