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
