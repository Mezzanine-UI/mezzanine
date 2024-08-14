import { cleanup, render, fireEvent } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import UploadInput from './UploadInput';

describe('<UploadInput />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLInputElement, (ref) =>
    render(<UploadInput ref={ref} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<UploadInput />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-upload-input')).toBeTruthy();
  });

  describe('prop: accept', () => {
    it('should has accept attribute', () => {
      const { getHostHTMLElement } = render(<UploadInput accept="image/*" />);
      const element = getHostHTMLElement();

      expect(element.getAttribute('accept')).toBe('image/*');
    });
  });

  describe('prop: multiple', () => {
    it('should has multiple attribute', () => {
      [false, true].forEach((multiple) => {
        const { getHostHTMLElement } = render(
          <UploadInput multiple={multiple} />,
        );
        const element = getHostHTMLElement();

        expect(element.hasAttribute('multiple'));
      });
    });
  });

  describe('prop: onUpload', () => {
    it('should invoked w/ files from change event', () => {
      const mockFiles = [
        new File(['(⌐□_□)'], 'test.png', { type: 'image/png' }),
        new File(['(⌐□_□||)'], 'test pro.png', { type: 'lalala/png' }),
      ];

      let receivedFiles: File[] = [];
      const onUpload = jest.fn((files: File[]) => {
        receivedFiles = files;
      });
      const { getHostHTMLElement } = render(
        <UploadInput onUpload={onUpload} />,
      );
      const element = getHostHTMLElement();

      fireEvent.change(element, {
        target: {
          files: mockFiles,
        },
      });

      expect(receivedFiles[0]).toBe(mockFiles[0]);
      expect(receivedFiles[1]).toBe(mockFiles[1]);
    });

    it('should not invoked if there is no any files from change event', () => {
      const onUpload = jest.fn();
      const { getHostHTMLElement } = render(
        <UploadInput onUpload={onUpload} />,
      );
      const element = getHostHTMLElement();

      fireEvent.change(element, {
        target: {
          files: null,
        },
      });

      expect(onUpload).not.toBeCalled();
    });
  });
});
