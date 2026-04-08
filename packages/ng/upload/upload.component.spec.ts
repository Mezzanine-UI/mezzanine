import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { UploadItemStatus } from '@mezzanine-ui/core/upload';
import { MznUploader } from './uploader.component';
import { MznUploadItem } from './upload-item.component';
import { MznUpload } from './upload.component';
import { UploadFile } from './upload-file';

// ---------------------------------------------------------------------------
// MznUploader tests
// ---------------------------------------------------------------------------

@Component({
  standalone: true,
  imports: [MznUploader],
  template: `
    <mzn-uploader
      [accept]="accept"
      [disabled]="disabled"
      [multiple]="multiple"
      [type]="type"
      (filesSelected)="onFilesSelected($event)"
    >
      <span class="trigger">上傳檔案</span>
    </mzn-uploader>
  `,
})
class UploaderHostComponent {
  accept?: string;
  disabled = false;
  multiple = false;
  type: 'base' | 'button' = 'base';
  onFilesSelected = jest.fn();
}

function createUploaderFixture(
  overrides: Partial<UploaderHostComponent> = {},
): {
  fixture: ComponentFixture<UploaderHostComponent>;
  host: UploaderHostComponent;
  getUploaderElement: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(UploaderHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getUploaderElement: (): HTMLElement =>
      fixture.nativeElement.querySelector('mzn-uploader')!,
  };
}

describe('MznUploader', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploaderHostComponent],
    }).compileComponents();
  });

  it('should create with host class', () => {
    const { getUploaderElement } = createUploaderFixture();

    expect(getUploaderElement().classList.contains('mzn-uploader')).toBe(true);
  });

  it('should render file input', () => {
    const { getUploaderElement } = createUploaderFixture();
    const input = getUploaderElement().querySelector('input[type="file"]');

    expect(input).toBeTruthy();
    expect(input?.classList.contains('mzn-uploader__input')).toBe(true);
  });

  it('should emit filesSelected on input change', () => {
    const onFilesSelected = jest.fn();
    const { getUploaderElement } = createUploaderFixture({ onFilesSelected });
    const input = getUploaderElement().querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const fileList = {
      0: file,
      length: 1,
      item: (_i: number) => file,
    } as unknown as FileList;

    Object.defineProperty(input, 'files', {
      value: fileList,
      configurable: true,
    });

    input.dispatchEvent(new Event('change'));

    expect(onFilesSelected).toHaveBeenCalledTimes(1);
  });

  it('should add disabled class when disabled', () => {
    const { getUploaderElement } = createUploaderFixture({ disabled: true });

    expect(
      getUploaderElement().classList.contains('mzn-uploader--disabled'),
    ).toBe(true);
  });

  it('should add type class', () => {
    const { getUploaderElement } = createUploaderFixture({ type: 'button' });

    expect(
      getUploaderElement().classList.contains('mzn-uploader--button'),
    ).toBe(true);
  });

  it('should project content', () => {
    const { getUploaderElement } = createUploaderFixture();
    const trigger = getUploaderElement().querySelector('.trigger');

    expect(trigger?.textContent).toBe('上傳檔案');
  });
});

// ---------------------------------------------------------------------------
// MznUploadItem tests
// ---------------------------------------------------------------------------

@Component({
  standalone: true,
  imports: [MznUploadItem],
  template: `
    <mzn-upload-item
      [disabled]="disabled"
      [errorMessage]="errorMessage"
      [fileName]="fileName"
      [status]="status"
      [thumbnailUrl]="thumbnailUrl"
      (remove)="onRemove()"
    />
  `,
})
class UploadItemHostComponent {
  disabled = false;
  errorMessage?: string;
  fileName = 'test-file.pdf';
  status: UploadItemStatus = 'done';
  thumbnailUrl?: string;
  onRemove = jest.fn();
}

function createUploadItemFixture(
  overrides: Partial<UploadItemHostComponent> = {},
): {
  fixture: ComponentFixture<UploadItemHostComponent>;
  host: UploadItemHostComponent;
  getItemElement: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(UploadItemHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getItemElement: (): HTMLElement =>
      fixture.nativeElement.querySelector('mzn-upload-item')!,
  };
}

