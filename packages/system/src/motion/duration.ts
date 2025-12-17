export type MotionDurationType =
  | 'fast'
  | 'moderate'
  | 'slow'
  | 'loop'
  | 'pauseShort'
  | 'pauseLong';

export const MOTION_DURATION: Readonly<Record<MotionDurationType, number>> = {
  fast: 150,
  moderate: 250,
  slow: 400,
  loop: 1600,
  pauseShort: 3000,
  pauseLong: 10000,
};
