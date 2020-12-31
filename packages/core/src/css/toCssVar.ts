export function toCssVar(varname: string, fallback?: string) {
  return `var(--${varname}${fallback ? `, ${fallback}` : ''})`;
}
