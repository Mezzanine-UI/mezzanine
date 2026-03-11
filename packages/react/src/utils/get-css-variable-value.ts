export function getCSSVariableValue(variableName: string): string {
  return typeof document !== 'undefined'
    ? getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim()
    : '';
}

export function getNumericCSSVariablePixelValue(variableName: string): number {
  return Number(getCSSVariableValue(variableName).replace('rem', '')) * 16;
}

/**
 * Resolves a CSS custom property value, following `var()` references recursively,
 * and returns the computed pixel value.
 */
export function resolveNumericCSSVariable(variableName: string): number {
  const value = getCSSVariableValue(variableName);

  if (value.startsWith('var(')) {
    return resolveNumericCSSVariable(value.slice(4, -1).trim());
  }

  return Number(value.replace('rem', '')) * 16;
}
