import {
  forwardRef,
  Ref,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
} from 'react';
import {
  ImageUploader,
  uploadPictureWallClasses as classes,
} from '@mezzanine-ui/core/upload';
import compact from 'lodash/compact';
import drop from 'lodash/drop';
import isEqual from 'lodash/isEqual';
import { usePreviousValue } from '../hooks/usePreviousValue';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import UploadPictureWallItem from './UploadPictureWallItem';

export type UploadPictureWallControl = {
  getAllData: () => void;
};

export interface UploadPictureWallBaseProps
  extends
  Omit<NativeElementPropsWithoutKeyAndRef<'div'>,
  | 'children'
  | 'onChange'
  | 'onError'
  | 'value'
  > {
  /**
   * The accept attributes of native input element.
   * @default 'image/*'
   */
  accept?: string;
  /**
   * Provide `controllerRef` if you need detail data of files.
   */
  controllerRef?: Ref<UploadPictureWallControl | null>;
  /**
   * The default values of uploader.
   */
  defaultValues?: string[];
  /**
   * Whether the input which is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * maximum file lengths
   */
  maxLength?: number;
  /**
   * Whether the input which is multiple.
   * @default true
   */
  multiple?: boolean;
  /**
  * Fired after values changed.
  */
  onChange?: (urls: string[]) => void;
  /**
  * Fired after user delete image.
  */
  onDelete?: (urls: string[]) => void;
  /**
  * Fired after user upload images failed.
  */
  onError?: (files: File | File[]) => void;
  /**
  * Fired after user upload images success.
  */
  onUploadSuccess?: (files: File | File[], urls: string | string[]) => void;
}

export interface UploadPictureWallSingleUploadProps extends UploadPictureWallBaseProps {
  onMultiUpload?: undefined
  /**
  * Fired when user upload image, need to return Promise<string>.
  * Arg1 is target file, arg2 `setProgress` can set the progress of uploading.
  */
  onUpload?: (file: File, setProgress: (progress: number) => void) => Promise<string>;
  /**
   * Whether the uploading which is parallel, only enabled when `onUpload` is given .
   * @default false
   */
  parallel?: boolean;
}

export interface UploadPictureWallMultiUploadProps extends UploadPictureWallBaseProps {
  /**
  * Fired when user upload images, need to return Promise<string[]>.
  * Arg1 is target files, arg2 `setProgress` can set the progress of uploading.
  */
  onMultiUpload?: (files: File[], setProgress: (progress: number) => void) => Promise<string[]>;
  onUpload?: undefined;
  parallel?: undefined;
}

export type UploadPictureWallProps = UploadPictureWallSingleUploadProps | UploadPictureWallMultiUploadProps;

