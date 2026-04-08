import { Injectable } from '@angular/core';

export interface TopStackEntry {
  /** Returns `true` if this entry is currently at the top of the stack. */
  readonly isTop: () => boolean;
  /** Removes this entry from the stack. */
  readonly unregister: () => void;
}

/**
 * Manages z-index stacking order for multiple floating layers.
 *
 * Each caller registers with the service to obtain a unique stack entry.
 * Use `isTop()` to determine if the entry is the topmost layer (e.g., to
 * decide whether the Escape key should close this layer).
 */
@Injectable({ providedIn: 'root' })
export class TopStackService {
  private seedStack: readonly number[] = [];
  private nextSeed = 1;

  /**
   * Pushes a new entry onto the stack.
   *
   * @returns An object with `isTop()` to check position and `unregister()` to remove.
   */
  register(): TopStackEntry {
    this.nextSeed += 1;
    const seed = this.nextSeed;

    this.seedStack = [...this.seedStack, seed];

    return {
      isTop: () => this.seedStack[this.seedStack.length - 1] === seed,
      unregister: () => {
        this.seedStack = this.seedStack.filter((s) => s !== seed);
      },
    };
  }
}
