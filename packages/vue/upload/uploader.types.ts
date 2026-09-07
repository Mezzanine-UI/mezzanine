import type { InputHTMLAttributes, VNodeChild } from 'vue';
import type {
  UploaderHintType,
  UploaderMode,
  UploadType,
} from '@mezzanine-ui/core/upload';
import type { IconDefinition } from '@mezzanine-ui/icons';

export type UploaderInputElementProps = Omit<
  InputHTMLAttributes,
  | 'accept'
  | 'disabled'
  | 'multiple'
  | 'onChange'
  | 'type'
  | `aria-${'disabled'}`
>;

export interface UploaderHint {
  /**
   * The label text of the hint.
   */
  label: string;
  /**
   * The icon element of the hint.
   */
  type?: UploaderHintType;
}

export interface UploaderLabel {
  /**
   * Label text for "Click to upload" in `mode="dropzone"`.
   * @default 'Click to upload'
   */
  clickToUpload?: string;
  /**
   * Label text for error state.
   */
  error?: string;
  /**
   * Label text for success state.
   */
  success?: string;
  /**
   * Label text for upload state.
   */
  uploadLabel?: string;
  /**
   * Label text for uploading state.
   */
  uploadingLabel?: string;
}

export interface UploaderIcon {
  /**
   * Icon for delete action.
   */
  delete?: VNodeChild;
  /**
   * Icon for document.
   */
  document?: VNodeChild;
  /**
   * Icon for download action.
   */
  download?: VNodeChild;
  /**
   * Icon for error state.
   */
  error?: VNodeChild;
  /**
   * Icon for reload action.
   */
  reload?: VNodeChild;
  /**
   * Icon for success state.
   */
  success?: VNodeChild;
  /**
   * Icon for upload action.
   */
  upload?: IconDefinition;
  /**
   * Icon for zoom action.
   */
  zoom?: VNodeChild;
}

export interface UploaderProps {
  /**
   * The accept attributes of native input element.
   * @example 'image/*', '.pdf,.doc,.docx'
   */
  accept?: string;
  /**
   * Whether the input is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Array of hints to display outside the uploader (below the label element).
   */
  externalHints?: UploaderHint[];
  /**
   * Array of hints to display with the upload component.
   */
  hints?: UploaderHint[];
  /**
   * Icon configuration for different actions and states.
   */
  icon?: UploaderIcon;
  /**
   * The id of input element.
   */
  id?: string;
  /**
   * Since at Mezzanine we use a host element to wrap our input, most derived props will be passed to the host element.
   * If you need direct control to the input element, use this prop to provide to it.
   */
  inputProps?: UploaderInputElementProps;
  /**
   * Label configuration for different states.
   */
  label?: UploaderLabel;
  /**
   * The mode for upload component.
   * @default 'basic'
   * @example 'basic' | 'dropzone'
   */
  mode?: UploaderMode;
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
   * The type for upload component.
   * @default 'base'
   * @example 'base' | 'button'
   */
  type?: UploadType;
}
