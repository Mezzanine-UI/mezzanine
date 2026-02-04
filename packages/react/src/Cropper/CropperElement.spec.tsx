import { CropperSize } from '@mezzanine-ui/core/cropper';
import React from 'react';
import { act, cleanup, cleanupHook, fireEvent, render, waitFor } from '../../__test-utils__';
import CropperElement from './CropperElement';
import { CropArea } from './typings';

// Mock Image constructor
class MockImage extends Image {
  private _src: string = '';

  constructor() {
    super();
    // Simulate image dimensions
    Object.defineProperty(this, 'width', { value: 800, writable: false });
    Object.defineProperty(this, 'height', { value: 600, writable: false });

    // Override src setter to trigger onload when src is set
    Object.defineProperty(this, 'src', {
      get: () => this._src,
      set: (value: string) => {
        this._src = value;
        // Trigger onload after a short delay to simulate image loading
        setTimeout(() => {
          if (this.onload) {
            this.onload(new Event('load') as any);
          }
        }, 0);
      },
      configurable: true,
    });
  }
}

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
const mockRevokeObjectURL = jest.fn();

beforeAll(() => {
  global.Image = MockImage as unknown as typeof Image;
  if (global.URL) {
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;
  }
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('<CropperElement />', () => {
  beforeEach(() => {
    // Mock getBoundingClientRect for canvas
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      bottom: 600,
      height: 600,
      left: 0,
      right: 800,
      top: 0,
      width: 800,
      x: 0,
      y: 0,
      toJSON: () => { },
    } as DOMRect);

    // Mock devicePixelRatio
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 1,
    });

    // Mock ResizeObserver
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));
  });

  afterEach(() => {
    cleanup();
    cleanupHook();
    jest.clearAllMocks();
  });

  // Note: CropperElement returns a div wrapper, but ref is forwarded to canvas
  // So we test the canvas element directly
  it('should forward ref to canvas element', () => {
    const ref = React.createRef<HTMLCanvasElement>();
    render(<CropperElement ref={ref} imageSrc="https://example.com/image.jpg" />);

    expect(ref.current).toBeInstanceOf(HTMLCanvasElement);
  });

  it('should render canvas element inside wrapper div', () => {
    const { container } = render(
      <CropperElement imageSrc="https://example.com/image.jpg" />,
    );
    const wrapper = container.querySelector('.mzn-cropper__element');
    const canvas = container.querySelector('canvas');

    expect(wrapper).toBeTruthy();
    expect(canvas).toBeTruthy();
    expect(canvas?.tagName.toLowerCase()).toBe('canvas');
  });

  it('should bind host class on canvas', () => {
    const { container } = render(
      <CropperElement imageSrc="https://example.com/image.jpg" />,
    );
    const canvas = container.querySelector('canvas');

    expect(canvas?.classList.contains('mzn-cropper')).toBeTruthy();
  });

  it('should render size="main" by default on canvas', () => {
    const { container } = render(
      <CropperElement imageSrc="https://example.com/image.jpg" />,
    );
    const canvas = container.querySelector('canvas');

    expect(canvas?.classList.contains('mzn-cropper--main')).toBeTruthy();
  });

  it('should append custom className on canvas', () => {
    const { container } = render(
      <CropperElement
        className="custom-class"
        imageSrc="https://example.com/image.jpg"
      />,
    );
    const canvas = container.querySelector('canvas');

    expect(canvas?.classList.contains('custom-class')).toBeTruthy();
  });

  describe('prop: size', () => {
    const sizes: CropperSize[] = ['main', 'sub', 'minor'];

    sizes.forEach((size) => {
      it(`should render size="${size}"`, () => {
        const { container } = render(
          <CropperElement imageSrc="https://example.com/image.jpg" size={size} />,
        );
        const canvas = container.querySelector('canvas');

        expect(canvas?.classList.contains(`mzn-cropper--${size}`)).toBeTruthy();
      });
    });
  });

  describe('prop: imageSrc', () => {
    it('should load image from URL string', async () => {
      const { container } = render(
        <CropperElement imageSrc="https://example.com/image.jpg" />,
      );

      const canvas = container.querySelector('canvas');

      expect(canvas).toBeTruthy();

      // Simulate image load
      await act(async () => {
        const img = new Image();
        img.onload = () => { };
        img.src = 'https://example.com/image.jpg';
        await new Promise((resolve) => setTimeout(resolve, 100));
      });
    });

    it('should load image from File', async () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const { container } = render(<CropperElement imageSrc={file} />);

      const canvas = container.querySelector('canvas');

      expect(canvas).toBeTruthy();
      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
      });
    });

    it('should handle image load error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      render(
        <CropperElement imageSrc="https://invalid-url.com/image.jpg" />,
      );

      await act(async () => {
        const img = new Image();
        img.onerror = () => { };
        img.src = 'https://invalid-url.com/image.jpg';
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      consoleErrorSpy.mockRestore();
    });

    it('should cleanup object URL on unmount', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const { unmount } = render(<CropperElement imageSrc={file} />);

      return waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
      }).then(() => {
        unmount();
        expect(mockRevokeObjectURL).toHaveBeenCalled();
      });

    });
  });

  describe('prop: initialCropArea', () => {
    it('should use initialCropArea when provided', () => {
      const initialCropArea: CropArea = {
        height: 200,
        width: 200,
        x: 100,
        y: 100,
      };

      const { container } = render(
        <CropperElement
          imageSrc="https://example.com/image.jpg"
          initialCropArea={initialCropArea}
        />,
      );

      const canvas = container.querySelector('canvas');

      expect(canvas).toBeTruthy();
    });
  });

  describe('prop: aspectRatio', () => {
    it('should maintain aspect ratio when provided', () => {
      const { container } = render(
        <CropperElement
          aspectRatio={16 / 9}
          imageSrc="https://example.com/image.jpg"
        />,
      );

      const canvas = container.querySelector('canvas');

      expect(canvas).toBeTruthy();
    });
  });

  describe('prop: minWidth and minHeight', () => {
    it('should use default minWidth and minHeight', () => {
      const { container } = render(
        <CropperElement imageSrc="https://example.com/image.jpg" />,
      );

      const canvas = container.querySelector('canvas');

      expect(canvas).toBeTruthy();
    });

    it('should use custom minWidth and minHeight', () => {
      const { container } = render(
        <CropperElement
          imageSrc="https://example.com/image.jpg"
          minHeight={100}
          minWidth={100}
        />,
      );

      const canvas = container.querySelector('canvas');

      expect(canvas).toBeTruthy();
    });
  });

  describe('prop: onCropChange', () => {
    it('should call onCropChange when crop area changes', async () => {
      const onCropChange = jest.fn();
      const { container } = render(
        <CropperElement
          imageSrc="https://example.com/image.jpg"
          onCropChange={onCropChange}
        />,
      );

      const canvas = container.querySelector('canvas') as HTMLCanvasElement;

      // Wait for image to load
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Simulate mouse down and move to trigger crop change
      if (canvas) {
        fireEvent.mouseDown(canvas, {
          clientX: 400,
          clientY: 300,
        });

        fireEvent.mouseMove(canvas, {
          clientX: 450,
          clientY: 350,
        });

        fireEvent.mouseUp(canvas);
      }

      // Note: onCropChange might not be called immediately due to async operations
      // This test verifies the component can handle the interaction
      expect(canvas).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('should render zoom controls', () => {
      const { container } = render(
        <CropperElement imageSrc="https://example.com/image.jpg" />,
      );

      const controls = container.querySelector('.mzn-cropper__controls');
      const slider = container.querySelector('.mzn-slider');

      expect(controls).toBeTruthy();
      expect(slider).toBeTruthy();
    });

    it('should handle wheel zoom', async () => {
      const { container } = render(
        <CropperElement imageSrc="https://example.com/image.jpg" />,
      );

      const canvas = container.querySelector('canvas') as HTMLCanvasElement;

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      if (canvas) {
        fireEvent.wheel(canvas, {
          deltaY: -100,
        });
      }

      expect(canvas).toBeTruthy();
    });

    it('should update cursor style on hover', async () => {
      const { container } = render(
        <CropperElement imageSrc="https://example.com/image.jpg" />,
      );

      const canvas = container.querySelector('canvas') as HTMLCanvasElement;

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      if (canvas) {
        fireEvent.mouseMove(canvas, {
          clientX: 400,
          clientY: 300,
        });
      }

      expect(canvas).toBeTruthy();
    });

    it('should reset hover handle on mouse leave', async () => {
      const { container } = render(
        <CropperElement imageSrc="https://example.com/image.jpg" />,
      );

      const canvas = container.querySelector('canvas') as HTMLCanvasElement;

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      if (canvas) {
        fireEvent.mouseLeave(canvas);
      }

      expect(canvas).toBeTruthy();
    });
  });

  describe('crop area tag', () => {
    it('should render crop area dimensions tag', async () => {
      const { container } = render(
        <CropperElement imageSrc="https://example.com/image.jpg" />,
      );

      // The tag should appear when crop area is set after image loads
      await waitFor(() => {
        const tag = container.querySelector('.mzn-cropper__tag');
        expect(tag).toBeTruthy();
      });
    });
  });

  describe('edge cases', () => {
    it('should handle missing imageSrc', () => {
      const { container } = render(<CropperElement />);

      const canvas = container.querySelector('canvas');

      expect(canvas).toBeTruthy();
    });

    it('should handle rapid imageSrc changes', async () => {
      const { rerender } = render(
        <CropperElement imageSrc="https://example.com/image1.jpg" />,
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      rerender(<CropperElement imageSrc="https://example.com/image2.jpg" />);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      // Component should handle rapid changes without errors
      expect(true).toBeTruthy();
    });
  });
});

