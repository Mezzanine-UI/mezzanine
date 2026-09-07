import { flushPromises, mount } from '@vue/test-utils';
import { cropperClasses as classes } from '@mezzanine-ui/core/cropper';
import type { CropperSize } from '@mezzanine-ui/core/cropper';
import MznCropperElement from './cropper-element.vue';
import MznSlider from '../slider/slider.vue';
import type { CropArea } from './cropper.types';

let shouldFailToLoad = false;

/**
 * jsdom never loads an image, so setting `src` is what settles the promise —
 * the same stand-in the React suite uses.
 */
class MockImage {
  crossOrigin = '';
  /** Twice the mocked canvas box, so image-space and canvas-space differ. */
  height = 1200;
  width = 1600;
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

const createObjectURL = vi.fn(() => 'blob:mock-url');
const revokeObjectURL = vi.fn();

/**
 * Only `setTimeout`, so the ordering stays deterministic: the mock image's own
 * timer is registered from a post-render effect, and a timer queued afterwards
 * is guaranteed to run after it. (`flushPromises` uses `setImmediate`, whose
 * order against a pending `setTimeout` is not.)
 */
const settle = async (): Promise<void> => {
  for (let i = 0; i < 4; i += 1) {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });
  }
};

beforeAll(() => {
  vi.stubGlobal('Image', MockImage);
  URL.createObjectURL =
    createObjectURL as unknown as typeof URL.createObjectURL;
  URL.revokeObjectURL =
    revokeObjectURL as unknown as typeof URL.revokeObjectURL;
});

afterAll(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

beforeEach(() => {
  shouldFailToLoad = false;
  vi.clearAllMocks();
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    bottom: 600,
    height: 600,
    left: 0,
    right: 800,
    toJSON: () => ({}),
    top: 0,
    width: 800,
    x: 0,
    y: 0,
  } as DOMRect);
  Object.defineProperty(window, 'devicePixelRatio', {
    configurable: true,
    value: 1,
  });
});

