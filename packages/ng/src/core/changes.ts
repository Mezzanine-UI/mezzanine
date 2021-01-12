import { SimpleChange, SimpleChanges } from '@angular/core';

type ExcludeFunctionKeys<T> ={
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];

type ExcludeFunctions<T> = Pick<T, ExcludeFunctionKeys<T>>;

export type TypedSimpleChangePreviousValue<T> = T | undefined;

export type TypedSimpleChangeCurrentValue<T> = T | '';

export interface TypedSimpleChange<T> extends SimpleChange {
  previousValue: TypedSimpleChangePreviousValue<T>;
  currentValue: TypedSimpleChangeCurrentValue<T>;
}

export type TypedSimpleChanges<Component, Props = ExcludeFunctions<Component>> = {
  [Key in keyof Props]?: TypedSimpleChange<Props[Key]>;
} & SimpleChanges;
