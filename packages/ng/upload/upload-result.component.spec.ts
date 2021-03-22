import { CommonModule } from '@angular/common';
import {
  configure,
  fireEvent,
  render,
} from '@testing-library/angular';
import { MznIconModule } from '@mezzanine-ui/ng/icon';
import { UploadResultSize, UploadResultStatus } from '@mezzanine-ui/core/upload';
import { DownloadIcon, SpinnerIcon, TimesIcon } from '@mezzanine-ui/icons';
import { MznUploadResultComponent } from '.';

configure({
  defaultImports: [
    CommonModule,
    MznIconModule,
  ],
});

function createQueryIcon(name: string) {
  return (element: HTMLElement) => element.querySelector(`.mzn-icon[data-icon-name="${name}"]`);
}

const queryDeleteIcon = createQueryIcon(TimesIcon.name);
const queryDownloadIcon = createQueryIcon(DownloadIcon.name);
const querySpinnerIcon = createQueryIcon(SpinnerIcon.name);

describe('MznUploadResultComponent', () => {
  it('should bind host class', async () => {
    const result = await render(MznUploadResultComponent, {
      template: `
        <mzn-upload-result name="hello.png" status="done"></mzn-upload-result>
      `,
    });

    const element = result.container.firstElementChild as HTMLElement;

    expect(element.classList.contains('mzn-upload-result')).toBeTruthy();
  });

  describe('input: name', () => {
    it('should render name by span', async () => {
      const result = await render(MznUploadResultComponent, {
        template: `
          <mzn-upload-result
            name="hello.png"
            status="done">
          </mzn-upload-result>
        `,
      });

      const element = result.container.firstElementChild as HTMLElement;
      const { firstElementChild: fileNameElement } = element;

      expect(fileNameElement?.tagName.toLowerCase()).toBe('span');
      expect(fileNameElement?.textContent).toBe('hello.png');
    });
  });

  describe('input: percentage', () => {
    it('should bind percentage css variable', async () => {
      const result = await render(MznUploadResultComponent, {
        template: `
          <mzn-upload-result
            name="hello.png"
            status="loading"
            [percentage]="40"></mzn-upload-result>
        `,
      });

      const element = result.container.firstElementChild as HTMLElement;

      expect(element.style.getPropertyValue('--mzn-upload-result-percentage')).toBe('40');
    });
  });
  describe('input: size', () => {
    it('should render size="medium" by default', async () => {
      const result = await render(MznUploadResultComponent, {
        template: `
          <mzn-upload-result name="hello.png" status="done"></mzn-upload-result>
        `,
      });
      const element = result.container.firstElementChild as HTMLElement;

      expect(element.classList.contains('mzn-upload-result--medium')).toBeTruthy();
    });

    const sizes: UploadResultSize[] = [
      'small',
      'medium',
      'large',
    ];

    sizes.forEach((size) => {
      it(`should add class if size="${size}"`, async () => {
        const result = await render(MznUploadResultComponent, {
          template: `
            <mzn-upload-result name="hello.png" [size]="size" status="done"></mzn-upload-result>
          `,
          componentProperties: {
            size,
          },
        });
        const element = result.container.firstElementChild as HTMLElement;

        expect(element.classList.contains(`mzn-upload-result--${size}`)).toBeTruthy();
      });
    });
  });

  describe('input: status', () => {
    describe('loading', () => {
      it('should bind loading class and render spinner icon', async () => {
        const result = await render(MznUploadResultComponent, {
          template: `
            <mzn-upload-result name="hello.png" status="loading"></mzn-upload-result>
          `,
        });

        const element = result.container.firstElementChild as HTMLElement;
        const spinnerIconElement = querySpinnerIcon(element);

        expect(element.classList.contains('mzn-upload-result--loading')).toBeTruthy();
        expect(spinnerIconElement).toBeInstanceOf(HTMLElement);
      });
    });

    describe('done', () => {
      it('should render download and delete icon', async () => {
        const result = await render(MznUploadResultComponent, {
          template: `
            <mzn-upload-result name="hello.png" status="done"></mzn-upload-result>
          `,
        });

        const element = result.container.firstElementChild as HTMLElement;
        const downloadIconElement = queryDownloadIcon(element);
        const deleteIconElement = queryDeleteIcon(element);

        expect(downloadIconElement).toBeInstanceOf(HTMLElement);
        expect(deleteIconElement).toBeInstanceOf(HTMLElement);
      });
    });

    describe('error', () => {
      it('should add error class and render delete icon', async () => {
        const result = await render(MznUploadResultComponent, {
          template: `
            <mzn-upload-result name="hello.png" status="error"></mzn-upload-result>
          `,
        });

        const element = result.container.firstElementChild as HTMLElement;
        const deleteIconElement = queryDeleteIcon(element);

        expect(element.classList.contains('mzn-upload-result--error')).toBeTruthy();
        expect(deleteIconElement).toBeInstanceOf(HTMLElement);
      });
    });
  });

  describe('output: onDelete', () => {
    (['done', 'error'] as UploadResultStatus[]).forEach((status) => {
      it(`should be fired on status="${status}"`, async () => {
        const onDelete = jest.fn();
        const result = await render(MznUploadResultComponent, {
          template: `
            <mzn-upload-result
              name="hello.png"
              (delete)="onDelete($event)"
              [status]="status"></mzn-upload-result>
          `,
          componentProperties: {
            onDelete,
            status,
          },
        });

        const element = result.container.firstElementChild as HTMLElement;
        const deleteIcon = queryDeleteIcon(element);

        fireEvent.click(deleteIcon!);

        expect(onDelete).toBeCalledTimes(1);
      });
    });
  });

  describe('output: onDownload', () => {
    it('should be fired on status="done"', async () => {
      const onDownload = jest.fn();
      const result = await render(MznUploadResultComponent, {
        template: `
          <mzn-upload-result
            name="hello.png"
            (download)="onDownload($event)"
            status="done"></mzn-upload-result>
        `,
        componentProperties: {
          onDownload,
        },
      });

      const element = result.container.firstElementChild as HTMLElement;
      const downloadIcon = queryDownloadIcon(element);

      fireEvent.click(downloadIcon!);

      expect(onDownload).toBeCalledTimes(1);
    });
  });
});
