import { CropperSize } from '@mezzanine-ui/core/cropper';
import { cleanup, cleanupHook, fireEvent, render, waitFor } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Cropper, { CropperModal } from './Cropper';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() { }

  unobserve() { }

  disconnect() { }
} as any;

function getModalElement(container: HTMLElement = document.body) {
  return container?.querySelector('.mzn-backdrop')?.querySelector('.mzn-modal');
}

describe('<Cropper />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Cropper ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Cropper className={className} />),
  );

  it('should render as div element', () => {
    const { getHostHTMLElement } = render(<Cropper />);
    const element = getHostHTMLElement();

    expect(element.tagName.toLowerCase()).toBe('div');
  });

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Cropper />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-cropper')).toBeTruthy();
  });

  it('should render children', () => {
    const { getHostHTMLElement } = render(<Cropper>Test Content</Cropper>);
    const element = getHostHTMLElement();

    expect(element.textContent).toBe('Test Content');
  });

  describe('prop: size', () => {
    it('should render size="main" by default', () => {
      const { getHostHTMLElement } = render(<Cropper />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-cropper--main')).toBeTruthy();
    });

    const sizes: CropperSize[] = ['main', 'sub', 'minor'];

    sizes.forEach((size) => {
      it(`should render size="${size}"`, () => {
        const { getHostHTMLElement } = render(<Cropper size={size} />);
        const element = getHostHTMLElement();

        expect(element.classList.contains(`mzn-cropper--${size}`)).toBeTruthy();
      });
    });
  });

  describe('prop: component', () => {
    it('should render as div by default', () => {
      const { getHostHTMLElement } = render(<Cropper />);
      const element = getHostHTMLElement();

      expect(element.tagName.toLowerCase()).toBe('div');
    });

    it('should render as span when component="span"', () => {
      const { getHostHTMLElement } = render(<Cropper component="span" />);
      const element = getHostHTMLElement();

      expect(element.tagName.toLowerCase()).toBe('span');
    });
  });
});

