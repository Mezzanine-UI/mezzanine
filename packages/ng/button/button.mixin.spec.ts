import { CommonModule } from '@angular/common';
import {
  Component, ElementRef, Input, Renderer2,
} from '@angular/core';
import {
  configure,
  render,
  RenderResult,
} from '@testing-library/angular';
import { MznIconModule } from '@mezzanine-ui/ng/icon';
import { MznButtonMixin } from './button.mixin';
import { ButtonColor, ButtonSize, ButtonVariant } from '.';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[mzn-testing-button],a[mzn-testing-button]',
  template: '<ng-content></ng-content>',
})
class TestingButtonComponent extends MznButtonMixin {
  constructor(elementRef: ElementRef<HTMLElement>, renderer: Renderer2) {
    super(elementRef, renderer);
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('variant')
  protected _variant: ButtonVariant;
}

configure({
  defaultImports: [
    CommonModule,
    MznIconModule,
  ],
});

describe('MznButtonMixin', () => {
  it('should bind host class', async () => {
    const result = await render(TestingButtonComponent, {
      template: `
        <button mzn-testing-button>Hello</button>
      `,
    });
    const element = result.container.firstElementChild as HTMLElement;

    expect(element.classList.contains('mzn-button')).toBeTruthy();
  });

  describe('input: color', () => {
    it('should render color="primary" by default', async () => {
      const result = await render(TestingButtonComponent, {
        template: `
          <button mzn-testing-button>Hello</button>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.classList.contains('mzn-button--primary')).toBeTruthy();
    });

    const colors: ButtonColor[] = [
      'primary',
      'secondary',
    ];

    colors.forEach((color) => {
      it(`should add class if color="${color}"`, async () => {
        const result = await render(TestingButtonComponent, {
          template: `
            <button mzn-testing-button [color]="color">Hello</button>
          `,
          componentProperties: {
            color,
          },
        });
        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains(`mzn-button--${color}`)).toBeTruthy();
      });
    });

    it('should sync class after changed', async () => {
      let result: RenderResult<TestingButtonComponent> | undefined;

      for await (const color of colors) {
        if (result) {
          result.rerender({
            color,
          });
        } else {
          result = await render(TestingButtonComponent, {
            template: `
              <button mzn-testing-button [color]="color">Hello</button>
            `,
            componentProperties: {
              color,
            },
          });
        }

        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains(`mzn-button--${color}`)).toBeTruthy();
      }
    });
  });

  describe('input:danger', () => {
    it('should render danger=false by default', async () => {
      const result = await render(TestingButtonComponent, {
        template: `
          <button mzn-testing-button>Hello</button>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.classList.contains('mzn-button--danger')).toBeFalsy();
    });

    it('should add class if danger=true', async () => {
      let result: RenderResult<TestingButtonComponent> | undefined;

      for await (const danger of [false, true]) {
        if (result) {
          result.rerender({
            danger,
          });
        } else {
          result = await render(TestingButtonComponent, {
            template: `
              <button mzn-testing-button [danger]="danger">Hello</button>
            `,
            componentProperties: {
              danger,
            },
          });
        }

        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains('mzn-button--danger')).toBe(danger);
      }
    });
  });

  describe('input: disabled', () => {
    function testDisabled(element: HTMLElement, disabled: boolean) {
      expect(element.classList.contains('mzn-button--disabled')).toBe(disabled);
      expect(element.hasAttribute('disabled')).toBe(disabled);
      expect(element.getAttribute('aria-disabled')).toBe(`${disabled}`);
    }

    it('should render disabled=false by default', async () => {
      const result = await render(TestingButtonComponent, {
        template: `
          <button mzn-testing-button>Hello</button>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;

      testDisabled(element, false);
    });

    it('should has disabled and aria-disabled attributes if need', async () => {
      let result: RenderResult<TestingButtonComponent> | undefined;

      for await (const disabled of [false, true]) {
        if (result) {
          result.rerender({
            disabled,
          });
        } else {
          result = await render(TestingButtonComponent, {
            template: `
              <button mzn-testing-button [disabled]="disabled">Hello</button>
            `,
            componentProperties: {
              disabled,
            },
          });
        }

        const element = result.container.firstElementChild as HTMLElement;

        testDisabled(element, disabled);
      }
    });
  });

  describe('input: loading', () => {
    it('should render loading=false by default', async () => {
      const result = await render(TestingButtonComponent, {
        template: `
          <button mzn-testing-button>Hello</button>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.classList.contains('mzn-button--loading')).toBeFalsy();
    });

    it('should add class if loading=false', async () => {
      let result: RenderResult<TestingButtonComponent> | undefined;

      for await (const loading of [false, true]) {
        if (result) {
          result.rerender({
            loading,
          });
        } else {
          result = await render(TestingButtonComponent, {
            template: `
              <button mzn-testing-button [loading]="loading">Hello</button>
            `,
            componentProperties: {
              loading,
            },
          });
        }

        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains('mzn-button--loading')).toBe(loading);
      }
    });
  });

  describe('input: size', () => {
    it('should render size="medium" by default', async () => {
      const result = await render(TestingButtonComponent, {
        template: `
          <button mzn-testing-button>Hello</button>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.classList.contains('mzn-button--medium')).toBeTruthy();
    });

    const sizes: ButtonSize[] = [
      'small',
      'medium',
      'large',
    ];

    sizes.forEach((size) => {
      it(`should add class if size="${size}"`, async () => {
        const result = await render(TestingButtonComponent, {
          template: `
            <button mzn-testing-button [size]="size">Hello</button>
          `,
          componentProperties: {
            size,
          },
        });
        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains(`mzn-button--${size}`)).toBeTruthy();
      });
    });

    it('should sync class after changed', async () => {
      let result: RenderResult<TestingButtonComponent> | undefined;

      for await (const size of sizes) {
        if (result) {
          result.rerender({
            size,
          });
        } else {
          result = await render(TestingButtonComponent, {
            template: `
              <button mzn-testing-button [size]="size">Hello</button>
            `,
            componentProperties: {
              size,
            },
          });
        }

        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains(`mzn-button--${size}`)).toBeTruthy();
      }
    });
  });

  describe('input: variant', () => {
    it('should render variant="text" by default. The text button doesn\'t have specific class', async () => {
      const result = await render(TestingButtonComponent, {
        template: `
          <button mzn-testing-button>Hello</button>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.classList.contains('mzn-button')).toBeTruthy();
    });

    const variants: ButtonVariant[] = [
      'text',
      'outlined',
      'contained',
    ];

    variants.forEach((variant) => {
      it(`should add class as need if variant="${variant}"`, async () => {
        const result = await render(TestingButtonComponent, {
          template: `
            <button mzn-testing-button [variant]="variant">Hello</button>
          `,
          componentProperties: {
            variant,
          },
        });
        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains(`mzn-button--${variant}`)).toBe(variant !== 'text');
      });
    });

    it('should sync class after changed', async () => {
      let result: RenderResult<TestingButtonComponent> | undefined;

      for await (const variant of variants) {
        if (result) {
          result.rerender({
            variant,
          });
        } else {
          result = await render(TestingButtonComponent, {
            template: `
              <button mzn-testing-button [variant]="variant">Hello</button>
            `,
            componentProperties: {
              variant,
            },
          });
        }

        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains(`mzn-button--${variant}`)).toBe(variant !== 'text');
      }
    });
  });
});
