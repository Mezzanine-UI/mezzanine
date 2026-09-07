import { flushPromises, mount } from '@vue/test-utils';
import { h } from 'vue';
import { cropperClasses as classes } from '@mezzanine-ui/core/cropper';
import type { CropperSize } from '@mezzanine-ui/core/cropper';
import { modalClasses } from '@mezzanine-ui/core/modal';
import { resetPortals } from '../portal/portal-registry';
import MznCropper from './cropper.vue';
import MznCropperModalComponent from './cropper-modal.vue';
import { MznCropperModal } from './cropper-modal';
import type { CropperModalProps } from './cropper-modal.types';

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
      this.onload?.(new Event('load'));
    }, 0);
  }
}

/** See cropper-element.spec.ts: only `setTimeout`, so the order is defined. */
const settle = async (): Promise<void> => {
  for (let i = 0; i < 4; i += 1) {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0);
    });
  }
};

const query = (selector: string): HTMLElement | null =>
  document.body.querySelector(selector);

const queryAll = (selector: string): HTMLElement[] =>
  Array.from(document.body.querySelectorAll(selector));

const footerButtons = (): HTMLElement[] =>
  queryAll(`.${modalClasses.modalFooterActionsButton}`);

beforeAll(() => {
  vi.stubGlobal('Image', MockImage);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe('<MznCropper />', () => {
  it('should render as a div with the host and size classes', () => {
    const wrapper = mount(MznCropper);

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toContain(classes.host);
    expect(wrapper.classes()).toContain(classes.size('main'));
  });

  it('should render the default slot', () => {
    const wrapper = mount(MznCropper, {
      slots: { default: () => h('span', 'foo') },
    });

    expect(wrapper.find('span').text()).toBe('foo');
  });

  it('should append a consumer class name', () => {
    const wrapper = mount(MznCropper, { attrs: { class: 'foo' } });

    expect(wrapper.classes()).toContain('foo');
    expect(wrapper.classes()).toContain(classes.host);
  });

  (['main', 'sub', 'minor'] as CropperSize[]).forEach((size) => {
    it(`should render size="${size}"`, () => {
      const wrapper = mount(MznCropper, { props: { size } });

      expect(wrapper.classes()).toContain(classes.size(size));
    });
  });

  it('should render as a span when asked', () => {
    const wrapper = mount(MznCropper, { props: { component: 'span' } });

    expect(wrapper.element.tagName).toBe('SPAN');
  });
});

describe('<MznCropperModal />', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    resetPortals();
  });

  const renderModal = async (props: Partial<CropperModalProps> = {}) => {
    const wrapper = mount(MznCropperModalComponent, {
      attachTo: document.body,
      props: { open: true, ...props },
    });

    await settle();

    return wrapper;
  };

  it('should render nothing while closed', async () => {
    await renderModal({ open: false });

    expect(query(`.${modalClasses.host}`)).toBeNull();
  });

  it('should render the cropper inside a standard modal', async () => {
    await renderModal();

    expect(query(`.${modalClasses.host}`)).not.toBeNull();
    expect(query(`.${classes.element}`)).not.toBeNull();
    expect(query('canvas')?.classList.contains(classes.host)).toBe(true);
  });

  it('should title the modal 圖片裁切 and label the buttons by default', async () => {
    await renderModal();

    expect(query(`.${modalClasses.modalHeaderTitle}`)?.textContent).toBe(
      '圖片裁切',
    );
    expect(footerButtons().map((button) => button.textContent)).toEqual([
      '取消',
      '確認',
    ]);
  });

  it('should take a custom title and button labels', async () => {
    await renderModal({
      cancelText: '返回',
      confirmText: '送出',
      title: '裁切頁首圖片',
    });

    expect(query(`.${modalClasses.modalHeaderTitle}`)?.textContent).toBe(
      '裁切頁首圖片',
    );
    expect(footerButtons().map((button) => button.textContent)).toEqual([
      '返回',
      '送出',
    ]);
  });

  it('should drop the header when showModalHeader is false', async () => {
    await renderModal({ showModalHeader: false });

    expect(query(`.${modalClasses.modalHeader}`)).toBeNull();
  });

  it('should drop the footer when showModalFooter is false', async () => {
    await renderModal({ showModalFooter: false });

    expect(query(`.${modalClasses.modalFooter}`)).toBeNull();
  });

  it('should append cropperContentClassName to the cropper', async () => {
    await renderModal({ cropperContentClassName: 'foo' });

    const canvas = query('canvas');

    expect(canvas?.classList.contains(classes.content)).toBe(true);
    expect(canvas?.classList.contains('foo')).toBe(true);
  });

  it('should call onCancel and then onClose from the cancel button', async () => {
    const calls: string[] = [];

    await renderModal({
      onCancel: () => calls.push('cancel'),
      onClose: () => calls.push('close'),
    });

    footerButtons()[0].click();
    await flushPromises();

    expect(calls).toEqual(['cancel', 'close']);
  });

  it('should hand the canvas, crop area and source to onConfirm, then close', async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    await renderModal({
      cropperProps: { aspectRatio: 1, imageSrc: 'test.png' },
      onClose,
      onConfirm,
    });

    footerButtons()[1].click();
    await settle();

    expect(onConfirm).toHaveBeenCalledTimes(1);

    const context = onConfirm.mock.calls[0][0];

    expect(context.canvas).toBe(query('canvas'));
    expect(context.imageSrc).toBe('test.png');
    expect(context.cropArea).not.toBeNull();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should wait for a slow onConfirm before closing', async () => {
    let release = (): void => {};
    const onClose = vi.fn();

    await renderModal({
      onClose,
      onConfirm: () =>
        new Promise<void>((resolve) => {
          release = resolve;
        }),
    });

    footerButtons()[1].click();
    await flushPromises();

    expect(onClose).not.toHaveBeenCalled();

    release();
    await flushPromises();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should stay open when onConfirm throws', async () => {
    const onClose = vi.fn();

    vi.spyOn(console, 'error').mockImplementation(() => {});

    await renderModal({
      onClose,
      onConfirm: () => {
        throw new Error('nope');
      },
    });

    footerButtons()[1].click();
    await flushPromises();

    expect(onClose).not.toHaveBeenCalled();
    expect(query(`.${modalClasses.host}`)).not.toBeNull();

    vi.mocked(console.error).mockRestore();
  });

  it('should seed the confirm context from initialCropArea', async () => {
    const onConfirm = vi.fn();
    const initialCropArea = { height: 120, width: 200, x: 40, y: 30 };

    await renderModal({
      cropperProps: { imageSrc: 'test.png', initialCropArea },
      onConfirm,
    });

    footerButtons()[1].click();
    await settle();

    expect(onConfirm.mock.calls[0][0].cropArea).toEqual(initialCropArea);
  });

  it('should forward the cropper callbacks it does not own', async () => {
    const onCropChange = vi.fn();
    const onImageLoad = vi.fn();

    await renderModal({
      cropperProps: { imageSrc: 'test.png', onCropChange, onImageLoad },
    });

    // Not a call count: the portal mounts its children in place and then
    // moves them, so the cropper loads the image once per mount — React's
    // portal does the same thing.
    expect(onImageLoad).toHaveBeenCalled();
    expect(onCropChange).toHaveBeenCalled();
  });
});