describe('<MznCropperElement />', () => {
  it('should render the canvas inside the element wrapper', () => {
    const wrapper = mount(MznCropperElement);

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toContain(classes.element);
    expect(wrapper.find(`canvas.${classes.host}`).exists()).toBe(true);
  });

  it('should render size="main" by default on the canvas', () => {
    const wrapper = mount(MznCropperElement);

    expect(wrapper.find('canvas').classes()).toContain(classes.size('main'));
  });

  (['main', 'sub', 'minor'] as CropperSize[]).forEach((size) => {
    it(`should render size="${size}" on the canvas`, () => {
      const wrapper = mount(MznCropperElement, { props: { size } });

      expect(wrapper.find('canvas').classes()).toContain(classes.size(size));
    });
  });

  it('should put fallthrough attributes on the canvas, not the wrapper', () => {
    const wrapper = mount(MznCropperElement, {
      attrs: { class: 'foo', 'data-testid': 'bar' },
    });

    expect(wrapper.classes()).not.toContain('foo');
    expect(wrapper.find('canvas').classes()).toContain('foo');
    expect(wrapper.find('canvas').attributes('data-testid')).toBe('bar');
  });

  it('should expose the canvas element', () => {
    const wrapper = mount(MznCropperElement);

    expect(
      (wrapper.vm as unknown as { canvas: HTMLCanvasElement }).canvas,
    ).toBe(wrapper.find('canvas').element);
  });

  it('should render the zoom controls with a slider', () => {
    const wrapper = mount(MznCropperElement);
    const slider = wrapper.findComponent(MznSlider);

    expect(wrapper.find(`.${classes.controls}`).exists()).toBe(true);
    expect(slider.props('min')).toBe(1);
    expect(slider.props('max')).toBe(2);
    expect(slider.props('step')).toBe(0.01);
    expect(slider.props('value')).toBe(1);
  });

  describe('prop: imageSrc', () => {
    it('should report a successful load', async () => {
      const onImageLoad = vi.fn();
      const wrapper = mount(MznCropperElement, {
        props: { imageSrc: 'test.png', onImageLoad },
      });

      await settle();

      expect(onImageLoad).toHaveBeenCalledTimes(1);
      expect(wrapper.find(`.${classes.tag}`).exists()).toBe(true);
    });

    it('should load a File through an object URL and revoke it on unmount', async () => {
      const file = new File(['x'], 'a.png', { type: 'image/png' });
      const wrapper = mount(MznCropperElement, { props: { imageSrc: file } });

      await settle();

      expect(createObjectURL).toHaveBeenCalledWith(file);

      wrapper.unmount();

      expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should report a failed load', async () => {
      shouldFailToLoad = true;

      const onImageError = vi.fn();

      vi.spyOn(console, 'error').mockImplementation(() => {});
      mount(MznCropperElement, {
        props: { imageSrc: 'broken.png', onImageError },
      });

      await settle();

      expect(onImageError).toHaveBeenCalledTimes(1);
      expect(onImageError.mock.calls[0][0]).toBeInstanceOf(Error);
    });

    it('should do nothing without an image source', async () => {
      const onImageLoad = vi.fn();
      const wrapper = mount(MznCropperElement, { props: { onImageLoad } });

      await settle();

      expect(onImageLoad).not.toHaveBeenCalled();
      expect(wrapper.find(`.${classes.tag}`).exists()).toBe(false);
    });
  });

  describe('prop: onCropChange', () => {
    it('should report the crop area in image pixel space', async () => {
      const onCropChange = vi.fn();

      mount(MznCropperElement, {
        props: { imageSrc: 'test.png', onCropChange },
      });

      await settle();

      expect(onCropChange).toHaveBeenCalled();
      expect(onCropChange.mock.lastCall?.[0]).toEqual({
        height: 1200,
        width: 1600,
        x: 0,
        y: 0,
      });
    });

    it('should keep an aspect-ratio crop centred', async () => {
      const onCropChange = vi.fn();

      mount(MznCropperElement, {
        props: { aspectRatio: 1, imageSrc: 'test.png', onCropChange },
      });

      await settle();

      expect(onCropChange.mock.lastCall?.[0]).toEqual({
        height: 1200,
        width: 1200,
        x: 200,
        y: 0,
      });
    });
  });

  describe('prop: initialCropArea', () => {
    it('should use the given crop area rather than measuring one', async () => {
      const initialCropArea: CropArea = {
        height: 120,
        width: 200,
        x: 40,
        y: 30,
      };
      const onCropChange = vi.fn();
      const wrapper = mount(MznCropperElement, {
        props: { imageSrc: 'test.png', initialCropArea, onCropChange },
      });

      await settle();

      expect(onCropChange.mock.lastCall?.[0]).toEqual({
        height: 240,
        width: 400,
        x: 80,
        y: 60,
      });
      expect(wrapper.find(`.${classes.tag}`).text()).toBe('400 × 240 px');
    });
  });

  describe('crop area tag', () => {
    it('should report the size in image pixels once a listener converts it', async () => {
      const wrapper = mount(MznCropperElement, {
        props: {
          aspectRatio: 1,
          imageSrc: 'test.png',
          onCropChange: vi.fn(),
        },
      });

      await settle();

      expect(wrapper.find(`.${classes.tag}`).text()).toBe('1200 × 1200 px');
    });

    it('should fall back to the canvas area when nobody listens', async () => {
      const wrapper = mount(MznCropperElement, {
        props: { aspectRatio: 1, imageSrc: 'test.png' },
      });

      await settle();

      expect(wrapper.find(`.${classes.tag}`).text()).toBe('600 × 600 px');
    });
  });

  describe('zooming', () => {
    it('should report a scale change coming from the slider', async () => {
      const onScaleChange = vi.fn();
      const wrapper = mount(MznCropperElement, {
        props: { imageSrc: 'test.png', onScaleChange },
      });

      await settle();
      wrapper.findComponent(MznSlider).vm.$emit('change', 1.5);
      await flushPromises();

      expect(onScaleChange).toHaveBeenCalledWith(1.5);
      expect(wrapper.findComponent(MznSlider).props('value')).toBe(1.5);
    });

    it('should zoom on the wheel and clamp to the scale range', async () => {
      const onScaleChange = vi.fn();
      const wrapper = mount(MznCropperElement, {
        props: { imageSrc: 'test.png', onScaleChange },
      });

      await settle();

      const canvas = wrapper.find('canvas').element;

      canvas.dispatchEvent(
        new WheelEvent('wheel', { cancelable: true, deltaY: -1 }),
      );
      await flushPromises();

      expect(onScaleChange).toHaveBeenLastCalledWith(1.05);

      for (let i = 0; i < 40; i += 1) {
        canvas.dispatchEvent(
          new WheelEvent('wheel', { cancelable: true, deltaY: -1 }),
        );
      }

      await flushPromises();

      expect(onScaleChange).toHaveBeenLastCalledWith(2);
    });

    it('should ignore the wheel before there is a crop area', async () => {
      const onScaleChange = vi.fn();
      const wrapper = mount(MznCropperElement, { props: { onScaleChange } });

      await settle();
      wrapper
        .find('canvas')
        .element.dispatchEvent(
          new WheelEvent('wheel', { cancelable: true, deltaY: -1 }),
        );
      await flushPromises();

      expect(onScaleChange).not.toHaveBeenCalled();
    });
  });

  describe('dragging the image', () => {
    it('should report the drag end after a press on the image', async () => {
      const onImageDragEnd = vi.fn();
      const wrapper = mount(MznCropperElement, {
        attachTo: document.body,
        props: { imageSrc: 'test.png', onImageDragEnd },
      });

      await settle();

      const canvas = wrapper.find('canvas').element;

      canvas.dispatchEvent(
        new MouseEvent('mousedown', { clientX: 400, clientY: 300 }),
      );
      await flushPromises();

      expect(wrapper.find('canvas').attributes('style')).toContain(
        'cursor: grabbing',
      );

      document.dispatchEvent(new MouseEvent('mouseup'));
      await flushPromises();

      expect(onImageDragEnd).toHaveBeenCalledTimes(1);
      expect(wrapper.find('canvas').attributes('style')).toContain(
        'cursor: default',
      );
    });

    it('should ignore a press that lands outside the image', async () => {
      const onImageDragEnd = vi.fn();
      const wrapper = mount(MznCropperElement, {
        attachTo: document.body,
        props: {
          imageSrc: 'test.png',
          initialCropArea: { height: 10, width: 10, x: 0, y: 0 },
          onImageDragEnd,
        },
      });

      await settle();
      wrapper
        .find('canvas')
        .element.dispatchEvent(
          new MouseEvent('mousedown', { clientX: 5000, clientY: 5000 }),
        );
      document.dispatchEvent(new MouseEvent('mouseup'));
      await flushPromises();

      expect(onImageDragEnd).not.toHaveBeenCalled();
    });
  });
});
