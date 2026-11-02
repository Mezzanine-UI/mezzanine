import { type AriaAttributes, type AriaRole } from 'react';

export type AriaForwardProps = AriaAttributes & { role?: AriaRole };

function isAriaForwardKey(key: string): boolean {
  return key === 'role' || key.startsWith('aria-');
}

/**
 * Split a props object into `[aria-* / role props, remaining props]`, so a
 * wrapper component can forward accessibility props to the element that
 * actually receives focus (e.g. the native `<input>` inside a TextField).
 * Undefined aria values are dropped. The source object is not mutated.
 */
export function splitAriaProps<T extends object>(
  props: T,
): [AriaForwardProps, Omit<T, keyof AriaForwardProps>] {
  const entries = Object.entries(props);

  const aria = Object.fromEntries(
    entries.filter(
      ([key, value]) => isAriaForwardKey(key) && value !== undefined,
    ),
  ) as AriaForwardProps;
  const remaining = Object.fromEntries(
    entries.filter(([key]) => !isAriaForwardKey(key)),
  ) as Omit<T, keyof AriaForwardProps>;

  return [aria, remaining];
}

/**
 * Pick `aria-*` attributes and `role` from a props object.
 * @see splitAriaProps
 */
export function pickAriaProps(props: object): AriaForwardProps {
  return splitAriaProps(props)[0];
}
