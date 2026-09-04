export function getCSSVariableValue(variableName: string): string {
  return typeof document !== 'undefined'
    ? getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim()
    : '';
}

/**
 * Parse a numeric CSS value and return its pixel representation.
 * Supports `rem`, `px`, and unitless numbers.
 */
function parseNumericCSSValue(value: string): number | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.endsWith('rem')) {
    const numeric = Number(trimmed.slice(0, -3).trim());

    return Number.isFinite(numeric) ? numeric * 16 : null;
  }

  if (trimmed.endsWith('px')) {
    const numeric = Number(trimmed.slice(0, -2).trim());

    return Number.isFinite(numeric) ? numeric : null;
  }

  const numeric = Number(trimmed);

  return Number.isFinite(numeric) ? numeric : null;
}

export function getNumericCSSVariablePixelValue(variableName: string): number {
  return parseNumericCSSValue(getCSSVariableValue(variableName)) ?? 0;
}
