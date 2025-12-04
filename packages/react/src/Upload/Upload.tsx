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
  useId,
  useMemo,
  useRef,
} from 'react';

import {
  uploadMainClasses as classes,
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
   */
  progress?: number;
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
   * The id of input element.
   */
  id?: string;
  /**
   * Whether to fill the width of the container.
   * @default false
   */
  isFillWidth?: boolean;
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
   * Maximum number of files allowed to upload.
   * If exceeded, the excess files will be ignored.
   */
  maxFiles?: number;
  /**
   * Array of hints to display with the upload component.
   */
  hints?: UploaderProps['hints'];
  /**
   * Label configuration for different states.
   */
  uploaderLabel?: UploaderProps['label'];
  /**
   * Icon configuration for different actions and states.
   */
  icon?: UploaderProps['icon'];
  /**
   * The react ref passed to input element.
   */
  inputRef?: UploaderProps['inputRef'];
  /**
   * Since at Mezzanine we use a host element to wrap our input, most derived props will be passed to the host element.
   * If you need direct control to the input element, use this prop to provide to it.
   */
  inputProps?: UploaderProps['inputProps'];
  /**
   * The display mode for the upload component.
   * - 'list': Display files as a list using UploadItem
   * - 'picture-card': Display image files as cards using UploadPictureCard
   * - 'auto': Automatically choose based on file type (images use picture-card, others use list)
   * @default 'list'
   */
  mode?: UploadMode;
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
   * Controlled file list for the upload component.
   * Provide this along with `onChange` to fully control the file state.
   */
  files?: UploadFile[];
  /**
   * Fired when files are selected for upload.
   * @param files - The files to upload
   * @param setProgress - Callback to update upload progress for a specific file (file index, progress 0-100)
   */
  onUpload?: (files: File[], setProgress?: (fileIndex: number, progress: number) => void) => Promise<void> | void;
  /**
   * Fired when a file is deleted.
   */
  onDelete?: (fileId: string, file: File) => void;
  /**
   * Fired when a file upload is retried (error state).
   */
  onReload?: (fileId: string, file: File) => void;
  /**
   * Fired when a file is downloaded (done state).
   */
  onDownload?: (fileId: string, file: File) => void;
  /**
   * Fired when zoom in is clicked on a picture card (done state).
   */
  onZoomIn?: (fileId: string, file: File) => void;
  /**
   * Fired when files list changes.
   */
  onChange?: (files: UploadFile[]) => void;
  /**
   * Fired when the maximum number of files is exceeded.
   * @param maxFiles - The maximum number of files allowed
   * @param selectedCount - The number of files selected
   * @param currentCount - The current number of files in the list
   */
  onMaxFilesExceeded?: (maxFiles: number, selectedCount: number, currentCount: number) => void;
}

