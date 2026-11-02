import { Orientation } from '@mezzanine-ui/system/orientation';
import { buttonPrefix } from './button';

export type ButtonGroupOrientation = Orientation;

export const buttonGroupPrefix = `${buttonPrefix}-group` as const;

export const buttonGroupClasses = {
  host: buttonGroupPrefix,
  fullWidth: `${buttonGroupPrefix}--full-width`,
  orientation: (orientation: ButtonGroupOrientation) =>
    `${buttonGroupPrefix}--${orientation}`,
} as const;

/**
 * ARIA roles that support `aria-orientation`. A button group rendered with any
 * other role (e.g. the default `group`) must not emit the attribute.
 */
export const buttonGroupOrientationRoles: ReadonlySet<string> = new Set([
  'listbox',
  'menu',
  'menubar',
  'radiogroup',
  'tablist',
  'toolbar',
]);

/**
 * Resolve the `aria-orientation` value for a button group.
 * Returns `undefined` when the role does not support the attribute.
 */
export function getButtonGroupAriaOrientation(
  role: string | undefined,
  orientation: ButtonGroupOrientation,
): ButtonGroupOrientation | undefined {
  return role && buttonGroupOrientationRoles.has(role)
    ? orientation
    : undefined;
}
