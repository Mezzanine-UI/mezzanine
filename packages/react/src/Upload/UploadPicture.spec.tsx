import {
  SpinnerIcon,
  TimesIcon,
  TrashIcon,
} from '@mezzanine-ui/icons';
import {
  act,
  waitFor,
  cleanup,
  render,
  fireEvent,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { UploadPicture } from '.';

function createQueryIcon(name: string) {
  return (element: HTMLElement) => element.querySelector(`.mzn-icon[data-icon-name="${name}"]`);
}

const querySpinnerIcon = createQueryIcon(SpinnerIcon.name);
const queryDeleteIcon = createQueryIcon(TimesIcon.name);
const queryTrashIcon = createQueryIcon(TrashIcon.name);

describe('<UploadPicture />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLButtonElement,
    (ref) => render(
      <UploadPicture ref={ref} />,
    ),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<UploadPicture className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <UploadPicture />,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-upload-picture')).toBeTruthy();
  });

  it('should click input while button clicked', () => {
    const onInputClick = jest.fn();
    const { getHostHTMLElement } = render(<UploadPicture />);
    const element = getHostHTMLElement();
    const inputElement = element.querySelector('input');

    inputElement!.addEventListener('click', onInputClick);
    fireEvent.click(element);

    expect(onInputClick).toBeCalledTimes(1);
  });

  describe('prop: disabled', () => {
    it('should has disabled and aria-disabled attributes', () => {
      [false, true].forEach((disabled) => {
        const { getHostHTMLElement } = render(<UploadPicture disabled={disabled} />);
        const element = getHostHTMLElement();

        expect(element.classList.contains('mzn-upload-picture--disabled')).toBe(disabled);
        expect(element.hasAttribute('disabled')).toBe(disabled);
        expect(element.getAttribute('aria-disabled')).toBe(`${disabled}`);
      });
    });
  });

  describe('prop: error', () => {
    it('should add error class and render delete icon and trash icon', () => {
      const { getHostHTMLElement } = render(
        <UploadPicture error />,
      );
      const element = getHostHTMLElement();
      const deleteIconElement = queryDeleteIcon(element);
      const trashIconElement = queryTrashIcon(element);

      expect(element.classList.contains('mzn-upload-picture--error')).toBeTruthy();
      expect(deleteIconElement).toBeInstanceOf(HTMLElement);
      expect(trashIconElement).toBeInstanceOf(HTMLElement);
    });
  });

  describe('prop: loading', () => {
    it('should add loading class and render spinner icon after upload image', async () => {
      const { getHostHTMLElement } = render(
        <UploadPicture loading />,
      );
      const element = getHostHTMLElement();
      const inputElement = element.querySelector('input');
      const mockFiles = [
        new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
      ];

      expect(element.classList.contains('mzn-upload-picture--loading')).toBeTruthy();

      await act(async () => {
        fireEvent.change(inputElement!, {
          target: {
            files: mockFiles,
          },
        });
      });

      await waitFor(() => {
        const spinnerIconElement = querySpinnerIcon(element);

        expect(spinnerIconElement).toBeInstanceOf(HTMLElement);
      });
    });
  });

  describe('prop: onDelete', () => {
    it('should be fired while click trash button', () => {
      const onDelete = jest.fn();
      const { getHostHTMLElement } = render(
        <UploadPicture
          onDelete={onDelete}
          value="https://rytass.com/logo.png"
        />,
      );

      const element = getHostHTMLElement();

      fireEvent.click(element);

      expect(onDelete).toBeCalledTimes(1);
    });
  });

  describe('prop: onUpload', () => {
    it('should invoked w/ files from change event', async () => {
      const mockFiles = [
        new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
      ];

      let receivedFiles: File[] = [];
      const onUpload = jest.fn((files: File[]) => {
        receivedFiles = files;
      });
      const { getHostHTMLElement } = render(
        <UploadPicture onUpload={onUpload} />,
      );

      const element = getHostHTMLElement();
      const inputElement = element.querySelector('input');

      await act(async () => {
        fireEvent.change(inputElement!, {
          target: {
            files: mockFiles,
          },
        });
      });

      await waitFor(() => {
        expect(onUpload).toBeCalled();
        expect(receivedFiles[0]).toBe(mockFiles[0]);
      });
    });

    it('should not invoked if there is no any files from change event', () => {
      const onUpload = jest.fn();
      const { getHostHTMLElement } = render(
        <UploadPicture onUpload={onUpload} />,
      );
      const element = getHostHTMLElement();
      const inputElement = element.querySelector('input');

      fireEvent.change(inputElement!, {
        target: {
          files: null,
        },
      });

      expect(onUpload).not.toBeCalled();
    });
  });

  describe('prop: percentage', () => {
    it('should bind percentage css variable', () => {
      const percentage = 40;
      const { getHostHTMLElement } = render(
        <UploadPicture
          percentage={percentage}
        />,
      );
      const element = getHostHTMLElement();

      expect(element.style.getPropertyValue('--mzn-upload-picture-percentage')).toBe(`${percentage}`);
    });
  });

  describe('prop: value', () => {
    it('should render trash icon and show preview image', () => {
      const { getHostHTMLElement } = render(
        <UploadPicture
          value="https://rytass.com/logo.png"
        />,
      );

      const element = getHostHTMLElement();
      const imgElement = element.querySelector('img');
      const trashIconElement = queryTrashIcon(element);

      expect(imgElement).toBeInstanceOf(HTMLImageElement);
      expect(imgElement!.classList.contains('mzn-upload-picture__preview')).toBeTruthy();
      expect(trashIconElement).toBeInstanceOf(HTMLElement);
    });
  });
});
