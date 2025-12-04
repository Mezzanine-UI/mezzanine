'use client';

import {
  ChangeEventHandler,
  DragEventHandler,
  forwardRef,
  KeyboardEventHandler,
  MouseEvent,
  ReactNode,
  Ref,
  useId,
  useMemo,
  useRef,
  useState
} from 'react';

import {
  uploadClasses as classes,
  type UploadPictureControl,
  type UploadType
} from '@mezzanine-ui/core/upload';
import { type IconDefinition, UploadIcon as UploadIconIcon } from '@mezzanine-ui/icons';

import Button from '../Button';
import Icon from '../Icon';
import Typography from '../Typography';
import { composeRefs } from '../utils/composeRefs';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

type UploaderInputElementProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'input'>,
  | 'accept'
  | 'disabled'
  | 'multiple'
  | 'onChange'
  | 'type'
  | `aria-${'disabled'}`
> & {
  /**
   * The id attribute can be provided via inputProps, but it's recommended to use the `id` prop directly.
   * If both are provided, the `id` prop takes precedence.
   */
  id?: string;
  /**
   * The name attribute can be provided via inputProps, but it's recommended to use the `name` prop directly.
   * If both are provided, the `name` prop takes precedence.
   */
  name?: string;
};

export interface UploaderHint {
  /**
   * The label text of the hint.
   */
  label: string;
  /**
   * The icon element of the hint.
   */
  type?: 'error' | 'info';
}

export interface UploaderLabel {
  /**
   * Label text for upload state.
   */
  uploadLabel?: string;
  /**
   * Label text for uploading state.
   */
  uploadingLabel?: string;
  /**
   * Label text for success state.
   */
  success?: string;
  /**
   * Label text for error state.
   */
  error?: string;
  /**
   * Label text for "Click to upload" when isFillWidth is true.
   * @default 'Click to upload'
   */
  clickToUpload?: string;
}

export interface UploaderIcon {
  /**
   * Icon for upload action.
   */
  upload?: IconDefinition;
  /**
   * Icon for error state.
   */
  error?: ReactNode;
  /**
   * Icon for success state.
   */
  success?: ReactNode;
  /**
   * Icon for zoom action.
   */
  zoom?: ReactNode;
  /**
   * Icon for document.
   */
  document?: ReactNode;
  /**
   * Icon for download action.
   */
  download?: ReactNode;
  /**
   * Icon for reload action.
   */
  reload?: ReactNode;
  /**
   * Icon for delete action.
   */
  delete?: ReactNode;
}

export interface UploaderProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'label'>, 'onChange'> {
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
   * The id of input element.
   */
  id?: string;
  /**
   * Whether to fill the width of the container.
   * @default false
   */
  isFillWidth?: boolean;
  /**
   * Since at Mezzanine we use a host element to wrap our input, most derived props will be passed to the host element.
   * If you need direct control to the input element, use this prop to provide to it.
   */
  inputProps?: UploaderInputElementProps;
  /**
   * The react ref passed to input element.
   */
  inputRef?: React.Ref<HTMLInputElement>;
  /**
   * The name attribute of the input element.
   */
  name?: string;
  /**
   * Whether can select multiple files to upload.
   * @default false
   */
  multiple?: boolean;
  /**
   * The type for upload component.
   * @default 'base'
   * @example 'base' | 'button'
   */
  type?: UploadType;
  /**
   * Array of hints to display with the upload component.
   */
  hints?: UploaderHint[];
  /**
   * Label configuration for different states.
   */
  label?: UploaderLabel;
  /**
   * Icon configuration for different actions and states.
   */
  icon?: UploaderIcon;
  /**
   * Provide `controllerRef` if you need detail data of file.
   */
  controllerRef?: Ref<UploadPictureControl | null>;
  /**
   * Invoked by input change event.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * Fired after user selected files.
   */
  onUpload?: (files: File[]) => void;
  /**
   * Fired after user deletes file.
   */
  onDelete?: () => void;
}

/**
 * The react component for `mezzanine` uploader.
 */
