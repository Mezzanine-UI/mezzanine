import { UploadResultSize } from './typings';
import { uploadResultPrefix } from './constants';

export const uploadResultClasses = {
  host: uploadResultPrefix,
  size: (size: UploadResultSize) => `${uploadResultPrefix}--${size}`,
  error: `${uploadResultPrefix}--error`,
  loading: `${uploadResultPrefix}--loading`,
  name: `${uploadResultPrefix}__name`,
  actions: `${uploadResultPrefix}__actions`,
};
