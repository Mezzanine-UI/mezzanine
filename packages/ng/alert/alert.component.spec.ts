import { CommonModule } from '@angular/common';
import {
  configure,
  fireEvent,
  render,
} from '@testing-library/angular';
import { MznIconModule } from '@mezzanine-ui/ng/icon';
import { MznTypographyModule } from '@mezzanine-ui/ng/typography';
import { AlertSeverity, MznAlertComponent } from '.';

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

  it('should wrap the content by a p element and render severity icon and close icon', async () => {
    const { container } = await render(MznAlertComponent, {
      template: `
        <mzn-alert>Hello</mzn-alert>
      `,
    });
    const element = container.firstElementChild as HTMLElement;
    const {
      firstElementChild: severityIconElement,
      lastElementChild: closeIconElement,
      children,
    } = element;
    const messageElement = children.item(1);

    expect(element.textContent).toBe('Hello');

    expect(severityIconElement?.tagName.toLowerCase()).toBe('i');
    expect(severityIconElement?.classList.contains('mzn-alert__icon'));

    expect(messageElement?.textContent).toBe('Hello');
    expect(messageElement?.tagName.toLowerCase()).toBe('p');
    expect(messageElement?.classList.contains('mzn-alert__message')).toBeTruthy();

    expect(closeIconElement?.tagName.toLowerCase()).toBe('i');
    expect(closeIconElement?.classList.contains('mzn-alert__close-icon'));
  });

  describe('input: severity', () => {
    it('should render severity="success" by default', async () => {
      const result = await render(MznAlertComponent, {
        template: `
          <mzn-alert>Hello</mzn-alert>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.classList.contains('mzn-alert--success')).toBeTruthy();
    });

    const severities: AlertSeverity[] = [
      'success',
      'warning',
      'error',
    ];

    severities.forEach((severity) => {
      it(`should add class if type="${severity}"`, async () => {
        const result = await render(MznAlertComponent, {
          template: `
            <mzn-alert [severity]="severity">Hello</mzn-alert>
          `,
          componentProperties: {
            severity,
          },
        });
        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains(`mzn-alert--${severity}`)).toBeTruthy();
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
