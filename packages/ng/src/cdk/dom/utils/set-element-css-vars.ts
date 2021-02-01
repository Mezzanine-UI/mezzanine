import { Renderer2, RendererStyleFlags2 } from '@angular/core';
import { CssVarInterpolations } from '@mezzanine-ui/core/css';

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