const Uploader = forwardRef<HTMLLabelElement, UploaderProps>(function Uploader(
  props,
  ref,
) {
  const {
    accept,
    className,
    disabled = false,
    id,
    inputProps,
    inputRef: inputRefProp,
    isFillWidth = false,
    multiple = false,
    name,
    type,
    hints,
    label: labelConfig,
    icon: iconConfig,
    controllerRef: _controllerRef,
    onChange: onChangeProp,
    onUpload,
    onDelete: _onDelete,
    ...rest
  } = props;

  const {
    name: nameFromInputProps,
    id: idFromInputProps,
    ...restInputProps
  } = inputProps || {};

  // Generate unique id if not provided
  const generatedId = useId();
  const finalInputId = id ?? idFromInputProps ?? generatedId;

  const inputElementRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const composedInputRef = useMemo(
    () => composeRefs([inputRefProp, inputElementRef]),
    [inputRefProp],
  );

  const resolvedName = name ?? nameFromInputProps ?? finalInputId;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (onChangeProp) {
      onChangeProp(event);
    }

    if (onUpload) {
      const { files: fileList } = event.target;

      if (fileList) {
        const files: File[] = [];

        for (let i = 0; i < fileList.length; i += 1) {
          files.push(fileList[i]);
        }

        onUpload(files);
      }
    }

    // Reset input value to allow selecting the same file again
    event.currentTarget.value = '';
  };

  const handleDragOver: DragEventHandler<HTMLLabelElement> = (event) => {
    if (disabled || type === 'button') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter: DragEventHandler<HTMLLabelElement> = (event) => {
    if (disabled || type === 'button') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave: DragEventHandler<HTMLLabelElement> = (event) => {
    if (disabled || type === 'button') {
      return;
    }

    // Only clear dragging state if leaving the label itself (not a child)
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    if (
      x < rect.left ||
      x > rect.right ||
      y < rect.top ||
      y > rect.bottom
    ) {
      setIsDragging(false);
    }
  };

  const handleDrop: DragEventHandler<HTMLLabelElement> = (event) => {
    if (disabled || type === 'button') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);

    const { dataTransfer } = event;

    if (dataTransfer?.files && dataTransfer.files.length > 0) {
      const files: File[] = [];

      for (let i = 0; i < dataTransfer.files.length; i += 1) {
        files.push(dataTransfer.files[i]);
      }

      if (onUpload) {
        onUpload(files);
      }

      // Note: We cannot directly set input.files from drag & drop
      // The onChange event will not be triggered for drag & drop
      // If onChange is needed, it should be handled via onUpload callback
    }
  };

  const uploadIcon = useMemo(() => {
    const icon = iconConfig?.upload ?? UploadIconIcon;

    return <Icon className={classes.uploadIcon} icon={icon} />;
  }, [iconConfig]);

  const uploadLabel = labelConfig?.uploadLabel
    ? labelConfig?.uploadLabel
    : isFillWidth
      ? 'Drag the file here or'
      : 'Upload';
  const clickToUploadLabel = labelConfig?.clickToUpload ?? 'Click to upload';

  const handleClickToUpload = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!disabled && inputElementRef.current) {
      inputElementRef.current.click();
    }
  };

  const handleKeyDownToUpload: KeyboardEventHandler<HTMLElement> = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();

      if (!disabled && inputElementRef.current) {
        inputElementRef.current.click();
      }
    }
  };

  return (
    <label
      ref={ref}
      className={cx(
        classes.host,
        type && classes.type(type),
        type !== 'button' && isFillWidth && classes.fillWidth,
        isDragging && classes.dragging,
        type !== 'button' && disabled && classes.disabled,
        className,
      )}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...rest}
    >
      <>
        {
          type === 'base'
          && isFillWidth
          && <div className={classes.uploadContent}>
            {uploadIcon}
            <Typography className={classes.uploadLabel}>
              {uploadLabel && <>{uploadLabel}{' '}</>}
              <span
                className={classes.clickToUpload}
                onClick={handleClickToUpload}
                onKeyDown={handleKeyDownToUpload}
                role="button"
                tabIndex={disabled ? -1 : 0}
              >
                {clickToUploadLabel}
              </span>
            </Typography>
            {
              isFillWidth && hints?.map((hint, index) => (
                <Typography key={index} className={classes.fillWidthHints}>
                  {hint.label}
                </Typography>
              ))
            }
          </div>
        }
        {
          type === 'base'
          && !isFillWidth
          && <div className={classes.uploadContent}>
            {uploadIcon}
            <Typography className={classes.uploadLabel}>
              {uploadLabel}
            </Typography>
          </div>
        }
        {
          type === 'button'
          && (
            <Button disabled={disabled} onClick={handleClickToUpload}>
              {uploadIcon}
              <Typography>
                {uploadLabel}
              </Typography>
            </Button>
          )
        }
        <input
          {...restInputProps}
          accept={accept}
          aria-disabled={disabled}
          className={classes.input}
          disabled={disabled}
          id={finalInputId}
          multiple={multiple}
          name={resolvedName}
          onChange={handleChange}
          ref={composedInputRef}
          type="file"
        />
      </>
    </label>
  );
});

export default Uploader;

