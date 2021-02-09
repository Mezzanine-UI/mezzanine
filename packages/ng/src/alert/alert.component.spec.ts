import { CommonModule } from '@angular/common';
import {
  configure,
  fireEvent,
  render,
} from '@testing-library/angular';
import { MznIconModule } from '../icon';
import { MznTypographyModule } from '../typography';
import { AlertStatus, MznAlertComponent } from '.';

configure({
  defaultImports: [
    CommonModule,
    MznIconModule,
    MznTypographyModule,
  ],
});

describe('MznAlertComponent', () => {
  it('should bind host class', async () => {
    const result = await render(MznAlertComponent, {
      template: `
        <mzn-alert></mzn-alert>
      `,
    });
    const element = result.container.firstElementChild as HTMLElement;

    expect(element.classList.contains('mzn-alert')).toBeTruthy();
  });

  it('should wrap the content by a p element and render status icon and close icon', async () => {
    const { container } = await render(MznAlertComponent, {
      template: `
        <mzn-alert>Hello</mzn-alert>
      `,
    });
    const element = container.firstElementChild as HTMLElement;
    const {
      firstElementChild: statusIconElement,
      lastElementChild: closeIconElement,
      children,
    } = element;
    const messageElement = children.item(1);

    expect(element.textContent).toBe('Hello');

    expect(statusIconElement?.tagName.toLowerCase()).toBe('i');
    expect(statusIconElement?.classList.contains('mzn-alert__icon'));

    expect(messageElement?.textContent).toBe('Hello');
    expect(messageElement?.tagName.toLowerCase()).toBe('p');
    expect(messageElement?.classList.contains('mzn-alert__message')).toBeTruthy();

    expect(closeIconElement?.tagName.toLowerCase()).toBe('i');
    expect(closeIconElement?.classList.contains('mzn-alert__close-icon'));
  });

  describe('input: status', () => {
    it('should render status="success" by default', async () => {
      const result = await render(MznAlertComponent, {
        template: `
          <mzn-alert>Hello</mzn-alert>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.classList.contains('mzn-alert--success')).toBeTruthy();
    });

    const statuses: AlertStatus[] = [
      'success',
      'warning',
      'error',
    ];

    statuses.forEach((status) => {
      it(`should add class if type="${status}"`, async () => {
        const result = await render(MznAlertComponent, {
          template: `
            <mzn-alert [status]="status">Hello</mzn-alert>
          `,
          componentProperties: {
            status,
          },
        });
        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains(`mzn-alert--${status}`)).toBeTruthy();
      });
    });
  });

  describe('output: close', () => {
    it('should be fired after close icon clicked', async () => {
      const onClose = jest.fn();
      const result = await render(MznAlertComponent, {
        template: `
          <mzn-alert closable (close)="onClose($event)">Hello</mzn-alert>
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
  });
});
