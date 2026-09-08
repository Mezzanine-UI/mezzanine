import { onMounted, onUnmounted, ref, type Ref } from 'vue';

/**
 * Track `window.location.hash`, mirroring React's `useHash`.
 *
 * The initial read happens during setup so the first render already reflects
 * the current hash, as React's lazy `useState` initialiser does.
 */
export function useHash(): Ref<string> {
  const hash = ref(typeof window !== 'undefined' ? window.location.hash : '');

  function handleHashChange(): void {
    hash.value = window.location.hash;
  }

  onMounted(() => window.addEventListener('hashchange', handleHashChange));
  onUnmounted(() => window.removeEventListener('hashchange', handleHashChange));

  return hash;
}
