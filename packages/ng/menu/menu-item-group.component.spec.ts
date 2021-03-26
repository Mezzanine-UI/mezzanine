import { CommonModule } from '@angular/common';
import {
  configure,
  render,
} from '@testing-library/angular';
import { MznMenuItemGroupComponent } from './menu-item-group.component';

configure({
  defaultImports: [
    CommonModule,
  ],
});

describe('MznMenuItemGroupComponent', () => {
  it('should append class to ul if ng-content wrapped by ul', async () => {
    const result = await render(MznMenuItemGroupComponent, {
      template: `
      <li mzn-menu-item-group label="Group A"><ul>foo</ul></li>
      `,
    });

    const element = result.container.firstElementChild as HTMLElement;
    const {
      lastElementChild: listElement,
    } = element;

    expect(listElement?.tagName.toLowerCase()).toBe('ul');
    expect(listElement?.classList.contains('mzn-menu-item-group__items')).toBeTruthy();
    expect(listElement?.textContent).toBe('foo');
  });

  describe('input: label', () => {
    it('should render label wrapped by span', async () => {
      const result = await render(MznMenuItemGroupComponent, {
        template: `
        <li mzn-menu-item-group label="Group A"></li>
        `,
      });

      const element = result.container.firstElementChild as HTMLElement;
      const {
        firstElementChild: labelElement,
      } = element;

      expect(labelElement?.tagName.toLowerCase()).toBe('span');
      expect(labelElement?.classList.contains('mzn-menu-item-group__label')).toBeTruthy();
    });
  });
});
