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

/**
 * Parse `var(--token, fallback)` and return token + fallback.
 * Supports nested parentheses in fallback.
 */
function parseCSSVarFunction(
  value: string,
): { fallback?: string; name: string } | null {
  const trimmed = value.trim();

  if (!trimmed.startsWith('var(') || !trimmed.endsWith(')')) {
    return null;
  }

  const inner = trimmed.slice(4, -1).trim();

  if (!inner) {
    return null;
  }

  let depth = 0;
  let commaIndex = -1;

  for (let i = 0; i < inner.length; i += 1) {
    const char = inner[i];

    if (char === '(') {
      depth += 1;
    } else if (char === ')') {
      depth -= 1;
    } else if (char === ',' && depth === 0) {
      commaIndex = i;
      break;
    }
  }

  if (commaIndex === -1) {
    return { name: inner };
  }

  const name = inner.slice(0, commaIndex).trim();
  const fallback = inner.slice(commaIndex + 1).trim();

  return { fallback: fallback || undefined, name };
}

export function getNumericCSSVariablePixelValue(variableName: string): number {
  return parseNumericCSSValue(getCSSVariableValue(variableName)) ?? 0;
}

/**
 * Resolves a CSS custom property value, following `var()` references recursively,
 * and returns the computed pixel value.
 */
function resolveNumericCSSVariableInternal(
  source: string,
  visited: Set<string>,
  depth: number,
): number | null {
  const MAX_DEPTH = 16;

  if (depth > MAX_DEPTH) {
    return null;
  }

  const parsedVar = parseCSSVarFunction(source);

  if (!parsedVar) {
    return parseNumericCSSValue(source);
  }

  if (visited.has(parsedVar.name)) {
    return parsedVar.fallback
      ? resolveNumericCSSVariableInternal(
          parsedVar.fallback,
          visited,
          depth + 1,
        )
      : null;
  }

  visited.add(parsedVar.name);

  const raw = getCSSVariableValue(parsedVar.name);
  const resolved = raw
    ? resolveNumericCSSVariableInternal(raw, visited, depth + 1)
    : null;

  visited.delete(parsedVar.name);

  if (resolved !== null) {
    return resolved;
  }

  return parsedVar.fallback
    ? resolveNumericCSSVariableInternal(parsedVar.fallback, visited, depth + 1)
    : null;
}

export function resolveNumericCSSVariable(variableName: string): number {
  const raw = getCSSVariableValue(variableName);

  return raw
    ? (resolveNumericCSSVariableInternal(raw, new Set<string>(), 0) ?? 0)
    : 0;
}
