import { cropToBlob, cropToDataURL, cropToFile, CropToBlobOptions } from './tools';
import { CropArea } from './typings';

// Mock Image constructor
class MockImage extends Image {
  private _src: string = '';
  public onload: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
  public onerror: ((this: GlobalEventHandlers, ev: Event | string) => any) | null = null;

  constructor() {
    super();
    Object.defineProperty(this, 'width', { value: 800, writable: false });
    Object.defineProperty(this, 'height', { value: 600, writable: false });
    
    // Auto-resolve onload when src is set
    Object.defineProperty(this, 'src', {
      get: () => this._src,
      set: (value: string) => {
        this._src = value;
        // Use setTimeout to simulate async load
        setTimeout(() => {
          if (this.onload) {
            this.onload({} as any);
          }
        }, 0);
      },
      configurable: true,
    });
  }
}

// Mock canvas context
const mockDrawImage = jest.fn();
const mockClearRect = jest.fn();
const mockFillRect = jest.fn();
const mockStrokeRect = jest.fn();
const mockSave = jest.fn();
const mockRestore = jest.fn();
const mockClip = jest.fn();
const mockSetTransform = jest.fn();

const mockGetContext = jest.fn(() => ({
  drawImage: mockDrawImage,
  clearRect: mockClearRect,
  fillRect: mockFillRect,
  strokeRect: mockStrokeRect,
  save: mockSave,
  restore: mockRestore,
  clip: mockClip,
  setTransform: mockSetTransform,
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
}));

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
const mockRevokeObjectURL = jest.fn();

// Mock canvas.toBlob
const mockToBlob = jest.fn((callback: (blob: Blob | null) => void) => {
  const blob = new Blob([''], { type: 'image/png' });
  callback(blob);
});

// Mock canvas.toDataURL
const mockToDataURL = jest.fn(() => 'data:image/png;base64,mock-data');

