import { CommonModule } from '@angular/common';
import {
  configure,
  render,
} from '@testing-library/angular';
import { MenuSize } from '@mezzanine-ui/core/menu';
import { MznMenuComponent } from '.';

configure({
  defaultImports: [
    CommonModule,
  ],
});

describe('MznMenuComponent', () => {
  it('should bind host class', async () => {
    const result = await render(MznMenuComponent, {
      template: `
        <ul mzn-menu></ul>
      `,
    });

    const element = result.container.firstElementChild as HTMLElement;

    expect(element.classList.contains('mzn-menu')).toBeTruthy();
  });

  describe('input: itemsInView', () => {
    it('should render itemsInView=4 by default', async () => {
      const result = await render(MznMenuComponent, {
        template: `
          <ul mzn-menu></ul>
        `,
      });

      const element = result.container.firstElementChild as HTMLElement;

      expect(element.style.getPropertyValue('--mzn-menu-items-in-view')).toBe('4');
    });

    it('should bind css variable from props', async () => {
      const result = await render(MznMenuComponent, {
        template: `
          <ul mzn-menu itemsInView="5"></ul>
        `,
      });

      const element = result.container.firstElementChild as HTMLElement;

      expect(element.style.getPropertyValue('--mzn-menu-items-in-view')).toBe('5');
    });
  });

  describe('input: maxHeight', () => {
    it('should bind css variable', async () => {
      const result = await render(MznMenuComponent, {
        template: `
          <ul mzn-menu maxHeight="200"></ul>
        `,
      });

      const element = result.container.firstElementChild as HTMLElement;

      expect(element.style.getPropertyValue('--mzn-menu-max-height')).toBe('200px');
    });
  });

  describe('input: role', () => {
    it('should render role="menu" by default', async () => {
      const result = await render(MznMenuComponent, {
        template: `
          <ul mzn-menu></ul>
        `,
      });

      const element = result.container.firstElementChild as HTMLElement;

      expect(element.getAttribute('role')).toBe('menu');
    });

    it('should override original role', async () => {
      const result = await render(MznMenuComponent, {
        template: `
          <ul mzn-menu role="select"></ul>
        `,
      });

      const element = result.container.firstElementChild as HTMLElement;

      expect(element.getAttribute('role')).toBe('select');
    });
  });

  describe('input: size', () => {
    it('should render size="medium" by default', async () => {
      const result = await render(MznMenuComponent, {
        template: `
          <ul mzn-menu></ul>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.classList.contains('mzn-menu--medium')).toBeTruthy();
    });

    const sizes: MenuSize[] = [
      'small',
      'medium',
      'large',
    ];

    sizes.forEach((size) => {
      it(`should add class if size="${size}"`, async () => {
        const result = await render(MznMenuComponent, {
          template: `
            <ul mzn-menu [size]="size"></ul>
          `,
          componentProperties: {
            size,
          },
        });
        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains(`mzn-menu--${size}`)).toBeTruthy();
      });
    });
  });
});
