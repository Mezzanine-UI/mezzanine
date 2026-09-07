import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import {
  uploadClasses,
  uploadItemClasses,
  uploadPictureCardClasses,
  uploaderClasses,
} from '@mezzanine-ui/core/upload';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import MznUploadItem from './upload-item.vue';
import MznUploadPictureCard from './upload-picture-card.vue';
import MznUploader from './uploader.vue';
import MznUpload from './upload.vue';
import { isImageFile, resolveFileType } from './upload-utils';
import type { UploadFile, UploadProps } from './upload.types';

const imageFile = (name = 'photo.jpg'): File =>
  new File([''], name, { type: 'image/jpeg' });

const pdfFile = (name = 'document.pdf'): File =>
  new File([''], name, { type: 'application/pdf' });

describe('upload utils', () => {
  it('should prefer the file type over the url', () => {
    expect(resolveFileType(imageFile(), 'https://example.com/a.pdf')).toBe(
      'image/jpeg',
    );
  });

  it('should infer the type from a url extension', () => {
    expect(resolveFileType(undefined, 'https://example.com/a.png')).toBe(
      'image/png',
    );
  });

  it('should normalise jpg to jpeg', () => {
    expect(resolveFileType(undefined, 'https://example.com/a.jpg')).toBe(
      'image/jpeg',
    );
  });

  it('should give up on an unknown extension', () => {
    expect(resolveFileType(undefined, 'https://example.com/a.pdf')).toBe('');
    expect(resolveFileType(undefined, undefined)).toBe('');
  });

  it('should tell images apart', () => {
    expect(isImageFile(imageFile())).toBe(true);
    expect(isImageFile(pdfFile())).toBe(false);
    expect(isImageFile(undefined, 'https://example.com/a.webp')).toBe(true);
  });
});

describe('<MznUploadItem />', () => {
  it('should take its name from the file', () => {
    const wrapper = mount(MznUploadItem, {
      props: { file: pdfFile('report.pdf'), status: 'done' },
    });

    expect(wrapper.get(`.${uploadItemClasses.name}`).text()).toBe('report.pdf');
  });

  it('should take its name from a url when there is no file', () => {
    const wrapper = mount(MznUploadItem, {
      props: {
        status: 'done',
        url: 'https://example.com/files/report.pdf?v=1',
      },
    });

    expect(wrapper.get(`.${uploadItemClasses.name}`).text()).toBe('report.pdf');
  });

  it('should format the file size once the upload has finished', () => {
    const wrapper = mount(MznUploadItem, {
      props: { fileSize: 2048, status: 'done' },
    });

    expect(wrapper.get(`.${uploadItemClasses.fontSize}`).text()).toBe('2 KB');
  });

  it('should keep the size back while still loading', () => {
    const wrapper = mount(MznUploadItem, {
      props: { fileSize: 2048, status: 'loading' },
    });

    expect(wrapper.find(`.${uploadItemClasses.fontSize}`).exists()).toBe(false);
  });

  it('should offer cancel while loading, download when done and reload on error', () => {
    const loading = mount(MznUploadItem, {
      props: { file: pdfFile(), status: 'loading' },
    });

    expect(loading.find(`.${uploadItemClasses.loadingIcon}`).exists()).toBe(
      true,
    );
    expect(loading.find(`.${uploadItemClasses.closeIcon}`).exists()).toBe(true);
    expect(loading.find(`.${uploadItemClasses.deleteContent}`).exists()).toBe(
      false,
    );

    const done = mount(MznUploadItem, {
      props: { file: pdfFile(), status: 'done' },
    });

    expect(done.find(`.${uploadItemClasses.downloadIcon}`).exists()).toBe(true);
    expect(done.find(`.${uploadItemClasses.deleteContent}`).exists()).toBe(
      true,
    );

    const error = mount(MznUploadItem, {
      props: { file: pdfFile(), status: 'error' },
    });

    expect(error.find(`.${uploadItemClasses.resetIcon}`).exists()).toBe(true);
    expect(error.get(`.${uploadItemClasses.host}`).classes()).toContain(
      uploadItemClasses.error,
    );
  });

  it('should hide every action while disabled', () => {
    const wrapper = mount(MznUploadItem, {
      props: { disabled: true, file: pdfFile(), status: 'done' },
    });

    expect(wrapper.get(`.${uploadItemClasses.host}`).classes()).toContain(
      uploadItemClasses.disabled,
    );
    expect(wrapper.find(`.${uploadItemClasses.downloadIcon}`).exists()).toBe(
      false,
    );
    expect(wrapper.find(`.${uploadItemClasses.deleteContent}`).exists()).toBe(
      false,
    );
  });

  it('should report a click on each action', async () => {
    const wrapper = mount(MznUploadItem, {
      props: {
        file: pdfFile(),
        onDelete: () => {},
        onDownload: () => {},
        status: 'done',
      },
    });

    await wrapper.get(`.${uploadItemClasses.downloadIcon}`).trigger('click');
    await wrapper.get(`.${uploadItemClasses.deleteIcon}`).trigger('click');

    expect(wrapper.emitted('download')).toHaveLength(1);
    expect(wrapper.emitted('delete')).toHaveLength(1);
  });

  it('should leave an action without a handler when nobody listens', () => {
    const wrapper = mount(MznUploadItem, {
      props: { file: pdfFile(), status: 'done' },
    });

    // An icon that has a click listener draws a pointer cursor.
    expect(
      wrapper.get(`.${uploadItemClasses.downloadIcon}`).attributes('style'),
    ).not.toContain('pointer');
  });

  it('should show the error message under the item', () => {
    const wrapper = mount(MznUploadItem, {
      props: {
        errorMessage: '上傳失敗',
        file: pdfFile(),
        status: 'error',
      },
    });

    expect(document.body.textContent ?? wrapper.html()).toBeDefined();
    expect(wrapper.html()).toContain('上傳失敗');
  });

  it('should warn when it is given neither a file nor a url', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mount(MznUploadItem, { props: { status: 'done' } });

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Both `file` and `url` props are missing'),
    );

    warn.mockRestore();
  });
});

