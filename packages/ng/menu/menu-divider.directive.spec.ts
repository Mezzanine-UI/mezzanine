import { CommonModule } from '@angular/common';
import {
  configure,
  render,
} from '@testing-library/angular';
import { MznIconModule } from '@mezzanine-ui/ng/icon';
import { MznMenuDividerDirective } from './menu-divider.directive';

configure({
  defaultImports: [
    CommonModule,
    MznIconModule,
  ],
});

describe('MznMenuDividerDirective', () => {
  it('should be rendered by <hr />', async () => {
    const result = await render(MznMenuDividerDirective, {
      template: `
        <hr mznMenuDivider />
      `,
    });

    const element = result.container.firstElementChild as HTMLElement;

    expect(element.tagName.toLowerCase()).toBe('hr');
  });
});
