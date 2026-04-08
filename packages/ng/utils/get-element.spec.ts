import { ElementRef } from '@angular/core';
import { getElement } from './get-element';

describe('getElement', () => {
  it('should return null when given undefined', () => {
    expect(getElement(undefined)).toBeNull();
  });

  it('should return null when given null', () => {
    expect(getElement(null)).toBeNull();
  });

  it('should return the element when given an HTMLElement', () => {
    const el = document.createElement('div');

    expect(getElement(el)).toBe(el);
  });

  it('should call the function and return the result when given a function', () => {
    const el = document.createElement('div');
    const getter = (): HTMLElement => el;

    expect(getElement(getter)).toBe(el);
  });

  it('should return nativeElement when given an ElementRef', () => {
    const el = document.createElement('div');
    const ref = new ElementRef(el);

    expect(getElement(ref)).toBe(el);
  });
});