describe('<MznUploadPictureCard />', () => {
  it('should render an image for an image file', () => {
    const wrapper = mount(MznUploadPictureCard, {
      props: { file: imageFile(), status: 'done' },
    });

    expect(wrapper.find('img').exists()).toBe(true);
    expect(wrapper.classes()).toContain(uploadPictureCardClasses.size('main'));
  });

  it('should render the name instead for a non-image file', () => {
    const wrapper = mount(MznUploadPictureCard, {
      props: { file: pdfFile('report.pdf'), status: 'done' },
    });

    expect(wrapper.find('img').exists()).toBe(false);
    expect(wrapper.get(`.${uploadPictureCardClasses.name}`).text()).toBe(
      'report.pdf',
    );
  });

  it('should refuse the minor size for a non-image file', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mount(MznUploadPictureCard, {
      props: { file: pdfFile(), size: 'minor', status: 'done' },
    });

    expect(wrapper.find(`.${uploadPictureCardClasses.host}`).exists()).toBe(
      false,
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('minor size is not supported'),
    );

    warn.mockRestore();
  });

  it('should show only the actions its listeners justify', () => {
    const bare = mount(MznUploadPictureCard, {
      props: { file: imageFile(), status: 'done' },
    });

    // Only delete is unconditional.
    expect(bare.findAll('button')).toHaveLength(1);

    const full = mount(MznUploadPictureCard, {
      props: {
        file: imageFile(),
        onDownload: () => {},
        onZoomIn: () => {},
        status: 'done',
      },
    });

    expect(full.findAll('button')).toHaveLength(3);
  });

  it('should become a replacement trigger once someone listens', async () => {
    const wrapper = mount(MznUploadPictureCard, {
      props: { file: imageFile(), onReplace: () => {}, status: 'done' },
    });

    expect(wrapper.classes()).toContain(uploadPictureCardClasses.replaceMode);
    expect(
      wrapper.get(`.${uploadPictureCardClasses.replaceLabel}`).text(),
    ).toBe('Click to Replace');

    await wrapper.trigger('click');

    expect(wrapper.emitted('replace')).toHaveLength(1);
  });

  it('should stay a plain card while readable', () => {
    const wrapper = mount(MznUploadPictureCard, {
      props: {
        file: imageFile(),
        onReplace: () => {},
        readable: true,
        status: 'done',
      },
    });

    expect(wrapper.classes()).toContain(uploadPictureCardClasses.readable);
    expect(wrapper.classes()).not.toContain(
      uploadPictureCardClasses.replaceMode,
    );
    expect(wrapper.attributes('tabindex')).toBe('-1');
  });

  it('should take custom aria labels', () => {
    const wrapper = mount(MznUploadPictureCard, {
      props: {
        ariaLabels: { delete: '刪除檔案' },
        file: imageFile(),
        status: 'done',
      },
    });

    expect(wrapper.get('button').attributes('aria-label')).toBe('刪除檔案');
  });

  it('should keep its own close label on the cancel action', () => {
    const wrapper = mount(MznUploadPictureCard, {
      props: { file: imageFile(), status: 'loading' },
    });

    // React writes the clear action's own label after the spread, so the
    // caller's `cancelUpload` label never reaches the DOM.
    expect(
      wrapper
        .get(`.${uploadPictureCardClasses.clearActionsIcon}`)
        .attributes('aria-label'),
    ).toBe('Close');
  });

  it('should fall back to the file name as the error message', () => {
    const wrapper = mount(MznUploadPictureCard, {
      props: { file: pdfFile('broken.pdf'), status: 'error' },
    });

    expect(
      wrapper.get(`.${uploadPictureCardClasses.errorMessageText}`).text(),
    ).toBe('broken.pdf');
  });
});

