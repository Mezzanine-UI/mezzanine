import {
  ComponentPropsWithoutRef,
  DetailedHTMLProps,
  ElementType,
  JSXElementConstructor,
  SVGProps,
} from 'react';

export type NativeElementTag = keyof JSX.IntrinsicElements;
export type NativeElementPropsWithoutKeyAndRef<T extends NativeElementTag> =
  Omit<JSX.IntrinsicElements[T], 'key' | 'ref'>;
export type NativeElement<T extends NativeElementTag> =
  JSX.IntrinsicElements[T] extends DetailedHTMLProps<infer _A, infer E>
    ? E
    : JSX.IntrinsicElements[T] extends SVGProps<infer E>
      ? E
      : unknown;

export type ComponentPropsWithoutKeyAndRef<T extends ElementType> = Omit<ComponentPropsWithoutRef<T>, 'key'>;

export type ComponentOverridableForwardRefComponentPropsFactory<
  VC extends NativeElementTag | JSXElementConstructor<any>,
  C extends VC,
  P,
> = Omit<Omit<ComponentPropsWithoutKeyAndRef<C>, keyof P> & P, 'component'> & {
  /**
   * Override the component used to render.
   */
  component?: VC;
};
