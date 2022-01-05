import { forwardRef } from 'react';
import {
  uploadInputClasses as classes,
} from '@mezzanine-ui/core/upload';

export interface UploadInputProps {
  /**
   * The accept attributes of native input element.
   */
  accept?: string;
  /**
   * Whether the input which file="file" is disabled.
   */
  disabled?: boolean;
  /**
   * Whether can select multiple files to upload.
   */
  multiple?: boolean;
  /**
   * Fired after user selected files.
   */
  onUpload?: (files: File[]) => void;
}

const UploadInput = forwardRef<HTMLInputElement, UploadInputProps>((props, ref) => {
  const {
    accept,
    disabled = false,
    multiple = false,
    onUpload,
  } = props;

  return (
    <input
      ref={ref}
      accept={accept}
      aria-disabled={disabled}
      className={classes.host}
      disabled={disabled}
      multiple={multiple}
      onClick={(event) => {
        // eslint-disable-next-line no-param-reassign
        event.currentTarget.value = '';
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
      }}
      onChange={(event) => {
        const { files: fileList } = event.target;

        if (fileList && onUpload) {
          const files: File[] = [];

          for (let i = 0; i < fileList.length; i += 1) {
            files.push(fileList[i]);
          }

          onUpload(files);
        }
      }}
      type="file"
    />
  );
});

export default UploadInput;