describe('<MznUploader />', () => {
  it('should render a file input carrying its own attributes', () => {
    const wrapper = mount(MznUploader, {
      props: { accept: 'image/*', id: 'field', multiple: true, name: 'photo' },
    });

    const input = wrapper.get('input');

    expect(input.attributes('type')).toBe('file');
    expect(input.attributes('accept')).toBe('image/*');
    expect(input.attributes('id')).toBe('field');
    expect(input.attributes('name')).toBe('photo');
    expect(input.attributes('multiple')).toBeDefined();
  });

  it('should fall back to the input id for the name', () => {
    const wrapper = mount(MznUploader, { props: { id: 'field' } });

    expect(wrapper.get('input').attributes('name')).toBe('field');
  });

  it('should report the files that were selected', async () => {
    const wrapper = mount(MznUploader);
    const input = wrapper.get('input');

    Object.defineProperty(input.element, 'files', {
      value: [imageFile('a.jpg'), imageFile('b.jpg')],
    });

    await input.trigger('change');

    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('upload')?.[0][0]).toHaveLength(2);
  });

  it('should fill the width in dropzone mode', () => {
    const wrapper = mount(MznUploader, {
      props: { mode: 'dropzone', type: 'base' },
    });

    expect(wrapper.get('label').classes()).toContain(uploaderClasses.fillWidth);
    expect(wrapper.get(`.${uploaderClasses.clickToUpload}`).text()).toBe(
      'Click to upload',
    );
  });

  it('should mark itself while a file is dragged over', async () => {
    const wrapper = mount(MznUploader, { props: { type: 'base' } });

    const label = wrapper.get('label');

    await label.trigger('dragenter');

    expect(label.classes()).toContain(uploaderClasses.dragging);

    await label.trigger('drop', { dataTransfer: { files: [] } });

    expect(label.classes()).not.toContain(uploaderClasses.dragging);
  });

  it('should keep the dragging state while the pointer stays inside', async () => {
    const wrapper = mount(MznUploader, { props: { type: 'base' } });
    const label = wrapper.get('label');

    await label.trigger('dragenter');

    // jsdom reports a zero-sized box, so the origin counts as inside it.
    await label.trigger('dragleave', { clientX: 0, clientY: 0 });

    expect(label.classes()).toContain(uploaderClasses.dragging);

    await label.trigger('dragleave', { clientX: 5, clientY: 5 });

    expect(label.classes()).not.toContain(uploaderClasses.dragging);
  });

  it('should ignore drags while disabled', async () => {
    const wrapper = mount(MznUploader, {
      props: { disabled: true, type: 'base' },
    });

    const label = wrapper.get('label');

    await label.trigger('dragenter');

    expect(label.classes()).not.toContain(uploaderClasses.dragging);
    expect(label.classes()).toContain(uploaderClasses.disabled);
  });

  it('should render a button in button mode', () => {
    const wrapper = mount(MznUploader, { props: { type: 'button' } });

    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.get('label').classes()).toContain(
      uploaderClasses.type('button'),
    );
  });

  it('should list the external hints below itself', () => {
    const wrapper = mount(MznUploader, {
      props: {
        externalHints: [
          { label: 'info hint', type: 'info' },
          { label: 'error hint', type: 'error' },
        ],
      },
    });

    expect(
      document.querySelectorAll(`.${uploaderClasses.externalHints} li`).length +
        wrapper.findAll(`.${uploaderClasses.externalHints} li`).length,
    ).toBeGreaterThan(0);
  });
});

