import { flushPromises, mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import { resetPortals } from '../portal/portal-registry';
import MznMediaPreviewModal from './media-preview-modal.vue';
import type { MediaPreviewModalProps } from './media-preview-modal.types';

const IMAGES = ['/a.png', '/b.png', '/c.png'];

const query = (selector: string): HTMLElement | null =>
  document.body.querySelector(selector);

async function render(
  props: Partial<MediaPreviewModalProps> = {},
  listeners: Record<string, unknown> = {},
) {
  const wrapper = mount(MznMediaPreviewModal, {
    attachTo: document.body,
    props: {
      mediaItems: IMAGES,
      open: true,
      ...props,
      ...listeners,
    } as MediaPreviewModalProps,
  });

  await flushPromises();

  return wrapper;
}

const prevButton = (): HTMLElement | null =>
  query(`.${classes.mediaPreviewNavButtonPrev}`);

const nextButton = (): HTMLElement | null =>
  query(`.${classes.mediaPreviewNavButtonNext}`);

describe('<MznMediaPreviewModal />', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // See PORTING-PLAYBOOK P16: the registry caches its containers.
    resetPortals();
  });

  it('should render nothing while closed', async () => {
    await render({ open: false });

    expect(query(`.${classes.mediaPreview}`)).toBeNull();
  });

  it('should render the current image inside a media-preview dialog', async () => {
    await render({ defaultIndex: 1 });

    const dialog = query(`.${classes.mediaPreview}`);

    expect(dialog?.getAttribute('role')).toBe('dialog');
    expect(dialog?.classList.contains(classes.host)).toBe(true);

    const image = query(`.${classes.mediaPreviewImage}`) as HTMLImageElement;

    expect(image.tagName).toBe('IMG');
    expect(image.getAttribute('alt')).toBe('Media 2');
    expect(image.getAttribute('src')).toBe('/b.png');
  });

  it('should wrap a non-string item instead of rendering an image', async () => {
    await render({ mediaItems: [h('span', 'custom')] });

    const media = query(`.${classes.mediaPreviewImage}`);

    expect(media?.tagName).toBe('DIV');
    expect(media?.textContent).toBe('custom');
  });

  it('should hide the navigation for a single item', async () => {
    await render({ mediaItems: [IMAGES[0]] });

    expect(prevButton()).toBeNull();
    expect(nextButton()).toBeNull();
    expect(query(`.${classes.mediaPreviewPaginationIndicator}`)).toBeNull();
  });

  it('should disable the arrows at each end', async () => {
    await render();

    expect(prevButton()?.getAttribute('aria-disabled')).toBe('true');
    expect(nextButton()?.getAttribute('aria-disabled')).toBe('false');

    document.body.innerHTML = '';
    resetPortals();

    await render({ defaultIndex: IMAGES.length - 1 });

    expect(prevButton()?.getAttribute('aria-disabled')).toBe('false');
    expect(nextButton()?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should walk the gallery and report the new index', async () => {
    const wrapper = await render();

    nextButton()?.click();
    await nextTick();

    expect(wrapper.emitted('indexChange')).toEqual([[1]]);
    expect(
      query(`.${classes.mediaPreviewPaginationIndicator}`)?.textContent,
    ).toBe('2/3');

    prevButton()?.click();
    await nextTick();

    expect(wrapper.emitted('indexChange')?.at(-1)).toEqual([0]);
  });

  it('should wrap around and never disable an arrow when circular', async () => {
    const wrapper = await render({ enableCircularNavigation: true });

    expect(prevButton()?.getAttribute('aria-disabled')).toBe('false');

    prevButton()?.click();
    await nextTick();

    expect(wrapper.emitted('indexChange')).toEqual([[IMAGES.length - 1]]);
  });

  it('should hand navigation over in controlled mode', async () => {
    const wrapper = await render(
      { currentIndex: 1 },
      { onNext: () => {}, onPrev: () => {} },
    );

    nextButton()?.click();
    await nextTick();

    expect(wrapper.emitted('next')).toHaveLength(1);
    expect(wrapper.emitted('indexChange')).toBeUndefined();
    expect(
      query(`.${classes.mediaPreviewPaginationIndicator}`)?.textContent,
    ).toBe('2/3');
  });

  it('should label and count the pages, unless the indicator is hidden', async () => {
    await render({ defaultIndex: 2 });

    const indicator = query(`.${classes.mediaPreviewPaginationIndicator}`);

    expect(indicator?.getAttribute('aria-label')).toBe('Page 3 of 3');
    expect(indicator?.textContent).toBe('3/3');

    document.body.innerHTML = '';
    resetPortals();

    await render({ showPaginationIndicator: false });

    expect(query(`.${classes.mediaPreviewPaginationIndicator}`)).toBeNull();
  });

  it('should emit close from the close button', async () => {
    const wrapper = await render();

    (query(`.${classes.mediaPreviewCloseButton}`) as HTMLElement).click();

    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('should render the three text nodes React writes for the counter', async () => {
    await render();

    const indicator = query(`.${classes.mediaPreviewPaginationIndicator}`);

    // The empty ones are the fragment anchors Vue puts around a functional
    // component's output; the parity snapshot drops them for the same reason.
    expect(
      Array.from(indicator?.childNodes ?? [])
        .map((node) => node.textContent)
        .filter(Boolean),
    ).toEqual(['1', '/', '3']);
  });

  it('should reset to defaultIndex each time it opens', async () => {
    const wrapper = await render({ defaultIndex: 2 });

    nextButton()?.click();
    await nextTick();

    await wrapper.setProps({ open: false });
    await wrapper.setProps({ open: true });
    await flushPromises();

    expect(
      query(`.${classes.mediaPreviewPaginationIndicator}`)?.textContent,
    ).toBe('3/3');
  });

  it('should preload the current and adjacent images', async () => {
    const sources: string[] = [];

    vi.stubGlobal(
      'Image',
      class {
        set src(value: string) {
          sources.push(value);
        }
      },
    );

    await render({ defaultIndex: 0 });

    expect(sources).toEqual(['/a.png', '/b.png']);

    vi.unstubAllGlobals();
  });
});
