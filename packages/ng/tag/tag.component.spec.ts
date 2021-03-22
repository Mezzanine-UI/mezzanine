import { CommonModule } from '@angular/common';
import {
  configure,
  fireEvent,
  render,
  RenderResult,
} from '@testing-library/angular';
import { MznIconModule } from '@mezzanine-ui/ng/icon';
import { MznTagComponent, TagSize } from '.';

configure({
  defaultImports: [
    CommonModule,
    MznIconModule,
  ],
});

describe('MznTagComponent', () => {
  it('should bind host class', async () => {
    const result = await render(MznTagComponent, {
      template: `
        <mzn-tag></mzn-tag>
      `,
    });
    const element = result.container.firstElementChild as HTMLElement;

    expect(element.classList.contains('mzn-tag')).toBeTruthy();
  });

  it('should render the text and wrap it by button label rendered by span', async () => {
    const { container, getByText } = await render(MznTagComponent, {
      template: `
        <mzn-tag>Hello</mzn-tag>
      `,
    });
    const element = container.firstElementChild as HTMLElement;
    const labelElement = getByText('Hello');

    expect(element.textContent).toBe('Hello');
    expect(labelElement.textContent).toBe('Hello');
    expect(labelElement.tagName.toLowerCase()).toBe('span');
    expect(labelElement.classList.contains('mzn-tag__label')).toBeTruthy();
  });

  describe('input: closable', () => {
    function testClosable(result: RenderResult<any>, closable: boolean) {
      const element = result.container.firstElementChild as HTMLElement;
      const { lastElementChild } = element;

      if (closable) {
        expect(lastElementChild?.tagName.toLowerCase()).toBe('i');
        expect(lastElementChild?.classList.contains('mzn-tag__close-icon')).toBeTruthy();
      } else {
        expect(lastElementChild?.tagName.toLowerCase()).toBe('span');
        expect(lastElementChild?.classList.contains('mzn-tag__label')).toBeTruthy();
      }
    }

    it('should render closable=false by default', async () => {
      const result = await render(MznTagComponent, {
        template: `
          <mzn-tag>Hello</mzn-tag>
        `,
      });

      testClosable(result, false);
    });

    it('should add close icon if closable=true, or not', async () => {
      let result: RenderResult<MznTagComponent, Pick<MznTagComponent, 'closable'>> | undefined;

      for await (const closable of [false, true]) {
        if (result) {
          result.rerender({
            closable,
          });
        } else {
          result = await render(MznTagComponent, {
            template: `
              <mzn-tag [closable]="closable">Hello</mzn-tag>
            `,
            componentProperties: {
              closable,
            },
          });
        }

        testClosable(result, closable);
      }
    });
  });

  describe('input: disabled', () => {
    it('should render disabled=false by default', async () => {
      const result = await render(MznTagComponent, {
        template: `
          <mzn-tag>Hello</mzn-tag>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.getAttribute('aria-disabled')).toBe(`${false}`);
    });

    it('should has aria-disabled attributes', async () => {
      let result: RenderResult<MznTagComponent, Pick<MznTagComponent, 'disabled'>> | undefined;

      for await (const disabled of [false, true]) {
        if (result) {
          result.rerender({
            disabled,
          });
        } else {
          result = await render(MznTagComponent, {
            template: `
                <mzn-tag [disabled]="disabled">Hello</mzn-tag>
              `,
            componentProperties: {
              disabled,
            },
          });
        }

        const element = result.container.firstElementChild as HTMLElement;

        expect(element.getAttribute('aria-disabled')).toBe(`${disabled}`);
      }
    });
  });

  describe('input: size', () => {
    it('should render size="medium" by default', async () => {
      const result = await render(MznTagComponent, {
        template: `
          <mzn-tag>Hello</mzn-tag>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.classList.contains('mzn-tag--medium')).toBeTruthy();
    });

    const sizes: TagSize[] = [
      'small',
      'medium',
      'large',
    ];

    sizes.forEach((size) => {
      it(`should add class if size="${size}"`, async () => {
        const result = await render(MznTagComponent, {
          template: `
            <mzn-tag [size]="size">Hello</mzn-tag>
          `,
          componentProperties: {
            size,
          },
        });
        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains(`mzn-tag--${size}`)).toBeTruthy();
      });
    });
  });

  describe('output: close', () => {
    it('should be fired after close icon clicked', async () => {
      const onClose = jest.fn();
      const result = await render(MznTagComponent, {
        template: `
          <mzn-tag closable (close)="onClose($event)">Hello</mzn-tag>
        `,
        componentProperties: {
          onClose,
        },
      });
      const element = result.container.firstElementChild as HTMLElement;
      const { lastElementChild: closeIconElement } = element;

      fireEvent.click(closeIconElement!);

      expect(onClose).toBeCalledTimes(1);
    });

    it('should be fired if disabled=true', async () => {
      const onClose = jest.fn();
      const result = await render(MznTagComponent, {
        template: `
          <mzn-tag closable disabled (close)="onClose($event)">Hello</mzn-tag>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;
      const { lastElementChild: closeIconElement } = element;

      fireEvent.click(closeIconElement!);

      expect(onClose).not.toBeCalled();
    });
  });
});
