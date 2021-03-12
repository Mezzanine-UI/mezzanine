export type MotionEasingType =
  | 'standard'
  | 'emphasized'
  | 'decelerated'
  | 'accelerated';

export const MOTION_EASING: Readonly<Record<MotionEasingType, string>> = {
  standard: 'cubic-bezier(0.58, 0.01, 0.29, 1.01)',
  emphasized: 'cubic-bezier(0.83, 0, 0.17, 1)',
  decelerated: 'cubic-bezier(0, 0, 0.3, 1)',
  accelerated: 'cubic-bezier(0.32, 0, 0.67, 0)',
};
