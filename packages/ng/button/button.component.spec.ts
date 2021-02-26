import { PlusIcon, SpinnerIcon } from '@mezzanine-ui/icons';
import { CommonModule } from '@angular/common';
import { configure, render } from '@testing-library/angular';
import { MznIconModule } from '@mezzanine-ui/ng/icon';
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

  describe('prefix', () => {
    it('should render icon before button label', async () => {
      const { container } = await render(MznButtonComponent, {
        template: `
          <button mzn-button><ng-template #prefix><i [mzn-icon]="icon"></i></ng-template>Hello</button>
        `,
        componentProperties: {
          icon: PlusIcon,
        },
      });
      const element = container.firstElementChild as HTMLElement;
      const {
        firstElementChild: prefixElement,
        lastElementChild: labelElement,
        childElementCount,
      } = element;

      expect(childElementCount).toBe(2);
      expect(prefixElement?.tagName.toLowerCase()).toBe('i');
      expect(prefixElement?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
      expect(labelElement?.textContent).toBe('Hello');
      expect(labelElement?.tagName.toLowerCase()).toBe('span');
    });
  });

  describe('suffix', () => {
    it('should render icon after button label', async () => {
      const { container } = await render(MznButtonComponent, {
        template: `
          <button mzn-button>Hello<ng-template #suffix><i [mzn-icon]="icon"></i></ng-template></button>
        `,
        componentProperties: {
          icon: PlusIcon,
        },
      });
      const element = container.firstElementChild as HTMLElement;
      const {
        firstElementChild: labelElement,
        lastElementChild: suffixElement,
        childElementCount,
      } = element;

      expect(childElementCount).toBe(2);
      expect(labelElement?.textContent).toBe('Hello');
      expect(labelElement?.tagName.toLowerCase()).toBe('span');
      expect(suffixElement?.tagName.toLowerCase()).toBe('i');
      expect(suffixElement?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
    });
  });

  describe('input: loading', () => {
    it('should place loading icon on the start if no prefix or suffix provided', async () => {
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

    it('should replace icon on the start w/ loading icon if only prefix provided', async () => {
      const { container } = await render(MznButtonComponent, {
        template: `
          <button mzn-button loading>
            <ng-template #prefix>
              <i [mzn-icon]="icon"></i>
            </ng-template>
            Hello
          </button>
        `,
        componentProperties: {
          icon: PlusIcon,
        },
      });
      const element = container.firstElementChild as HTMLElement;
      const { firstElementChild: loadingIconElement } = element;

      expect(loadingIconElement?.getAttribute('data-icon-name')).toBe(SpinnerIcon.name);
    });

    it('should replace icon on the end w/ loading icon if only suffix provided', async () => {
      const { container } = await render(MznButtonComponent, {
        template: `
          <button mzn-button loading>
            Hello
            <ng-template #suffix>
              <i [mzn-icon]="icon"></i>
            </ng-template>
          </button>
        `,
        componentProperties: {
          icon: PlusIcon,
        },
      });
      const element = container.firstElementChild as HTMLElement;
      const { lastElementChild: loadingIconElement } = element;

      expect(loadingIconElement?.getAttribute('data-icon-name')).toBe(SpinnerIcon.name);
    });

    it('should replace icon on the start w/ loading icon if both prefix and suffix provided', async () => {
      const { container } = await render(MznButtonComponent, {
        template: `
          <button mzn-button loading>
            <ng-template #prefix>
              <i [mzn-icon]="icon"></i>
            </ng-template>
            Hello
            <ng-template #suffix>
              <i [mzn-icon]="icon"></i>
            </ng-template>
          </button>
        `,
        componentProperties: {
          icon: PlusIcon,
        },
      });
      const element = container.firstElementChild as HTMLElement;
      const {
        firstElementChild: loadingIconElement,
        lastElementChild: suffixElement,
      } = element;

      expect(loadingIconElement?.getAttribute('data-icon-name')).toBe(SpinnerIcon.name);
      expect(suffixElement?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
    });
  });
});
