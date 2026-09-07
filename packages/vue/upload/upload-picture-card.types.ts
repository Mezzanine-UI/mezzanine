import type {
  UploadItemStatus,
  UploadPictureCardImageFit,
  UploadPictureCardSize,
} from '@mezzanine-ui/core/upload';
import type { IconDefinition } from '@mezzanine-ui/icons';

export interface UploadPictureCardAriaLabels {
  /**
   * Aria label for cancel upload button.
   * @default 'Cancel upload'
   */
  cancelUpload?: string;
  /**
   * Aria label for the click-to-replace overlay label.
   * @default 'Click to Replace'
   */
  clickToReplace?: string;
  /**
   * Aria label for delete button.
   * @default 'Delete file'
   */
  delete?: string;
  /**
   * Aria label for download button.
   * @default 'Download file'
   */
  download?: string;
  /**
   * Aria label for reload/retry button.
   * @default 'Retry upload'
   */
  reload?: string;
  /**
   * Aria label for uploading status.
   * @default 'Uploading'
   */
  uploading?: string;
  /**
   * Aria label for zoom in button.
   * @default 'Zoom in image'
   */
  zoomIn?: string;
}

export interface UploadPictureCardProps {
  /**
   * Aria labels for accessibility. Allows customization for internationalization.
   */
  ariaLabels?: UploadPictureCardAriaLabels;
  /**
   * Whether the upload picture card is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Error icon to display when status is 'error'.
   */
  errorIcon?: IconDefinition;
  /**
   * Error message to display when status is 'error'.
   */
  errorMessage?: string;
  /**
   * The file to display.
   * Required when displaying local files (before upload).
   * Optional when `url` is provided for already uploaded files.
   */
  file?: File;
  /**
   * The id of the file id to identify the file.
   */
  id?: string;
  /**
   * The image fit of the upload picture card.
   * @default 'cover'
   */
  imageFit?: UploadPictureCardImageFit;
  /**
   * Whether the upload picture card is readable.
   * @default false
   */
  readable?: boolean;
  /**
   * The size of the upload picture card.
   * @default 'main'
   */
  size?: UploadPictureCardSize;
  /**
   * The status of the upload picture card.
   * @default 'loading'
   */
  status?: UploadItemStatus;
  /**
   * The URL of the uploaded file.
   * When provided, this will be used instead of creating a blob URL from `file`.
   * Useful for displaying files that have already been uploaded to the server.
   */
  url?: string;
}
