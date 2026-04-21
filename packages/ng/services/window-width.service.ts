import { DestroyRef, Injectable, signal } from '@angular/core';

/**
 * Tracks the current window width reactively.
 *
 * Initializes with `window.innerWidth` and updates on `resize` events.
 * Automatically cleans up the listener when the injecting context is destroyed.
 */
@Injectable({ providedIn: 'root' })
export class WindowWidthService {
  readonly width = signal<number | undefined>(
    typeof window !== 'undefined' ? window.innerWidth : undefined,
  );

  private listening = false;

  /**
   * Starts listening for window resize events.
   * Call this from a component or directive injection context so `DestroyRef` is available.
   */
  startListening(destroyRef?: DestroyRef): void {
    if (this.listening) return;

    this.listening = true;

    const handler = (): void => {
      this.width.set(window.innerWidth);
    };

    window.addEventListener('resize', handler);

    const cleanup = (): void => {
      window.removeEventListener('resize', handler);
      this.listening = false;
    };

    if (destroyRef) {
      destroyRef.onDestroy(cleanup);
    }
  }
}
