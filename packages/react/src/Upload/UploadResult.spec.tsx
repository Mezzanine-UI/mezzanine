import { TimesIcon, DownloadIcon, SpinnerIcon } from '@mezzanine-ui/icons';
import { UploadResultStatus } from '@mezzanine-ui/core/upload';
import { cleanup, render, fireEvent } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { UploadResult, UploadResultSize } from '.';
import ConfigProvider from '../Provider';

function createQueryIcon(name: string) {
  return (element: HTMLElement) =>
    element.querySelector(`.mzn-icon[data-icon-name="${name}"]`);
}

const queryDeleteIcon = createQueryIcon(TimesIcon.name);
const queryDownloadIcon = createQueryIcon(DownloadIcon.name);
const querySpinnerIcon = createQueryIcon(SpinnerIcon.name);

describe('<UploadResult />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<UploadResult ref={ref} name="hello.png" status="done" />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <UploadResult className={className} name="hello.png" status="done" />,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <UploadResult name="hello.png" status="done" />,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-upload-result')).toBeTruthy();
  });

  describe('prop: name', () => {
    it('should render name by span', () => {
      const { getHostHTMLElement } = render(
        <UploadResult name="hello.png" status="done" />,
      );
      const element = getHostHTMLElement();
      const { firstElementChild: fileNameElement } = element;

      expect(fileNameElement?.tagName.toLowerCase()).toBe('span');
      expect(fileNameElement?.textContent).toBe('hello.png');
    });
  });

  describe('prop: onDelete', () => {
    (['done', 'error'] as UploadResultStatus[]).forEach((status) => {
      it(`should be fired on status="${status}"`, () => {
        const onDelete = jest.fn();
        const { getHostHTMLElement } = render(
          <UploadResult name="hello.png" onDelete={onDelete} status={status} />,
        );
        const element = getHostHTMLElement();
        const deleteIcon = queryDeleteIcon(element);

        fireEvent.click(deleteIcon!);

        expect(onDelete).toBeCalledTimes(1);
      });
    });
  });

  describe('prop: onDownload', () => {
    it('should be fired on status="done"', () => {
      const onDownload = jest.fn();
      const { getHostHTMLElement } = render(
        <UploadResult name="hello.png" onDownload={onDownload} status="done" />,
      );
      const element = getHostHTMLElement();
      const downloadIcon = queryDownloadIcon(element);

      fireEvent.click(downloadIcon!);

      expect(onDownload).toBeCalledTimes(1);
    });
  });

  describe('prop: percentage', () => {
    it('should bind percentage css variable', () => {
      const percentage = 40;
      const { getHostHTMLElement } = render(
        <UploadResult
          name="hello.png"
          percentage={percentage}
          status="loading"
        />,
      );
      const element = getHostHTMLElement();

      expect(
        element.style.getPropertyValue('--mzn-upload-result-percentage'),
      ).toBe(`${percentage}`);
    });
  });

  describe('prop: size', () => {
    it('should render size="medium" by default', () => {
      const { getHostHTMLElement } = render(
        <UploadResult name="hello.png" status="done" />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-upload-result--medium'),
      ).toBeTruthy();
    });

    it('should accept ConfigProvider context size changes', () => {
      const { getHostHTMLElement } = render(
        <ConfigProvider size="large">
          <UploadResult name="hello.png" status="done" />
        </ConfigProvider>,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-upload-result--large'),
      ).toBeTruthy();
    });

    const sizes: UploadResultSize[] = ['small', 'medium', 'large'];

    sizes.forEach((size) => {
      it(`should add class if size="${size}"`, () => {
        const { getHostHTMLElement } = render(
          <UploadResult name="hello.png" size={size} status="done" />,
        );
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-upload-result--${size}`),
        ).toBeTruthy();
      });
    });
  });

  describe('prop: status', () => {
    describe('loading', () => {
      it('should bind loading class and render spinner icon', () => {
        const { getHostHTMLElement } = render(
          <UploadResult name="hello.png" status="loading" />,
        );
        const element = getHostHTMLElement();
        const spinnerIconElement = querySpinnerIcon(element);

        expect(
          element.classList.contains('mzn-upload-result--loading'),
        ).toBeTruthy();
        expect(spinnerIconElement).toBeInstanceOf(HTMLElement);
      });
    });
  });

  describe('done', () => {
    it('should render download and delete icon', () => {
      const { getHostHTMLElement } = render(
        <UploadResult name="hello.png" status="done" />,
      );
      const element = getHostHTMLElement();
      const downloadIconElement = queryDownloadIcon(element);
      const deleteIconElement = queryDeleteIcon(element);

      expect(downloadIconElement).toBeInstanceOf(HTMLElement);
      expect(deleteIconElement).toBeInstanceOf(HTMLElement);
    });
  });

  describe('error', () => {
    it('should add error class and render delete icon', () => {
      const { getHostHTMLElement } = render(
        <UploadResult name="hello.png" status="error" />,
      );
      const element = getHostHTMLElement();
      const deleteIconElement = queryDeleteIcon(element);

      expect(
        element.classList.contains('mzn-upload-result--error'),
      ).toBeTruthy();
      expect(deleteIconElement).toBeInstanceOf(HTMLElement);
    });
  });
});
