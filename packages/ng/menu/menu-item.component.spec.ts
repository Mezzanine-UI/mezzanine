import { CommonModule } from '@angular/common';
import {
  configure,
  render,
  RenderResult,
} from '@testing-library/angular';
import { MznIconModule } from '@mezzanine-ui/ng/icon';
import { CheckIcon } from '@mezzanine-ui/icons';
import { MznMenuItemComponent } from './menu-item.component';

configure({
  defaultImports: [
    CommonModule,
    MznIconModule,
  ],
});

describe('MznMenuItemComponent', () => {
  it('should wrap children by label which rendered by div', async () => {
    const result = await render(MznMenuItemComponent, {
      template: `
        <li mzn-menu-item>foo</li>
      `,
    });

    const element = result.container.firstElementChild as HTMLElement;

    const { firstElementChild: labelElement } = element;

    expect(labelElement?.classList.contains('mzn-menu-item__label')).toBeTruthy();
    expect(labelElement?.tagName.toLowerCase()).toBe('div');
  });

  describe('input: active', () => {
    function testActive(element: HTMLElement, active: boolean) {
      const {
        lastElementChild: activeIconElement,
      } = element;

      expect(element.classList.contains('mzn-menu-item--active')).toBe(active);

      if (active) {
        expect(activeIconElement?.tagName.toLowerCase()).toBe('i');
        expect(activeIconElement?.getAttribute('data-icon-name')).toBe(CheckIcon.name);
      } else {
        expect(activeIconElement?.tagName.toLowerCase()).not.toBe('i');
      }
    }

    it('should render active=false by default', async () => {
      const result = await render(MznMenuItemComponent, {
        template: `
          <li mzn-menu-item>foo</li>
        `,
      });

      const element = result.container.firstElementChild as HTMLElement;

      testActive(element, false);
    });

    it('should add active class and render active icon if active=true, or not', async () => {
      let result: RenderResult<MznMenuItemComponent, Pick<MznMenuItemComponent, 'active'>> | undefined;

      for await (const active of [false, true]) {
        if (result) {
          result.rerender({
            active,
          });
        } else {
          result = await render(MznMenuItemComponent, {
            template: `
              <li mzn-menu-item [active]="active">foo</li>
            `,
            componentProperties: {
              active,
            },
          });
        }

        const element = result.container.firstElementChild as HTMLElement;

        testActive(element, active);
      }
    });
  });

  describe('input: disabled', () => {
    function testDisabled(element: HTMLElement, disabled: boolean) {
      expect(element.getAttribute('aria-disabled')).toBe(`${disabled}`);
      expect(element.classList.contains('mzn-menu-item--disabled')).toBe(disabled);
    }

    it('should render disabled=false by default', async () => {
      const result = await render(MznMenuItemComponent, {
        template: `
          <li mzn-menu-item>foo</li>
        `,
      });

      const element = result.container.firstElementChild as HTMLElement;

      testDisabled(element, false);
    });

    it('should has disabled and aria-disabled attributes if need', async () => {
      let result: RenderResult<MznMenuItemComponent, Pick<MznMenuItemComponent, 'disabled'>> | undefined;

      for await (const disabled of [false, true]) {
        if (result) {
          result.rerender({
            disabled,
          });
        } else {
          result = await render(MznMenuItemComponent, {
            template: `
              <li mzn-menu-item [disabled]="disabled">foo</li>
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

  describe('input: role', () => {
    it('should render role="menuitem" by default', async () => {
      const result = await render(MznMenuItemComponent, {
        template: `
          <li mzn-menu-item>foo</li>
        `,
      });

      const element = result.container.firstElementChild as HTMLElement;

      expect(element.getAttribute('role')).toBe('menuitem');
    });

    it('should override original role', async () => {
      const result = await render(MznMenuItemComponent, {
        template: `
          <li mzn-menu-item role="option">foo</li>
        `,
      });

      const element = result.container.firstElementChild as HTMLElement;

      expect(element.getAttribute('role')).toBe('option');
    });
  });
});
