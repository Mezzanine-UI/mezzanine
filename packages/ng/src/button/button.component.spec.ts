import { PlusIcon, SpinnerIcon } from '@mezzanine-ui/icons';
import { CommonModule } from '@angular/common';
import { configure, render } from '@testing-library/angular';
import { MznIconModule } from '../icon';
import { MznButtonComponent } from '.';

configure({
  defaultImports: [
    CommonModule,
    MznIconModule,
  ],
});

describe('MznButtonComponent', () => {
  it('should render the text and wrap it by button label rendered by span', async () => {
    const { container, getByText } = await render(MznButtonComponent, {
      template: `
        <button mzn-button>Hello</button>
      `,
    });
    const element = container.firstElementChild as HTMLElement;
    const labelElement = getByText('Hello');

    expect(element.textContent).toBe('Hello');
    expect(labelElement.textContent).toBe('Hello');
    expect(labelElement.tagName.toLowerCase()).toBe('span');
    expect(labelElement.classList.contains('mzn-button__label')).toBeTruthy();
  });

  describe('icon', () => {
    describe('on the start', () => {
      it('should render icon before button label', async () => {
        const { container } = await render(MznButtonComponent, {
          template: `
            <button mzn-button>Hello<i [mzn-icon]="icon"></i></button>
          `,
          componentProperties: {
            icon: PlusIcon,
          },
        });
        const element = container.firstElementChild as HTMLElement;
        const {
          firstElementChild: iconStartElement,
          lastElementChild: labelElement,
          childElementCount,
        } = element;

        expect(childElementCount).toBe(2);
        expect(iconStartElement?.tagName.toLowerCase()).toBe('i');
        expect(iconStartElement?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
        expect(labelElement?.textContent).toBe('Hello');
        expect(labelElement?.tagName.toLowerCase()).toBe('span');
      });
    });

    describe('on the end', () => {
      it('should render icon after button label', async () => {
        const { container } = await render(MznButtonComponent, {
          template: `
            <button mzn-button iconOnEnd>Hello<i [mzn-icon]="icon"></i></button>
          `,
          componentProperties: {
            icon: PlusIcon,
          },
        });
        const element = container.firstElementChild as HTMLElement;
        const {
          firstElementChild: labelElement,
          lastElementChild: iconEndElement,
          childElementCount,
        } = element;

        expect(childElementCount).toBe(2);
        expect(labelElement?.textContent).toBe('Hello');
        expect(labelElement?.tagName.toLowerCase()).toBe('span');
        expect(iconEndElement?.tagName.toLowerCase()).toBe('i');
        expect(iconEndElement?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
      });
    });
  });

  describe('input: loading', () => {
    it('should place loading icon on the start if no icon provided', async () => {
      const { container } = await render(MznButtonComponent, {
        template: `
          <button mzn-button loading>Hello</button>
        `,
        componentProperties: {
          icon: PlusIcon,
        },
      });
      const element = container.firstElementChild as HTMLElement;
      const { firstElementChild: loadingIconElement } = element;

      expect(loadingIconElement?.getAttribute('data-icon-name')).toBe(SpinnerIcon.name);
    });

    it('should replace icon on the start w/ loading icon if iconOnEnd=false', async () => {
      const { container } = await render(MznButtonComponent, {
        template: `
          <button mzn-button loading><i [mzn-icon]="icon"></i>Hello</button>
        `,
        componentProperties: {
          icon: PlusIcon,
        },
      });
      const element = container.firstElementChild as HTMLElement;
      const { firstElementChild: loadingIconElement } = element;

      expect(loadingIconElement?.getAttribute('data-icon-name')).toBe(SpinnerIcon.name);
    });

    it('should replace icon on the end w/ loading icon if iconOnEnd=true', async () => {
      const { container } = await render(MznButtonComponent, {
        template: `
          <button mzn-button iconOnEnd loading>Hello<i [mzn-icon]="icon"></i></button>
        `,
        componentProperties: {
          icon: PlusIcon,
        },
      });
      const element = container.firstElementChild as HTMLElement;
      const { lastElementChild: loadingIconElement } = element;

      expect(loadingIconElement?.getAttribute('data-icon-name')).toBe(SpinnerIcon.name);
    });
  });
});
