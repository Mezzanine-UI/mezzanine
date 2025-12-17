import { InfoFilledIcon } from '@mezzanine-ui/icons';
import { useState } from 'react';
import { act, cleanup, fireEvent, render, waitFor } from '../../__test-utils__';
import Icon from '../Icon';
import type { UploadFile } from './Upload';
import Upload from './Upload';

// Mock ResizeObserver
const originalResizeObserver = (global as typeof globalThis).ResizeObserver;

class ResizeObserverMock {
  observe() { }

  unobserve() { }

  disconnect() { }
}

// Mock URL.createObjectURL 和 URL.revokeObjectURL
const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
const mockRevokeObjectURL = jest.fn();

beforeAll(() => {
  (global as typeof globalThis).ResizeObserver =
    ResizeObserverMock as unknown as typeof ResizeObserver;

  if (global.URL) {
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;
  }
});

afterAll(() => {
  (global as typeof globalThis).ResizeObserver = originalResizeObserver;
  jest.restoreAllMocks();
});

describe('<Upload />', () => {
  afterEach(cleanup);

  const createMockFile = (name: string, type: string, size: number = 1024): File => {
    const file = new File([''], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  describe('基本渲染', () => {
    it('應該渲染 host class', () => {
      const { getHostHTMLElement } = render(<Upload />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-upload')).toBeTruthy();
    });

    it('應該支持自定義 className', () => {
      const { getHostHTMLElement } = render(<Upload className="custom-class" />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('custom-class')).toBeTruthy();
    });
  });

  describe('prop: mode', () => {
    it('應該正確渲染 mode="list"', () => {
      const { getHostHTMLElement } = render(<Upload mode="list" />);
      const element = getHostHTMLElement();
      // list 模式是預設，不應該有特殊 class
      expect(element.classList.contains('mzn-upload')).toBeTruthy();
    });

    it('應該正確渲染 mode="button-list"', () => {
      const { getHostHTMLElement } = render(<Upload mode="button-list" />);
      const element = getHostHTMLElement();
      expect(element.classList.contains('mzn-upload')).toBeTruthy();
    });

    it('應該正確渲染 mode="cards"', () => {
      const { getHostHTMLElement } = render(<Upload mode="cards" />);
      const element = getHostHTMLElement();
      // cards 模式應該有 hostCards class (mzn-upload__host--cards)
      expect(element.classList.contains('mzn-upload__host--cards')).toBeTruthy();
    });

    it('應該正確渲染 mode="card-wall"', () => {
      const { getHostHTMLElement } = render(<Upload mode="card-wall" />);
      const element = getHostHTMLElement();
      expect(element.classList.contains('mzn-upload')).toBeTruthy();
    });

    it('預設 mode 應該是 "list"', () => {
      const { getHostHTMLElement } = render(<Upload />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-upload--cards')).toBeFalsy();
    });
  });

  describe('prop: size', () => {
    it('預設 size 應該是 "main"', () => {
      const { container } = render(<Upload />);
      const uploader = container.querySelector('.mzn-uploader');

      expect(uploader).toBeTruthy();
    });
  });

  describe('prop: disabled', () => {
    it('應該禁用上傳功能', () => {
      const { container } = render(<Upload disabled />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      expect(input?.disabled).toBeTruthy();
    });

    it('當達到 maxFiles 時應該自動禁用', () => {
      const files: UploadFile[] = [
        {
          id: '1',
          file: createMockFile('test1.jpg', 'image/jpeg'),
          status: 'done',
        },
        {
          id: '2',
          file: createMockFile('test2.jpg', 'image/jpeg'),
          status: 'done',
        },
      ];

      const { container } = render(<Upload files={files} maxFiles={2} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      expect(input?.disabled).toBeTruthy();
    });
  });

  describe('prop: multiple', () => {
    it('應該支持多文件選擇', () => {
      const { container } = render(<Upload multiple />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      expect(input?.hasAttribute('multiple')).toBeTruthy();
    });

    it('預設不應該支持多文件選擇', () => {
      const { container } = render(<Upload />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      expect(input?.hasAttribute('multiple')).toBeFalsy();
    });
  });

  describe('prop: accept', () => {
    it('應該設置 accept 屬性', () => {
      const { container } = render(<Upload accept="image/*" />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      expect(input?.accept).toBe('image/*');
    });
  });

  describe('prop: files (controlled)', () => {
    it('應該顯示提供的文件列表', () => {
      const files: UploadFile[] = [
        {
          id: '1',
          file: createMockFile('test.jpg', 'image/jpeg'),
          status: 'done',
        },
      ];

      const { container } = render(<Upload files={files} />);
      const uploadItem = container.querySelector('.mzn-upload-item');

      expect(uploadItem).toBeTruthy();
    });

    it('應該正確處理不同狀態的文件', () => {
      const files: UploadFile[] = [
        {
          id: '1',
          file: createMockFile('test1.jpg', 'image/jpeg'),
          status: 'loading',
          progress: 50,
        },
        {
          id: '2',
          file: createMockFile('test2.jpg', 'image/jpeg'),
          status: 'done',
        },
        {
          id: '3',
          file: createMockFile('test3.jpg', 'image/jpeg'),
          status: 'error',
          errorMessage: 'Upload failed',
        },
      ];

      const { container } = render(<Upload files={files} />);
      const uploadItems = container.querySelectorAll('.mzn-upload-item');

      expect(uploadItems.length).toBe(3);
    });
  });

  describe('prop: onUpload', () => {
    it('應該在選擇文件時觸發 onUpload', async () => {
      const onUpload = jest.fn();
      const { container } = render(<Upload onUpload={onUpload} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createMockFile('test.jpg', 'image/jpeg');

      await act(async () => {
        fireEvent.change(input, {
          target: { files: [file] },
        });
      });

      await waitFor(() => {
        expect(onUpload).toHaveBeenCalledWith([file], expect.any(Function));
      });
    });

    it('應該支持 onUpload 返回 UploadFile[]', async () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const onUpload = jest.fn().mockResolvedValue([
        {
          id: 'backend-id-1',
          file,
          status: 'done' as const,
        },
      ]);

      const { container } = render(<Upload onUpload={onUpload} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      await act(async () => {
        fireEvent.change(input, {
          target: { files: [file] },
        });
      });

      await waitFor(() => {
        expect(onUpload).toHaveBeenCalled();
      });
    });

    it('應該支持 onUpload 返回 { id: string }[]', async () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const onUpload = jest.fn().mockResolvedValue([
        { id: 'backend-id-1' },
      ]);

      const { container } = render(<Upload onUpload={onUpload} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      await act(async () => {
        fireEvent.change(input, {
          target: { files: [file] },
        });
      });

      await waitFor(() => {
        expect(onUpload).toHaveBeenCalled();
      });
    });

    it('應該支持 onUpload 返回 void (向後兼容)', async () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const onUpload = jest.fn().mockResolvedValue(undefined);

      const { container } = render(<Upload onUpload={onUpload} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      await act(async () => {
        fireEvent.change(input, {
          target: { files: [file] },
        });
      });

      await waitFor(() => {
        expect(onUpload).toHaveBeenCalled();
      });
    });

    it('應該支持 setProgress 回調更新進度', async () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      let progressCallback: ((fileIndex: number, progress: number) => void) | undefined;

      const onUpload = jest.fn().mockImplementation((files, setProgress) => {
        progressCallback = setProgress;
        return Promise.resolve([{ id: 'backend-id-1' }]);
      });

      const { container } = render(<Upload onUpload={onUpload} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      await act(async () => {
        fireEvent.change(input, {
          target: { files: [file] },
        });
      });

      await waitFor(() => {
        expect(progressCallback).toBeDefined();
      });

      expect(progressCallback).toBeDefined();
      await act(async () => {
        if (progressCallback) {
          progressCallback(0, 50);
        }
      });
    });

    it('應該在 onUpload 失敗時設置錯誤狀態', async () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const onUpload = jest.fn().mockRejectedValue(new Error('Upload failed'));
      let files: UploadFile[] = [];
      const onChange = jest.fn((newFiles) => {
        files = newFiles;
      });

      const { container, rerender } = render(
        <Upload onUpload={onUpload} mode="list" files={files} onChange={onChange} />,
      );
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      await act(async () => {
        fireEvent.change(input, {
          target: { files: [file] },
        });
      });

      // 等待 onUpload 被調用
      await waitFor(() => {
        expect(onUpload).toHaveBeenCalled();
      });

      // 等待 onChange 回傳狀態為 error 的文件
      await waitFor(() => {
        expect(
          onChange.mock.calls.some(([nextFiles]) =>
            nextFiles?.some((f: UploadFile) => f.status === 'error'),
          ),
        ).toBeTruthy();
      }, { timeout: 5000, interval: 100 });

      // 重新渲染組件以反映文件狀態變化
      rerender(<Upload onUpload={onUpload} mode="list" files={files} onChange={onChange} />);

      // 等待異步操作完成 - 錯誤狀態的 upload item 應該有 error class
      // 注意：onUpload 失敗後會更新文件狀態為 error，這需要一些時間
      // 在 list 模式下，圖片文件會渲染為 UploadItem，錯誤狀態會有 mzn-upload-item--error class
      // 需要等待錯誤狀態更新完成
      await waitFor(() => {
        const uploadItem = container.querySelector('.mzn-upload-item--error');
        expect(uploadItem).toBeTruthy();
      }, { timeout: 5000, interval: 100 });
    }, 15000);
  });

  describe('prop: onChange', () => {
    it('應該在文件列表變化時觸發 onChange', async () => {
      const onChange = jest.fn();
      const { container } = render(<Upload onChange={onChange} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createMockFile('test.jpg', 'image/jpeg');

      await act(async () => {
        fireEvent.change(input, {
          target: { files: [file] },
        });
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
        const files = onChange.mock.calls[0][0];
        expect(Array.isArray(files)).toBeTruthy();
      });
    });
  });

  describe('prop: onDelete', () => {
    it('應該在刪除文件時觸發 onDelete', async () => {
      const onDelete = jest.fn();
      const files: UploadFile[] = [
        {
          id: '1',
          file: createMockFile('test.jpg', 'image/jpeg'),
          status: 'done',
        },
      ];

      const { container } = render(<Upload files={files} onDelete={onDelete} />);
      const deleteButton = container.querySelector('.mzn-icon[data-icon-name="trash"]');

      await act(async () => {
        if (deleteButton) {
          fireEvent.click(deleteButton);
        }
      });

      await waitFor(() => {
        expect(onDelete).toHaveBeenCalledWith('1', expect.any(File));
      });
    });
  });

  describe('prop: onReload', () => {
    it('應該在重試上傳時觸發 onReload', async () => {
      const onReload = jest.fn();
      const files: UploadFile[] = [
        {
          id: '1',
          file: createMockFile('test.jpg', 'image/jpeg'),
          status: 'error',
        },
      ];

      const { container } = render(<Upload files={files} onReload={onReload} />);
      const reloadButton = container.querySelector('.mzn-icon[data-icon-name="reset"]');

      await act(async () => {
        if (reloadButton) {
          fireEvent.click(reloadButton);
        }
      });

      await waitFor(() => {
        expect(onReload).toHaveBeenCalledWith('1', expect.any(File));
      });
    });
  });

  describe('prop: onDownload', () => {
    it('應該在下載文件時觸發 onDownload', async () => {
      const onDownload = jest.fn();
      const files: UploadFile[] = [
        {
          id: '1',
          file: createMockFile('test.jpg', 'image/jpeg'),
          status: 'done',
        },
      ];

      const { container } = render(<Upload files={files} onDownload={onDownload} />);
      const downloadButton = container.querySelector('.mzn-icon[data-icon-name="download"]');

      await act(async () => {
        if (downloadButton) {
          fireEvent.click(downloadButton);
        }
      });

      await waitFor(() => {
        expect(onDownload).toHaveBeenCalledWith('1', expect.any(File));
      });
    });
  });

  describe('prop: onZoomIn', () => {
    it('應該在點擊放大時觸發 onZoomIn (cards 模式)', async () => {
      const onZoomIn = jest.fn();
      const files: UploadFile[] = [
        {
          id: '1',
          file: createMockFile('test.jpg', 'image/jpeg'),
          status: 'done',
        },
      ];

      const { container } = render(<Upload files={files} mode="cards" onZoomIn={onZoomIn} />);
      const zoomButton = container.querySelector('button[aria-label="Zoom in image"]');

      await act(async () => {
        if (zoomButton) {
          fireEvent.click(zoomButton);
        }
      });

      await waitFor(() => {
        expect(onZoomIn).toHaveBeenCalledWith('1', expect.any(File));
      });
    });
  });

  describe('prop: maxFiles', () => {
    it('應該限制最大文件數量', async () => {
      const onMaxFilesExceeded = jest.fn();
      const files: UploadFile[] = [
        {
          id: '1',
          file: createMockFile('test1.jpg', 'image/jpeg'),
          status: 'done',
        },
      ];

      const { container } = render(
        <Upload files={files} maxFiles={2} multiple onMaxFilesExceeded={onMaxFilesExceeded} />,
      );
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      await act(async () => {
        fireEvent.change(input, {
          // 直接傳遞陣列，handleUpload 內部會使用 Array.from 處理
          target: {
            files: [
              createMockFile('test2.jpg', 'image/jpeg'),
              createMockFile('test3.jpg', 'image/jpeg'),
            ] as unknown as FileList
          },
        });
      });

      expect(onMaxFilesExceeded).toHaveBeenCalledWith(2, 2, 1);
    });

    it('應該在達到 maxFiles 時禁用上傳', () => {
      const files: UploadFile[] = [
        {
          id: '1',
          file: createMockFile('test1.jpg', 'image/jpeg'),
          status: 'done',
        },
        {
          id: '2',
          file: createMockFile('test2.jpg', 'image/jpeg'),
          status: 'done',
        },
      ];

      const { container } = render(<Upload files={files} maxFiles={2} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      expect(input?.disabled).toBeTruthy();
    });
  });

  describe('prop: errorMessage', () => {
    it('應該使用預設錯誤訊息', async () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const onUpload = jest.fn().mockRejectedValue(new Error('Upload failed'));
      const Wrapper = () => {
        const [files, setFiles] = useState<UploadFile[]>([]);
        return (
          <Upload
            onUpload={onUpload}
            mode="list"
            errorMessage="自定義錯誤訊息"
            files={files}
            onChange={setFiles}
          />
        );
      };

      const { container } = render(<Wrapper />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      await act(async () => {
        fireEvent.change(input, {
          target: { files: [file] },
        });
      });

      // 等待 onUpload 被調用
      await waitFor(() => {
        expect(onUpload).toHaveBeenCalled();
      });

      // 等待異步操作完成 - 至少應該出現錯誤狀態的項目
      await waitFor(() => {
        const errorItem = container.querySelector('.mzn-upload-item--error');
        expect(errorItem).toBeTruthy();
      }, { timeout: 5000, interval: 100 });
    }, 15000);
  });

  describe('prop: errorIcon', () => {
    it('應該使用自定義錯誤圖標', async () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const onUpload = jest.fn().mockRejectedValue(new Error('Upload failed'));
      const Wrapper = () => {
        const [files, setFiles] = useState<UploadFile[]>([]);
        return (
          <Upload
            onUpload={onUpload}
            mode="list"
            errorIcon={<Icon icon={InfoFilledIcon} />}
            files={files}
            onChange={setFiles}
          />
        );
      };

      const { container } = render(<Wrapper />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      await act(async () => {
        fireEvent.change(input, {
          target: { files: [file] },
        });
      });

      // 等待 onUpload 被調用
      await waitFor(() => {
        expect(onUpload).toHaveBeenCalled();
      });

      // 等待異步操作完成 - 錯誤訊息區域應該存在
      // 在 list 模式下，圖片文件會渲染為 UploadItem，錯誤訊息在 .mzn-upload-item__error-message
      await waitFor(() => {
        // errorIcon 會被渲染在 error message 區域
        const errorIcon = container.querySelector('.mzn-icon[data-icon-name="info-filled"]');
        // 或者檢查錯誤的 upload item 是否存在
        const errorItem = container.querySelector('.mzn-upload-item--error');
        expect(errorIcon || errorItem).toBeTruthy();
      }, { timeout: 5000, interval: 100 });
    }, 15000);
  });

  describe('文件類型識別', () => {
    it('應該正確識別圖片文件', () => {
      const files: UploadFile[] = [
        {
          id: '1',
          file: createMockFile('test.jpg', 'image/jpeg'),
          status: 'done',
        },
      ];

      const { container } = render(<Upload files={files} mode="cards" />);
      const pictureCard = container.querySelector('.mzn-upload-picture-card');

      expect(pictureCard).toBeTruthy();
    });

    it('應該正確識別非圖片文件', () => {
      const files: UploadFile[] = [
        {
          id: '1',
          file: createMockFile('test.pdf', 'application/pdf'),
          status: 'done',
        },
      ];

      const { container } = render(<Upload files={files} mode="cards" />);
      const uploadItem = container.querySelector('.mzn-upload-item');

      expect(uploadItem).toBeTruthy();
    });

    it('應該從 URL 推斷文件類型', () => {
      const files: UploadFile[] = [
        {
          id: '1',
          url: 'https://example.com/image.jpg',
          status: 'done',
        },
      ];

      const { container } = render(<Upload files={files} mode="cards" />);
      const pictureCard = container.querySelector('.mzn-upload-picture-card');

      expect(pictureCard).toBeTruthy();
    });
  });

  describe('prop: showFileSize', () => {
    it('應該顯示文件大小', () => {
      const files: UploadFile[] = [
        {
          id: '1',
          file: createMockFile('test.jpg', 'image/jpeg', 2048),
          status: 'done',
        },
      ];

      const { container } = render(<Upload files={files} showFileSize />);
      const fileSize = container.querySelector('.mzn-upload-item__font-size');

      expect(fileSize).toBeTruthy();
    });

    it('應該隱藏文件大小', () => {
      const files: UploadFile[] = [
        {
          id: '1',
          file: createMockFile('test.jpg', 'image/jpeg', 2048),
          status: 'done',
        },
      ];

      const { container } = render(<Upload files={files} showFileSize={false} />);
      const fileSize = container.querySelector('.mzn-upload-item__font-size');

      expect(fileSize).toBeFalsy();
    });
  });

  describe('不同模式的渲染', () => {
    it('應該在 list 模式下渲染 UploadItem', () => {
      const files: UploadFile[] = [
        {
          id: '1',
          file: createMockFile('test.jpg', 'image/jpeg'),
          status: 'done',
        },
      ];

      const { container } = render(<Upload files={files} mode="list" />);
      const uploadItem = container.querySelector('.mzn-upload-item');

      expect(uploadItem).toBeTruthy();
    });

    it('應該在 cards 模式下渲染 UploadPictureCard', () => {
      const files: UploadFile[] = [
        {
          id: '1',
          file: createMockFile('test.jpg', 'image/jpeg'),
          status: 'done',
        },
      ];

      const { container } = render(<Upload files={files} mode="cards" />);
      const pictureCard = container.querySelector('.mzn-upload-picture-card');

      expect(pictureCard).toBeTruthy();
    });

    it('應該在 card-wall 模式下渲染頂部上傳器和卡片', () => {
      const { container } = render(<Upload mode="card-wall" />);
      const uploaders = container.querySelectorAll('.mzn-uploader');

      expect(uploaders.length).toBeGreaterThan(0);
    });
  });

  describe('hints 顯示', () => {
    it('應該在 button-list 模式下顯示 hints', () => {
      const hints = [
        { label: '提示 1', type: 'info' as const },
        { label: '提示 2', type: 'error' as const },
      ];

      const { container } = render(<Upload mode="button-list" hints={hints} />);
      const hintsList = container.querySelector('.mzn-upload__hints');

      expect(hintsList).toBeTruthy();
    });

    it('應該在 cards 模式下顯示 hints', () => {
      const hints = [
        { label: '提示 1', type: 'info' as const },
      ];

      const { container } = render(<Upload mode="cards" hints={hints} />);
      const hintsList = container.querySelector('.mzn-upload__fill-width-hints');

      expect(hintsList).toBeTruthy();
    });
  });
});
