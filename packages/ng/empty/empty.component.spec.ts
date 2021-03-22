import { CommonModule } from '@angular/common';
import {
  configure,
  render,
  RenderResult,
} from '@testing-library/angular';
import { MznIconModule } from '@mezzanine-ui/ng/icon';
import { MznTypographyModule } from '@mezzanine-ui/ng/typography';
import { MznEmptyComponent } from '.';

configure({
  defaultImports: [
    CommonModule,
    MznIconModule,
    MznTypographyModule,
  ],
});

describe('MznEmptyComponent', () => {
  it('should bind host class', async () => {
    const result = await render(MznEmptyComponent, {
      template: `
        <mzn-empty></mzn-empty>
      `,
    });
    const element = result.container.firstElementChild as HTMLElement;

    expect(element.classList.contains('mzn-empty')).toBeTruthy();
  });

  it('should wrap description by div', async () => {
    const { container, getByText } = await render(MznEmptyComponent, {
      template: `
        <mzn-empty>No Data</mzn-empty>
      `,
    });
    const element = container.firstElementChild as HTMLElement;
    const descriptionElement = getByText('No Data');

    expect(element.textContent).toBe('No Data');
    expect(descriptionElement.textContent).toBe('No Data');
    expect(descriptionElement.tagName.toLowerCase()).toBe('div');
  });

  describe('input: fullHeight', () => {
    it('should render fullHeight=false by default', async () => {
      const { container } = await render(MznEmptyComponent, {
        template: `
          <mzn-empty>No Data</mzn-empty>
        `,
      });
      const element = container.firstElementChild as HTMLElement;

      expect(element.classList.contains('mzn-empty--full-height')).toBeFalsy();
    });

    it('should add class if fullHeight=true', async () => {
      let result: RenderResult<MznEmptyComponent, Pick<MznEmptyComponent, 'fullHeight'>> | undefined;

      for await (const fullHeight of [false, true]) {
        if (result) {
          result.rerender({
            fullHeight,
          });
        } else {
          result = await render(MznEmptyComponent, {
            template: `
              <mzn-empty [fullHeight]="fullHeight">No Data</mzn-empty>
            `,
            componentProperties: {
              fullHeight,
            },
          });
        }

        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains('mzn-empty--full-height')).toBe(fullHeight);
      }
    });
  });

  describe('input: image', () => {
    it('should render default icon if not provided', async () => {
      const { container } = await render(MznEmptyComponent, {
        template: `
          <mzn-empty>No Data</mzn-empty>
        `,
      });
      const element = container.firstElementChild as HTMLElement;
      const iconElement = element.querySelector('.mzn-empty__icon');

      expect(iconElement).toBeInstanceOf(HTMLElement);
    });

    it('should render passed in image if provided', async () => {
      const { container } = await render(MznEmptyComponent, {
        template: `
          <mzn-empty [image]="image">
            <ng-template #image>
              <div id="test-image"></div>
            </ng-template>
            No Data
          </mzn-empty>
        `,
      });
      const element = container.firstElementChild as HTMLElement;
      const iconElement = element.querySelector('.mzn-empty__icon');
      const customImageElement = element.querySelector('#test-image');

      expect(iconElement).toBe(null);
      expect(customImageElement).toBeInstanceOf(HTMLElement);
    });
  });

  describe('input: title', () => {
    it('should not render title div if not passed', async () => {
      const { container } = await render(MznEmptyComponent, {
        template: `
          <mzn-empty>No Data</mzn-empty>
        `,
      });
      const element = container.firstElementChild as HTMLElement;

      expect(element.querySelector('.mzn-empty__title')).toBe(null);
    });

    it('should wrap title by div', async () => {
      const { getByText } = await render(MznEmptyComponent, {
        template: `
          <mzn-empty title="title">No Data</mzn-empty>
        `,
      });
      const titleElement = getByText('title');

      expect(titleElement.textContent).toBe('title');
      expect(titleElement.tagName.toLowerCase()).toBe('div');
      expect(titleElement.classList.contains('mzn-empty__title')).toBeTruthy();
    });
  });
});
