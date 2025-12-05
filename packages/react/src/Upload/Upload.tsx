'use client';

import {
  type UploadItemStatus,
  type UploadMode,
  type UploadSize
} from '@mezzanine-ui/core/upload';
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';

import {
  uploadClasses as classes,
  defaultUploadPictureCardErrorMessage,
} from '@mezzanine-ui/core/upload';

import { DangerousFilledIcon, InfoFilledIcon } from '@mezzanine-ui/icons';

import Icon from '../Icon';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import type { UploaderProps } from './Uploader';
import Uploader from './Uploader';
import UploadItem from './UploadItem';
import UploadPictureCard from './UploadPictureCard';

export interface UploadFile {
  /**
   * The file object.
   */
  file: File;
  /**
   * The unique id of the file.
   */
  id: string;
  /**
   * The upload status of the file.
   * @default 'loading'
   */
  status: UploadItemStatus;
  /**
   * The upload progress percentage (0-100).
   * @default 0
   */
  progress?: number;
  /**
   * Error message to display when status is 'error'.
   * If not provided, the default error message from Upload component will be used.
   */
  errorMessage?: string;
  /**
   * Error icon to display when status is 'error'.
   * If not provided, the default error icon from Upload component will be used.
   */
  errorIcon?: ReactNode;
}

export interface UploadProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onChange'> {
  /**
   * The accept attributes of native input element.
   * @example 'image/*', '.pdf,.doc,.docx'
   */
  accept?: string;
  /**
   * Whether the upload is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Controlled file list for the upload component.
   * Provide this along with `onChange` to fully control the file state.
   */
  files?: UploadFile[];
  /**
   * Array of hints to display with the upload component.
   */
  hints?: UploaderProps['hints'];
  /**
   * Icon configuration for different actions and states.
   */
  uploaderIcon?: UploaderProps['icon'];
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
   * The react ref passed to input element.
   */
  inputRef?: UploaderProps['inputRef'];
  /**
   * Whether to fill the width of the container.
   * @default false
   */
  isFillWidth?: boolean;
  /**
   * Maximum number of files allowed to upload.
   * If exceeded, the excess files will be ignored.
   */
  maxFiles?: number;
  /**
   * The display mode for the upload component.
   * - 'list': Display files as a list using UploadItem
   * - 'button-list': Display uploader as a button with files in list format
   * - 'cards': Display image files as picture cards using UploadPictureCard
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
   * The size of the upload component.
   * @default 'main'
   */
  size?: UploadSize;
  /**
   * Whether to show file size in list mode.
   * @default true
   */
  showFileSize?: boolean;
  /**
   * Label configuration for different states.
   */
  uploaderLabel?: UploaderProps['label'];
  /**
   * Default error message to display when upload fails.
   * This will be used when a file's status becomes 'error' and no errorMessage is provided.
   */
  errorMessage?: string;
  /**
   * Default error icon to display when upload fails.
   * This will be used when a file's status becomes 'error' and no errorIcon is provided.
   */
  errorIcon?: ReactNode;
  /**
   * Fired when files list changes.
   */
  onChange?: (files: UploadFile[]) => void;
  /**
   * Fired when a file is deleted.
   */
  onDelete?: (fileId: string, file: File) => void;
  /**
   * Fired when a file is downloaded (done state).
   */
  onDownload?: (fileId: string, file: File) => void;
  /**
   * Fired when the maximum number of files is exceeded.
   * @param maxFiles - The maximum number of files allowed
   * @param selectedCount - The number of files selected
   * @param currentCount - The current number of files in the list
   */
  onMaxFilesExceeded?: (maxFiles: number, selectedCount: number, currentCount: number) => void;
  /**
   * Fired when a file upload is retried (error state).
   */
  onReload?: (fileId: string, file: File) => void;
  /**
   * Fired when files are selected for upload.
   * @param files - The files to upload
   * @param setProgress - Callback to update upload progress for a specific file (file index, progress 0-100)
   * @returns Can return:
   *   - UploadFile[]: Full file objects with backend-provided IDs and status
   *   - { id: string }[]: Array of objects with backend-provided IDs (status will be set to 'done')
   *   - void/Promise<void>: For backward compatibility (status will be set to 'done')
   */
  onUpload?: (
    files: File[],
    setProgress?: (fileIndex: number, progress: number) => void,
  ) => Promise<UploadFile[]> | UploadFile[] | Promise<Array<{ id: string }>> | Array<{ id: string }> | Promise<void> | void;
  /**
   * Fired when zoom in is clicked on a picture card (done state).
   */
  onZoomIn?: (fileId: string, file: File) => void;
}

