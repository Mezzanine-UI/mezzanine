import { CssVarInterpolations } from '@mezzanine-ui/core/css';
import { ElementRef, Renderer2, RendererStyleFlags2 } from '@angular/core';

export function setElementCssVars(
  element: Element,
  renderer: Renderer2,
  vars: CssVarInterpolations,
) {
  // eslint-disable-next-line guard-for-in
  for (const key in vars) {
    const value = vars[key];

    if (value != null) {
      renderer.setStyle(element, key, value, RendererStyleFlags2.DashCase);
    } else {
      renderer.removeStyle(element, key, RendererStyleFlags2.DashCase);
    }
  }
}

export class CssVarsRef {
  private _value: CssVarInterpolations = {};

  constructor(
    private readonly elementRef: ElementRef<Element>,
    private readonly renderer: Renderer2,
  ) { }

  set value(value: CssVarInterpolations) {
    this.setCssVars(value);
    this._value = value;
  }

  private setCssVars(value: CssVarInterpolations) {
    setElementCssVars(
      this.elementRef.nativeElement,
      this.renderer,
      this.resolveValue(value),
    );
  }

  private resolveValue(value: CssVarInterpolations): CssVarInterpolations {
    const mergedValue = {
      ...this._value,
      ...value,
    };

    // eslint-disable-next-line guard-for-in
    for (const key in mergedValue) {
      if (!(key in value)) {
        mergedValue[key] = null;
      }
    }

    return mergedValue;
  }
}
