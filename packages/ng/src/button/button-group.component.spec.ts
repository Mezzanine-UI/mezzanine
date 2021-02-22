import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { configure, render, RenderResult } from '@testing-library/angular';
import { toCssVar } from '@mezzanine-ui/system/css';
import { MznIconModule } from '../icon';
import {
  ButtonColor,
  ButtonGroupOrientation,
  ButtonGroupSpacing,
  ButtonSize,
  ButtonVariant,
  MznButtonComponent,
  MznButtonGroupComponent,
} from '.';

configure({
  defaultImports: [
    CommonModule,
    MznIconModule,
  ],
});

describe('MznButtonGroupComponent', () => {
  it('should bind host class', async () => {
    const { container } = await render(MznButtonGroupComponent, {
      template: `
        <mzn-button-group>
          <button mzn-button>Hello</button>
          <button mzn-button>Hello</button>
          <button mzn-button>Hello</button>
        </mzn-button-group>
      `,
    });
    const element = container.firstElementChild as HTMLElement;

    expect(element.classList.contains('mzn-button-group')).toBeTruthy();
  });

  it('shoulde just wrap buttons', async () => {
    const { container } = await render(MznButtonGroupComponent, {
      template: `
        <mzn-button-group>
          <button mzn-button>Hello</button>
          <button mzn-button>Hello</button>
          <button mzn-button>Hello</button>
        </mzn-button-group>
      `,
    });
    const element = container.firstElementChild as HTMLElement;
    const {
      childElementCount,
      children,
    } = element;

    for (let i = 0; i < children.length; i += 1) {
      const child = children[i];

      expect(child.tagName.toLowerCase()).toBe('button');
    }

    expect(childElementCount).toBe(3);
  });

  describe('input:attached', () => {
    function testAttached(element: HTMLElement, attached: boolean) {
      expect(element.classList.contains('mzn-button-group--attached')).toBe(attached);
    }

    it('should render attached=false by default', async () => {
      const { container } = await render(MznButtonGroupComponent, {
        template: `
          <mzn-button-group>
            <button mzn-button>Hello</button>
          </mzn-button-group>
        `,
      });
      const element = container.firstElementChild as HTMLElement;

      testAttached(element, false);
    });

    it('should add class if need', async () => {
      let result: RenderResult<MznButtonGroupComponent> | undefined;

      for await (const attached of [false, true]) {
        if (result) {
          result.rerender({
            attached,
          });
        } else {
          result = await render(MznButtonGroupComponent, {
            template: `
              <mzn-button-group [attached]="attached">
                <button mzn-button>Hello</button>
              </mzn-button-group>
            `,
            componentProperties: {
              attached,
            },
          });
        }

        const element = result.container.firstElementChild as HTMLElement;

        testAttached(element, attached);
      }
    });
  });

  describe('input:fullWidth', () => {
    function testFullWidth(element: HTMLElement, fullWidth: boolean) {
      expect(element.classList.contains('mzn-button-group--full-width')).toBe(fullWidth);
    }

    it('should render fullWidth=false by default', async () => {
      const { container } = await render(MznButtonGroupComponent, {
        template: `
          <mzn-button-group>
            <button mzn-button>Hello</button>
          </mzn-button-group>
        `,
      });
      const element = container.firstElementChild as HTMLElement;

      testFullWidth(element, false);
    });

    it('should add class if need', async () => {
      let result: RenderResult<MznButtonGroupComponent> | undefined;

      for await (const fullWidth of [false, true]) {
        if (result) {
          result.rerender({
            fullWidth,
          });
        } else {
          result = await render(MznButtonGroupComponent, {
            template: `
              <mzn-button-group [fullWidth]="fullWidth">
                <button mzn-button>Hello</button>
              </mzn-button-group>
            `,
            componentProperties: {
              fullWidth,
            },
          });
        }

        const element = result.container.firstElementChild as HTMLElement;

        testFullWidth(element, fullWidth);
      }
    });
  });

  describe('input:orientation', () => {
    function testOrientation(element: HTMLElement, orientation: ButtonGroupOrientation) {
      expect(element.getAttribute('aria-orientation')).toBe(orientation);
      expect(element.classList.contains(`mzn-button-group--${orientation}`)).toBeTruthy();
    }

    it('should render orientation="horizontal" by default', async () => {
      const { container } = await render(MznButtonGroupComponent, {
        template: `
          <mzn-button-group>
            <button mzn-button>Hello</button>
          </mzn-button-group>
        `,
      });
      const element = container.firstElementChild as HTMLElement;

      testOrientation(element, 'horizontal');
    });

    it('should add "aria-orientation" attribute and class', async () => {
      const orientations: ButtonGroupOrientation[] = [
        'horizontal',
        'vertical',
      ];
      let result: RenderResult<MznButtonGroupComponent> | undefined;

      for await (const orientation of orientations) {
        if (result) {
          result.rerender({
            orientation,
          });
        } else {
          result = await render(MznButtonGroupComponent, {
            template: `
              <mzn-button-group [orientation]="orientation">
                <button mzn-button>Hello</button>
              </mzn-button-group>
            `,
            componentProperties: {
              orientation,
            },
          });
        }

        const element = result.container.firstElementChild as HTMLElement;

        testOrientation(element, orientation);
      }
    });
  });

  describe('input: role', () => {
    it('should render role="group" by default', async () => {
      const { container } = await render(MznButtonGroupComponent, {
        template: `
          <mzn-button-group>
            <button mzn-button>Hello</button>
          </mzn-button-group>
        `,
      });
      const element = container.firstElementChild as HTMLElement;

      expect(element.getAttribute('role')).toBe('group');
    });
  });

  describe('input: spacing', () => {
    it('should render spacing=4 by default(size=medium)', async () => {
      const { container } = await render(MznButtonGroupComponent, {
        template: `
          <mzn-button-group>
            <button mzn-button>Hello</button>
          </mzn-button-group>
        `,
      });
      const element = container.firstElementChild as HTMLElement;

      expect(element.style.getPropertyValue('--mzn-button-group-spacing')).toBe(toCssVar('mzn-spacing-4'));
    });

    it('should set spacing to corresponding size', async () => {
      const sizeSpacingMaps: [ButtonSize, ButtonGroupSpacing][] = [
        ['large', 4],
        ['medium', 4],
        ['small', 3],
      ];
      let result: RenderResult<MznButtonGroupComponent> | undefined;

      for await (const [size, spacing] of sizeSpacingMaps) {
        if (result) {
          result.rerender({
            size,
          });
        } else {
          result = await render(MznButtonGroupComponent, {
            template: `
              <mzn-button-group [size]="size">
                <button mzn-button>Hello</button>
              </mzn-button-group>
            `,
            componentProperties: {
              size,
            },
          });
        }

        const element = result.container.firstElementChild as HTMLElement;

        expect(element.style.getPropertyValue('--mzn-button-group-spacing')).toBe(toCssVar(`mzn-spacing-${spacing}`));
      }
    });

    it('should override spacing by passed spacing', async () => {
      const spacing: ButtonGroupSpacing = 1;
      const { container } = await render(MznButtonGroupComponent, {
        template: `
          <mzn-button-group size="small" [spacing]="spacing">
            <button mzn-button>Hello</button>
          </mzn-button-group>
        `,
        componentProperties: {
          spacing,
        },
      });
      const element = container.firstElementChild as HTMLElement;

      expect(element.style.getPropertyValue('--mzn-button-group-spacing')).toBe(toCssVar(`mzn-spacing-${spacing}`));
    });
  });

  describe('inputs: color,disabled,error,size,variant that can accept inputs from button group', () => {
    function testOverrideInputs(
      buttonComponent: MznButtonComponent,
      buttonElementRef: ElementRef<HTMLButtonElement>,
      {
        color,
        disabled,
        error,
        size,
        variant,
      }: Required<Pick<MznButtonGroupComponent, 'color' | 'disabled' | 'error' | 'size' | 'variant'>>,
    ) {
      const buttonElement = buttonElementRef.nativeElement;

      expect(buttonComponent.color).toBe(color);
      expect(buttonElement.classList.contains(`mzn-button--${color}`)).toBeTruthy();

      expect(buttonComponent.disabled).toBe(disabled);
      expect(buttonElement.hasAttribute('disabled')).toBe(disabled);
      expect(buttonElement.getAttribute('aria-disabled')).toBe(`${disabled}`);

      expect(buttonComponent.error).toBe(error);
      expect(buttonElement.classList.contains('mzn-button--error')).toBe(error);

      expect(buttonComponent.size).toBe(size);
      expect(buttonElement.classList.contains(`mzn-button--${size}`)).toBeTruthy();

      expect(buttonComponent.variant).toBe(variant);
      expect(buttonElement.classList.contains(`mzn-button--${variant}`)).toBe(variant !== 'text');
    }

    it('all by default', async () => {
      @Component({
        selector: 'mzn-testing',
        template: `
          <mzn-button-group>
            <button #button mzn-button>Hello</button>
          </mzn-button-group>
        `,
      })
      class TestingComponent {
        @ViewChild('button')
        button: MznButtonComponent;

        @ViewChild('button', { read: ElementRef })
        buttonElementRef: ElementRef<HTMLButtonElement>;
      }

      const { fixture } = await render(TestingComponent, {
        declarations: [MznButtonComponent, MznButtonGroupComponent],
      });

      testOverrideInputs(
        fixture.componentInstance.button,
        fixture.componentInstance.buttonElementRef,
        {
          color: 'primary',
          disabled: false,
          error: false,
          size: 'medium',
          variant: 'text',
        },
      );
    });

    it('provided by group', async () => {
      const expects: Required<Pick<MznButtonGroupComponent, 'color' | 'disabled' | 'error' | 'size' | 'variant'>> = {
        color: 'secondary',
        disabled: true,
        error: true,
        size: 'small',
        variant: 'contained',
      };

      @Component({
        selector: 'mzn-testing',
        template: `
          <mzn-button-group
            [color]="color"
            [disabled]="disabled"
            [error]="error"
            [size]="size"
            [variant]="variant"
          >
            <button #button mzn-button>Hello</button>
          </mzn-button-group>
        `,
      })
      class TestingComponent {
        @ViewChild('button')
        button: MznButtonComponent;

        @ViewChild('button', { read: ElementRef })
        buttonElementRef: ElementRef<HTMLButtonElement>;

        color: ButtonColor = expects.color;

        disabled = expects.disabled;

        error = expects.error;

        size: ButtonSize = expects.size;

        variant: ButtonVariant = expects.variant;
      }

      const { fixture, rerender } = await render(TestingComponent, {
        declarations: [MznButtonComponent, MznButtonGroupComponent],
      });

      testOverrideInputs(
        fixture.componentInstance.button,
        fixture.componentInstance.buttonElementRef,
        expects,
      );

      expects.color = 'primary';
      rerender(expects);
      testOverrideInputs(
        fixture.componentInstance.button,
        fixture.componentInstance.buttonElementRef,
        expects,
      );

      expects.disabled = false;
      rerender(expects);
      testOverrideInputs(
        fixture.componentInstance.button,
        fixture.componentInstance.buttonElementRef,
        expects,
      );

      expects.error = false;
      rerender(expects);
      testOverrideInputs(
        fixture.componentInstance.button,
        fixture.componentInstance.buttonElementRef,
        expects,
      );

      expects.size = 'large';
      rerender(expects);
      testOverrideInputs(
        fixture.componentInstance.button,
        fixture.componentInstance.buttonElementRef,
        expects,
      );

      expects.variant = 'outlined';
      rerender(expects);
      testOverrideInputs(
        fixture.componentInstance.button,
        fixture.componentInstance.buttonElementRef,
        expects,
      );
    });

    it('should not override if child explicitly provided props', async () => {
      @Component({
        selector: 'mzn-testing',
        template: `
          <mzn-button-group
            color="primary"
            disabled
            error
            size="small"
            variant="contained"
          >
            <button
              #button
              mzn-button="outlined"
              color="secondary"
              [disabled]="false"
              [error]="false"
              size="large"
            >
              Hello
            </button>
          </mzn-button-group>
        `,
      })
      class TestingComponent {
        @ViewChild('button')
        button: MznButtonComponent;

        @ViewChild('button', { read: ElementRef })
        buttonElementRef: ElementRef<HTMLButtonElement>;
      }

      const { fixture } = await render(TestingComponent, {
        declarations: [MznButtonComponent, MznButtonGroupComponent],
      });

      testOverrideInputs(
        fixture.componentInstance.button,
        fixture.componentInstance.buttonElementRef,
        {
          color: 'secondary',
          disabled: false,
          error: false,
          size: 'large',
          variant: 'outlined',
        },
      );
    });
  });
});
