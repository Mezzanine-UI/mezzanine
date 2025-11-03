export function getCSSVariableValue(variableName: string): string {
  return typeof document !== 'undefined'
    ? getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim()
    : '';
}
