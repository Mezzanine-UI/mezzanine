import { cropToBlob, cropToDataURL, cropToFile } from './cropper-tools';

const CROP_AREA = { height: 50, width: 100, x: 10, y: 20 };

let shouldFailToLoad = false;

/**
 * jsdom never loads an image, so `src` is what resolves the promise here — the
 * same trick the React suite uses.
 */
class MockImage {
  crossOrigin = '';
  height = 600;
  width = 800;
  onload: ((event: Event) => void) | null = null;
  onerror: ((event: Event | string) => void) | null = null;
  private internalSrc = '';

  get src(): string {
    return this.internalSrc;
  }

  set src(value: string) {
    this.internalSrc = value;

    setTimeout(() => {
      if (shouldFailToLoad) {
        this.onerror?.(new Event('error'));

        return;
      }

      this.onload?.(new Event('load'));
    }, 0);
  }
}

const drawImage = vi.fn();
const toBlob = vi.fn(
  (callback: (blob: Blob | null) => void, format?: string) => {
    callback(new Blob(['x'], { type: format ?? 'image/png' }));
  },
);
const toDataURL = vi.fn(() => 'data:image/png;base64,AAAA');

let contextIsNull = false;

function makeCanvas(): HTMLCanvasElement {
  return {
    getContext: () => (contextIsNull ? null : { drawImage }),
    height: 0,
    toBlob,
    toDataURL,
    width: 0,
  } as unknown as HTMLCanvasElement;
}

const createObjectURL = vi.fn(() => 'blob:mock-url');
const revokeObjectURL = vi.fn();

beforeAll(() => {
  vi.stubGlobal('Image', MockImage);
  URL.createObjectURL =
    createObjectURL as unknown as typeof URL.createObjectURL;
  URL.revokeObjectURL =
    revokeObjectURL as unknown as typeof URL.revokeObjectURL;
  vi.spyOn(document, 'createElement').mockImplementation(
    () => makeCanvas() as unknown as HTMLElement,
  );
});

afterAll(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

beforeEach(() => {
  contextIsNull = false;
  shouldFailToLoad = false;
  vi.clearAllMocks();
});

describe('cropToBlob', () => {
  it('should draw the crop area at its own size by default', async () => {
    const canvas = makeCanvas();

    await cropToBlob({ canvas, cropArea: CROP_AREA, imageSrc: 'a.png' });

    expect(canvas.width).toBe(100);
    expect(canvas.height).toBe(50);
    expect(drawImage).toHaveBeenCalledWith(
      expect.anything(),
      10,
      20,
      100,
      50,
      0,
      0,
      100,
      50,
    );
  });

  it('should default to png at quality 0.92', async () => {
    await cropToBlob({
      canvas: makeCanvas(),
      cropArea: CROP_AREA,
      imageSrc: 'a.png',
    });

    expect(toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/png',
      0.92,
    );
  });

  it('should pass a custom format and quality through', async () => {
    await cropToBlob({
      canvas: makeCanvas(),
      cropArea: CROP_AREA,
      format: 'image/jpeg',
      imageSrc: 'a.png',
      quality: 0.5,
    });

    expect(toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/jpeg',
      0.5,
    );
  });

  it('should scale to the output dimensions when given', async () => {
    const canvas = makeCanvas();

    await cropToBlob({
      canvas,
      cropArea: CROP_AREA,
      imageSrc: 'a.png',
      outputHeight: 25,
      outputWidth: 200,
    });

    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(25);
    expect(drawImage).toHaveBeenCalledWith(
      expect.anything(),
      10,
      20,
      100,
      50,
      0,
      0,
      200,
      25,
    );
  });

  it('should mint and revoke an object URL for a File source', async () => {
    const file = new File(['x'], 'a.png', { type: 'image/png' });

    await cropToBlob({
      canvas: makeCanvas(),
      cropArea: CROP_AREA,
      imageSrc: file,
    });

    expect(createObjectURL).toHaveBeenCalledWith(file);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('should create its own canvas when none is provided', async () => {
    await cropToBlob({ cropArea: CROP_AREA, imageSrc: 'a.png' });

    expect(document.createElement).toHaveBeenCalledWith('canvas');
  });

  it('should throw when the canvas has no 2d context', async () => {
    contextIsNull = true;

    await expect(
      cropToBlob({ canvas: makeCanvas(), cropArea: CROP_AREA, imageSrc: 'a' }),
    ).rejects.toThrow('Failed to get canvas context');
  });

  it('should reject when toBlob hands back nothing', async () => {
    toBlob.mockImplementationOnce((callback) => callback(null));

    await expect(
      cropToBlob({ canvas: makeCanvas(), cropArea: CROP_AREA, imageSrc: 'a' }),
    ).rejects.toThrow('Failed to convert canvas to blob');
  });

  it('should reject and revoke the object URL when the image fails', async () => {
    shouldFailToLoad = true;

    await expect(
      cropToBlob({
        canvas: makeCanvas(),
        cropArea: CROP_AREA,
        imageSrc: new Blob(['x']),
      }),
    ).rejects.toBeDefined();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});

describe('cropToFile', () => {
  it('should wrap the blob in a file that keeps its type', async () => {
    const file = await cropToFile(
      {
        canvas: makeCanvas(),
        cropArea: CROP_AREA,
        format: 'image/jpeg',
        imageSrc: 'a.png',
      },
      'cropped.jpg',
    );

    expect(file.name).toBe('cropped.jpg');
    expect(file.type).toBe('image/jpeg');
  });
});

describe('cropToDataURL', () => {
  it('should return the canvas data URL', async () => {
    await expect(
      cropToDataURL({
        canvas: makeCanvas(),
        cropArea: CROP_AREA,
        imageSrc: 'a.png',
      }),
    ).resolves.toBe('data:image/png;base64,AAAA');
    expect(toDataURL).toHaveBeenCalledWith('image/png', 0.92);
  });

  it('should scale to the output dimensions when given', async () => {
    const canvas = makeCanvas();

    await cropToDataURL({
      canvas,
      cropArea: CROP_AREA,
      imageSrc: 'a.png',
      outputHeight: 25,
      outputWidth: 200,
    });

    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(25);
  });

  it('should throw when the canvas has no 2d context', async () => {
    contextIsNull = true;

    await expect(
      cropToDataURL({
        canvas: makeCanvas(),
        cropArea: CROP_AREA,
        imageSrc: 'a',
      }),
    ).rejects.toThrow('Failed to get canvas context');
  });
});
