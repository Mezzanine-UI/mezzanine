export function lockBodyScroll() {
  const {
    scrollY,
  } = window;

  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.overflow = 'hidden';
}

export function allowBodyScroll() {
  const scrollY = Number(document.body.style.top);

  if (document.body.style.position === 'fixed') {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.overflow = '';
    window.scrollTo(0, (scrollY || 0) * -1);
  }
}