describe('MznCropperModal.open', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    resetPortals();
  });

  it('should mount a modal outside the caller and resolve with the context', async () => {
    const promise = MznCropperModal.open({
      cropperProps: { imageSrc: 'test.png' },
    });

    await settle();

    expect(query(`.${modalClasses.host}`)).not.toBeNull();

    footerButtons()[1].click();
    await settle();

    const result = await promise;

    expect(result?.imageSrc).toBe('test.png');
    expect(result?.cropArea).not.toBeNull();
  });

  it('should resolve with null when the modal is dismissed', async () => {
    const onCancel = vi.fn();
    const promise = MznCropperModal.open({ onCancel });

    await settle();
    footerButtons()[0].click();
    await settle();

    expect(onCancel).toHaveBeenCalledTimes(1);
    await expect(promise).resolves.toBeNull();
  });

  it('should take the modal away once it has settled', async () => {
    const promise = MznCropperModal.open({});

    await settle();
    footerButtons()[0].click();
    await settle();
    await promise;

    expect(query(`.${modalClasses.host}`)).toBeNull();
  });

  it('should resolve null and keep going when onConfirm throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const promise = MznCropperModal.open({
      onConfirm: () => {
        throw new Error('nope');
      },
    });

    await settle();
    footerButtons()[1].click();
    await settle();

    await expect(promise).resolves.toBeNull();

    vi.mocked(console.error).mockRestore();
  });
});
