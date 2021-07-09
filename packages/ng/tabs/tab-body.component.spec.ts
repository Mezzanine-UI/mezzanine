import { CommonModule } from '@angular/common';
import {
  configure,
  render,
} from '@testing-library/angular';
import { MznTabBodyComponent } from '.';

configure({
  defaultImports: [
    CommonModule,
  ],
});

describe('MznTabBodyComponent', () => {
  describe('input: active and content', () => {
    it('should render nothing by default', async () => {
      const result = await render(MznTabBodyComponent, {
        template: `
          <div mzn-tab-body>Test</div>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.childElementCount).toBe(0);
    });

    it('should render content if active=true', async () => {
      const active = true;

      const result = await render(MznTabBodyComponent, {
        template: `
          <ng-template #test>Test</ng-template>

          <div mzn-tab-body [active]="active" [content]="test">
          </div>
        `,
        componentProperties: {
          active,
        },
      });

      const element = result.container.firstElementChild as HTMLElement;

      expect(element.textContent).toBe('Test');
    });
  });
});
