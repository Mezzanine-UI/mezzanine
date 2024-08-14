export function getScrollbarWidth(): number {
  if (typeof window === 'undefined') return 0;

  if (document.documentElement.scrollHeight <= window.innerHeight) {
    return 0;
  }

  // Create a temporary div container and append it into the body
  const container = document.createElement('div');

  // Append the element into the body
  document.body.appendChild(container);

  // Force scrollbar on the temporary div element
  container.style.overflow = 'scroll';
  container.style.width = '100px';
  container.style.height = '100px';

  // Add a fake inner element to get the scrollbar width
  const inner = document.createElement('div');

  inner.style.width = '100%';
  inner.style.height = '100%';
  container.appendChild(inner);

  // Calculate the width based on the container width minus its child width
  const scrollbarWidth = container.offsetWidth - inner.offsetWidth;

  // Remove the temporary elements from the DOM
  document.body.removeChild(container);

  return scrollbarWidth;
}