describe('<CropperModal />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  it('should render modal when open is true', async () => {
    render(
      <CropperModal
        cropperProps={{ imageSrc: 'https://example.com/image.jpg' }}
        disablePortal
        open
      />,
    );

    await waitFor(() => {
      const modalElement = getModalElement();
      expect(modalElement).toBeTruthy();
    });
  });

  it('should not render modal when open is false', () => {
    render(
      <CropperModal
        cropperProps={{ imageSrc: 'https://example.com/image.jpg' }}
        disablePortal
        open={false}
      />,
    );

    const modalElement = getModalElement();

    expect(modalElement).toBeFalsy();
  });

  it('should render with default title', async () => {
    render(
      <CropperModal
        cropperProps={{ imageSrc: 'https://example.com/image.jpg' }}
        disablePortal
        open
      />,
    );

    await waitFor(() => {
      const modalElement = getModalElement();
      expect(modalElement).toBeTruthy();
    });

    const modalElement = getModalElement();
    const titleElement = modalElement?.querySelector('.mzn-modal__header__title');

    expect(titleElement?.textContent).toBe('圖片裁切');
  });

  it('should render with custom title', async () => {
    const customTitle = 'Custom Title';
    render(
      <CropperModal
        cropperProps={{ imageSrc: 'https://example.com/image.jpg' }}
        disablePortal
        open
        title={customTitle}
      />,
    );

    await waitFor(() => {
      const modalElement = getModalElement();
      expect(modalElement).toBeTruthy();
    });

    const modalElement = getModalElement();
    const titleElement = modalElement?.querySelector('.mzn-modal__header__title');

    expect(titleElement?.textContent).toBe(customTitle);
  });

  it('should hide header when showModalHeader is false', async () => {
    render(
      <CropperModal
        cropperProps={{ imageSrc: 'https://example.com/image.jpg' }}
        disablePortal
        open
        showModalHeader={false}
      />,
    );

    await waitFor(() => {
      const modalElement = getModalElement();
      expect(modalElement).toBeTruthy();
    });

    const modalElement = getModalElement();
    const headerElement = modalElement?.querySelector('.mzn-modal__header');

    expect(headerElement).toBeFalsy();
  });

  it('should hide footer when showModalFooter is false', async () => {
    render(
      <CropperModal
        cropperProps={{ imageSrc: 'https://example.com/image.jpg' }}
        disablePortal
        open
        showModalFooter={false}
      />,
    );

    await waitFor(() => {
      const modalElement = getModalElement();
      expect(modalElement).toBeTruthy();
    });

    const modalElement = getModalElement();
    const footerElement = modalElement?.querySelector('.mzn-modal__footer');

    expect(footerElement).toBeFalsy();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const onCancel = jest.fn();
    render(
      <CropperModal
        cropperProps={{ imageSrc: 'https://example.com/image.jpg' }}
        disablePortal
        onCancel={onCancel}
        open
      />,
    );

    await waitFor(() => {
      const modalElement = getModalElement();
      expect(modalElement).toBeTruthy();
    });

    const modalElement = getModalElement();
    const footer = modalElement?.querySelector('.mzn-modal__footer');
    const buttons = footer?.querySelectorAll('button');
    const cancelButton = Array.from(buttons || []).find(
      (btn) => btn.textContent === '取消',
    ) as HTMLElement;

    if (cancelButton) {
      fireEvent.click(cancelButton);
      expect(onCancel).toHaveBeenCalledTimes(1);
    }
  });

  it('should call onClose when cancel button is clicked', async () => {
    const onClose = jest.fn();
    render(
      <CropperModal
        cropperProps={{ imageSrc: 'https://example.com/image.jpg' }}
        disablePortal
        onClose={onClose}
        open
      />,
    );

    await waitFor(() => {
      const modalElement = getModalElement();
      expect(modalElement).toBeTruthy();
    });

    const modalElement = getModalElement();
    const footer = modalElement?.querySelector('.mzn-modal__footer');
    const buttons = footer?.querySelectorAll('button');
    const cancelButton = Array.from(buttons || []).find(
      (btn) => btn.textContent === '取消',
    ) as HTMLElement;

    if (cancelButton) {
      fireEvent.click(cancelButton);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should call onConfirm when confirm button is clicked', async () => {
    const onConfirm = jest.fn().mockResolvedValue(undefined);
    render(
      <CropperModal
        cropperProps={{ imageSrc: 'https://example.com/image.jpg' }}
        disablePortal
        onConfirm={onConfirm}
        open
      />,
    );

    await waitFor(() => {
      const modalElement = getModalElement();
      expect(modalElement).toBeTruthy();
    });

    const modalElement = getModalElement();
    const footer = modalElement?.querySelector('.mzn-modal__footer');
    const buttons = footer?.querySelectorAll('button');
    const confirmButton = Array.from(buttons || []).find(
      (btn) => btn.textContent === '確認' || btn.textContent === '確認自訂',
    ) as HTMLElement;

    if (confirmButton) {
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(onConfirm).toHaveBeenCalled();
      });
    }
  });

  it('should handle onConfirm error gracefully', async () => {
    const onConfirm = jest.fn().mockRejectedValue(new Error('Test error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    render(
      <CropperModal
        cropperProps={{ imageSrc: 'https://example.com/image.jpg' }}
        disablePortal
        onConfirm={onConfirm}
        open
      />,
    );

    await waitFor(() => {
      const modalElement = getModalElement();
      expect(modalElement).toBeTruthy();
    });

    const modalElement = getModalElement();
    const footer = modalElement?.querySelector('.mzn-modal__footer');
    const buttons = footer?.querySelectorAll('button');
    const confirmButton = Array.from(buttons || []).find(
      (btn) => btn.textContent === '確認' || btn.textContent === '確認自訂',
    ) as HTMLElement;

    if (confirmButton) {
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(onConfirm).toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalled();
      });
    }

    consoleErrorSpy.mockRestore();
  });

  it('should render with custom confirmText and cancelText', async () => {
    render(
      <CropperModal
        cancelText="取消自訂"
        confirmText="確認自訂"
        cropperProps={{ imageSrc: 'https://example.com/image.jpg' }}
        disablePortal
        open
      />,
    );

    await waitFor(() => {
      const modalElement = getModalElement();
      expect(modalElement).toBeTruthy();
    });

    const modalElement = getModalElement();
    const footer = modalElement?.querySelector('.mzn-modal__footer');
    const buttons = footer?.querySelectorAll('button');
    const confirmButton = Array.from(buttons || []).find(
      (btn) => btn.textContent === '確認自訂',
    );
    const cancelButton = Array.from(buttons || []).find(
      (btn) => btn.textContent === '取消自訂',
    );

    expect(confirmButton?.textContent).toBe('確認自訂');
    expect(cancelButton?.textContent).toBe('取消自訂');
  });

  it('should apply cropperContentClassName', async () => {
    const customClassName = 'custom-cropper-content';
    render(
      <CropperModal
        cropperContentClassName={customClassName}
        cropperProps={{ imageSrc: 'https://example.com/image.jpg' }}
        disablePortal
        open
      />,
    );

    await waitFor(() => {
      const modalElement = getModalElement();
      expect(modalElement).toBeTruthy();
    });

    const modalElement = getModalElement();
    const cropperElement = modalElement?.querySelector('.mzn-cropper__content');

    expect(cropperElement?.classList.contains(customClassName)).toBeTruthy();
  });
});
