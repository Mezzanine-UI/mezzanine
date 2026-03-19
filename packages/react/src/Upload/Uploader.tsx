'use client';

import {
  ChangeEventHandler,
  DragEventHandler,
  forwardRef,
  MouseEvent,
  ReactNode,
  Ref,
  useId,
  useMemo,
  useRef,
  useState
} from 'react';

import {
  uploaderClasses as classes,
  type UploaderHintType,
  type UploaderMode,
  type UploadPictureControl,
  type UploadType
} from '@mezzanine-ui/core/upload';
import { DangerousFilledIcon, InfoFilledIcon, type IconDefinition, UploadIcon as UploadIconIcon } from '@mezzanine-ui/icons';

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
  type?: UploaderHintType;
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
   * Label text for "Click to upload" in `mode="dropzone"`.
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
   * Provide `controllerRef` if you need detail data of file.
   */
  controllerRef?: Ref<UploadPictureControl | null>;
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
   * The react ref passed to input element.
   */
  inputRef?: React.Ref<HTMLInputElement>;
  /**
   * Label configuration for different states.
   */
  label?: UploaderLabel;
  /**
   * The name attribute of the input element.
   */
  name?: string;
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
   * Invoked by input change event.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * Fired after user selected files.
   */
  onUpload?: (files: File[]) => void;
  /**
   * The type for upload component.
   * @default 'base'
   * @example 'base' | 'button'
   */
  type?: UploadType;
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
    controllerRef: _controllerRef,
    disabled = false,
    externalHints,
    id,
    hints,
    icon: iconConfig,
    inputProps,
    inputRef: inputRefProp,
    label: labelConfig,
    mode = 'basic',
    multiple = false,
    name,
    onChange: onChangeProp,
    onUpload,
    type,
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
  const isDropzone = mode === 'dropzone';

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
    : isDropzone
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

  return (
    <>
      <label
        className={cx(
          classes.host,
          type && classes.type(type),
          type !== 'button' && isDropzone && classes.fillWidth,
          isDragging && classes.dragging,
          type !== 'button' && disabled && classes.disabled,
          className,
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        ref={ref}
        {...rest}
      >
        <>
          {
            type === 'base'
            && isDropzone
            && <div className={classes.uploadContent}>
              {uploadIcon}
              <Typography className={classes.uploadLabel}>
                {uploadLabel && <>{uploadLabel}{' '}</>}
                <span className={classes.clickToUpload}>
                  {clickToUploadLabel}
                </span>
              </Typography>
              {
                hints?.map((hint, index) => (
                  <Typography key={index} className={classes.fillWidthHints}>
                    {hint.label}
                  </Typography>
                ))
              }
            </div>
          }
          {
            type === 'base'
            && !isDropzone
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
      {externalHints && externalHints.length > 0 && (
        <ul className={classes.externalHints}>
          {externalHints.map((hint) => (
            <li key={hint.label} className={classes.externalHint(hint.type || 'info')}>
              <Icon
                icon={hint.type === 'info' ? InfoFilledIcon : DangerousFilledIcon}
                color={hint.type === 'info' ? 'info' : 'error'}
                size={14}
              />
              {hint.label}
            </li>
          ))}
        </ul>
      )}
    </>
  );
});

export default Uploader;

