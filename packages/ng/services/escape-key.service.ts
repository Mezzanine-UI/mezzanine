import { DestroyRef, Injectable } from '@angular/core';

/**
 * Listens for Escape key presses on the document.
 *
 * When a `keydown` event fires with `event.key === 'Escape'`, the registered
 * handler is called and default behavior is prevented.
 */
@Injectable({ providedIn: 'root' })
export class EscapeKeyService {
  /**
   * Registers an Escape key listener on the document.
   * Automatically cleans up when the caller's `DestroyRef` fires.
   *
   * @returns A cleanup function to manually stop listening.
   */
  listen(
    handler: (event: KeyboardEvent) => void,
    destroyRef?: DestroyRef,
  ): () => void {
    const listener = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handler(event);
      }
    };

    document.addEventListener('keydown', listener);

    const cleanup = (): void => {
      document.removeEventListener('keydown', listener);
    };

    destroyRef?.onDestroy(cleanup);

    return cleanup;
  }
}