/**
 * The react component for `mezzanine` upload.
 * Combines Uploader, UploadItem, and UploadPictureCard components.
 */
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
    icon,
    inputRef,
    inputProps,
    onMaxFilesExceeded,
    ...rest
  } = props;

  const generatedId = useId();
  const files = controlledFiles;
  const filesRef = useRef<UploadFile[]>(files);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // Auto-disable when maxFiles is reached
  const isMaxFilesReached = useMemo(() => {
    if (maxFiles === undefined) return false;
    return files.length >= maxFiles;
  }, [files.length, maxFiles]);

  const effectiveDisabled = disabled || isMaxFilesReached;

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

      const newFiles: UploadFile[] = selectedFiles.map((file, index) => ({
        file,
        id: `${generatedId}-${Date.now()}-${index}-${file.name}-${file.size}-${file.lastModified}`,
        status: 'loading' as UploadItemStatus,
        progress: 0,
      }));

      const updatedFiles = [...filesRef.current, ...newFiles];
      emitChange(updatedFiles);

      if (onUpload) {
        const setProgress = (fileIndex: number, progress: number) => {
          const targetFile = newFiles[fileIndex];
          if (!targetFile) return;

          const nextFiles = filesRef.current.map((file) =>
            file.id === targetFile.id ? { ...file, progress } : file,
          );

          emitChange(nextFiles);
        };

        try {
          const result = onUpload(
            selectedFiles,
            (fileIndex, progress) => setProgress(fileIndex, progress),
          );

          if (result instanceof Promise) {
            await result;
          }

          const nextFiles = filesRef.current.map((file) =>
            newFiles.some((nf) => nf.id === file.id)
              ? { ...file, status: 'done' as UploadItemStatus, progress: 100 }
              : file,
          );

          emitChange(nextFiles);
        } catch {
          const nextFiles = filesRef.current.map((file) =>
            newFiles.some((nf) => nf.id === file.id)
              ? { ...file, status: 'error' as UploadItemStatus }
              : file,
          );

          emitChange(nextFiles);
        }
      } else {
        const nextFiles = filesRef.current.map((file) =>
          newFiles.some((nf) => nf.id === file.id)
            ? { ...file, status: 'done' as UploadItemStatus, progress: 100 }
            : file,
        );

        emitChange(nextFiles);
      }
    },
    [emitChange, generatedId, maxFiles, onMaxFilesExceeded, onUpload],
  );

  const handleDelete = useCallback(
    (fileId: string) => {
      const file = filesRef.current.find((f) => f.id === fileId);

      if (!file) return;

      const updated = filesRef.current.filter((f) => f.id !== fileId);

      emitChange(updated);
      onDelete?.(fileId, file.file);
    },
    [emitChange, onDelete],
  );

  const handleReload = useCallback(
    (fileId: string) => {
      const file = filesRef.current.find((f) => f.id === fileId);

      if (!file) return;

      const updated = filesRef.current.map((f) =>
        f.id === fileId
          ? { ...f, status: 'loading' as UploadItemStatus, progress: 0 }
          : f,
      );

      emitChange(updated);
      onReload?.(fileId, file.file);
    },
    [emitChange, onReload],
  );

  const handleDownload = useCallback(
    (fileId: string) => {
      const file = filesRef.current.find((f) => f.id === fileId);
      if (file) {
        onDownload?.(fileId, file.file);
      }
    },
    [onDownload],
  );

  const handleZoomIn = useCallback(
    (fileId: string) => {
      const file = filesRef.current.find((f) => f.id === fileId);
      if (file) {
        onZoomIn?.(fileId, file.file);
      }
    },
    [onZoomIn],
  );

  const imageFiles = useMemo(
    () => files.filter((f) => f.file.type.startsWith('image/')),
    [files],
  );

  const nonImageFiles = useMemo(
    () => files.filter((f) => !f.file.type.startsWith('image/')),
    [files],
  );

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
    if (/cards|card-wall/.test(mode)) return true;

    return false;
  }, [mode]);

  const uploaderElement = (
    <Uploader
      accept={accept}
      disabled={effectiveDisabled}
      id={id}
      name={name}
      multiple={multiple}
      label={uploaderLabel}
      icon={icon}
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
      icon={icon}
      inputRef={inputRef}
      inputProps={inputProps}
      hints={hints}
      onUpload={handleUpload}
      {...topUploaderConfig}
    />
  ) : null;

  const hintsElement = () => {
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
  };

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
        <div>
          {uploaderElement}
          {mode === 'button-list' && hintsElement()}
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
                onDelete={() => handleDelete(uploadFile.id)}
                onReload={() => handleReload(uploadFile.id)}
                onDownload={() => handleDownload(uploadFile.id)}
                onZoomIn={() => handleZoomIn(uploadFile.id)}
              />
            ))}
            {shouldUsePictureCard && uploaderElement}
          </>
        )}
        {nonImageFiles.length > 0 && (
          <>
            {nonImageFiles.map((uploadFile) => (
              <UploadItem
                key={uploadFile.id}
                file={uploadFile.file}
                id={uploadFile.id}
                status={uploadFile.status}
                size={size}
                showFileSize={showFileSize}
                disabled={disabled}
                onDelete={() => handleDelete(uploadFile.id)}
                onReload={() => handleReload(uploadFile.id)}
                onDonwload={() => handleDownload(uploadFile.id)}
              />
            ))}
          </>
        )}
        {!shouldUsePictureCard && imageFiles.length > 0 && (
          <>
            {imageFiles.map((uploadFile) => (
              <UploadItem
                key={uploadFile.id}
                file={uploadFile.file}
                id={uploadFile.id}
                status={uploadFile.status}
                size={size}
                showFileSize={showFileSize}
                disabled={disabled}
                onDelete={() => handleDelete(uploadFile.id)}
                onReload={() => handleReload(uploadFile.id)}
                onDonwload={() => handleDownload(uploadFile.id)}
              />
            ))}
          </>
        )}
      </div>
      {mode === 'cards' && hintsElement()}
    </div>
  );
});

export default Upload;

