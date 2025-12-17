export type MotionEasingType = 'entrance' | 'exit' | 'standard';

export const MOTION_EASING: Readonly<Record<MotionEasingType, string>> = {
  entrance: 'cubic-bezier(0, 0, 0.58, 1)',
  exit: 'cubic-bezier(0.42, 0, 1, 1)',
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
};
