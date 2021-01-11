export function setElementCssVars(
  element: HTMLElement,
  style: Record<string, any>,
) {
  // eslint-disable-next-line guard-for-in
  for (const key in style) {
    const value = style[key];

    if (value != null) {
      element.style.setProperty(key, value);
    } else {
      element.style.removeProperty(key);
    }
  }
}
