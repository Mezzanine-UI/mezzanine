/* eslint-disable @typescript-eslint/no-namespace */
import * as R from 'react';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends globalThis.JSX.IntrinsicElements {}
    }
  }
}

export type NativeElementTag = keyof R.JSX.IntrinsicElements;
export type NativeElementPropsWithoutKeyAndRef<T extends NativeElementTag> =
  Omit<R.JSX.IntrinsicElements[T], 'key' | 'ref'>;
export type NativeElement<T extends NativeElementTag> =
  R.JSX.IntrinsicElements[T] extends R.DetailedHTMLProps<infer _A, infer E>
    ? E
    : R.JSX.IntrinsicElements[T] extends R.SVGProps<infer E>
      ? E
      : unknown;

export type ComponentPropsWithoutKeyAndRef<T extends R.ElementType>
  = Omit<R.ComponentPropsWithoutRef<T>, 'key'>;

export type ComponentOverridableForwardRefComponentPropsFactory<
  VC extends NativeElementTag | R.JSXElementConstructor<any>,
  C extends VC,
  P,
> = Omit<Omit<ComponentPropsWithoutKeyAndRef<C>, keyof P> & P, 'component'> & {
  /**
   * Override the component used to render.
   */
  component?: VC;
};
