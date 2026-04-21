export function getScrollbarWidth(): number {
  if (typeof window === 'undefined') return 0;

  if (document.documentElement.scrollHeight <= window.innerHeight) {
    return 0;
  }

  const container = document.createElement('div');

  document.body.appendChild(container);

  container.style.overflow = 'scroll';
  container.style.width = '100px';
  container.style.height = '100px';

  const inner = document.createElement('div');

  inner.style.width = '100%';
  inner.style.height = '100%';
  container.appendChild(inner);

  const scrollbarWidth = container.offsetWidth - inner.offsetWidth;

  document.body.removeChild(container);

  return scrollbarWidth;
}
