import { TimesIcon, TrashIcon } from '@mezzanine-ui/icons';
import { RefObject } from 'react';
import { act, waitFor, cleanup, render, fireEvent } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { UploadPicture, UploadPictureControl } from '.';

function createQueryIcon(name: string) {
  return (element: HTMLElement) =>
    element.querySelector(`.mzn-icon[data-icon-name="${name}"]`);
}

const queryDeleteIcon = createQueryIcon(TimesIcon.name);
const queryTrashIcon = createQueryIcon(TrashIcon.name);

describe('<UploadPicture />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<UploadPicture ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<UploadPicture className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<UploadPicture />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-upload-picture')).toBeTruthy();
  });

  describe('prop: accept', () => {
    it('should has accept attribute', () => {
      const { getHostHTMLElement } = render(<UploadPicture accept="image/*" />);
      const element = getHostHTMLElement();
      const inputElement = element.querySelector('input');

      expect(inputElement?.getAttribute('accept')).toBe('image/*');
    });
  });

  describe('prop: controllerRef', () => {
    it('should get hook results', async () => {
      const controllerRef = {
        current: null,
      } as RefObject<UploadPictureControl | null>;

      await act(async () => {
        await render(<UploadPicture controllerRef={controllerRef} />);
      });

      expect(controllerRef?.current?.getData).toBeInstanceOf(Function);
      expect(controllerRef?.current?.getData()).toBeInstanceOf(Object);
    });
  });

  describe('prop: defaultValue', () => {
    it('should render trash icon and show default image', () => {
      const { getHostHTMLElement } = render(
        <UploadPicture defaultValue="https://rytass.com/logo.png" />,
      );

      const element = getHostHTMLElement();
      const imgElement = element.querySelector('img');
      const trashIconElement = queryTrashIcon(element);

      expect(imgElement).toBeInstanceOf(HTMLImageElement);
      expect(
        imgElement!.classList.contains('mzn-upload-picture-block__preview'),
      ).toBeTruthy();
      expect(imgElement!.getAttribute('src')).toBe(
        'https://rytass.com/logo.png',
      );
      expect(trashIconElement).toBeInstanceOf(HTMLElement);
    });
  });

  describe('prop: disabled', () => {
    it('should has disabled and aria-disabled attributes', () => {
      [false, true].forEach((disabled) => {
        const { getHostHTMLElement } = render(
          <UploadPicture disabled={disabled} />,
        );
        const element = getHostHTMLElement();
        const buttonElement = element.querySelector('button');

        expect(
          buttonElement!.classList.contains(
            'mzn-upload-picture-block--disabled',
          ),
        ).toBe(disabled);
        expect(buttonElement!.hasAttribute('disabled')).toBe(disabled);
        expect(buttonElement!.getAttribute('aria-disabled')).toBe(
          `${disabled}`,
        );
      });
    });
  });

  describe('prop: onDelete', () => {
    it('should be fired while click button if uploader have value', () => {
      const onDelete = jest.fn();
      const onChange = jest.fn();

      const { getHostHTMLElement } = render(
        <UploadPicture
          onChange={onChange}
          onDelete={onDelete}
          defaultValue="https://rytass.com/logo.png"
        />,
      );

      const element = getHostHTMLElement();
      const buttonElement = element.querySelector('button');

      fireEvent.click(buttonElement!);

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('');
    });

    it('should not be fired if uploader have no image', () => {
      const onDelete = jest.fn();

      const { getHostHTMLElement } = render(
        <UploadPicture onDelete={onDelete} />,
      );

      const element = getHostHTMLElement();
      const buttonElement = element.querySelector('button');

      fireEvent.click(buttonElement!);

      expect(onDelete).not.toHaveBeenCalled();
    });
  });

  describe('prop: onChange, onError, onUpload, onUploadSuccess', () => {
    describe('should invoked w/ files from change event', () => {
      it('should be fired onUploadSuccess and onChange after onUpload success', async () => {
        const mockFiles = [
          new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
        ];

        const onUpload = jest.fn(
          () =>
            new Promise<string>((resolve) => {
              resolve('https://rytass.com/logo.png');
            }),
        );

        const onUploadSuccess = jest.fn();
        const onError = jest.fn();
        const onChange = jest.fn();

        const { getHostHTMLElement } = render(
          <UploadPicture
            onChange={onChange}
            onUpload={onUpload}
            onUploadSuccess={onUploadSuccess}
            onError={onError}
          />,
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

        const imgElement = element.querySelector('img');
        const buttonElement = element.querySelector('button');

        await waitFor(() => {
          expect(onUpload).toHaveBeenCalled();
          expect(onUploadSuccess).toHaveBeenCalled();
          expect(onUploadSuccess).toHaveBeenCalledWith(
            mockFiles[0],
            'https://rytass.com/logo.png',
          );
          expect(onError).not.toHaveBeenCalled();
          expect(onChange).toHaveBeenCalledWith('https://rytass.com/logo.png');
          expect(imgElement!.getAttribute('src')).toBe(
            'https://rytass.com/logo.png',
          );
          expect(
            buttonElement!.style.getPropertyValue(
              '--mzn-upload-picture-block-percentage',
            ),
          ).toBe('100');
        });
      });

      it('should be fired onError but not be fired onChange after onUpload failed', async () => {
        const mockFiles = [
          new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
        ];

        const onUpload = jest.fn(
          () =>
            new Promise<string>((resolve, reject) => {
              reject();
            }),
        );

        const onUploadSuccess = jest.fn();
        const onError = jest.fn();
        const onChange = jest.fn();

        const { getHostHTMLElement } = render(
          <UploadPicture
            onChange={onChange}
            onUpload={onUpload}
            onUploadSuccess={onUploadSuccess}
            onError={onError}
          />,
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

        const deleteIconElement = queryDeleteIcon(element);
        const buttonElement = element.querySelector('button');

        await waitFor(() => {
          expect(onUpload).toHaveBeenCalled();
          expect(onUploadSuccess).not.toHaveBeenCalled();
          expect(onError).toHaveBeenCalled();
          expect(onError).toHaveBeenCalledWith(mockFiles[0]);
          expect(onChange).not.toHaveBeenCalled();
          expect(deleteIconElement).toBeInstanceOf(HTMLElement);
          expect(
            buttonElement!.style.getPropertyValue(
              '--mzn-upload-picture-block-percentage',
            ),
          ).toBe('100');
        });
      });

      it('should be shown preview image after change event if onUpload is not given', async () => {
        const mockFiles = [
          new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
        ];

        const { getHostHTMLElement } = render(<UploadPicture />);

        const element = getHostHTMLElement();
        const inputElement = element.querySelector('input');

        await act(async () => {
          fireEvent.change(inputElement!, {
            target: {
              files: mockFiles,
            },
          });
        });

        await act(async () => {
          await render(<UploadPicture />);
        });

        const imgElement = element.querySelector('img');

        await waitFor(() => {
          expect(imgElement!.getAttribute('src')).toBe(
            'data:image/png;base64,KOKMkOKWoV/ilqEp',
          );
        });
      });
    });

    it('should not invoked if there are no any files from change event', () => {
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

      expect(onUpload).not.toHaveBeenCalled();
    });
  });
});
