import { CommonModule } from '@angular/common';
import {
  configure,
  render,
  RenderResult,
} from '@testing-library/angular';
import { MznIconModule } from '../icon';
import { MznTypographyModule } from '../typography';
import { MznBadgeComponent } from '.';

configure({
  defaultImports: [
    CommonModule,
    MznIconModule,
    MznTypographyModule,
  ],
});

describe('MznBadgeComponent', () => {
  it('should bind host class', async () => {
    const result = await render(MznBadgeComponent, {
      template: `
        <mzn-badge></mzn-badge>
      `,
    });
    const element = result.container.firstElementChild as HTMLElement;

    expect(element.classList.contains('mzn-badge')).toBeTruthy();
  });

  describe('input: content', () => {
    it('should bind hide class if not dot and count === 0', async () => {
      function expectBind(element: HTMLElement, bind: boolean) {
        expect(element.classList.contains('mzn-badge--hide')).toBe(bind);
      }

      const result = await render(MznBadgeComponent, {
        template: `
          <mzn-badge [content]="content" [dot]="dot"></mzn-badge>
        `,
        componentProperties: {
          content: 0,
          dot: true,
        },
      });
      const element = result.container.firstElementChild as HTMLElement;

      expectBind(element, false);

      result.rerender({
        content: 0,
        dot: false,
      });
      expectBind(element, true);

      result.rerender({
        content: 99,
        dot: false,
      });
      expectBind(element, false);
    });

    it('should render overflowCount with a "+" sign if count > overflowCount', async () => {
      const count = 999;
      const overflowCount = 99;
      const result = await render(MznBadgeComponent, {
        template: `
          <mzn-badge [content]="count" [overflowCount]="overflowCount"></mzn-badge>
        `,
        componentProperties: {
          count,
          overflowCount,
        },
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.textContent).toBe(`${overflowCount}+`);
    });

    it('should render count if count <= overflowCount', async () => {
      const count = 5;
      const overflowCount = 99;
      const result = await render(MznBadgeComponent, {
        template: `
          <mzn-badge [content]="count" [overflowCount]="overflowCount"></mzn-badge>
        `,
        componentProperties: {
          count,
          overflowCount,
        },
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.textContent).toBe(`${count}`);
    });

    it('should render template if content is TemplateRef', async () => {
      const result = await render(MznBadgeComponent, {
        template: `
          <mzn-badge [content]="content">
            <ng-template #content>
              <div class="foo">foo</div>
            </ng-template>
          </mzn-badge>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;
      const fooElement = element.querySelector('.foo');

      expect(fooElement?.textContent).toBe('foo');
    });
  });

  describe('input: dot', () => {
    it('should render dot=false by default', async () => {
      const result = await render(MznBadgeComponent, {
        template: `
          <mzn-badge></mzn-badge>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.classList.contains('mzn-badge--dot')).toBeFalsy();
    });

    it('should bind dot class if dot=true', async () => {
      let result: RenderResult<MznBadgeComponent> | undefined;

      for await (const dot of [false, true]) {
        if (result) {
          result.rerender({
            dot,
          });
        } else {
          result = await render(MznBadgeComponent, {
            template: `
              <mzn-badge [dot]="dot"></mzn-badge>
            `,
            componentProperties: {
              dot,
            },
          });
        }

        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains('mzn-badge--dot')).toBe(dot);
      }
    });

    it('should not render any children', async () => {
      const result = await render(MznBadgeComponent, {
        template: `
          <mzn-badge [content]="100" dot></mzn-badge>
        `,
      });
      const {
        childElementCount,
        textContent,
      } = result.container.firstElementChild as HTMLElement;

      expect(childElementCount).toBe(0);
      expect(textContent).toBe('');
    });
  });
});