const UploadPictureWall = forwardRef<HTMLDivElement, UploadPictureWallProps>(function UploadPictureWall(props, ref) {
  const {
    accept = 'image/*',
    className,
    controllerRef,
    defaultValues,
    disabled = false,
    maxLength,
    multiple = true,
    onChange,
    onDelete,
    onError,
    onMultiUpload,
    onUpload,
    onUploadSuccess,
    parallel = false,
    style,
  } = props;
  const [uploadPictureImageLoaders, setUploadPictureImageLoader] = useState<ImageUploader[]>(
    defaultValues ? compact(defaultValues).map((value) => new ImageUploader(undefined, value)) : [],
  );
  const [needUploadImageLoaders, setNeedUploadImageLoaders] = useState<ImageUploader[]>([]);
  const [needUploadImageLoaderSets, setNeedUploadImageLoaderSets] = useState<ImageUploader[][]>([]);
  const [values, setValues] = useState<string[]>(compact(defaultValues) || []);
  const loaderList = useMemo(() => uploadPictureImageLoaders, [uploadPictureImageLoaders]);

  const prevNeedUploadImageLoadersLength = usePreviousValue(needUploadImageLoaders.length);
  const prevNeedUploadImageLoaderSetsLength = usePreviousValue(needUploadImageLoaderSets.length);
  const prevValues = usePreviousValue(values);

  useEffect(() => {
    if (onChange && !isEqual(prevValues, values)) {
      onChange(values);
    }
  }, [onChange, prevValues, values]);

  useEffect(() => {
    if (prevNeedUploadImageLoadersLength > needUploadImageLoaders.length
      || prevNeedUploadImageLoaderSetsLength > needUploadImageLoaderSets.length
    ) {
      setValues(compact(uploadPictureImageLoaders.map((loader) => loader.getUrl())));
    }
  }, [
    uploadPictureImageLoaders,
    needUploadImageLoaders,
    prevNeedUploadImageLoadersLength,
    needUploadImageLoaderSets,
    prevNeedUploadImageLoaderSetsLength,
  ]);

  useEffect(() => {
    if (needUploadImageLoaderSets.length && onUpload) {
      const imageLoaderSet = needUploadImageLoaderSets[0];

      if (!imageLoaderSet[0].getIsLoading()) {
        imageLoaderSet.forEach((imageLoader: ImageUploader, index) => {
          const setProgress = (progress: number) => imageLoader.setPercentage(progress);

          imageLoader.setLoadingStatus(true);

          onUpload(imageLoader.getFile() as File, setProgress)
            .then((url: string) => {
              imageLoader.setUrl(url);
              imageLoader.setLoadingStatus(false);
              setProgress(100);

              if (onUploadSuccess) {
                onUploadSuccess(imageLoader.getFile() as File, url as string);
              }

              if (index === imageLoaderSet.length - 1) {
                setNeedUploadImageLoaderSets((nup) => drop(nup));
              }
            })
            .catch(() => {
              imageLoader.setErrorStatus(true);
              imageLoader.setLoadingStatus(false);
              setProgress(100);

              if (index === imageLoaderSet.length - 1) {
                setNeedUploadImageLoaderSets((nup) => drop(nup));
              }

              if (onError) {
                onError(imageLoader.getFile() as File);
              }
            });
        });
      }
    }
  }, [needUploadImageLoaderSets, onError, onUpload, onUploadSuccess]);

  useEffect(() => {
    if (needUploadImageLoaders.length && onUpload) {
      const imageLoader = needUploadImageLoaders[0];

      if (imageLoader && imageLoader.getFile() && !imageLoader.getIsLoading()) {
        const setProgress = (progress: number) => imageLoader.setPercentage(progress);

        imageLoader.setLoadingStatus(true);

        onUpload(imageLoader.getFile() as File, setProgress)
          .then((url: string) => {
            imageLoader.setUrl(url);
            imageLoader.setLoadingStatus(false);
            setProgress(100);
            setNeedUploadImageLoaders((nup) => drop(nup));

            if (onUploadSuccess) {
              onUploadSuccess(imageLoader.getFile() as File, url as string);
            }
          })
          .catch(() => {
            imageLoader.setErrorStatus(true);
            imageLoader.setLoadingStatus(false);
            setProgress(100);
            setNeedUploadImageLoaders((nup) => drop(nup));

            if (onError) {
              onError(imageLoader.getFile() as File);
            }
          });
      }
    }
  }, [needUploadImageLoaders, onError, onUpload, onUploadSuccess]);

  const onImagesUpload = useCallback(
    (files) => {
      if (files.length) {
        const imageLoaders = files
          .map((file: File) => new ImageUploader(file))
          .slice(0, Math.max(0, (maxLength ?? 999999) - loaderList.length));

        setUploadPictureImageLoader((ups) => [...ups, ...imageLoaders]);

        if (onMultiUpload) {
          const uploadFiles = imageLoaders.map((loader: ImageUploader) => loader.getFile());

          const setProgress = (progress: number) => imageLoaders.forEach(
            (loader: ImageUploader) => loader.setPercentage(progress),
          );

          imageLoaders.forEach((loader: ImageUploader) => loader.setLoadingStatus(true));

          onMultiUpload(uploadFiles, setProgress)
            .then((urls: string[]) => {
              imageLoaders.forEach((loader: ImageUploader, index: number) => loader.setUrl(urls[index]));
              imageLoaders.forEach((loader: ImageUploader) => loader.setLoadingStatus(false));
              setProgress(100);
              setValues((v) => [...v, ...urls]);

              if (onUploadSuccess) {
                onUploadSuccess(uploadFiles as File[], urls as string[]);
              }
            })
            .catch(() => {
              imageLoaders.forEach((loader: ImageUploader) => loader.setErrorStatus(true));
              imageLoaders.forEach((loader: ImageUploader) => loader.setLoadingStatus(false));
              setProgress(100);

              if (onError) {
                onError(uploadFiles as File[]);
              }
            });

          return;
        }

        if (onUpload) {
          if (!parallel) {
            setNeedUploadImageLoaders((nups) => [...nups, ...imageLoaders]);
          } else {
            setNeedUploadImageLoaderSets((set) => [...set, imageLoaders]);
          }
        }
      }
    },
    [onError, onMultiUpload, onUpload, onUploadSuccess, parallel, maxLength, loaderList],
  );

  const onImageDelete = useCallback((uid: string) => {
    setUploadPictureImageLoader((ups) => ups.filter((up) => up.getUid() !== uid));
    setNeedUploadImageLoaders((nUps) => nUps.filter((nUp) => nUp.getUid() !== uid));

    const nowUploadPictureImageLoaders = uploadPictureImageLoaders.filter((up) => up.getUid() !== uid);
    const urls = compact(nowUploadPictureImageLoaders.map((loader) => loader.getUrl()));

    setValues(urls);

    if (onDelete) {
      onDelete(urls);
    }
  }, [onDelete, uploadPictureImageLoaders]);

  useImperativeHandle(controllerRef, () => ({
    getAllData: () => uploadPictureImageLoaders.map((loader: ImageUploader) => loader.getAll()),
  }));

  return (
    <div
      ref={ref}
      className={cx(
        classes.host,
        className,
      )}
      style={style}
    >
      {loaderList.map((up: ImageUploader) => (
        <UploadPictureWallItem
          key={up.getUid()}
          accept={accept}
          disabled={disabled}
          imageLoader={up}
          multiple={multiple}
          onDelete={() => onImageDelete(up.getUid())}
        />
      ))}
      {maxLength && loaderList.length >= maxLength ? null : (
        <UploadPictureWallItem
          accept={accept}
          disabled={disabled}
          imageLoader={new ImageUploader()}
          multiple={multiple}
          onUpload={onImagesUpload}
        />
      )}
    </div>
  );
});

export default UploadPictureWall;