describe('MznUploadItem', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadItemHostComponent],
    }).compileComponents();
  });

  it('should render filename', () => {
    const { getItemElement } = createUploadItemFixture({
      fileName: 'report.pdf',
    });
    const nameEl = getItemElement().querySelector('.mzn-upload-item__name');

    expect(nameEl?.textContent).toBe('report.pdf');
  });

  it('should show error state', () => {
    const { getItemElement } = createUploadItemFixture({
      status: 'error',
      errorMessage: '檔案太大',
    });

    expect(getItemElement().classList.contains('mzn-upload-item--error')).toBe(
      true,
    );

    const errorText = getItemElement().querySelector(
      '.mzn-upload-item__error-message-text',
    );

    expect(errorText?.textContent).toBe('檔案太大');
  });

  it('should emit remove', () => {
    const onRemove = jest.fn();
    const { getItemElement } = createUploadItemFixture({ onRemove });
    const deleteIcon = getItemElement().querySelector(
      '.mzn-upload-item__delete-icon',
    ) as HTMLElement;

    deleteIcon.click();

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('should show loading icon when status is loading', () => {
    const { getItemElement } = createUploadItemFixture({ status: 'loading' });
    const loadingIcon = getItemElement().querySelector(
      '.mzn-upload-item__loading-icon',
    );

    expect(loadingIcon).toBeTruthy();
  });

  it('should add disabled class when disabled', () => {
    const { getItemElement } = createUploadItemFixture({ disabled: true });

    expect(
      getItemElement().classList.contains('mzn-upload-item--disabled'),
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// MznUpload tests
// ---------------------------------------------------------------------------

@Component({
  standalone: true,
  imports: [MznUpload],
  template: `
    <mzn-upload
      [accept]="accept"
      [disabled]="disabled"
      [files]="files"
      [mode]="mode"
      [multiple]="multiple"
      (fileSelect)="onFileSelect($event)"
      (filesChange)="onFilesChange($event)"
    >
      <span class="upload-trigger">選擇檔案</span>
    </mzn-upload>
  `,
})
class UploadHostComponent {
  accept?: string;
  disabled = false;
  files: UploadFile[] = [];
  mode: 'list' | 'basic-list' | 'button-list' | 'cards' | 'card-wall' = 'list';
  multiple = true;
  onFileSelect = jest.fn();
  onFilesChange = jest.fn();
}

function createUploadFixture(overrides: Partial<UploadHostComponent> = {}): {
  fixture: ComponentFixture<UploadHostComponent>;
  host: UploadHostComponent;
  getUploadElement: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(UploadHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getUploadElement: (): HTMLElement =>
      fixture.nativeElement.querySelector('mzn-upload')!,
  };
}

describe('MznUpload', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadHostComponent],
    }).compileComponents();
  });

  it('should create with host class', () => {
    const { getUploadElement } = createUploadFixture();

    expect(getUploadElement().classList.contains('mzn-upload')).toBe(true);
  });

  it('should render upload items from files input', () => {
    const files: UploadFile[] = [
      { id: '1', name: 'file-a.pdf', status: 'done' },
      { id: '2', name: 'file-b.doc', status: 'done' },
      { id: '3', name: 'file-c.txt', status: 'error', errorMessage: '失敗' },
    ];
    const { getUploadElement } = createUploadFixture({ files });
    const items = getUploadElement().querySelectorAll('mzn-upload-item');

    expect(items.length).toBe(3);
  });

  it('should render uploader inside', () => {
    const { getUploadElement } = createUploadFixture();
    const uploader = getUploadElement().querySelector('mzn-uploader');

    expect(uploader).toBeTruthy();
  });

  it('should project custom trigger content', () => {
    const { getUploadElement } = createUploadFixture();
    const trigger = getUploadElement().querySelector('.upload-trigger');

    expect(trigger?.textContent).toBe('選擇檔案');
  });

  it('should add cards host class for cards mode', () => {
    const { getUploadElement } = createUploadFixture({ mode: 'cards' });

    expect(
      getUploadElement().classList.contains('mzn-upload__host--cards'),
    ).toBe(true);
  });
});
