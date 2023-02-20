export function lockBodyScroll() {
  const {
    scrollY,
  } = window;

  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.overflow = 'hidden';
  /** @NOTE workaround for layout breaking (need refactor) */
  document.body.style.width = '100vw';
}

export function allowBodyScroll() {
  const scrollY = Number((document.body.style?.top ?? '0').replace(/px/gi, ''));

  if (document.body.style.position === 'fixed') {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.overflow = '';
    window.scrollTo(0, (scrollY || 0) * -1);
  }
}
