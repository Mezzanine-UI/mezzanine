import { ReactElement, Ref } from 'react';

/**
 * Helper type to extract ref from a ReactElement.
 * Models `ref` on the element itself, which is compatible with React 18 and 19.
 */
export type ReactElementWithRef<
  P,
  E extends Element = HTMLElement,
> = ReactElement<P> & {
  ref?: Ref<E>;
};

/**
 * Whether the given property getter is a React dev-mode warning getter.
 * React marks them with `isReactWarning = true`
 * (see `defineRefPropWarningGetter` in the React source).
 */
function isReactWarningGetter(getter: unknown): boolean {
  return (
    typeof getter === 'function' &&
    Boolean((getter as { isReactWarning?: boolean }).isReactWarning)
  );
}

/**
 * Extracts ref from a ReactElement, supporting both React 18 and 19.
 * In React 18, ref is on the element itself; in React 19, ref is in props.
 *
 * Reading the "wrong" location in dev mode triggers React warning getters:
 *
 * - React 18 installs a warning getter on `props.ref` when the element was
 *   created with a ref — accessing it logs
 *   "`ref` is not a prop. Trying to access it will result in `undefined` being returned."
 * - React 19 installs a deprecation getter on `element.ref` when the element
 *   was created with a ref — accessing it logs
 *   "Accessing element.ref was removed in React 19."
 *
 * So instead of unconditionally reading `props.ref` first, detect the
 * dev-mode warning getters (marked with `isReactWarning`) and read the ref
 * from the location where it actually lives. Same approach as
 * `getElementRef` in radix-ui/primitives.
 */
export function getElementRef<E extends Element = HTMLElement>(
  element: ReactElementWithRef<unknown, E>,
): Ref<E> | undefined {
  const props = element.props as { ref?: Ref<E> } | null | undefined;

  // React 18 dev mode: `props.ref` is a warning getter; the actual ref
  // lives on the element itself.
  const propsRefGetter = props
    ? Object.getOwnPropertyDescriptor(props, 'ref')?.get
    : undefined;

  if (isReactWarningGetter(propsRefGetter)) {
    return element.ref;
  }

  // React 19 dev mode: `element.ref` may be a deprecation warning getter;
  // the actual ref lives in props as a regular property.
  const elementRefGetter = Object.getOwnPropertyDescriptor(element, 'ref')?.get;

  if (isReactWarningGetter(elementRefGetter)) {
    return props?.ref;
  }

  // No warning getters (production builds, or no ref was given):
  // prefer `props.ref` (React 19), fall back to `element.ref` (React 18).
  // Safe on React 19 dev — its `element.ref` deprecation getter is only
  // installed when a ref exists, in which case `props.ref` is returned here.
  return props?.ref ?? element.ref;
}
