import { Renderer2, RendererStyleFlags2 } from '@angular/core';

export function setElementCssVars(
  element: Element,
  renderer: Renderer2,
  style: Record<string, any>,
) {
  // eslint-disable-next-line guard-for-in
  for (const key in style) {
    const value = style[key];

    if (value != null) {
      renderer.setStyle(element, key, value, RendererStyleFlags2.DashCase);
    } else {
      renderer.removeStyle(element, key, RendererStyleFlags2.DashCase);
    }
  }
}
