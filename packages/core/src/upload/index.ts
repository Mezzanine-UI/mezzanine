export * from './upload';
export * from './uploader';
export * from './uploadItem';
export * from './uploadPictureCard';

/**
 * 上傳元件的顯示模式。
 * - `'list'` — 清單模式
 * - `'button-list'` — 按鈕清單模式
 * - `'cards'` — 卡片模式
 * - `'card-wall'` — 卡片牆模式
 */
export type UploadMode = 'list' | 'button-list' | 'cards' | 'card-wall';
