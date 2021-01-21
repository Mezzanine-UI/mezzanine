import { ElementRef, Renderer2 } from '@angular/core';
import { CssVarInterpolations } from '@mezzanine-ui/core/css';
import { createChangeEffect } from '../changes';
import { setElementCssVars } from './set-element-css-vars';

export function createCssVarsChangeEffect(
  elementRef: ElementRef<Element>,
  renderer: Renderer2,
  getCssVars: () => CssVarInterpolations,
): VoidFunction {
  const effect = createChangeEffect<CssVarInterpolations>((current, prev = {}) => {
    const resolvedValue = {
      ...prev,
      ...current,
    };

    // eslint-disable-next-line guard-for-in
    for (const key in resolvedValue) {
      if (!(key in current)) {
        resolvedValue[key] = null;
      }
    }

    setElementCssVars(
      elementRef.nativeElement,
      renderer,
      resolvedValue,
    );
  });

  return () => effect(getCssVars());
}
