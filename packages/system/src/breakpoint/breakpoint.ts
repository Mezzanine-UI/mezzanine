export type Breakpoints = 'small' | 'medium' | 'large' | 'extraLarge' | 'extraExtraLarge';

export type BreakpointsObject = {
  [k in Breakpoints]: number;
};

export const breakpoints: BreakpointsObject = {
  small: 576,
  medium: 768,
  large: 992,
  extraLarge: 1200,
  extraExtraLarge: 1400,
};

export function getBreakpoint(name: Breakpoints) {
  return breakpoints[name];
}
