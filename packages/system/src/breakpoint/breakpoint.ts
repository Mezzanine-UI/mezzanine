export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export const breakpoints: Record<Breakpoint, number> = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};