describe('<MznUpload />', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  const render = (props: UploadProps = {}) =>
    mount(MznUpload, { attachTo: document.body, props });

  it('should render a dropzone uploader in list mode', () => {
    const wrapper = render();

    expect(wrapper.classes()).toContain(uploadClasses.host);
    expect(wrapper.get(`.${uploaderClasses.host}`).classes()).toContain(
      uploaderClasses.fillWidth,
    );
  });

  it('should render a button uploader in button-list mode', () => {
    const wrapper = render({ mode: 'button-list' });

    expect(wrapper.get(`.${uploaderClasses.host}`).classes()).toContain(
      uploaderClasses.type('button'),
    );
  });

  it('should lay the list out as cards in cards mode', () => {
    const wrapper = render({ mode: 'cards' });

    expect(wrapper.classes()).toContain(uploadClasses.hostCards);
    expect(wrapper.get(`.${uploadClasses.uploadList}`).classes()).toContain(
      uploadClasses.uploadListCards,
    );
  });

  it('should put a dropzone above the cards in card-wall mode', () => {
    const wrapper = render({ mode: 'card-wall' });

    // The top uploader replaces the inline one, so there is exactly one.
    expect(wrapper.findAll(`.${uploaderClasses.host}`)).toHaveLength(1);
    expect(wrapper.get(`.${uploaderClasses.host}`).classes()).toContain(
      uploaderClasses.fillWidth,
    );
  });

  it('should render an item per file, non-images first', () => {
    const files: UploadFile[] = [
      { file: imageFile('a.jpg'), id: '1', status: 'done' },
      { file: pdfFile('b.pdf'), id: '2', status: 'done' },
    ];

    const wrapper = render({ files });

    const names = wrapper
      .findAll(`.${uploadItemClasses.name}`)
      .map((name) => name.text());

    expect(names).toEqual(['b.pdf', 'a.jpg']);
  });

  it('should render picture cards in cards mode', () => {
    const wrapper = render({
      files: [{ file: imageFile(), id: '1', status: 'done' }],
      mode: 'cards',
    });

    expect(wrapper.findAll(`.${uploadPictureCardClasses.host}`)).toHaveLength(
      1,
    );
  });

  it('should skip a file that has neither a file nor a url', () => {
    const wrapper = render({
      files: [{ id: '1', status: 'done' }],
    });

    expect(wrapper.findAll(`.${uploadItemClasses.host}`)).toHaveLength(0);
  });

  it('should disable the uploader once the maximum is reached', () => {
    const wrapper = render({
      files: [{ file: pdfFile(), id: '1', status: 'done' }],
      maxFiles: 1,
    });

    expect(wrapper.get('input').attributes('disabled')).toBeDefined();
  });

  it('should report a deletion and drop the file from the list', async () => {
    const wrapper = render({
      files: [{ file: pdfFile(), id: '1', status: 'done' }],
    });

    await wrapper.get(`.${uploadItemClasses.deleteIcon}`).trigger('click');

    expect(wrapper.emitted('change')?.[0][0]).toEqual([]);
    expect(wrapper.emitted('delete')?.[0][0]).toBe('1');
  });

  it('should send a retried file back to loading', async () => {
    const wrapper = render({
      files: [{ file: pdfFile(), id: '1', status: 'error' }],
    });

    await wrapper.get(`.${uploadItemClasses.resetIcon}`).trigger('click');

    const next = wrapper.emitted('change')?.[0][0] as UploadFile[];

    expect(next[0].status).toBe('loading');
    expect(wrapper.emitted('reload')?.[0][0]).toBe('1');
  });

  it('should report a download', async () => {
    const wrapper = render({
      files: [{ file: pdfFile(), id: '1', status: 'done' }],
    });

    await wrapper.get(`.${uploadItemClasses.downloadIcon}`).trigger('click');

    expect(wrapper.emitted('download')?.[0][0]).toBe('1');
  });

  it('should add the selected files as loading and then mark them done', async () => {
    const wrapper = render();
    const input = wrapper.get('input');

    Object.defineProperty(input.element, 'files', {
      value: [pdfFile('a.pdf')],
    });

    await input.trigger('change');
    await nextTick();

    const emissions = wrapper.emitted('change') as unknown[][];
    const first = emissions[0][0] as UploadFile[];
    const last = emissions[emissions.length - 1][0] as UploadFile[];

    expect(first[0].status).toBe('loading');
    expect(last[0].status).toBe('done');
    expect(last[0].progress).toBe(100);
  });

  it('should take the ids the upload handler gives back', async () => {
    const wrapper = render({
      onUpload: () => [{ id: 'backend-1' }],
    });
    const input = wrapper.get('input');

    Object.defineProperty(input.element, 'files', {
      value: [pdfFile('a.pdf')],
    });

    await input.trigger('change');
    await nextTick();

    const emissions = wrapper.emitted('change') as unknown[][];
    const last = emissions[emissions.length - 1][0] as UploadFile[];

    expect(last[0].id).toBe('backend-1');
    expect(last[0].status).toBe('done');
  });

  it('should mark the batch as failed when the upload handler throws', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    const wrapper = render({
      errorMessage: '上傳失敗',
      onUpload: (): Promise<void> => Promise.reject(new Error('nope')),
    });
    const input = wrapper.get('input');

    Object.defineProperty(input.element, 'files', {
      value: [pdfFile('a.pdf')],
    });

    await input.trigger('change');
    await nextTick();
    await nextTick();

    const emissions = wrapper.emitted('change') as unknown[][];
    const last = emissions[emissions.length - 1][0] as UploadFile[];

    expect(last[0].status).toBe('error');
    expect(last[0].errorMessage).toBe('上傳失敗');

    error.mockRestore();
  });

  it('should report and trim a selection that exceeds the maximum', async () => {
    const wrapper = render({ maxFiles: 1 });
    const input = wrapper.get('input');

    Object.defineProperty(input.element, 'files', {
      value: [pdfFile('a.pdf'), pdfFile('b.pdf')],
    });

    await input.trigger('change');
    await nextTick();

    expect(wrapper.emitted('maxFilesExceeded')?.[0]).toEqual([1, 2, 0]);

    const first = (
      wrapper.emitted('change') as unknown[][]
    )[0][0] as UploadFile[];

    expect(first).toHaveLength(1);
  });

  it('should list the hints it was given', () => {
    const wrapper = render({
      hints: [{ label: '最多 5 個檔案。', type: 'info' }],
    });

    expect(wrapper.get(`.${uploadClasses.fillWidthHints} li`).text()).toContain(
      '最多 5 個檔案。',
    );
  });
});
