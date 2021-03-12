export type MotionDurationType =
  | 'shortest'
  | 'shorter'
  | 'short'
  | 'standard'
  | 'long';

export const MOTION_DURATION: Readonly<Record<MotionDurationType, number>> = {
  shortest: 150,
  shorter: 200,
  short: 250,
  standard: 300,
  long: 375,
};
