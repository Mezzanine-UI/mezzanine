import { PlusIcon, SpinnerIcon } from '@mezzanine-ui/icons';
import { CommonModule } from '@angular/common';
import { configure, render } from '@testing-library/angular';
import { MznIconModule } from '@mezzanine-ui/ng/icon';
import { MznIconButtonComponent } from '.';

configure({
  defaultImports: [
    CommonModule,
    MznIconModule,
  ],
});

describe('MznIconButtonComponent', () => {
  it('should bind icon class', async () => {
    const { container } = await render(MznIconButtonComponent, {
      template: `
        <button mzn-icon-button></button>
      `,
    });
    const element = container.firstElementChild as HTMLElement;

    expect(element.classList.contains('mzn-button--icon')).toBeTruthy();
  });

  it('should replace icon in content while loading', async () => {
    const { container, rerender } = await render(MznIconButtonComponent, {
      template: `
        <button mzn-icon-button [loading]="loading">
          <i [mzn-icon]="icon"></i>
        </button>
      `,
      componentProperties: {
        icon: PlusIcon,
        loading: false,
      },
    });
    const element = container.firstElementChild as HTMLElement;

    expect(element.querySelector('i')?.getAttribute('data-icon-name')).toBe(PlusIcon.name);

    rerender({
      loading: true,
    });

    expect(element.querySelector('i')?.getAttribute('data-icon-name')).toBe(SpinnerIcon.name);
  });
});
