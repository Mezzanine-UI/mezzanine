import { CommonModule } from '@angular/common';
import {
  configure,
  render,
} from '@testing-library/angular';
import { MznTabsComponent, MznTabComponent, MznTabBodyComponent } from '.';

configure({
  defaultImports: [
    CommonModule,
  ],
});

function getTabElement(element: HTMLElement) {
  const { firstElementChild: tabBarElement } = element;
  const { firstElementChild: tabElement } = tabBarElement!;

  return tabElement;
}

describe('MznTabComponent', () => {
  describe('input: title', () => {
    it('should not render title div if not passed', async () => {
      const result = await render(MznTabsComponent, {
        declarations: [
          MznTabComponent,
          MznTabBodyComponent,
        ],
        template: `
          <mzn-tabs>
            <mzn-tab>
              tabPane
            </mzn-tab>
          </mzn-tabs>
        `,
      });

      const element = result.container.firstElementChild as HTMLElement;

      const tabElement = getTabElement(element);

      expect(tabElement!.childElementCount).toBe(0);
      expect(tabElement!.textContent).toBe('');
    });

    it('should render title wrapped by button', async () => {
      const result = await render(MznTabsComponent, {
        declarations: [
          MznTabComponent,
          MznTabBodyComponent,
        ],
        template: `
          <mzn-tabs>
            <mzn-tab title="tab">
              tabPane
            </mzn-tab>
          </mzn-tabs>
        `,
      });

      const element = result.container.firstElementChild as HTMLElement;

      const tabElement = getTabElement(element);

      expect(tabElement!.textContent).toBe('tab');
      expect(tabElement!.tagName.toLowerCase()).toBe('button');
      expect(tabElement!.classList.contains('mzn-tabs__tab')).toBeTruthy();
    });

    it('should render titleTemplate if provided in content', async () => {
      const result = await render(MznTabsComponent, {
        declarations: [
          MznTabComponent,
          MznTabBodyComponent,
        ],
        template: `
          <mzn-tabs>
            <mzn-tab>
              <ng-template #titleTemplate>
                <h1 class='template'>titleTemplate</h1>
              </ng-template>
              tabPane
            </mzn-tab>
          </mzn-tabs>
        `,
      });

      const element = result.container.firstElementChild as HTMLElement;

      const tabElement = getTabElement(element);

      const { firstElementChild: templateElement } = tabElement!;

      expect(templateElement!.textContent).toBe('titleTemplate');
      expect(templateElement!.tagName.toLowerCase()).toBe('h1');
      expect(templateElement!.classList.contains('template')).toBeTruthy();
    });
  });

  describe('input: disabled', () => {
    it('should render disabled=false by default', async () => {
      const result = await render(MznTabsComponent, {
        declarations: [
          MznTabComponent,
          MznTabBodyComponent,
        ],
        template: `
          <mzn-tabs>
            <mzn-tab title="tab0">
              tabPane0
            </mzn-tab>
          </mzn-tabs>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;

      const tabElement = getTabElement(element);

      expect(tabElement!.hasAttribute('disabled')).toBe(false);
      expect(tabElement!.getAttribute('aria-disabled')).toBe(`${false}`);
    });
    it('should has disabled and aria-disabled attributes if disabled=true', async () => {
      const disabled = true;

      const result = await render(MznTabsComponent, {
        declarations: [
          MznTabComponent,
          MznTabBodyComponent,
        ],
        template: `
          <mzn-tabs>
            <mzn-tab title="tab0" [disabled]="disabled">
              tabPane0
            </mzn-tab>
          </mzn-tabs>
        `,
        componentProperties: {
          disabled,
        },
      });
      const element = result.container.firstElementChild as HTMLElement;

      const tabElement = getTabElement(element);

      expect(tabElement!.hasAttribute('disabled')).toBe(disabled);
      expect(tabElement!.getAttribute('aria-disabled')).toBe(`${disabled}`);
    });
  });
});
