import type { VNodeChild } from 'vue';
import type {
  UploadItemStatus,
  UploadMode,
  UploadSize,
} from '@mezzanine-ui/core/upload';
import type { UploadPictureCardAriaLabels } from './upload-picture-card.types';
import type { UploaderProps } from './uploader.types';

export interface UploadFile {
  /**
   * Error icon to display when status is 'error'.
   * If not provided, the default error icon from the upload component will be used.
   */
  errorIcon?: VNodeChild;
  /**
   * Error message to display when status is 'error'.
   * If not provided, the default error message from the upload component will be used.
   */
  errorMessage?: string;
  /**
   * The file object.
   * Required when uploading new files.
   * Optional when `url` is provided for already uploaded files.
   */
  file?: File;
  /**
   * The unique id of the file.
   */
  id: string;
  /**
   * The upload progress percentage (0-100).
   * @default 0
   */
  progress?: number;
  /**
   * The upload status of the file.
   * @default 'loading'
   */
  status: UploadItemStatus;
  /**
   * The URL of the uploaded file.
   * When provided, this will be used to display files that have already been uploaded to the server.
   */
  url?: string;
}

export interface UploadProps {
  /**
   * The accept attributes of native input element.
   * @example 'image/*', '.pdf,.doc,.docx'
   */
  accept?: string;
  /**
   * Aria labels passed to picture cards in `cards` / `card-wall` mode.
   * Useful for customizing text such as "Click to Replace".
   */
  ariaLabels?: UploadPictureCardAriaLabels;
  /**
   * Whether the upload is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Hints passed into the uploader dropzone area. Only visible in dropzone modes (`list`, `card-wall`).
   */
  dropzoneHints?: UploaderProps['hints'];
  /**
   * Default error icon to display when upload fails.
   * This will be used when a file's status becomes 'error' and no errorIcon is provided.
   */
  errorIcon?: VNodeChild;
  /**
   * Default error message to display when upload fails.
   * This will be used when a file's status becomes 'error' and no errorMessage is provided.
   */
  errorMessage?: string;
  /**
   * Controlled file list for the upload component.
   * Provide this along with `change` to fully control the file state.
   */
  files?: UploadFile[];
  /**
   * Array of hints displayed outside the uploader area. Visible in all modes.
   */
  hints?: UploaderProps['hints'];
  /**
   * The id of input element.
   */
  id?: string;
  /**
   * Since at Mezzanine we use a host element to wrap our input, most derived props will be passed to the host element.
   * If you need direct control to the input element, use this prop to provide to it.
   */
  inputProps?: UploaderProps['inputProps'];
  /**
   * Maximum number of files allowed to upload.
   * If exceeded, the excess files will be ignored.
   */
  maxFiles?: number;
  /**
   * The display mode for the upload component.
   * - 'list': Display files as a list using upload items (with dropzone)
   * - 'basic-list': Display files as a list without drag-and-drop
   * - 'button-list': Display uploader as a button with files in list format
   * - 'cards': Display image files as picture cards
   * - 'card-wall': Display uploader at top with image files as picture cards below
   * @default 'list'
   */
  mode?: UploadMode;
  /**
   * Whether can select multiple files to upload.
   * @default false
   */
  multiple?: boolean;
  /**
   * The name attribute of the input element.
   */
  name?: string;
  /**
   * Fired when files are selected for upload.
   *
   * Stays a prop rather than becoming an emit, because the upload reads what it
   * returns — the backend's ids and statuses — and a Vue emit returns nothing.
   * The contract still counts it as the `upload` output, as React's does.
   *
   * @param files - The files to upload
   * @param setProgress - Callback to update upload progress for a specific file (file index, progress 0-100)
   */
  onUpload?: (
    files: File[],
    setProgress?: (fileIndex: number, progress: number) => void,
  ) =>
    | Promise<UploadFile[]>
    | UploadFile[]
    | Promise<Array<{ id: string }>>
    | Array<{ id: string }>
    | Promise<void>
    | void;
  /**
   * Whether to show file size in list mode.
   * @default true
   */
  showFileSize?: boolean;
  /**
   * The size of the upload component.
   * @default 'main'
   */
  size?: UploadSize;
  /**
   * Icon configuration for different actions and states.
   */
  uploaderIcon?: UploaderProps['icon'];
  /**
   * Label configuration for different states.
   */
  uploaderLabel?: UploaderProps['label'];
}
