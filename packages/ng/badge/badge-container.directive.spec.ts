import { CommonModule } from '@angular/common';
import {
  configure,
  render,
} from '@testing-library/angular';
import { MznIconModule } from '@mezzanine-ui/ng/icon';
import { MznTypographyModule } from '@mezzanine-ui/ng/typography';
import { MznBadgeContainerDirective } from '.';

configure({
  defaultImports: [
    CommonModule,
    MznIconModule,
    MznTypographyModule,
  ],
});

describe('MznBadgeContainerDirective', () => {
  it('should bind container class', async () => {
    const result = await render(MznBadgeContainerDirective, {
      template: `
        <span mznBadgeContainer></span>
      `,
    });
    const element = result.container.firstElementChild as HTMLElement;

    expect(element.classList.contains('mzn-badge__container')).toBeTruthy();
  });
});
