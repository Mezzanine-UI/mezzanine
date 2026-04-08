import { UploadItemStatus } from '@mezzanine-ui/core/upload';

/**
 * 上傳檔案的資料模型，用於描述單一檔案的狀態與相關資訊。
 *
 * 作為 `MznUpload` 元件的核心資料結構，搭配 `files` input 使用。
 *
 * @example
 * ```typescript
 * import { UploadFile } from '@mezzanine-ui/ng/upload';
 *
 * const file: UploadFile = {
 *   id: '1',
 *   name: 'document.pdf',
 *   status: 'done',
 * };
 * ```
 */
export interface UploadFile {
  /** 上傳錯誤時的錯誤訊息。 */
  readonly errorMessage?: string;

  /** 原始 File 物件。 */
  readonly file?: File;

  /** 檔案唯一識別碼。 */
  readonly id: string;

  /** 檔案名稱。 */
  readonly name: string;

  /** 上傳進度（0-100）。 */
  readonly progress?: number;

  /** 檔案上傳狀態。 */
  readonly status: UploadItemStatus;

  /** 縮圖 URL，用於圖片預覽。 */
  readonly thumbnailUrl?: string;

  /** 檔案下載或存取 URL。 */
  readonly url?: string;
}
