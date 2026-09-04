import type { NotifierKey } from '../notifier/notifier.types';

interface MessageTimer {
  pause: () => void;
  resume: () => void;
}

/**
 * Pauses and resumes every message at once.
 *
 * A message pauses its own timer while the pointer is over it, but the pointer
 * covers one message and hides none of the others — so the whole stack pauses
 * together, which is what keeps a queue readable.
 */
class MessageTimerController {
  private isPaused = false;

  private timers = new Map<NotifierKey, MessageTimer>();

  pause(): void {
    if (this.isPaused) return;

    this.isPaused = true;
    this.timers.forEach((timer) => timer.pause());
  }

  register(key: NotifierKey, callbacks: MessageTimer): void {
    this.timers.set(key, callbacks);
  }

  resume(): void {
    if (!this.isPaused) return;

    this.isPaused = false;
    this.timers.forEach((timer) => timer.resume());
  }

  unregister(key: NotifierKey): void {
    this.timers.delete(key);
  }
}

export const messageTimerController = new MessageTimerController();
