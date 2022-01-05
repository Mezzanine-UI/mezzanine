import { CssVarInterpolations } from '@mezzanine-ui/system/css';
import EventEmitter from 'events';
import uniqueId from 'lodash/uniqueId';

export const uploadPictureBlockPrefix = 'mzn-upload-picture-block';
export interface UploadPictureBlockCssVars {
  percentage?: number;
}

export const uploadPictureBlockClasses = {
  host: uploadPictureBlockPrefix,
  disabled: `${uploadPictureBlockPrefix}--disabled`,
  error: `${uploadPictureBlockPrefix}--error`,
  loading: `${uploadPictureBlockPrefix}--loading`,
  group: `${uploadPictureBlockPrefix}__group`,
  status: `${uploadPictureBlockPrefix}__status`,
  preview: `${uploadPictureBlockPrefix}__preview`,
  delete: `${uploadPictureBlockPrefix}__delete`,
};

export function toUploadPictureBlockCssVars(variables: UploadPictureBlockCssVars): CssVarInterpolations {
  const {
    percentage,
  } = variables;

  return {
    [`--${uploadPictureBlockPrefix}-percentage`]: percentage,
  };
}

export class ImageUploader extends EventEmitter {
  uid: string;

  file: File | null;

  percentage: number;

  preview: string;

  url: string;

  isLoading: boolean;

  isError: boolean;

  constructor(file?: File, url?: string) {
    super();

    this.uid = uniqueId('file_');
    this.file = file || null;
    this.percentage = 0;
    this.preview = '';
    this.url = url || '';
    this.isLoading = false;
    this.isError = false;
  }

  setNewFile(file: File) {
    this.uid = uniqueId('file_');
    this.file = file;
    this.percentage = 0;
    this.preview = '';
    this.url = '';
    this.isLoading = false;
    this.isError = false;

    this.emit('fileChange');
  }

  setPreview() {
    if (this.file) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        this.preview = reader.result as string;
        this.emit('previewChange');
      });
      reader.readAsDataURL(this.file);
    }
  }

  setPercentage(percentage: number) {
    this.percentage = percentage;
    this.emit('percentageChange');
  }

  setUrl(url: string) {
    this.url = url;
    this.emit('urlChange');
  }

  setLoadingStatus(isLoading: boolean) {
    this.isLoading = isLoading;
    this.emit('loadingStatusChange');
  }

  setErrorStatus(isError: boolean) {
    this.isError = isError;
    this.emit('errorStatusChange');
  }

  clear() {
    this.file = null;
    this.percentage = 0;
    this.preview = '';
    this.url = '';
    this.isLoading = false;
    this.isError = false;
    this.emit('clear');
  }

  getUid() {
    return this.uid;
  }

  getFile() {
    return this.file;
  }

  getPercentage() {
    return this.percentage;
  }

  getPreview() {
    return this.preview;
  }

  getUrl() {
    return this.url;
  }

  getIsLoading() {
    return this.isLoading;
  }

  getIsError() {
    return this.isError;
  }

  getAll() {
    return {
      uid: this.uid,
      file: this.file,
      percentage: this.percentage,
      preview: this.preview,
      url: this.url,
      isLoading: this.isLoading,
      isError: this.isError,
    };
  }
}
