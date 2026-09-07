import type {
  UploadItemSize,
  UploadItemStatus,
  UploadItemType,
} from '@mezzanine-ui/core/upload';
import type { IconDefinition } from '@mezzanine-ui/icons';

export interface UploadItemProps {
  /**
   * Whether the item is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The error icon to display when status is 'error'.
   */
  errorIcon?: IconDefinition;
  /**
   * The error message to display when status is 'error'.
   */
  errorMessage?: string;
  /**
   * The file to display.
   * Required when displaying local files (before upload).
   * Optional when `url` is provided for already uploaded files.
   */
  file?: File;
  /**
   * The file size to display (optional).
   */
  fileSize?: number;
  /**
   * Custom icon for the item.
   */
  icon?: IconDefinition;
  /**
   * The id of the file id to identify the file.
   */
  id?: string;
  /**
   * Whether to show the file size.
   */
  showFileSize?: boolean;
  /**
   * The file size to display (optional).
   */
  size?: UploadItemSize;
  /**
   * The status of the item.
   * @default 'loading'
   */
  status: UploadItemStatus;
  /**
   * The type of the item.
   * @default 'icon'
   */
  type?: UploadItemType;
  /**
   * The URL of the uploaded file.
   * When provided, this will be used to display files that have already been uploaded to the server.
   * Useful for loading file lists from the backend.
   */
  url?: string;
}
