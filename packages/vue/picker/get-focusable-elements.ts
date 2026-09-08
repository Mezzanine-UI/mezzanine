const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function isVisible(element: HTMLElement): boolean {
  if (element.hidden) return false;

  const style = element.ownerDocument?.defaultView?.getComputedStyle(element);

  if (!style) return true;

  return style.visibility !== 'hidden' && style.display !== 'none';
}

export function getFocusableElements(
  container: HTMLElement | null,
): HTMLElement[] {
  if (!container) return [];

  const nodes = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  const result: HTMLElement[] = [];

  for (const node of Array.from(nodes)) {
    if (node.getAttribute('aria-hidden') === 'true') continue;
    if (!isVisible(node)) continue;
    result.push(node);
  }

  return result;
}

export function getNextTabbableAfter(
  element: HTMLElement,
  skipContainer?: HTMLElement | null,
): HTMLElement | null {
  const doc = element.ownerDocument;
  const all = getFocusableElements(doc.body);

  for (const node of all) {
    if (node === element || element.contains(node)) continue;
    if (
      skipContainer &&
      (node === skipContainer || skipContainer.contains(node))
    )
      continue;
    const position = element.compareDocumentPosition(node);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
      return node;
    }
  }

  return null;
}

export function getPreviousTabbableBefore(
  element: HTMLElement,
): HTMLElement | null {
  const doc = element.ownerDocument;
  const all = getFocusableElements(doc.body);

  let previous: HTMLElement | null = null;

  for (const node of all) {
    if (node === element || element.contains(node)) continue;
    const position = element.compareDocumentPosition(node);
    if (position & Node.DOCUMENT_POSITION_PRECEDING) {
      previous = node;
    }
  }

  return previous;
}
