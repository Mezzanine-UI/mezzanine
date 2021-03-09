import { DetailedHTMLProps, SVGProps } from 'react';

export type NativeElementTag = keyof JSX.IntrinsicElements;
export type NativeElementPropsWithoutKeyAndRef<T extends NativeElementTag> =
  Omit<JSX.IntrinsicElements[T], 'key' | 'ref'>;
export type NativeElement<T extends NativeElementTag> =
  JSX.IntrinsicElements[T] extends DetailedHTMLProps<infer _A, infer E>
    ? E
    : JSX.IntrinsicElements[T] extends SVGProps<infer E>
      ? E
      : unknown;
