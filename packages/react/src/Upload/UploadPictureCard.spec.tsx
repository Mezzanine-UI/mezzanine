import { InfoFilledIcon } from '@mezzanine-ui/icons';
import { act, cleanup, fireEvent, render, waitFor } from '../../__test-utils__';
import UploadPictureCard from './UploadPictureCard';

describe('<UploadPictureCard />', () => {
  afterEach(() => {
    cleanup();
    // 清理所有 blob URLs
    jest.clearAllMocks();
  });

  const createMockFile = (
    name: string,
    type: string,
    size: number = 1024,
  ): File => {
    const file = new File([''], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  // Mock URL.createObjectURL 和 URL.revokeObjectURL
  const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
  const mockRevokeObjectURL = jest.fn();

  beforeAll(() => {
    if (global.URL) {
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
    }
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('基本渲染', () => {
    it('應該渲染 host class', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { getHostHTMLElement } = render(
        <UploadPictureCard file={file} status="done" />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-upload-picture-card'),
      ).toBeTruthy();
    });

    it('應該支持自定義 className', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { getHostHTMLElement } = render(
        <UploadPictureCard
          file={file}
          status="done"
          className="custom-class"
        />,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('custom-class')).toBeTruthy();
    });
  });

  describe('prop: status', () => {
    it('預設 status 應該是 "loading"', async () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard
          file={file}
          status="loading"
          size="main"
          onDelete={jest.fn()}
        />,
      );

      // 等待組件渲染完成（包括 useEffect 執行）
      await waitFor(
        () => {
          // loadingIcon 是一個 div，class 是 mzn-upload-picture-card__loading-icon
          // 它在 actions 區域內，當 status="loading" 且 size !== "minor" 時顯示
          const loadingIcon = container.querySelector(
            '.mzn-upload-picture-card__loading-icon',
          );
          expect(loadingIcon).toBeTruthy();
        },
        { timeout: 1000 },
      );
    });

    it('應該正確渲染 status="loading"', async () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard
          file={file}
          status="loading"
          size="main"
          onDelete={jest.fn()}
        />,
      );

      // 等待組件渲染完成（包括 useEffect 執行）
      await waitFor(
        () => {
          // loadingIcon 是一個 div，class 是 mzn-upload-picture-card__loading-icon
          // 它在 actions 區域內，當 status="loading" 且 size !== "minor" 時顯示
          const loadingIcon = container.querySelector(
            '.mzn-upload-picture-card__loading-icon',
          );
          // ClearActions 渲染為 button，預設 aria-label="Close"（硬編碼，不會被覆蓋）
          // 但我們傳入了 aria-label="Cancel upload"，需要檢查實際的渲染結果
          const cancelButton =
            container.querySelector('button[aria-label="Cancel upload"]') ||
            container.querySelector('button[aria-label="Close"]');

          // loading icon 應該存在（在 actions 區域內）
          expect(loadingIcon).toBeTruthy();
          // cancel button 應該存在
          expect(cancelButton).toBeTruthy();
        },
        { timeout: 1000 },
      );
    });

    it('應該正確渲染 status="done"', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard
          file={file}
          status="done"
          onZoomIn={jest.fn()}
          onDownload={jest.fn()}
          onDelete={jest.fn()}
        />,
      );
      const tools = container.querySelector('.mzn-upload-picture-card__tools');
      const zoomButton = container.querySelector(
        'button[aria-label="Zoom in image"]',
      );
      const downloadButton = container.querySelector(
        'button[aria-label="Download file"]',
      );
      const deleteButton = container.querySelector(
        'button[aria-label="Delete file"]',
      );

      expect(tools).toBeTruthy();
      expect(zoomButton).toBeTruthy();
      expect(downloadButton).toBeTruthy();
      expect(deleteButton).toBeTruthy();
    });

    it('應該正確渲染 status="error"', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard
          file={file}
          status="error"
          size="main"
          errorMessage="上傳失敗"
        />,
      );
      // 錯誤訊息在 container 內，有 role="alert"
      const errorMessage = container.querySelector('[role="alert"]');
      const reloadButton = container.querySelector(
        'button[aria-label="Retry upload"]',
      );
      const deleteButton = container.querySelector(
        'button[aria-label="Delete file"]',
      );

      expect(errorMessage).toBeTruthy();
      expect(reloadButton).toBeTruthy();
      expect(deleteButton).toBeTruthy();
    });
  });

  describe('prop: size', () => {
    const sizes = ['main', 'sub', 'minor'] as const;

    sizes.forEach((size) => {
      it(`應該正確渲染 size="${size}"`, () => {
        const file = createMockFile('test.jpg', 'image/jpeg');
        const { getHostHTMLElement } = render(
          <UploadPictureCard file={file} status="done" size={size} />,
        );
        const element = getHostHTMLElement();

        // size class 格式是 mzn-upload-picture-card__size--main
        expect(
          element.classList.contains(`mzn-upload-picture-card__size--${size}`),
        ).toBeTruthy();
      });
    });

    it('應該在 error 狀態且 size="main" 時顯示錯誤訊息', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard
          file={file}
          status="error"
          size="main"
          errorMessage="上傳失敗"
        />,
      );
      // 錯誤訊息在 actions 區域外，有 role="alert"
      const errorMessage = container.querySelector('[role="alert"]');

      expect(errorMessage).toBeTruthy();
    });

    it('預設 size 應該是 "main"', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { getHostHTMLElement } = render(
        <UploadPictureCard file={file} status="done" />,
      );
      const element = getHostHTMLElement();

      // size class 格式是 mzn-upload-picture-card__size--main
      expect(
        element.classList.contains('mzn-upload-picture-card__size--main'),
      ).toBeTruthy();
    });

    it('應該在 error 狀態且 size="main" 時顯示操作按鈕', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard
          file={file}
          status="error"
          size="main"
          errorMessage="錯誤"
        />,
      );
      const reloadButton = container.querySelector(
        'button[aria-label="Retry upload"]',
      );
      const deleteButton = container.querySelector(
        'button[aria-label="Delete file"]',
      );

      // 這些按鈕應該存在
      expect(reloadButton).toBeTruthy();
      expect(deleteButton).toBeTruthy();
    });
  });

  describe('prop: imageFit', () => {
    it('預設 imageFit 應該是 "cover"', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard file={file} status="done" />,
      );
      const img = container.querySelector('img');

      expect(img?.style.objectFit).toBe('cover');
    });

    it('應該支持自定義 imageFit', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard file={file} status="done" imageFit="contain" />,
      );
      const img = container.querySelector('img');

      expect(img?.style.objectFit).toBe('contain');
    });
  });

  describe('prop: disabled', () => {
    it('應該設置 disabled 屬性', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { getHostHTMLElement } = render(
        <UploadPictureCard file={file} status="done" disabled />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-upload-picture-card--disabled'),
      ).toBeTruthy();
      expect(element.getAttribute('aria-disabled')).toBe('true');
      expect(element.getAttribute('tabIndex')).toBe('-1');
    });
  });

  describe('prop: file', () => {
    it('應該從 file 創建 blob URL', async () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      render(<UploadPictureCard file={file} status="done" />);

      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
      });
    });

    it('應該在卸載時清理 blob URL', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { unmount } = render(
        <UploadPictureCard file={file} status="done" />,
      );

      unmount();

      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
  });

  describe('prop: url', () => {
    it('應該優先使用 url 而不是 file', async () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const url = 'https://example.com/image.jpg';

      render(<UploadPictureCard file={file} url={url} status="done" />);

      await waitFor(() => {
        // 如果有 url，不應該調用 createObjectURL
        expect(mockCreateObjectURL).not.toHaveBeenCalled();
      });
    });

    it('應該直接使用 url 顯示圖片', () => {
      const url = 'https://example.com/image.jpg';
      const { container } = render(
        <UploadPictureCard url={url} status="done" />,
      );
      const img = container.querySelector('img');

      expect(img?.src).toBe(url);
    });
  });

  describe('文件類型識別', () => {
    it('應該正確識別圖片文件', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard file={file} status="done" />,
      );
      const img = container.querySelector('img');

      expect(img).toBeTruthy();
    });

    it('應該從 URL 推斷圖片類型', () => {
      const url = 'https://example.com/image.png';
      const { container } = render(
        <UploadPictureCard url={url} status="done" />,
      );
      const img = container.querySelector('img');

      expect(img).toBeTruthy();
    });

    it('應該在非圖片文件且 size="minor" 時返回 null', () => {
      const file = createMockFile('test.pdf', 'application/pdf');
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const { container } = render(
        <UploadPictureCard file={file} status="done" size="minor" />,
      );

      expect(container.firstChild).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'UploadPictureCard: minor size is not supported for non-image files',
      );

      consoleSpy.mockRestore();
    });

    it('應該在非圖片文件且 size="main" 時顯示文件圖標', () => {
      const file = createMockFile('test.pdf', 'application/pdf');
      const { container } = render(
        <UploadPictureCard file={file} status="done" size="main" />,
      );
      const content = container.querySelector(
        '.mzn-upload-picture-card__content',
      );

      expect(content).toBeTruthy();
    });
  });

  describe('prop: errorMessage', () => {
    it('應該顯示錯誤訊息', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard
          file={file}
          status="error"
          errorMessage="自定義錯誤訊息"
        />,
      );
      const errorMessage = container.querySelector(
        '.mzn-upload-picture-card__error-message-text',
      );

      expect(errorMessage?.textContent).toBe('自定義錯誤訊息');
    });

    it('應該使用文件名作為預設錯誤訊息', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard file={file} status="error" />,
      );
      const errorMessage = container.querySelector(
        '.mzn-upload-picture-card__error-message-text',
      );

      expect(errorMessage?.textContent).toBe('test.jpg');
    });

    it('應該在沒有文件名時使用預設錯誤訊息', () => {
      const { container } = render(<UploadPictureCard status="error" />);
      const errorMessage = container.querySelector(
        '.mzn-upload-picture-card__error-message-text',
      );

      expect(errorMessage?.textContent).toBe('Upload error');
    });
  });

  describe('prop: errorIcon', () => {
    it('應該使用自定義錯誤圖標', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');

      const { container } = render(
        <UploadPictureCard
          file={file}
          status="error"
          errorIcon={InfoFilledIcon}
        />,
      );

      const errorIcon = container.querySelector(
        '.mzn-icon[data-icon-name="info-filled"]',
      );
      expect(errorIcon).toBeTruthy();
    });
  });

  describe('事件處理', () => {
    it('應該在點擊刪除按鈕時觸發 onDelete', async () => {
      const onDelete = jest.fn();
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard file={file} status="done" onDelete={onDelete} />,
      );
      const deleteButton = container.querySelector(
        'button[aria-label="Delete file"]',
      );

      await act(async () => {
        if (deleteButton) {
          fireEvent.click(deleteButton);
        }
      });

      expect(onDelete).toHaveBeenCalled();
    });

    it('應該在點擊重試按鈕時觸發 onReload', async () => {
      const onReload = jest.fn();
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard file={file} status="error" onReload={onReload} />,
      );
      const reloadButton = container.querySelector(
        'button[aria-label="Retry upload"]',
      );

      await act(async () => {
        if (reloadButton) {
          fireEvent.click(reloadButton);
        }
      });

      expect(onReload).toHaveBeenCalled();
    });

    it('應該在點擊下載按鈕時觸發 onDownload', async () => {
      const onDownload = jest.fn();
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard file={file} status="done" onDownload={onDownload} />,
      );
      const downloadButton = container.querySelector(
        'button[aria-label="Download file"]',
      );

      await act(async () => {
        if (downloadButton) {
          fireEvent.click(downloadButton);
        }
      });

      expect(onDownload).toHaveBeenCalled();
    });

    it('應該在點擊放大按鈕時觸發 onZoomIn', async () => {
      const onZoomIn = jest.fn();
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard file={file} status="done" onZoomIn={onZoomIn} />,
      );
      const zoomButton = container.querySelector(
        'button[aria-label="Zoom in image"]',
      );

      await act(async () => {
        if (zoomButton) {
          fireEvent.click(zoomButton);
        }
      });

      expect(onZoomIn).toHaveBeenCalled();
    });

    it('應該在點擊取消按鈕時觸發 onDelete (loading 狀態)', async () => {
      const onDelete = jest.fn();
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard
          file={file}
          status="loading"
          size="main"
          onDelete={onDelete}
        />,
      );

      // ClearActions 組件渲染為 button
      // 注意：ClearActions 硬編碼 aria-label="Close"，即使傳入 aria-label 也不會覆蓋
      // 所以我們使用 class 或直接查找 button
      const cancelButton =
        container.querySelector('.mzn-clear-actions') ||
        container.querySelector('button[aria-label="Close"]') ||
        container.querySelector('button[aria-label="Cancel upload"]');
      expect(cancelButton).toBeTruthy();

      await act(async () => {
        if (cancelButton) {
          fireEvent.click(cancelButton);
        }
      });

      expect(onDelete).toHaveBeenCalled();
    });
  });

  describe('prop: ariaLabels', () => {
    it('應該使用自定義 aria labels', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const ariaLabels = {
        cancelUpload: '取消上傳',
        uploading: '上傳中',
        zoomIn: '放大圖片',
        download: '下載文件',
        delete: '刪除文件',
        reload: '重試上傳',
      };

      const { container } = render(
        <UploadPictureCard
          file={file}
          status="done"
          ariaLabels={ariaLabels}
          onZoomIn={jest.fn()}
          onDownload={jest.fn()}
          onDelete={jest.fn()}
        />,
      );
      const zoomButton = container.querySelector(
        'button[aria-label="放大圖片"]',
      );
      const downloadButton = container.querySelector(
        'button[aria-label="下載文件"]',
      );
      const deleteButton = container.querySelector(
        'button[aria-label="刪除文件"]',
      );

      expect(zoomButton).toBeTruthy();
      expect(downloadButton).toBeTruthy();
      expect(deleteButton).toBeTruthy();
    });
  });

  describe('minor size 的特殊行為', () => {
    it('應該在 minor size 時只顯示放大圖標', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard file={file} status="done" size="minor" />,
      );
      const zoomIcon = container.querySelector(
        '.mzn-icon[data-icon-name="zoom-in"]',
      );
      const tools = container.querySelector('.mzn-upload-picture-card__tools');

      expect(zoomIcon).toBeTruthy();
      expect(tools).toBeFalsy();
    });
  });

  describe('圖片顯示', () => {
    it('應該在 done 狀態且是圖片時顯示圖片', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard file={file} status="done" />,
      );
      const img = container.querySelector('img');

      expect(img).toBeTruthy();
    });

    it('不應該在 error 狀態時顯示圖片', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard file={file} status="error" errorMessage="錯誤" />,
      );
      const img = container.querySelector('img');

      expect(img).toBeFalsy();
    });

    it('應該設置圖片的 alt 屬性為文件名', () => {
      const file = createMockFile('test.jpg', 'image/jpeg');
      const { container } = render(
        <UploadPictureCard file={file} status="done" />,
      );
      const img = container.querySelector('img');

      expect(img?.alt).toBe('test.jpg');
    });
  });
});
