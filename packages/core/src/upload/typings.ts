import { MznSize } from '../size';

export type UploadResultSize = MznSize;
export type UploadResultStatus = 'done' | 'error' | 'loading';

export interface UploadResultCssVars {
  percentage?: number;
}
