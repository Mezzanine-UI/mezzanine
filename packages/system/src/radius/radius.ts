import { radiusPrefix } from './constants';

export type RadiusSize = 'none' | 'tiny' | 'base' | 'roomy' | 'full';

export interface RadiusConfig {
  none?: string | number;
  tiny?: string | number;
  base?: string | number;
  roomy?: string | number;
  full?: string | number;
}

export const defaultRadius: Required<RadiusConfig> = {
  none: 0,
  tiny: '0.125rem', // 2px
  base: '0.25rem', // 4px
  roomy: '0.5rem', // 8px
  full: '62.4375rem', // 999px
};

export const radiusSizes: readonly RadiusSize[] = [
  'none',
  'tiny',
  'base',
  'roomy',
  'full',
] as const;

export function isValidRadiusSize(size: string): size is RadiusSize {
  return radiusSizes.includes(size as RadiusSize);
}

export function getRadiusVarName(
  size: RadiusSize,
  prefix = radiusPrefix,
): string {
  return prefix ? `--${prefix}-${size}` : `--${size}`;
}

/**
 * Get CSS variable reference for radius
 * @example
 * getRadiusVar('base') // 'var(--mzn-radius-base)'
 */
export function getRadiusVar(size: RadiusSize, prefix = radiusPrefix): string {
  return `var(${getRadiusVarName(size, prefix)})`;
}