beforeAll(() => {
  global.Image = MockImage as unknown as typeof Image;
  if (global.URL) {
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;
  }

  // Mock HTMLCanvasElement
  HTMLCanvasElement.prototype.getContext = mockGetContext as unknown as typeof HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.toBlob = mockToBlob as unknown as typeof HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toDataURL = mockToDataURL as unknown as typeof HTMLCanvasElement.prototype.toDataURL;
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('cropToBlob', () => {
  const defaultCropArea: CropArea = {
    height: 200,
    width: 200,
    x: 100,
    y: 100,
  };

  const defaultOptions: CropToBlobOptions = {
    cropArea: defaultCropArea,
    imageSrc: 'https://example.com/image.jpg',
  };

  it('should create a blob from cropped image', async () => {
    const blob = await cropToBlob(defaultOptions);

    expect(blob).toBeInstanceOf(Blob);
    expect(mockGetContext).toHaveBeenCalledWith('2d');
    expect(mockDrawImage).toHaveBeenCalled();
    expect(mockToBlob).toHaveBeenCalled();
  });

  it('should use default format and quality', async () => {
    await cropToBlob(defaultOptions);

    expect(mockToBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/png',
      0.92,
    );
  });

  it('should use custom format and quality', async () => {
    await cropToBlob({
      ...defaultOptions,
      format: 'image/jpeg',
      quality: 0.8,
    });

    expect(mockToBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/jpeg',
      0.8,
    );
  });

  it('should use custom output dimensions', async () => {
    await cropToBlob({
      ...defaultOptions,
      outputHeight: 400,
      outputWidth: 400,
    });

    expect(mockDrawImage).toHaveBeenCalled();
    const callArgs = mockDrawImage.mock.calls[0];
    expect(callArgs[1]).toBe(100); // x
    expect(callArgs[2]).toBe(100); // y
    expect(callArgs[3]).toBe(200); // width
    expect(callArgs[4]).toBe(200); // height
    expect(callArgs[5]).toBe(0); // dest x
    expect(callArgs[6]).toBe(0); // dest y
    expect(callArgs[7]).toBe(400); // dest width
    expect(callArgs[8]).toBe(400); // dest height
  });

  it('should use crop area dimensions when output dimensions not provided', async () => {
    await cropToBlob(defaultOptions);

    expect(mockDrawImage).toHaveBeenCalled();
    const callArgs = mockDrawImage.mock.calls[0];
    expect(callArgs[1]).toBe(100); // x
    expect(callArgs[2]).toBe(100); // y
    expect(callArgs[3]).toBe(200); // width
    expect(callArgs[4]).toBe(200); // height
    expect(callArgs[5]).toBe(0); // dest x
    expect(callArgs[6]).toBe(0); // dest y
    expect(callArgs[7]).toBe(200); // dest width
    expect(callArgs[8]).toBe(200); // dest height
  });

  it('should handle File as image source', async () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });

    await cropToBlob({
      ...defaultOptions,
      imageSrc: file,
    });

    expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  it('should handle Blob as image source', async () => {
    const blob = new Blob([''], { type: 'image/jpeg' });

    await cropToBlob({
      ...defaultOptions,
      imageSrc: blob,
    });

    expect(mockCreateObjectURL).toHaveBeenCalledWith(blob);
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  it('should use provided canvas', async () => {
    const canvas = document.createElement('canvas');

    await cropToBlob({
      ...defaultOptions,
      canvas,
    });

    expect(mockGetContext).toHaveBeenCalled();
  });

  it('should create temporary canvas when not provided', async () => {
    const createElementSpy = jest.spyOn(document, 'createElement');

    await cropToBlob(defaultOptions);

    expect(createElementSpy).toHaveBeenCalledWith('canvas');
  });

  it('should throw error when canvas context is null', async () => {
    mockGetContext.mockReturnValueOnce(null as any);

    await expect(cropToBlob(defaultOptions)).rejects.toThrow(
      'Failed to get canvas context',
    );
  });

  it('should reject when toBlob returns null', async () => {
    mockToBlob.mockImplementationOnce((callback) => {
      callback(null);
    });

    await expect(cropToBlob(defaultOptions)).rejects.toThrow(
      'Failed to convert canvas to blob',
    );
  });

  it('should handle image load error', async () => {
    const invalidOptions: CropToBlobOptions = {
      ...defaultOptions,
      imageSrc: 'https://invalid-url.com/image.jpg',
    };

    // Mock Image to throw error
    const originalImage = global.Image;
    global.Image = class {
      public onerror: ((this: GlobalEventHandlers, ev: Event | string) => any) | null = null;
      public onload: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;

      set src(_value: string) {
        setTimeout(() => {
          if (this.onerror) {
            (this.onerror as (this: unknown, ev: Event | string) => any).call(
              this,
              new Error('Failed to load image') as any,
            );
          }
        }, 10);
      }
    } as unknown as typeof Image;

    await expect(cropToBlob(invalidOptions)).rejects.toThrow();

    global.Image = originalImage;
  }, 10000);
});

describe('cropToFile', () => {
  const defaultCropArea: CropArea = {
    height: 200,
    width: 200,
    x: 100,
    y: 100,
  };

  const defaultOptions: CropToBlobOptions = {
    cropArea: defaultCropArea,
    imageSrc: 'https://example.com/image.jpg',
  };

  it('should create a file from cropped image', async () => {
    const filename = 'cropped-image.png';
    const file = await cropToFile(defaultOptions, filename);

    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe(filename);
    expect(mockToBlob).toHaveBeenCalled();
  });

  it('should use blob type for file', async () => {
    const filename = 'cropped-image.png';
    const file = await cropToFile(defaultOptions, filename);

    expect(file.type).toBe('image/png');
  });
});

describe('cropToDataURL', () => {
  const defaultCropArea: CropArea = {
    height: 200,
    width: 200,
    x: 100,
    y: 100,
  };

  const defaultOptions: CropToBlobOptions = {
    cropArea: defaultCropArea,
    imageSrc: 'https://example.com/image.jpg',
  };

  it('should return data URL from cropped image', async () => {
    const dataURL = await cropToDataURL(defaultOptions);

    expect(dataURL).toBe('data:image/png;base64,mock-data');
    expect(mockGetContext).toHaveBeenCalledWith('2d');
    expect(mockDrawImage).toHaveBeenCalled();
    expect(mockToDataURL).toHaveBeenCalled();
  });

  it('should use default format and quality', async () => {
    await cropToDataURL(defaultOptions);

    expect(mockToDataURL).toHaveBeenCalledWith('image/png', 0.92);
  });

  it('should use custom format and quality', async () => {
    await cropToDataURL({
      ...defaultOptions,
      format: 'image/jpeg',
      quality: 0.8,
    });

    expect(mockToDataURL).toHaveBeenCalledWith('image/jpeg', 0.8);
  });

  it('should use custom output dimensions', async () => {
    await cropToDataURL({
      ...defaultOptions,
      outputHeight: 400,
      outputWidth: 400,
    });

    expect(mockDrawImage).toHaveBeenCalled();
    const callArgs = mockDrawImage.mock.calls[0];
    expect(callArgs[1]).toBe(100); // x
    expect(callArgs[2]).toBe(100); // y
    expect(callArgs[3]).toBe(200); // width
    expect(callArgs[4]).toBe(200); // height
    expect(callArgs[5]).toBe(0); // dest x
    expect(callArgs[6]).toBe(0); // dest y
    expect(callArgs[7]).toBe(400); // dest width
    expect(callArgs[8]).toBe(400); // dest height
  });

  it('should use crop area dimensions when output dimensions not provided', async () => {
    await cropToDataURL(defaultOptions);

    expect(mockDrawImage).toHaveBeenCalled();
    const callArgs = mockDrawImage.mock.calls[0];
    expect(callArgs[1]).toBe(100); // x
    expect(callArgs[2]).toBe(100); // y
    expect(callArgs[3]).toBe(200); // width
    expect(callArgs[4]).toBe(200); // height
    expect(callArgs[5]).toBe(0); // dest x
    expect(callArgs[6]).toBe(0); // dest y
    expect(callArgs[7]).toBe(200); // dest width
    expect(callArgs[8]).toBe(200); // dest height
  });

  it('should handle File as image source', async () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });

    await cropToDataURL({
      ...defaultOptions,
      imageSrc: file,
    });

    expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  it('should handle Blob as image source', async () => {
    const blob = new Blob([''], { type: 'image/jpeg' });

    await cropToDataURL({
      ...defaultOptions,
      imageSrc: blob,
    });

    expect(mockCreateObjectURL).toHaveBeenCalledWith(blob);
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  it('should use provided canvas', async () => {
    const canvas = document.createElement('canvas');

    await cropToDataURL({
      ...defaultOptions,
      canvas,
    });

    expect(mockGetContext).toHaveBeenCalled();
  });

  it('should create temporary canvas when not provided', async () => {
    const createElementSpy = jest.spyOn(document, 'createElement');

    await cropToDataURL(defaultOptions);

    expect(createElementSpy).toHaveBeenCalledWith('canvas');
  });

  it('should throw error when canvas context is null', async () => {
    mockGetContext.mockReturnValueOnce(null as any);

    await expect(cropToDataURL(defaultOptions)).rejects.toThrow(
      'Failed to get canvas context',
    );
  });

  it('should handle image load error', async () => {
    const invalidOptions: CropToBlobOptions = {
      ...defaultOptions,
      imageSrc: 'https://invalid-url.com/image.jpg',
    };

    // Mock Image to throw error
    const originalImage = global.Image;
    global.Image = class {
      public onerror: ((this: GlobalEventHandlers, ev: Event | string) => any) | null = null;
      public onload: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;

      set src(_value: string) {
        setTimeout(() => {
          if (this.onerror) {
            (this.onerror as (this: unknown, ev: Event | string) => any).call(
              this,
              new Error('Failed to load image') as any,
            );
          }
        }, 10);
      }
    } as unknown as typeof Image;

    await expect(cropToDataURL(invalidOptions)).rejects.toThrow();

    global.Image = originalImage;
  }, 10000);

  it('should revoke object URL on error', async () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const originalImage = global.Image;

    global.Image = class {
      public onerror: ((this: GlobalEventHandlers, ev: Event | string) => any) | null = null;
      public onload: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;

      set src(_value: string) {
        setTimeout(() => {
          if (this.onerror) {
            (this.onerror as (this: unknown, ev: Event | string) => any).call(
              this,
              new Error('Failed to load image') as any,
            );
          }
        }, 10);
      }
    } as unknown as typeof Image;

    try {
      await cropToDataURL({
        ...defaultOptions,
        imageSrc: file,
      });
    } catch (error) {
      // Expected to throw
    }

    expect(mockRevokeObjectURL).toHaveBeenCalled();

    global.Image = originalImage;
  }, 10000);
});

