/**
 * 動態緩動曲線類型。
 *
 * - `'entrance'` — 進場緩動（ease-out），元素出現時使用
 * - `'exit'` — 離場緩動（ease-in），元素消失時使用
 * - `'standard'` — 標準緩動（ease-in-out），適用於位移或狀態切換
 */
export type MotionEasingType = 'entrance' | 'exit' | 'standard';

export const MOTION_EASING: Readonly<Record<MotionEasingType, string>> = {
  entrance: 'cubic-bezier(0, 0, 0.58, 1)',
  exit: 'cubic-bezier(0.42, 0, 1, 1)',
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
};
