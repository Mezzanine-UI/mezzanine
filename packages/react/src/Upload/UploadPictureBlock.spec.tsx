import { ImageUploader } from '@mezzanine-ui/core/upload';
import { act, waitFor, cleanup, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import { UploadPictureBlock } from '.';

const mockUploader = new ImageUploader();

describe('<UploadPictureBlock />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLButtonElement, (ref) =>
    render(<UploadPictureBlock ref={ref} imageLoader={mockUploader} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <UploadPictureBlock imageLoader={mockUploader} />,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-upload-picture-block')).toBeTruthy();
  });

  describe('prop: accept', () => {
    it('should has accept attribute', () => {
      const { getHostHTMLElement } = render(
        <UploadPictureBlock accept="image/*" imageLoader={mockUploader} />,
      );
      const element = getHostHTMLElement();
      const inputElement = element.querySelector('input');

      expect(inputElement?.getAttribute('accept')).toBe('image/*');
    });
  });

  describe('prop: disabled', () => {
    it('should has disabled and aria-disabled attributes', () => {
      [false, true].forEach((disabled) => {
        const { getHostHTMLElement } = render(
          <UploadPictureBlock disabled={disabled} imageLoader={mockUploader} />,
        );
        const element = getHostHTMLElement();

        expect(
          element.classList.contains('mzn-upload-picture-block--disabled'),
        ).toBe(disabled);
        expect(element.hasAttribute('disabled')).toBe(disabled);
        expect(element.getAttribute('aria-disabled')).toBe(`${disabled}`);
      });
    });
  });

  describe('prop: multiple', () => {
    it('should has multiple attributes', () => {
      [false, true].forEach((multiple) => {
        const { getHostHTMLElement } = render(
          <UploadPictureBlock multiple={multiple} imageLoader={mockUploader} />,
        );
        const element = getHostHTMLElement();
        const inputElement = element.querySelector('input');

        expect(inputElement!.hasAttribute('multiple')).toBe(multiple);
      });
    });
  });

  describe('have default value or not', () => {
    it('should be shown default image if default value is given', () => {
      const mockUploaderWithValue = new ImageUploader(
        undefined,
        'https://rytass.com/logo.png',
      );
      const { getHostHTMLElement } = render(
        <UploadPictureBlock imageLoader={mockUploaderWithValue} />,
      );
      const element = getHostHTMLElement();
      const imgElement = element.querySelector('img');

      expect(imgElement!.getAttribute('src')).toBe(
        'https://rytass.com/logo.png',
      );
    });

    it('should be shown preview image after change event if onUpload is not given', async () => {
      const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
      const mockUploaderWithFile = new ImageUploader(file);

      const { getHostHTMLElement } = render(
        <UploadPictureBlock imageLoader={mockUploaderWithFile} />,
      );

      const element = getHostHTMLElement();

      await act(async () => {
        mockUploaderWithFile.setPreview();
      });

      await act(async () => {
        await render(<UploadPictureBlock imageLoader={mockUploaderWithFile} />);
      });

      const imgElement = element.querySelector('img');

      await waitFor(() => {
        expect(imgElement!.getAttribute('src')).toBe(
          'data:image/png;base64,KOKMkOKWoV/ilqEp',
        );
      });
    });
  });
});