const Upload = forwardRef<HTMLDivElement, UploadProps>(function Upload(
  props,
  ref,
) {
  const {
    accept,
    className,
    disabled = false,
    mode = 'list',
    size = 'main',
    showFileSize = true,
    files: controlledFiles = [],
    onUpload,
    onDelete,
    onReload,
    onDownload,
    onZoomIn,
    onChange,
    id,
    name,
    multiple = false,
    maxFiles,
    hints,
    uploaderLabel,
    uploaderIcon,
    inputRef,
    inputProps,
    onMaxFilesExceeded,
    errorMessage,
    errorIcon,
    ...rest
  } = props;

  const files = controlledFiles;
  const filesRef = useRef<UploadFile[]>(files);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // Default error icon when status is error and no errorIcon is provided
  const defaultErrorIconElement = useMemo(
    () => errorIcon ?? <Icon icon={DangerousFilledIcon} color="error" size={24} />,
    [errorIcon],
  );

  // Auto-disable when maxFiles is reached
  const isMaxFilesReached = useMemo(() => {
    if (maxFiles === undefined) return false;
    return files.length >= maxFiles;
  }, [files.length, maxFiles]);

  const effectiveDisabled = disabled || isMaxFilesReached;

  // Helper function to find file by ID
  const findFileById = useCallback(
    (fileId: string): UploadFile | undefined => {
      return filesRef.current.find((f) => f.id === fileId);
    },
    [],
  );

  const emitChange = useCallback(
    (nextFiles: UploadFile[]) => {
      filesRef.current = nextFiles;
      onChange?.(nextFiles);
    },
    [onChange],
  );

  const handleUpload = useCallback(
    async (selectedFiles: File[]) => {
      if (!selectedFiles.length) return;

      // Check maxFiles limit
      if (maxFiles !== undefined) {
        const currentCount = filesRef.current.length;
        const selectedCount = selectedFiles.length;
        const totalCount = currentCount + selectedCount;

        if (totalCount > maxFiles) {
          const allowedCount = Math.max(0, maxFiles - currentCount);

          if (allowedCount <= 0) {
            // No more files can be added
            onMaxFilesExceeded?.(maxFiles, selectedCount, currentCount);
            return;
          }

          // Only take the allowed number of files
          selectedFiles = selectedFiles.slice(0, allowedCount);
          onMaxFilesExceeded?.(maxFiles, selectedCount, currentCount);
        }
      }

      // Create temporary files with simple temporary IDs
      // The actual IDs will be provided by the backend via onUpload return value
      const timestamp = Date.now();
      const tempFiles: UploadFile[] = selectedFiles.map((file, index) => ({
        file,
        id: `temp-${timestamp}-${index}-${Math.random().toString(36).substring(2, 9)}`,
        status: 'loading' as UploadItemStatus,
        progress: 0,
      }));

      const updatedFiles = [...filesRef.current, ...tempFiles];
      emitChange(updatedFiles);

      if (onUpload) {
        // Map to track temporary ID to file index
        const tempIdToIndex = new Map<string, number>();
        tempFiles.forEach((tempFile, index) => {
          tempIdToIndex.set(tempFile.id, index);
        });

        const setProgress = (fileIndex: number, progress: number) => {
          const targetFile = tempFiles[fileIndex];
          if (!targetFile) return;

          const nextFiles = filesRef.current.map((file) =>
            file.id === targetFile.id ? { ...file, progress } : file,
          );

          emitChange(nextFiles);
        };

        try {
          const result = await Promise.resolve(
            onUpload(
              selectedFiles,
              (fileIndex, progress) => setProgress(fileIndex, progress),
            ),
          );

          // Check if result is an array (new API) or void (old API for backward compatibility)
          if (Array.isArray(result) && result.length > 0) {
            // Check if it's UploadFile[] (full objects) or { id: string }[] (just IDs)
            const firstItem = result[0];
            const isFullUploadFile = 'file' in firstItem && 'status' in firstItem;

            if (isFullUploadFile) {
              // Full UploadFile[] API: backend returns complete file objects
              const backendFiles = result as UploadFile[];

              // Update files with backend-provided IDs and status
              // Match by index: backendFiles[i] corresponds to selectedFiles[i]
              const nextFiles = filesRef.current.map((file) => {
                const tempIndex = tempIdToIndex.get(file.id);

                // If this is a temp file and we have a corresponding backend file
                if (tempIndex !== undefined && tempIndex < backendFiles.length) {
                  const backendFile = backendFiles[tempIndex];
                  // Replace temporary file with backend file (includes real ID and status)
                  // Apply default error message and icon if status is error and not provided
                  if (backendFile.status === 'error') {
                    return {
                      ...backendFile,
                      errorMessage: backendFile.errorMessage ?? errorMessage ?? defaultUploadPictureCardErrorMessage,
                      errorIcon: backendFile.errorIcon ?? defaultErrorIconElement,
                    };
                  }
                  return backendFile;
                }

                return file;
              });

              emitChange(nextFiles);
            } else {
              // Simple { id: string }[] API: backend returns just IDs
              const backendIds = result as Array<{ id: string }>;

              // Update files with backend-provided IDs, set status to 'done'
              const nextFiles = filesRef.current.map((file) => {
                const tempIndex = tempIdToIndex.get(file.id);

                // If this is a temp file and we have a corresponding backend ID
                if (tempIndex !== undefined && tempIndex < backendIds.length) {
                  const backendId = backendIds[tempIndex];
                  // Replace temporary ID with backend ID, set status to 'done'
                  return {
                    ...file,
                    id: backendId.id,
                    status: 'done' as UploadItemStatus,
                    progress: 100,
                  };
                }

                return file;
              });

              emitChange(nextFiles);
            }
          } else {
            // Old API: backward compatibility - no return value, assume success
            const nextFiles = filesRef.current.map((file) =>
              tempFiles.some((tf) => tf.id === file.id)
                ? { ...file, status: 'done' as UploadItemStatus, progress: 100 }
                : file,
            );

            emitChange(nextFiles);
          }
        } catch (error) {
          console.error('Upload failed:', error);
          // Update all temp files to error status with default error message and icon
          const nextFiles = filesRef.current.map((file) => {
            if (tempFiles.some((tf) => tf.id === file.id)) {
              return {
                ...file,
                status: 'error' as UploadItemStatus,
                errorMessage: file.errorMessage ?? errorMessage ?? defaultUploadPictureCardErrorMessage,
                errorIcon: file.errorIcon ?? defaultErrorIconElement,
              };
            }
            return file;
          });

          emitChange(nextFiles);
        }
      } else {
        // No onUpload handler - mark as done immediately
        const nextFiles = filesRef.current.map((file) =>
          tempFiles.some((tf) => tf.id === file.id)
            ? { ...file, status: 'done' as UploadItemStatus, progress: 100 }
            : file,
        );

        emitChange(nextFiles);
      }
    },
    [emitChange, maxFiles, onMaxFilesExceeded, onUpload, errorMessage, defaultErrorIconElement],
  );

  const handleDelete = useCallback(
    (fileId: string) => {
      const file = findFileById(fileId);

      if (!file) return;

      const updated = filesRef.current.filter((f) => f.id !== fileId);

      emitChange(updated);
      onDelete?.(fileId, file.file);
    },
    [emitChange, findFileById, onDelete],
  );

  const handleReload = useCallback(
    (fileId: string) => {
      const file = findFileById(fileId);

      if (!file) return;

      const updated = filesRef.current.map((f) =>
        f.id === fileId
          ? { ...f, status: 'loading' as UploadItemStatus, progress: 0 }
          : f,
      );

      emitChange(updated);
      onReload?.(fileId, file.file);
    },
    [emitChange, findFileById, onReload],
  );

  const handleDownload = useCallback(
    (fileId: string) => {
      const file = findFileById(fileId);
      if (file) {
        onDownload?.(fileId, file.file);
      }
    },
    [findFileById, onDownload],
  );

  const handleZoomIn = useCallback(
    (fileId: string) => {
      const file = findFileById(fileId);
      if (file) {
        onZoomIn?.(fileId, file.file);
      }
    },
    [findFileById, onZoomIn],
  );

  const { imageFiles, nonImageFiles } = useMemo(() => {
    const images: UploadFile[] = [];
    const nonImages: UploadFile[] = [];

    files.forEach((file) => {
      if (file.file.type.startsWith('image/')) {
        images.push(file);
      } else {
        nonImages.push(file);
      }
    });

    return { imageFiles: images, nonImageFiles: nonImages };
  }, [files]);

  const uploaderConfig = useMemo(() => {
    const config: Record<UploadMode, UploaderProps> = {
      list: {
        isFillWidth: true,
        type: 'base',
      },
      'button-list': {
        type: 'button',
      },
      cards: {
        type: 'base',
        isFillWidth: false,
      },
      'card-wall': {
        type: 'base',
        isFillWidth: false,
      },
    };

    return config[mode];
  }, [mode]);

  const topUploaderConfig = useMemo(() => {
    if (mode === 'card-wall') {
      return {
        isFillWidth: true,
        type: 'base' as const,
      };
    }
    return null;
  }, [mode]);

  const shouldUsePictureCard = useMemo(() => {
    return /cards|card-wall/.test(mode);
  }, [mode]);

  const renderUploadItem = useCallback(
    (uploadFile: UploadFile) => (
      <UploadItem
        key={uploadFile.id}
        file={uploadFile.file}
        id={uploadFile.id}
        status={uploadFile.status}
        size={size}
        showFileSize={showFileSize}
        disabled={disabled}
        onDelete={() => handleDelete(uploadFile.id)}
        onDownload={() => handleDownload(uploadFile.id)}
        onReload={() => handleReload(uploadFile.id)}
      />
    ),
    [size, showFileSize, disabled, handleDelete, handleDownload, handleReload],
  );

  const uploaderElement = (
    <Uploader
      accept={accept}
      disabled={effectiveDisabled}
      id={id}
      name={name}
      multiple={multiple}
      label={uploaderLabel}
      icon={uploaderIcon}
      inputRef={inputRef}
      inputProps={inputProps}
      hints={hints}
      onUpload={handleUpload}
      {...uploaderConfig}
    />
  );

  const topUploaderElement = topUploaderConfig ? (
    <Uploader
      accept={accept}
      disabled={effectiveDisabled}
      id={id ? `${id}-top` : undefined}
      name={name}
      multiple={multiple}
      label={uploaderLabel}
      icon={uploaderIcon}
      inputRef={inputRef}
      inputProps={inputProps}
      hints={hints}
      onUpload={handleUpload}
      {...topUploaderConfig}
    />
  ) : null;

  const hintsElement = useMemo(() => {
    if (!hints || hints.length === 0 || mode === 'list' || mode === 'card-wall') return null;

    const hintsClassName = mode === 'cards' ? classes.fillWidthHints : classes.hints;

    return (
      <ul className={hintsClassName}>
        {hints.map((hint) => (
          <li key={hint.label} className={classes.hint(hint.type || 'info')}>
            <Icon
              icon={hint.type === 'info' ? InfoFilledIcon : DangerousFilledIcon}
              color={hint.type === 'info' ? 'info' : 'error'}
              size={14}
            />
            {hint.label}
          </li>
        ))}
      </ul>
    );
  }, [hints, mode]);

  return (
    <div
      ref={ref}
      className={cx(
        classes.host,
        className,
        mode === 'cards' && classes.hostCards,
      )}
      {...rest}
    >
      {topUploaderElement}
      {!shouldUsePictureCard && (
        <div className={classes.uploadButtonList}>
          {uploaderElement}
          {mode === 'button-list' && hintsElement}
        </div>
      )}
      <div
        className={
          cx(
            classes.uploadList,
            shouldUsePictureCard && classes.uploadListCards
          )
        }
      >
        {shouldUsePictureCard && (
          <>
            {imageFiles.map((uploadFile) => (
              <UploadPictureCard
                key={uploadFile.id}
                file={uploadFile.file}
                id={uploadFile.id}
                status={uploadFile.status}
                size={size}
                disabled={disabled}
                errorMessage={uploadFile.errorMessage}
                errorIcon={uploadFile.errorIcon}
                onDelete={() => handleDelete(uploadFile.id)}
                onReload={() => handleReload(uploadFile.id)}
                onDownload={() => handleDownload(uploadFile.id)}
                onZoomIn={() => handleZoomIn(uploadFile.id)}
              />
            ))}
            {uploaderElement}
          </>
        )}
        {nonImageFiles.length > 0 && nonImageFiles.map(renderUploadItem)}
        {!shouldUsePictureCard && imageFiles.length > 0 && imageFiles.map(renderUploadItem)}
      </div>
      {mode === 'cards' && hintsElement}
    </div>
  );
});

export default Upload;

